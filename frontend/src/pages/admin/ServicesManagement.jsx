import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { getAdminServices, createAdminService, updateAdminService, deleteAdminService } from '@/lib/api';
import { toast } from 'sonner';

const emptyService = {
  name: '', description: '', category: 'virtual', service_type: 'review_feedback',
  base_price: '', client_rate: '', nonclient_rate: '',
  per_athlete_rate_client_2hr: '', per_athlete_rate_client_4hr: '',
  per_athlete_rate_nonclient_2hr: '', per_athlete_rate_nonclient_4hr: '',
  addon_price: '', is_active: true, sort_order: 0
};

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyService);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    setLoading(true);
    getAdminServices().then(r => setServices(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openEdit = (service) => {
    setEditing(service.id);
    setForm({ ...emptyService, ...service });
    setShowForm(true);
  };

  const openNew = () => {
    setEditing(null);
    setForm(emptyService);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.category || !form.service_type) { toast.error('Name, category, and type are required'); return; }
    try {
      const data = { ...form };
      ['base_price', 'client_rate', 'nonclient_rate', 'per_athlete_rate_client_2hr', 'per_athlete_rate_client_4hr', 'per_athlete_rate_nonclient_2hr', 'per_athlete_rate_nonclient_4hr', 'addon_price'].forEach(k => {
        data[k] = data[k] ? parseFloat(data[k]) : null;
      });
      data.sort_order = parseInt(data.sort_order) || 0;

      if (editing) {
        await updateAdminService(editing, data);
        toast.success('Service updated');
      } else {
        await createAdminService(data);
        toast.success('Service created');
      }
      setShowForm(false);
      load();
    } catch { toast.error('Failed to save service'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this service?')) return;
    try {
      await deleteAdminService(id);
      toast.success('Service deactivated');
      load();
    } catch { toast.error('Failed to deactivate'); }
  };

  return (
    <div data-testid="admin-services">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-['Oswald'] text-3xl font-bold uppercase text-white">Services</h1>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-black font-bold uppercase tracking-wider text-xs hover:bg-[#FFD700] transition-colors" data-testid="add-service-btn">
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {/* Service List */}
      <div className="space-y-3">
        {services.map(s => (
          <div key={s.id} className={`bg-[#121212] border rounded-md p-4 flex items-center justify-between ${s.is_active ? 'border-white/10' : 'border-white/5 opacity-50'}`} data-testid={`service-item-${s.id}`}>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-white font-medium text-sm">{s.name}</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-white/5 text-white/40">{s.category}</span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-[#D4AF37]/10 text-[#D4AF37]">{s.service_type?.replace(/_/g, ' ')}</span>
                {!s.is_active && <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-red-500/10 text-red-400">Inactive</span>}
              </div>
              <p className="text-white/30 text-xs mt-1 line-clamp-1">{s.description}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => openEdit(s)} className="p-2 text-white/30 hover:text-[#D4AF37] transition-colors" data-testid={`edit-service-${s.id}`}><Edit className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(s.id)} className="p-2 text-white/30 hover:text-red-400 transition-colors" data-testid={`delete-service-${s.id}`}><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Create Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-[#121212] border border-white/10 rounded-md w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()} data-testid="service-form">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-['Oswald'] text-xl font-bold uppercase text-white">{editing ? 'Edit' : 'New'} Service</h2>
              <button onClick={() => setShowForm(false)} className="text-white/30 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1 block">Name *</label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-black/50 border-white/10 text-white rounded-none h-10" data-testid="service-name" />
              </div>
              <div>
                <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1 block">Description</label>
                <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="bg-black/50 border-white/10 text-white rounded-none" data-testid="service-description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1 block">Category *</label>
                  <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                    <SelectTrigger className="bg-black/50 border-white/10 text-white rounded-none h-10"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-[#121212] border-white/10">
                      <SelectItem value="in_person">In-Person</SelectItem>
                      <SelectItem value="virtual">Virtual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1 block">Service Type *</label>
                  <Select value={form.service_type} onValueChange={v => setForm({ ...form, service_type: v })}>
                    <SelectTrigger className="bg-black/50 border-white/10 text-white rounded-none h-10"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-[#121212] border-white/10">
                      <SelectItem value="free_tier">Free Tier</SelectItem>
                      <SelectItem value="review_feedback">Review & Feedback</SelectItem>
                      <SelectItem value="consultation_addon">Consultation Add-on</SelectItem>
                      <SelectItem value="virtual_upgrade">Virtual Upgrade</SelectItem>
                      <SelectItem value="monthly_subscription">Monthly Subscription</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1 block">Client Rate ($)</label><Input type="number" step="0.01" value={form.client_rate || ''} onChange={e => setForm({ ...form, client_rate: e.target.value })} className="bg-black/50 border-white/10 text-white rounded-none h-10" /></div>
                <div><label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1 block">Non-Client Rate ($)</label><Input type="number" step="0.01" value={form.nonclient_rate || ''} onChange={e => setForm({ ...form, nonclient_rate: e.target.value })} className="bg-black/50 border-white/10 text-white rounded-none h-10" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1 block">Per Athlete Client 2hr ($)</label><Input type="number" step="0.01" value={form.per_athlete_rate_client_2hr || ''} onChange={e => setForm({ ...form, per_athlete_rate_client_2hr: e.target.value })} className="bg-black/50 border-white/10 text-white rounded-none h-10" /></div>
                <div><label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1 block">Per Athlete Client 4hr ($)</label><Input type="number" step="0.01" value={form.per_athlete_rate_client_4hr || ''} onChange={e => setForm({ ...form, per_athlete_rate_client_4hr: e.target.value })} className="bg-black/50 border-white/10 text-white rounded-none h-10" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1 block">Per Athlete Non-Client 2hr ($)</label><Input type="number" step="0.01" value={form.per_athlete_rate_nonclient_2hr || ''} onChange={e => setForm({ ...form, per_athlete_rate_nonclient_2hr: e.target.value })} className="bg-black/50 border-white/10 text-white rounded-none h-10" /></div>
                <div><label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1 block">Per Athlete Non-Client 4hr ($)</label><Input type="number" step="0.01" value={form.per_athlete_rate_nonclient_4hr || ''} onChange={e => setForm({ ...form, per_athlete_rate_nonclient_4hr: e.target.value })} className="bg-black/50 border-white/10 text-white rounded-none h-10" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1 block">Add-on Price ($)</label><Input type="number" step="0.01" value={form.addon_price || ''} onChange={e => setForm({ ...form, addon_price: e.target.value })} className="bg-black/50 border-white/10 text-white rounded-none h-10" /></div>
                <div><label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1 block">Sort Order</label><Input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: e.target.value })} className="bg-black/50 border-white/10 text-white rounded-none h-10" /></div>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={form.is_active} onCheckedChange={v => setForm({ ...form, is_active: v })} />
                <span className="text-white/60 text-sm">Active</span>
              </div>
              <button onClick={handleSave} className="w-full inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#D4AF37] text-black font-bold uppercase tracking-wider text-sm hover:bg-[#FFD700] transition-colors" data-testid="service-save-btn">
                <Save className="w-4 h-4" /> {editing ? 'Update' : 'Create'} Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
