"use client";

import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import CustomButton from "@/components/shared/Button";
import SuccessToast from "@/components/toast/SuccessToast";

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InvestmentModal: React.FC<InvestmentModalProps> = ({ isOpen, onClose }) => {
  const [note, setNote] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-[#0A0A0A] rounded-2xl w-full max-w-md mx-4 p-6 shadow-xl border border-white/10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-white text-lg font-semibold">Express Interest</h3>
            <p className="text-gray-400 text-sm mt-1">
              Share a short note and our team will reach out with next steps.
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <IoClose className="text-2xl" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-xs mb-2 block">Message (optional)</label>
            <textarea
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Tell us your preferred investment amount, timeline, or any questions..."
              className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#FF6B2C] resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg bg-[#2C2C2E] text-white text-sm font-medium hover:bg-[#3C3C3E] transition-colors"
          >
            Cancel
          </button>
          <CustomButton
            onClick={() => {
              SuccessToast({
                title: "Submitted",
                description: "Your interest has been recorded. We'll reach out soon.",
              });
              setNote("");
              onClose();
            }}
            className="flex-1 py-3 bg-[#FF6B2C] hover:bg-[#FF7A3D] text-black"
          >
            Submit
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default InvestmentModal;





