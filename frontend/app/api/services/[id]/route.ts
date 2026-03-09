import { NextRequest, NextResponse } from 'next/server'
import { supabaseGet } from '@/lib/supabase'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await supabaseGet('services', `id=eq.${id}`)
  if (!data.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(data[0])
}
