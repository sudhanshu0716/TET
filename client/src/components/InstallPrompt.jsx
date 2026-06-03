import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Don't show in Capacitor native app
    if (window.Capacitor) return;

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if user dismissed recently
    const dismissed = localStorage.getItem('pwa_install_dismissed');
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      // Don't show again for 7 days
      if (Date.now() - dismissedAt < 7 * 24 * 60 * 60 * 1000) return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Small delay so the app loads first
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa_install_dismissed', Date.now().toString());
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-24 left-4 right-4 z-[9999] max-w-md mx-auto"
        >
          <div className="glass-card !rounded-2xl !p-4 relative overflow-hidden border border-sky-500/20 shadow-2xl shadow-sky-500/10">
            {/* Glow effect */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-sky-500/20 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none" />
            
            <div className="relative z-10 flex items-start gap-3">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
                <Smartphone size={22} className="text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-black text-[var(--text-primary)] leading-tight">Install TET Prep</h4>
                <p className="text-[11px] text-[var(--text-secondary)] font-medium mt-0.5 leading-snug">
                  Add to home screen for offline access & faster experience
                </p>
                
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={handleInstall}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-[11px] font-black uppercase tracking-wider shadow-lg shadow-sky-500/20 active:scale-95 transition-transform cursor-pointer"
                  >
                    <Download size={14} />
                    Install
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="px-3 py-2 rounded-xl text-[11px] font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                  >
                    Not now
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleDismiss}
                className="w-7 h-7 shrink-0 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={14} className="text-[var(--text-secondary)]" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallPrompt;
