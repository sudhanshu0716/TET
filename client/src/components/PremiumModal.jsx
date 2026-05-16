import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PremiumModal = ({ isOpen, user }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6">
        {/* Backdrop - High quality blur */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-sm glass-card !bg-[#0f172a]/90 !p-8 text-center space-y-6 overflow-hidden border-sky-500/40 shadow-[0_0_80px_rgba(14,165,233,0.3)]"
        >
          {/* Decorative Elements */}
          <div className="absolute -top-10 -right-10 h-32 w-32 bg-sky-500/20 blur-3xl rounded-full" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-amber-500/10 blur-3xl rounded-full" />

          <div className="relative inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-sky-500/20 text-sky-400 ring-2 ring-sky-500/30">
            <ShieldAlert size={44} />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-3xl border-2 border-dashed border-sky-500/20"
            />
          </div>

          <div className="space-y-5">
            {/* English Section */}
            <div className="space-y-1.5">
              <h2 className="text-2xl font-black text-white tracking-tight leading-tight">
                Premium Required
              </h2>
              <p className="text-slate-200 text-sm font-semibold leading-relaxed">
                Your free trial has ended. Please choose a premium plan to continue.
              </p>
            </div>
            
            <div className="h-px w-2/3 mx-auto bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />

            {/* Hindi Section */}
            <div className="space-y-1.5">
              <h2 className="text-2xl font-black text-white tracking-tight leading-tight">
                प्रीमियम आवश्यक है
              </h2>
              <p className="text-slate-200 text-sm font-semibold leading-relaxed">
                आपका फ्री ट्रायल समाप्त हो गया है। जारी रखने के लिए कृपया प्रीमियम प्लान चुनें।
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button 
              onClick={() => navigate('/profile')}
              className="premium-button w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.15em] shadow-2xl shadow-sky-500/30 active:scale-95 transition-all"
            >
              CHOOSE PLAN / प्लान चुनें
              <ArrowRight size={20} />
            </button>
          </div>

          <div className="flex flex-col items-center gap-1 pt-2 opacity-80">
            <div className="flex items-center gap-2 text-[10px] font-black text-sky-400 uppercase tracking-widest">
              <Sparkles size={12} />
              Empowering Your Success
            </div>
            <div className="text-[10px] font-black text-sky-400 uppercase tracking-widest">
              सफलता का मार्ग
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PremiumModal;
