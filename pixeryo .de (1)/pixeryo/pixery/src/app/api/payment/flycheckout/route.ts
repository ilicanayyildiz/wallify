import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { logPaymentOperation } from "@/lib/payment-utils";

export async function POST(request: NextRequest) {
  try {
    console.log("Environment check:", {
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NODE_ENV: process.env.NODE_ENV
    });

    const {
      referenceNo,
      amount,
      credits,
      cardData,
      customerData
    } = await request.json();

    console.log("FlyCheckout payment request received:", {
      referenceNo,
      amount,
      credits,
      cardData: { ...cardData, pan: `****${cardData.pan.slice(-4)}`, cvv: "***" },
      customerData
    });

    // Validate required fields
    if (!referenceNo || !amount || !credits || !cardData || !customerData) {
      console.error("Missing required fields:", { referenceNo, amount, credits, cardData: !!cardData, customerData: !!customerData });
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find the payment intent
    console.log("Looking for payment intent with reference_no:", referenceNo);
    
    const { data: paymentIntent, error: findError } = await supabaseAdmin
      .from('payment_intents')
      .select('*')
      .eq('reference_no', referenceNo)
      .single();

    console.log("Payment intent query result:", {
      found: !!paymentIntent,
      error: findError,
      paymentIntent: paymentIntent ? {
        id: paymentIntent.id,
        reference_no: paymentIntent.reference_no,
        status: paymentIntent.status,
        user_id: paymentIntent.user_id,
        created_at: paymentIntent.created_at
      } : null
    });

    if (findError || !paymentIntent) {
      console.error("Payment intent not found:", { 
        referenceNo, 
        findError,
        searchAttempt: "Attempting exact match on reference_no"
      });
      
      // Try to find similar reference numbers for debugging
      const { data: similarPayments } = await supabaseAdmin
        .from('payment_intents')
        .select('reference_no, created_at')
        .order('created_at', { ascending: false })
        .limit(5);
        
      console.log("Recent payment intents for debugging:", similarPayments);
      
      await logPaymentOperation({
        operation_type: 'FLYCHECKOUT_PAYMENT',
        reference_no: referenceNo,
        user_id: '00000000-0000-0000-0000-000000000000',
        details: { 
          error: 'Payment intent not found',
          findError: findError?.message,
          recentPayments: similarPayments?.map(p => p.reference_no)
        },
        status: 'ERROR'
      });
      
      return NextResponse.json(
        { message: "Payment intent not found", referenceNo, error: findError?.message },
        { status: 404 }
      );
    }

    // Log payment attempt
    await logPaymentOperation({
      operation_type: 'FLYCHECKOUT_PAYMENT',
      reference_no: referenceNo,
      user_id: paymentIntent.user_id,
      details: { 
        amount,
        credits,
        card_last_four: cardData.pan.slice(-4)
      },
      status: 'INITIATED'
    });

    // Prepare FlyCheckout API request
    const flyCheckoutData = {
      product: "Stock Image Credits",
      amount: Math.round(amount * 100), // Convert to pence/cents
      currency: "GBP",
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/flycheckout/callback`,
      redirectSuccessUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?ref=${referenceNo}`,
      redirectFailUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/failed?ref=${referenceNo}`,
      orderNumber: referenceNo,
      card: {
        pan: cardData.pan,
        expires: cardData.expires, // Use MM/YYYY format as expected by API
        holder: cardData.holder,
        cvv: cardData.cvv
      },
      customer: {
        email: customerData.email,
        first_name: customerData.firstName,
        last_name: customerData.lastName,
        phone: "447399351890",
        city: "London",
        address: "80 Neal Street",
        state: "London",
        country: "UK",
        postcode: "WC2E 8DD",
        ip: "89.184.22.134"
      }
    };

    console.log("Sending request to FlyCheckout API:", {
      ...flyCheckoutData,
      card: { ...flyCheckoutData.card, pan: `****${cardData.pan.slice(-4)}`, cvv: "***" }
    });

    // Call FlyCheckout API
    const flyResponse = await fetch('https://business.flycheckout.com/api/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer f23a2f8dd38d5b78c3f2',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(flyCheckoutData),
    });

    const flyResult = await flyResponse.json();
    
    console.log("FlyCheckout API response:", {
      status: flyResponse.status,
      ok: flyResponse.ok,
      result: flyResult
    });

    // Handle different response scenarios
    if (flyResponse.ok && flyResult.success) {
      const paymentStatus = flyResult.payment?.status;
      
      if (paymentStatus === 'approved') {
        // Non-3D payment approved immediately
        await supabaseAdmin
          .from('payment_intents')
          .update({
            status: 'COMPLETED',
            transaction_id: flyResult.token || flyResult.id,
            updated_at: new Date().toISOString()
          })
          .eq('reference_no', referenceNo);

        // Log successful payment
        await logPaymentOperation({
          operation_type: 'FLYCHECKOUT_PAYMENT',
          reference_no: referenceNo,
          user_id: paymentIntent.user_id,
          details: { 
            ...flyResult,
            credits_added: credits,
            payment_type: 'non-3d'
          },
          status: 'COMPLETED'
        });

        return NextResponse.json({
          success: true,
          message: "Payment processed successfully",
          transactionId: flyResult.token || flyResult.id,
          paymentType: 'non-3d'
        });

      } else if (paymentStatus === 'init') {
        // 3D Secure required - redirect to processing page
        await supabaseAdmin
          .from('payment_intents')
          .update({
            status: 'PROCESSING', // Yeni status - 3D bekliyor
            transaction_id: flyResult.token,
            updated_at: new Date().toISOString()
          })
          .eq('reference_no', referenceNo);

        await logPaymentOperation({
          operation_type: 'FLYCHECKOUT_PAYMENT',
          reference_no: referenceNo,
          user_id: paymentIntent.user_id,
          details: { 
            ...flyResult,
            processing_url: flyResult.processingUrl,
            token: flyResult.token,
            payment_type: '3d-secure'
          },
          status: 'REDIRECTING'
        });

        return NextResponse.json({
          success: true,
          requiresRedirect: true,
          processingUrl: flyResult.processingUrl,
          token: flyResult.token,
          message: "Redirecting to 3D Secure verification",
          paymentType: '3d-secure'
        });

      } else if (paymentStatus === 'declined' || paymentStatus === 'failed') {
        // Payment declined
        await supabaseAdmin
          .from('payment_intents')
          .update({
            status: 'FAILED',
            updated_at: new Date().toISOString()
          })
          .eq('reference_no', referenceNo);

        await logPaymentOperation({
          operation_type: 'FLYCHECKOUT_PAYMENT',
          reference_no: referenceNo,
          user_id: paymentIntent.user_id,
          details: flyResult,
          status: 'FAILED'
        });

        return NextResponse.json(
          { 
            success: false,
            message: flyResult.message || "Payment failed",
            error: flyResult
          },
          { status: 400 }
        );
      }

    } else {
      // API request failed
      await supabaseAdmin
        .from('payment_intents')
        .update({
          status: 'FAILED',
          updated_at: new Date().toISOString()
        })
        .eq('reference_no', referenceNo);

      await logPaymentOperation({
        operation_type: 'FLYCHECKOUT_PAYMENT',
        reference_no: referenceNo,
        user_id: paymentIntent.user_id,
        details: flyResult,
        status: 'FAILED'
      });

      return NextResponse.json(
        { 
          success: false,
          message: flyResult.message || "Payment failed",
          error: flyResult
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error("FlyCheckout payment error:", error);
    
    return NextResponse.json(
      { message: "Internal server error", error: (error as Error).message },
      { status: 500 }
    );
  }
} 