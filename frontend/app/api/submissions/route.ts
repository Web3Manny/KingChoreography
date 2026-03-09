import { NextRequest, NextResponse } from 'next/server'
import { supabaseGet, supabasePost, supabasePatch } from '@/lib/supabase'
import { calculatePrice, assignReviewWeek } from '@/lib/pricing'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const services = await supabaseGet('services', `id=eq.${body.service_id}`)
  if (!services.length) return NextResponse.json({ error: 'Service not found' }, { status: 404 })
  const service = services[0]

  const priceResult = calculatePrice(
    service, body.athlete_count || 1, body.is_existing_client || false,
    body.session_length || null, body.consultation_addon || false
  )

  const data: any = {
    ...body,
    calculated_amount: priceResult.total,
    price_breakdown: JSON.stringify(priceResult.breakdown),
    submitted_at: new Date().toISOString(),
  }

  if (service.service_type === 'free_tier') {
    data.payment_status = 'free'
    data.review_status = 'not_applicable'
    data.review_week = null
  } else {
    data.payment_status = 'pending'
    data.review_status = 'queued'
    const reviewWeek = assignReviewWeek(new Date())
    data.review_week = reviewWeek
    // Ensure review week exists
    const existing = await supabaseGet('review_weeks', `week_start=eq.${reviewWeek}`)
    if (!existing.length) {
      await supabasePost('review_weeks', { week_start: reviewWeek, capacity: 20, current_count: 1 })
    } else {
      await supabasePatch('review_weeks', `week_start=eq.${reviewWeek}`, {
        current_count: (existing[0].current_count || 0) + 1,
      })
    }
  }

  const result = await supabasePost('submissions', data)
  return NextResponse.json(result[0] || data)
}
