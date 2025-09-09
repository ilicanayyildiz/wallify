'use client'

import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { ChevronDown, Globe } from 'lucide-react'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' }
  ]

  const currentLanguage = languages.find(lang => lang.code === language)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">{currentLanguage?.flag}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code as 'en' | 'tr')
                setIsOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                language === lang.code 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                  : 'text-neutral-700 dark:text-neutral-300'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="text-sm font-medium">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
