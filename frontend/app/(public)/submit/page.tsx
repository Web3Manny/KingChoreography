'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Crown, FileText, Video, Upload, CreditCard, ChevronRight, ChevronLeft, CheckCircle, X, AlertCircle } from 'lucide-react'
import { getServices, calculatePriceApi, submitSubmission, submitFreeSubmission, createPayPalOrder, capturePayPalOrder } from '@/lib/api'
import { toast } from 'sonner'

const steps = ['Service', 'Contact', 'Details', 'Video', 'Payment']
const stepIcons = [Crown, FileText, FileText, Video, CreditCard]

export default function SubmitPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [priceData, setPriceData] = useState<any>(null)
  const [files, setFiles] = useState<File[]>([])

  const [form, setForm] = useState({
    service_id: '', service_type: '',
    full_name: '', email: '', phone: '', gym_name: '',
    athlete_names: [] as string[], athlete_count: 1, is_existing_client: false,
    session_length: '', consultation_addon: false, areas_of_concern: ''
  })

  useEffect(() => {
    getServices('virtual').then(r => setServices(r || [])).catch(() => {})
  }, [])

  useEffect(() => {
    if (form.service_id && form.service_type !== 'free_tier') {
      calculatePriceApi({
        service_id: form.service_id,
        athlete_count: form.athlete_count || 1,
        is_existing_client: form.is_existing_client,
        session_length: form.session_length || null,
        consultation_addon: form.consultation_addon
      }).then(r => setPriceData(r)).catch(() => {})
    } else if (form.service_type === 'free_tier') {
      setPriceData({ total: 0, breakdown: { type: 'free' } })
    }
  }, [form.service_id, form.athlete_count, form.is_existing_client, form.session_length, form.consultation_addon, form.service_type])

  const selectedService = services.find((s: any) => s.id === form.service_id)

  const selectService = (service: any) => {
    setForm({ ...form, service_id: service.id, service_type: service.service_type })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []).filter(f => {
      if (f.size > 500 * 1024 * 1024) { toast.error(`${f.name} exceeds 500MB limit`); return false }
      if (!['video/mp4', 'video/quicktime'].includes(f.type)) { toast.error(`${f.name} is not a supported format (MP4/MOV only)`); return false }
      return true
    })
    setFiles([...files, ...newFiles])
  }

  const removeFile = (index: number) => setFiles(files.filter((_, i) => i !== index))

  const canProceed = () => {
    switch (currentStep) {
      case 0: return !!form.service_id
      case 1: return form.full_name && form.email && form.gym_name
      case 2: return form.athlete_count >= 1 && (form.service_type !== 'virtual_upgrade' || form.session_length)
      case 3: return true
      case 4: return true
      default: return false
    }
  }

  const handlePayAndSubmit = async () => {
    setLoading(true)
    try {
      const isFree = form.service_type === 'free_tier'
      const submissionData = { ...form, athlete_names: form.athlete_names.length ? form.athlete_names : [form.full_name] }
      let response
      if (isFree) {
        if (!form.is_existing_client) { toast.error('Free submissions are for current clients only'); setLoading(false); return }
        response = await submitFreeSubmission(submissionData)
      } else {
        response = await submitSubmission(submissionData)
        const orderResp = await createPayPalOrder({ submission_id: response.id, amount: priceData?.total || 0 })
        await capturePayPalOrder({ order_id: orderResp.order_id, submission_id: response.id })
      }
      router.push('/submit/confirmed')
    } catch {
      toast.error('Submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-20" data-testid="submit-page">
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase">Virtual Services</span>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold uppercase mt-4 mb-4 text-white">Submit a<br /><span className="text-gold-gradient">Routine</span></h1>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2" data-testid="step-indicator">
            {steps.map((step, i) => {
              const Icon = stepIcons[i]
              return (
                <div key={i} className="flex items-center gap-2 shrink-0">
                  <div className={`flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                    i === currentStep ? 'bg-[#D4AF37] text-black' : i < currentStep ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-[#121212] text-white/30'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{step}</span>
                  </div>
                  {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-white/20 shrink-0" />}
                </div>
              )
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              {/* Step 0: Service Selection */}
              {currentStep === 0 && (
                <div className="space-y-4" data-testid="step-service">
                  <h2 className="font-heading text-2xl font-bold uppercase text-white mb-6">Select a Service</h2>
                  {services.map((s: any) => (
                    <button key={s.id} type="button" onClick={() => selectService(s)}
                      className={`w-full text-left p-6 border transition-colors ${
                        form.service_id === s.id ? 'bg-[#D4AF37]/10 border-[#D4AF37]/50' : 'bg-[#121212] border-white/5 hover:border-white/20'
                      }`} data-testid={`service-option-${s.service_type}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-heading text-lg font-bold uppercase text-white">{s.name}</h3>
                          <p className="text-white/40 text-sm mt-1">{s.description}</p>
                          {s.service_type === 'free_tier' && <span className="inline-block mt-2 px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-bold uppercase">Current Clients Only</span>}
                        </div>
                        {form.service_id === s.id && <CheckCircle className="w-6 h-6 text-[#D4AF37] shrink-0" />}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 1: Contact */}
              {currentStep === 1 && (
                <div className="space-y-6" data-testid="step-contact">
                  <h2 className="font-heading text-2xl font-bold uppercase text-white mb-6">Contact & Program Info</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2 block">Full Name *</label>
                      <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                        className="bg-black/50 border-white/10 focus:border-[#D4AF37] text-white rounded-none h-12" data-testid="submit-fullname" />
                    </div>
                    <div>
                      <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2 block">Email *</label>
                      <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="bg-black/50 border-white/10 focus:border-[#D4AF37] text-white rounded-none h-12" data-testid="submit-email" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2 block">Phone</label>
                      <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="bg-black/50 border-white/10 focus:border-[#D4AF37] text-white rounded-none h-12" data-testid="submit-phone" />
                    </div>
                    <div>
                      <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2 block">Gym / Program Name *</label>
                      <Input value={form.gym_name} onChange={(e) => setForm({ ...form, gym_name: e.target.value })}
                        className="bg-black/50 border-white/10 focus:border-[#D4AF37] text-white rounded-none h-12" data-testid="submit-gym" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Details */}
              {currentStep === 2 && (
                <div className="space-y-6" data-testid="step-details">
                  <h2 className="font-heading text-2xl font-bold uppercase text-white mb-6">Submission Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2 block">Number of Athletes *</label>
                      <Input type="number" min="1" value={form.athlete_count} onChange={(e) => setForm({ ...form, athlete_count: parseInt(e.target.value) || 1 })}
                        className="bg-black/50 border-white/10 focus:border-[#D4AF37] text-white rounded-none h-12" data-testid="submit-athlete-count" />
                    </div>
                    <div>
                      <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2 block">Current Client?</label>
                      <div className="flex gap-4 h-12 items-center">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Checkbox checked={form.is_existing_client} onCheckedChange={(v) => setForm({ ...form, is_existing_client: !!v })} data-testid="submit-client-checkbox" />
                          <span className="text-white/70 text-sm">Yes, I&apos;m a current client</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  {form.service_type === 'virtual_upgrade' && (
                    <div>
                      <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2 block">Session Length *</label>
                      <div className="grid grid-cols-2 gap-4">
                        {['2hr', '4hr'].map(length => (
                          <button key={length} type="button" onClick={() => setForm({ ...form, session_length: length })}
                            className={`p-4 border text-center font-bold uppercase tracking-wider text-sm transition-colors ${
                              form.session_length === length ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-[#121212] border-white/10 text-white/50 hover:border-white/30'
                            }`} data-testid={`submit-session-${length}`}
                          >{length === '2hr' ? '2 Hours' : '4 Hours'}</button>
                        ))}
                      </div>
                    </div>
                  )}
                  {form.service_type === 'review_feedback' && (
                    <div className="p-4 bg-[#121212] border border-white/5">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <Checkbox checked={form.consultation_addon} onCheckedChange={(v) => setForm({ ...form, consultation_addon: !!v })} data-testid="submit-consultation-addon" />
                        <div>
                          <span className="text-white text-sm font-medium">Add Live Consultation (+$100)</span>
                          <p className="text-white/40 text-xs">Schedule a live session with Brian to discuss your feedback in detail.</p>
                        </div>
                      </label>
                    </div>
                  )}
                  {form.service_type === 'free_tier' && !form.is_existing_client && (
                    <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20">
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <p className="text-red-400 text-sm">Free submissions are available for current clients only. Please check the &ldquo;Current Client&rdquo; box or select a different service.</p>
                    </div>
                  )}
                  <div>
                    <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2 block">Areas of Concern / Notes</label>
                    <Textarea value={form.areas_of_concern} onChange={(e) => setForm({ ...form, areas_of_concern: e.target.value })}
                      className="bg-black/50 border-white/10 focus:border-[#D4AF37] text-white rounded-none min-h-[100px]"
                      placeholder="What should Brian focus on?" data-testid="submit-notes" />
                  </div>
                </div>
              )}

              {/* Step 3: Video Upload */}
              {currentStep === 3 && (
                <div className="space-y-6" data-testid="step-video">
                  <h2 className="font-heading text-2xl font-bold uppercase text-white mb-6">Upload Video</h2>
                  <div className="border-2 border-dashed border-white/10 p-12 text-center hover:border-[#D4AF37]/30 transition-colors">
                    <Upload className="w-12 h-12 text-white/20 mx-auto mb-4" />
                    <p className="text-white/50 text-sm mb-2">Drag & drop or click to upload</p>
                    <p className="text-white/30 text-xs mb-4">MP4 or MOV, max 500MB</p>
                    <label className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-black font-bold uppercase tracking-wider text-xs cursor-pointer hover:bg-[#FFD700] transition-colors">
                      <Upload className="w-4 h-4" /> Choose File
                      <input type="file" accept="video/mp4,video/quicktime" onChange={handleFileChange} className="hidden" data-testid="submit-file-input" />
                    </label>
                  </div>
                  {files.length > 0 && (
                    <div className="space-y-2">
                      {files.map((f, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-[#121212] border border-white/5">
                          <div className="flex items-center gap-3">
                            <Video className="w-4 h-4 text-[#D4AF37]" />
                            <div>
                              <p className="text-white text-sm">{f.name}</p>
                              <p className="text-white/30 text-xs">{(f.size / 1024 / 1024).toFixed(1)} MB</p>
                            </div>
                          </div>
                          <button onClick={() => removeFile(i)} className="text-white/30 hover:text-red-400 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-white/30 text-xs">Note: Video upload functionality uses placeholder storage in this preview.</p>
                </div>
              )}

              {/* Step 4: Payment */}
              {currentStep === 4 && (
                <div className="space-y-6" data-testid="step-payment">
                  <h2 className="font-heading text-2xl font-bold uppercase text-white mb-6">
                    {form.service_type === 'free_tier' ? 'Confirm Submission' : 'Review & Pay'}
                  </h2>
                  <div className="bg-[#121212] border border-white/5 p-6 space-y-4">
                    <h3 className="font-heading text-sm font-bold uppercase text-[#D4AF37]">Order Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-white/40">Service</span><span className="text-white">{selectedService?.name}</span></div>
                      <div className="flex justify-between"><span className="text-white/40">Program</span><span className="text-white">{form.gym_name}</span></div>
                      <div className="flex justify-between"><span className="text-white/40">Athletes</span><span className="text-white">{form.athlete_count}</span></div>
                      <div className="flex justify-between"><span className="text-white/40">Client Status</span><span className="text-white">{form.is_existing_client ? 'Current Client' : 'Non-Client'}</span></div>
                      {form.session_length && <div className="flex justify-between"><span className="text-white/40">Session</span><span className="text-white">{form.session_length === '2hr' ? '2 Hours' : '4 Hours'}</span></div>}
                      {form.consultation_addon && <div className="flex justify-between"><span className="text-white/40">Consultation Add-on</span><span className="text-[#D4AF37]">+$100</span></div>}
                    </div>
                    <div className="border-t border-white/10 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-heading text-lg font-bold uppercase text-white">Total</span>
                        <span className="font-heading text-3xl font-bold text-[#D4AF37]">
                          {form.service_type === 'free_tier' ? 'FREE' : `$${priceData?.total?.toFixed(2) || '0.00'}`}
                        </span>
                      </div>
                      {priceData?.breakdown?.formula && <p className="text-white/30 text-xs mt-1">{priceData.breakdown.formula}</p>}
                    </div>
                  </div>
                  <button onClick={handlePayAndSubmit} disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 btn-gold px-10 py-5 text-sm disabled:opacity-50"
                    data-testid="submit-pay-btn"
                  >
                    {loading ? 'Processing...' : form.service_type === 'free_tier' ? 'Submit Update' : 'Complete Payment (Mock)'}
                  </button>
                  {form.service_type !== 'free_tier' && (
                    <p className="text-white/30 text-xs text-center">PayPal integration is a placeholder. Payment will be mocked for this preview.</p>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-10 pt-6 border-t border-white/5">
            <button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}
              className="inline-flex items-center gap-2 px-6 py-3 text-white/40 text-sm font-bold uppercase tracking-wider hover:text-white disabled:opacity-20 transition-colors"
              data-testid="submit-prev-btn"
            ><ChevronLeft className="w-4 h-4" /> Back</button>
            {currentStep < steps.length - 1 && (
              <button onClick={() => setCurrentStep(currentStep + 1)} disabled={!canProceed()}
                className="inline-flex items-center gap-2 btn-gold px-8 py-3 text-sm disabled:opacity-30"
                data-testid="submit-next-btn"
              >Next <ChevronRight className="w-4 h-4" /></button>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
