'use client'

import Link from 'next/link'
import { Heart, Twitter, Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Footer() {
  const { theme } = useTheme()
  const { t, language } = useLanguage()

  return (
    <footer className={`${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'} border-t ${theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'} transition-colors duration-300`}>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="w-2 h-2 bg-white rounded-sm absolute top-1 right-1 opacity-80"></div>
                <div className="w-1 h-1 bg-white rounded-full absolute top-2 right-2 opacity-60"></div>
              </div>
              <span className="text-2xl font-bold">Wallify</span>
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'} leading-relaxed`}>
              {language === 'tr' 
                ? 'Her cihaz için premium duvar kağıtları. Ekranlarınızı dönüştüren yüksek kaliteli, benzersiz tasarımlar.'
                : 'Premium wallpapers for every device. High-quality, unique designs that transform your screens.'
              }
            </p>
            <div className="flex space-x-4">
              <a href="#" className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-neutral-800 hover:bg-neutral-700' : 'bg-neutral-100 hover:bg-neutral-200'} transition-colors`}>
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-neutral-800 hover:bg-neutral-700' : 'bg-neutral-100 hover:bg-neutral-200'} transition-colors`}>
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-neutral-800 hover:bg-neutral-700' : 'bg-neutral-100 hover:bg-neutral-200'} transition-colors`}>
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

                     {/* Quick Links */}
           <div className="space-y-4">
             <h3 className="font-semibold text-lg">
               {language === 'tr' ? 'Hızlı Bağlantılar' : 'Quick Links'}
             </h3>
             <ul className="space-y-2">
               <li>
                 <Link href="/browse" className={`text-sm ${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'} transition-colors`}>
                   {language === 'tr' ? 'Duvar Kağıtlarını Gözat' : 'Browse Wallpapers'}
                 </Link>
               </li>
               <li>
                 <Link href="/categories" className={`text-sm ${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'} transition-colors`}>
                   {t('nav.categories')}
                 </Link>
               </li>
               <li>
                 <Link href="/pricing" className={`text-sm ${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'} transition-colors`}>
                   {t('nav.pricing')}
                 </Link>
               </li>
               <li>
                 <Link href="/about" className={`text-sm ${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'} transition-colors`}>
                   {language === 'tr' ? 'Hakkımızda' : 'About Us'}
                 </Link>
               </li>
             </ul>
           </div>

                     {/* Support */}
           <div className="space-y-4">
             <h3 className="font-semibold text-lg">
               {language === 'tr' ? 'Destek' : 'Support'}
             </h3>
             <ul className="space-y-2">
               <li>
                 <Link href="/help" className={`text-sm ${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'} transition-colors`}>
                   {language === 'tr' ? 'Yardım Merkezi' : 'Help Center'}
                 </Link>
               </li>
               <li>
                 <Link href="/contact" className={`text-sm ${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'} transition-colors`}>
                   {language === 'tr' ? 'İletişim' : 'Contact'}
                 </Link>
               </li>
               <li>
                 <Link href="/faq" className={`text-sm ${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'} transition-colors`}>
                   FAQ
                 </Link>
               </li>
               <li>
                 <Link href="/terms" className={`text-sm ${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'} transition-colors`}>
                   {language === 'tr' ? 'Hizmet Şartları' : 'Terms of Service'}
                 </Link>
               </li>
             </ul>
           </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">
              {language === 'tr' ? 'İletişim Bilgileri' : 'Contact Info'}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className={`w-4 h-4 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`} />
                <span className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  hello@wallify.com
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className={`w-4 h-4 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`} />
                <span className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  +1 (555) 123-4567
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className={`w-4 h-4 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`} />
                <span className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  San Francisco, CA
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t ${theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'}">
          <div className="max-w-md">
            <h3 className="font-semibold text-lg mb-3">
              {language === 'tr' ? 'Güncel Kalın' : 'Stay Updated'}
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'} mb-4`}>
              {language === 'tr' 
                ? 'En son duvar kağıdı sürümlerini ve özel teklifleri alın.'
                : 'Get the latest wallpaper releases and exclusive offers.'
              }
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder={language === 'tr' ? 'E-postanızı girin' : 'Enter your email'}
                className={`flex-1 px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500' : 'bg-white border-neutral-300 text-black placeholder-neutral-400'} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
              />
              <button className={`px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105`}>
                {language === 'tr' ? 'Abone Ol' : 'Subscribe'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={`border-t ${theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
              © 2024 Wallify. {language === 'tr' ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className={`${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'} transition-colors`}>
                {language === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy'}
              </Link>
              <Link href="/cookies" className={`${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'} transition-colors`}>
                {language === 'tr' ? 'Çerez Politikası' : 'Cookie Policy'}
              </Link>
              <Link href="/sitemap" className={`${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'} transition-colors`}>
                {language === 'tr' ? 'Site Haritası' : 'Sitemap'}
              </Link>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className={`text-xs ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-500'} flex items-center justify-center gap-1`}>
              {language === 'tr' ? 'Wallify ekibi tarafından' : 'Made with'} <Heart className="w-3 h-3 text-red-500" /> {language === 'tr' ? 'ile yapıldı' : 'by the Wallify team'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
