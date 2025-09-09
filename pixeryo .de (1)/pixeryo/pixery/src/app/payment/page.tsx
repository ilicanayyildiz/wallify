"use client";

import { Suspense } from "react";
import { PaymentContent } from "./payment-content";

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-12 flex justify-center">
        <div className="w-full max-w-md p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
} 