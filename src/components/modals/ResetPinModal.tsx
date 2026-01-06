"use client";

import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import CustomButton from "@/components/shared/Button";

interface ResetPinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResetPinModal: React.FC<ResetPinModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");

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
            <h3 className="text-white text-lg font-semibold">Reset Transaction PIN</h3>
            <p className="text-gray-400 text-sm mt-1">We'll send you a reset link to your registered email</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <IoClose className="text-2xl" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-gray-400 text-xs mb-2 block">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#FF6B2C]"
            />
          </div>
        </div>

        <CustomButton onClick={handleSubmit} className="w-full py-3">
          Send Reset Link
        </CustomButton>
      </div>
    </div>
  );
};

export default ResetPinModal;




































