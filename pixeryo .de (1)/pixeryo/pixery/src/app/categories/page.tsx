"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { GlowingEffect } from "@/components/ui/glowing-effect"

interface Category {
  name: string
  count: number
  image_url: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Get all categories and count products in each
        const { data, error } = await supabase
          .from('products')
          .select('category, thumbnail_url')
          .not('category', 'is', null)

        if (error) {
          console.error("Error fetching categories:", error)
          return
        }

        // Process data to get categories with counts
        const categoryMap = new Map<string, { count: number; images: string[] }>()
        
        data.forEach(product => {
          if (!product.category) return
          
          if (!categoryMap.has(product.category)) {
            categoryMap.set(product.category, { count: 0, images: [] })
          }
          
          const category = categoryMap.get(product.category)!
          category.count++
          if (product.thumbnail_url) {
            category.images.push(product.thumbnail_url)
          }
        })

        // Convert to array and sort by count (most popular first)
        const processedCategories: Category[] = Array.from(categoryMap.entries()).map(([name, data]) => ({
          name,
          count: data.count,
          image_url: data.images[0] || 'https://images.unsplash.com/photo-1557682250-33bd709cbe85' // Default image if none available
        }))

        processedCategories.sort((a, b) => b.count - a.count)
        setCategories(processedCategories)
      } catch (error) {
        console.error("Error processing categories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Bildkategorien</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
            
            const translatedCategory = categoryTranslations[category.name] || category.name
            
            return (
              <div 
                key={category.name}
                className="relative rounded-xl overflow-hidden"
              >
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                  borderWidth={2}
                />
                <Link 
                  href={`/categories/${encodeURIComponent(category.name)}`}
                  className="group block relative bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-all z-10"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={category.image_url}
                      alt={translatedCategory}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                    <div className="absolute bottom-0 p-4 w-full">
                      <h2 className="text-white text-xl font-semibold">{translatedCategory}</h2>
                      <p className="text-white/80 text-sm">{category.count} {category.count === 1 ? 'Bild' : 'Bilder'}</p>
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
} 