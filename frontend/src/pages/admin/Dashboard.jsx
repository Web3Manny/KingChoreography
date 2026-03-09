import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, DollarSign, Clock, ArrowRight, TrendingUp } from 'lucide-react';
import { getAdminStats, getRecentActivity } from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAdminStats().then(r => setStats(r.data)),
      getRecentActivity().then(r => setActivity(r.data))
    ]).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Applications This Week', value: stats.applications_this_week, icon: Users, color: 'text-blue-400' },
    { label: 'Submissions This Week', value: stats.submissions_this_week, icon: FileText, color: 'text-green-400' },
    { label: 'Revenue This Month', value: `$${stats.revenue_this_month?.toFixed(2)}`, icon: DollarSign, color: 'text-[#D4AF37]' },
    { label: 'Queue Depth', value: stats.queue_depth, icon: Clock, color: 'text-orange-400' },
  ] : [];

  const statusColors = {
    new: 'bg-blue-500/20 text-blue-400', contacted: 'bg-yellow-500/20 text-yellow-400',
    booked: 'bg-green-500/20 text-green-400', queued: 'bg-yellow-500/20 text-yellow-400',
    in_review: 'bg-blue-500/20 text-blue-400', completed: 'bg-green-500/20 text-green-400',
    not_applicable: 'bg-gray-500/20 text-gray-400',
  };

  return (
    <div data-testid="admin-dashboard">
      <div className="mb-8">
        <h1 className="font-['Oswald'] text-3xl font-bold uppercase text-white">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Welcome back, Brian</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-[#121212] border border-white/10 p-6 rounded-md" data-testid={`stat-card-${i}`}>
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <TrendingUp className="w-4 h-4 text-white/20" />
            </div>
            <p className="font-['Oswald'] text-3xl font-bold text-white">{loading ? '—' : stat.value}</p>
            <p className="text-white/40 text-xs mt-1 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { to: '/admin/applications', label: 'View Applications', icon: Users },
          { to: '/admin/queue', label: 'Review Queue', icon: Clock },
          { to: '/admin/submissions', label: 'All Submissions', icon: FileText },
        ].map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} className="flex items-center justify-between p-4 bg-[#121212] border border-white/10 rounded-md hover:border-[#D4AF37]/30 transition-colors" data-testid={`quick-link-${label.toLowerCase().replace(' ', '-')}`}>
            <div className="flex items-center gap-3">
              <Icon className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-white text-sm font-medium">{label}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-white/30" />
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="font-['Oswald'] text-xl font-bold uppercase text-white mb-4">Recent Activity</h2>
        <div className="bg-[#121212] border border-white/10 rounded-md divide-y divide-white/5">
          {activity.length === 0 && !loading && (
            <div className="p-8 text-center text-white/30 text-sm">No recent activity</div>
          )}
          {activity.map((item, i) => (
            <Link key={i} to={item.type === 'application' ? `/admin/applications/${item.id}` : `/admin/submissions/${item.id}`}
              className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors" data-testid={`activity-item-${i}`}
            >
              <div>
                <p className="text-white text-sm">{item.title}</p>
                <p className="text-white/40 text-xs">{item.subtitle}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 text-xs font-bold uppercase rounded ${statusColors[item.status] || 'bg-gray-500/20 text-gray-400'}`}>
                  {item.status}
                </span>
                <span className="text-white/20 text-xs">{item.timestamp ? new Date(item.timestamp).toLocaleDateString() : ''}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
