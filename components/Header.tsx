'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import ThemeSwitcher from './ThemeSwitcher'
import { useLanguage } from '@/contexts/LanguageContext'
import { User, CreditCard, LogOut } from 'lucide-react'

export default function Header() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: adminUser } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', user.id)
          .single()

        setIsAdmin(!!adminUser)
      }
    }

    checkUser()
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-neutral-300 dark:border-neutral-700 transition-colors duration-300">
      <nav className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative">
            {/* Wallet/Pixel Icon */}
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="w-2 h-2 bg-white rounded-sm absolute top-1 right-1 opacity-80"></div>
              <div className="w-1 h-1 bg-white rounded-full absolute top-2 right-2 opacity-60"></div>
            </div>
          </div>
          <span className="text-2xl font-bold text-black dark:text-white">
            Wallify
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link href="/browse" className="text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors font-medium">
            {t('nav.browse')}
          </Link>
          <Link href="/categories" className="text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors font-medium">
            {t('nav.categories')}
          </Link>
          <Link href="/pricing" className="text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors font-medium">
            {t('nav.pricing')}
          </Link>
          <Link href="/about" className="text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors font-medium">
            {t('nav.about')}
          </Link>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* User Profile Icon */}
              <Link href="/dashboard" className="text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors">
                <User className="w-6 h-6" />
              </Link>
              
              {/* Credits Icon */}
              <Link href="/add-credits" className="text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors">
                <CreditCard className="w-6 h-6" />
              </Link>
              
              {/* Admin Link (if admin) */}
              {isAdmin && (
                <Link href="/admin" className="text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors">
                  {t('nav.admin')}
                </Link>
              )}
              
              {/* Logout Icon */}
              <button
                onClick={async () => {
                  const supabase = createClient()
                  await supabase.auth.signOut()
                  window.location.href = '/'
                }}
                className="text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors font-medium">
                {t('nav.signIn')}
              </Link>
              <Link href="/auth/sign-up" className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-lg transition-all transform hover:scale-105">
                {t('nav.signUp')}
              </Link>
            </>
          )}
          
          
          {/* Dark Mode Toggle - En Sonda */}
          <ThemeSwitcher />
        </div>
      </nav>
    </header>
  )
}
