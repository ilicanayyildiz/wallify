import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { referenceNo, amount, email, firstName, lastName } = body;

    // Validate input
    if (!referenceNo || !amount || !email || !firstName || !lastName) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Convert amount to decimal with two places (e.g. 10.99)
    const formattedAmount = parseFloat(amount).toFixed(2);

    // Get API key from environment variable
    const apiKey = process.env.FINANCIAL_HOUSE_API_KEY;
    if (!apiKey) {
      console.error("Financial House API key not found in environment variables");
      return NextResponse.json(
        { message: "Payment provider configuration missing" },
        { status: 500 }
      );
    }

    // Current domain for redirect URLs
    const domain = process.env.NEXT_PUBLIC_APP_URL || 
                 (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    // Financial House API endpoint
    const apiUrl = "https://sandbox-wallet.financialhouse.io/v2/checkout/initialize";

    // Prepare payload for Financial House API
    const payload = {
      apiKey,
      amount: parseFloat(formattedAmount),
      currency: "GBP",
      country: "GB",
      dateOfBirth: "1986-05-22", // Static as per documentation
      defaultPaymentMethod: "CARD",
      email,
      failRedirectUrl: `${domain}/payment/failed`,
      firstName,
      lastName,
      referenceNo,
      successRedirectUrl: `${domain}/payment/success`,
      address: "80 Neal Street Covent Garden", // Static as per documentation
      city: "London", // Static as per documentation
      postCode: "WC2E 8DD", // Static as per documentation
      language: "EN"
    };

    console.log("Sending payment request to Financial House:", {
      ...payload,
      apiKey: "REDACTED" // Don't log the API key
    });

    // Make request to Financial House API
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Handle API response
    const data = await response.json();

    if (!response.ok || data.status !== "APPROVED") {
      console.error("Financial House API error:", data);
      return NextResponse.json(
        { 
          message: `Payment initialization failed: ${data.message || "Unknown error"}`,
          code: data.code 
        },
        { status: response.status }
      );
    }

    // Return success response with redirect URL
    return NextResponse.json({
      redirectUrl: data.redirectUrl,
      transactionId: data.transactionId,
      status: data.status
    });
  } catch (error) {
    console.error("Payment initialization error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 