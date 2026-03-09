import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { supabasePatch } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get('order_id') || ''
  const submissionId = request.nextUrl.searchParams.get('submission_id') || ''
  const txnId = `TXN-${randomUUID().slice(0, 12).toUpperCase()}`

  if (submissionId) {
    await supabasePatch('submissions', `id=eq.${submissionId}`, {
      payment_status: 'paid',
      paypal_order_id: orderId,
      paypal_txn_id: txnId,
      updated_at: new Date().toISOString(),
    })
  }
  return NextResponse.json({ txn_id: txnId, status: 'COMPLETED', message: 'Payment captured (mock)' })
}
