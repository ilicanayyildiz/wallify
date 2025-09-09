'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { CreditCard, Check, X, LogIn } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AddCreditsPage() {
  const [selectedPackage, setSelectedPackage] = useState('500')
  const [customCredits, setCustomCredits] = useState('100')
  const [loading, setLoading] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const router = useRouter()
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [user, setUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)
  
  const supabase = createClient()
  const { language } = useLanguage()

  // Check authentication function
  const checkAuth = useCallback(async () => {
    try {
      // Add a timeout to prevent hanging
      const authPromise = supabase.auth.getUser()
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Auth timeout')), 20000)
      )
      
      const { data: { user }, error } = await Promise.race([authPromise, timeoutPromise]) as any
      
      if (error) {
        setUser(null)
      } else if (user) {
        setUser(user)
        
        // Also check if user profile exists
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (profileError) {
          // If profile not found, try to create one
          if (profileError.code === 'PGRST116') {
            try {
              await supabase
                .from('user_profiles')
                .insert({
                  id: user.id,
                  username: user.email?.split('@')[0] || 'user',
                  credits: 0
                })
                .select()
                .single()
            } catch (createError) {
              // Silent fail for profile creation
            }
          }
        }
      } else {
        setUser(null)
      }
    } catch (error) {
      setUser(null)
    } finally {
      setAuthLoading(false)
    }
  }, [supabase.auth])

  // Check authentication on component mount
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (authLoading) {
        setAuthLoading(false)
      }
    }, 15000)

    checkAuth()

    return () => clearTimeout(timeoutId)
  }, []) // Remove checkAuth from dependency to prevent infinite loop

  // Listen for auth state changes
  useEffect(() => {
    // Add a timeout for the auth state listener
    const listenerTimeout = setTimeout(() => {
      setAuthLoading(false)
    }, 10000)
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        clearTimeout(listenerTimeout)
        
        if (session?.user) {
          setUser(session.user)
        } else {
          setUser(null)
        }
        setAuthLoading(false)
      }
    )

    return () => {
      clearTimeout(listenerTimeout)
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const creditOptions = [
    { credits: 100, price: 1.00 },
    { credits: 500, price: 5.00, popular: true },
    { credits: 1000, price: 10.00 },
    { credits: 2000, price: 20.00 }
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      })
      
      if (error) throw error
      
      setShowLoginModal(false)
      setLoginEmail('')
      setLoginPassword('')
      
      // Refresh auth state
      await checkAuth()
      
    } catch (error: any) {
      setLoginError(error.message || 'Login failed. Please try again.')
    } finally {
      setLoginLoading(false)
    }
  }

  const handlePurchase = async (packageId: string, credits: number, price: number) => {
    if (!user) {
      setShowLoginModal(true)
      return
    }

    setLoading(true)
    
    try {
      // First, check current credits
      const { data: currentProfileBefore, error: profileErrorBefore } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileErrorBefore) {
        // Check if it's a table not found error
        if (profileErrorBefore.message?.includes('relation "user_profiles" does not exist')) {
          alert(language === 'tr' 
          ? 'Kullanıcı profilleri tablosu mevcut değil. Lütfen destek ile iletişime geçin.' 
          : 'User profiles table does not exist. Please contact support.'
        )
          return
        }
        
        // Check if it's a permission error
        if (profileErrorBefore.code === '42501') {
          alert(language === 'tr' 
          ? 'İzin reddedildi. Lütfen kimlik doğrulamanızı kontrol edin.' 
          : 'Permission denied. Please check your authentication.'
        )
          return
        }
        
        alert(language === 'tr' 
          ? `Mevcut krediler kontrol edilirken hata: ${profileErrorBefore.message}` 
          : `Error checking current credits: ${profileErrorBefore.message}`
        )
        return
      }

      // Create credit transaction
      const { data: transactionData, error } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: user.id,
          amount: credits,
          type: 'purchase',
          description: `Purchased ${credits} credits for €${price.toFixed(2)}`
        })
        .select()

      if (error) {
        alert(language === 'tr' 
          ? 'Kredi satın alma başarısız. Lütfen tekrar deneyin.' 
          : 'Credit purchase failed. Please try again.'
        )
        return
      }

      // Update user profile credits
      const newCredits = (currentProfileBefore?.credits || 0) + credits

      const { data: updatedProfile, error: finalUpdateError } = await supabase
        .from('user_profiles')
        .update({ credits: newCredits })
        .eq('id', user.id)
        .select()

      if (finalUpdateError) {
        alert(language === 'tr' 
          ? 'Krediler eklendi ancak profil güncellemesi başarısız.' 
          : 'Credits added but profile update failed.'
        )
        return
      }

      alert(`Successfully purchased ${credits} credits for €${price.toFixed(2)}!`)
      router.push('/dashboard')
      
    } catch (error) {
      alert(language === 'tr' 
        ? 'Satın alma başarısız. Lütfen tekrar deneyin.' 
        : 'Purchase failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleCustomPurchase = async () => {
    if (!user) {
      setShowLoginModal(true)
      return
    }

    const credits = parseInt(customCredits)
    if (credits < 25) {
      alert('Minimum purchase is 25 credits')
      return
    }

    setLoading(true)
    
    try {
      const price = (credits / 100).toFixed(2)

      // First, check current credits
      const { data: currentProfileBefore, error: profileErrorBefore } = await supabase
        .from('user_profiles')
        .select('credits')
        .eq('id', user.id)
        .single()

      if (profileErrorBefore) {
        alert('Error checking current credits. Please try again.')
        return
      }

      // Create credit transaction
      const { data: transactionData, error } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: user.id,
          amount: credits,
          type: 'purchase',
          description: `Purchased ${credits} custom credits for €${price}`
        })
        .select()

      if (error) {
        alert(language === 'tr' 
          ? 'Kredi satın alma başarısız. Lütfen tekrar deneyin.' 
          : 'Credit purchase failed. Please try again.'
        )
        return
      }

      // Update user profile credits
      const newCredits = (currentProfileBefore?.credits || 0) + credits

      const { data: updatedProfile, error: finalUpdateError } = await supabase
        .from('user_profiles')
        .update({ credits: newCredits })
        .eq('id', user.id)
        .select()

      if (finalUpdateError) {
        alert(language === 'tr' 
          ? 'Krediler eklendi ancak profil güncellemesi başarısız.' 
          : 'Credits added but profile update failed.'
        )
        return
      }

      alert(language === 'tr' 
        ? `${credits} kredi €${price} karşılığında başarıyla satın alındı!` 
        : `Successfully purchased ${credits} credits for €${price}!`
      )
      router.push('/dashboard')
      
    } catch (error) {
      alert(language === 'tr' 
        ? 'Satın alma başarısız. Lütfen tekrar deneyin.' 
        : 'Purchase failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
        <Header />
        <div className="pt-32 text-center">
          <div className="text-2xl text-slate-800 dark:text-white">
            {language === 'tr' ? 'Kimlik doğrulama kontrol ediliyor...' : 'Checking authentication...'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 dark:from-blue-400/10 dark:to-purple-400/10"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-slate-900 dark:text-white">
            {language === 'tr' ? 'Hesabınıza Kredi Ekleyin' : 'Add Credits to Your Account'}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            {language === 'tr' 
              ? 'Krediler platformumuzda duvar kağıdı satın almak için kullanılır. 100 kredi = €1. Hesabınıza kredi eklemek için aşağıdan bir paket seçin.'
              : 'Credits are used to purchase wallpapers on our platform. 100 credits = €1. Select a package below to add credits to your account.'
            }
          </p>
        </div>
      </section>

      {/* Credit Selection Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">
              {language === 'tr' ? 'Kredi Paketi Seçin' : 'Choose a Credit Package'}
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              {language === 'tr' ? 'Kaç kredi satın almak istediğinizi seçin.' : 'Select how many credits you want to purchase.'}
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {creditOptions.map((option) => (
              <div
                key={option.credits}
                className={`relative bg-white dark:bg-slate-800 rounded-xl p-6 border-2 transition-all duration-300 cursor-pointer ${
                  selectedPackage === option.credits.toString()
                    ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
                onClick={() => setSelectedPackage(option.credits.toString())}
              >
                {option.popular && (
                  <div className="absolute -top-2 -right-2">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {language === 'tr' ? 'Popüler' : 'Popular'}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="creditPackage"
                      value={option.credits}
                      checked={selectedPackage === option.credits.toString()}
                      onChange={() => setSelectedPackage(option.credits.toString())}
                      className="w-5 h-5 text-blue-600 border-2 border-slate-300 dark:border-slate-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="text-lg font-semibold text-slate-800 dark:text-white">
                        {option.credits} {language === 'tr' ? 'Kredi' : 'Credits'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-slate-800 dark:text-white">
                      €{option.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Credits Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border-2 border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-4 mb-6">
              <input
                type="radio"
                name="creditPackage"
                value="custom"
                checked={selectedPackage === 'custom'}
                onChange={() => setSelectedPackage('custom')}
                className="w-5 h-5 text-blue-600 border-2 border-slate-300 dark:border-slate-600 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                  {language === 'tr' ? 'Özel Krediler' : 'Custom Credits'}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  {language === 'tr' ? 'Kredi miktarını girin:' : 'Enter credit amount:'}
                </div>
                <input
                  type="number"
                  value={customCredits}
                  onChange={(e) => setCustomCredits(e.target.value)}
                  min="1000"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {language === 'tr' ? '(Minimum 1000 kredi)' : '(Minimum 1000 credits)'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-slate-800 dark:text-white">
                  €{(parseInt(customCredits) / 100).toFixed(2)}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  €1.00 {language === 'tr' ? '100 kredi başına' : 'per 100 credits'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border-2 border-slate-200 dark:border-slate-700">
            <div className="text-center mb-8">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                {language === 'tr' ? 'Güvenli ödeme işlemi' : 'Secure payment processing'}
              </div>
              <div className="flex justify-center gap-4 mb-6">
                <div className="w-12 h-8 bg-slate-200 dark:bg-slate-600 rounded flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                </div>
                <div className="w-12 h-8 bg-slate-200 dark:bg-slate-600 rounded flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                </div>
              </div>
            </div>
            
            <button
              onClick={() => {
                if (!user) {
                  setShowLoginModal(true)
                } else {
                  const selectedOption = creditOptions.find(opt => opt.credits.toString() === selectedPackage)
                  if (selectedOption) {
                    router.push(`/payment?credits=${selectedOption.credits}`)
                  } else if (selectedPackage === 'custom') {
                    const credits = parseInt(customCredits)
                    router.push(`/payment?credits=${credits}`)
                  }
                }
              }}
              disabled={loading || !selectedPackage}
              className="w-full px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-slate-900 dark:border-white hover:bg-slate-800 dark:hover:bg-slate-100"
            >
              {loading 
                ? (language === 'tr' ? 'İşleniyor...' : 'Processing...') 
                : (language === 'tr' ? 'Ödemeye Devam Et' : 'Continue to Payment')
              }
            </button>
          </div>
        </div>
      </section>

      {/* About Credits Section */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-slate-800 dark:text-white">
            {language === 'tr' ? 'Krediler Hakkında' : 'About Credits'}
          </h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>{language === 'tr' ? 'Krediler asla sona ermez' : 'Credits never expire'}</span>
            </li>
            <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>{language === 'tr' ? 'Yüksek kaliteli duvar kağıtları satın almak için kullanılır' : 'Used to purchase high-quality wallpapers'}</span>
            </li>
            <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>{language === 'tr' ? 'Ne kadar çok kredi satın alırsanız, o kadar iyi değer alırsınız' : 'The more credits you buy, the better value you get'}</span>
            </li>
            <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>{language === 'tr' ? 'Krediler hemen hesabınızda kullanılabilir olacak' : 'Credits will be immediately available in your account'}</span>
            </li>
          </ul>
        </div>
      </section>


      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Sign In to Continue</h2>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                  Email
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Enter your password"
                />
              </div>
              
              {loginError && (
                <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  {loginError}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                {loginLoading ? 'Signing In...' : 'Sign In'}
              </button>
              
              <div className="text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => router.push('/auth/sign-up')}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                    Sign up here
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
