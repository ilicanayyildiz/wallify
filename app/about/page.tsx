'use client'

import Link from 'next/link'
import Header from '@/components/Header'
import { useLanguage } from '@/contexts/LanguageContext'
import { Users, Award, Globe, Heart, CheckCircle, Star, Zap, Shield } from 'lucide-react'

export default function AboutPage() {
  const { t, language } = useLanguage()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-neutral-50 to-white dark:from-black dark:via-neutral-900 dark:to-black transition-colors duration-300">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 dark:from-blue-600/10 dark:to-purple-600/10"></div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-black via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
            {language === 'tr' ? 'Wallify Hakkında' : 'About Wallify'}
          </h1>
          <p className="text-xl text-neutral-700 dark:text-neutral-300 max-w-3xl mx-auto mb-8">
            {language === 'tr' 
              ? 'Dünyanın en güzel duvar kağıtlarını cihazlarınıza getirmeye tutkuyla bağlıyız. Misyonumuz sıradan ekranları olağanüstü deneyimlere dönüştürmektir.'
              : 'We\'re passionate about bringing the world\'s most beautiful wallpapers to your devices. Our mission is to transform ordinary screens into extraordinary experiences.'
            }
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-neutral-600 dark:text-neutral-400">
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              {language === 'tr' ? '50K+ Kullanıcı' : '50K+ Users'}
            </span>
            <span className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              {language === 'tr' ? '10K+ Duvar Kağıdı' : '10K+ Wallpapers'}
            </span>
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              {language === 'tr' ? '150+ Ülke' : '150+ Countries'}
            </span>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-black dark:text-white">
                {language === 'tr' ? 'Hikayemiz' : 'Our Story'}
              </h2>
              <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
                {language === 'tr' 
                  ? 'Wallify basit bir fikirden doğdu: herkes güzel, yüksek kaliteli duvar kağıtlarına erişimi hak ediyor. El seçimi tasarımlardan oluşan küçük bir koleksiyon olarak başlayan şey, sanatçılar, tasarımcılar ve duvar kağıdı tutkunlarından oluşan küresel bir topluluğa dönüştü.'
                  : 'Wallify was born from a simple idea: everyone deserves access to beautiful, high-quality wallpapers. What started as a small collection of hand-picked designs has grown into a global community of artists, designers, and wallpaper enthusiasts.'
                }
              </p>
              <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-8 leading-relaxed">
                {language === 'tr' 
                  ? 'Dijital dünyanın fiziksel dünya kadar güzel olması gerektiğine inanıyoruz. Koleksiyonumuzdaki her duvar kağıdı, kalite, yaratıcılık ve özgünlük konularında yüksek standartlarımızı karşıladığından emin olmak için dikkatle seçilmiştir.'
                  : 'We believe that the digital world should be as beautiful as the physical one. Every wallpaper in our collection is carefully curated to ensure it meets our high standards for quality, creativity, and originality.'
                }
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">
                    {language === 'tr' ? 'Premium Kalite' : 'Premium Quality'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">
                    {language === 'tr' ? 'Sanatçı Desteği' : 'Artist Support'}
                  </span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 dark:from-blue-400/20 dark:to-purple-400/20 rounded-3xl p-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/80 dark:bg-black/80 rounded-2xl p-4 text-center">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Heart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-black dark:text-white mb-1">
                      {language === 'tr' ? 'Tutku' : 'Passion'}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {language === 'tr' ? 'Yaptığımızı seviyoruz' : 'We love what we do'}
                    </p>
                  </div>
                  <div className="bg-white/80 dark:bg-black/80 rounded-2xl p-4 text-center">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-black dark:text-white mb-1">
                      {language === 'tr' ? 'Kalite' : 'Quality'}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {language === 'tr' ? 'Sadece en iyisi' : 'Only the best'}
                    </p>
                  </div>
                  <div className="bg-white/80 dark:bg-black/80 rounded-2xl p-4 text-center">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-semibold text-black dark:text-white mb-1">
                      {language === 'tr' ? 'İnovasyon' : 'Innovation'}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {language === 'tr' ? 'Sürekli gelişim' : 'Always evolving'}
                    </p>
                  </div>
                  <div className="bg-white/80 dark:bg-black/80 rounded-2xl p-4 text-center">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="font-semibold text-black dark:text-white mb-1">
                      {language === 'tr' ? 'Güven' : 'Trust'}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {language === 'tr' ? 'Güvenilir hizmet' : 'Reliable service'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 px-4 bg-white/50 dark:bg-neutral-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-black dark:text-white">
              {language === 'tr' ? 'Misyonumuz ve Değerlerimiz' : 'Our Mission & Values'}
            </h2>
            <p className="text-xl text-neutral-700 dark:text-neutral-300 max-w-3xl mx-auto">
              {language === 'tr' 
                ? 'Hem sanatçılar hem de kullanıcılar için faydalı olan, en yüksek kalite ve hizmet standartlarını koruyan bir platform oluşturmaya kararlıyız.'
                : 'We\'re committed to creating a platform that benefits both artists and users, while maintaining the highest standards of quality and service.'
              }
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-white/80 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-black dark:text-white">
                {language === 'tr' ? 'Topluluk Öncelikli' : 'Community First'}
              </h3>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {language === 'tr' 
                  ? 'Sanatçıların gelişebileceği ve kullanıcıların harika içerikler keşfedebileceği güçlü, destekleyici bir topluluk oluşturmaya inanıyoruz.'
                  : 'We believe in building a strong, supportive community where artists can thrive and users can discover amazing content.'
                }
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-white/80 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-black dark:text-white">
                {language === 'tr' ? 'Kalite Miktardan Önce' : 'Quality Over Quantity'}
              </h3>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {language === 'tr' 
                  ? 'Koleksiyonumuzdaki her duvar kağıdı, yaratıcılık ve teknik mükemmellik konularında yüksek standartlarımızı karşıladığından emin olmak için dikkatle seçilmiştir.'
                  : 'Every wallpaper in our collection is carefully selected to ensure it meets our high standards for creativity and technical excellence.'
                }
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-white/80 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-black dark:text-white">
                {language === 'tr' ? 'Sanatçı Desteği' : 'Artist Support'}
              </h3>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {language === 'tr' 
                  ? 'Adil tazminat sağlayarak ve çalışmalarını küresel kitlemize tanıtarak sanatçıları desteklemeye kararlıyız.'
                  : 'We\'re committed to supporting artists by providing fair compensation and promoting their work to our global audience.'
                }
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-600/10 dark:to-purple-600/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">50K+</div>
              <div className="text-neutral-700 dark:text-neutral-300">
                {language === 'tr' ? 'Mutlu Kullanıcı' : 'Happy Users'}
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">10K+</div>
              <div className="text-neutral-700 dark:text-neutral-300">
                {language === 'tr' ? 'Premium Duvar Kağıdı' : 'Premium Wallpapers'}
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">150+</div>
              <div className="text-neutral-700 dark:text-neutral-300">
                {language === 'tr' ? 'Ülke' : 'Countries'}
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">24/7</div>
              <div className="text-neutral-700 dark:text-neutral-300">
                {language === 'tr' ? 'Destek' : 'Support'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-black dark:text-white">
            {language === 'tr' ? 'Topluluğumuza Katılın' : 'Join Our Community'}
          </h2>
          <p className="text-xl text-neutral-700 dark:text-neutral-400 mb-8">
            {language === 'tr' 
              ? 'Harika bir şeyin parçası olun. Güzel duvar kağıtları keşfedin, sanatçılarla bağlantı kurun ve dijital deneyiminizi dönüştürün.'
              : 'Be part of something amazing. Discover beautiful wallpapers, connect with artists, and transform your digital experience.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth/sign-up"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-600 dark:to-purple-600 hover:from-blue-600 hover:to-purple-600 dark:hover:from-blue-700 dark:hover:to-purple-700 text-black dark:text-white font-semibold rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              {language === 'tr' ? 'Ücretsiz Başlayın' : 'Get Started Free'}
            </Link>
            <Link 
              href="/contact"
              className="px-8 py-4 border-2 border-black/20 dark:border-white/20 hover:border-black/40 dark:hover:border-white/40 text-black dark:text-white font-semibold rounded-xl text-lg transition-all hover:bg-black/10 dark:hover:bg-white/10"
            >
              {language === 'tr' ? 'İletişime Geçin' : 'Contact Us'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
