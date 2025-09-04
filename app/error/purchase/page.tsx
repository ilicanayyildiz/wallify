'use client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, XCircle, ShoppingBag, Home, Store, Download } from 'lucide-react'

export default function PurchaseErrorPage() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message') || 'Bu ürünü zaten satın aldınız!'
  const productName = searchParams.get('productName') || ''

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Error Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-500/20 rounded-full mb-6">
            <XCircle className="w-16 h-16 text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Satın Alma Hatası</h1>
          <p className="text-neutral-400 text-lg">{message}</p>
        </div>

        {/* Product Info */}
        {productName && (
          <div className="bg-neutral-800/50 rounded-xl p-6 mb-8 border border-neutral-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-neutral-400 mb-1">Ürün</p>
                <p className="font-semibold text-white text-lg">{productName}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4 mb-8">
          <Link 
            href="/dashboard"
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg"
          >
            <Download className="w-5 h-5" />
            Satın Aldıklarımı Gör & İndir
          </Link>
          
          <Link 
            href="/protected"
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-neutral-700 to-neutral-800 hover:from-neutral-600 hover:to-neutral-700 text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-105"
          >
            <Store className="w-5 h-5" />
            Mağazaya Dön
          </Link>
          
          <Link 
            href="/"
            className="w-full flex items-center justify-center gap-3 text-neutral-400 hover:text-white font-medium py-3 px-6 transition-colors"
          >
            <Home className="w-4 h-4" />
            Ana Sayfa
          </Link>
        </div>

        {/* Info Box */}
        <div className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-400 text-sm">💡</span>
            </div>
            <div>
              <p className="text-blue-300 font-medium mb-1">Bilgi</p>
              <p className="text-blue-200 text-sm leading-relaxed">
                Zaten satın aldığınız ürünleri Dashboard'dan indirebilirsiniz. 
                Yeni ürünler için mağazaya göz atın!
              </p>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-red-500/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-xl"></div>
      </div>
    </div>
  )
}
