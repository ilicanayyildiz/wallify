import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { referenceNo } = await request.json();
    
    if (!referenceNo) {
      return NextResponse.json(
        { message: "Reference number is required" },
        { status: 400 }
      );
    }

    console.log("Verifying payment intent for reference:", referenceNo);
    
    // Use service role to bypass RLS
    const { data: paymentIntent, error } = await supabaseAdmin
      .from('payment_intents')
      .select('id, reference_no, status, user_id, created_at')
      .eq('reference_no', referenceNo)
      .single();

    if (error || !paymentIntent) {
      console.log("Payment intent not found:", { referenceNo, error });
      return NextResponse.json(
        { found: false, error: error?.message },
        { status: 404 }
      );
    }

    console.log("Payment intent found:", {
      id: paymentIntent.id,
      reference_no: paymentIntent.reference_no,
      status: paymentIntent.status,
      created_at: paymentIntent.created_at
    });

    return NextResponse.json({
      found: true,
      paymentIntent: {
        id: paymentIntent.id,
        reference_no: paymentIntent.reference_no,
        status: paymentIntent.status,
        user_id: paymentIntent.user_id,
        created_at: paymentIntent.created_at
      }
    });

  } catch (error) {
    console.error("Error verifying payment intent:", error);
    return NextResponse.json(
      { message: "Internal server error", error: (error as Error).message },
      { status: 500 }
    );
  }
} 