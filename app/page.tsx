'use client'
import Link from 'next/link'
import Header from '@/components/Header'
import { useLanguage } from '@/contexts/LanguageContext'

export default function HomePage() {
  const { t, language } = useLanguage()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-black dark:via-neutral-900 dark:to-black transition-colors duration-300">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-600 bg-clip-text text-transparent">
            {language === 'tr' ? 'Premium Duvar Kağıtları' : 'Premium Wallpapers'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-neutral-300 max-w-2xl mx-auto mb-8">
            {language === 'tr' 
              ? 'Tüm cihazlarınız için yüksek kaliteli duvar kağıtlarını keşfedin ve indirin. Etkileyici manzaralardan minimalist tasarımlara.'
              : 'Discover and download high-quality wallpapers for all your devices. From stunning landscapes to minimalist designs.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/categories"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              {language === 'tr' ? 'Kategorileri Keşfet' : 'Explore Categories'}
            </Link>
            <Link 
              href="/browse"
              className="px-8 py-4 border-2 border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 font-semibold rounded-xl text-lg transition-all"
            >
              {language === 'tr' ? 'Tümünü Gözat' : 'Browse All'}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800 dark:text-white">
            {language === 'tr' ? 'Neden Wallify?' : 'Why Choose Wallify?'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm border border-gray-200 dark:border-neutral-700">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                {language === 'tr' ? 'Premium Kalite' : 'Premium Quality'}
              </h3>
              <p className="text-gray-600 dark:text-neutral-400">
                {language === 'tr' 
                  ? 'Tasarım ekibimiz tarafından seçilmiş yüksek çözünürlüklü duvar kağıtları.'
                  : 'High-resolution wallpapers curated by our team of designers.'
                }
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm border border-gray-200 dark:border-neutral-700">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                {language === 'tr' ? 'Tüm Cihazlar' : 'All Devices'}
              </h3>
              <p className="text-gray-600 dark:text-neutral-400">
                {language === 'tr' 
                  ? 'Masaüstü, mobil ve tablet ekranları için optimize edilmiş.'
                  : 'Optimized for desktop, mobile, and tablet screens.'
                }
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm border border-gray-200 dark:border-neutral-700">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                {language === 'tr' ? 'Anında İndirme' : 'Instant Download'}
              </h3>
              <p className="text-gray-600 dark:text-neutral-400">
                {language === 'tr' 
                  ? 'Kredi sistemimizle duvar kağıtlarınızı anında alın.'
                  : 'Get your wallpapers instantly with our credit system.'
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-800 dark:text-white">
            {language === 'tr' ? 'Başlamaya Hazır mısın?' : 'Ready to Get Started?'}
          </h2>
          <p className="text-xl text-gray-600 dark:text-neutral-400 mb-8">
            {language === 'tr' 
              ? 'Cihazlarını duvar kağıtlarımızla dönüştüren binlerce kullanıcıya katıl.'
              : 'Join thousands of users who have already transformed their devices with our wallpapers.'
            }
          </p>
          <Link 
            href="/auth/sign-up"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            {language === 'tr' ? 'Ücretsiz Başla' : 'Get Started Free'}
          </Link>
        </div>
      </section>
    </div>
  )
}
