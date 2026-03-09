'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }

const testimonials = [
  { name: 'Sarah Mitchell', title: 'Head Coach', gym: 'Elite All Stars', quote: 'Brian transformed our competition routine completely. His attention to detail and ability to bring out the best in every athlete is truly unmatched. We saw an immediate improvement in our scores.' },
  { name: 'Coach Rodriguez', title: 'Program Director', gym: 'Victory Athletics', quote: 'Working with King Choreography was the best investment our program made this season. The routines Brian creates are clean, powerful, and perfectly tailored to our athletes.' },
  { name: 'Amanda Chen', title: 'Owner & Coach', gym: 'Premier Cheer', quote: "The virtual review service saved us weeks of guesswork. Brian's feedback was precise, actionable, and incredibly detailed. Our routine improved dramatically after just one review." },
  { name: 'Jessica Williams', title: 'Head Coach', gym: 'Champion Force', quote: 'Brian brings an energy and expertise that elevates everything. Our athletes were inspired, our parents were impressed, and the judges noticed the difference immediately.' },
  { name: 'Coach Davis', title: 'Program Director', gym: 'Stingray Allstars', quote: "The level of professionalism and creativity Brian brings is next level. He understood our vision and exceeded every expectation. Can't recommend him enough." },
  { name: 'Megan Torres', title: 'Head Coach', gym: 'Rockstar Cheer', quote: "We've used the virtual upgrade service twice now and both times the results were incredible. Brian somehow makes everything look effortless while pushing boundaries." },
]

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen pt-20" data-testid="testimonials-page">
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }} className="mb-16">
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase">What They Say</span>
            <h1 className="font-heading text-5xl sm:text-6xl font-bold uppercase mt-4 text-white">Testimonials</h1>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                className="bg-[#121212] border border-white/5 p-8 hover:border-[#D4AF37]/20 transition-colors" data-testid={`testimonial-card-${i}`}
              >
                <Quote className="w-8 h-8 text-[#D4AF37]/20 mb-4" />
                <p className="text-white/60 text-sm leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex gap-1 mb-4">{[...Array(5)].map((_, j) => <Star key={j} className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />)}</div>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-white/40 text-xs">{t.title}</p>
                  <p className="text-[#D4AF37] text-xs">{t.gym}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
