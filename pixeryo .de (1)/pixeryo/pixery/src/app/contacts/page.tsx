import React from "react";
import { MapPin, Mail, Clock, Users, Briefcase } from "lucide-react";

export const metadata = {
  title: "Kontakt | Pixeryo",
  description: "Kontaktieren Sie das Pixeryo-Team für Anfragen, Support oder Partnerschaftsmöglichkeiten."
};

export default function ContactPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Kontakt</h1>
            <p className="text-xl text-muted-foreground">
              Wir sind hier, um bei Fragen zu unseren Stock-Bildern, Lizenzen oder Partnerschaften zu helfen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Email Contact */}
            <div className="bg-muted/30 p-8 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="bg-primary/10 p-4 rounded-full mx-auto mb-6 w-16 h-16 flex items-center justify-center">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-3">E-Mail</h2>
              <div className="space-y-2 mb-4">
                <p className="text-muted-foreground">
                  Haben Sie Fragen?
                  <br />
                  Zögern Sie nicht, uns per E-Mail für Unterstützung zu kontaktieren.
                </p>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-muted-foreground">
                  <a href="mailto:info@pixeryo.com" className="hover:text-primary transition-colors">info@pixeryo.com</a>
                </p>
              </div>
            </div>

            {/* Phone Contact */}
            <div className="bg-muted/30 p-8 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="bg-primary/10 p-4 rounded-full mx-auto mb-6 w-16 h-16 flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-3">Kundensupport</h2>
              <p className="text-muted-foreground mb-2">
                Unser engagiertes Support-Team ist verfügbar, um bei Fragen zu Ihrem Konto, Käufen oder technischen Problemen zu helfen.
              </p>
              <div className="flex items-center justify-center text-sm text-muted-foreground mt-4">
                <Clock className="h-4 w-4 mr-2" />
                <p>
                  Montag - Freitag
                  <br />
                  9:00 - 18:00 MEZ
                </p>
              </div>
            </div>

            {/* Office Location */}
            <div className="bg-muted/30 p-8 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="bg-primary/10 p-4 rounded-full mx-auto mb-6 w-16 h-16 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-3">Besuchen Sie uns</h2>
              <address className="text-muted-foreground not-italic mb-4">
                CLIPOZA LTD.<br />
                71-75 Shelton Street<br />
                Covent Garden<br />
                London, WC2H 9JQ<br />
                United Kingdom
              </address>
            </div>
          </div>

          {/* Departments Section */}
          <div className="mb-16">

            <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
              <div className="bg-muted/20 p-6 rounded-lg flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2">Geschäftsentwicklung</h3>
                  <p className="text-muted-foreground mb-3">
                    Interessiert an Geschäftspartnerschaften, Volumenlizenzen oder Unternehmenslösungen? Unser Geschäftsteam steht bereit, um zu helfen.
                  </p>
                  <a href="mailto:business@pixeryo.com" className="text-primary hover:underline">
                    business@pixeryo.com
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}