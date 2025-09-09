'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import { useLanguage } from '@/contexts/LanguageContext'

export default function PaymentPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [basePrice, setBasePrice] = useState(0)
  const [serviceFee, setServiceFee] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [expiryDate, setExpiryDate] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const { t, language } = useLanguage()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      setUser(user)
    }
    checkAuth()

    // Get credits from URL params
    const creditsParam = searchParams.get('credits')
    const customParam = searchParams.get('custom')
    
    if (customParam) {
      const customCredits = parseInt(customParam) || 1000
      setCredits(customCredits)
    } else if (creditsParam) {
      const packageCredits = parseInt(creditsParam) || 100
      setCredits(packageCredits)
    }

    // Calculate prices
    const base = credits / 100 // 1 credit = €0.01
    const fee = base * 0.018 // 1.8% service fee
    const total = base + fee

    setBasePrice(base)
    setServiceFee(fee)
    setTotalPrice(total)
  }, [supabase.auth, router, searchParams, credits])

  const handleExpiryDateChange = (value: string) => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/\D/g, '')
    
    // Add slash after 2 digits
    if (numericValue.length >= 2) {
      const month = numericValue.substring(0, 2)
      const year = numericValue.substring(2, 6)
      setExpiryDate(`${month}/${year}`)
    } else {
      setExpiryDate(numericValue)
    }
  }

  const handlePayment = async () => {
    setLoading(true)
    
    try {
      // Here you would integrate with Stripe or another payment processor
      // For now, we'll simulate a successful payment
      
      // Update user credits
      const { data: currentProfile } = await supabase
        .from('user_profiles')
        .select('credits')
        .eq('id', user.id)
        .single()

      const newCredits = (currentProfile?.credits || 0) + credits

      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ credits: newCredits })
        .eq('id', user.id)

      if (updateError) throw updateError

      // Add credit transaction
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: user.id,
          amount: credits,
          type: 'purchase',
          description: `Purchased ${credits} credits for €${totalPrice.toFixed(2)}`
        })

      if (transactionError) throw transactionError

      alert(language === 'tr' 
        ? `Ödeme başarılı! ${credits} kredi hesabınıza eklendi.`
        : `Payment successful! ${credits} credits added to your account.`
      )
      router.push('/dashboard')

    } catch (error) {
      console.error('Payment error:', error)
      alert(language === 'tr' 
        ? 'Ödeme başarısız. Lütfen tekrar deneyin.'
        : 'Payment failed. Please try again.'
      )
    } finally {
      setLoading(false)
      setShowPaymentModal(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <div className="pt-32 text-center">
          <div className="text-2xl">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      {/* Main Content */}
      <div className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4">
          
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">{t('payment.title')}</h1>
          </div>

          {/* Payment Card */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
            <h2 className="text-2xl font-bold mb-2">
              {language === 'tr' ? 'Kredi Satın Al' : 'Purchase Credits'}
            </h2>
            <p className="text-gray-400 mb-8">
              {language === 'tr' ? 'Lütfen satın almanızı onaylayın ve ödeme yöntemini seçin.' : 'Please confirm your purchase and choose payment method.'}
            </p>
            
            {/* Purchase Details */}
            <div className="space-y-4 mb-8">
              <div className="flex justify-between">
                <span className="text-gray-400">{t('common.credits')}:</span>
                <span className="text-white font-medium">{credits} {language === 'tr' ? 'kredi' : 'credits'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{t('payment.basePrice')}:</span>
                <span className="text-white">€{basePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{t('payment.serviceFee')} (1.8%):</span>
                <span className="text-white">€{serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-700 pt-4">
                <span className="text-white font-semibold">{t('payment.totalPrice')}:</span>
                <span className="text-white font-bold text-lg">€{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="text-center space-y-4">
              <button
                onClick={() => setShowPaymentModal(true)}
                className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
              >
                {t('payment.pay')}
              </button>
              <button
                onClick={() => router.push('/pricing')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">
                {language === 'tr' ? 'Kredi Kartı Ödemesi' : 'Credit Card Payment'}
              </h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">💳</span>
                <span className="text-gray-400">
                  {language === 'tr' ? 'Kredi Kartı Ödemesi' : 'Credit Card Payment'}
                </span>
              </div>
              <p className="text-sm text-gray-400">
                {language === 'tr' 
                  ? `${credits} kredi satın al €${totalPrice.toFixed(2)}`
                  : `Purchase ${credits} credits for €${totalPrice.toFixed(2)}`
                }
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t('payment.cardNumber')}</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t('payment.expiryDate')}</label>
                  <input
                    type="text"
                    placeholder="MM/YYYY"
                    value={expiryDate}
                    onChange={(e) => handleExpiryDateChange(e.target.value)}
                    maxLength={7}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t('payment.cvv')}</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t('payment.cardholderName')}</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center mb-6">
              <span className="text-green-500 mr-2">🔒</span>
              <span className="text-sm text-gray-400">
                {language === 'tr' ? 'Ödeme bilgileriniz güvenli ve şifrelenmiştir.' : 'Your payment information is secure and encrypted.'}
              </span>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handlePayment}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-white hover:bg-gray-100 text-black font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (language === 'tr' ? 'İşleniyor...' : 'Processing...') : `${language === 'tr' ? 'Öde' : 'Pay'} €${totalPrice.toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
