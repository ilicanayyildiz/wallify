"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"

export default function SignupPage() {
  const { user, isLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Redirect if user is already logged in
  useEffect(() => {
    if (!isLoading && user) {
      router.push("/profile")
    }
  }, [user, isLoading, router])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Create user in Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      // Once signed up, create a profile in the database
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              full_name: fullName,
              email: email,
            },
          ])

        if (profileError) {
          console.error("Error creating profile:", profileError)
          setError("Konto erstellt, aber es gab ein Problem beim Einrichten Ihres Profils")
          return
        }

        // Success - redirect to login or confirmation page
        router.push("/login?newUser=true")
      }
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
          <h1 className="text-2xl font-bold">Konto erstellen</h1>
          <p className="text-muted-foreground mt-2">
            Registrieren Sie sich, um Zugang zu Tausenden von Stock-Bildern zu erhalten
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium">
              Vollständiger Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              required
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
            />
          </div>

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
            <label htmlFor="password" className="text-sm font-medium">
              Passwort
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
            />
            <p className="text-xs text-muted-foreground">
              Das Passwort muss mindestens 6 Zeichen lang sein
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Konto wird erstellt..." : "Konto erstellen"}
          </Button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            Bereits ein Konto?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Anmelden
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 