import Link from 'next/link'
import Header from '@/components/Header'
import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/ProductCard'

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

interface Category {
  id: string
  name: string
  slug: string
  image_url: string
  description: string | null
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params // params'ı await et
  const supabase = await createClient() // createClient'ı await et
  
  // URL'deki kategori adını gerçek kategori adına map et
  const categoryMapping: { [key: string]: string } = {
    'retro-vintage': 'Retro & Vintage',
    'gaming': 'Gaming',
    'work-motivation': 'Work & Motivation',
    'nature-landscape': 'Nature & Landscape',
    'movies-series': 'Movies & Series',
    'art-minimal': 'Art & Minimal',
    'tech-space': 'Tech & Space',
    'cars-motorcycles': 'Cars & Motorcycles',
    'sports-teams': 'Sports & Teams'
  }
  
  const categoryName = categoryMapping[category] || category.charAt(0).toUpperCase() + category.slice(1)
  
  // Bu kategorideki ürünleri getir
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, image_path, credits_cost, created_at')
    .eq('is_published', true)
    .eq('category', categoryName) // Kategori adına göre filtrele
    .order('created_at', { ascending: false })

  if (productsError) {
    console.error('Error fetching products for category:', productsError)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-white">
            {categoryName} Wallpapers ({products?.length || 0})
          </h1>
          <Link href="/categories" className="text-blue-400 hover:underline">
            &larr; Back to Categories
          </Link>
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product: any) => (
              <ProductCard
                key={product.id}
                id={product.id.toString()}
                title={product.name}
                slug={product.name.toLowerCase().replace(/\s+/g, '-')}
                cover_url={product.image_path}
                price={product.credits_cost || 1}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-neutral-400 text-xl py-10">
            No wallpapers found in this category yet.
          </div>
        )}

        <section className="text-center mt-20">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Explore More
          </h2>
          <p className="text-xl text-neutral-300 max-w-2xl mx-auto mb-8">
            Discover other amazing wallpapers across all categories.
          </p>
          <Link
            href="/browse"
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          >
            Browse All Wallpapers
          </Link>
        </section>
      </main>
    </div>
  )
}
