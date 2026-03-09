'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { getAdminSubmission, updateAdminSubmission, completeSubmission } from '@/lib/api'
import { toast } from 'sonner'

const statusColors: Record<string, string> = {
  queued: 'bg-yellow-500/20 text-yellow-400', in_review: 'bg-blue-500/20 text-blue-400',
  completed: 'bg-green-500/20 text-green-400', not_applicable: 'bg-gray-500/20 text-gray-400',
}

export default function AdminSubmissionDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [sub, setSub] = useState<any>(null)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getAdminSubmission(id as string).then(r => { setSub(r); setNotes(r.admin_notes || '') }).catch(() => router.push('/admin/submissions'))
  }, [id, router])

  const updateStatus = async (review_status: string) => {
    setSaving(true)
    try {
      const res = await updateAdminSubmission(id as string, { review_status })
      setSub(res)
      toast.success(`Status updated to ${review_status}`)
    } catch { toast.error('Failed to update') }
    finally { setSaving(false) }
  }

  const handleComplete = async () => {
    setSaving(true)
    try {
      const res = await completeSubmission(id as string)
      setSub(res)
      toast.success('Submission marked as completed')
    } catch { toast.error('Failed to complete') }
    finally { setSaving(false) }
  }

  const saveNotes = async () => {
    setSaving(true)
    try {
      await updateAdminSubmission(id as string, { admin_notes: notes })
      toast.success('Notes saved')
    } catch { toast.error('Failed to save notes') }
    finally { setSaving(false) }
  }

  if (!sub) return <div className="p-8 text-white/30">Loading...</div>

  return (
    <div data-testid="admin-submission-detail">
      <button onClick={() => router.push('/admin/submissions')} className="inline-flex items-center gap-2 text-white/40 text-sm mb-6 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Submissions
      </button>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold uppercase text-white">{sub.gym_name}</h1>
          <p className="text-white/40 text-sm">{sub.full_name} &middot; <span className="capitalize">{sub.service_type?.replace(/_/g, ' ')}</span></p>
        </div>
        <span className={`px-3 py-1.5 text-xs font-bold uppercase rounded ${statusColors[sub.review_status]}`}>{sub.review_status}</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#121212] border border-white/10 rounded-md p-6">
            <h3 className="font-heading text-sm font-bold uppercase text-[#D4AF37] mb-4">Submission Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-white/40 block">Email</span><span className="text-white">{sub.email}</span></div>
              <div><span className="text-white/40 block">Athletes</span><span className="text-white">{sub.athlete_count}</span></div>
              <div><span className="text-white/40 block">Client Status</span><span className="text-white">{sub.is_existing_client ? 'Current Client' : 'Non-Client'}</span></div>
              <div><span className="text-white/40 block">Amount</span><span className="text-[#D4AF37] font-bold">{sub.payment_status === 'free' ? 'FREE' : `$${parseFloat(sub.calculated_amount || 0).toFixed(2)}`}</span></div>
              {sub.session_length && <div><span className="text-white/40 block">Session</span><span className="text-white">{sub.session_length}</span></div>}
              {sub.review_week && <div><span className="text-white/40 block">Review Week</span><span className="text-[#D4AF37]">Week of {new Date(sub.review_week).toLocaleDateString()}</span></div>}
            </div>
            {sub.areas_of_concern && (
              <div className="mt-4 pt-4 border-t border-white/5"><span className="text-white/40 text-sm block mb-1">Areas of Concern</span><p className="text-white/70 text-sm">{sub.areas_of_concern}</p></div>
            )}
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-[#121212] border border-white/10 rounded-md p-6">
            <h3 className="font-heading text-sm font-bold uppercase text-[#D4AF37] mb-4">Update Status</h3>
            <div className="grid grid-cols-1 gap-2">
              {['queued', 'in_review'].map(s => (
                <button key={s} onClick={() => updateStatus(s)} disabled={saving || sub.review_status === s}
                  className={`px-3 py-2 text-xs font-bold uppercase tracking-wider border transition-colors ${
                    sub.review_status === s ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'border-white/10 text-white/50 hover:border-white/30'
                  } disabled:opacity-30`}
                >{s.replace(/_/g, ' ')}</button>
              ))}
              <button onClick={handleComplete} disabled={saving || sub.review_status === 'completed'}
                className="px-3 py-2 text-xs font-bold uppercase tracking-wider bg-green-600 text-white hover:bg-green-500 transition-colors disabled:opacity-30"
              >Mark Complete</button>
            </div>
          </div>
          <div className="bg-[#121212] border border-white/10 rounded-md p-6">
            <h3 className="font-heading text-sm font-bold uppercase text-[#D4AF37] mb-4">Internal Notes</h3>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)}
              className="bg-black/50 border-white/10 text-white rounded-none min-h-[120px] mb-3" placeholder="Add notes..." />
            <button onClick={saveNotes} disabled={saving}
              className="w-full px-4 py-2 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider hover:bg-[#FFD700] transition-colors disabled:opacity-50"
            >Save Notes</button>
          </div>
        </div>
      </div>
    </div>
  )
}
