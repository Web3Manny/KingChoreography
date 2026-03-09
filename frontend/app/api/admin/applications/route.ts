import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/auth'
import { supabaseGet } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const admin = await verifyAdmin(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const status = request.nextUrl.searchParams.get('status')
  let params = 'order=submitted_at.desc'
  if (status && status !== 'all') params += `&status=eq.${status}`
  return NextResponse.json(await supabaseGet('applications', params))
}
