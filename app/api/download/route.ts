import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('product_id')
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    // Check if user purchased this product using orders/order_items
    const { data: order } = await supabase
      .from('orders')
      .select(`
        id,
        order_items!inner(product_id)
      `)
      .eq('user_id', user.id)
      .eq('order_items.product_id', productId)
      .single()

    if (!order) {
      return NextResponse.json({ error: 'Product not purchased' }, { status: 403 })
    }

    // Get product details
    const { data: product } = await supabase
      .from('products')
      .select('name, file_path')
      .eq('id', productId)
      .single()

    if (!product || !product.file_path) {
      return NextResponse.json({ error: 'Product file not found' }, { status: 404 })
    }

    // Force download by streaming the file
    console.log('Debug: Streaming file for download:', product.file_path)
    
    // Get the file from Supabase Storage
    const { data, error } = await supabase.storage
      .from('wallpapers')
      .download(product.file_path)
    
    if (error || !data) {
      console.error('Download error:', error)
      return NextResponse.json({ error: 'Failed to download file' }, { status: 500 })
    }
    
    // Convert to blob and return with download headers
    const blob = new Blob([data], { type: 'application/octet-stream' })
    const response = new NextResponse(blob)
    response.headers.set('Content-Disposition', `attachment; filename="${product.file_path}"`)
    response.headers.set('Content-Type', 'application/octet-stream')
    
    return response

  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
