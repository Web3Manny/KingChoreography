import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { submitApplication } from '@/lib/api';
import { toast } from 'sonner';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const teamLevels = ['Youth', 'Junior', 'Senior', 'Open', 'International Open', 'Novice'];
const divisionOptions = ['Small', 'Medium', 'Large', 'Extra Large', 'International'];
const serviceOptions = ['Full Program Choreography', 'Choreography Camp', 'Competition Routine Polishing', 'Routine Consultation'];
const referralOptions = ['Social Media', 'Word of Mouth', 'Competition / Event', 'Website / Google', 'Other'];

export default function Apply() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    gym_name: '', contact_name: '', email: '', phone: '', city: '', state: '',
    services_interested: [], team_levels: [], divisions: [],
    timeframe: '', referral_source: '', referral_detail: '', additional_notes: ''
  });

  const toggleArray = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value) ? prev[field].filter(v => v !== value) : [...prev[field], value]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.gym_name || !form.contact_name || !form.email) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const response = await submitApplication(form);
      navigate('/apply/confirmed', { state: { application: response.data } });
    } catch (err) {
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20" data-testid="apply-page">
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }} className="mb-12">
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase">In-Person Choreography</span>
            <h1 className="font-['Oswald'] text-4xl sm:text-5xl font-bold uppercase mt-4 mb-4 text-white">Apply for<br /><span className="text-gold-gradient">Availability</span></h1>
            <p className="text-white/50">Tell Brian about your program and he'll follow up personally to discuss availability.</p>
          </motion.div>

          <motion.form initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit} className="space-y-8" data-testid="apply-form"
          >
            {/* Program Info */}
            <div className="space-y-4">
              <h3 className="font-['Oswald'] text-lg font-bold uppercase text-white border-b border-white/10 pb-2">Program Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2 block">Gym / Program Name *</label>
                  <Input value={form.gym_name} onChange={(e) => setForm({ ...form, gym_name: e.target.value })}
                    className="bg-black/50 border-white/10 focus:border-[#D4AF37] text-white placeholder:text-white/20 rounded-none h-12"
                    placeholder="Your gym name" data-testid="apply-gym-name" />
                </div>
                <div>
                  <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2 block">Contact Name *</label>
                  <Input value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
                    className="bg-black/50 border-white/10 focus:border-[#D4AF37] text-white placeholder:text-white/20 rounded-none h-12"
                    placeholder="Your name" data-testid="apply-contact-name" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2 block">Email *</label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="bg-black/50 border-white/10 focus:border-[#D4AF37] text-white placeholder:text-white/20 rounded-none h-12"
                    placeholder="email@gym.com" data-testid="apply-email" />
                </div>
                <div>
                  <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2 block">Phone</label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="bg-black/50 border-white/10 focus:border-[#D4AF37] text-white placeholder:text-white/20 rounded-none h-12"
                    placeholder="(555) 123-4567" data-testid="apply-phone" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2 block">City</label>
                  <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="bg-black/50 border-white/10 focus:border-[#D4AF37] text-white placeholder:text-white/20 rounded-none h-12" data-testid="apply-city" />
                </div>
                <div>
                  <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2 block">State</label>
                  <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="bg-black/50 border-white/10 focus:border-[#D4AF37] text-white placeholder:text-white/20 rounded-none h-12" data-testid="apply-state" />
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h3 className="font-['Oswald'] text-lg font-bold uppercase text-white border-b border-white/10 pb-2">Services Interested In</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {serviceOptions.map(service => (
                  <label key={service} className="flex items-center gap-3 p-3 bg-[#121212] border border-white/5 cursor-pointer hover:border-[#D4AF37]/30 transition-colors">
                    <Checkbox checked={form.services_interested.includes(service)} onCheckedChange={() => toggleArray('services_interested', service)} />
                    <span className="text-white/70 text-sm">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Team Levels */}
            <div className="space-y-4">
              <h3 className="font-['Oswald'] text-lg font-bold uppercase text-white border-b border-white/10 pb-2">Team Details</h3>
              <div>
                <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2 block">Team Levels</label>
                <div className="flex flex-wrap gap-2">
                  {teamLevels.map(level => (
                    <button key={level} type="button" onClick={() => toggleArray('team_levels', level)}
                      className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-colors ${
                        form.team_levels.includes(level) ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'border-white/10 text-white/50 hover:border-white/30'
                      }`}
                    >{level}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2 block">Divisions</label>
                <div className="flex flex-wrap gap-2">
                  {divisionOptions.map(div => (
                    <button key={div} type="button" onClick={() => toggleArray('divisions', div)}
                      className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-colors ${
                        form.divisions.includes(div) ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'border-white/10 text-white/50 hover:border-white/30'
                      }`}
                    >{div}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Timing & Referral */}
            <div className="space-y-4">
              <h3 className="font-['Oswald'] text-lg font-bold uppercase text-white border-b border-white/10 pb-2">Timing & Referral</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2 block">Preferred Timeframe</label>
                  <Select value={form.timeframe} onValueChange={(v) => setForm({ ...form, timeframe: v })}>
                    <SelectTrigger className="bg-black/50 border-white/10 text-white rounded-none h-12" data-testid="apply-timeframe">
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#121212] border-white/10">
                      <SelectItem value="asap">ASAP</SelectItem>
                      <SelectItem value="1_2_months">Next 1-2 Months</SelectItem>
                      <SelectItem value="3_6_months">Next 3-6 Months</SelectItem>
                      <SelectItem value="next_season">Next Season</SelectItem>
                      <SelectItem value="exploring">Just Exploring</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2 block">How did you hear about Brian?</label>
                  <Select value={form.referral_source} onValueChange={(v) => setForm({ ...form, referral_source: v })}>
                    <SelectTrigger className="bg-black/50 border-white/10 text-white rounded-none h-12" data-testid="apply-referral">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#121212] border-white/10">
                      {referralOptions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2 block">Additional Notes</label>
                <Textarea value={form.additional_notes} onChange={(e) => setForm({ ...form, additional_notes: e.target.value })}
                  className="bg-black/50 border-white/10 focus:border-[#D4AF37] text-white placeholder:text-white/20 rounded-none min-h-[100px]"
                  placeholder="Anything else Brian should know?" data-testid="apply-notes" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 btn-gold px-12 py-5 text-sm disabled:opacity-50"
              data-testid="apply-submit-btn"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </motion.form>
        </div>
      </section>
    </div>
  );
}
