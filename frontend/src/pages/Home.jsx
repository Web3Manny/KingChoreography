import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ChevronRight } from 'lucide-react';

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_king-choreography/artifacts/uem2uv73_BK%20Logo%20TRSP.png';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const services = [
  { title: 'In-Person Choreography', desc: 'Custom routines built for your team. Brian travels to your gym for camps, competition prep, and full-program choreography.', link: '/choreography', cta: 'Apply for Availability' },
  { title: 'Routine Reviews & Feedback', desc: 'Submit your routine video for detailed professional feedback on technique, formations, transitions, and performance quality.', link: '/reviews', cta: 'Learn More' },
  { title: 'Virtual Routine Upgrades', desc: 'Virtual choreography upgrade sessions that elevate your existing routine with enhanced elements and strategies.', link: '/upgrades', cta: 'See Pricing' },
];

const testimonials = [
  { name: 'Sarah Mitchell', gym: 'Elite All Stars', quote: 'Brian transformed our competition routine. His attention to detail and ability to bring out the best in every athlete is unmatched.' },
  { name: 'Coach Rodriguez', gym: 'Victory Athletics', quote: 'Working with King Choreography was the best investment our program made this season. The results speak for themselves.' },
  { name: 'Amanda Chen', gym: 'Premier Cheer', quote: 'The virtual review service saved us weeks of guesswork. Brian\'s feedback was precise, actionable, and incredibly detailed.' },
];

export default function Home() {
  return (
    <div className="min-h-screen" data-testid="home-page">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0 bg-[#0A0A0A]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0A0A]" />
          {/* Gold glow effects matching logo's crown radiance */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#D4AF37]/[0.04] rounded-full blur-[150px]" />
          <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-[#B8860B]/[0.03] rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.15 } } }}>
            {/* Logo */}
            <motion.div variants={fadeUp} transition={{ duration: 0.6 }} className="mb-10">
              <img 
                src={LOGO_URL} 
                alt="King Choreography" 
                className="h-40 sm:h-52 md:h-64 w-auto mx-auto drop-shadow-[0_0_30px_rgba(212,175,55,0.15)]"
              />
            </motion.div>

            <motion.p variants={fadeUp} transition={{ duration: 0.6 }}
              className="text-[#A8A9AD] text-lg sm:text-xl max-w-2xl mx-auto mb-4 leading-relaxed"
            >
              Elite choreography for competitive cheer programs nationwide.
            </motion.p>

            <motion.p variants={fadeUp} transition={{ duration: 0.6 }}
              className="text-[#A8A9AD]/60 text-base max-w-xl mx-auto mb-12"
            >
              In-person camps, virtual reviews, and championship-level routine design.
            </motion.p>

            <motion.div variants={fadeUp} transition={{ duration: 0.6 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/apply" data-testid="hero-apply-btn"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 btn-gold px-10 py-5 text-sm"
              >
                Book Brian for Your Program <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/submit" data-testid="hero-submit-btn"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 border border-[#A8A9AD]/30 text-white font-bold uppercase tracking-wider text-sm hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-200"
              >
                Submit a Routine for Review <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-px h-16 bg-gradient-to-b from-[#D4AF37]/50 to-transparent" />
        </div>
      </section>

      {/* Services — badge-style cards */}
      <section className="py-32 relative" data-testid="services-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="mb-16">
              <span className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase">What We Offer</span>
              <h2 className="font-['Oswald'] text-4xl sm:text-5xl font-bold uppercase mt-4 text-white">Services</h2>
              <div className="divider-gold w-24 mt-4" />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {services.map((service, i) => (
                <motion.div key={i} variants={fadeUp} transition={{ duration: 0.5 }}>
                  <Link to={service.link} className="group block badge-card gold-glow-hover p-8 h-full" data-testid={`service-card-${i}`}>
                    <div className="w-10 h-10 bg-gradient-to-br from-[#B8860B] to-[#D4AF37] flex items-center justify-center mb-6">
                      <span className="font-['Oswald'] text-black text-lg font-bold">0{i + 1}</span>
                    </div>
                    <h3 className="font-['Oswald'] text-xl font-bold uppercase text-white mb-4">{service.title}</h3>
                    <p className="text-[#A8A9AD]/60 text-sm leading-relaxed mb-6">{service.desc}</p>
                    <span className="inline-flex items-center gap-2 text-[#D4AF37] text-sm font-semibold uppercase tracking-wider group-hover:gap-3 transition-all">
                      {service.cta} <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Teaser */}
      <section className="py-32 bg-[#121212] border-y border-[#A8A9AD]/10" data-testid="about-teaser">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }}>
              <span className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase">Meet Brian King</span>
              <h2 className="font-['Oswald'] text-4xl sm:text-5xl font-bold uppercase mt-4 mb-6 text-white">The Name Behind<br />The Crown</h2>
              <div className="divider-gold w-24 mb-8" />
              <p className="text-[#A8A9AD]/70 leading-relaxed mb-4">
                Brian King is one of the most sought-after choreographers in competitive cheerleading.
                With years of experience working with elite programs across the country, he brings
                championship-level precision and creativity to every routine.
              </p>
              <p className="text-[#A8A9AD]/70 leading-relaxed mb-8">
                From full-program choreography to virtual routine reviews, Brian's approach combines
                technical expertise with an unmatched understanding of what wins on the mat.
              </p>
              <Link to="/about" className="inline-flex items-center gap-2 text-[#D4AF37] font-semibold uppercase tracking-wider text-sm hover:gap-3 transition-all" data-testid="about-link">
                Full Bio <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="aspect-[4/5] bg-[#1A1A1A] border border-[#A8A9AD]/10 relative overflow-hidden gold-glow-hover">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent z-10" />
                <div className="absolute bottom-8 left-8 z-20">
                  <span className="font-['Oswald'] text-7xl font-bold text-gold-gradient">BK</span>
                </div>
                <div className="absolute top-4 right-4 z-20">
                  <img src={LOGO_URL} alt="" className="h-16 w-auto opacity-20" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32" data-testid="testimonials-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="mb-16">
              <span className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase">Testimonials</span>
              <h2 className="font-['Oswald'] text-4xl sm:text-5xl font-bold uppercase mt-4 text-white">What Coaches Say</h2>
              <div className="divider-gold w-24 mt-4" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div key={i} variants={fadeUp} transition={{ duration: 0.5 }}
                  className="badge-card p-8 gold-glow-hover"
                  data-testid={`testimonial-${i}`}
                >
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />)}
                  </div>
                  <p className="text-[#A8A9AD]/70 text-sm leading-relaxed mb-6">"{t.quote}"</p>
                  <div className="border-t border-[#A8A9AD]/10 pt-4">
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-[#D4AF37] text-xs">{t.gym}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-[#121212] border-t border-[#A8A9AD]/10" data-testid="cta-section">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }}>
            <img src={LOGO_URL} alt="" className="h-20 w-auto mx-auto mb-8 opacity-30" />
            <h2 className="font-['Oswald'] text-4xl sm:text-5xl font-bold uppercase mb-6 text-white">Ready to Elevate<br />Your Program?</h2>
            <p className="text-[#A8A9AD]/60 text-lg mb-10 max-w-xl mx-auto">Whether you need in-person choreography or a virtual routine review, Brian King delivers championship-level results.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/apply" className="inline-flex items-center gap-2 btn-gold px-10 py-5 text-sm">
                Apply for Choreography <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/submit" className="inline-flex items-center gap-2 px-10 py-5 border border-[#A8A9AD]/30 text-white font-bold uppercase tracking-wider text-sm hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all">
                Submit a Routine
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
