"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { logPaymentOperation } from "@/lib/payment-utils";

function PaymentFailedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);
  const [declineReason, setDeclineReason] = useState<string>("");

  useEffect(() => {
    const processFailedPayment = async () => {
      try {
        const orderNumber = searchParams.get('orderNumber') || searchParams.get('ref');
        const status = searchParams.get('status');
        const token = searchParams.get('token');
        const declineReason = searchParams.get('declineReason');
        
        console.log("Failed payment parameters:", {
          orderNumber,
          status,
          token,
          declineReason
        });

        if (orderNumber && status === 'declined') {
          setDeclineReason(declineReason || "Payment was declined");

          // Payment intent'i güncelle
          const { error: updateError } = await supabase
            .from('payment_intents')
            .update({
              status: 'FAILED',
              updated_at: new Date().toISOString()
            })
            .eq('reference_no', orderNumber);

          if (updateError) {
            console.error("Error updating payment intent:", updateError);
          } else {
            console.log("Payment intent updated to FAILED for:", orderNumber);
          }

          // Log failed payment
          if (user) {
            await logPaymentOperation({
              operation_type: 'FLYCHECKOUT_FAILED_REDIRECT',
              reference_no: orderNumber,
              user_id: user.id,
              details: {
                status,
                token,
                decline_reason: declineReason,
                redirect_params: Object.fromEntries(searchParams.entries())
              },
              status: 'FAILED'
            });
          }
        }
      } catch (error) {
        console.error("Error processing failed payment:", error);
      } finally {
        setIsProcessing(false);
      }
    };

    processFailedPayment();
  }, [searchParams, user]);

  if (isProcessing) {
    return (
      <div className="container mx-auto py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-4">Zahlungsergebnis wird verarbeitet...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-xl">Zahlung fehlgeschlagen</CardTitle>
          </CardHeader>
          
          <CardContent className="text-center">
            <p className="mb-4">
              Leider konnte Ihre Zahlung nicht verarbeitet werden. 
              Ihrem Konto wurden keine Gebühren belastet.
            </p>
            {declineReason && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-800">
                <strong>Grund:</strong> {declineReason}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-center gap-4">
            <Button onClick={() => router.push("/add-credits")}>
              Erneut versuchen
            </Button>
            <Button variant="outline" onClick={() => router.push("/")}>
              Zur Startseite
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-4">Wird geladen...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    }>
      <PaymentFailedContent />
    </Suspense>
  );
} 