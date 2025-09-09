"use client"

import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from "react"
import { supabase } from "@/lib/supabase"
import { Session, User } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
  updatePassword: (password: string) => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      setIsLoading(true)
      
      try {
        const { data } = await supabase.auth.getSession()
        setSession(data.session)
        setUser(data.session?.user || null)
        
        // Listen for auth changes
        const { data: authListener } = supabase.auth.onAuthStateChange(
          (event, newSession) => {
            setSession(newSession)
            setUser(newSession?.user || null)
            setIsLoading(false)
          }
        )
        
        return () => {
          authListener.subscription.unsubscribe()
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    initializeAuth()
  }, [])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      return { error: error }
    } catch (error) {
      console.error("Error resetting password:", error)
      return { error: error as Error }
    }
  }

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })
      return { error: error }
    } catch (error) {
      console.error("Error updating password:", error)
      return { error: error as Error }
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isLoading, 
      signOut,
      resetPassword,
      updatePassword
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 