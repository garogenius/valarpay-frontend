"use client";

import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import CustomButton from "@/components/shared/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onSubmit: (code: string) => void;
}

const VerifyEmailModal: React.FC<Props> = ({ isOpen, onClose, email, onSubmit }) => {
  const [code, setCode] = useState("");
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-md p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-white text-lg font-semibold">Verify Email</h3>
            <p className="text-white/60 text-sm mt-1">Enter the code sent to {email}</p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <IoClose className="text-2xl" />
          </button>
        </div>

        <label className="text-white/60 text-xs mb-2 block">Verification Code</label>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="123456"
          className="w-full bg-[#1C1C1E] border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#FF6B2C]"
        />

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 rounded-lg bg-white/5 border border-white/10 text-white">
            Cancel
          </button>
          <CustomButton
            onClick={() => onSubmit(code)}
            disabled={!code.trim()}
            className="flex-1 py-3 bg-[#FF6B2C] hover:bg-[#FF7A3D] text-black disabled:opacity-50"
          >
            Verify
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailModal;





