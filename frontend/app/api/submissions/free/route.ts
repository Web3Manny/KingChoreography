import { NextRequest, NextResponse } from 'next/server'
import { supabasePost } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const body = await request.json()
  if (!body.is_existing_client) {
    return NextResponse.json({ error: 'Free submissions are for current clients only' }, { status: 400 })
  }
  const data = {
    ...body,
    service_type: 'free_tier',
    calculated_amount: 0,
    price_breakdown: JSON.stringify({ type: 'free' }),
    payment_status: 'free',
    review_status: 'not_applicable',
    review_week: null,
    submitted_at: new Date().toISOString(),
  }
  const result = await supabasePost('submissions', data)
  return NextResponse.json(result[0] || data)
}
