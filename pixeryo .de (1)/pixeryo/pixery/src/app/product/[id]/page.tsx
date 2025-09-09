"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Coins, Check, Download, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

// Dialog components for confirmation modal
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Product {
  id: string
  title: string
  description: string
  price: number
  image_url: string
  thumbnail_url: string
  category: string
  resolution: string
  created_at: string
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [product, setProduct] = useState<Product | null>(null)
  const [userCredits, setUserCredits] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [loadingCredits, setLoadingCredits] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [alreadyPurchased, setAlreadyPurchased] = useState(false)
  const [similarProducts, setSimilarProducts] = useState<Product[]>([])
  const [loadingSimilar, setLoadingSimilar] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

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
      'Technology and innovation': 'Technologie und Innovation',
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
      'Professional team discussing ideas in a modern office setting. Great for corporat...': 'Professionelles Team diskutiert Ideen in einer modernen Büroumgebung. Perfekt für Unternehmens...',
      'A beautiful sunrise over mountains with vibrant colors reflecting on the valley...': 'Ein wunderschöner Sonnenaufgang über Bergen mit lebendigen Farben, die sich im Tal widerspiegeln...',
      'Golden sunset over a tropical beach with palm trees silhouettes and calm ocean...': 'Goldener Sonnenuntergang über einem tropischen Strand mit Palmen-Silhouetten und ruhigem Ozean...',
      'Colorful abstract paint pattern with flowing liquid colors in blue, purple and...': 'Buntes abstraktes Farbmuster mit fließenden flüssigen Farben in Blau, Lila und...',
      'Clean and minimal workspace with laptop, notebook and coffee cup on white desk.': 'Sauberer und minimalistischer Arbeitsplatz mit Laptop, Notizbuch und Kaffeetasse auf weißem Schreibtisch.',
      'Panoramic view of a city skyline at night with illuminated buildings and streets.': 'Panoramablick auf eine Stadtsilhouette bei Nacht mit beleuchteten Gebäuden und Straßen.',
      'Bold lines and geometric shapes of modern urban architecture captured from...': 'Kühne Linien und geometrische Formen moderner urbaner Architektur, aufgenommen von...',
      'Golden sunset over a tropical beach with palm trees silhouettes and calm ocean...': 'Goldener Sonnenuntergang über einem tropischen Strand mit Palmen-Silhouetten und ruhigem Ozean...',
      'Colorful abstract paint pattern with flowing liquid colors in blue, purple and...': 'Buntes abstraktes Farbmuster mit fließenden flüssigen Farben in Blau, Lila und...',
      'Professional team discussing ideas in a modern office setting. Great for corporat...': 'Professionelles Team diskutiert Ideen in einer modernen Büroumgebung. Perfekt für Unternehmens...',
      'A beautiful sunrise over mountains with vibrant colors reflecting on the valley...': 'Ein wunderschöner Sonnenaufgang über Bergen mit lebendigen Farben, die sich im Tal widerspiegeln...',
      'Fresh vegetable and grain bowl with avocado, quinoa, and mixed greens....': 'Frische Gemüse- und Getreideschale mit Avocado, Quinoa und gemischtem Grün....',
      'Modern technology workspace with multiple screens, keyboard and smart...': 'Moderner Technologie-Arbeitsplatz mit mehreren Bildschirmen, Tastatur und intelligenten Geräten...',
      'Misty forest path with sunlight streaming through tall trees creating a magical...': 'Nebeliger Waldweg mit Sonnenlicht, das durch hohe Bäume strömt und eine magische Atmosphäre schafft...'
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single()

        if (error) {
          console.error("Error fetching product:", error)
          setErrorMessage("Produkt nicht gefunden")
          return
        }

        setProduct(data as Product)
      } catch (error) {
        console.error("Error fetching product:", error)
          setErrorMessage("Produktdetails konnten nicht geladen werden")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  useEffect(() => {
    // Fetch user credits if logged in
    const fetchUserCredits = async () => {
      if (!user) {
        setLoadingCredits(false)
        return
      }
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('credits')
          .eq('id', user.id)
          .single()
          
        if (error) {
          console.error("Error fetching user credits:", error)
        } else {
          setUserCredits(data.credits || 0)
        }
      } catch (error) {
        console.error("Error fetching credits:", error)
      } finally {
        setLoadingCredits(false)
      }
    }
    
    fetchUserCredits()
  }, [user])

  useEffect(() => {
    // Check if user has already purchased this product
    const checkPurchaseStatus = async () => {
      if (!user || !id) {
        return
      }
      
      try {
        const { data, error } = await supabase
          .from('purchases')
          .select('id')
          .eq('user_id', user.id)
          .eq('product_id', id)
          .maybeSingle()
          
        if (error) {
          console.error("Error checking purchase status:", error)
        } else {
          setAlreadyPurchased(!!data)
        }
      } catch (error) {
        console.error("Error checking purchase status:", error)
      }
    }
    
    checkPurchaseStatus()
  }, [user, id])

  // Add new useEffect to fetch similar products
  useEffect(() => {
    const fetchSimilarProducts = async () => {
      if (!product || !product.category) return

      setLoadingSimilar(true)
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('category', product.category)
          .neq('id', id) // Exclude current product
          .order('created_at', { ascending: false })
          .limit(6)

        if (error) {
          console.error("Error fetching similar products:", error)
          return
        }

        setSimilarProducts(data as Product[])
      } catch (error) {
        console.error("Error fetching similar products:", error)
      } finally {
        setLoadingSimilar(false)
      }
    }

    if (product) {
      fetchSimilarProducts()
    }
  }, [product, id])

  const handlePurchase = async () => {
    if (!user) {
      router.push(`/login?redirect=/product/${id}`)
      return
    }

    if (!product) return

    // Check if user already purchased this product
    if (alreadyPurchased) {
      setErrorMessage("Sie haben dieses Bild bereits gekauft. Gehen Sie zu Ihrem Profil, um es herunterzuladen.")
      return
    }

    // Check if user has enough credits
    if (userCredits < product.price) {
      setErrorMessage(`Unzureichende Credits. Sie benötigen ${product.price} Credits, um dieses Bild zu kaufen.`)
      return
    }

    setPurchasing(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      // Record the purchase in the database
      // The database trigger will handle the credit deduction
      const { error } = await supabase
        .from('purchases')
        .insert([
          {
            user_id: user.id,
            product_id: product.id,
            amount: product.price,
          },
        ])

      if (error) {
        console.error("Error recording purchase:", error)
        if (error.message.includes('Insufficient credits')) {
          setErrorMessage("Sie haben nicht genügend Credits, um dieses Bild zu kaufen.")
        } else if (error.message.includes('unique constraint')) {
          setErrorMessage("Sie haben dieses Bild bereits gekauft. Gehen Sie zu Ihrem Profil, um es herunterzuladen.")
          setAlreadyPurchased(true)
        } else {
          setErrorMessage("Kauf konnte nicht abgeschlossen werden. Bitte versuchen Sie es erneut.")
        }
        return
      }

      // Update local state for credits
      setUserCredits(prev => prev - product.price)
      setAlreadyPurchased(true)
      
      // Show success modal instead of inline message
      setShowSuccessModal(true)
      
      // Remove automatic redirect to profile page
      // setTimeout(() => {
      //   router.push('/profile')
      // }, 2000)
    } catch (error) {
      console.error("Error processing purchase:", error)
      setErrorMessage("Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.")
    } finally {
      setPurchasing(false)
      setShowConfirmModal(false)
    }
  }

  const openPurchaseConfirmation = () => {
    setShowConfirmModal(true)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-[400px] bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded w-1/4"></div>
              <div className="h-12 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold text-red-500">Produkt nicht gefunden</h1>
        <p className="mt-4 text-muted-foreground">
          Das gesuchte Produkt existiert nicht oder wurde entfernt.
        </p>
        <Button className="mt-6" onClick={() => router.push('/browse')}>
          Andere Bilder durchsuchen
        </Button>
      </div>
    )
  }

  const hasEnoughCredits = userCredits >= product.price

  return (
    <div className="container mx-auto py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="rounded-lg overflow-hidden border border-border">
          <div className="relative h-[100%] w-full">
            <Image
              src={product.image_url || product.thumbnail_url}
              alt={product.title}
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{translateTitle(product.title)}</h1>
            <p className="text-muted-foreground mt-2">
              Kategorie: <span className="font-medium">{product.category}</span>
            </p>
          </div>

          <div className="border-t border-border pt-4">
            <h2 className="text-xl font-semibold mb-2">Beschreibung</h2>
            <p className="text-muted-foreground">{translateDescription(product.description)}</p>
          </div>

          <div className="border-t border-border pt-4">
            <h2 className="text-xl font-semibold mb-2">Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Auflösung</p>
                <p className="font-medium">{product.resolution || 'Nicht angegeben'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hinzugefügt</p>
                <p className="font-medium">{new Date(product.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Coins className="mr-2 h-5 w-5" />
                <span className="text-3xl font-bold">{product.price}</span>
                <span className="ml-1 text-muted-foreground"> Credits</span>
              </div>

              {user ? (
                <div className="flex flex-col items-end">
                  <div className="flex items-center mb-2">
                    <span className="text-sm mr-2">Ihr Guthaben:</span>
                    <span className={`font-medium ${hasEnoughCredits ? 'text-green-600' : 'text-red-600'}`}>
                      {loadingCredits ? '...' : userCredits} Credits
                    </span>
                  </div>
                  
                  {alreadyPurchased ? (
                    <div className="flex flex-col items-end">
                      <div className="flex items-center text-green-600 mb-2">
                        <Check className="w-4 h-4 mr-1" />
                        <span className="text-sm">Bereits gekauft</span>
                      </div>
                      <Link href="/profile">
                        <Button variant="outline" size="lg" className="flex items-center">
                          <Download className="w-4 h-4 mr-2" />
                          Zu Downloads
                        </Button>
                      </Link>
                    </div>
                  ) : hasEnoughCredits ? (
                    <Button 
                      size="lg" 
                      onClick={openPurchaseConfirmation}
                      disabled={purchasing}
                    >
                      {purchasing ? "Wird verarbeitet..." : "Kaufen"}
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setErrorMessage("Sie benötigen mehr Credits, um dieses Bild zu kaufen.")}
                        disabled={loadingCredits}
                      >
                        Unzureichende Credits
                      </Button>
                      <Link href="/add-credits">
                        <Button variant="outline" size="sm">
                          Credits hinzufügen
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              ) :
                <Button 
                  size="lg" 
                  onClick={() => router.push(`/login?redirect=/product/${id}`)}
                >
                  Anmelden zum Kaufen
                </Button>
              }
            </div>

            {errorMessage && (
              <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">
                {successMessage}
              </div>
            )}

            <p className="text-sm text-muted-foreground mt-4">
              Nach dem Kauf haben Sie Zugang zur hochauflösenden Version dieses Bildes
              in Ihrem Profil. Sie können es so oft herunterladen, wie Sie möchten.
            </p>
          </div>
        </div>
      </div>

      {/* Purchase Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Kauf bestätigen</DialogTitle>
            <DialogDescription>
              Sind Sie sicher, dass Sie dieses Bild für {product?.price} Credits kaufen möchten?
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center justify-center py-4">
            <div className="relative h-40 w-40 mx-auto">
              <Image
                src={product.thumbnail_url || product.image_url}
                alt={product.title}
                fill
                className="object-contain"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between px-4 py-2 bg-muted/50 rounded-md">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">Ihr Guthaben nach dem Kauf: {userCredits - product.price} Credits</span>
            </div>
          </div>

          <DialogFooter className="flex justify-between sm:justify-between gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmModal(false)}
            >
              Abbrechen
            </Button>
            <Button 
              onClick={handlePurchase}
              disabled={purchasing}
            >
              {purchasing ? "Wird verarbeitet..." : "Kauf bestätigen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-green-600">Kauf erfolgreich!</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative h-40 w-40 mx-auto mb-4">
              <Image
                src={product.thumbnail_url || product.image_url}
                alt={product.title}
                fill
                className="object-contain"
              />
            </div>
            <Check className="h-12 w-12 text-green-500 mb-2" />
            <p className="text-center text-lg mb-4">
              Sie können dieses Bild jetzt von Ihrem Profil herunterladen.
            </p>
          </div>

          <DialogFooter className="flex justify-center mt-4">
            <Button 
              onClick={() => router.push('/profile')}
              className="w-full"
            >
              Zu meinem Profil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Ähnliche Produkte</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {similarProducts.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <Link href={`/product/${item.id}`}>
                  <div className="relative h-40 w-full">
                    <Image 
                      src={item.thumbnail_url || item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-medium text-sm truncate">{item.title}</h3>
                    <div className="flex items-center mt-2">
                      <Coins className="h-3 w-3 mr-1" />
                      <span className="text-xs font-medium">{item.price}</span>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
          
          {loadingSimilar && (
            <div className="flex justify-center mt-4">
              <p className="text-muted-foreground">Ähnliche Produkte werden geladen...</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 