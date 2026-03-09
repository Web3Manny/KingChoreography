import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/testimonials', label: 'Testimonials' },
    { to: '/faq', label: 'FAQ' },
    { to: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/5" data-testid="main-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group" data-testid="logo-link">
            <div className="w-10 h-10 bg-[#D4AF37] flex items-center justify-center">
              <Crown className="w-6 h-6 text-black" />
            </div>
            <div className="flex flex-col">
              <span className="font-['Oswald'] text-lg font-bold tracking-wider text-white uppercase leading-tight">KING</span>
              <span className="font-['Oswald'] text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase leading-tight">CHOREOGRAPHY</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1" data-testid="desktop-nav">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-4 py-2 text-sm font-medium tracking-wide uppercase transition-colors duration-200 ${
                  isActive(to) ? 'text-[#D4AF37]' : 'text-white/60 hover:text-white'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/apply"
              className="px-6 py-2.5 text-sm font-bold uppercase tracking-wider border border-white/20 text-white hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors duration-200"
              data-testid="apply-cta-header"
            >
              Apply
            </Link>
            <Link
              to="/submit"
              className="px-6 py-2.5 text-sm font-bold uppercase tracking-wider bg-[#D4AF37] text-black hover:bg-[#FFD700] transition-colors duration-200"
              data-testid="submit-cta-header"
            >
              Submit
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-white"
            data-testid="mobile-menu-toggle"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#0A0A0A] border-t border-white/5 overflow-hidden"
            data-testid="mobile-nav"
          >
            <div className="px-4 py-6 space-y-1">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 text-sm font-medium uppercase tracking-wider ${
                    isActive(to) ? 'text-[#D4AF37] bg-white/5' : 'text-white/60'
                  }`}
                >
                  {label}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                <Link to="/apply" onClick={() => setMobileOpen(false)} className="block text-center px-6 py-3 text-sm font-bold uppercase tracking-wider border border-white/20 text-white">
                  Apply for Availability
                </Link>
                <Link to="/submit" onClick={() => setMobileOpen(false)} className="block text-center px-6 py-3 text-sm font-bold uppercase tracking-wider bg-[#D4AF37] text-black">
                  Submit a Routine
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
