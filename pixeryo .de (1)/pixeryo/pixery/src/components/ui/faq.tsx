"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqProps {
  heading: string;
  description: string;
  items?: FaqItem[];
  supportHeading: string;
  supportDescription: string;
  supportButtonText: string;
  supportButtonUrl: string;
}

const defaultFaqItems = [
  {
    id: "faq-1",
    question: "Welche Arten von Stock-Bildern bieten Sie an?",
    answer:
      "Wir bieten eine vielfältige Sammlung hochwertiger Stock-Bilder in verschiedenen Kategorien wie Natur, Business, Technologie, Urban und Architektur. Unsere Bibliothek wächst ständig mit wöchentlichen Neuzugängen.",
  },
  {
    id: "faq-2",
    question: "Wie funktioniert die Lizenzierung?",
    answer:
      "Wir bieten einfache Lizenzoptionen für den persönlichen und kommerziellen Gebrauch. Unsere Standardlizenz ermöglicht es Ihnen, Bilder in den meisten digitalen und Druckprojekten zu verwenden. Für erweiterte Nutzungsrechte oder Sonderfälle lesen Sie bitte unsere Inhaltslizenzvereinbarung.",
  },
  {
    id: "faq-3",
    question: "Kann ich die Bilder für kommerzielle Projekte verwenden?",
    answer:
      "Ja, alle Bilder auf unserer Plattform kommen mit einer kommerziellen Lizenz, die es Ihnen ermöglicht, sie in Werbung, Websites, sozialen Medien und anderen geschäftsbezogenen Projekten zu verwenden. Spezifische Einschränkungen sind in unserer Inhaltslizenzvereinbarung detailliert beschrieben.",
  },
  {
    id: "faq-4",
    question: "Bieten Sie Abonnement-Pläne an?",
    answer:
      "Ja, wir bieten flexible Abonnement-Pläne, die Ihnen Zugang zu unserer gesamten Bildbibliothek geben. Wählen Sie zwischen monatlichen oder jährlichen Plänen basierend auf Ihren Bedürfnissen und Ihrem Budget. Weitere Details finden Sie auf unserer Preisseite.",
  },
  {
    id: "faq-5",
    question: "Wie kann ich Mitwirkender werden?",
    answer: 
      "Wir begrüßen Fotografen und Künstler, die zu unserer Plattform beitragen möchten. Erstellen Sie einfach ein Konto, reichen Sie Ihre Arbeiten zur Überprüfung ein und verdienen Sie, wenn Ihre Bilder heruntergeladen werden. Weitere Informationen finden Sie in unseren Mitwirkenden-Richtlinien.",
  },
  {
    id: "faq-6",
    question: "Welche Bildformate und Auflösungen sind verfügbar?",
    answer:
      "Unsere Bilder sind in hochauflösenden JPG- und PNG-Formaten verfügbar. Jedes Bild ist für Qualität optimiert und behält dabei angemessene Dateigrößen bei. Die meisten Bilder sind in mehreren Auflösungen verfügbar, um Ihren spezifischen Bedürfnissen gerecht zu werden.",
  },
  {
    id: "faq-7",
    question: "Kann ich eine Rückerstattung beantragen?",
    answer:
      "Ja, wir bieten eine 30-tägige Geld-zurück-Garantie, wenn Sie mit Ihrem Kauf nicht zufrieden sind. Bitte kontaktieren Sie unser Support-Team mit Ihren Bestelldetails, um Ihre Rückerstattung zu bearbeiten.",
  },
];

const Faq = ({
  heading = "Häufig gestellte Fragen",
  description = "Finden Sie Antworten auf häufige Fragen zu unserer Stock-Bild-Plattform. Können Sie nicht finden, wonach Sie suchen? Kontaktieren Sie unser Support-Team.",
  items = defaultFaqItems,
  supportHeading = "Benötigen Sie weitere Hilfe?",
  supportDescription = "Unser engagiertes Support-Team ist hier, um Ihnen bei Fragen oder Bedenken zu unserer Stock-Bild-Plattform zu helfen.",
  supportButtonText = "Support kontaktieren",
  supportButtonUrl = "/contacts",
}: FaqProps) => {
  return (
    <section className="py-16 md:py-24">
      <div className="container space-y-16">
        <div className="mx-auto flex max-w-3xl flex-col text-left md:text-center">
          <h2 className="mb-3 text-3xl font-semibold md:mb-4 lg:mb-6 lg:text-4xl">
            {heading}
          </h2>
          <p className="text-muted-foreground lg:text-lg">{description}</p>
        </div>
        <Accordion
          type="single"
          collapsible
          className="mx-auto w-full lg:max-w-3xl"
        >
          {items.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="transition-opacity duration-200 hover:no-underline hover:opacity-60">
                <div className="font-medium sm:py-1 lg:py-2 lg:text-lg">
                  {item.question}
                </div>
              </AccordionTrigger>
              <AccordionContent className="sm:mb-1 lg:mb-2">
                <div className="text-muted-foreground lg:text-lg">
                  {item.answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
         {/* Enterprise CTA */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-card border border-border rounded-lg p-8 md:p-12 shadow-sm">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-semibold mb-4">Benötigen Sie eine maßgeschneiderte Lösung?</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Wir bieten maßgeschneiderte Unternehmenslösungen für Teams und Organisationen mit spezifischen Anforderungen. Kontaktieren Sie unser Verkaufsteam, um Ihre Bedürfnisse zu besprechen.
                </p>
              </div>
              <div className="flex justify-center">
                <Button size="lg" asChild>
                  <Link href="/contacts">Verkaufsteam kontaktieren</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export { Faq }; 