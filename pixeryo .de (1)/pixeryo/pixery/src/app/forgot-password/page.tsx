"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"

export default function ForgotPasswordPage() {
  const { resetPassword, user, isLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const router = useRouter()

  // Redirect if user is already logged in
  useEffect(() => {
    if (!isLoading && user) {
      router.push("/profile")
    }
  }, [user, isLoading, router])

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      // Request password reset email using the auth context
      const { error } = await resetPassword(email)

      if (error) {
        setError(error.message)
        return
      }

      setSuccessMessage(
        "Überprüfen Sie Ihre E-Mail für einen Passwort-Reset-Link. Falls Sie ihn nicht sehen, schauen Sie in Ihren Spam-Ordner."
      )
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
          <h1 className="text-2xl font-bold">Passwort zurücksetzen</h1>
          <p className="text-muted-foreground mt-2">
            Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 text-green-800 p-3 rounded-md text-sm">
            {successMessage}
          </div>
        )}

        <form onSubmit={handlePasswordReset} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
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

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Wird gesendet..." : "Reset-Link senden"}
          </Button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            Kennen Sie Ihr Passwort?{" "}
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