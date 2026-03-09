import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAdminSubmissions } from '@/lib/api';

const statusColors = {
  queued: 'bg-yellow-500/20 text-yellow-400', in_review: 'bg-blue-500/20 text-blue-400',
  completed: 'bg-green-500/20 text-green-400', not_applicable: 'bg-gray-500/20 text-gray-400',
};
const paymentColors = {
  paid: 'bg-green-500/20 text-green-400', pending: 'bg-yellow-500/20 text-yellow-400',
  failed: 'bg-red-500/20 text-red-400', free: 'bg-gray-500/20 text-gray-400', refunded: 'bg-purple-500/20 text-purple-400',
};

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceFilter, setServiceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const params = {};
    if (serviceFilter) params.service_type = serviceFilter;
    if (statusFilter) params.review_status = statusFilter;
    getAdminSubmissions(params).then(r => setSubmissions(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [serviceFilter, statusFilter]);

  const filtered = submissions.filter(s =>
    !search || s.gym_name?.toLowerCase().includes(search.toLowerCase()) || s.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div data-testid="admin-submissions">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="font-['Oswald'] text-3xl font-bold uppercase text-white">Submissions</h1>
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..."
              className="pl-10 bg-black/50 border-white/10 text-white rounded-md h-10 w-40" data-testid="submissions-search" />
          </div>
          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger className="bg-black/50 border-white/10 text-white rounded-md h-10 w-36">
              <SelectValue placeholder="All Services" />
            </SelectTrigger>
            <SelectContent className="bg-[#121212] border-white/10">
              <SelectItem value="all">All Services</SelectItem>
              <SelectItem value="free_tier">Free Tier</SelectItem>
              <SelectItem value="review_feedback">Review & Feedback</SelectItem>
              <SelectItem value="virtual_upgrade">Virtual Upgrade</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-black/50 border-white/10 text-white rounded-md h-10 w-36">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#121212] border-white/10">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="queued">Queued</SelectItem>
              <SelectItem value="in_review">In Review</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-[#121212] border border-white/10 rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-white/40 text-xs font-bold uppercase tracking-wider">Program</th>
                <th className="text-left p-4 text-white/40 text-xs font-bold uppercase tracking-wider hidden sm:table-cell">Service</th>
                <th className="text-left p-4 text-white/40 text-xs font-bold uppercase tracking-wider hidden md:table-cell">Amount</th>
                <th className="text-left p-4 text-white/40 text-xs font-bold uppercase tracking-wider hidden md:table-cell">Payment</th>
                <th className="text-left p-4 text-white/40 text-xs font-bold uppercase tracking-wider">Review</th>
                <th className="text-left p-4 text-white/40 text-xs font-bold uppercase tracking-wider hidden lg:table-cell">Date</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(sub => (
                <tr key={sub.id} className="hover:bg-white/5 transition-colors" data-testid={`sub-row-${sub.id}`}>
                  <td className="p-4"><p className="text-white text-sm">{sub.gym_name}</p><p className="text-white/40 text-xs">{sub.full_name}</p></td>
                  <td className="p-4 text-white/60 text-sm capitalize hidden sm:table-cell">{sub.service_type?.replace(/_/g, ' ')}</td>
                  <td className="p-4 text-white text-sm hidden md:table-cell">{sub.payment_status === 'free' ? 'Free' : `$${parseFloat(sub.calculated_amount).toFixed(2)}`}</td>
                  <td className="p-4 hidden md:table-cell"><span className={`px-2 py-1 text-xs font-bold uppercase rounded ${paymentColors[sub.payment_status]}`}>{sub.payment_status}</span></td>
                  <td className="p-4"><span className={`px-2 py-1 text-xs font-bold uppercase rounded ${statusColors[sub.review_status]}`}>{sub.review_status?.replace(/_/g, ' ')}</span></td>
                  <td className="p-4 text-white/30 text-xs hidden lg:table-cell">{sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString() : '—'}</td>
                  <td className="p-4"><Link to={`/admin/submissions/${sub.id}`} className="text-[#D4AF37]"><Eye className="w-4 h-4" /></Link></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="p-8 text-center text-white/30 text-sm">{loading ? 'Loading...' : 'No submissions found'}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
