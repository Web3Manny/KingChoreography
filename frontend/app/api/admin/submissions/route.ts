import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/auth'
import { supabaseGet } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const admin = await verifyAdmin(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const serviceType = request.nextUrl.searchParams.get('service_type')
  const reviewStatus = request.nextUrl.searchParams.get('review_status')
  let params = 'order=submitted_at.desc'
  if (serviceType && serviceType !== 'all') params += `&service_type=eq.${serviceType}`
  if (reviewStatus && reviewStatus !== 'all') params += `&review_status=eq.${reviewStatus}`
  return NextResponse.json(await supabaseGet('submissions', params))
}
