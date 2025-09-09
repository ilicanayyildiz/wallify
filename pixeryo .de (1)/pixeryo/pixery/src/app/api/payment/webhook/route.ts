import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { logPaymentOperation } from "@/lib/payment-utils";

// List of allowed IP addresses for Financial House IPN
const ALLOWED_IPS = [
  // Sandbox
  '54.217.102.135',
  '108.129.35.181',
  '52.48.248.88',
  '54.78.9.129',
  // Production
  '54.78.9.129',
  '63.35.98.151',
  '54.72.34.239'
];

export async function POST(request: NextRequest) {
  try {
    // Get client IP
    const forwardedFor = request.headers.get('x-forwarded-for');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : null;
    
    // Security check - verify IP is from Financial House
    // Comment out for development, enable for production
    if (!clientIp || !ALLOWED_IPS.includes(clientIp)) {
      console.warn(`Unauthorized IPN attempt from IP: ${clientIp}`);
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }
    
    const data = await request.json();
    
    console.log("Payment IPN received:", data);
    
    // Validate required fields
    if (!data.transactionId || !data.referenceNo || !data.status) {
      console.error("Invalid IPN data, missing required fields");
      return NextResponse.json(
        { message: "Invalid IPN data" },
        { status: 400 }
      );
    }
    
    // Find matching payment intent in our database
    const { data: paymentIntent, error: findError } = await supabase
      .from('payment_intents')
      .select('*')
      .eq('reference_no', data.referenceNo)
      .single();
    
    if (findError || !paymentIntent) {
      console.error("Payment intent not found for referenceNo:", data.referenceNo);
      
      // Log the error
      await logPaymentOperation({
        operation_type: 'WEBHOOK',
        reference_no: data.referenceNo,
        user_id: '00000000-0000-0000-0000-000000000000', // placeholder since we don't know the user
        details: { 
          webhook_data: data,
          error: findError ? findError.message : 'Payment intent not found'
        },
        status: 'ERROR'
      });
      
      return NextResponse.json(
        { message: "Payment intent not found" },
        { status: 404 }
      );
    }
    
    // Log that we received the webhook
    await logPaymentOperation({
      operation_type: 'WEBHOOK',
      reference_no: data.referenceNo,
      user_id: paymentIntent.user_id,
      details: { 
        webhook_data: data,
        payment_status: data.status
      },
      status: 'RECEIVED'
    });
    
    // Handle different payment statuses
    if (data.status === "APPROVED") {
      // Check if this payment is already completed to avoid duplicate processing
      if (paymentIntent.status === 'COMPLETED') {
        console.log("Payment already processed, skipping duplicate webhook", data.referenceNo);
        
        await logPaymentOperation({
          operation_type: 'WEBHOOK',
          reference_no: data.referenceNo,
          user_id: paymentIntent.user_id,
          details: { 
            webhook_data: data,
            duplicate: true,
            current_status: paymentIntent.status
          },
          status: 'SKIPPED'
        });
        
        return NextResponse.json({ status: "success", note: "Already processed" });
      }
      
      // Update payment intent status - this will trigger our credit loading trigger
      const { error: updateError } = await supabase
        .from('payment_intents')
        .update({
          status: 'COMPLETED',
          transaction_id: data.transactionId,
          ipn_data: data,
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentIntent.id);
      
      if (updateError) {
        console.error("Error updating payment intent:", updateError);
        
        await logPaymentOperation({
          operation_type: 'WEBHOOK',
          reference_no: data.referenceNo,
          user_id: paymentIntent.user_id,
          details: { 
            webhook_data: data,
            error: updateError.message
          },
          status: 'ERROR'
        });
        
        return NextResponse.json(
          { message: "Error updating payment record" },
          { status: 500 }
        );
      }
      
      // Log successful webhook processing - credit loading will be handled by trigger
      await logPaymentOperation({
        operation_type: 'WEBHOOK',
        reference_no: data.referenceNo,
        user_id: paymentIntent.user_id,
        details: { 
          webhook_data: data,
          credits_to_add: paymentIntent.credit_amount,
          note: 'Payment status updated, credits will be added by trigger'
        },
        status: 'COMPLETED'
      });
      
    } else if (data.status === "DECLINED") {
      // Update payment intent as failed
      await supabase
        .from('payment_intents')
        .update({
          status: 'FAILED',
          ipn_data: data,
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentIntent.id);
        
      // Log declined payment
      await logPaymentOperation({
        operation_type: 'WEBHOOK',
        reference_no: data.referenceNo,
        user_id: paymentIntent.user_id,
        details: { webhook_data: data },
        status: 'DECLINED'
      });
    }
    
    // Return 200 OK to acknowledge receipt of the IPN
    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Error processing payment webhook:", error);
    
    // Try to log the error
    try {
      await logPaymentOperation({
        operation_type: 'WEBHOOK',
        reference_no: 'UNKNOWN',
        user_id: '00000000-0000-0000-0000-000000000000',
        details: { error: (error as Error).message },
        status: 'ERROR'
      });
    } catch (logError) {
      console.error("Failed to log webhook error:", logError);
    }
    
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
} 