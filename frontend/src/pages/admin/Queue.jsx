import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { getAdminQueue } from '@/lib/api';

const statusColors = {
  queued: 'bg-yellow-500/20 text-yellow-400', in_review: 'bg-blue-500/20 text-blue-400',
  completed: 'bg-green-500/20 text-green-400', not_applicable: 'bg-gray-500/20 text-gray-400',
};
const paymentColors = {
  paid: 'bg-green-500/20 text-green-400', pending: 'bg-yellow-500/20 text-yellow-400',
  failed: 'bg-red-500/20 text-red-400', free: 'bg-gray-500/20 text-gray-400',
};

function getMonday(d) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

export default function AdminQueue() {
  const [weekStart, setWeekStart] = useState(() => {
    const m = getMonday(new Date());
    return m.toISOString().split('T')[0];
  });
  const [data, setData] = useState({ week: null, submissions: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAdminQueue(weekStart).then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [weekStart]);

  const navigateWeek = (dir) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + (dir * 7));
    setWeekStart(d.toISOString().split('T')[0]);
  };

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  return (
    <div data-testid="admin-queue">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="font-['Oswald'] text-3xl font-bold uppercase text-white">Review Queue</h1>
        <div className="flex items-center gap-4">
          <button onClick={() => navigateWeek(-1)} className="p-2 border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-colors" data-testid="queue-prev-week">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="text-center">
            <p className="text-white text-sm font-medium">Week of {new Date(weekStart).toLocaleDateString()}</p>
            <p className="text-white/30 text-xs">{new Date(weekStart).toLocaleDateString()} — {weekEnd.toLocaleDateString()}</p>
          </div>
          <button onClick={() => navigateWeek(1)} className="p-2 border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-colors" data-testid="queue-next-week">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Capacity bar */}
      {data.week && (
        <div className="bg-[#121212] border border-white/10 rounded-md p-4 mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/40">Capacity</span>
            <span className="text-white">{data.week.current_count || data.submissions.length} / {data.week.capacity || 20}</span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-[#D4AF37] transition-all" style={{ width: `${Math.min(100, ((data.week.current_count || data.submissions.length) / (data.week.capacity || 20)) * 100)}%` }} />
          </div>
        </div>
      )}

      <div className="bg-[#121212] border border-white/10 rounded-md overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-4 text-white/40 text-xs font-bold uppercase tracking-wider">Program</th>
              <th className="text-left p-4 text-white/40 text-xs font-bold uppercase tracking-wider hidden sm:table-cell">Service</th>
              <th className="text-left p-4 text-white/40 text-xs font-bold uppercase tracking-wider hidden md:table-cell">Payment</th>
              <th className="text-left p-4 text-white/40 text-xs font-bold uppercase tracking-wider">Review Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.submissions?.map(sub => (
              <tr key={sub.id} className="hover:bg-white/5 transition-colors" data-testid={`queue-row-${sub.id}`}>
                <td className="p-4 text-white text-sm">{sub.gym_name}</td>
                <td className="p-4 text-white/60 text-sm capitalize hidden sm:table-cell">{sub.service_type?.replace(/_/g, ' ')}</td>
                <td className="p-4 hidden md:table-cell">
                  <span className={`px-2 py-1 text-xs font-bold uppercase rounded ${paymentColors[sub.payment_status]}`}>{sub.payment_status}</span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-bold uppercase rounded ${statusColors[sub.review_status]}`}>{sub.review_status?.replace(/_/g, ' ')}</span>
                </td>
                <td className="p-4">
                  <Link to={`/admin/submissions/${sub.id}`} className="text-[#D4AF37]"><Eye className="w-4 h-4" /></Link>
                </td>
              </tr>
            ))}
            {(!data.submissions || data.submissions.length === 0) && (
              <tr><td colSpan={5} className="p-8 text-center text-white/30 text-sm">{loading ? 'Loading...' : 'No submissions for this week'}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
