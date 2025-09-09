"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"

export default function LoginPage() {
  const { user, isLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Redirect if user is already logged in
  useEffect(() => {
    if (!isLoading && user) {
      router.push("/profile")
    }
  }, [user, isLoading, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        return
      }

      router.push("/")
      router.refresh()
    } catch (err) {
      setError("Ein unerwarteter Fehler ist aufgetreten")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-12 flex flex-col items-center">
      <div className="w-full max-w-md space-y-8 p-8 border border-border rounded-lg bg-card">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Anmelden</h1>
          <p className="text-muted-foreground mt-2">
            Willkommen zurück! Bitte melden Sie sich in Ihrem Konto an
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              E-Mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium">
                Passwort
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Passwort vergessen?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Anmeldung..." : "Anmelden"}
          </Button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            Noch kein Konto?{" "}
            <Link
              href="/signup"
              className="text-primary hover:underline font-medium"
            >
              Registrieren
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 