const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''
  return process.env.NEXT_PUBLIC_BASE_URL || ''
}

async function request(path: string, options: RequestInit = {}) {
  const url = `${getBaseUrl()}${path}`
  const token = typeof window !== 'undefined' ? localStorage.getItem('kc_token') : null
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options.headers as Record<string, string> || {}) }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(url, { ...options, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || res.statusText)
  }
  return res.json()
}

// Public
export const getServices = (category?: string) => request(`/api/services${category ? `?category=${category}` : ''}`)
export const submitApplication = (data: any) => request('/api/applications', { method: 'POST', body: JSON.stringify(data) })
export const submitSubmission = (data: any) => request('/api/submissions', { method: 'POST', body: JSON.stringify(data) })
export const submitFreeSubmission = (data: any) => request('/api/submissions/free', { method: 'POST', body: JSON.stringify(data) })
export const calculatePriceApi = (data: any) => request('/api/calculate-price', { method: 'POST', body: JSON.stringify(data) })
export const createPayPalOrder = (data: any) => request('/api/payments/create-order', { method: 'POST', body: JSON.stringify(data) })
export const capturePayPalOrder = (data: any) => request('/api/payments/capture-order', { method: 'POST', body: JSON.stringify(data) })
export const submitContact = (data: any) => request('/api/contact', { method: 'POST', body: JSON.stringify(data) })

// Auth
export const login = (data: any) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(data) })

// Admin
export const getAdminStats = () => request('/api/admin/stats')
export const getRecentActivity = () => request('/api/admin/recent-activity')
export const getAdminQueue = () => request('/api/admin/queue')
export const getAdminApplications = (params?: any) => {
  const qs = params ? '?' + new URLSearchParams(params).toString() : ''
  return request(`/api/admin/applications${qs}`)
}
export const getAdminApplication = (id: string) => request(`/api/admin/applications/${id}`)
export const updateAdminApplication = (id: string, data: any) => request(`/api/admin/applications/${id}`, { method: 'PATCH', body: JSON.stringify(data) })
export const getAdminSubmissions = (params?: any) => {
  const qs = params ? '?' + new URLSearchParams(params).toString() : ''
  return request(`/api/admin/submissions${qs}`)
}
export const getAdminSubmission = (id: string) => request(`/api/admin/submissions/${id}`)
export const updateAdminSubmission = (id: string, data: any) => request(`/api/admin/submissions/${id}`, { method: 'PATCH', body: JSON.stringify(data) })
export const completeSubmission = (id: string) => request(`/api/admin/submissions/${id}/complete`, { method: 'POST' })
export const getAdminServices = () => request('/api/admin/services')
export const createAdminService = (data: any) => request('/api/admin/services', { method: 'POST', body: JSON.stringify(data) })
export const updateAdminService = (id: string, data: any) => request(`/api/admin/services/${id}`, { method: 'PATCH', body: JSON.stringify(data) })
export const deleteAdminService = (id: string) => request(`/api/admin/services/${id}`, { method: 'DELETE' })
