import Link from 'next/link'
import { Download, Eye, Star } from 'lucide-react'

type ProductCardProps = {
  id: string
  title: string
  slug: string
  cover_url?: string | null
  price: number
}

export default function ProductCard({ id, title, slug, cover_url, price }: ProductCardProps) {
  return (
    <Link
      href={`/product/${id}`}
      className="group block"
    >
      <div className="rounded-2xl border border-neutral-800 overflow-hidden hover:border-neutral-600 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 bg-neutral-900/50">
        <div className="aspect-[4/3] bg-neutral-900 relative overflow-hidden">
          {cover_url ? (
            <img
              src={cover_url}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-500 bg-gradient-to-br from-neutral-800 to-neutral-900">
              <span className="text-4xl">🎨</span>
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <div className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <div className="w-8 h-8 bg-blue-600/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
              <Download className="w-4 h-4 text-white" />
            </div>
          </div>
          
          {/* Quality Badge */}
          <div className="absolute top-3 left-3">
            <div className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold rounded-full flex items-center gap-1">
              <Star className="w-3 h-3" />
              Premium
            </div>
          </div>
        </div>
        
        <div className="p-5">
          <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors text-lg mb-2 line-clamp-2">
            {title}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-blue-400">
              {price} credits
            </p>
            <div className="text-sm text-neutral-400">
              HD Quality
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
