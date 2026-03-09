import { Link } from 'react-router-dom';
import { Crown, Instagram, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/5 pt-20 pb-8" data-testid="main-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#D4AF37] flex items-center justify-center">
                <Crown className="w-6 h-6 text-black" />
              </div>
              <div className="flex flex-col">
                <span className="font-['Oswald'] text-lg font-bold tracking-wider text-white uppercase leading-tight">KING</span>
                <span className="font-['Oswald'] text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase leading-tight">CHOREOGRAPHY</span>
              </div>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              Elite choreography for competitive cheer programs. Setting the gold standard in the industry.
            </p>
          </div>

          <div>
            <h4 className="font-['Oswald'] text-sm font-bold uppercase tracking-wider text-white mb-6">Services</h4>
            <div className="space-y-3">
              <Link to="/choreography" className="block text-sm text-white/40 hover:text-[#D4AF37] transition-colors">In-Person Choreography</Link>
              <Link to="/reviews" className="block text-sm text-white/40 hover:text-[#D4AF37] transition-colors">Routine Reviews</Link>
              <Link to="/upgrades" className="block text-sm text-white/40 hover:text-[#D4AF37] transition-colors">Virtual Upgrades</Link>
              <Link to="/monthly" className="block text-sm text-white/40 hover:text-[#D4AF37] transition-colors">Monthly Reviews</Link>
            </div>
          </div>

          <div>
            <h4 className="font-['Oswald'] text-sm font-bold uppercase tracking-wider text-white mb-6">Quick Links</h4>
            <div className="space-y-3">
              <Link to="/about" className="block text-sm text-white/40 hover:text-[#D4AF37] transition-colors">About Brian</Link>
              <Link to="/apply" className="block text-sm text-white/40 hover:text-[#D4AF37] transition-colors">Apply for Availability</Link>
              <Link to="/submit" className="block text-sm text-white/40 hover:text-[#D4AF37] transition-colors">Submit a Routine</Link>
              <Link to="/testimonials" className="block text-sm text-white/40 hover:text-[#D4AF37] transition-colors">Testimonials</Link>
              <Link to="/faq" className="block text-sm text-white/40 hover:text-[#D4AF37] transition-colors">FAQ</Link>
            </div>
          </div>

          <div>
            <h4 className="font-['Oswald'] text-sm font-bold uppercase tracking-wider text-white mb-6">Connect</h4>
            <div className="space-y-3">
              <a href="mailto:brian@kingchoreography.com" className="flex items-center gap-2 text-sm text-white/40 hover:text-[#D4AF37] transition-colors">
                <Mail className="w-4 h-4" /> brian@kingchoreography.com
              </a>
              <a href="https://instagram.com/kingchoreography" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white/40 hover:text-[#D4AF37] transition-colors">
                <Instagram className="w-4 h-4" /> @kingchoreography
              </a>
            </div>
            <div className="mt-6">
              <Link to="/contact" className="inline-block px-6 py-2.5 text-xs font-bold uppercase tracking-wider border border-white/20 text-white hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/20 text-xs tracking-wider">&copy; {new Date().getFullYear()} King Choreography. All rights reserved.</p>
          <p className="text-white/20 text-xs tracking-wider">THE GOLD STANDARD IN CHEER CHOREOGRAPHY</p>
        </div>
      </div>
    </footer>
  );
};
