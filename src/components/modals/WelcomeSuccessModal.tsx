"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import CustomButton from "@/components/shared/Button";
import { IoClose } from "react-icons/io5";
import useUserStore from "@/store/user.store";

interface WelcomeSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeSuccessModal: React.FC<WelcomeSuccessModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useUserStore();
  const firstName = user?.fullname?.split(" ")[0] || "User";

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
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
              {/* Success Icon */}
              <div className="w-20 h-20 rounded-full bg-[#FF6B2C]/20 border-2 border-[#FF6B2C] flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-[#FF6B2C]"
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
              </div>

              {/* Welcome Message */}
              <div className="flex flex-col items-center gap-2 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Welcome, {firstName}! 🎉
                </h2>
                <p className="text-white/70 text-sm sm:text-base max-w-sm">
                  Your account has been successfully set up. You can now enjoy all the features and services we have to offer.
                </p>
              </div>

              {/* Action Button */}
              <CustomButton
                onClick={onClose}
                className="w-full bg-[#FF6B2C] hover:bg-[#FF7A3D] text-white text-base py-3.5 mt-2"
              >
                Get Started
              </CustomButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeSuccessModal;








