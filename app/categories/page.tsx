'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Image as ImageIcon } from 'lucide-react'
import Header from '@/components/Header'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/contexts/LanguageContext'

interface Category {
  name: string
  image: string
  count: number
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const { t, language } = useLanguage()

  // Kategori isimlerini çevir
  const translateCategoryName = (name: string) => {
    if (language === 'tr') {
      const translations: { [key: string]: string } = {
        'Nature & Landscapes': 'Doğa ve Manzaralar',
        'Abstract & Patterns': 'Soyut ve Desenler',
        'Technology & Gaming': 'Teknoloji ve Oyun',
        'Space & Astronomy': 'Uzay ve Astronomi',
        'Cars & Motorcycles': 'Arabalar ve Motosikletler',
        'Sports & Teams': 'Spor ve Takımlar'
      }
      return translations[name] || name
    }
    return name
  }

  useEffect(() => {
    const fetchCategoriesWithCounts = async () => {
      const supabase = createClient()
      
      // Kategorileri ve ürün sayılarını getir
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .eq('is_published', true)

      if (error) {
        console.error('Error fetching products:', error)
        return
      }

      // Kategori sayılarını hesapla
      const categoryCounts: { [key: string]: number } = {}
      data?.forEach(product => {
        if (product.category) {
          categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1
        }
      })

      // Kategorileri oluştur
      const categoriesWithCounts = [
        {
          name: 'Retro & Vintage',
          image: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=728&auto=format&fit=crop',
          count: categoryCounts['Retro & Vintage'] || 0
        },
        {
          name: 'Gaming',
          image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop',
          count: categoryCounts['Gaming'] || 0
        },
        {
          name: 'Work & Motivation',
          image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
          count: categoryCounts['Work & Motivation'] || 0
        },
        {
          name: 'Nature & Landscape',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
          count: categoryCounts['Nature & Landscape'] || 0
        },
        {
          name: 'Movies & Series',
          image: 'https://images.unsplash.com/photo-1635616208778-3d034a225ac6?q=80&w=764&auto=format&fit=crop',
          count: categoryCounts['Movies & Series'] || 0
        },
        {
          name: 'Art & Minimal',
          image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
          count: categoryCounts['Art & Minimal'] || 0
        },
        {
          name: 'Tech & Space',
          image: 'https://images.unsplash.com/photo-1457364887197-9150188c107b?q=80&w=1170&auto=format&fit=crop',
          count: categoryCounts['Tech & Space'] || 0
        },
        {
          name: 'Cars & Motorcycles',
          image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
          count: categoryCounts['Cars & Motorcycles'] || 0
        },
        {
          name: 'Sports & Teams',
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
          count: categoryCounts['Sports & Teams'] || 0
        }
      ]

      setCategories(categoriesWithCounts)
      setLoading(false)
    }

    fetchCategoriesWithCounts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-black dark:via-neutral-900 dark:to-black transition-colors duration-300">
        <Header />
        <div className="pt-32 text-center">
          <div className="text-2xl text-gray-800 dark:text-white">
            {language === 'tr' ? 'Kategoriler Yükleniyor...' : 'Loading Categories...'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-black dark:via-neutral-900 dark:to-black transition-colors duration-300">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-600 bg-clip-text text-transparent">
            {language === 'tr' ? 'Duvar Kağıdı Kategorileri' : 'Wallpaper Categories'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-neutral-300 max-w-2xl mx-auto">
            {language === 'tr' 
              ? 'Tema ve stile göre düzenlenmiş özenle seçilmiş duvar kağıdı koleksiyonlarımızı keşfedin'
              : 'Explore our curated wallpaper collections organized by theme and style'
            }
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link 
                key={index}
                href={`/categories/${category.name.toLowerCase().replace(/\s*&\s*/g, '-').replace(/\s+/g, '-')}`}
                className="group"
              >
                <div className="relative overflow-hidden rounded-2xl bg-white/50 dark:bg-neutral-800/50 hover:bg-white/80 dark:hover:bg-neutral-700/80 border border-gray-200 dark:border-neutral-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  {/* Category Image */}
                  <div className="aspect-[4/3] overflow-hidden">
                    {category.image ? (
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-neutral-700 flex items-center justify-center">
                        <ImageIcon className="w-16 h-16 text-gray-400 dark:text-neutral-500" />
                      </div>
                    )}
                  </div>
                  
                  {/* Category Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{translateCategoryName(category.name)}</h3>
                    <p className="text-white/80">{category.count} {language === 'tr' ? 'görsel' : 'images'}</p>
                  </div>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-800 dark:text-white">Ready to Explore?</h2>
          <p className="text-xl text-gray-600 dark:text-neutral-400 mb-8">
            Start browsing our categories and find the perfect wallpaper for your next project.
          </p>
          <Link 
            href="/protected"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Browse All Wallpapers
          </Link>
        </div>
      </section>
    </div>
  )
}
