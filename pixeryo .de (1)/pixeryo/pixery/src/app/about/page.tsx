import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";

export const metadata = {
  title: "Über uns | Pixeryo",
  description: "Erfahren Sie mehr über das Team hinter Pixeryo und unsere Mission, hochwertige Stock-Fotografie für kreative Profis bereitzustellen.",
};

export default function AboutPage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <HeroGeometric 
        badge="Über uns"
        title1="Das Team hinter"
        title2="Pixeryo"
      />

      {/* Our Story Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image 
                src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=2000" 
                alt="Photography team working" 
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-semibold mb-6">Unsere Geschichte</h2>
              <p className="text-muted-foreground mb-4">
                Pixeryo entstand aus einer Leidenschaft für Fotografie und dem Wunsch, ein häufiges Problem zu lösen: authentische, hochwertige Bilder zu finden, die nicht wie typische Stock-Fotos aussehen.
              </p>
              <p className="text-muted-foreground mb-4">
                Im Jahr 2025 waren unsere Gründer — beide selbst Fotografen und Designer — frustriert über die begrenzten verfügbaren Optionen. Sie stellten sich eine Plattform vor, die die Lücke zwischen generischen Stock-Fotos und maßgeschneiderter Fotografie schließen würde und Kreativen Zugang zu Bildern geben würde, die ihre Projekte wirklich aufwerten.
              </p>
              <p className="text-muted-foreground">
                Heute sind wir zu einer globalen Gemeinschaft von Fotografen, Kreativen und Kunden gewachsen, die unsere Vision des authentischen visuellen Storytellings teilen. Unsere sorgfältig kuratierte Sammlung umfasst Millionen von Bildern in verschiedenen Kategorien, alle darauf ausgelegt, Ihre kreativen Projekte hervorzuheben.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-semibold mb-8">Unsere Mission</h2>
            <p className="text-xl text-muted-foreground mb-12">
              Pixeryo hat es sich zur Mission gemacht, hochwertige visuelle Inhalte für jeden zugänglich zu machen. Wir streben danach, die globale Kommunikation durch Bilder nahtlos zu gestalten, mit einem besonderen Fokus auf den europäischen Markt. Unsere kuratierte Sammlung hilft kreativen Profis dabei, kraftvolle Geschichten visuell zu erzählen.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                </div>
                <h3 className="text-xl font-medium mb-2 text-center">Qualität</h3>
                <p className="text-muted-foreground text-center">
                  Wir halten die höchsten Standards für jedes Bild in unserer Sammlung ein und stellen sicher, dass Sie immer das perfekte Bild für Ihr Projekt finden.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10" /><path d="m16 12-4 4-4-4M12 8v7" /></svg>
                </div>
                <h3 className="text-xl font-medium mb-2 text-center">Zugänglichkeit</h3>
                <p className="text-muted-foreground text-center">
                  Wir bieten flexible Preisoptionen, um Premium Stock-Bilder für Unternehmen und Kreative aller Größen zugänglich zu machen.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                </div>
                <h3 className="text-xl font-medium mb-2 text-center">Gemeinschaft</h3>
                <p className="text-muted-foreground text-center">
                  Wir unterstützen Fotografen und Künstler durch faire Vergütung und eine Plattform, um ihre Arbeit einem globalen Publikum zu präsentieren.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-card border border-border rounded-lg p-8 md:p-12 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-semibold mb-6">Treten Sie unserer Gemeinschaft bei</h2>
                <p className="text-muted-foreground mb-8">
                  Ob Sie nach dem perfekten Bild für Ihr Projekt suchen oder Ihre Fotografie mit der Welt teilen möchten, Pixeryo ist die Plattform für Sie. Treten Sie heute unserer wachsenden Gemeinschaft von Kreativen und Unternehmen bei.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild>
                    <Link href="/browse">Unsere Sammlung durchsuchen</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/contacts">Kontakt</Link>
                  </Button>
                </div>
              </div>
              <div className="relative h-[300px] rounded-lg overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200" 
                  alt="Our community of creators" 
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 