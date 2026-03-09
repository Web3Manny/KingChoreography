import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, ArrowRight } from 'lucide-react';

export default function SubmitConfirmed() {
  const location = useLocation();
  const submission = location.state?.submission;
  const price = location.state?.price;

  return (
    <div className="min-h-screen pt-20 flex items-center" data-testid="submit-confirmed-page">
      <div className="max-w-2xl mx-auto px-4 py-24">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="text-center mb-10">
          <div className="w-20 h-20 bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-[#D4AF37]" />
          </div>
          <h1 className="font-['Oswald'] text-4xl sm:text-5xl font-bold uppercase text-white mb-4">
            {submission?.payment_status === 'free' ? 'Update Received' : 'Submission Confirmed'}
          </h1>
          <p className="text-white/50 text-lg">
            {submission?.payment_status === 'free'
              ? 'Your video update has been received. No review will be provided for free tier submissions.'
              : 'Your submission has been received and payment processed. Brian will review your routine during your assigned review week.'
            }
          </p>
        </motion.div>

        {submission && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="bg-[#121212] border border-white/5 p-6 space-y-4 mb-8">
              <h3 className="font-['Oswald'] text-sm font-bold uppercase text-[#D4AF37]">Submission Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-white/40">Program</span><span className="text-white">{submission.gym_name}</span></div>
                <div className="flex justify-between"><span className="text-white/40">Service</span><span className="text-white capitalize">{submission.service_type?.replace('_', ' ')}</span></div>
                <div className="flex justify-between"><span className="text-white/40">Athletes</span><span className="text-white">{submission.athlete_count}</span></div>
                {submission.review_week && (
                  <div className="flex justify-between items-center">
                    <span className="text-white/40">Review Week</span>
                    <span className="inline-flex items-center gap-1 text-[#D4AF37]">
                      <Calendar className="w-3 h-3" /> Week of {new Date(submission.review_week).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="border-t border-white/10 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-[#D4AF37] font-bold">
                      {submission.payment_status === 'free' ? 'FREE' : `$${parseFloat(submission.calculated_amount).toFixed(2)}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {submission.review_week && (
              <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 p-4 mb-8">
                <p className="text-[#D4AF37] text-sm">
                  <strong>Monday Cutoff:</strong> Submissions received before Monday at 11:59 PM ET are included in the current week's review queue.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/submit" className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-wider text-sm hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors">
                Submit Another Routine
              </Link>
              <Link to="/" className="inline-flex items-center gap-2 text-white/40 text-sm hover:text-white transition-colors">
                Back to Home <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
