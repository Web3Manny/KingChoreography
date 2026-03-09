'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle, Instagram, ArrowRight } from 'lucide-react'

export default function ApplyConfirmedPage() {
  return (
    <div className="min-h-screen pt-20 flex items-center" data-testid="apply-confirmed-page">
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <div className="w-20 h-20 bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-[#D4AF37]" />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold uppercase text-white mb-4">Application<br /><span className="text-gold-gradient">Received</span></h1>
          <p className="text-white/50 text-lg mb-8">Thank you for your interest in working with King Choreography. Brian will review your application and reach out within 2-3 business days.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://instagram.com/kingchoreography" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-wider text-sm hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
            >
              <Instagram className="w-4 h-4" /> Follow Brian on Instagram
            </a>
            <Link href="/" className="inline-flex items-center gap-2 text-white/40 text-sm hover:text-white transition-colors">
              Back to Home <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
