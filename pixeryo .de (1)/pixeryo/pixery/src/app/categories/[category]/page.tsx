import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface CategoryPageProps {
  params: {
    category: string
  }
}

interface Product {
  id: string
  title: string
  description: string
  price: number
  thumbnail_url: string
  image_url: string
  category: string
  resolution: string
  created_at: string
  updated_at: string | null
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = params
  
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
  
  // Capitalize first letter for display
  const displayCategory = category.charAt(0).toUpperCase() + category.slice(1)
  const translatedCategory = categoryTranslations[displayCategory] || displayCategory
  
  // Fetch products by category
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', displayCategory)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching products:', error)
    return notFound()
  }
  
  if (!products || products.length === 0) {
    return (
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">{translatedCategory} Bilder</h1>
        <p className="text-lg text-gray-600">Keine Bilder in dieser Kategorie gefunden.</p>
        <Link 
          href="/browse"
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Alle Bilder durchsuchen
        </Link>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-2">{translatedCategory} Bilder</h1>
      <p className="text-lg text-gray-600 mb-8">
        Durchsuchen Sie unsere Sammlung von {products.length} Premium-{translatedCategory.toLowerCase()}-Bildern
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product: Product) => (
          <Link 
            key={product.id}
            href={`/product/${product.id}`}
            className="group"
          >
            <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-md">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={product.thumbnail_url}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 line-clamp-1">{product.title}</h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-gray-500">{product.resolution}</span>
                  <span className="font-semibold">{product.price} Credits</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 