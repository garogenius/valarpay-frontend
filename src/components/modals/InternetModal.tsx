"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import InternetSteps from "@/components/user/bill/internet/InternetSteps";

interface InternetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InternetModal: React.FC<InternetModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md bg-[#0A0A0A] rounded-2xl border border-gray-800 shadow-2xl overflow-visible flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <InternetSteps onClose={onClose} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default InternetModal;

