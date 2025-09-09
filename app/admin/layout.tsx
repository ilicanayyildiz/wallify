import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // TODO: Admin yetkisi kontrolü eklenebilir

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-neutral-800 bg-neutral-900">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-bold text-lg">Admin Panel</Link>
            <Link href="/protected" className="opacity-80 hover:opacity-100">Mağaza</Link>
            <Link href="/dashboard" className="opacity-80 hover:opacity-100">Dashboard</Link>
          </div>
          <Link href="/" className="opacity-80 hover:opacity-100">Ana Sayfa</Link>
        </nav>
      </header>
      
      <main className="max-w-6xl mx-auto py-8">
        {children}
      </main>
    </div>
  )
}
