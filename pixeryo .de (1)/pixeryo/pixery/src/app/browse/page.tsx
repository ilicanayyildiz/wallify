"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Coins, Loader2 } from "lucide-react"

interface Product {
  id: string
  title: string
  description: string
  price: number
  thumbnail_url: string
  category: string
}

export default function BrowsePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  
  // Function to translate product descriptions
  const translateDescription = (description: string) => {
    // First try exact match
    const exactTranslations: { [key: string]: string } = {
      'Happy family enjoying a picnic in a summer park.': 'Glückliche Familie genießt ein Picknick in einem Sommerpark.',
      'Aesthetically arranged healthy breakfast with fresh berries, yogurt, and coffee.': 'Ästhetisch arrangiertes gesundes Frühstück mit frischen Beeren, Joghurt und Kaffee.',
      'Vibrant assortment of fresh vegetables arranged on a wooden board.': 'Lebendige Auswahl frischer Gemüse auf einem Holzbrett arrangiert.',
      'Barista preparing specialty coffee in a trendy cafe environment.': 'Barista bereitet Spezialkaffee in einer trendigen Café-Umgebung zu.',
      'Young person cycling through city streets on a vintage bicycle.': 'Junge Person fährt mit einem Vintage-Fahrrad durch die Straßen der Stadt.',
      'Woman practicing yoga at sunrise on a peaceful beach.': 'Frau praktiziert Yoga bei Sonnenaufgang an einem friedlichen Strand.',
      'Serene mountain lake with perfect water reflection of surrounding peaks at sunrise.': 'Ruhiger Bergsee mit perfekter Wasserspiegelung der umliegenden Gipfel bei Sonnenaufgang.',
      'Clean desk setup with multiple monitors and smart devices.': 'Saubere Schreibtisch-Einrichtung mit mehreren Monitoren und Smart-Geräten.',
      'High-quality stock photo': 'Hochwertiges Stock-Foto',
      'Professional photography': 'Professionelle Fotografie',
      'Perfect for commercial use': 'Perfekt für kommerzielle Nutzung',
      'Royalty-free image': 'Lizenzfreies Bild',
      'Premium quality': 'Premium-Qualität',
      'Business and corporate use': 'Geschäfts- und Unternehmensnutzung',
      'Modern and contemporary': 'Modern und zeitgemäß',
      'Clean and minimalist': 'Sauber und minimalistisch',
      'Vibrant colors': 'Lebendige Farben',
      'High resolution': 'Hohe Auflösung',
      'Suitable for web and print': 'Geeignet für Web und Druck',
      'Creative and artistic': 'Kreativ und künstlerisch',
      'Natural lighting': 'Natürliche Beleuchtung',
      'Urban lifestyle': 'Urbaner Lebensstil',
      'Technology and innovation': 'Technologie und Innovation',
      'Architecture and design': 'Architektur und Design',
      'Nature and landscape': 'Natur und Landschaft',
      'Food and beverage': 'Essen und Getränke',
      'People and lifestyle': 'Menschen und Lebensstil',
      'Abstract and artistic': 'Abstrakt und künstlerisch',
      'Beautiful landscape photography': 'Schöne Landschaftsfotografie',
      'Professional business image': 'Professionelles Geschäftsbild',
      'Modern architectural design': 'Modernes architektonisches Design',
      'Creative abstract composition': 'Kreative abstrakte Komposition',
      'Delicious food photography': 'Leckere Food-Fotografie',
      'Lifestyle and people': 'Lifestyle und Menschen',
      'Urban cityscape': 'Städtische Stadtsilhouette',
      'Nature and wildlife': 'Natur und Tierwelt',
      'Art and creativity': 'Kunst und Kreativität',
      'Business and finance': 'Geschäft und Finanzen',
      'Health and wellness': 'Gesundheit und Wellness',
      'Travel and adventure': 'Reisen und Abenteuer',
      'Education and learning': 'Bildung und Lernen',
      'Sports and fitness': 'Sport und Fitness',
      'Entertainment and media': 'Unterhaltung und Medien',
      'Science and research': 'Wissenschaft und Forschung',
      'Transportation and logistics': 'Transport und Logistik',
      'Fashion and style': 'Mode und Stil',
      'Music and arts': 'Musik und Kunst',
      'Beautiful tropical palm trees against a stunning sunset sky.': 'Schöne tropische Palmen vor einem atemberaubenden Sonnenuntergangshimmel.',
      'Person enjoying music with high-quality headphones in a modern setting.': 'Person genießt Musik mit hochwertigen Kopfhörern in einer modernen Umgebung.',
      'Tropical paradise with palm trees and ocean view.': 'Tropisches Paradies mit Palmen und Meerblick.',
      'Music enthusiast with professional audio equipment.': 'Musikenthusiast mit professioneller Audio-Ausrüstung.',
      'Stunning beach scene with tropical vegetation.': 'Atemberaubende Strandszene mit tropischer Vegetation.',
      'Audio professional working in a modern studio.': 'Audio-Profi arbeitet in einem modernen Studio.',
      'Tropical landscape with beautiful natural scenery.': 'Tropische Landschaft mit wunderschöner natürlicher Szenerie.',
      'Music production setup with professional equipment.': 'Musikproduktions-Setup mit professioneller Ausrüstung.',
      'Peaceful tropical beach with crystal clear water.': 'Friedlicher tropischer Strand mit kristallklarem Wasser.',
      'Sound engineer working with audio mixing equipment.': 'Tontechniker arbeitet mit Audio-Mixing-Ausrüstung.',
      'Exotic tropical island with pristine beaches.': 'Exotische tropische Insel mit unberührten Stränden.',
      'Music studio with state-of-the-art recording equipment.': 'Musikstudio mit modernster Aufnahmeausrüstung.',
      'Tropical resort with luxury beachfront location.': 'Tropisches Resort mit luxuriöser Strandlage.',
      'Audio mixing console in a professional studio.': 'Audio-Mischpult in einem professionellen Studio.',
      'Beautiful tropical garden with exotic plants.': 'Schöner tropischer Garten mit exotischen Pflanzen.',
      'Beach bar with tropical drinks and ocean view.': 'Strandbar mit tropischen Getränken und Meerblick.',
      'Music festival with live performance setup.': 'Musikfestival mit Live-Performance-Setup.',
      'Professional audio recording studio.': 'Professionelles Audio-Aufnahmestudio.',
      'Tropical forest with lush green vegetation.': 'Tropischer Wald mit üppiger grüner Vegetation.',
      'Beach party with tropical atmosphere.': 'Strandparty mit tropischer Atmosphäre.',
      'Music concert with professional sound system.': 'Musikkonzert mit professionellem Soundsystem.',
      'High-quality audio recording equipment.': 'Hochwertige Audio-Aufnahmeausrüstung.',
      'White sand beach with crystal clear turquoise water and palm trees.': 'Weißer Sandstrand mit kristallklarem türkisfarbenem Wasser und Palmen.',
      'Person using VR headset with immersive visual display.': 'Person verwendet VR-Headset mit immersiver visueller Anzeige.',
      'Modern architectural details with geometric shapes and patterns.': 'Moderne architektonische Details mit geometrischen Formen und Mustern.',
      'Long exposure photography of city traffic with vibrant light trails.': 'Langzeitbelichtungsfotografie von Stadtverkehr mit lebendigen Lichtspuren.',
      'Abstract artwork created with colorful smoke on black background.': 'Abstrakte Kunstwerke mit farbigem Rauch auf schwarzem Hintergrund.',
      'Pathway through a vibrant autumn forest with red and golden leaves.': 'Pfad durch einen lebendigen Herbstwald mit roten und goldenen Blättern.',
      'Contemporary open plan office with minimalist design and natural lighting.': 'Zeitgemäßes Großraumbüro mit minimalistischem Design und natürlicher Beleuchtung.',
      'Close-up view of a person coding on a laptop with visible code on screen.': 'Nahaufnahme einer Person, die auf einem Laptop programmiert, mit sichtbarem Code auf dem Bildschirm.',
      'Flat lay of modern workspace with laptop, notebook, and coffee.': 'Flache Aufnahme eines modernen Arbeitsplatzes mit Laptop, Notizbuch und Kaffee.',
      'Professional team having a productive meeting in a conference room.': 'Professionelles Team führt ein produktives Meeting in einem Konferenzraum.',
      'A beautiful sunrise over mountains with vibrant colors reflecting on the valley...': 'Ein wunderschöner Sonnenaufgang über Bergen mit lebendigen Farben, die sich im Tal widerspiegeln...',
      'Professional team discussing ideas in a modern office setting. Great for corporat...': 'Professionelles Team diskutiert Ideen in einer modernen Büroumgebung. Perfekt für Unternehmens...',
      'Panoramic view of a city skyline at night with illuminated buildings and streets.': 'Panoramablick auf eine Stadtsilhouette bei Nacht mit beleuchteten Gebäuden und Straßen.',
      'Golden sunset over a tropical beach with palm trees silhouettes and calm ocean...': 'Goldener Sonnenuntergang über einem tropischen Strand mit Palmen-Silhouetten und ruhigem Ozean...',
      'Clean and minimal workspace with laptop, notebook and coffee cup on white desk.': 'Sauberer und minimalistischer Arbeitsplatz mit Laptop, Notizbuch und Kaffeetasse auf weißem Schreibtisch.',
      'Colorful abstract paint pattern with flowing liquid colors in blue, purple and...': 'Buntes abstraktes Farbmuster mit fließenden flüssigen Farben in Blau, Lila und...',
      'Fresh vegetable and grain bowl with avocado, quinoa, and mixed greens....': 'Frische Gemüse- und Getreideschale mit Avocado, Quinoa und gemischtem Grün....',
      'Modern technology workspace with multiple screens, keyboard and smart...': 'Moderner Technologie-Arbeitsplatz mit mehreren Bildschirmen, Tastatur und intelligenten Geräten...',
      'Misty forest path with sunlight streaming through tall trees creating a magical...': 'Nebeliger Waldweg mit Sonnenlicht, das durch hohe Bäume strömt und eine magische Atmosphäre schafft...',
      'Artist workspace with painting supplies, brushes and colorful palette.': 'Künstlerarbeitsplatz mit Malutensilien, Pinseln und bunter Palette.',
      'Calm mountain lake with perfect reflection of surrounding peaks and blue sky.': 'Ruhiger Bergsee mit perfekter Spiegelung der umliegenden Gipfel und blauen Himmel.',
      'Bold lines and geometric shapes of modern urban architecture captured fro...': 'Kühne Linien und geometrische Formen moderner urbaner Architektur, aufgenommen von...',
      'Bold lines and geometric shapes of modern urban architecture captured from...': 'Kühne Linien und geometrische Formen moderner urbaner Architektur, aufgenommen von...',
      'Golden sunset over a tropical beach with palm trees silhouettes and calm ocean waves.': 'Goldener Sonnenuntergang über einem tropischen Strand mit Palmen-Silhouetten und ruhigem Ozean.'
    }
    
    // Try exact match first
    if (exactTranslations[description]) {
      return exactTranslations[description]
    }
    
    // Try partial match for common patterns
    const partialTranslations: { [key: string]: string } = {
      'Golden sunset over a tropical beach with palm trees silhouettes and calm ocean': 'Goldener Sonnenuntergang über einem tropischen Strand mit Palmen-Silhouetten und ruhigem Ozean',
      'Bold lines and geometric shapes of modern urban architecture captured': 'Kühne Linien und geometrische Formen moderner urbaner Architektur, aufgenommen',
      'Colorful abstract paint pattern with flowing liquid colors in blue, purple': 'Buntes abstraktes Farbmuster mit fließenden flüssigen Farben in Blau, Lila',
      'Professional team discussing ideas in a modern office setting. Great for corporat': 'Professionelles Team diskutiert Ideen in einer modernen Büroumgebung. Perfekt für Unternehmens',
      'A beautiful sunrise over mountains with vibrant colors reflecting on the valley': 'Ein wunderschöner Sonnenaufgang über Bergen mit lebendigen Farben, die sich im Tal widerspiegeln',
      'Fresh vegetable and grain bowl with avocado, quinoa, and mixed greens': 'Frische Gemüse- und Getreideschale mit Avocado, Quinoa und gemischtem Grün',
      'Modern technology workspace with multiple screens, keyboard and smart': 'Moderner Technologie-Arbeitsplatz mit mehreren Bildschirmen, Tastatur und intelligenten Geräten',
      'Misty forest path with sunlight streaming through tall trees creating a magical': 'Nebeliger Waldweg mit Sonnenlicht, das durch hohe Bäume strömt und eine magische Atmosphäre schafft'
    }
    
    // Try partial match
    for (const [key, value] of Object.entries(partialTranslations)) {
      if (description.includes(key)) {
        return value + (description.endsWith('.') ? '.' : '')
      }
    }
    
    // Return original if no match found
    return description
  }

  // Function to translate product titles
  const translateTitle = (title: string) => {
    const translations: { [key: string]: string } = {
      'Family Picnic': 'Familienpicknick',
      'Gourmet Breakfast': 'Gourmet-Frühstück',
      'Colorful Vegetable Platter': 'Bunte Gemüseplatte',
      'Artisan Coffee Shop': 'Handwerkskaffee-Shop',
      'Urban Cycling': 'Städtisches Radfahren',
      'Morning Yoga': 'Morgen-Yoga',
      'Mountain Lake Reflection': 'Bergsee-Spiegelung',
      'Modern Tech Workspace': 'Moderner Tech-Arbeitsplatz',
      'Modern Office Building': 'Modernes Bürogebäude',
      'City Skyline at Sunset': 'Stadtsilhouette bei Sonnenuntergang',
      'Business Team Meeting': 'Geschäftsteam-Meeting',
      'Technology Innovation': 'Technologie-Innovation',
      'Nature Landscape': 'Naturlandschaft',
      'Urban Architecture': 'Städtische Architektur',
      'Abstract Art Design': 'Abstraktes Kunstdesign',
      'Food Photography': 'Food-Fotografie',
      'Lifestyle Portrait': 'Lifestyle-Porträt',
      'Creative Workspace': 'Kreativer Arbeitsplatz',
      'Digital Technology': 'Digitale Technologie',
      'Architectural Detail': 'Architektonisches Detail',
      'Natural Beauty': 'Natürliche Schönheit',
      'Business Presentation': 'Geschäftspräsentation',
      'Modern Interior': 'Modernes Interieur',
      'Urban Lifestyle': 'Urbaner Lebensstil',
      'Artistic Composition': 'Künstlerische Komposition',
      'Professional Headshot': 'Professionelles Porträt',
      'Creative Concept': 'Kreatives Konzept',
      'Contemporary Design': 'Zeitgemäßes Design',
      'Vintage Bicycle': 'Vintage-Fahrrad',
      'Beach Yoga': 'Strand-Yoga',
      'Mountain Reflection': 'Bergspiegelung',
      'Tech Setup': 'Tech-Einrichtung',
      'Office Meeting': 'Büro-Meeting',
      'City Street': 'Stadtstraße',
      'Nature Scene': 'Naturszene',
      'Architecture Photo': 'Architektur-Foto',
      'Abstract Design': 'Abstraktes Design',
      'Food Image': 'Essensbild',
      'Lifestyle Photo': 'Lifestyle-Foto',
      'Creative Art': 'Kreative Kunst',
      'Digital Workspace': 'Digitaler Arbeitsplatz',
      'Building Detail': 'Gebäudedetail',
      'Beautiful Nature': 'Schöne Natur',
      'Business Photo': 'Geschäftsbild',
      'Interior Design': 'Innenarchitektur',
      'Street Life': 'Straßenleben',
      'Artistic Photo': 'Künstlerisches Foto',
      'Portrait Photo': 'Porträt-Foto',
      'Creative Idea': 'Kreative Idee',
      'Modern Design': 'Modernes Design',
      'Tropical Paradise': 'Tropisches Paradies',
      'Palm Tree Sunset': 'Palmen-Sonnenuntergang',
      'Music Lover': 'Musikliebhaber',
      'Headphone User': 'Kopfhörer-Nutzer',
      'Beach Scene': 'Strandszene',
      'Tropical Beach': 'Tropischer Strand',
      'Music Studio': 'Musikstudio',
      'Audio Equipment': 'Audio-Ausrüstung',
      'Tropical Landscape': 'Tropische Landschaft',
      'Beach Vacation': 'Strandurlaub',
      'Music Production': 'Musikproduktion',
      'Sound Engineering': 'Tontechnik',
      'Island Paradise': 'Inselparadies',
      'Ocean View': 'Meerblick',
      'Music Session': 'Musiksession',
      'Audio Mixing': 'Audio-Mixing',
      'Tropical Resort': 'Tropisches Resort',
      'Beach House': 'Strandhaus',
      'Music Equipment': 'Musikausrüstung',
      'Sound System': 'Soundsystem',
      'Tropical Garden': 'Tropischer Garten',
      'Beach Bar': 'Strandbar',
      'Music Festival': 'Musikfestival',
      'Audio Studio': 'Audio-Studio',
      'Tropical Forest': 'Tropischer Wald',
      'Beach Party': 'Strandparty',
      'Music Concert': 'Musikkonzert',
      'Audio Recording': 'Audio-Aufnahme',
      'Tropical Beach Paradise': 'Tropisches Strandparadies',
      'Virtual Reality Experience': 'Virtual Reality Erlebnis',
      'Geometric Patterns': 'Geometrische Muster',
      'Light Trails': 'Lichtspuren',
      'Colored Smoke Art': 'Farbiger Rauch-Kunst',
      'Autumn Forest Path': 'Herbstwald-Pfad',
      'Modern Office Space': 'Moderner Büroraum',
      'Coding on Laptop': 'Programmieren am Laptop',
      'Workspace Essentials': 'Arbeitsplatz-Essentials',
      'Business Meeting': 'Geschäftstreffen',
      'Mountain Sunrise': 'Bergsonnenaufgang',
      'City Lights at Night': 'Stadtlichter bei Nacht',
      'Beach Sunset': 'Strandsonnenuntergang',
      'Modern Workspace': 'Moderner Arbeitsplatz',
      'Abstract Art': 'Abstrakte Kunst',
      'Healthy Food Bowl': 'Gesunde Essensschale',
      'Technology Desk': 'Technologie-Schreibtisch',
      'Forest Path': 'Waldweg',
      'Modern Architecture': 'Moderne Architektur'
    }
    
    // Try to find a translation, otherwise return original
    return translations[title] || title
  }
  
  const INITIAL_PRODUCTS_COUNT = 16
  const PRODUCTS_PER_PAGE = 8

  // Memoize the fetchProducts function so it can be called in both useEffect and the load more button
  const fetchProducts = useCallback(async (pageNumber = 1, append = false) => {
    try {
      const fromIndex = pageNumber === 1 ? 0 : (pageNumber - 1) * PRODUCTS_PER_PAGE + INITIAL_PRODUCTS_COUNT - PRODUCTS_PER_PAGE
      const toIndex = pageNumber === 1 ? INITIAL_PRODUCTS_COUNT - 1 : fromIndex + PRODUCTS_PER_PAGE - 1
      
      // Create a base query
      let query = supabase.from('products').select('*')
      
      // Apply category filter if selected
      if (selectedCategory) {
        query = query.eq('category', selectedCategory)
      }
      
      // Execute the query with pagination
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(fromIndex, toIndex)
        .limit(pageNumber === 1 ? INITIAL_PRODUCTS_COUNT : PRODUCTS_PER_PAGE)
        
      if (error) {
        console.error("Fehler beim Laden der Produkte:", error)
        return
      }

      // Check if there are more products to load
      if (data.length < (pageNumber === 1 ? INITIAL_PRODUCTS_COUNT : PRODUCTS_PER_PAGE)) {
        setHasMore(false)
      }

      // Translate product data before setting
      const translatedData = data.map((product: Product) => ({
        ...product,
        title: translateTitle(product.title),
        description: translateDescription(product.description)
      }))

      if (append) {
        setProducts(prev => [...prev, ...translatedData] as Product[])
      } else {
        setProducts(translatedData as Product[])
      }
    } catch (error) {
      console.error("Fehler beim Laden der Produkte:", error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [selectedCategory])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .not('category', 'is', null)

      if (error) {
        console.error("Fehler beim Laden der Kategorien:", error)
        return
      }

      // Extract unique categories
      const categorySet = new Set(data.map(item => item.category))
      const uniqueCategories = Array.from(categorySet) as string[]
      setCategories(uniqueCategories)
    } catch (error) {
      console.error("Fehler beim Laden der Kategorien:", error)
    }
  }

  const handleLoadMore = async () => {
    setLoadingMore(true)
    const nextPage = page + 1
    setPage(nextPage)
    await fetchProducts(nextPage, true)
  }

  useEffect(() => {
    setLoading(true)
    setPage(1)
    setHasMore(true)
    fetchProducts(1, false)
    fetchCategories()
  }, [selectedCategory, fetchProducts])

  return (
    <div className="container mx-auto py-12">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold">Stock-Bilder durchsuchen</h1>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              Alle
            </Button>
            {categories.map(category => {
              // Translate category names to German
              const categoryTranslations: { [key: string]: string } = {
                'Urban': 'Stadt',
                'Nature': 'Natur',
                'Art': 'Kunst',
                'Food': 'Essen',
                'Technology': 'Technologie',
                'Abstract': 'Abstrakt',
                'Business': 'Geschäft',
                'Architecture': 'Architektur',
                'Lifestyle': 'Lebensstil',
                'People': 'Menschen',
                'Travel': 'Reisen',
                'Sports': 'Sport',
                'Animals': 'Tiere',
                'Education': 'Bildung',
                'Health': 'Gesundheit',
                'Entertainment': 'Unterhaltung',
                'Science': 'Wissenschaft',
                'Transportation': 'Transport',
                'Fashion': 'Mode',
                'Music': 'Musik'
              }
              
              const translatedCategory = categoryTranslations[category] || category
              
              return (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {translatedCategory}
                </Button>
              )
            })}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden bg-card border border-border">
                <div className="h-40 bg-gray-200 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3 mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-gray-600">Keine Bilder gefunden</h2>
            <p className="text-muted-foreground mt-2">
              {selectedCategory 
                ? `Es gibt keine Bilder in der Kategorie "${selectedCategory}".` 
                : "Derzeit sind keine Bilder verfügbar."}
            </p>
            {selectedCategory && (
              <Button className="mt-4" onClick={() => setSelectedCategory(null)}>
                Alle Bilder anzeigen
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <Link 
                  key={product.id} 
                  href={`/product/${product.id}`}
                  className="group rounded-lg overflow-hidden bg-card border border-border hover:shadow-md transition-all"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <Image
                      src={product.thumbnail_url}
                      alt={product.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all z-10" />
                  </div>
                  <div className="p-4">
                    <h2 className="font-medium truncate">{product.title}</h2>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1 h-10">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-lg font-semibold flex items-center">
                        <Coins className="h-4 w-4 mr-1" />
                        {product.price} Credits
                      </span>
                      <Button size="sm">Details anzeigen</Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {hasMore && (
              <div className="flex justify-center mt-12">
                <Button 
                  onClick={handleLoadMore} 
                  disabled={loadingMore}
                  variant="outline"
                  size="lg"
                  className="min-w-[200px]"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Wird geladen...
                    </>
                  ) : (
                    "Mehr laden"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
} 