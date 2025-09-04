'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { Edit, Trash2, Plus, Eye, EyeOff, Download, Users, BarChart3, CreditCard, ShoppingCart, TrendingUp, Activity, Settings, Shield, Database } from 'lucide-react'

interface Product {
  id: number
  name: string
  description: string | null
  credits_cost?: number
  price_cents?: number
  image_path: string | null
  file_path: string
  category?: string
  stock: number
  is_published: boolean
  created_at: string
  updated_at?: string
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [adminCheckComplete, setAdminCheckComplete] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  
  // Form states
  const [title, setTitle] = useState('')
  const [creditsCost, setCreditsCost] = useState('1')
  const [coverUrl, setCoverUrl] = useState('')
  const [filePath, setFilePath] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Retro & Vintage')
  const [stock, setStock] = useState('100')
  const [isPublished, setIsPublished] = useState(true)
  const [formLoading, setFormLoading] = useState(false)

  // Stats states
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    publishedProducts: 0,
    draftProducts: 0
  })

  // Categories list
  const categories = [
    'Retro & Vintage',
    'Gaming',
    'Work & Motivation',
    'Nature & Landscape',
    'Movies & Series',
    'Art & Minimal',
    'Tech & Space',
    'Cars & Motorcycles',
    'Sports & Teams'
  ]

  const router = useRouter()
  const supabase = createClient()

  // Fetch products on component mount
  useEffect(() => {
    checkAdminAccess()
    fetchProducts()
    fetchStats()
    checkDatabaseMigration()
  }, [])

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Admin kontrolü
      const { data: adminUser, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error || !adminUser) {
        alert('Bu sayfaya erişim yetkiniz yok!')
        router.push('/')
        return
      }

      console.log('Admin access granted:', adminUser.email)
      setAdminCheckComplete(true)
    } catch (error) {
      console.error('Admin check error:', error)
      router.push('/')
    }
  }

  const fetchProducts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching products:', error)
        return
      }

      setProducts(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      // Fetch total products
      const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      // Fetch published products
      const { count: publishedProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true)

      // Fetch total users
      const { count: totalUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })

      // Fetch total orders
      const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })

      setStats({
        totalProducts: totalProducts || 0,
        totalUsers: totalUsers || 0,
        totalOrders: totalOrders || 0,
        totalRevenue: 0, // Calculate from orders
        publishedProducts: publishedProducts || 0,
        draftProducts: (totalProducts || 0) - (publishedProducts || 0)
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const resetForm = () => {
    setTitle('')
    setCreditsCost('1')
    setCoverUrl('')
    setFilePath('')
    setDescription('')
    setCategory('Retro & Vintage')
    setStock('100')
    setIsPublished(true)
    setEditingProduct(null)
    setShowAddForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert('Lütfen giriş yapın')
        return
      }

      if (editingProduct) {
        // Update existing product
        const updateData: any = {
          name: title,
          description: description || null,
          image_path: coverUrl || null,
          file_path: filePath,
          category: category,
          stock: parseInt(stock),
          is_published: isPublished
        }

        try {
          updateData.credits_cost = parseInt(creditsCost)
        } catch (e) {
          updateData.price_cents = parseInt(creditsCost) * 100
        }

        const { error } = await supabase
          .from('products')
          .update(updateData)
          .eq('id', editingProduct.id)

        if (error) {
          alert(`Ürün güncellenirken hata oluştu: ${error.message}`)
        } else {
          alert('Ürün başarıyla güncellendi!')
          resetForm()
          fetchProducts()
          fetchStats()
        }
      } else {
        // Add new product
        const insertData: any = {
          name: title,
          description: description || null,
          image_path: coverUrl || null,
          file_path: filePath,
          category: category,
          stock: parseInt(stock),
          is_published: isPublished
        }

        try {
          insertData.credits_cost = parseInt(creditsCost)
        } catch (e) {
          insertData.price_cents = parseInt(creditsCost) * 100
        }

        const { error } = await supabase
          .from('products')
          .insert(insertData)

        if (error) {
          alert(`Ürün eklenirken hata oluştu: ${error.message}`)
        } else {
          alert('Ürün başarıyla eklendi!')
          resetForm()
          fetchProducts()
          fetchStats()
        }
      }
    } catch (error) {
      console.error('Hata:', error)
      alert('Bir hata oluştu')
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setTitle(product.name)
    setCreditsCost(product.credits_cost?.toString() || '1')
    setCoverUrl(product.image_path || '')
    setFilePath(product.file_path)
    setDescription(product.description || '')
    setCategory(product.category || 'Retro & Vintage')
    setStock(product.stock.toString())
    setIsPublished(product.is_published)
    setShowAddForm(true)
  }

  const handleDelete = async (productId: number) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) {
        alert(`Ürün silinirken hata oluştu: ${error.message}`)
      } else {
        alert('Ürün başarıyla silindi!')
        fetchProducts()
        fetchStats()
      }
    } catch (error) {
      console.error('Hata:', error)
      alert('Bir hata oluştu')
    }
  }

  const togglePublish = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ 
          is_published: !product.is_published
        })
        .eq('id', product.id)

      if (error) {
        alert(`Durum güncellenirken hata oluştu: ${error.message}`)
      } else {
        fetchProducts()
        fetchStats()
      }
    } catch (error) {
      console.error('Hata:', error)
      alert('Bir hata oluştu')
    }
  }

  const checkDatabaseMigration = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, credits_cost')
        .limit(1)

      if (error) {
        console.warn('Database migration check failed:', error)
        return
      }

      if (data && data.length > 0 && data[0].credits_cost === undefined) {
        console.warn('⚠️ Database migration needed!')
        alert('⚠️ Database migration gerekli!')
      } else {
        console.log('✅ Database migration check passed')
      }
    } catch (error) {
      console.warn('Migration check error:', error)
    }
  }

  if (loading || !adminCheckComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-black dark:via-neutral-900 dark:to-black transition-colors duration-300">
        <Header />
        <div className="pt-32 text-center">
          <div className="text-2xl text-gray-800 dark:text-white">Checking Admin Access...</div>
          <div className="text-gray-600 dark:text-neutral-400 mt-2">Please wait while we verify your permissions</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-black dark:via-neutral-900 dark:to-black transition-colors duration-300">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative w-full text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-neutral-300 mb-8">
            Complete control over your wallpaper platform
          </p>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="py-8">
        <div className="w-full">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white/50 dark:bg-neutral-800/50 text-gray-700 dark:text-neutral-300 hover:bg-white/80 dark:hover:bg-neutral-700/80'
              }`}
            >
              <BarChart3 className="w-5 h-5 inline mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'products'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white/50 dark:bg-neutral-800/50 text-gray-700 dark:text-neutral-300 hover:bg-white/80 dark:hover:bg-neutral-700/80'
              }`}
            >
              <ShoppingCart className="w-5 h-5 inline mr-2" />
              Products
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'users'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white/50 dark:bg-neutral-800/50 text-gray-700 dark:text-neutral-300 hover:bg-white/80 dark:hover:bg-neutral-700/80'
              }`}
            >
              <Users className="w-5 h-5 inline mr-2" />
              Users
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white/50 dark:bg-neutral-800/50 text-gray-700 dark:text-neutral-300 hover:bg-white/80 dark:hover:bg-neutral-700/80'
              }`}
            >
              <TrendingUp className="w-5 h-5 inline mr-2" />
              Analytics
            </button>
          </div>
        </div>
      </section>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <section className="py-16">
          <div className="w-full">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-white/50 dark:bg-neutral-900/50 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">Total Products</p>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.totalProducts}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white/50 dark:bg-neutral-900/50 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">Total Users</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.totalUsers}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white/50 dark:bg-neutral-900/50 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">Total Orders</p>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.totalOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white/50 dark:bg-neutral-900/50 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">Published</p>
                    <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.publishedProducts}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/50 dark:bg-neutral-900/50 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add New Product
                  </button>
                  <button
                    onClick={() => setActiveTab('products')}
                    className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Manage Products
                  </button>
                </div>
              </div>

              <div className="bg-white/50 dark:bg-neutral-900/50 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">System Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-neutral-400">Database</span>
                    <span className="text-green-500">● Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-neutral-400">Storage</span>
                    <span className="text-green-500">● Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-neutral-400">Authentication</span>
                    <span className="text-green-500">● Secure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <section className="py-16">
          <div className="w-full">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Products Management</h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add New Product
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white/50 dark:bg-neutral-900/50 rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100/50 dark:bg-neutral-800/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-neutral-300">Image</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-neutral-300">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-neutral-300">Price</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-neutral-300">Stock</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-neutral-300">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-neutral-300">Created</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-neutral-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-neutral-800">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                        <td className="px-6 py-4">
                          {product.image_path ? (
                            <img 
                              src={product.image_path} 
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
                              <span className="text-2xl">🎨</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-semibold text-gray-800 dark:text-white">{product.name}</div>
                            {product.description && (
                                                          <div className="text-sm text-gray-600 dark:text-neutral-400 truncate">
                              {product.description}
                            </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-800 dark:text-white">
                          {product.credits_cost || (product.price_cents ? Math.round(product.price_cents / 100) : 1)} credits
                        </td>
                        <td className="px-6 py-4 text-gray-800 dark:text-white">
                          {product.stock}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => togglePublish(product)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                              product.is_published
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}
                          >
                            {product.is_published ? 'Published' : 'Draft'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-neutral-400">
                          {new Date(product.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-all"
                              title="Edit Product"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-all"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {products.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                    <span className="text-3xl">🎨</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">No Products Yet</h3>
                  <p className="text-gray-600 dark:text-neutral-400">Start by adding your first wallpaper!</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <section className="py-16">
          <div className="w-full">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">User Management</h2>
            
            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/50 dark:bg-neutral-900/50 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{stats.totalUsers}</div>
                <div className="text-gray-600 dark:text-neutral-400">Total Users</div>
              </div>
              <div className="bg-white/50 dark:bg-neutral-900/50 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6 text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{stats.totalOrders}</div>
                <div className="text-gray-600 dark:text-neutral-400">Total Orders</div>
              </div>
              <div className="bg-white/50 dark:bg-neutral-900/50 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">€{(stats.totalOrders * 0.01).toFixed(2)}</div>
                <div className="text-gray-600 dark:text-neutral-400">Estimated Revenue</div>
              </div>
            </div>

            {/* User Management Features */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/50 dark:bg-neutral-900/50 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">User Actions</h3>
                <div className="space-y-3">
                  <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
                    <Users className="w-5 h-5" />
                    View All Users
                  </button>
                  <button className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
                    <Shield className="w-5 h-5" />
                    Manage Permissions
                  </button>
                  <button className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
                    <Activity className="w-5 h-5" />
                    User Activity Log
                  </button>
                </div>
              </div>

              <div className="bg-white/50 dark:bg-neutral-900/50 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-100/50 dark:bg-neutral-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm text-gray-700 dark:text-neutral-300">New user registered</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-neutral-500">2 min ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-100/50 dark:bg-neutral-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                        <ShoppingCart className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-700 dark:text-neutral-300">Order completed</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-neutral-500">15 min ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-100/50 dark:bg-neutral-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-sm text-gray-700 dark:text-neutral-300">Credits purchased</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-neutral-500">1 hour ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <section className="py-16">
          <div className="w-full">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Analytics & Reports</h2>
            
            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/50 dark:bg-neutral-900/50 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">+12%</div>
                <div className="text-gray-600 dark:text-neutral-400">Monthly Growth</div>
              </div>
              <div className="bg-white/50 dark:bg-neutral-900/50 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6 text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">85%</div>
                <div className="text-gray-600 dark:text-neutral-400">Conversion Rate</div>
              </div>
              <div className="bg-white/50 dark:bg-neutral-900/50 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">2.4k</div>
                <div className="text-gray-600 dark:text-neutral-400">Page Views</div>
              </div>
              <div className="bg-white/50 dark:bg-neutral-900/50 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6 text-center">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">€1.2k</div>
                <div className="text-gray-600 dark:text-neutral-400">Monthly Revenue</div>
              </div>
            </div>

            {/* Analytics Content */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/50 dark:bg-neutral-900/50 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Top Categories</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-neutral-400">Gaming</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 dark:bg-neutral-700 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-neutral-400">75%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-neutral-400">Nature & Landscape</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 dark:bg-neutral-700 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: '60%'}}></div>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-neutral-400">60%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-neutral-400">Tech & Space</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 dark:bg-neutral-700 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{width: '45%'}}></div>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-neutral-400">45%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/50 dark:bg-neutral-900/50 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Recent Trends</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-100/50 dark:bg-neutral-800/50 rounded-lg">
                    <span className="text-gray-700 dark:text-neutral-300">Downloads increased by 23%</span>
                    <span className="text-green-500 text-sm">↑</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-100/50 dark:bg-neutral-800/50 rounded-lg">
                    <span className="text-gray-700 dark:text-neutral-300">New user registrations</span>
                    <span className="text-blue-500 text-sm">↑</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-100/50 dark:bg-neutral-800/50 rounded-lg">
                    <span className="text-gray-700 dark:text-neutral-300">Revenue growth</span>
                    <span className="text-green-500 text-sm">↑</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-8 w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-neutral-300">Wallpaper Name *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-neutral-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="Modern Abstract Design"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-neutral-300">Credits Cost *</label>
                  <input
                    type="number"
                    step="1"
                    value={creditsCost}
                    onChange={(e) => setCreditsCost(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-neutral-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="1"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-neutral-300">Cover Image URL</label>
                  <input
                    type="url"
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-neutral-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-neutral-300">File Path *</label>
                  <input
                    type="text"
                    value={filePath}
                    onChange={(e) => setFilePath(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-neutral-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="/wallpapers/abstract-1.jpg"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-neutral-300">Stock</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-neutral-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="100"
                  />
                </div>
                
                <div className="flex items-center space-x-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-700 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-neutral-300">Published</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-neutral-300">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-neutral-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="Describe your wallpaper..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-neutral-300">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 text-gray-800 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-white dark:bg-neutral-800 text-gray-800 dark:text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formLoading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 dark:border-neutral-700 hover:border-gray-400 dark:hover:border-neutral-600 text-gray-700 dark:text-white font-semibold rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
