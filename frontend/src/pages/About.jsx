import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Users } from 'lucide-react';

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_king-choreography/artifacts/uem2uv73_BK%20Logo%20TRSP.png';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const credentials = [
  'Championship-winning routine design',
  'Worked with 100+ competitive cheer programs',
  'National-level competition expertise',
  'Specialized in all team sizes and divisions',
  'Youth through Open level experience',
  'Virtual and in-person service options',
];

const pastClients = [
  'Elite All Stars', 'Victory Athletics', 'Premier Cheer', 'Champion Force',
  'Stingray Allstars', 'Rockstar Cheer', 'Top Gun Allstars', 'Woodlands Elite',
];

export default function About() {
  return (
    <div className="min-h-screen pt-20" data-testid="about-page">
      {/* Hero */}
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }} className="lg:col-span-3">
              <span className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase">About</span>
              <h1 className="font-['Oswald'] text-5xl sm:text-6xl lg:text-7xl font-bold uppercase mt-4 mb-8 text-white leading-[0.95]">
                Brian<br /><span className="text-gold-gradient">King</span>
              </h1>
              <div className="space-y-6 text-white/50 leading-relaxed">
                <p>Brian King is one of the most respected and sought-after choreographers in the competitive cheerleading industry. Known for his innovative routines, attention to detail, and ability to maximize every athlete's potential, Brian has built a reputation as the go-to choreographer for programs that want to win.</p>
                <p>With years of experience working across all levels and divisions, Brian brings a unique combination of creative vision and technical precision to every project. His routines are known for their clean execution, powerful musicality, and crowd-stopping moments that leave an impression on judges and audiences alike.</p>
                <p>Beyond in-person choreography, Brian offers virtual services including routine reviews, feedback sessions, and virtual upgrades — making his expertise accessible to programs nationwide regardless of location.</p>
              </div>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-2">
              <div className="aspect-[3/4] bg-[#121212] border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent z-10" />
                <div className="absolute bottom-6 left-6 z-20">
                  <span className="font-['Oswald'] text-5xl font-bold text-gold-gradient">BK</span>
                  <p className="text-white/40 text-xs tracking-wider mt-1">FOUNDER & HEAD CHOREOGRAPHER</p>
                </div>
                <div className="absolute top-4 right-4 z-20">
                  <img src={LOGO_URL} alt="" className="h-14 w-auto opacity-20" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-24 bg-[#121212] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
            <motion.div variants={fadeUp} className="mb-12">
              <h2 className="font-['Oswald'] text-3xl sm:text-4xl font-bold uppercase text-white">Credentials & Expertise</h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {credentials.map((item, i) => (
                <motion.div key={i} variants={fadeUp} className="flex items-start gap-3 p-4 bg-[#0A0A0A] border border-white/5">
                  <Award className="w-5 h-5 text-[#D4AF37] mt-0.5 shrink-0" />
                  <span className="text-[#A8A9AD]/70 text-sm">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Past Clients */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }}>
            <h2 className="font-['Oswald'] text-3xl sm:text-4xl font-bold uppercase text-white mb-12">Notable Programs</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {pastClients.map((client, i) => (
                <div key={i} className="bg-[#121212] border border-white/5 p-6 text-center hover:border-[#D4AF37]/30 transition-colors" data-testid={`client-${i}`}>
                  <Users className="w-6 h-6 text-[#D4AF37]/40 mx-auto mb-3" />
                  <p className="text-white/70 text-sm font-medium">{client}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#121212] border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-['Oswald'] text-3xl sm:text-4xl font-bold uppercase text-white mb-6">Work with Brian</h2>
          <p className="text-white/50 mb-10">Ready to take your program to the next level? Apply for in-person choreography or submit a routine for virtual review.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/apply" className="inline-flex items-center justify-center gap-2 btn-gold px-8 py-4 text-sm" data-testid="about-apply-cta">
              Apply for Availability <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/services" className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-wider text-sm hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors">
              View All Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
