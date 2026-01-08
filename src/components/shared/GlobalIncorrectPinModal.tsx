"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CgClose } from "react-icons/cg";
import { FiLock, FiRefreshCw } from "react-icons/fi";
import CustomButton from "./Button";

interface GlobalIncorrectPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry?: () => void;
  attemptsRemaining?: number;
}

const GlobalIncorrectPinModal: React.FC<GlobalIncorrectPinModalProps> = ({
  isOpen,
  onClose,
  onRetry,
  attemptsRemaining,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 dark:bg-black/60"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md bg-bg-600 dark:bg-bg-1100 border border-border-800 dark:border-border-700 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 hover:bg-white/10 rounded-full transition-colors z-10"
            >
              <CgClose className="text-xl text-white" />
            </button>

            {/* Error Icon */}
            <div className="px-6 pt-8 pb-6 flex flex-col items-center bg-red-500/10">
              <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500/30 flex items-center justify-center mb-4">
                <FiLock className="text-4xl text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-red-500 mb-2">Incorrect PIN</h2>
              <p className="text-white/70 text-sm text-center">
                The wallet PIN you entered is incorrect. Please verify your PIN and try again.
              </p>
              {attemptsRemaining !== undefined && attemptsRemaining > 0 && (
                <p className="text-yellow-400 text-xs mt-2">
                  {attemptsRemaining} {attemptsRemaining === 1 ? "attempt" : "attempts"} remaining
                </p>
              )}
            </div>

            {/* Information Card */}
            <div className="px-6 py-5 bg-bg-600 dark:bg-bg-1100">
              <div className="bg-[#f76301]/10 border border-[#f76301]/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#f76301]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FiLock className="text-[#f76301] text-xs" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium mb-1">Security Reminder</p>
                    <p className="text-white/70 text-xs leading-relaxed">
                      Make sure you're entering the correct 4-digit wallet PIN. 
                      If you've forgotten your PIN, you can reset it from the settings page.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 pb-6 pt-4 flex flex-col gap-3">
              {onRetry && (
                <CustomButton
                  onClick={() => {
                    onClose();
                    onRetry();
                  }}
                  className="w-full bg-[#f76301] hover:bg-[#e55a00] text-black font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
                >
                  <FiRefreshCw className="text-base" />
                  Try Again
                </CustomButton>
              )}
              <button
                onClick={onClose}
                className="w-full px-4 py-3 rounded-lg border border-white/10 text-white hover:bg-white/5 text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GlobalIncorrectPinModal;

