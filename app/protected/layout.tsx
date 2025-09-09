import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '../../components/LogoutBtn'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Wallify',
  description: 'Dijital duvar kâğıdı mağazası',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <header className="sticky top-0 z-50 border-b border-neutral-900 bg-black/70 backdrop-blur">
        <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg">Wallify</Link>
          <div className="flex gap-3 items-center">
            <Link href="/" className="opacity-80 hover:opacity-100">Mağaza</Link>
            <Link href="/dashboard" className="opacity-80 hover:opacity-100">Profile</Link>
            <Link href="/admin" className="opacity-80 hover:opacity-100">Admin</Link>
            <LogoutButton />
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <footer className="border-t border-neutral-900 py-8 mt-16 text-center opacity-60 text-sm">
        © {new Date().getFullYear()} Wallify
      </footer>
    </div>
  )
}
