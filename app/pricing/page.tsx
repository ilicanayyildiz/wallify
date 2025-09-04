'use client'

import Link from 'next/link'
import Header from '@/components/Header'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'

export default function PricingPage() {
  const [customCredits, setCustomCredits] = useState(1000)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const { t, language } = useLanguage()
  const supabase = createClient()
  
  // Calculate price: 1 Euro = 100 Credits
  const customPrice = (customCredits / 100).toFixed(2)
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkAuth()
  }, [supabase.auth])
  
  const handleCreditsChange = (value: string) => {
    const credits = parseInt(value) || 0
    setCustomCredits(credits)
    
    if (credits < 1000) {
      setError('Minimum 1000 credits required')
    } else {
      setError('')
    }
  }

  const handlePurchase = (credits: number) => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    // Redirect to payment page with credits parameter
    router.push(`/payment?credits=${credits}`)
  }


  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-black dark:text-white">
            {language === 'tr' ? (
              <>
                Her Yaratıcı Proje İçin<br />
                Krediler
              </>
            ) : (
              <>
                Credits for<br />
                Every Creative Project
              </>
            )}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            {language === 'tr' 
              ? 'Projeleriniz için yüksek kaliteli duvar kağıtları koleksiyonumuzu keşfedin'
              : 'Discover our curated collection of high-quality wallpapers for your projects'
            }
          </p>
        </div>
      </section>

      {/* Credit Packages */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-black dark:text-white">
              {language === 'tr' ? 'Kredi Paketlerimiz' : 'Our Credit Packages'}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {language === 'tr' 
                ? 'Krediler platformumuzda duvar kağıtları satın almak için kullanılır. 100 kredi = €1(£0.84). İhtiyaçlarınıza uygun bir paket seçin.'
                : 'Credits are used to purchase wallpapers on our platform. 100 credits = €1(£0.84). Select a package that fits your needs.'
              }
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {/* 100 Credits */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-gray-300 dark:hover:border-gray-600 transition-all">
              <div className="text-center">
                <div className="text-2xl font-bold text-black dark:text-white mb-2">100 Credits</div>
                <div className="text-xl font-bold text-black dark:text-white mb-2">€1.00</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">€1.0 per 100 credits</div>
                <button 
                  onClick={() => handlePurchase(100)}
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-black dark:text-white font-medium rounded-lg transition-all"
                >
                  {t('pricing.purchaseNow')}
                </button>
              </div>
            </div>

            {/* 500 Credits - Most Popular */}
            <div className="relative bg-white dark:bg-gray-800 border-2 border-blue-500 rounded-lg p-6 hover:border-blue-600 transition-all">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Most Popular
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-black dark:text-white mb-2">500 Credits</div>
                <div className="text-xl font-bold text-black dark:text-white mb-2">€5.00</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">€1.0 per 100 credits</div>
                <button 
                  onClick={() => handlePurchase(500)}
                  className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all"
                >
                  {t('pricing.purchaseNow')}
                </button>
              </div>
            </div>

            {/* 1000 Credits */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-gray-300 dark:hover:border-gray-600 transition-all">
              <div className="text-center">
                <div className="text-2xl font-bold text-black dark:text-white mb-2">1000 Credits</div>
                <div className="text-xl font-bold text-black dark:text-white mb-2">€10.00</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">€1.0 per 100 credits</div>
                <button 
                  onClick={() => handlePurchase(1000)}
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-black dark:text-white font-medium rounded-lg transition-all"
                >
                  {t('pricing.purchaseNow')}
                </button>
              </div>
            </div>

            {/* 2000 Credits */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-gray-300 dark:hover:border-gray-600 transition-all">
              <div className="text-center">
                <div className="text-2xl font-bold text-black dark:text-white mb-2">2000 Credits</div>
                <div className="text-xl font-bold text-black dark:text-white mb-2">€20.00</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">€1.0 per 100 credits</div>
                <button 
                  onClick={() => handlePurchase(2000)}
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-black dark:text-white font-medium rounded-lg transition-all"
                >
                  {t('pricing.purchaseNow')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Credits Section */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-black dark:text-white">
            {language === 'tr' ? 'Özel miktar mı gerekiyor?' : 'Need a custom amount?'}
          </h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
            <h3 className="text-xl font-bold text-black dark:text-white mb-6">
              {t('pricing.customCredits')}
            </h3>
            
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  {t('pricing.enterAmount')}:
                </label>
                <input
                  type="number"
                  value={customCredits}
                  onChange={(e) => handleCreditsChange(e.target.value)}
                  min="1000"
                  className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                <div className={`text-xs mt-1 ${error ? 'text-red-500' : 'text-gray-500'}`}>
                  {error || (language === 'tr' ? '(Minimum 1000 kredi)' : '(Minimum 1000 credits)')}
                </div>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-2xl font-bold text-black dark:text-white">€{customPrice}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'tr' ? 'İhtiyacınız olan tam miktarı girin' : 'Enter the exact amount you need'}
                </div>
              </div>
             
              <button 
                onClick={() => handlePurchase(customCredits)}
                disabled={customCredits < 1000}
                className={`w-full px-6 py-3 rounded-lg font-medium transition-all ${
                  customCredits >= 1000
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                {t('pricing.continue')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Credits */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-black dark:text-white">About Credits</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-gray-700 dark:text-gray-300">Credits never expire</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-gray-700 dark:text-gray-300">Used to purchase high-quality wallpapers</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-gray-700 dark:text-gray-300">The more credits you buy, the better value you get</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-gray-700 dark:text-gray-300">Credits will be immediately available in your account</span>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Credit Value</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">1 Credit</span>
                  <span className="text-black dark:text-white font-medium">€0.01</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">100 Credits</span>
                  <span className="text-black dark:text-white font-medium">€1.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">1000 Credits</span>
                  <span className="text-black dark:text-white font-medium">€10.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-black dark:text-white">Frequently asked questions about credits</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Can't find the answer you're looking for? Reach out to our customer support team.
          </p>
          
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-3 text-black dark:text-white">What are credits and how do they work?</h3>
              <p className="text-gray-600 dark:text-gray-400">Credits are our virtual currency used to purchase wallpapers. 1 credit = €0.01, so 100 credits = €1.00.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-3 text-black dark:text-white">What is the value of one credit?</h3>
              <p className="text-gray-600 dark:text-gray-400">One credit equals €0.01. This means you can download 1 wallpaper for just 1 cent.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-3 text-black dark:text-white">Can I get a refund for unused credits?</h3>
              <p className="text-gray-600 dark:text-gray-400">Yes, we offer a 30-day money-back guarantee for unused credits.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-3 text-black dark:text-white">Do I need credits to buy content on Wallify?</h3>
              <p className="text-gray-600 dark:text-gray-400">Yes, all wallpapers require credits to download. You can browse for free, but downloads require credits.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-3 text-black dark:text-white">Do credits expire?</h3>
              <p className="text-gray-600 dark:text-gray-400">No, credits never expire. You can use them whenever you want.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-3 text-black dark:text-white">What payment methods do you accept?</h3>
              <p className="text-gray-600 dark:text-gray-400">We accept Visa, Mastercard, and other major credit cards through our secure payment system.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-black dark:text-white">Need a custom solution?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            We offer tailored enterprise solutions for teams and organizations with specific requirements. Contact our sales team to discuss your needs.
          </p>
          <Link 
            href="/contact"
            className="inline-block px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Contact Sales Team
          </Link>
        </div>
      </section>
    </div>
  )
}
