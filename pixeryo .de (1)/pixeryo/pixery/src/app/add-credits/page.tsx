"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Icons } from "@/components/icons";
import { AlertCircle } from "lucide-react";

const creditPackages = [
  { id: 1, credits: 100, price: 1, popular: false },
  { id: 2, credits: 500, price: 5, popular: true },
  { id: 3, credits: 1000, price: 10, popular: false },
  { id: 4, credits: 2000, price: 20, popular: false },
];

export default function AddCreditsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [selectedPackage, setSelectedPackage] = useState<number>(2); // Default to the popular 500 credit package
  const [processing, setProcessing] = useState(false);
  const [customCredits, setCustomCredits] = useState<number>(5000);
  const [isCustomPackage, setIsCustomPackage] = useState(false);
  const [customCreditError, setCustomCreditError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      router.push("/login?redirect=/add-credits");
    }
  }, [isLoading, user, router]);

  const handleAddCredits = async () => {
    if (!user) return;

    if (isCustomPackage) {
      // Validate minimum credits
      if (customCredits < 1000) {
        setCustomCreditError("Mindestens 1000 Credits erforderlich");
        return;
      }
      
      // For custom package, redirect to payment page
      router.push(`/payment?custom=true&initialCredits=${customCredits}`);
      return;
    }

    const selectedPkg = creditPackages.find(pkg => pkg.id === selectedPackage);
    if (!selectedPkg) return;

    // For predefined packages, redirect to payment page
    router.push(`/payment?credits=${selectedPkg.credits}&price=${selectedPkg.price}`);
  };

  const handleCustomCreditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const value = parseInt(inputValue);
    
    // Always update the input value to allow typing
    if (!isNaN(value)) {
      setCustomCredits(value);
      
      // Validate but don't prevent typing
      if (value < 1000) {
        setCustomCreditError("Mindestens 1000 Credits erforderlich");
      } else {
        setCustomCreditError(null);
      }
    } else if (inputValue === "") {
      // Allow empty input while typing
      setCustomCredits(0);
      setCustomCreditError("Bitte geben Sie einen Credit-Betrag ein");
    }
  };

  const calculatePrice = (credits: number) => {
    return credits / 100;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <div className="w-full max-w-3xl p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Credits zu Ihrem Konto hinzufügen</h1>
        
        <p className="mb-6 text-muted-foreground">
          Credits werden verwendet, um Bilder auf unserer Plattform zu kaufen. 100 Credits = €1(£0.84). Wählen Sie unten ein Paket aus, um Credits zu Ihrem Konto hinzuzufügen.
        </p>
        
        <Card>
          <CardHeader>
            <CardTitle>Wählen Sie ein Credit-Paket</CardTitle>
            <CardDescription>
              Wählen Sie aus, wie viele Credits Sie kaufen möchten
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={isCustomPackage ? "custom" : selectedPackage.toString()} 
              onValueChange={(value) => {
                if (value === "custom") {
                  setIsCustomPackage(true);
                  // Reset error when switching to custom
                  setCustomCreditError(null);
                } else {
                  setIsCustomPackage(false);
                  setSelectedPackage(parseInt(value));
                }
              }}
              className="space-y-4"
            >
              {creditPackages.map((pkg) => (
                <div 
                  key={pkg.id}
                  className={`flex items-center space-x-2 p-4 border rounded-lg relative ${
                    selectedPackage === pkg.id && !isCustomPackage ? "border-primary" : "border-border"
                  }`}
                >
                  <RadioGroupItem value={pkg.id.toString()} id={`package-${pkg.id}`} />
                  <Label 
                    htmlFor={`package-${pkg.id}`}
                    className="flex-1 flex justify-between items-center cursor-pointer"
                  >
                    <span>
                      <span className="text-lg font-medium block">{pkg.credits} Credits</span>
                      <span className="text-muted-foreground">€{pkg.price.toFixed(2)}</span>
                    </span>
                    <span className="text-xl font-bold">€{pkg.price.toFixed(2)}</span>
                  </Label>
                  
                  {pkg.popular && (
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                      Beliebt
                    </div>
                  )}
                </div>
              ))}

              {/* Custom Credit Option */}
              <div 
                className={`flex items-start space-x-2 p-4 border rounded-lg ${
                  isCustomPackage ? "border-primary" : "border-border"
                }`}
              >
                <RadioGroupItem value="custom" id="package-custom" className="mt-1" />
                <div className="flex-1">
                  <Label 
                    htmlFor="package-custom"
                    className="text-lg font-medium block mb-2 cursor-pointer"
                  >
                    Benutzerdefinierte Credits
                  </Label>
                  
                  <div className={`${isCustomPackage ? 'opacity-100' : 'opacity-60'}`}>
                    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                      <div className="flex-1">
                        <Label htmlFor="customCreditAmount" className="text-sm text-muted-foreground mb-1 block">
                          Credit-Betrag eingeben:
                        </Label>
                        <div className="relative">
                          <Input
                            id="customCreditAmount"
                            type="number"
                            min="1000"
                            step="100"
                            value={customCredits || ""}
                            onChange={handleCustomCreditChange}
                            className={`w-full ${customCreditError && isCustomPackage ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                            disabled={!isCustomPackage}
                            placeholder="5000"
                          />
                          {customCreditError && isCustomPackage && (
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500">
                              <AlertCircle size={16} />
                            </div>
                          )}
                        </div>
                        {customCreditError && isCustomPackage ? (
                          <p className="text-xs text-red-500 mt-1">
                            {customCreditError}
                          </p>
                        ) : (
                          <p className="text-xs text-muted-foreground mt-1">
                            (Mindestens 1000 Credits)
                          </p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xl font-bold mb-1">
                          €{calculatePrice(customCredits).toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          €1.00(£0.84) per 100 credits
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between flex-col sm:flex-row gap-4">
            <div className="text-sm text-muted-foreground">
              <p>Sichere Zahlungsabwicklung</p>
              <div className="flex items-center mt-1">
                <Icons.visa className="h-6 w-auto mr-2" />
                <Icons.mastercard className="h-6 w-auto mr-2" />
              </div>
            </div>
            <Button 
              onClick={handleAddCredits} 
              disabled={processing || (isCustomPackage && (customCredits < 1000 || customCreditError !== null))}
              className="sm:w-auto w-full"
              size="lg"
            >
              {processing ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Wird verarbeitet...
                </>
              ) : (
                <>Zur Zahlung fortfahren</>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-2">Über Credits</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li>Credits laufen nie ab</li>
            <li>Verwendet zum Kauf hochwertiger Stock-Bilder</li>
            <li>Je mehr Credits Sie kaufen, desto besser ist der Wert</li>
            <li>Credits sind sofort in Ihrem Konto verfügbar</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 