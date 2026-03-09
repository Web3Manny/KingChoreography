import { NextRequest, NextResponse } from 'next/server'
import { supabaseGet } from '@/lib/supabase'
import { calculatePrice } from '@/lib/pricing'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const services = await supabaseGet('services', `id=eq.${body.service_id}`)
  if (!services.length) return NextResponse.json({ error: 'Service not found' }, { status: 404 })
  return NextResponse.json(
    calculatePrice(services[0], body.athlete_count || 1, body.is_existing_client || false, body.session_length || null, body.consultation_addon || false)
  )
}
