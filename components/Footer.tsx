'use client'

import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'

export default function Footer() {
  const { theme } = useTheme()

  return (
    <footer className={`${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'} transition-colors duration-300`}>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Wallify Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="w-2 h-2 bg-white rounded-sm absolute top-1 right-1 opacity-80"></div>
                <div className="w-1 h-1 bg-white rounded-full absolute top-2 right-2 opacity-60"></div>
              </div>
              <span className="text-2xl font-bold">Wallify</span>
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'} leading-relaxed`}>
              Premium wallpapers for every device. High-quality, unique designs that transform your screens.
            </p>
            <div className="space-y-2">
              <p className="font-semibold text-sm">REEVATE ACQUISITION LTD.</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Registered office address:<br />
                Hamilton House, Mabledon Place, London, England, WC1H 9BB
              </p>
            </div>
          </div>

          {/* Explore */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/browse" className={`text-sm ${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'} transition-colors`}>
                  Browse Wallpapers
                </Link>
              </li>
              <li>
                <Link href="/categories" className={`text-sm ${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'} transition-colors`}>
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className={`text-sm ${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'} transition-colors`}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className={`text-sm ${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'} transition-colors`}>
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/pricing" className={`text-sm ${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'} transition-colors`}>
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/imprint" className={`text-sm ${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'} transition-colors`}>
                  Imprint
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className={`text-sm ${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'} transition-colors`}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-use" className={`text-sm ${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'} transition-colors`}>
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/content-license-agreement" className={`text-sm ${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'} transition-colors`}>
                  Content License Agreement
                </Link>
              </li>
              <li>
                <Link href="/user-agreement" className={`text-sm ${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'} transition-colors`}>
                  User Agreement
                </Link>
              </li>
              <li>
                <Link href="/editorial-content-supply-agreement" className={`text-sm ${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'} transition-colors`}>
                  Editorial Content Supply Agreement
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={`border-t ${theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
              © 2025 Wallify. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Payment Methods -
              </span>
              <div className="flex items-center gap-2">
                {/* Payment Methods Image */}
                <img 
                  src="/images/payment-logos.png" 
                  alt="Payment Methods - Visa, Mastercard, Visa Secure, ID Check" 
                  className="h-8 w-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
