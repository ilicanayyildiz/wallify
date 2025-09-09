"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"

export default function ResetPasswordPage() {
  const { updatePassword, user, isLoading } = useAuth()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [hashPresent, setHashPresent] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if the URL contains a hash parameter (from the reset email)
    const hasHash = window.location.hash && window.location.hash.length > 0
    setHashPresent(!!hasHash)

    // If on client side and URL has a hash, Supabase needs to process it
    if (hasHash) {
      // The auth API will check for a hash in the URL and exchange it for a session
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          // Hash processed by Supabase, URL should be clear now
          setHashPresent(true)
        }
      })
    } else {
      // If no hash is present and user is logged in, redirect to profile
      if (!isLoading && user) {
        router.push("/profile")
      }
    }
  }, [isLoading, user, router])

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Password validation
    if (password.length < 6) {
      setError("Das Passwort muss mindestens 6 Zeichen lang sein")
      return
    }
    
    if (password !== confirmPassword) {
      setError("Die Passwörter stimmen nicht überein")
      return
    }

    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      // Update the password using the auth context
      const { error } = await updatePassword(password)

      if (error) {
        setError(error.message)
        return
      }

      setSuccessMessage("Ihr Passwort wurde erfolgreich aktualisiert")
      
      // Redirect to login page after successful reset
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err) {
      setError("Ein unerwarteter Fehler ist aufgetreten")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!hashPresent) {
    return (
      <div className="container mx-auto py-12 flex flex-col items-center">
        <div className="w-full max-w-md space-y-8 p-8 border border-border rounded-lg bg-card">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Passwort-Reset-Fehler</h1>
            <p className="text-muted-foreground mt-2">
              Diese Seite kann nur über einen Passwort-Reset-Link aufgerufen werden, der an Ihre E-Mail gesendet wurde.
            </p>
          </div>
          <div className="flex justify-center">
            <Button onClick={() => router.push("/forgot-password")}>
              Neuen Reset-Link anfordern
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 flex flex-col items-center">
      <div className="w-full max-w-md space-y-8 p-8 border border-border rounded-lg bg-card">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Neues Passwort festlegen</h1>
          <p className="text-muted-foreground mt-2">
            Erstellen Sie ein neues Passwort für Ihr Konto
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

        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Neues Passwort
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
            />
            <p className="text-xs text-muted-foreground">
              Das Passwort muss mindestens 6 Zeichen lang sein
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Neues Passwort bestätigen
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "Wird aktualisiert..." : "Passwort aktualisieren"}
          </Button>
        </form>
      </div>
    </div>
  )
} 