import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, FileText, MessageSquare } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const includes = [
  'Detailed written feedback on your routine',
  'Analysis of technique, formations, and transitions',
  'Performance quality assessment',
  'Specific recommendations for improvement',
  'Scoring potential evaluation',
  'Optional live consultation add-on',
];

export default function Reviews() {
  return (
    <div className="min-h-screen pt-20" data-testid="reviews-page">
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }} className="max-w-3xl">
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase">Virtual Service</span>
            <h1 className="font-['Oswald'] text-5xl sm:text-6xl font-bold uppercase mt-4 mb-6 text-white leading-[0.95]">Routine Reviews<br /><span className="text-gold-gradient">& Feedback</span></h1>
            <p className="text-white/50 text-lg leading-relaxed mb-10">Submit your routine video and receive detailed, professional feedback from Brian King. Get actionable insights on technique, formations, transitions, and performance quality.</p>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-[#121212] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-['Oswald'] text-3xl font-bold uppercase text-white mb-12">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0A0A0A] border border-white/5 p-8" data-testid="pricing-client">
              <p className="text-[#D4AF37] text-xs font-bold tracking-wider uppercase mb-2">Current Client</p>
              <p className="font-['Oswald'] text-5xl font-bold text-white mb-2">$150</p>
              <p className="text-white/40 text-sm mb-6">Per review submission</p>
              <Link to="/submit" className="inline-flex items-center gap-2 btn-gold px-8 py-3 text-sm">
                Submit Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-[#0A0A0A] border border-[#D4AF37]/20 p-8" data-testid="pricing-nonclient">
              <p className="text-[#A8A9AD] text-xs font-bold tracking-wider uppercase mb-2">Non-Client</p>
              <p className="font-['Oswald'] text-5xl font-bold text-white mb-2">$250</p>
              <p className="text-white/40 text-sm mb-6">Per review submission</p>
              <Link to="/submit" className="inline-flex items-center gap-2 px-8 py-3 bg-[#D4AF37] text-black font-bold uppercase tracking-wider text-sm hover:bg-[#FFD700] transition-colors">
                Submit Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-[#0A0A0A] border border-white/5 p-8" data-testid="pricing-addon">
              <p className="text-white/60 text-xs font-bold tracking-wider uppercase mb-2">Add-On</p>
              <p className="font-['Oswald'] text-5xl font-bold text-white mb-2">+$100</p>
              <p className="text-white/40 text-sm mb-6">Live consultation session</p>
              <p className="text-white/30 text-xs">Available with Review & Feedback</p>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-['Oswald'] text-3xl font-bold uppercase text-white mb-12">What's Included</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
            {includes.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4">
                <CheckCircle className="w-5 h-5 text-[#D4AF37] mt-0.5 shrink-0" />
                <span className="text-white/70 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#121212] border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-['Oswald'] text-3xl font-bold uppercase text-white mb-6">Get Expert Feedback</h2>
          <p className="text-white/50 mb-8">Turnaround time is typically within 1 review week. Submissions received by Monday at 11:59 PM ET are included in the current week's queue.</p>
          <Link to="/submit" className="inline-flex items-center gap-2 btn-gold px-10 py-5 text-sm" data-testid="reviews-submit-cta">
            Submit for Review <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
