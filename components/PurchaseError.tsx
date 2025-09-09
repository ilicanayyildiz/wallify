'use client'
import Link from 'next/link'
import { CheckCircle, XCircle, ShoppingBag, Home, Store } from 'lucide-react'

interface PurchaseErrorProps {
  message?: string
  productName?: string
}

export default function PurchaseError({ 
  message = "Bu ürünü zaten satın aldınız!", 
  productName 
}: PurchaseErrorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Error Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-full mb-4">
            <XCircle className="w-12 h-12 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Satın Alma Hatası</h1>
          <p className="text-neutral-400">{message}</p>
        </div>

        {/* Product Info */}
        {productName && (
          <div className="bg-neutral-800/50 rounded-xl p-4 mb-6 border border-neutral-700">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm text-neutral-400">Ürün</p>
                <p className="font-medium text-white">{productName}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link 
            href="/dashboard"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors"
          >
            <CheckCircle className="w-5 h-5" />
            Satın Aldıklarımı Gör
          </Link>
          
          <Link 
            href="/protected"
            className="w-full flex items-center justify-center gap-2 bg-neutral-700 hover:bg-neutral-600 text-white font-medium py-3 px-4 rounded-xl transition-colors"
          >
            <Store className="w-5 h-5" />
            Mağazaya Dön
          </Link>
          
          <Link 
            href="/"
            className="w-full flex items-center justify-center gap-2 text-neutral-400 hover:text-white font-medium py-2 px-4 transition-colors"
          >
            <Home className="w-4 h-4" />
            Ana Sayfa
          </Link>
        </div>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <p className="text-sm text-blue-300 text-center">
            💡 Zaten satın aldığınız ürünleri Dashboard&apos;dan indirebilirsiniz
          </p>
        </div>
      </div>
    </div>
  )
}
