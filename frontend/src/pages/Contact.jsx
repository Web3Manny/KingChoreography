import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Instagram, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { submitContact } from '@/lib/api';
import { toast } from 'sonner';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { toast.error('Please fill in all required fields'); return; }
    setLoading(true);
    try {
      await submitContact(form);
      setSent(true);
      toast.success('Message sent successfully!');
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center" data-testid="contact-success">
        <div className="text-center px-4">
          <CheckCircle className="w-16 h-16 text-[#D4AF37] mx-auto mb-6" />
          <h1 className="font-['Oswald'] text-4xl font-bold uppercase text-white mb-4">Message Sent</h1>
          <p className="text-white/50 max-w-md mx-auto">Thank you for reaching out. Brian will get back to you as soon as possible.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20" data-testid="contact-page">
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }}>
              <span className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase">Get in Touch</span>
              <h1 className="font-['Oswald'] text-5xl sm:text-6xl font-bold uppercase mt-4 mb-6 text-white">Contact</h1>
              <p className="text-white/50 text-lg mb-10">Have a question that doesn't fit the application or submission form? Reach out directly.</p>

              <div className="space-y-6">
                <a href="mailto:brian@kingchoreography.com" className="flex items-center gap-4 text-white/60 hover:text-[#D4AF37] transition-colors">
                  <div className="w-12 h-12 bg-[#121212] border border-white/5 flex items-center justify-center"><Mail className="w-5 h-5" /></div>
                  <div>
                    <p className="text-white text-sm font-medium">Email</p>
                    <p className="text-sm">brian@kingchoreography.com</p>
                  </div>
                </a>
                <a href="https://instagram.com/kingchoreography" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-white/60 hover:text-[#D4AF37] transition-colors">
                  <div className="w-12 h-12 bg-[#121212] border border-white/5 flex items-center justify-center"><Instagram className="w-5 h-5" /></div>
                  <div>
                    <p className="text-white text-sm font-medium">Instagram</p>
                    <p className="text-sm">@kingchoreography</p>
                  </div>
                </a>
              </div>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6, delay: 0.2 }}>
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                <div>
                  <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2 block">Name *</label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="bg-black/50 border-white/10 focus:border-[#D4AF37] text-white placeholder:text-white/20 rounded-none h-12"
                    placeholder="Your name" data-testid="contact-name" />
                </div>
                <div>
                  <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2 block">Email *</label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="bg-black/50 border-white/10 focus:border-[#D4AF37] text-white placeholder:text-white/20 rounded-none h-12"
                    placeholder="your@email.com" data-testid="contact-email" />
                </div>
                <div>
                  <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2 block">Subject</label>
                  <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="bg-black/50 border-white/10 focus:border-[#D4AF37] text-white placeholder:text-white/20 rounded-none h-12"
                    placeholder="What's this about?" data-testid="contact-subject" />
                </div>
                <div>
                  <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2 block">Message *</label>
                  <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="bg-black/50 border-white/10 focus:border-[#D4AF37] text-white placeholder:text-white/20 rounded-none min-h-[150px]"
                    placeholder="Your message..." data-testid="contact-message" />
                </div>
                <button type="submit" disabled={loading}
                  className="inline-flex items-center gap-2 px-10 py-4 bg-[#D4AF37] text-black font-bold uppercase tracking-wider text-sm hover:bg-[#FFD700] transition-colors disabled:opacity-50"
                  data-testid="contact-submit-btn"
                >
                  {loading ? 'Sending...' : 'Send Message'} <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
