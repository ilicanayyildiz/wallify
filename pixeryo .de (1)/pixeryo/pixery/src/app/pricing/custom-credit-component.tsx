"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";

export const CustomCreditPackage = () => {
  const [customCredits, setCustomCredits] = useState(5000);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  const handleCustomCreditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    
    if (!isNaN(value)) {
      setCustomCredits(value);
      
      if (value < 1000) {
        setError("Mindestens 1000 Credits erforderlich");
      } else {
        setError(null);
      }
    } else if (e.target.value === "") {
      setCustomCredits(0);
        setError("Bitte geben Sie einen Credit-Betrag ein");
    }
  };

  const handleContinue = () => {
    if (!user) {
      router.push("/login?redirect=/pricing");
      return;
    }
    
    router.push(`/payment?custom=true&initialCredits=${customCredits}`);
  };

  return (
    <div className="relative flex flex-col p-6 bg-card border border-border rounded-lg shadow-sm">
      <div className="mb-5">
        <div className="flex items-center mb-2">
          <Coins className="h-5 w-5 mr-2 text-primary" />
          <h3 className="text-lg font-medium">Benutzerdefinierte Credits</h3>
        </div>
        <div className="mt-2">
          <label htmlFor="customCredits" className="block text-sm font-medium text-muted-foreground mb-1">
            Credit-Betrag eingeben:
          </label>
          <Input 
            id="customCredits"
            type="number" 
            min="1000" 
            step="100" 
            value={customCredits || ""}
            onChange={handleCustomCreditChange}
            className={`w-full mb-2 ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
          />
          {error ? (
            <p className="text-xs text-red-500 mb-3">
              {error}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground mb-3">
              (Mindestens 1000 Credits)
            </p>
          )}
        </div>
        <div className="mt-2 flex items-baseline text-3xl font-bold">
          €{(customCredits / 100).toFixed(2)}
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Geben Sie den genauen Betrag ein, den Sie benötigen
        </p>
      </div>
      <div className="mt-auto">
        <Button 
          className="w-full" 
          variant="outline"
          disabled={!!error || customCredits < 1000}
          onClick={handleContinue}
        >
          Fortfahren
        </Button>
      </div>
    </div>
  );
}; 