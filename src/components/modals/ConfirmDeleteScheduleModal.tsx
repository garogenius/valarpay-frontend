"use client";

import React from "react";
import { IoClose } from "react-icons/io5";

type Props = {
  isOpen: boolean;
  title?: string;
  subtitle?: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
};

const ConfirmDeleteScheduleModal: React.FC<Props> = ({
  isOpen,
  title = "Delete schedule",
  subtitle = "Are you sure you want to delete this scheduled payment?",
  onClose,
  onConfirm,
  confirmLabel = "Delete",
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
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-full bg-[#2C2C2E] text-white hover:bg-[#353539] transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 px-4 py-3 rounded-full bg-[#FF6B2C] text-black font-semibold hover:bg-[#FF7A3D] transition-colors"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteScheduleModal;
































