import ProductCard from '@/components/ProductCard'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Header from '@/components/Header'

export default async function ProtectedPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('id, name, image_path, credits_cost')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white">
      <Header />
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            Premium Wallpapers
          </h1>
          <p className="text-xl md:text-2xl text-neutral-300 mb-8 max-w-3xl mx-auto">
            Discover our curated collection of high-quality wallpapers for your projects
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-neutral-400">
            <span>🎨 High Quality</span>
            <span>•</span>
            <span>📱 Multiple Resolutions</span>
            <span>•</span>
            <span>🚀 Instant Download</span>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
                           <div className="flex items-center justify-between mb-8">
                   <h2 className="text-3xl font-bold">Featured Wallpapers</h2>
                   <div className="text-neutral-400">
                     {products?.length || 0} wallpapers available • 1 Credit = 1 Wallpaper
                   </div>
                 </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(products ?? []).map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                title={p.name}
                slug={p.id.toString()}
                cover_url={p.image_path}
                price={p.credits_cost}
              />
            ))}
          </div>
          
          {(!products || products.length === 0) && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🎨</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">No Wallpapers Yet</h3>
              <p className="text-neutral-400 mb-6">Be the first to add amazing wallpapers to our collection!</p>
              <Link 
                href="/admin"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105"
              >
                Add Wallpaper
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
