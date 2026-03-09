'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Crown, Video, Users } from 'lucide-react'
import { getServices } from '@/lib/api'

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }

export default function ServicesPage() {
  const [inPersonServices, setInPersonServices] = useState<any[]>([])
  const [virtualServices, setVirtualServices] = useState<any[]>([])

  useEffect(() => {
    getServices('in_person').then(r => setInPersonServices(r)).catch(() => {})
    getServices('virtual').then(r => setVirtualServices((r || []).filter((s: any) => s.service_type !== 'free_tier'))).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen pt-20" data-testid="services-page">
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }}>
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase">Our Offerings</span>
            <h1 className="font-heading text-5xl sm:text-6xl font-bold uppercase mt-4 mb-6 text-white">Services</h1>
            <p className="text-white/50 max-w-2xl text-lg mb-16">From in-person choreography to virtual routine reviews, King Choreography offers a full range of services to elevate your competitive program.</p>
          </motion.div>

          {/* In-Person */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="mb-24">
            <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-[#D4AF37]/10 flex items-center justify-center"><Users className="w-5 h-5 text-[#D4AF37]" /></div>
              <h2 className="font-heading text-3xl font-bold uppercase text-white">In-Person Choreography</h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inPersonServices.length > 0 ? inPersonServices.map((s: any, i: number) => (
                <motion.div key={s.id} variants={fadeUp} className="bg-[#121212] border border-white/5 p-8 hover:border-[#D4AF37]/30 transition-colors" data-testid={`inperson-service-${i}`}>
                  <Crown className="w-6 h-6 text-[#D4AF37] mb-4" />
                  <h3 className="font-heading text-lg font-bold uppercase text-white mb-3">{s.name}</h3>
                  <p className="text-white/40 text-sm leading-relaxed mb-6">{s.description}</p>
                  <Link href="/apply" className="inline-flex items-center gap-2 text-[#D4AF37] text-sm font-semibold uppercase tracking-wider hover:gap-3 transition-all">
                    Apply for Availability <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              )) : ['Full Program Choreography', 'Choreography Camp', 'Competition Routine Polishing'].map((name, i) => (
                <div key={i} className="bg-[#121212] border border-white/5 p-8">
                  <Crown className="w-6 h-6 text-[#D4AF37] mb-4" />
                  <h3 className="font-heading text-lg font-bold uppercase text-white mb-3">{name}</h3>
                  <p className="text-white/40 text-sm leading-relaxed mb-6">Premium in-person choreography service tailored to your program&apos;s needs.</p>
                  <Link href="/apply" className="inline-flex items-center gap-2 text-[#D4AF37] text-sm font-semibold uppercase tracking-wider">Apply <ArrowRight className="w-4 h-4" /></Link>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link href="/choreography" className="inline-flex items-center gap-2 text-white/60 text-sm hover:text-[#D4AF37] transition-colors">
                Learn more about in-person choreography <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Virtual */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-[#D4AF37]/10 flex items-center justify-center"><Video className="w-5 h-5 text-[#D4AF37]" /></div>
              <h2 className="font-heading text-3xl font-bold uppercase text-white">Virtual Services</h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {virtualServices.map((s: any, i: number) => (
                <motion.div key={s.id} variants={fadeUp} className="bg-[#121212] border border-white/5 p-8 hover:border-[#D4AF37]/30 transition-colors" data-testid={`virtual-service-${i}`}>
                  <Video className="w-6 h-6 text-[#D4AF37] mb-4" />
                  <h3 className="font-heading text-lg font-bold uppercase text-white mb-3">{s.name}</h3>
                  <p className="text-white/40 text-sm leading-relaxed mb-4">{s.description}</p>
                  {s.service_type === 'review_feedback' && (
                    <p className="text-white/60 text-sm mb-6">From <span className="text-[#D4AF37] font-bold">${s.client_rate}</span> (clients) / <span className="text-white font-bold">${s.nonclient_rate}</span> (non-clients)</p>
                  )}
                  <Link href={s.service_type === 'review_feedback' ? '/reviews' : '/upgrades'} className="inline-flex items-center gap-2 text-[#D4AF37] text-sm font-semibold uppercase tracking-wider hover:gap-3 transition-all">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/reviews" className="inline-flex items-center gap-2 text-white/60 text-sm hover:text-[#D4AF37] transition-colors">Reviews & Feedback <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/upgrades" className="inline-flex items-center gap-2 text-white/60 text-sm hover:text-[#D4AF37] transition-colors">Virtual Upgrades <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/monthly" className="inline-flex items-center gap-2 text-white/60 text-sm hover:text-[#D4AF37] transition-colors">Monthly Reviews <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
