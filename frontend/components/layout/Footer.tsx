import Link from 'next/link'
import { Mail, Instagram } from 'lucide-react'

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_king-choreography/artifacts/uem2uv73_BK%20Logo%20TRSP.png'

export function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#A8A9AD]/10 pt-20 pb-8" data-testid="main-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <img src={LOGO_URL} alt="King Choreography" className="h-20 w-auto object-contain mb-6" />
            <p className="text-[#A8A9AD]/60 text-sm leading-relaxed">
              Elite choreography for competitive cheer programs. Setting the gold standard in the industry.
            </p>
          </div>
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-[#A8A9AD] mb-6">Services</h4>
            <div className="space-y-3">
              <Link href="/choreography" className="block text-sm text-[#A8A9AD]/50 hover:text-[#D4AF37] transition-colors">In-Person Choreography</Link>
              <Link href="/reviews" className="block text-sm text-[#A8A9AD]/50 hover:text-[#D4AF37] transition-colors">Routine Reviews</Link>
              <Link href="/upgrades" className="block text-sm text-[#A8A9AD]/50 hover:text-[#D4AF37] transition-colors">Virtual Upgrades</Link>
              <Link href="/monthly" className="block text-sm text-[#A8A9AD]/50 hover:text-[#D4AF37] transition-colors">Monthly Reviews</Link>
            </div>
          </div>
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-[#A8A9AD] mb-6">Quick Links</h4>
            <div className="space-y-3">
              <Link href="/about" className="block text-sm text-[#A8A9AD]/50 hover:text-[#D4AF37] transition-colors">About Brian</Link>
              <Link href="/apply" className="block text-sm text-[#A8A9AD]/50 hover:text-[#D4AF37] transition-colors">Apply for Availability</Link>
              <Link href="/submit" className="block text-sm text-[#A8A9AD]/50 hover:text-[#D4AF37] transition-colors">Submit a Routine</Link>
              <Link href="/testimonials" className="block text-sm text-[#A8A9AD]/50 hover:text-[#D4AF37] transition-colors">Testimonials</Link>
              <Link href="/faq" className="block text-sm text-[#A8A9AD]/50 hover:text-[#D4AF37] transition-colors">FAQ</Link>
            </div>
          </div>
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-[#A8A9AD] mb-6">Connect</h4>
            <div className="space-y-3">
              <a href="mailto:brian@kingchoreography.com" className="flex items-center gap-2 text-sm text-[#A8A9AD]/50 hover:text-[#D4AF37] transition-colors">
                <Mail className="w-4 h-4" /> brian@kingchoreography.com
              </a>
              <a href="https://instagram.com/kingchoreography" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-[#A8A9AD]/50 hover:text-[#D4AF37] transition-colors">
                <Instagram className="w-4 h-4" /> @kingchoreography
              </a>
            </div>
            <div className="mt-6">
              <Link href="/contact" className="inline-block px-6 py-2.5 text-xs font-bold uppercase tracking-wider border border-[#A8A9AD]/30 text-white hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
        <div className="divider-gold mb-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#A8A9AD]/30 text-xs tracking-wider">&copy; {new Date().getFullYear()} King Choreography. All rights reserved.</p>
          <p className="text-[#A8A9AD]/30 text-xs tracking-[0.3em] font-heading uppercase">The Gold Standard in Cheer Choreography</p>
        </div>
      </div>
    </footer>
  )
}
