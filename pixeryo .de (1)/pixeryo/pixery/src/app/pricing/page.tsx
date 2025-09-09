import React from "react";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { Faq } from "@/components/ui/faq";
import { CustomCreditPackage } from "./custom-credit-component";
import { CreditPackage } from "./credit-package-component";

export const metadata = {
  title: "Preise & Credits | Pixeryo",
  description: "Entdecken Sie unsere flexiblen Credit-Pakete für Premium Stock-Bilder. Wählen Sie das perfekte Paket für Ihre kreativen Bedürfnisse.",
};

const pricingFaqs = [
  {
    id: "pricing-faq-1",
    question: "Was sind Credits und wie funktionieren sie?",
    answer:
      "Credits sind unsere virtuelle Währung zum Kauf von Bildern. Jedes Bild hat einen Credit-Preis und Sie können Credit-Pakete nach Bedarf kaufen. Credits laufen nie ab, sodass Sie sie in Ihrem eigenen Tempo verwenden können.",
  },
  {
    id: "pricing-faq-2",
    question: "Wie hoch ist der Wert eines Credits?",
    answer:
      "Jeder Credit hat einen Wert von 0,01 EUR.",
  },
  {
    id: "pricing-faq-3",
    question: "Kann ich eine Rückerstattung für ungenutzte Credits erhalten?",
    answer:
      "Credits sind nach dem Kauf nicht erstattungsfähig, aber sie laufen nie ab, sodass Sie sie jederzeit für zukünftige Käufe verwenden können. Für Credit-Rückerstattungsanfragen wenden Sie sich bitte an unser Support-Team unter info@pixeryo.com.",
  },
  {
    id: "pricing-faq-4",
    question: "Benötige ich Credits, um Inhalte auf Pixeryo zu kaufen?",
    answer:
      "Ja, Credits sind erforderlich, um Bilder und kreative Assets auf der Plattform zu kaufen.",
  },
  {
    id: "pricing-faq-5",
    question: "Laufen Credits ab?",
    answer: 
      "Nein, Credits laufen nie ab. Sobald Sie sie gekauft haben, bleiben sie in Ihrem Konto, bis Sie sie verwenden.",
  },
  {
    id: "pricing-faq-6",
    question: "Welche Zahlungsmethoden akzeptieren Sie?",
    answer:
      "Wir akzeptieren Zahlungen über VISA, MasterCard und alternative Methoden.",
  },
];

export default function PricingPage() {
  const creditPackages = [
    {
      credits: 100,
      price: 1,
      popular: false
    },
    {
      credits: 500,
      price: 5,
      popular: true
    },
    {
      credits: 1000,
      price: 10,
      popular: false
    },
    {
      credits: 2000,
      price: 20,
      popular: false
    }
  ];

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <HeroGeometric 
        badge="Durchsuchen"
        title1="Credits für"
        title2="Jedes kreative Projekt"
      />

      {/* Credit Packages */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-semibold mb-4">Unsere Credit-Pakete</h2>
            <p className="text-muted-foreground">
              Credits werden verwendet, um Bilder auf unserer Plattform zu kaufen. 100 Credits = €1(£0.84). Wählen Sie ein Paket, das Ihren Bedürfnissen entspricht.
            </p>
          </div>
          
          {/* Standard Credit Packages */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-10">
            {creditPackages.map((pkg, index) => (
              <CreditPackage
                key={index}
                credits={pkg.credits}
                price={pkg.price}
                popular={pkg.popular}
              />
            ))}
          </div>
          
          {/* Custom Credit Package */}
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-center mb-4">Benötigen Sie einen benutzerdefinierten Betrag?</h3>
            <CustomCreditPackage />
          </div>
          
          <div className="mt-12 max-w-3xl mx-auto p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Über Credits</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li>Credits laufen nie ab</li>
              <li>Verwendet zum Kauf hochwertiger Stock-Bilder</li>
              <li>Je mehr Credits Sie kaufen, desto besser ist der Wert</li>
              <li>Credits sind sofort in Ihrem Konto verfügbar</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Faq 
        heading="Häufig gestellte Fragen zu Credits"
        description="Können Sie die Antwort nicht finden, die Sie suchen? Wenden Sie sich an unser Kundensupport-Team."
        items={pricingFaqs}
        supportHeading="Benötigen Sie Hilfe mit Credits oder Käufen?"
        supportDescription="Unser engagiertes Support-Team ist hier, um Ihnen bei der Auswahl des richtigen Credit-Pakets für Ihre Bedürfnisse zu helfen."
        supportButtonText="Support kontaktieren"
        supportButtonUrl="/contacts"
      />
    </div>
  );
} 