import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Users, DollarSign, Calendar, FileText, Video } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { getAdminSubmission, updateAdminSubmission, completeSubmission } from '@/lib/api';
import { toast } from 'sonner';

const statusColors = {
  queued: 'bg-yellow-500/20 text-yellow-400', in_review: 'bg-blue-500/20 text-blue-400',
  completed: 'bg-green-500/20 text-green-400', not_applicable: 'bg-gray-500/20 text-gray-400',
};

export default function AdminSubmissionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sub, setSub] = useState(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAdminSubmission(id).then(r => { setSub(r.data); setNotes(r.data.admin_notes || ''); }).catch(() => navigate('/admin/submissions'));
  }, [id, navigate]);

  const updateStatus = async (status) => {
    setSaving(true);
    try {
      const res = await updateAdminSubmission(id, { review_status: status });
      setSub(prev => ({ ...prev, ...res.data }));
      toast.success(`Status updated to ${status}`);
    } catch { toast.error('Failed to update'); }
    finally { setSaving(false); }
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      const res = await completeSubmission(id);
      setSub(prev => ({ ...prev, review_status: 'completed', completed_at: new Date().toISOString() }));
      toast.success('Review marked complete & client notified');
    } catch { toast.error('Failed to complete'); }
    finally { setSaving(false); }
  };

  const saveNotes = async () => {
    setSaving(true);
    try {
      await updateAdminSubmission(id, { admin_notes: notes });
      toast.success('Notes saved');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  if (!sub) return <div className="p-8 text-white/30">Loading...</div>;

  const breakdown = typeof sub.price_breakdown === 'string' ? JSON.parse(sub.price_breakdown) : sub.price_breakdown;

  return (
    <div data-testid="admin-submission-detail">
      <button onClick={() => navigate('/admin/submissions')} className="inline-flex items-center gap-2 text-white/40 text-sm mb-6 hover:text-white transition-colors" data-testid="back-btn">
        <ArrowLeft className="w-4 h-4" /> Back to Submissions
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-['Oswald'] text-3xl font-bold uppercase text-white">{sub.gym_name}</h1>
          <p className="text-white/40 text-sm">{sub.full_name} &middot; <span className="capitalize">{sub.service_type?.replace(/_/g, ' ')}</span></p>
        </div>
        <span className={`px-3 py-1.5 text-xs font-bold uppercase rounded ${statusColors[sub.review_status]}`}>{sub.review_status?.replace(/_/g, ' ')}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#121212] border border-white/10 rounded-md p-6">
            <h3 className="font-['Oswald'] text-sm font-bold uppercase text-[#D4AF37] mb-4">Submission Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-white/30" /><span className="text-white">{sub.email}</span></div>
              {sub.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-white/30" /><span className="text-white">{sub.phone}</span></div>}
              <div className="flex items-center gap-2"><Users className="w-4 h-4 text-white/30" /><span className="text-white">{sub.athlete_count} athlete(s)</span></div>
              <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-white/30" /><span className="text-white">{sub.payment_status === 'free' ? 'Free' : `$${parseFloat(sub.calculated_amount).toFixed(2)}`}</span></div>
              {sub.session_length && <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-white/30" /><span className="text-white">{sub.session_length === '2hr' ? '2 Hours' : '4 Hours'}</span></div>}
              {sub.review_week && <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-white/30" /><span className="text-white">Week of {new Date(sub.review_week).toLocaleDateString()}</span></div>}
              <div className="flex items-center gap-2"><span className="text-white/40">Client:</span><span className="text-white">{sub.is_existing_client ? 'Yes' : 'No'}</span></div>
              {sub.consultation_addon && <div className="flex items-center gap-2"><span className="text-[#D4AF37]">+ Consultation Add-on</span></div>}
            </div>
            {sub.areas_of_concern && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <span className="text-white/40 text-xs block mb-1">Notes from Coach</span>
                <p className="text-white/70 text-sm">{sub.areas_of_concern}</p>
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          {breakdown && (
            <div className="bg-[#121212] border border-white/10 rounded-md p-6">
              <h3 className="font-['Oswald'] text-sm font-bold uppercase text-[#D4AF37] mb-4">Price Breakdown</h3>
              <pre className="text-white/60 text-xs bg-black/50 p-4 overflow-auto">{JSON.stringify(breakdown, null, 2)}</pre>
            </div>
          )}

          {/* Payment Info */}
          {sub.paypal_order_id && (
            <div className="bg-[#121212] border border-white/10 rounded-md p-6">
              <h3 className="font-['Oswald'] text-sm font-bold uppercase text-[#D4AF37] mb-4">Payment</h3>
              <div className="text-sm space-y-2">
                <div><span className="text-white/40">Order ID:</span> <span className="text-white font-mono text-xs">{sub.paypal_order_id}</span></div>
                {sub.paypal_txn_id && <div><span className="text-white/40">Transaction:</span> <span className="text-white font-mono text-xs">{sub.paypal_txn_id}</span></div>}
              </div>
            </div>
          )}

          {/* Files */}
          {sub.files?.length > 0 && (
            <div className="bg-[#121212] border border-white/10 rounded-md p-6">
              <h3 className="font-['Oswald'] text-sm font-bold uppercase text-[#D4AF37] mb-4">Files</h3>
              {sub.files.map((f, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-black/50 mb-2">
                  <Video className="w-4 h-4 text-[#D4AF37]" />
                  <div><p className="text-white text-sm">{f.file_name}</p><p className="text-white/30 text-xs">{f.file_size ? `${(f.file_size / 1024 / 1024).toFixed(1)} MB` : ''}</p></div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#121212] border border-white/10 rounded-md p-6">
            <h3 className="font-['Oswald'] text-sm font-bold uppercase text-[#D4AF37] mb-4">Review Status</h3>
            <div className="grid grid-cols-1 gap-2 mb-4">
              {['queued', 'in_review', 'completed'].map(s => (
                <button key={s} onClick={() => updateStatus(s)} disabled={saving || sub.review_status === s}
                  className={`px-3 py-2 text-xs font-bold uppercase tracking-wider border transition-colors ${
                    sub.review_status === s ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'border-white/10 text-white/50 hover:border-white/30'
                  } disabled:opacity-30`}
                  data-testid={`review-status-${s}`}
                >{s.replace(/_/g, ' ')}</button>
              ))}
            </div>
            {sub.review_status !== 'completed' && (
              <button onClick={handleComplete} disabled={saving}
                className="w-full px-4 py-3 bg-green-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-green-500 transition-colors disabled:opacity-50"
                data-testid="complete-notify-btn"
              >Mark Complete + Notify Client</button>
            )}
          </div>

          <div className="bg-[#121212] border border-white/10 rounded-md p-6">
            <h3 className="font-['Oswald'] text-sm font-bold uppercase text-[#D4AF37] mb-4">Internal Notes</h3>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)}
              className="bg-black/50 border-white/10 text-white rounded-none min-h-[120px] mb-3" placeholder="Add notes..." data-testid="admin-notes" />
            <button onClick={saveNotes} disabled={saving}
              className="w-full px-4 py-2 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider hover:bg-[#FFD700] transition-colors disabled:opacity-50"
              data-testid="save-notes-btn"
            >Save Notes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
