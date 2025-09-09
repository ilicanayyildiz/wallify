"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Search, ShoppingCart, User, LogOut, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import Image from "next/image"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, signOut } = useAuth()
  const router = useRouter()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image 
            src="/images/logo.svg" 
            alt="Pixeryo" 
            width={120} 
            height={32} 
            className="h-12 w-auto" 
          />
          <span className="text-xl font-bold">Pixeryo</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/browse" className="text-foreground/80 hover:text-foreground transition-colors">
            Durchsuchen
          </Link>
          <Link href="/categories" className="text-foreground/80 hover:text-foreground transition-colors">
            Kategorien
          </Link>
          <Link href="/pricing" className="text-foreground/80 hover:text-foreground transition-colors">
            Preise
          </Link>
          <Link href="/contacts" className="text-foreground/80 hover:text-foreground transition-colors">
            Kontakt
          </Link>
        </nav>

        {/* Search and Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/*<Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>*/}
          
          {user ? (
            <>
              <Link href="/profile">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/add-credits">
                <Button variant="ghost" size="icon">
                  <Coins className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-5 w-5" />
              </Button>
              <ModeToggle />
            </>
          ) : (
            <>
              <ModeToggle />
              <Link href="/login">
                <Button variant="outline">Anmelden</Button>
              </Link>
              <Link href="/signup">
                <Button>Registrieren</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link href="/browse" className="text-foreground py-2" onClick={toggleMenu}>
              Durchsuchen
            </Link>
            <Link href="/categories" className="text-foreground py-2" onClick={toggleMenu}>
              Kategorien
            </Link>
            <Link href="/about" className="text-foreground py-2" onClick={toggleMenu}>
              Über uns
            </Link>
            <Link href="/pricing" className="text-foreground py-2" onClick={toggleMenu}>
              Preise
            </Link>
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-4">
                {user ? (
                  <>
                    <Link href="/profile" onClick={toggleMenu}>
                      <Button variant="ghost" size="icon">
                        <User className="h-5 w-5" />
                      </Button>
                    </Link>
                    <Link href="/add-credits" onClick={toggleMenu}>
                      <Button variant="ghost" size="icon">
                        <Coins className="h-5 w-5" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={handleSignOut}>
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </>
                ) : (
                  <Link href="/login" onClick={toggleMenu}>
                    <Button variant="outline">Anmelden</Button>
                  </Link>
                )}
                <ModeToggle />
              </div>
              {!user && (
                <Link href="/signup" onClick={toggleMenu}>
                  <Button>Registrieren</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
} 