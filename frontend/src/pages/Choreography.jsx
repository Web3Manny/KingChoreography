import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Music, Sparkles, Target } from 'lucide-react';

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_king-choreography/artifacts/uem2uv73_BK%20Logo%20TRSP.png';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const features = [
  { icon: Music, title: 'Custom Music & Choreography', desc: 'Routines built from scratch around your team\'s strengths and competition goals.' },
  { icon: Sparkles, title: 'Performance Quality', desc: 'Emphasis on execution, energy, and stage presence that makes routines unforgettable.' },
  { icon: Target, title: 'Competition Strategy', desc: 'Routines designed to maximize scoring potential for your specific division and level.' },
];

const process = [
  { step: '01', title: 'Apply', desc: 'Submit your application with program details and preferred timeframe.' },
  { step: '02', title: 'Consult', desc: 'Brian reviews your application and schedules a consultation to discuss your vision.' },
  { step: '03', title: 'Choreograph', desc: 'Brian travels to your gym for intensive choreography sessions with your athletes.' },
  { step: '04', title: 'Compete', desc: 'Hit the mat with a championship-caliber routine designed to win.' },
];

export default function Choreography() {
  return (
    <div className="min-h-screen pt-20" data-testid="choreography-page">
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }} className="max-w-3xl">
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase">In-Person Services</span>
            <h1 className="font-['Oswald'] text-5xl sm:text-6xl font-bold uppercase mt-4 mb-6 text-white leading-[0.95]">Choreography<br /><span className="text-gold-gradient">Services</span></h1>
            <p className="text-white/50 text-lg leading-relaxed mb-10">Brian King travels to your gym to create custom competition routines. From full-program choreography to intensive camps, every session is designed to bring out the best in your athletes.</p>
            <Link to="/apply" className="inline-flex items-center gap-2 btn-gold px-10 py-5 text-sm" data-testid="choreo-apply-cta">
              Apply for Availability <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-[#121212] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <motion.h2 variants={fadeUp} className="font-['Oswald'] text-3xl font-bold uppercase text-white mb-12">What's Included</motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map(({ icon: Icon, title, desc }, i) => (
                <motion.div key={i} variants={fadeUp} className="bg-[#0A0A0A] border border-white/5 p-8">
                  <Icon className="w-8 h-8 text-[#D4AF37] mb-4" />
                  <h3 className="font-['Oswald'] text-lg font-bold uppercase text-white mb-3">{title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-['Oswald'] text-3xl font-bold uppercase text-white mb-12">The Process</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((p, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }}
                className="relative p-6 bg-[#121212] border border-white/5"
              >
                <span className="font-['Oswald'] text-4xl font-bold text-[#D4AF37]/20">{p.step}</span>
                <h3 className="font-['Oswald'] text-lg font-bold uppercase text-white mt-2 mb-2">{p.title}</h3>
                <p className="text-white/40 text-sm">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#121212] border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-['Oswald'] text-3xl sm:text-4xl font-bold uppercase text-white mb-6">Ready to Get Started?</h2>
          <p className="text-white/50 mb-10">Applications are reviewed on a first-come, first-served basis. Secure your spot for the upcoming season.</p>
          <Link to="/apply" className="inline-flex items-center gap-2 btn-gold px-10 py-5 text-sm">
            Apply for Availability <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
