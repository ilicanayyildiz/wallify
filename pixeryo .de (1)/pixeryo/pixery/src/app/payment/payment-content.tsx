"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreditCardForm } from "@/components/ui/credit-card-form";

export function PaymentContent() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showCreditCardModal, setShowCreditCardModal] = useState(false);
  const [currentReferenceNo, setCurrentReferenceNo] = useState<string | null>(null);

  // Get credits and price from URL parameters
  const isCustom = searchParams.get("custom") === "true";
  const credits = isCustom 
    ? parseInt(searchParams.get("initialCredits") || "0")
    : parseInt(searchParams.get("credits") || "0");
  const basePrice = isCustom
    ? (credits / 100) // Calculate price for custom credits (1 EUR = 100 credits)
    : parseFloat(searchParams.get("price") || "0");
  
  // Calculate service fee (1.8%)
  const serviceFee = basePrice * 0.018;
  // Calculate total price with service fee
  const price = basePrice + serviceFee;

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      router.push("/login?redirect=/add-credits");
      return;
    }

    // Validate parameters
    if (credits <= 0 || price <= 0) {
      setErrorMessage("Ungültiger Credit- oder Preisbetrag");
    }
  }, [isLoading, user, router, credits, price]);

  const generateReferenceNumber = () => {
    return `PIX${Date.now()}${Math.floor(Math.random() * 1000)}`;
  };

  const createPaymentIntent = async () => {
    if (!user) return null;
    
    const referenceNo = generateReferenceNumber();
    setCurrentReferenceNo(referenceNo);
    
    // Create payment intent in our database
    const { data: paymentIntent, error: dbError } = await supabase
      .from('payment_intents')
      .insert({
        user_id: user.id,
        reference_no: referenceNo,
        amount: price,
        credit_amount: credits,
        status: 'PENDING',
        description: `Kauf von ${credits} Credits`,
        service_fee: serviceFee
      })
      .select()
      .single();

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }

    return { referenceNo, paymentIntent };
  };

  const handleFHPayment = async () => {
    if (!user) return;
    if (credits <= 0 || price <= 0) {
      setErrorMessage("Ungültiger Credit- oder Preisbetrag");
      return;
    }

    setProcessing(true);
    setErrorMessage(null);

    try {
      const result = await createPaymentIntent();
      if (!result) {
        throw new Error("Failed to create payment intent");
      }

      const { referenceNo } = result;

      // Call Financial House API to initialize payment
      const response = await fetch('/api/payment/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          referenceNo,
          amount: price,
          email: user.email,
          firstName: user.user_metadata?.full_name?.split(' ')[0] || 'Customer',
          lastName: user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || 'User',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Payment initialization failed: ${errorData.message || response.statusText}`);
      }

      const paymentData = await response.json();
      
      // Redirect to payment page
      if (paymentData.redirectUrl) {
        // Update transaction ID in the database
        await supabase
          .from('payment_intents')
          .update({ transaction_id: paymentData.transactionId })
          .eq('reference_no', referenceNo);
          
        // Redirect to payment page
        window.location.href = paymentData.redirectUrl;
      } else {
        throw new Error('No redirect URL received from payment provider');
      }
    } catch (error) {
      console.error("Payment error:", error);
      setErrorMessage((error as Error).message || "Payment initialization failed");
      setProcessing(false);
      
      toast({
        title: "Zahlungsfehler",
        description: (error as Error).message || "Ein Fehler ist bei der Zahlungsinitialisierung aufgetreten",
        variant: "destructive",
      });
    }
  };

  const handleDirectPayment = async () => {
    if (!user) return;
    if (credits <= 0 || price <= 0) {
      setErrorMessage("Ungültiger Credit- oder Preisbetrag");
      return;
    }

    // Just open the modal, create payment intent on form submit
    setShowCreditCardModal(true);
  };

  const handleCreditCardSubmit = async (cardData: {
    pan: string;
    expires: string;
    holder: string;
    cvv: string;
  }) => {
    if (!user) return;

    setProcessing(true);
    setErrorMessage(null);

    try {
      // Create payment intent at the time of form submission
      const result = await createPaymentIntent();
      if (!result) {
        throw new Error("Failed to create payment intent");
      }

      const { referenceNo } = result;
      console.log("Payment intent created successfully:", referenceNo);
      
      // Verify payment intent was saved in database with retries
      let paymentIntentExists = false;
      let retries = 0;
      const maxRetries = 5;
      
      console.log("Starting payment intent verification process...");
      
      while (!paymentIntentExists && retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms between retries
        retries++;
        
        console.log(`Payment intent verification attempt ${retries}/${maxRetries} for reference: ${referenceNo}`);
        
        try {
          const verifyResponse = await fetch('/api/payment/verify-intent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ referenceNo }),
          });
          
          const verifyResult = await verifyResponse.json();
          
          console.log(`Verification attempt ${retries} result:`, {
            success: verifyResponse.ok && verifyResult.found,
            status: verifyResponse.status,
            result: verifyResult
          });
            
          if (verifyResponse.ok && verifyResult.found) {
            paymentIntentExists = true;
            console.log("Payment intent successfully verified in database:", verifyResult.paymentIntent);
            break;
          } else {
            console.log(`Payment intent verification attempt ${retries}/${maxRetries} failed:`, {
              status: verifyResponse.status,
              error: verifyResult.error || verifyResult.message,
              found: verifyResult.found
            });
          }
        } catch (e) {
          console.log(`Payment intent verification attempt ${retries}/${maxRetries} exception:`, e);
        }
      }
      
      if (!paymentIntentExists) {
        const errorMsg = `Payment intent could not be verified in database after ${maxRetries} attempts. Reference: ${referenceNo}`;
        console.error(errorMsg);
        throw new Error(errorMsg);
      }
      
      console.log("Submitting credit card payment for reference:", referenceNo);
      
      const response = await fetch('/api/payment/flycheckout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          referenceNo: referenceNo,
          amount: price,
          credits: credits,
          cardData,
          customerData: {
            email: user.email,
            firstName: user.user_metadata?.full_name?.split(' ')[0] || 'Customer',
            lastName: user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || 'User',
          }
        }),
      });

      const result2 = await response.json();
      
      console.log("Credit card payment response:", { 
        success: result2.success, 
        message: result2.message,
        paymentType: result2.paymentType 
      });

      if (result2.success) {
        if (result2.requiresRedirect && result2.processingUrl) {
          // 3D Secure yönlendirme gerekli
          console.log("Redirecting to 3D Secure page:", result2.processingUrl);
          setShowCreditCardModal(false);
          
          // Kullanıcıya bilgi ver
          toast({
            title: "3D Secure Verifizierung",
            description: "Weiterleitung zur sicheren Zahlungsverifizierung...",
          });
          
          // Yönlendirme
          window.location.href = result2.processingUrl;
          
        } else if (result2.paymentType === 'non-3d') {
          // Non-3D ödeme başarılı
          setShowCreditCardModal(false);
          toast({
            title: "Zahlung erfolgreich",
            description: "Ihre Credits wurden Ihrem Konto hinzugefügt!",
          });
          
          // Başarı sayfasına yönlendir
          router.push(`/payment/success?ref=${referenceNo}`);
        }
      } else {
        throw new Error(result2.message || "Payment failed");
      }
    } catch (error) {
      console.error("Credit card payment error:", error);
      toast({
        title: "Zahlung fehlgeschlagen",
        description: (error as Error).message || "Zahlung konnte nicht verarbeitet werden",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <div className="w-full max-w-md p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Zahlungsbestätigung</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Credits kaufen</CardTitle>
            <CardDescription>
              Bitte bestätigen Sie Ihren Kauf und wählen Sie die Zahlungsmethode
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Credits:</span>
                <span className="text-lg">{credits} Credits</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Grundpreis:</span>
                <span className="text-lg">€{basePrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Servicegebühr (1,8%):</span>
                <span className="text-lg">€{serviceFee.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b font-semibold">
                <span className="font-medium">Gesamtpreis:</span>
                <span className="text-lg font-bold">€{price.toFixed(2)}</span>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                  {errorMessage}
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter>
            <div className="w-full space-y-3">
              {/*<Button 
                className="w-full" 
                onClick={handleFHPayment} 
                disabled={processing || !!errorMessage}
              >
                {processing ? "Processing..." : "Pay with FH"}
              </Button>*/}
              
              <Button 
                variant="outline"
                className="w-full" 
                onClick={handleDirectPayment} 
                disabled={processing || !!errorMessage}
              >
                Bezahlen
              </Button>        
              
              <Button 
                variant="ghost" 
                className="w-full" 
                onClick={() => router.back()}
                disabled={processing}
              >
                Abbrechen
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Credit Card Payment Modal */}
      <Dialog open={showCreditCardModal} onOpenChange={setShowCreditCardModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Kreditkartenzahlung</DialogTitle>
          </DialogHeader>
          
          <CreditCardForm
            onSubmit={handleCreditCardSubmit}
            onCancel={() => {
              if (!processing) {
                setShowCreditCardModal(false);
              }
            }}
            processing={processing}
            credits={credits}
            amount={price}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
} 