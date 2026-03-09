import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Clock, CheckCircle } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const pricingTable = [
  { label: 'Client, 2-Hour', rate: '$40', per: 'per athlete' },
  { label: 'Client, 4-Hour', rate: '$80', per: 'per athlete' },
  { label: 'Non-Client, 2-Hour', rate: '$60', per: 'per athlete' },
  { label: 'Non-Client, 4-Hour', rate: '$120', per: 'per athlete' },
];

const steps = [
  { step: '01', title: 'Select Service', desc: 'Choose Virtual Routine Upgrade from the submission form.' },
  { step: '02', title: 'Enter Details', desc: 'Provide athlete count, session length, and client status.' },
  { step: '03', title: 'Upload Video', desc: 'Upload your current routine video for Brian to review.' },
  { step: '04', title: 'Pay & Submit', desc: 'Complete payment via PayPal and your submission enters the queue.' },
];

export default function Upgrades() {
  return (
    <div className="min-h-screen pt-20" data-testid="upgrades-page">
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }} className="max-w-3xl">
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase">Virtual Service</span>
            <h1 className="font-['Oswald'] text-5xl sm:text-6xl font-bold uppercase mt-4 mb-6 text-white leading-[0.95]">Virtual Routine<br /><span className="text-gold-gradient">Upgrades</span></h1>
            <p className="text-white/50 text-lg leading-relaxed mb-10">Brian provides virtual choreography upgrade sessions, building on your existing routine with enhanced elements, transitions, and performance strategies. Pricing is based on athlete count, session length, and client status.</p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="py-24 bg-[#121212] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-['Oswald'] text-3xl font-bold uppercase text-white mb-12">Pricing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingTable.map((p, i) => (
              <div key={i} className="bg-[#0A0A0A] border border-white/5 p-8 text-center hover:border-[#D4AF37]/30 transition-colors" data-testid={`pricing-tier-${i}`}>
                <p className="text-white/60 text-xs font-bold tracking-wider uppercase mb-4">{p.label}</p>
                <p className="font-['Oswald'] text-4xl font-bold text-white mb-1">{p.rate}</p>
                <p className="text-[#D4AF37] text-sm">{p.per}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-[#0A0A0A] border border-white/5 p-6">
            <p className="text-white/50 text-sm"><strong className="text-white">Example:</strong> A current client with 5 athletes for a 2-hour session: 5 x $40 = <span className="text-[#D4AF37] font-bold">$200</span></p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-['Oswald'] text-3xl font-bold uppercase text-white mb-12">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="p-6 bg-[#121212] border border-white/5">
                <span className="font-['Oswald'] text-4xl font-bold text-[#D4AF37]/20">{s.step}</span>
                <h3 className="font-['Oswald'] text-lg font-bold uppercase text-white mt-2 mb-2">{s.title}</h3>
                <p className="text-white/40 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#121212] border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-['Oswald'] text-3xl font-bold uppercase text-white mb-6">Upgrade Your Routine</h2>
          <p className="text-white/50 mb-10">Take your routine to the next level with Brian King's virtual upgrade sessions.</p>
          <Link to="/submit" className="inline-flex items-center gap-2 btn-gold px-10 py-5 text-sm" data-testid="upgrades-submit-cta">
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
