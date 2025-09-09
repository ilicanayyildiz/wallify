'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import { Download, Heart, Share2, Eye, Calendar, Image as ImageIcon, CreditCard } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [product, setProduct] = useState<any>(null)
  const [userCredits, setUserCredits] = useState(0)
  const [loading, setLoading] = useState(true)
  const [similarProducts, setSimilarProducts] = useState<any[]>([])
  const { t, language } = useLanguage()
  
  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      
      // Get product details
      const { data: productData, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
      
      if (productData) {
        setProduct(productData)
        
        // Get similar products
        const { data: similarData } = await supabase
          .from('products')
          .select('id, name, image_path, credits_cost')
          .eq('is_published', true)
          .neq('id', id)
          .limit(6)
        
        setSimilarProducts(similarData || [])
      }
      
      // Get user credits
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('credits')
          .eq('id', user.id)
          .single()
        
        setUserCredits(profile?.credits || 0)
      }
      
      setLoading(false)
    }
    
    fetchData()
  }, [id])
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white">
        <Header />
        <div className="pt-32 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-xl text-neutral-300">
              {language === 'tr' ? 'Ürün yükleniyor...' : 'Loading product...'}
            </p>
          </div>
        </div>
      </div>
    )
  }
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white">
        <Header />
        <div className="pt-32 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-400 mb-4">
              {language === 'tr' ? 'Ürün Bulunamadı' : 'Product Not Found'}
            </h1>
            <p className="text-neutral-300 mb-6">
              {language === 'tr' ? 'Aradığınız ürün mevcut değil.' : 'The product you\'re looking for doesn\'t exist.'}
            </p>
            <Link href="/protected" className="text-blue-400 hover:text-blue-300">
              {language === 'tr' ? 'Tüm Duvar Kağıtlarını Gözat' : 'Browse All Wallpapers'}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white">
      <Header />
      
      {/* Product Details Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Product Image */}
            <div className="relative group">
              <div className="aspect-[4/3] bg-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
                {product.image_path ? (
                  <img 
                    src={product.image_path} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-24 h-24 text-neutral-600" />
                  </div>
                )}
              </div>
              
              {/* Image Actions */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="p-3 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-xl transition-all hover:scale-110">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-3 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-xl transition-all hover:scale-110">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Quality Badge */}
              <div className="absolute top-4 left-4">
                <div className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                  <span>⭐</span>
                  {language === 'tr' ? 'Premium' : 'Premium'}
                </div>
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-8">
              {/* Title and Category */}
              <div>
                <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 text-sm font-medium rounded-full mb-4 border border-blue-500/30">
                  {language === 'tr' ? 'Duvar Kağıdı' : 'Wallpaper'}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  {product.name}
                </h1>
                <p className="text-xl text-neutral-300 leading-relaxed">
                  {product.description || (language === 'tr' 
                    ? 'Cihazlarınız için güzel, yüksek kaliteli duvar kağıdı.'
                    : 'Beautiful high-quality wallpaper for your devices.'
                  )}
                </p>
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-neutral-400">
                  <Eye className="w-5 h-5 text-blue-400" />
                  <span>{language === 'tr' ? 'Çözünürlük' : 'Resolution'}: 6016 × 4016</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-400">
                  <Calendar className="w-5 h-5 text-green-400" />
                  <span>{language === 'tr' ? 'Eklenme' : 'Added'}: {new Date(product.created_at).toLocaleDateString('en-GB')}</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-400">
                  <Download className="w-5 h-5 text-purple-400" />
                  <span>{language === 'tr' ? 'İndirmeler' : 'Downloads'}: {language === 'tr' ? 'Sınırsız' : 'Unlimited'}</span>
                </div>
              </div>

              {/* Pricing and Purchase */}
              <div className="bg-neutral-900/50 rounded-2xl border border-neutral-800 p-8 shadow-xl">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <CreditCard className="w-8 h-8 text-blue-400" />
                    <div className="text-4xl font-bold text-blue-400">
                      {product.credits_cost} {language === 'tr' ? 'kredi' : 'credits'}
                    </div>
                  </div>
                  <div className={`text-lg font-medium ${userCredits >= product.credits_cost ? 'text-green-400' : 'text-red-400'}`}>
                    {language === 'tr' ? 'Bakiyeniz' : 'Your balance'}: {userCredits} {language === 'tr' ? 'kredi' : 'credits'}
                  </div>
                </div>

                <div className="space-y-4">
                  {userCredits >= product.credits_cost ? (
                    <button 
                      onClick={async () => {
                        try {
                          // First, purchase the product
                          const checkoutResponse = await fetch('/api/checkout', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            body: `product_id=${product.id}`
                          })
                          
                          if (checkoutResponse.ok) {
                            // Show success message
                            alert(language === 'tr' 
                              ? `${product.name} başarıyla satın alındı! Profilinizden indirebilirsiniz.` 
                              : `Successfully purchased ${product.name}! You can download it from your profile.`
                            )
                            
                            // Redirect to dashboard
                            window.location.href = '/dashboard'
                          } else {
                            const error = await checkoutResponse.json()
                            alert(language === 'tr' 
                              ? `Satın alma başarısız: ${error.error}` 
                              : `Purchase failed: ${error.error}`
                            )
                          }
                        } catch (error) {
                          console.error('Purchase error:', error)
                          alert(language === 'tr' 
                            ? 'Satın alma başarısız. Lütfen tekrar deneyin.' 
                            : 'Purchase failed. Please try again.'
                          )
                        }
                      }}
                      className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 text-lg"
                    >
                      {language === 'tr' ? 'Satın Al' : 'Purchase'} - {product.credits_cost} {language === 'tr' ? 'kredi' : 'credits'}
                    </button>
                  ) : (
                    <button 
                      disabled
                      className="w-full px-6 py-4 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-red-500/30 text-lg"
                    >
                      {language === 'tr' ? 'Yetersiz Kredi' : 'Insufficient Credits'} - {language === 'tr' ? 'Daha fazla' : 'Need'} {product.credits_cost - userCredits} {language === 'tr' ? 'kredi gerekli' : 'more'}
                    </button>
                  )}
                  
                  <Link
                    href="/add-credits"
                    className="block w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all text-center text-lg transform hover:scale-105"
                  >
                    {language === 'tr' ? 'Kredi Ekle' : 'Add Credits'}
                  </Link>
                </div>

                <div className="mt-8 p-6 bg-neutral-800/50 rounded-xl border border-neutral-700">
                  <h3 className="text-lg font-semibold text-white mb-3 text-center">
                    {language === 'tr' ? 'Satın aldığınızda:' : 'When you purchase:'}
                  </h3>
                  <ul className="space-y-2 text-sm text-neutral-300">
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      {language === 'tr' ? 'Yüksek çözünürlük versiyonu (6016 × 4016)' : 'High-resolution version (6016 × 4016)'}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      {language === 'tr' ? 'Sınırsız indirme hakkı' : 'Unlimited download rights'}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      {language === 'tr' ? 'Ticari lisans dahil' : 'Commercial license included'}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      {language === 'tr' ? 'Profilinizden istediğiniz zaman indirme' : 'Download anytime from your profile'}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Products */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            {language === 'tr' ? 'Benzer Ürünler' : 'Similar Products'}
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {similarProducts?.map((similarProduct) => (
              <Link 
                key={similarProduct.id}
                href={`/product/${similarProduct.id}`}
                className="group"
              >
                <div className="aspect-square bg-neutral-800 rounded-xl overflow-hidden mb-3 shadow-lg group-hover:shadow-2xl transition-all duration-300">
                  {similarProduct.image_path ? (
                    <img 
                      src={similarProduct.image_path} 
                      alt={similarProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-neutral-600" />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors truncate">
                    {similarProduct.name}
                  </h3>
                  <p className="text-sm text-neutral-400 flex items-center justify-center gap-1 mt-1">
                    <CreditCard className="w-3 h-3" />
                    {similarProduct.credits_cost} credits
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {(!similarProducts || similarProducts.length === 0) && (
            <div className="text-center py-12">
              <p className="text-neutral-400">No similar products found.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
