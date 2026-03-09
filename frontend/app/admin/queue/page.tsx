'use client'

import { useState, useEffect } from 'react'
import { getAdminQueue } from '@/lib/api'

export default function AdminQueuePage() {
  const [queue, setQueue] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAdminQueue().then(r => {
      if (r && r.week) setQueue([{ ...r.week, submissions: r.submissions || [] }])
      else setQueue(Array.isArray(r) ? r : [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div data-testid="admin-queue">
      <h1 className="font-heading text-3xl font-bold uppercase text-white mb-6">Review Queue</h1>
      <div className="space-y-6">
        {queue.length === 0 && !loading && <div className="bg-[#121212] border border-white/10 rounded-md p-8 text-center text-white/30 text-sm">No items in queue</div>}
        {queue.map((week: any, i: number) => (
          <div key={i} className="bg-[#121212] border border-white/10 rounded-md p-6" data-testid={`queue-week-${i}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-bold uppercase text-white">Week of {new Date(week.week_start).toLocaleDateString()}</h3>
              <span className="text-[#D4AF37] text-sm font-bold">{week.submissions?.length || 0} submissions</span>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full mb-4">
              <div className="bg-[#D4AF37] h-2 rounded-full" style={{ width: `${Math.min(100, ((week.submissions?.length || 0) / 10) * 100)}%` }} />
            </div>
            {week.submissions?.map((sub: any) => (
              <div key={sub.id} className="flex items-center justify-between py-2 border-t border-white/5 text-sm">
                <div><span className="text-white">{sub.gym_name}</span> <span className="text-white/40 ml-2 capitalize">{sub.service_type?.replace(/_/g, ' ')}</span></div>
                <span className={`px-2 py-0.5 text-xs font-bold uppercase rounded ${
                  sub.review_status === 'completed' ? 'bg-green-500/20 text-green-400' :
                  sub.review_status === 'in_review' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>{sub.review_status}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
