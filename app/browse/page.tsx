'use client'

import Link from 'next/link'
import Header from '@/components/Header'
import { useLanguage } from '@/contexts/LanguageContext'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function BrowsePage() {
  const { t, language } = useLanguage()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      const supabase = createClient()
      
      // Tüm yayınlanmış ürünleri getir
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching products:', error)
      } else {
        setProducts(data || [])
      }
      setLoading(false)
    }

    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-black dark:via-neutral-900 dark:to-black transition-colors duration-300">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-600 bg-clip-text text-transparent">
            {language === 'tr' ? 'Tüm Duvar Kağıtlarını Gözat' : 'Browse All Wallpapers'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-neutral-300 max-w-2xl mx-auto">
            {language === 'tr' 
              ? 'Premium duvar kağıtlarımızın tam koleksiyonunu keşfedin'
              : 'Discover our complete collection of premium wallpapers'
            }
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              {language === 'tr' ? 'Tüm Duvar Kağıtları' : 'All Wallpapers'}
            </h2>
            <span className="text-gray-600 dark:text-neutral-400">
              {products?.length || 0} {language === 'tr' ? 'duvar kağıdı' : 'wallpapers'}
            </span>
          </div>
          
          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link 
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group"
                >
                  <div className="bg-white/50 dark:bg-neutral-800/50 rounded-2xl overflow-hidden hover:bg-white/80 dark:hover:bg-neutral-700/80 border border-gray-200 dark:border-neutral-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                    {/* Product Image */}
                    <div className="aspect-[4/3] overflow-hidden">
                      {product.image_path ? (
                        <img 
                          src={product.image_path} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 dark:bg-neutral-700 flex items-center justify-center">
                          <span className="text-4xl">🎨</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-2 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                          <span className="text-sm font-medium">
                            {product.credits_cost || 1} {language === 'tr' ? 'kredi' : 'credits'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-neutral-400">
                          {new Date(product.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <span className="text-6xl mb-4 block">🎨</span>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                {language === 'tr' ? 'Duvar kağıdı bulunamadı' : 'No wallpapers found'}
              </h3>
              <p className="text-gray-600 dark:text-neutral-400 mb-6">
                {language === 'tr' 
                  ? 'Koleksiyonumuza daha fazla duvar kağıdı eklemek için çalışıyoruz.'
                  : 'We\'re working on adding more wallpapers to our collection.'
                }
              </p>
              <Link 
                href="/categories"
                className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                {language === 'tr' ? 'Kategorileri Gözat' : 'Browse Categories'}
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
