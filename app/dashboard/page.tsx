'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { useLanguage } from '@/contexts/LanguageContext'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [purchasedProducts, setPurchasedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'purchases' | 'credits' | 'security'>('purchases')
  const [creditTransactions, setCreditTransactions] = useState<any[]>([])
  const router = useRouter()
  const supabase = createClient()
  const { t, language } = useLanguage()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error || !user) {
          router.push('/auth/login')
          return
        }
        setUser(user)
        
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (profileData) {
          setProfile(profileData)
        } else if (profileError && profileError.code === 'PGRST116') {
          // Create profile if it doesn't exist
          const { data: newProfile, error: createError } = await supabase
            .from('user_profiles')
            .insert({
              id: user.id,
              username: user.email?.split('@')[0] || 'user',
              credits: 0
            })
            .select()
            .single()
          
          if (newProfile) {
            setProfile(newProfile)
          }
        }
        
        // Fetch purchased products
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select(`
            id,
            created_at,
            order_items (
              product_id,
              credits_cost,
              products (
                id,
                name,
                image_path,
                description,
                file_path
              )
            )
          `)
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .order('created_at', { ascending: false })
        
        if (ordersData && ordersData.length > 0) {
          const products = ordersData.flatMap(order => 
            order.order_items?.map(item => ({
              ...item.products,
              credits_cost: item.credits_cost,
              purchased_at: order.created_at
            })) || []
          )
          setPurchasedProducts(products)
        }

        // Fetch credit transactions
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('credit_transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        
        if (transactionsData) {
          setCreditTransactions(transactionsData)
        }
        
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [supabase.auth, router])

  const handleDownload = async (productId: number, productName: string) => {
    try {
      const response = await fetch(`/api/download?product_id=${productId}`)
      
      if (!response.ok) {
        throw new Error('Download failed')
      }
      
      // Get the filename from the response headers
      const contentDisposition = response.headers.get('Content-Disposition')
      let filename = `${productName}.jpg` // default fallback
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download error:', error)
      alert('Download failed. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="pt-32 text-center">
          <div className="text-2xl">Loading...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      {/* Main Content */}
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          
          {/* Page Title */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">{t('dashboard.title')}</h1>
            <button className="px-4 py-2 border border-gray-600 text-white rounded hover:bg-gray-800 transition-colors">
              {t('auth.logout')}
            </button>
          </div>

          {/* Account Information Card */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6">{t('dashboard.accountInfo')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">
                    {language === 'tr' ? 'Ad' : 'Name'}
                  </div>
                  <div className="text-white">{user.email?.split('@')[0] || 'User'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">
                    {language === 'tr' ? 'Üyelik Tarihi' : 'Member Since'}
                  </div>
                  <div className="text-white">{new Date(user.created_at).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">
                    {language === 'tr' ? 'E-posta' : 'Email'}
                  </div>
                  <div className="text-white">{user.email}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">
                    {language === 'tr' ? 'Mevcut Krediler' : 'Available Credits'}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-bold">{profile?.credits || 0}</span>
                    <button 
                      onClick={() => router.push('/add-credits')}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {t('dashboard.addCredits')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6">
            <button 
              onClick={() => setActiveTab('purchases')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                activeTab === 'purchases' 
                  ? 'bg-white text-gray-900' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <span>📥</span>
              <span>{t('dashboard.yourPurchases')}</span>
            </button>
            <button 
              onClick={() => setActiveTab('credits')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                activeTab === 'credits' 
                  ? 'bg-white text-gray-900' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <span>💳</span>
              <span>{t('dashboard.creditManagement')}</span>
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                activeTab === 'security' 
                  ? 'bg-white text-gray-900' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <span>🔒</span>
              <span>{t('dashboard.security')}</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            
            {/* Your Purchases Tab */}
            {activeTab === 'purchases' && (
              <>
                {purchasedProducts.length > 0 ? (
                  <div className="space-y-4">
                    {purchasedProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-600 rounded-lg overflow-hidden flex-shrink-0">
                            {product.image_path ? (
                              <img 
                                src={product.image_path} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-gray-400">🖼️</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-white">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {product.credits_cost} {language === 'tr' ? 'kredi' : 'credits'} • {new Date(product.purchased_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownload(product.id, product.name)}
                          className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          {t('common.download')}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-400 mb-6">
                      {language === 'tr' ? 'Henüz hiç duvar kağıdı satın almadınız.' : 'You haven\'t purchased any wallpapers yet.'}
                    </p>
                    <button
                      onClick={() => router.push('/browse')}
                      className="px-6 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      {language === 'tr' ? 'Duvar Kağıtlarını Gözat' : 'Browse Wallpapers'}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Credit Management Tab */}
            {activeTab === 'credits' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    {language === 'tr' ? 'Kredi İşlemleri' : 'Credit Transactions'}
                  </h3>
                  <button
                    onClick={() => router.push('/add-credits')}
                    className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {t('dashboard.addCredits')}
                  </button>
                </div>
                
                {creditTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {creditTransactions.map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div>
                          <div className="text-white font-medium">
                            {transaction.type === 'purchase' ? (language === 'tr' ? 'Kredi Satın Alma' : 'Credit Purchase') : 
                             transaction.type === 'usage' ? (language === 'tr' ? 'Duvar Kağıdı İndirme' : 'Wallpaper Download') : 
                             transaction.type}
                          </div>
                          <div className="text-sm text-gray-400">
                            {transaction.description || (language === 'tr' ? 'Açıklama yok' : 'No description')}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className={`font-semibold ${
                          transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount} {language === 'tr' ? 'kredi' : 'credits'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-400 mb-6">
                      {language === 'tr' ? 'Henüz kredi işlemi yok.' : 'No credit transactions yet.'}
                    </p>
                    <button
                      onClick={() => router.push('/add-credits')}
                      className="px-6 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      {language === 'tr' ? 'Kredi Satın Al' : 'Buy Credits'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">
                  {language === 'tr' ? 'Güvenlik Ayarları' : 'Security Settings'}
                </h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">
                          {language === 'tr' ? 'Şifre Değiştir' : 'Change Password'}
                        </div>
                        <div className="text-sm text-gray-400">
                          {language === 'tr' ? 'Hesap şifrenizi güncelleyin' : 'Update your account password'}
                        </div>
                      </div>
                      <button
                        onClick={() => router.push('/auth/update-password')}
                        className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        {language === 'tr' ? 'Değiştir' : 'Change'}
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">
                          {language === 'tr' ? 'Hesap Durumu' : 'Account Status'}
                        </div>
                        <div className="text-sm text-gray-400">
                          {language === 'tr' ? 'Hesabınız aktif ve güvenli' : 'Your account is active and secure'}
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full">
                        {language === 'tr' ? 'Aktif' : 'Active'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">
                          {language === 'tr' ? 'Giriş Aktivitesi' : 'Login Activity'}
                        </div>
                        <div className="text-sm text-gray-400">
                          {language === 'tr' ? 'Son giriş: ' : 'Last login: '}{new Date(user.last_sign_in_at || user.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <span className="text-gray-400">📱</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  )
}
