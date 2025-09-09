import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { logPaymentOperation } from "@/lib/payment-utils";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    console.log("FlyCheckout callback received:", data);
    
    // Validate required fields
    if (!data.orderNumber || !data.status) {
      console.error("Invalid callback data, missing required fields");
      return NextResponse.json(
        { message: "Invalid callback data" },
        { status: 400 }
      );
    }
    
    // Find matching payment intent in our database
    const { data: paymentIntent, error: findError } = await supabase
      .from('payment_intents')
      .select('*')
      .eq('reference_no', data.orderNumber)
      .single();
    
    if (findError || !paymentIntent) {
      console.error("Payment intent not found for orderNumber:", data.orderNumber);
      
      // Log the error
      await logPaymentOperation({
        operation_type: 'FLYCHECKOUT_CALLBACK',
        reference_no: data.orderNumber,
        user_id: '00000000-0000-0000-0000-000000000000',
        details: { 
          callback_data: data,
          error: findError ? findError.message : 'Payment intent not found'
        },
        status: 'ERROR'
      });
      
      return NextResponse.json(
        { message: "Payment intent not found" },
        { status: 404 }
      );
    }
    
    // Log that we received the callback
    await logPaymentOperation({
      operation_type: 'FLYCHECKOUT_CALLBACK',
      reference_no: data.orderNumber,
      user_id: paymentIntent.user_id,
      details: { 
        callback_data: data,
        payment_status: data.status
      },
      status: 'RECEIVED'
    });
    
    // Handle different payment statuses
    if (data.status === "approved" || data.status === "success") {
      // Check if this payment is already completed to avoid duplicate processing
      if (paymentIntent.status === 'COMPLETED') {
        console.log("Payment already processed, skipping duplicate callback", data.orderNumber);
        
        await logPaymentOperation({
          operation_type: 'FLYCHECKOUT_CALLBACK',
          reference_no: data.orderNumber,
          user_id: paymentIntent.user_id,
          details: { 
            callback_data: data,
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
          transaction_id: data.transactionId || data.id,
          ipn_data: data,
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentIntent.id);
      
      if (updateError) {
        console.error("Error updating payment intent:", updateError);
        
        await logPaymentOperation({
          operation_type: 'FLYCHECKOUT_CALLBACK',
          reference_no: data.orderNumber,
          user_id: paymentIntent.user_id,
          details: { 
            callback_data: data,
            error: updateError.message
          },
          status: 'ERROR'
        });
        
        return NextResponse.json(
          { message: "Error updating payment record" },
          { status: 500 }
        );
      }
      
      // Log successful callback processing - credit loading will be handled by trigger
      await logPaymentOperation({
        operation_type: 'FLYCHECKOUT_CALLBACK',
        reference_no: data.orderNumber,
        user_id: paymentIntent.user_id,
        details: { 
          callback_data: data,
          credits_to_add: paymentIntent.credit_amount,
          note: 'Payment status updated via FlyCheckout callback, credits will be added by trigger'
        },
        status: 'COMPLETED'
      });
      
    } else if (data.status === "declined" || data.status === "failed") {
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
        operation_type: 'FLYCHECKOUT_CALLBACK',
        reference_no: data.orderNumber,
        user_id: paymentIntent.user_id,
        details: { callback_data: data },
        status: 'DECLINED'
      });
    }
    
    // Return 200 OK to acknowledge receipt of the callback
    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Error processing FlyCheckout callback:", error);
    
    // Try to log the error
    try {
      await logPaymentOperation({
        operation_type: 'FLYCHECKOUT_CALLBACK',
        reference_no: 'UNKNOWN',
        user_id: '00000000-0000-0000-0000-000000000000',
        details: { error: (error as Error).message },
        status: 'ERROR'
      });
    } catch (logError) {
      console.error("Failed to log callback error:", logError);
    }
    
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
} 