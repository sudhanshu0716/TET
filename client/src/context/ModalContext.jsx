import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, HelpCircle, Info } from 'lucide-react';
import { useTheme } from './ThemeContext';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const { uiVersion } = useTheme();
  const [modalConfig, setModalConfig] = useState(null);

  const showAlert = (message, title = 'Alert') => {
    return new Promise((resolve) => {
      setModalConfig({
        type: 'alert',
        title,
        message,
        resolve
      });
    });
  };

  const showConfirm = (message, title = 'Confirm', options = {}) => {
    return new Promise((resolve) => {
      setModalConfig({
        type: 'confirm',
        title,
        message,
        resolve,
        confirmText: options.confirmText || 'OK',
        cancelText: options.cancelText || 'Cancel'
      });
    });
  };

  const handleConfirm = () => {
    if (modalConfig) {
      modalConfig.resolve(true);
      setModalConfig(null);
    }
  };

  const handleCancel = () => {
    if (modalConfig) {
      modalConfig.resolve(false);
      setModalConfig(null);
    }
  };

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm }}>
      {children}

      <AnimatePresence>
        {modalConfig && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 pointer-events-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={modalConfig.type === 'confirm' ? undefined : handleConfirm}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.9, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 15, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="glass-card w-full max-w-sm relative z-10 flex flex-col items-center text-center p-6 space-y-4"
            >
              {/* Header Icon */}
              <div className="flex items-center justify-center">
                {modalConfig.type === 'alert' ? (
                  <div className={`p-3 rounded-2xl ${
                    uiVersion === 'v3' 
                      ? 'border-2 border-dashed border-yellow-500/30 text-yellow-500' 
                      : 'bg-yellow-500/10 text-yellow-400'
                  }`}>
                    <AlertTriangle size={28} />
                  </div>
                ) : (
                  <div className={`p-3 rounded-2xl ${
                    uiVersion === 'v3' 
                      ? 'border-2 border-dashed border-sky-500/30 text-sky-400' 
                      : 'bg-sky-500/10 text-sky-400'
                  }`}>
                    <HelpCircle size={28} />
                  </div>
                )}
              </div>

              {/* Title & Message */}
              <div className="space-y-1">
                <h3 className="text-lg font-black text-[var(--text-primary)]">
                  {modalConfig.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] font-semibold leading-relaxed max-h-[40vh] overflow-y-auto px-1">
                  {modalConfig.message}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex w-full gap-3 pt-2">
                {modalConfig.type === 'confirm' && (
                  <button
                    onClick={handleCancel}
                    className="flex-1 py-3 px-4 rounded-xl font-black text-xs bg-white/5 border border-[var(--glass-border)] text-[var(--text-secondary)] hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                  >
                    {modalConfig.cancelText}
                  </button>
                )}
                <button
                  onClick={handleConfirm}
                  className="premium-button flex-1 py-3 px-4 rounded-xl font-black text-xs active:scale-95 transition-all cursor-pointer"
                >
                  {modalConfig.type === 'confirm' ? modalConfig.confirmText : 'OK'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ModalContext.Provider>
  );
};

export const useCustomModal = () => useContext(ModalContext);
