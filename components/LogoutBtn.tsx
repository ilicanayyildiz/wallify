'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LogoutBtn() {
  const router = useRouter()
  const supabase = createClient()

  const onClick = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={onClick}
      className="px-3 py-2 rounded-lg bg-neutral-800 text-white hover:bg-neutral-700 transition"
    >
      Logout
    </button>
  )
}
