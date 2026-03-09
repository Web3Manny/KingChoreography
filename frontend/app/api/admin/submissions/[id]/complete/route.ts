import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/auth'
import { supabasePatch } from '@/lib/supabase'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdmin(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const result = await supabasePatch('submissions', `id=eq.${id}`, {
    review_status: 'completed',
    completed_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })
  return NextResponse.json({ status: 'completed', submission: result[0] || {} })
}
