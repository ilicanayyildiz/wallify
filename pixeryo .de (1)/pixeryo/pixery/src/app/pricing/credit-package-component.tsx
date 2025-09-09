"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";

export const CreditPackage = ({
  credits,
  price,
  popular = false
}: {
  credits: number;
  price: number;
  popular?: boolean;
}) => {
  const { user } = useAuth();
  const router = useRouter();

  const handlePurchase = () => {
    if (!user) {
      router.push("/login?redirect=/pricing");
      return;
    }
    
    router.push(`/payment?credits=${credits}&price=${price}`);
  };

  return (
    <div className={cn(
      "relative flex flex-col p-6 bg-card border border-border rounded-lg shadow-sm",
      popular && "border-primary shadow-md"
    )}>
      {popular && (
        <div className="absolute -top-4 left-0 right-0 flex justify-center">
          <span className="px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
            Beliebteste
          </span>
        </div>
      )}
      <div className="mb-5">
        <div className="flex items-center mb-2">
          <Coins className="h-5 w-5 mr-2 text-primary" />
          <h3 className="text-lg font-medium">{credits} Credits</h3>
        </div>
        <div className="mt-2 flex items-baseline text-3xl font-bold">
          €{price.toFixed(2)}
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          {price > 0 ? `€${(price/credits*100).toFixed(1)} pro 100 Credits` : "Kostenlose Credits zum Starten"}
        </p>
      </div>
      <div className="mt-auto">
        <Button 
          className="w-full" 
          variant={popular ? "default" : "outline"}
          onClick={handlePurchase}
        >
          Jetzt kaufen
        </Button>
      </div>
    </div>
  );
}; 