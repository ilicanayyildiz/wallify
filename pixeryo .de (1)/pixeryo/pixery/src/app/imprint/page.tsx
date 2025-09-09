import { LegalPageLayout } from "@/components/ui/legal-page-layout";

export const metadata = {
  title: "Impressum | PIXERYO",
  description: "Rechtliche Informationen über PIXERYO und Unternehmensdetails."
};

export default function ImprintPage() {
  return (
    <LegalPageLayout title="Impressum" lastUpdated="30. April 2025">
      <h2>Betreiber der Website</h2>
      <p>
        CLIPOZA LTD.<br />
        Unternehmensregistrierungsnummer: 16434384<br />
        Geschäftsführer: Cemaliye AKGOR<br />
        E-Mail: info@pixeryo.com<br />
        Rechtliche Adresse: 71-75 Shelton Street, Covent Garden, London, Vereinigtes Königreich, WC2H 9JQ
      </p>

      <h2>(1) Verantwortlichkeit für Inhalte:</h2>
      <p>
        Wir bemühen uns, die Inhalte auf unseren Seiten mit größter Sorgfalt zu erstellen. Wir können jedoch nicht die Richtigkeit, Vollständigkeit oder Aktualität der bereitgestellten Informationen garantieren. Wir sind für unsere eigenen Inhalte gesetzlich verantwortlich, sind jedoch nicht verpflichtet, von Dritten übertragene oder gespeicherte Informationen zu überwachen oder Umstände zu untersuchen, die auf rechtswidrige Aktivitäten hinweisen. Unsere Verpflichtungen zur Entfernung oder Sperrung rechtswidriger Inhalte, wie gesetzlich vorgeschrieben, bleiben unberührt.
      </p>

      <h2>(2) Verantwortlichkeit für Links:</h2>
      <p>
        Wir sind nicht verantwortlich für den Inhalt externer Links (Drittanbieter-Websites). Zum Zeitpunkt der Verlinkung haben wir keine Verstöße festgestellt. Wenn wir von Rechtsverletzungen erfahren, werden wir den betreffenden Link umgehend entfernen.
      </p>

      <h2>(3) Urheberrecht:</h2>
      <p>
        Der Inhalt unserer Webseiten ist durch das britische Urheberrecht geschützt. Sofern nicht ausdrücklich gesetzlich erlaubt, erfordert jede Nutzung, Vervielfältigung oder Bearbeitung urheberrechtlich geschützter Werke auf unserer Website die vorherige Zustimmung des Rechteinhabers. Vervielfältigungen sind nur für den privaten Gebrauch erlaubt und dürfen nicht für kommerzielle Zwecke verwendet werden. Unbefugte Nutzung urheberrechtlich geschützter Materialien kann zu Strafen führen.
      </p>
    </LegalPageLayout>
  );
} 