import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { login } from '@/lib/api';
import { toast } from 'sonner';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please enter email and password'); return; }
    setLoading(true);
    try {
      const res = await login({ email, password });
      localStorage.setItem('kc_token', res.data.token);
      localStorage.setItem('kc_user', JSON.stringify(res.data));
      navigate('/admin');
    } catch {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4" data-testid="admin-login-page">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-[#D4AF37] flex items-center justify-center mx-auto mb-6">
            <Crown className="w-8 h-8 text-black" />
          </div>
          <h1 className="font-['Oswald'] text-2xl font-bold uppercase text-white tracking-wider">Admin Login</h1>
          <p className="text-white/40 text-sm mt-2">King Choreography Dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4" data-testid="login-form">
          <div>
            <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2 block">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="bg-black/50 border-white/10 focus:border-[#D4AF37] text-white rounded-none h-12"
              placeholder="brian@kingchoreography.com" data-testid="login-email" />
          </div>
          <div className="relative">
            <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2 block">Password</label>
            <Input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
              className="bg-black/50 border-white/10 focus:border-[#D4AF37] text-white rounded-none h-12 pr-12"
              placeholder="Enter password" data-testid="login-password" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-white/30 hover:text-white/60">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <button type="submit" disabled={loading}
            className="w-full px-8 py-4 bg-[#D4AF37] text-black font-bold uppercase tracking-wider text-sm hover:bg-[#FFD700] transition-colors disabled:opacity-50"
            data-testid="login-submit-btn"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
