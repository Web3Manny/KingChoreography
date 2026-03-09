'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Eye } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getAdminApplications } from '@/lib/api'

const statusColors: Record<string, string> = {
  new: 'bg-blue-500/20 text-blue-400', contacted: 'bg-yellow-500/20 text-yellow-400',
  booked: 'bg-green-500/20 text-green-400', declined: 'bg-red-500/20 text-red-400',
  archived: 'bg-gray-500/20 text-gray-400',
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLoading(true)
    const params: any = {}
    if (statusFilter && statusFilter !== 'all') params.status = statusFilter
    getAdminApplications(params).then(r => setApplications(r || [])).catch(() => {}).finally(() => setLoading(false))
  }, [statusFilter])

  const filtered = applications.filter((a: any) =>
    !search || a.gym_name?.toLowerCase().includes(search.toLowerCase()) || a.contact_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div data-testid="admin-applications">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="font-heading text-3xl font-bold uppercase text-white">Applications</h1>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..."
              className="pl-10 bg-black/50 border-white/10 text-white rounded-md h-10 w-48" data-testid="applications-search" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-black/50 border-white/10 text-white rounded-md h-10 w-36" data-testid="applications-filter">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#121212] border-white/10">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="booked">Booked</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="bg-[#121212] border border-white/10 rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-white/40 text-xs font-bold uppercase tracking-wider">Gym</th>
                <th className="text-left p-4 text-white/40 text-xs font-bold uppercase tracking-wider hidden sm:table-cell">Contact</th>
                <th className="text-left p-4 text-white/40 text-xs font-bold uppercase tracking-wider">Status</th>
                <th className="text-left p-4 text-white/40 text-xs font-bold uppercase tracking-wider hidden lg:table-cell">Date</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((app: any) => (
                <tr key={app.id} className="hover:bg-white/5 transition-colors" data-testid={`app-row-${app.id}`}>
                  <td className="p-4 text-white text-sm font-medium">{app.gym_name}</td>
                  <td className="p-4 text-white/60 text-sm hidden sm:table-cell">{app.contact_name}</td>
                  <td className="p-4"><span className={`px-2 py-1 text-xs font-bold uppercase rounded ${statusColors[app.status] || 'bg-gray-500/20 text-gray-400'}`}>{app.status}</span></td>
                  <td className="p-4 text-white/30 text-xs hidden lg:table-cell">{app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : '—'}</td>
                  <td className="p-4"><Link href={`/admin/applications/${app.id}`} className="text-[#D4AF37] hover:text-[#FFD700]" data-testid={`app-view-${app.id}`}><Eye className="w-4 h-4" /></Link></td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-white/30 text-sm">{loading ? 'Loading...' : 'No applications found'}</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
