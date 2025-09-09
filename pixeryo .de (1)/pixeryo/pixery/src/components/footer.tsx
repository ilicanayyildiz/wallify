import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-background border-t border-border py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <Image 
                src="/images/logo.svg" 
                alt="Pixeryo" 
                width={120} 
                height={32} 
                className="h-12 w-auto" 
              />
              <span className="text-xl font-bold">Pixeryo</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Hochwertige Stock-Bilder für kreative Profis und Unternehmen.
            </p>
            <p className="text-muted-foreground text-sm">
            <span className="text-l text-white font-bold">CLIPOZA LTD.</span> <br />
              Eingetragene Geschäftsadresse: <br />
              71-75 Shelton Street, Covent Garden, London, Vereinigtes Königreich, WC2H 9JQ 
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-4">Entdecken</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/browse" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Bilder durchsuchen
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Kategorien
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Unternehmen</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Über uns
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Preise
                </Link>
              </li>
              {/*
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              */}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Rechtliches</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/imprint" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/terms-of-use" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Nutzungsbedingungen
                </Link>
              </li>
              <li>
                <Link href="/content-license-agreement" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Inhaltslizenzvereinbarung
                </Link>
              </li>
              <li>
                <Link href="/user-agreement" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Benutzervereinbarung
                </Link>
              </li>
              <li>
                <Link href="/editorial-content-supply-agreement" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Redaktionsinhaltsliefervereinbarung
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6">
         <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Pixeryo. Alle Rechte vorbehalten.
            </p>
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-md shadow-sm">
                <Image
                  src="/images/payment-logos.png"
                  alt="Payment Methods - Visa, Mastercard, Visa Secure, Mastercard ID Check"
                  width={320}
                  height={50}
                  className="h-auto"
                />
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </footer>
  )
} 