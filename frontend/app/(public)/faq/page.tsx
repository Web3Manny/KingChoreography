'use client'

import { motion } from 'framer-motion'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }

const categories = [
  {
    title: 'General',
    items: [
      { q: 'What services does King Choreography offer?', a: 'We offer in-person choreography services (full program choreography, camps, competition polishing) and virtual services (routine reviews & feedback, virtual routine upgrades, and monthly review subscriptions).' },
      { q: 'Where is Brian King based?', a: 'Brian travels nationwide to work with programs. For in-person services, he comes to your gym. Virtual services are available to anyone regardless of location.' },
      { q: 'How do I get started?', a: 'For in-person choreography, submit an application through our Apply page. For virtual services, head to our Submit page to start the process. Brian reviews all applications personally.' },
    ]
  },
  {
    title: 'Submissions',
    items: [
      { q: 'What video formats are accepted?', a: 'We accept MP4 and MOV files up to 500MB. Please ensure your video clearly shows the full routine with good lighting and audio.' },
      { q: 'How long does a review take?', a: "Reviews are processed on a weekly cycle. Submissions received by Monday at 11:59 PM Eastern are included in that week's queue. Typical turnaround is within the assigned review week." },
      { q: 'What is the Monday cutoff?', a: "Submissions received before Monday at 11:59 PM ET are assigned to the current week's review queue. Submissions after that time are assigned to the following week." },
      { q: 'Can I submit multiple routines?', a: 'Yes! Each routine requires a separate submission and payment. You can submit as many routines as you need.' },
    ]
  },
  {
    title: 'Pricing',
    items: [
      { q: "What's the difference between client and non-client rates?", a: "Current clients who have worked with Brian for in-person choreography receive discounted rates on virtual services. If you've booked Brian for your program, you qualify for client pricing." },
      { q: 'How is Virtual Upgrade pricing calculated?', a: 'Virtual Upgrade pricing is based on three factors: client status (client or non-client), session length (2 hours or 4 hours), and the number of athletes. The formula is: number of athletes x per-athlete rate.' },
      { q: 'What payment methods are accepted?', a: 'We accept PayPal for all paid services. You can pay with your PayPal balance, linked bank account, or credit/debit card through PayPal.' },
      { q: 'Is the Free Tier really free?', a: 'Yes! Current clients can submit video updates at no cost. This is a file drop for Brian to track your progress — no formal feedback is provided for free tier submissions.' },
    ]
  },
  {
    title: 'Technical',
    items: [
      { q: 'My video file is too large. What can I do?', a: 'We accept files up to 500MB. If your file is larger, try compressing it using a tool like HandBrake or reducing the resolution. Most routine videos at 720p or 1080p should be well within the limit.' },
      { q: "I'm having trouble uploading. What should I do?", a: 'Make sure your file is in MP4 or MOV format and under 500MB. If you\'re on a slow connection, try uploading from a WiFi network. If issues persist, contact us through the Contact page.' },
      { q: 'Can I edit my submission after it\'s been sent?', a: 'Once a submission is completed and payment is processed, it cannot be edited. If you need to make changes, please contact Brian directly through the Contact page.' },
    ]
  }
]

export default function FAQPage() {
  return (
    <div className="min-h-screen pt-20" data-testid="faq-page">
      <section className="py-24 sm:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }} className="mb-16">
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase">Help Center</span>
            <h1 className="font-heading text-5xl sm:text-6xl font-bold uppercase mt-4 text-white">FAQ</h1>
          </motion.div>
          <div className="space-y-12">
            {categories.map((cat, ci) => (
              <motion.div key={ci} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }}>
                <h2 className="font-heading text-xl font-bold uppercase text-[#D4AF37] mb-4">{cat.title}</h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {cat.items.map((item, i) => (
                    <AccordionItem key={i} value={`${ci}-${i}`} className="border border-white/5 bg-[#121212] px-6" data-testid={`faq-item-${ci}-${i}`}>
                      <AccordionTrigger className="text-left text-sm font-medium text-white hover:text-[#D4AF37] py-4 [&[data-state=open]]:text-[#D4AF37]">{item.q}</AccordionTrigger>
                      <AccordionContent className="text-white/50 text-sm leading-relaxed pb-4">{item.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
