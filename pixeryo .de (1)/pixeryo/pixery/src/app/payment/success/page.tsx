"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { logPaymentOperation } from "@/lib/payment-utils";

export default function PaymentSuccessPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [processingComplete, setProcessingComplete] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    
    if (!user) {
      router.push("/login");
      return;
    }

    const processSuccessfulPayment = async () => {
      try {
        // The transaction has been processed by the payment provider
        // We just need to ensure the credits are added to the user's account

        // 1. Find the latest pending payment intent for this user
        const { data: pendingPayments, error } = await supabase
          .from('payment_intents')
          .select('*')
          .eq('user_id', user.id)
          .in('status', ['PENDING', 'COMPLETED']) // Include completed in case we're reloading
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error("Error fetching pending payments:", error);
          return;
        }

        if (!pendingPayments || pendingPayments.length === 0) {
          console.log("No pending payments found");
          setProcessingComplete(true);
          return;
        }

        const payment = pendingPayments[0];
        
        // Log that we started processing
        await logPaymentOperation({
          operation_type: 'REDIRECT_SUCCESS',
          reference_no: payment.reference_no,
          user_id: user.id,
          details: { 
            payment_id: payment.id,
            payment_status: payment.status 
          },
          status: 'PROCESSING'
        });
        
        // IMPORTANT: Check if a transaction for this reference number already exists
        const { data: existingTransactions, error: txError } = await supabase
          .from('credit_transactions')
          .select('id')
          .eq('reference_no', payment.reference_no)
          .eq('status', 'COMPLETED');
          
        if (txError) {
          console.error("Error checking existing transactions:", txError);
        }
        
        // If transaction already exists, don't process again
        if (existingTransactions && existingTransactions.length > 0) {
          console.log("Payment already processed, skipping duplicate processing");
          
          await logPaymentOperation({
            operation_type: 'REDIRECT_SUCCESS',
            reference_no: payment.reference_no,
            user_id: user.id,
            details: { 
              payment_id: payment.id,
              duplicate: true,
              existing_tx_id: existingTransactions[0].id 
            },
            status: 'SKIPPED'
          });
          
          setProcessingComplete(true);
          return;
        }
        
        // If payment is still pending, update to completed
        if (payment.status === 'PENDING') {
          await supabase
            .from('payment_intents')
            .update({ status: 'COMPLETED' })
            .eq('id', payment.id);
        }

        // First create the transaction record
        const { data: txData, error: insertError } = await supabase
          .from('credit_transactions')
          .insert({
            user_id: user.id,
            amount: payment.credit_amount,
            euro_amount: payment.amount,
            description: `Credit purchase`,
            status: 'COMPLETED',
            reference_no: payment.reference_no,
            transaction_id: payment.transaction_id,
            service_fee: payment.service_fee || 0
          })
          .select()
          .single();
          
        if (insertError) {
          console.error("Error creating transaction record:", insertError);
          
          await logPaymentOperation({
            operation_type: 'REDIRECT_SUCCESS',
            reference_no: payment.reference_no,
            user_id: user.id,
            details: { 
              payment_id: payment.id,
              error: insertError.message
            },
            status: 'ERROR'
          });
          
          setProcessingComplete(true);
          return;
        }
        
        // Now add credits to the user's account
        await supabase.rpc('add_user_credits', { 
          user_id: user.id, 
          credit_amount: payment.credit_amount
        });
            
        // Log success  
        await logPaymentOperation({
          operation_type: 'REDIRECT_SUCCESS',
          reference_no: payment.reference_no,
          user_id: user.id,
          details: { 
            payment_id: payment.id,
            transaction_id: txData?.id || null
          },
          status: 'COMPLETED'
        });

        setProcessingComplete(true);
      } catch (error) {
        console.error("Error processing payment success:", error);
        
        // Log error
        if (user) {
          await logPaymentOperation({
            operation_type: 'REDIRECT_SUCCESS',
            reference_no: 'UNKNOWN', // We couldn't get the payment
            user_id: user.id,
            details: { error: (error as Error).message },
            status: 'ERROR'
          });
        }
        
        setProcessingComplete(true);
      }
    };

    processSuccessfulPayment();
  }, [user, isLoading, router]);

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
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-xl">Zahlung erfolgreich</CardTitle>
          </CardHeader>
          
          <CardContent className="text-center">
            <p className="mb-4">
              Vielen Dank für Ihren Kauf. Ihre Credits wurden Ihrem Konto hinzugefügt.
            </p>
            
            {!processingComplete && (
              <div className="flex justify-center my-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-center gap-4">
            <Button onClick={() => router.push("/profile")}>
              Meine Credits anzeigen
            </Button>
            <Button variant="outline" onClick={() => router.push("/browse")}>
              Bilder durchsuchen
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 