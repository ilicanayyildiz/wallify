"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";

// Add type declaration for Google Analytics
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Check if user has already consented
    const consentValue = localStorage.getItem("cookie-consent");
    
    // If no consent found, show the banner
    if (!consentValue) {
      setIsVisible(true);
    }
  }, []);
  
  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
    
    // Enable Google Analytics
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
  };
  
  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
    
    // Disable Google Analytics
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }
  };
  
  const handleClose = () => {
    setIsVisible(false);
  };
  
  if (!isVisible) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 left-4 md:left-auto md:max-w-md z-50">
      <div className="bg-card border border-border shadow-lg rounded-lg p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">Cookie-Einstellungen</h3>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-muted-foreground text-sm mb-4">
          Wir verwenden Cookies, um Ihr Browsing-Erlebnis zu verbessern, personalisierte Anzeigen zu schalten und unseren Traffic zu analysieren. Durch Klicken auf "Alle akzeptieren" stimmen Sie der Verwendung von Cookies zu. Lesen Sie unsere{" "}
          <Link href="/privacy-policy" className="text-primary underline">
            Datenschutzerklärung
          </Link>{" "}
          für weitere Informationen.
        </p>
        
        <div className="flex gap-2 mt-4 flex-wrap sm:flex-nowrap">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={handleDecline}
          >
            Ablehnen
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            onClick={handleAccept}
          >
            Alle akzeptieren
          </Button>
        </div>
      </div>
    </div>
  );
} 