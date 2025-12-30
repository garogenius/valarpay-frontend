"use client";

import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { MdBlock } from "react-icons/md";
import CustomButton from "@/components/shared/Button";

interface BlockCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BlockCardModal: React.FC<BlockCardModalProps> = ({ isOpen, onClose }) => {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-[#0A0A0A] rounded-2xl w-full max-w-md mx-4 p-6 shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-white text-lg font-semibold">Block Card</h3>
            <p className="text-gray-400 text-sm mt-1">
              This action will permanently block your card
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <IoClose className="text-2xl" />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center py-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <MdBlock className="text-4xl text-red-500" />
          </div>
          <p className="text-center text-gray-300 text-sm leading-relaxed">
            Are you sure you want to block this card? This action cannot be undone and you will need to request a new
            card.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-gray-400 text-xs mb-2 block">Reason for blocking (Optional)</label>
            <textarea
              placeholder="Tell us why you're blocking this card"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#FF6B2C] resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg bg-[#2C2C2E] text-white text-sm font-medium hover:bg-[#3C3C3E] transition-colors"
          >
            Cancel
          </button>
          <CustomButton onClick={handleSubmit} className="flex-1 py-3 bg-red-500 hover:bg-red-600">
            Block Card
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default BlockCardModal;

















