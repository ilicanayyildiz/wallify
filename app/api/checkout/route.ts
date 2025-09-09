import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get session first
    const { data: { session } } = await supabase.auth.getSession()
    console.log('Session check:', { session: !!session, sessionId: session?.access_token?.substring(0, 20) })
    
    if (!session) {
      console.log('No session found, redirecting to login')
      return NextResponse.json({ error: 'No active session' }, { status: 401 })
    }
    
    const { data: { user } } = await supabase.auth.getUser()
    console.log('User check:', { user: !!user, userId: user?.id })
    
    if (!user) {
      console.log('No user found, redirecting to login')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const productId = formData.get('product_id') as string
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    // Get product details
    console.log('Looking for product with ID:', productId)
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()

    console.log('Product query result:', { product, productError })

    if (!product) {
      return NextResponse.json({ 
        error: 'Product not found',
        productId,
        productError: productError?.message 
      }, { status: 404 })
    }

    // Check if user already purchased this product (using orders table)
    console.log('Checking existing orders for user:', user.id, 'product:', productId)
    const { data: existingOrder, error: orderCheckError } = await supabase
      .from('orders')
      .select(`
        id,
        order_items!inner(product_id)
      `)
      .eq('user_id', user.id)
      .eq('order_items.product_id', productId)
      .single()

    console.log('Existing order check:', { existingOrder, orderCheckError })

    if (existingOrder) {
      console.log('Product already purchased, redirecting to error page')
      // Redirect to beautiful error page
      const errorUrl = new URL('/error/purchase', request.url)
      errorUrl.searchParams.set('message', 'Bu ürünü zaten satın aldınız!')
      errorUrl.searchParams.set('productName', product.name)
      return NextResponse.redirect(errorUrl)
    }

    // Check if user has enough credits
    console.log('Checking user credits for product:', product.credits_cost)
    const { data: userProfile, error: profileCheckError } = await supabase
      .from('user_profiles')
      .select('credits')
      .eq('id', user.id)
      .single()

    console.log('User profile check:', { userProfile, profileCheckError })

    if (profileCheckError || !userProfile) {
      console.error('Failed to get user profile:', profileCheckError)
      return NextResponse.json({ error: 'Failed to get user profile' }, { status: 500 })
    }

    if (userProfile.credits < product.credits_cost) {
      console.log('Insufficient credits:', { 
        userCredits: userProfile.credits, 
        requiredCredits: product.credits_cost 
      })
      // Redirect to error page with insufficient credits message
      const errorUrl = new URL('/error/purchase', request.url)
      errorUrl.searchParams.set('message', `Yetersiz kredi! ${product.credits_cost} kredi gerekli, ${userProfile.credits} krediniz var.`)
      errorUrl.searchParams.set('productName', product.name)
      return NextResponse.redirect(errorUrl)
    }

    console.log('Credit check passed:', { 
      userCredits: userProfile.credits, 
      requiredCredits: product.credits_cost,
      remainingCredits: userProfile.credits - product.credits_cost
    })

    // Create order record (demo - no actual payment processing)
    console.log('Creating order with data:', {
      user_id: user.id,
      total_cents: product.credits_cost * 100, // Convert credits to cents for order total
      credits_used: product.credits_cost,
      status: 'completed'
    })
    
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total_cents: product.credits_cost * 100, // Convert credits to cents for order total
        credits_used: product.credits_cost,
        status: 'completed'
      })
      .select()
      .single()

    console.log('Order creation result:', { order, orderError })

    if (orderError) {
      console.error('Order creation error:', orderError)
      return NextResponse.json({ 
        error: 'Failed to create order',
        orderError: orderError.message,
        details: orderError.details
      }, { status: 500 })
    }

    // Create order item
    console.log('Creating order item with data:', {
      order_id: order.id,
      product_id: productId,
      quantity: 1,
      unit_price_cents: product.credits_cost * 100, // Convert credits to cents
      credits_cost: product.credits_cost
    })
    
    const { data: orderItem, error: itemError } = await supabase
      .from('order_items')
      .insert({
        order_id: order.id,
        product_id: productId,
        quantity: 1,
        unit_price_cents: product.credits_cost * 100, // Convert credits to cents
        credits_cost: product.credits_cost
      })
      .select()
      .single()

    console.log('Order item creation result:', { orderItem, itemError })

    if (itemError) {
      console.error('Order item creation error:', itemError)
      return NextResponse.json({ 
        error: 'Failed to create order item',
        itemError: itemError.message,
        details: itemError.details
      }, { status: 500 })
    }

    // Create credit transaction for usage
    const { error: creditError } = await supabase
      .from('credit_transactions')
      .insert({
        user_id: user.id,
        amount: -product.credits_cost, // Negative for usage
        type: 'usage',
        description: `Downloaded wallpaper: ${product.name}`,
        order_id: order.id
      })

    if (creditError) {
      console.error('Credit transaction error:', creditError)
      // Don't fail the order, just log the error
    }

    // Update user profile credits (userProfile already defined above)
    const { error: profileError } = await supabase
      .from('user_profiles')
      .update({ 
        credits: (userProfile.credits) - product.credits_cost,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (profileError) {
      console.error('Profile update error:', profileError)
      // Don't fail the order, just log the error
    }

    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: 'Download successful',
      product: product.name,
      creditsUsed: product.credits_cost,
      remainingCredits: (userProfile.credits) - product.credits_cost
    })

  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
