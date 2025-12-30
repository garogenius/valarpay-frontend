"use client";

import React from "react";
import { IoClose } from "react-icons/io5";

type Props = {
  isOpen: boolean;
  title?: string;
  subtitle?: string;
  onClose: () => void;
};

const ComingSoonModal: React.FC<Props> = ({
  isOpen,
  title = "Coming Soon",
  subtitle = "This service is not available yet.",
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-sm rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0A0A0A] shadow-2xl overflow-hidden">
        <div className="px-5 pt-4 pb-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#0A0A0A] dark:text-white text-sm font-semibold">{title}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{subtitle}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              aria-label="Close"
            >
              <IoClose className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-5 pb-5">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-3 rounded-full bg-[#FF6B2C] text-black font-semibold hover:bg-[#FF7A3D] transition-colors"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonModal;













