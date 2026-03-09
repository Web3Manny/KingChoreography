'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_king-choreography/artifacts/uem2uv73_BK%20Logo%20TRSP.png'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/testimonials', label: 'Testimonials' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-[#A8A9AD]/10" data-testid="main-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2 group" data-testid="logo-link">
            <img src={LOGO_URL} alt="King Choreography" className="h-14 w-auto object-contain drop-shadow-[0_0_8px_rgba(212,175,55,0.15)]" />
          </Link>

          <nav className="hidden lg:flex items-center gap-1" data-testid="desktop-nav">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href}
                className={`px-4 py-2 text-sm font-medium tracking-wide uppercase transition-colors duration-200 ${
                  pathname === href ? 'text-[#D4AF37]' : 'text-[#A8A9AD] hover:text-white'
                }`}
              >{label}</Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link href="/apply" className="px-6 py-2.5 text-sm font-bold uppercase tracking-wider border border-[#A8A9AD]/40 text-white hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-200" data-testid="apply-cta-header">
              Apply
            </Link>
            <Link href="/submit" className="btn-gold px-6 py-2.5 text-sm inline-flex items-center" data-testid="submit-cta-header">
              Submit
            </Link>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-white" data-testid="mobile-menu-toggle">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#0A0A0A] border-t border-[#A8A9AD]/10 overflow-hidden" data-testid="mobile-nav"
          >
            <div className="px-4 py-6 space-y-1">
              {navLinks.map(({ href, label }) => (
                <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 text-sm font-medium uppercase tracking-wider ${
                    pathname === href ? 'text-[#D4AF37] bg-white/5' : 'text-[#A8A9AD]'
                  }`}
                >{label}</Link>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                <Link href="/apply" onClick={() => setMobileOpen(false)} className="block text-center px-6 py-3 text-sm font-bold uppercase tracking-wider border border-[#A8A9AD]/40 text-white">
                  Apply for Availability
                </Link>
                <Link href="/submit" onClick={() => setMobileOpen(false)} className="block text-center btn-gold px-6 py-3 text-sm">
                  Submit a Routine
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
