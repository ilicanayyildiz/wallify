"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, Download, Lock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface Purchase {
  id: string
  created_at: string
  product_id: string
  credit_amount: number
  products: {
    id: string
    title: string
    price: number
    thumbnail_url: string
    image_url: string
  }
}

interface CreditTransaction {
  id: string
  created_at: string
  amount: number
  euro_amount: number | null
  description: string
}

export default function ProfilePage() {
  const { user, isLoading, signOut } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [transactions, setTransactions] = useState<CreditTransaction[]>([])
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("purchases")
  const router = useRouter()
  const { toast } = useToast()

  // Security form state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [isLoading, user, router])

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return

      try {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) {
          console.error("Error fetching profile:", profileError)
        } else {
          setProfile(profileData)
        }

        // Fetch user purchases with product information
        const { data: purchasesData, error: purchasesError } = await supabase
          .from('purchases')
          .select(`
            id,
            created_at,
            product_id,
            credit_amount,
            products (
              id,
              title,
              price,
              thumbnail_url,
              image_url
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (purchasesError) {
          console.error("Error fetching purchases:", purchasesError)
        } else {
          setPurchases(purchasesData as unknown as Purchase[])
        }

        // Fetch credit transactions
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('credit_transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        
        if (transactionsError) {
          console.error("Error fetching credit transactions:", transactionsError)
        } else {
          setTransactions(transactionsData as CreditTransaction[])
        }
      } catch (error) {
        console.error("Error in profile fetch:", error)
      } finally {
        setLoadingProfile(false)
      }
    }

    fetchUserData()
  }, [user])

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const handleDownload = async (purchase: Purchase) => {
    if (!purchase.products?.image_url) {
      alert("Bild nicht zum Download verfügbar.")
      return
    }

    setDownloadingId(purchase.id)
    
    try {
      // Get the file name from the URL
      const fileName = purchase.products.image_url.split('/').pop() || 
                       `${purchase.products.title.replace(/\s+/g, '-').toLowerCase()}.jpg`
      
      // Create a temporary anchor element to trigger the download
      const response = await fetch(purchase.products.image_url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      
      // Clean up
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading image:", error)
      alert("Das Bild konnte nicht heruntergeladen werden. Bitte versuchen Sie es erneut.")
    } finally {
      setDownloadingId(null)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setPasswordMessage(null)

    // Basic validations
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Bitte füllen Sie alle Felder aus.' })
      return
    }
    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Das Passwort muss mindestens 6 Zeichen lang sein.' })
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Die neuen Passwörter stimmen nicht überein.' })
      return
    }
    if (currentPassword === newPassword) {
      setPasswordMessage({ type: 'error', text: 'Das neue Passwort muss sich vom aktuellen Passwort unterscheiden.' })
      return
    }

    setIsUpdatingPassword(true)
    try {
      // Verify current password by re-authenticating
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email as string,
        password: currentPassword,
      })
      if (signInError) {
        setPasswordMessage({ type: 'error', text: 'Aktuelles Passwort ist falsch.' })
        return
      }

      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
      if (updateError) {
        setPasswordMessage({ type: 'error', text: `Passwort konnte nicht aktualisiert werden: ${updateError.message}` })
        return
      }

      setPasswordMessage({ type: 'success', text: 'Passwort erfolgreich aktualisiert!' })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error: any) {
      console.error("Error updating password:", error)
      setPasswordMessage({ type: 'error', text: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.' })
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  if (isLoading || loadingProfile) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <div className="w-full max-w-4xl p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="container mx-auto py-12">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Ihr Profil</h1>
          <Button variant="outline" onClick={handleSignOut}>
            Abmelden
          </Button>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Kontoinformationen</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{profile?.full_name || user.user_metadata?.full_name || 'Nicht angegeben'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mitglied seit</p>
              <p className="font-medium">{new Date(user.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Verfügbare Credits</p>
              <div className="flex items-center space-x-2">
                <p className="font-medium text-xl">{profile?.credits || 0}</p>
                <Link href="/add-credits">
                  <Button size="sm" variant="outline" className="h-7 px-2">
                    <Coins className="h-3.5 w-3.5 mr-1" /> Credits hinzufügen
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="purchases" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 p-1 mb-2 bg-background border rounded-lg">
            <TabsTrigger 
              value="purchases" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md py-2 text-base transition-all"
            >
              <div className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Ihre Käufe
                {purchases.length > 0 && (
                  <span className="ml-2 bg-background text-primary font-medium text-xs rounded-full px-2.5 py-1">
                    {purchases.length}
                  </span>
                )}
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="credits" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md py-2 text-base transition-all"
            >
              <div className="flex items-center">
                <Coins className="h-4 w-4 mr-2" />
                Credit-Verwaltung
                {transactions.length > 0 && (
                  <span className="ml-2 bg-background text-primary font-medium text-xs rounded-full px-2.5 py-1">
                    {transactions.length}
                  </span>
                )}
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md py-2 text-base transition-all"
            >
              <div className="flex items-center">
                <Lock className="h-4 w-4 mr-2" />
                Sicherheit
              </div>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="purchases" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                {purchases.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Sie haben noch keine Bilder gekauft.</p>
                    <Button className="mt-4" onClick={() => router.push("/browse")}>
                      Stock-Bilder durchsuchen
                    </Button>
                  </div>
                ) : (
                  <div className="border rounded-md divide-y">
                    <div className="grid grid-cols-12 gap-4 p-3 font-medium bg-secondary/50 text-sm">
                      <div className="col-span-1"></div>
                      <div className="col-span-5">Bild</div>
                      <div className="col-span-2 text-right">Gekauft am</div>
                      <div className="col-span-2 text-right">Preis</div>
                      <div className="col-span-2 text-right">Aktion</div>
                    </div>
                    {purchases.map((purchase) => (
                      <div key={purchase.id} className="grid grid-cols-12 gap-4 p-3 text-sm hover:bg-muted/50 items-center">
                        <div className="col-span-1">
                          <div className="relative h-12 w-12 overflow-hidden rounded-md">
                            {purchase.products?.thumbnail_url ? (
                              <Image
                                src={purchase.products.thumbnail_url}
                                alt={purchase.products.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <p className="text-xs text-gray-500">Kein Bild</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-span-5">
                          <Link 
                            href={`/product/${purchase.products?.id || purchase.product_id}`}
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {purchase.products?.title || 'Unbenannt'}
                          </Link>
                        </div>
                        <div className="col-span-2 text-right text-muted-foreground">
                          {new Date(purchase.created_at).toLocaleDateString()}
                        </div>
                        <div className="col-span-2 text-right font-medium">
                          <span className="flex items-center justify-end">
                            <Coins className="h-3.5 w-3.5 mr-1 inline" />
                            {purchase.credit_amount || purchase.products?.price || 0}
                          </span>
                        </div>
                        <div className="col-span-2 text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownload(purchase)}
                            disabled={downloadingId === purchase.id}
                            className="inline-flex items-center"
                          >
                            {downloadingId === purchase.id ? (
                              "Wird heruntergeladen..."
                            ) : (
                              <>
                                <Download className="h-3.5 w-3.5 mr-1" /> Herunterladen
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="credits" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                {transactions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Noch keine Transaktionen.</p>
                    <Button className="mt-4" onClick={() => router.push("/add-credits")}>
                      Credits hinzufügen
                    </Button>
                  </div>
                ) : (
                  <div className="border rounded-md divide-y">
                    <div className="grid grid-cols-12 gap-4 p-3 font-medium bg-secondary/50 text-sm">
                      <div className="col-span-5">Beschreibung</div>
                      <div className="col-span-3 text-right">Datum</div>
                      <div className="col-span-2 text-right">Betrag</div>
                      <div className="col-span-2 text-right">Wert</div>
                    </div>
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="grid grid-cols-12 gap-4 p-3 text-sm hover:bg-muted/50">
                        <div className="col-span-5">{transaction.description}</div>
                        <div className="col-span-3 text-right text-muted-foreground">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </div>
                        <div className={`col-span-2 text-right ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount} Credits
                        </div>
                        <div className="col-span-2 text-right">
                          {transaction.euro_amount ? `€${transaction.euro_amount.toFixed(2)}` : '-'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Passwort ändern</CardTitle>
              </CardHeader>
              <CardContent>
                {passwordMessage && (
                  <div className={`mb-4 p-3 rounded-md text-sm ${
                    passwordMessage.type === 'success' 
                      ? 'bg-green-50 border border-green-200 text-green-800' 
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}>
                    {passwordMessage.text}
                  </div>
                )}
                <form className="space-y-4" onSubmit={handleChangePassword}>
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Aktuelles Passwort</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Geben Sie Ihr aktuelles Passwort ein"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Neues Passwort</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Geben Sie ein neues Passwort ein"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Neues Passwort bestätigen</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Geben Sie das neue Passwort erneut ein"
                    />
                  </div>
                  <div className="pt-2">
                    <Button type="submit" disabled={isUpdatingPassword}>
                      {isUpdatingPassword ? "Wird aktualisiert..." : "Passwort aktualisieren"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}