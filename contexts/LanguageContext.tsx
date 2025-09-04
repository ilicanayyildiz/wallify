'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'en' | 'tr'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Translation keys
const translations = {
  en: {
    // Navigation
    'nav.browse': 'Browse',
    'nav.categories': 'Categories',
    'nav.pricing': 'Pricing',
    'nav.about': 'About',
    'nav.signIn': 'Sign In',
    'nav.signUp': 'Sign Up',
    'nav.admin': 'Admin',
    
    // Common
    'common.download': 'Download',
    'common.credits': 'Credits',
    'common.price': 'Price',
    'common.total': 'Total',
    'common.purchase': 'Purchase',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.warning': 'Warning',
    'common.info': 'Info',
    
    // Auth
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.login': 'Login',
    'auth.logout': 'Logout',
    'auth.signUp': 'Sign Up',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.rememberMe': 'Remember Me',
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.dontHaveAccount': "Don't have an account?",
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Welcome back!',
    'dashboard.yourPurchases': 'Your Purchases',
    'dashboard.creditManagement': 'Credit Management',
    'dashboard.security': 'Security',
    'dashboard.accountInfo': 'Account Information',
    'dashboard.credits': 'Credits',
    'dashboard.addCredits': 'Add Credits',
    
    // Pricing
    'pricing.title': 'Pricing',
    'pricing.choosePlan': 'Choose Your Plan',
    'pricing.mostPopular': 'Most Popular',
    'pricing.purchaseNow': 'Purchase Now',
    'pricing.continue': 'Continue',
    'pricing.customCredits': 'Custom Credits',
    'pricing.enterAmount': 'Enter Amount',
    
    // Payment
    'payment.title': 'Payment',
    'payment.paymentDetails': 'Payment Details',
    'payment.basePrice': 'Base Price',
    'payment.serviceFee': 'Service Fee',
    'payment.totalPrice': 'Total Price',
    'payment.pay': 'Pay',
    'payment.cardNumber': 'Card Number',
    'payment.expiryDate': 'Expiry Date',
    'payment.cvv': 'CVV',
    'payment.cardholderName': 'Cardholder Name',
    
    // Product
    'product.downloadNow': 'Download Now',
    'product.insufficientCredits': 'Insufficient Credits',
    'product.alreadyPurchased': 'Already Purchased',
    'product.yourBalance': 'Your Balance',
    
    // Error messages
    'error.downloadFailed': 'Download failed. Please try again.',
    'error.purchaseFailed': 'Purchase failed. Please try again.',
    'error.insufficientCredits': 'Insufficient credits!',
    'error.alreadyPurchased': 'You have already purchased this product!',
    'error.loginRequired': 'Please login to continue.',
    'error.invalidCredentials': 'Invalid login credentials.',
    'error.networkError': 'Network error. Please check your connection.',
  },
  tr: {
    // Navigation
    'nav.browse': 'Gözat',
    'nav.categories': 'Kategoriler',
    'nav.pricing': 'Fiyatlandırma',
    'nav.about': 'Hakkında',
    'nav.signIn': 'Giriş Yap',
    'nav.signUp': 'Kayıt Ol',
    'nav.admin': 'Yönetici',
    
    // Common
    'common.download': 'İndir',
    'common.credits': 'Kredi',
    'common.price': 'Fiyat',
    'common.total': 'Toplam',
    'common.purchase': 'Satın Al',
    'common.cancel': 'İptal',
    'common.save': 'Kaydet',
    'common.delete': 'Sil',
    'common.edit': 'Düzenle',
    'common.add': 'Ekle',
    'common.search': 'Ara',
    'common.filter': 'Filtrele',
    'common.loading': 'Yükleniyor...',
    'common.error': 'Hata',
    'common.success': 'Başarılı',
    'common.warning': 'Uyarı',
    'common.info': 'Bilgi',
    
    // Auth
    'auth.email': 'E-posta',
    'auth.password': 'Şifre',
    'auth.confirmPassword': 'Şifreyi Onayla',
    'auth.login': 'Giriş Yap',
    'auth.logout': 'Çıkış Yap',
    'auth.signUp': 'Kayıt Ol',
    'auth.forgotPassword': 'Şifremi Unuttum?',
    'auth.rememberMe': 'Beni Hatırla',
    'auth.alreadyHaveAccount': 'Zaten hesabınız var mı?',
    'auth.dontHaveAccount': 'Hesabınız yok mu?',
    
    // Dashboard
    'dashboard.title': 'Kontrol Paneli',
    'dashboard.welcome': 'Tekrar hoş geldiniz!',
    'dashboard.yourPurchases': 'Satın Aldıklarınız',
    'dashboard.creditManagement': 'Kredi Yönetimi',
    'dashboard.security': 'Güvenlik',
    'dashboard.accountInfo': 'Hesap Bilgileri',
    'dashboard.credits': 'Krediler',
    'dashboard.addCredits': 'Kredi Ekle',
    
    // Pricing
    'pricing.title': 'Fiyatlandırma',
    'pricing.choosePlan': 'Planınızı Seçin',
    'pricing.mostPopular': 'En Popüler',
    'pricing.purchaseNow': 'Şimdi Satın Al',
    'pricing.continue': 'Devam Et',
    'pricing.customCredits': 'Özel Kredi',
    'pricing.enterAmount': 'Miktar Girin',
    
    // Payment
    'payment.title': 'Ödeme',
    'payment.paymentDetails': 'Ödeme Detayları',
    'payment.basePrice': 'Temel Fiyat',
    'payment.serviceFee': 'Hizmet Ücreti',
    'payment.totalPrice': 'Toplam Fiyat',
    'payment.pay': 'Öde',
    'payment.cardNumber': 'Kart Numarası',
    'payment.expiryDate': 'Son Kullanma Tarihi',
    'payment.cvv': 'CVV',
    'payment.cardholderName': 'Kart Sahibi Adı',
    
    // Product
    'product.downloadNow': 'Şimdi İndir',
    'product.insufficientCredits': 'Yetersiz Kredi',
    'product.alreadyPurchased': 'Zaten Satın Alındı',
    'product.yourBalance': 'Bakiyeniz',
    
    // Error messages
    'error.downloadFailed': 'İndirme başarısız. Lütfen tekrar deneyin.',
    'error.purchaseFailed': 'Satın alma başarısız. Lütfen tekrar deneyin.',
    'error.insufficientCredits': 'Yetersiz kredi!',
    'error.alreadyPurchased': 'Bu ürünü zaten satın aldınız!',
    'error.loginRequired': 'Devam etmek için lütfen giriş yapın.',
    'error.invalidCredentials': 'Geçersiz giriş bilgileri.',
    'error.networkError': 'Ağ hatası. Lütfen bağlantınızı kontrol edin.',
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    // Load language from localStorage on mount
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'tr')) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    // Save language to localStorage when it changes
    localStorage.setItem('language', language)
  }, [language])

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
