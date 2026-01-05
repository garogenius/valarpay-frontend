"use client";

import React from "react";
import { CgClose } from "react-icons/cg";
import { FiAlertCircle } from "react-icons/fi";
import CustomButton from "@/components/shared/Button";

interface ValidationErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  descriptions: string[];
}

const ValidationErrorModal: React.FC<ValidationErrorModalProps> = ({
  isOpen,
  onClose,
  title,
  descriptions,
}) => {
  if (!isOpen) return null;

  return (
    <div className="z-[999999] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 flex justify-center items-center w-full md:inset-0 h-[100dvh]">
      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
        <div className="absolute inset-0 bg-black/80 dark:bg-black/60" onClick={onClose} />
      </div>
      <div className="relative mx-4 bg-bg-600 dark:bg-bg-1100 border border-border-800 dark:border-border-700 w-full max-w-md rounded-2xl overflow-visible">
        <div className="flex items-center justify-between p-4 pb-2">
          <div>
            <h2 className="text-white text-lg font-semibold">Validation Error</h2>
            <p className="text-white/60 text-sm">Please review the errors below</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded transition-colors">
            <CgClose className="text-xl text-white/70" />
          </button>
        </div>

        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          {/* Error Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
              <FiAlertCircle className="text-red-500 text-3xl" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{title}</h3>
          </div>

          {/* Error Descriptions */}
          {descriptions && descriptions.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
              <ul className="space-y-2.5">
                {descriptions.map((description, index) => (
                  <li key={index} className="text-white/90 text-sm leading-relaxed flex items-start gap-2.5">
                    <span className="text-red-500 mt-1.5 flex-shrink-0">•</span>
                    <span className="flex-1">{description}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Close Button */}
          <CustomButton
            onClick={onClose}
            className="w-full bg-[#f76301] hover:bg-[#e55a00] text-black font-medium py-3 rounded-lg"
          >
            Close
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default ValidationErrorModal;

