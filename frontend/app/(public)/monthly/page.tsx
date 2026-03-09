'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }

const tiers = [
  { name: 'Starter', reviews: '1 review / month', desc: 'Perfect for programs that want monthly check-ins on a single routine.', features: ['1 routine review per month', 'Written feedback', 'Priority queue placement'] },
  { name: 'Growth', reviews: '2 reviews / month', desc: 'Ideal for programs with multiple teams or mid-season routine adjustments.', features: ['2 routine reviews per month', 'Written feedback', 'Priority queue placement', 'Faster turnaround'], popular: true },
  { name: 'Elite', reviews: '4 reviews / month', desc: 'For serious programs that want consistent, ongoing feedback throughout the season.', features: ['4 routine reviews per month', 'Written feedback', 'Top priority queue', 'Fastest turnaround', 'Direct communication line'] },
]

export default function MonthlyPage() {
  return (
    <div className="min-h-screen pt-20" data-testid="monthly-page">
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }} className="max-w-3xl">
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase">Subscription Service</span>
            <h1 className="font-heading text-5xl sm:text-6xl font-bold uppercase mt-4 mb-6 text-white leading-[0.95]">Monthly<br /><span className="text-gold-gradient">Reviews</span></h1>
            <p className="text-white/50 text-lg leading-relaxed mb-4">Subscribe to ongoing monthly routine reviews. Choose a tier that fits your program&apos;s needs and get consistent, professional feedback from Brian throughout your season.</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-sm mt-4">Coming Soon — Subscription billing launching soon</div>
          </motion.div>
        </div>
      </section>
      <section className="py-24 bg-[#121212] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier, i) => (
              <div key={i} className={`p-8 ${tier.popular ? 'bg-[#0A0A0A] border-2 border-[#D4AF37]/30' : 'bg-[#0A0A0A] border border-white/5'} relative`} data-testid={`monthly-tier-${i}`}>
                {tier.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider">Most Popular</div>}
                <h3 className="font-heading text-2xl font-bold uppercase text-white mb-2">{tier.name}</h3>
                <p className="text-[#D4AF37] text-sm font-semibold mb-4">{tier.reviews}</p>
                <p className="text-white/40 text-sm mb-6">{tier.desc}</p>
                <div className="space-y-3 mb-8">
                  {tier.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#D4AF37]" /><span className="text-white/60 text-sm">{f}</span></div>
                  ))}
                </div>
                <Link href="/contact" className="block text-center px-6 py-3 border border-white/20 text-white text-sm font-bold uppercase tracking-wider hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors">Contact for Details</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
