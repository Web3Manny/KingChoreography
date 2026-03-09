import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  return NextResponse.json({
    order_id: `MOCK-${randomUUID().slice(0, 12).toUpperCase()}`,
    status: 'CREATED',
    message: 'PayPal integration placeholder (mock)',
  })
}
