'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getAdminServices, createAdminService, updateAdminService, deleteAdminService } from '@/lib/api'
import { toast } from 'sonner'

const emptyService = { name: '', description: '', category: 'virtual', service_type: 'review_feedback', is_active: true, client_rate: '', nonclient_rate: '', addon_price: '' }

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)

  const fetchServices = () => {
    setLoading(true)
    getAdminServices().then(r => setServices(r || [])).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { fetchServices() }, [])

  const handleSave = async () => {
    try {
      if (editing?.id) {
        await updateAdminService(editing.id, editing)
        toast.success('Service updated')
      } else {
        await createAdminService(editing)
        toast.success('Service created')
      }
      setEditing(null)
      setShowForm(false)
      fetchServices()
    } catch { toast.error('Failed to save service') }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    try {
      await deleteAdminService(id)
      toast.success('Service deleted')
      fetchServices()
    } catch { toast.error('Failed to delete') }
  }

  return (
    <div data-testid="admin-services">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-3xl font-bold uppercase text-white">Services</h1>
        <button onClick={() => { setEditing({ ...emptyService }); setShowForm(true) }}
          className="inline-flex items-center gap-2 btn-gold px-6 py-2.5 text-sm" data-testid="add-service-btn"
        ><Plus className="w-4 h-4" /> Add Service</button>
      </div>

      {showForm && editing && (
        <div className="bg-[#121212] border border-white/10 rounded-md p-6 mb-6" data-testid="service-form">
          <h3 className="font-heading text-lg font-bold uppercase text-white mb-4">{editing.id ? 'Edit Service' : 'New Service'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2 block">Name</label>
              <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className="bg-black/50 border-white/10 text-white rounded-none h-10" />
            </div>
            <div>
              <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2 block">Service Type</label>
              <Select value={editing.service_type} onValueChange={(v) => setEditing({ ...editing, service_type: v })}>
                <SelectTrigger className="bg-black/50 border-white/10 text-white rounded-none h-10"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#121212] border-white/10">
                  <SelectItem value="review_feedback">Review & Feedback</SelectItem>
                  <SelectItem value="virtual_upgrade">Virtual Upgrade</SelectItem>
                  <SelectItem value="free_tier">Free Tier</SelectItem>
                  <SelectItem value="in_person">In-Person</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2 block">Description</label>
              <Textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                className="bg-black/50 border-white/10 text-white rounded-none" />
            </div>
            <div>
              <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2 block">Client Rate</label>
              <Input value={editing.client_rate} onChange={(e) => setEditing({ ...editing, client_rate: e.target.value })}
                className="bg-black/50 border-white/10 text-white rounded-none h-10" />
            </div>
            <div>
              <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2 block">Non-Client Rate</label>
              <Input value={editing.nonclient_rate} onChange={(e) => setEditing({ ...editing, nonclient_rate: e.target.value })}
                className="bg-black/50 border-white/10 text-white rounded-none h-10" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} className="btn-gold px-6 py-2 text-sm">Save</button>
            <button onClick={() => { setShowForm(false); setEditing(null) }} className="px-6 py-2 border border-white/10 text-white/50 text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-[#121212] border border-white/10 rounded-md overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-4 text-white/40 text-xs font-bold uppercase tracking-wider">Service</th>
              <th className="text-left p-4 text-white/40 text-xs font-bold uppercase tracking-wider hidden sm:table-cell">Type</th>
              <th className="text-left p-4 text-white/40 text-xs font-bold uppercase tracking-wider hidden md:table-cell">Active</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {services.map((s: any) => (
              <tr key={s.id} className="hover:bg-white/5" data-testid={`service-row-${s.id}`}>
                <td className="p-4"><p className="text-white text-sm font-medium">{s.name}</p><p className="text-white/40 text-xs truncate max-w-xs">{s.description}</p></td>
                <td className="p-4 text-white/60 text-sm hidden sm:table-cell capitalize">{s.service_type?.replace(/_/g, ' ')}</td>
                <td className="p-4 hidden md:table-cell"><span className={`px-2 py-0.5 text-xs font-bold uppercase rounded ${s.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{s.is_active ? 'Active' : 'Inactive'}</span></td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditing({ ...s }); setShowForm(true) }} className="text-white/40 hover:text-[#D4AF37]"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(s.id)} className="text-white/40 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {services.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-white/30 text-sm">{loading ? 'Loading...' : 'No services found'}</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
