import { NextRequest, NextResponse } from 'next/server'
import { supabaseGet } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get('category')
  let params = 'is_active=eq.true&order=sort_order.asc'
  if (category) params += `&category=eq.${category}`
  const data = await supabaseGet('services', params)
  return NextResponse.json(data)
}
