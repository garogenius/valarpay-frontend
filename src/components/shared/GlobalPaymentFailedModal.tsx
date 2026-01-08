"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CgClose } from "react-icons/cg";
import { FiX, FiRefreshCw, FiAlertCircle } from "react-icons/fi";
import CustomButton from "./Button";

interface GlobalPaymentFailedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry?: () => void;
  errorMessage?: string;
  errorCode?: string;
  transactionId?: string;
}

const GlobalPaymentFailedModal: React.FC<GlobalPaymentFailedModalProps> = ({
  isOpen,
  onClose,
  onRetry,
  errorMessage,
  errorCode,
  transactionId,
}) => {
  if (!isOpen) return null;

  const displayMessage = errorMessage || "An error occurred while processing your payment. Please try again later.";

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
                <FiX className="text-4xl text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-red-500 mb-2">Payment Failed</h2>
              <p className="text-white/70 text-sm text-center">
                {displayMessage}
              </p>
            </div>

            {/* Transaction Details */}
            {(transactionId || errorCode) && (
              <div className="px-6 py-4 bg-white/5 border-y border-white/10">
                <div className="space-y-2">
                  {transactionId && (
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-xs">Transaction ID:</span>
                      <span className="text-white text-xs font-mono">{transactionId}</span>
                    </div>
                  )}
                  {errorCode && (
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-xs">Error Code:</span>
                      <span className="text-white text-xs font-mono">{errorCode}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Information Card */}
            <div className="px-6 py-5 bg-bg-600 dark:bg-bg-1100">
              <div className="bg-[#f76301]/10 border border-[#f76301]/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#f76301]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FiAlertCircle className="text-[#f76301] text-xs" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium mb-1">What to do next?</p>
                    <p className="text-white/70 text-xs leading-relaxed">
                      Please check your internet connection and try again. If the problem persists, 
                      contact our support team for assistance.
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

export default GlobalPaymentFailedModal;

