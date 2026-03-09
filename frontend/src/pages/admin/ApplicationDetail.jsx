import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, MapPin, Calendar, Phone } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAdminApplication, updateAdminApplication } from '@/lib/api';
import { toast } from 'sonner';

const statusColors = {
  new: 'bg-blue-500/20 text-blue-400', contacted: 'bg-yellow-500/20 text-yellow-400',
  booked: 'bg-green-500/20 text-green-400', declined: 'bg-red-500/20 text-red-400',
  archived: 'bg-gray-500/20 text-gray-400',
};

export default function AdminApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAdminApplication(id).then(r => { setApp(r.data); setNotes(r.data.admin_notes || ''); }).catch(() => navigate('/admin/applications'));
  }, [id, navigate]);

  const updateStatus = async (status) => {
    setSaving(true);
    try {
      const res = await updateAdminApplication(id, { status });
      setApp(res.data);
      toast.success(`Status updated to ${status}`);
    } catch { toast.error('Failed to update status'); }
    finally { setSaving(false); }
  };

  const saveNotes = async () => {
    setSaving(true);
    try {
      await updateAdminApplication(id, { admin_notes: notes });
      toast.success('Notes saved');
    } catch { toast.error('Failed to save notes'); }
    finally { setSaving(false); }
  };

  if (!app) return <div className="p-8 text-white/30">Loading...</div>;

  return (
    <div data-testid="admin-application-detail">
      <button onClick={() => navigate('/admin/applications')} className="inline-flex items-center gap-2 text-white/40 text-sm mb-6 hover:text-white transition-colors" data-testid="back-btn">
        <ArrowLeft className="w-4 h-4" /> Back to Applications
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-['Oswald'] text-3xl font-bold uppercase text-white">{app.gym_name}</h1>
          <p className="text-white/40 text-sm">{app.contact_name} &middot; Applied {new Date(app.submitted_at).toLocaleDateString()}</p>
        </div>
        <span className={`px-3 py-1.5 text-xs font-bold uppercase rounded ${statusColors[app.status]}`}>{app.status}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <div className="bg-[#121212] border border-white/10 rounded-md p-6">
            <h3 className="font-['Oswald'] text-sm font-bold uppercase text-[#D4AF37] mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-white/30" /><span className="text-white">{app.email}</span></div>
              {app.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-white/30" /><span className="text-white">{app.phone}</span></div>}
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-white/30" /><span className="text-white">{[app.city, app.state].filter(Boolean).join(', ') || 'Not provided'}</span></div>
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-white/30" /><span className="text-white capitalize">{app.timeframe?.replace(/_/g, ' ') || 'Not specified'}</span></div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-[#121212] border border-white/10 rounded-md p-6">
            <h3 className="font-['Oswald'] text-sm font-bold uppercase text-[#D4AF37] mb-4">Program Details</h3>
            <div className="space-y-4 text-sm">
              {app.services_interested?.length > 0 && (
                <div><span className="text-white/40 block mb-1">Services Interested</span><div className="flex flex-wrap gap-2">{app.services_interested.map((s, i) => <span key={i} className="px-2 py-1 bg-white/5 text-white text-xs">{s}</span>)}</div></div>
              )}
              {app.team_levels?.length > 0 && (
                <div><span className="text-white/40 block mb-1">Team Levels</span><div className="flex flex-wrap gap-2">{app.team_levels.map((l, i) => <span key={i} className="px-2 py-1 bg-white/5 text-white text-xs">{l}</span>)}</div></div>
              )}
              {app.divisions?.length > 0 && (
                <div><span className="text-white/40 block mb-1">Divisions</span><div className="flex flex-wrap gap-2">{app.divisions.map((d, i) => <span key={i} className="px-2 py-1 bg-white/5 text-white text-xs">{d}</span>)}</div></div>
              )}
              {app.referral_source && <div><span className="text-white/40">Referral:</span> <span className="text-white">{app.referral_source}</span></div>}
              {app.additional_notes && <div><span className="text-white/40 block mb-1">Notes from Applicant</span><p className="text-white/70">{app.additional_notes}</p></div>}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#121212] border border-white/10 rounded-md p-6">
            <h3 className="font-['Oswald'] text-sm font-bold uppercase text-[#D4AF37] mb-4">Update Status</h3>
            <div className="grid grid-cols-2 gap-2">
              {['new', 'contacted', 'booked', 'declined', 'archived'].map(s => (
                <button key={s} onClick={() => updateStatus(s)} disabled={saving || app.status === s}
                  className={`px-3 py-2 text-xs font-bold uppercase tracking-wider border transition-colors ${
                    app.status === s ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'border-white/10 text-white/50 hover:border-white/30'
                  } disabled:opacity-30`}
                  data-testid={`status-btn-${s}`}
                >{s}</button>
              ))}
            </div>
          </div>

          <div className="bg-[#121212] border border-white/10 rounded-md p-6">
            <h3 className="font-['Oswald'] text-sm font-bold uppercase text-[#D4AF37] mb-4">Internal Notes</h3>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)}
              className="bg-black/50 border-white/10 text-white rounded-none min-h-[120px] mb-3" placeholder="Add notes..."
              data-testid="admin-notes" />
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
