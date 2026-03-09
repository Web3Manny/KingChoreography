const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || ''

function headers() {
  return {
    apikey: SUPABASE_SERVICE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  }
}

export async function supabaseGet(table: string, params = '') {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
    headers: headers(),
    cache: 'no-store',
  })
  if (!r.ok) throw new Error(`Supabase GET ${table} failed: ${r.status}`)
  return r.json()
}

export async function supabasePost(table: string, data: any) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  })
  if (!r.ok) throw new Error(`Supabase POST ${table} failed: ${r.status}`)
  return r.json()
}

export async function supabasePatch(table: string, matchParams: string, data: any) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${matchParams}`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify(data),
  })
  if (!r.ok) throw new Error(`Supabase PATCH ${table} failed: ${r.status}`)
  return r.json()
}

export async function supabaseDelete(table: string, matchParams: string) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${matchParams}`, {
    method: 'DELETE',
    headers: headers(),
  })
  if (!r.ok) throw new Error(`Supabase DELETE ${table} failed: ${r.status}`)
  return r.status
}
