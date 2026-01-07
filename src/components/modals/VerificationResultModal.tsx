"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import CustomButton from "@/components/shared/Button";
import { IoClose } from "react-icons/io5";

interface VerificationResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "success" | "error";
  title: string;
  message: string | string[];
  onProceed?: () => void;
  proceedButtonText?: string;
}

const VerificationResultModal: React.FC<VerificationResultModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  onProceed,
  proceedButtonText = "OK",
}) => {
  const messages = Array.isArray(message) ? message : [message];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md bg-bg-600 dark:bg-bg-1100 rounded-xl border border-border-800 dark:border-border-700 shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <IoClose className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="flex flex-col items-center justify-center px-6 py-8 sm:py-10 gap-6">
              {/* Icon */}
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center ${
                  type === "success"
                    ? "bg-green-500/20 border-2 border-green-500"
                    : "bg-red-500/20 border-2 border-red-500"
                }`}
              >
                {type === "success" ? (
                  <svg
                    className="w-12 h-12 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-12 h-12 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </div>

              {/* Title */}
              <div className="flex flex-col items-center gap-2 text-center">
                <h2
                  className={`text-xl sm:text-2xl font-bold ${
                    type === "success" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {title}
                </h2>

                {/* Messages */}
                <div className="flex flex-col gap-2 mt-2">
                  {messages.map((msg, index) => (
                    <p
                      key={index}
                      className="text-white/70 text-sm sm:text-base max-w-sm"
                    >
                      {msg}
                    </p>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <CustomButton
                onClick={() => {
                  if (onProceed) {
                    onProceed();
                  }
                  onClose();
                }}
                className={`w-full ${
                  type === "success"
                    ? "bg-[#FF6B2C] hover:bg-[#FF7A3D]"
                    : "bg-red-500 hover:bg-red-600"
                } text-white text-base py-3.5 mt-2`}
              >
                {proceedButtonText}
              </CustomButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default VerificationResultModal;








