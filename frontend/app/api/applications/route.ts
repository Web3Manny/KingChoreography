import { NextRequest, NextResponse } from 'next/server'
import { supabasePost } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const data = {
    ...body,
    status: 'new',
    submitted_at: new Date().toISOString(),
  }
  const result = await supabasePost('applications', data)
  return NextResponse.json(result[0] || data)
}
