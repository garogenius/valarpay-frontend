"use client";

import React from "react";
import { IoClose } from "react-icons/io5";
import CustomButton from "@/components/shared/Button";

interface ConfirmActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
  confirmTone?: "primary" | "danger";
  isLoading?: boolean;
}

const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  confirmTone = "primary",
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-[#0A0A0A] rounded-2xl w-full max-w-md mx-4 p-6 shadow-xl border border-white/10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-white text-lg font-semibold">{title}</h3>
            <p className="text-gray-400 text-sm mt-1">{description}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <IoClose className="text-2xl" />
          </button>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg bg-[#2C2C2E] text-white text-sm font-medium hover:bg-[#3C3C3E] transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <CustomButton
            onClick={onConfirm}
            isLoading={isLoading}
            className={
              confirmTone === "danger"
                ? "flex-1 py-3 bg-red-500 hover:bg-red-600"
                : "flex-1 py-3 bg-[#FF6B2C] hover:bg-[#FF7A3D] text-black"
            }
          >
            {confirmText}
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default ConfirmActionModal;





