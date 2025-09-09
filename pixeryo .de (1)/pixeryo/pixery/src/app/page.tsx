import Link from 'next/link'
import Image from 'next/image'
import { FeaturedCategoriesGrid } from '@/components/ui/featured-categories-grid'
import { HeroGeometric } from '@/components/ui/shape-landing-hero'

// Category image mapping
const categoryImages: Record<string, string> = {
  Natur: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
  Business: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0',
  Technologie: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d',
  Urban: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390',
  Architektur: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625'
}

// Category descriptions
const categoryDescriptions: Record<string, string> = {
  Natur: 'Entdecken Sie unsere beeindruckende Sammlung von Landschaften, Tieren und Naturwundern',
  Business: 'Professionelle Bilder für Ihre Unternehmensbedürfnisse und Geschäftspräsentationen',
  Technologie: 'Moderne Tech-Bilder für Websites, Apps und digitale Produkte',
  Urban: 'Stadtlandschaften, Architektur und urbanes Leben aus aller Welt',
  Architektur: 'Schöne architektonische Designs, Gebäude und Innenräume'
}

export default function Home() {
  // Map German display names to English database names for URLs
  const categoryMapping: Record<string, string> = {
    'Natur': 'Nature',
    'Business': 'Business', 
    'Technologie': 'Technology',
    'Urban': 'Urban',
    'Architektur': 'Architecture'
  }
  
  const featuredCategories = ['Natur', 'Business', 'Technologie', 'Urban', 'Architektur'].map(category => ({
    title: category,
    description: categoryDescriptions[category],
    imageSrc: categoryImages[category],
    href: `/categories/${categoryMapping[category].toLowerCase()}`
  }));

  // Reorder categories to place Technologie in the middle (large position)
  const reorderedCategories = [
    featuredCategories[0], // Natur - top left
    featuredCategories[3], // Urban - top right
    featuredCategories[2], // Technologie - large middle
    featuredCategories[1], // Business - bottom left
    featuredCategories[4], // Architektur - bottom right
  ];

  return (
    <main className="flex min-h-screen flex-col items-center">
      <HeroGeometric 
        badge="Sammlung durchsuchen"
        title1="Premium Stock-Bilder für"
        title2="Kreative Profis"
      />

      <section className="w-full py-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2">Beliebte Kategorien</h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Entdecken Sie unsere beliebtesten Bildsammlungen mit unserem interaktiven Layout
          </p>
          <FeaturedCategoriesGrid categories={reorderedCategories} />
        </div>
      </section>

      <section className="w-full py-16 bg-gray-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2">Warum uns wählen</h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Wir bieten die höchste Qualität an Stock-Bildern für Profis und Kreative
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Hohe Qualität</h3>
              <p className="text-gray-600 dark:text-gray-300">Alle unsere Bilder sind sorgfältig für außergewöhnliche Qualität und Auflösung ausgewählt.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Lizenzfrei</h3>
              <p className="text-gray-600 dark:text-gray-300">Verwenden Sie unsere Bilder in Ihren kommerziellen und persönlichen Projekten ohne Namensnennung.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Regelmäßige Updates</h3>
              <p className="text-gray-600 dark:text-gray-300">Unsere Sammlung wächst ständig mit wöchentlich hinzugefügten neuen Bildern.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Bereit zu starten?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Melden Sie sich heute an und erhalten Sie Zugang zu Tausenden von Premium Stock-Bildern.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup"
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-md font-medium text-lg transition-all"
            >
              Anmelden
            </Link>
            <Link 
              href="/browse"
              className="bg-transparent border border-white text-white hover:bg-white/10 px-6 py-3 rounded-md font-medium text-lg transition-all"
            >
              Bilder durchsuchen
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
} 