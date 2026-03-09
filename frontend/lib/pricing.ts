export interface PriceResult {
  total: number
  breakdown: Record<string, any>
}

export function calculatePrice(
  service: any,
  athleteCount: number,
  isClient: boolean,
  sessionLength: string | null,
  includeConsultation: boolean
): PriceResult {
  if (service.service_type === 'free_tier') {
    return { total: 0, breakdown: { type: 'free' } }
  }

  if (service.service_type === 'review_feedback') {
    const rate = isClient
      ? parseFloat(service.client_rate || 0)
      : parseFloat(service.nonclient_rate || 0)
    const breakdown: any = { base: rate, clientDiscount: isClient, service: 'Review & Feedback' }
    let total = rate
    if (includeConsultation && service.addon_price) {
      const addon = parseFloat(service.addon_price)
      total += addon
      breakdown.consultationAddon = addon
    }
    return { total: Math.round(total * 100) / 100, breakdown }
  }

  if (service.service_type === 'virtual_upgrade') {
    let rateKey = ''
    if (isClient && sessionLength === '2hr') rateKey = 'per_athlete_rate_client_2hr'
    else if (isClient && sessionLength === '4hr') rateKey = 'per_athlete_rate_client_4hr'
    else if (!isClient && sessionLength === '2hr') rateKey = 'per_athlete_rate_nonclient_2hr'
    else if (!isClient && sessionLength === '4hr') rateKey = 'per_athlete_rate_nonclient_4hr'

    const perAthleteRate = parseFloat(service[rateKey] || 0)
    const total = athleteCount * perAthleteRate
    return {
      total: Math.round(total * 100) / 100,
      breakdown: {
        perAthleteRate,
        athleteCount,
        sessionLength,
        isClient,
        formula: `${athleteCount} x $${perAthleteRate}`,
        service: 'Virtual Routine Upgrade',
      },
    }
  }

  return { total: 0, breakdown: {} }
}

export function assignReviewWeek(submittedAt: Date): string {
  const day = submittedAt.getDay()
  const diff = submittedAt.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(submittedAt)
  monday.setDate(diff)
  monday.setHours(0, 0, 0, 0)

  const target = new Date(monday)
  if (submittedAt > monday) {
    target.setDate(target.getDate() + 7)
  }
  return target.toISOString().split('T')[0]
}
