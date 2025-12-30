"use client";

import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import CustomButton from "@/components/shared/Button";
import { handleNumericKeyDown, handleNumericPaste } from "@/utils/utilityFunctions";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentPhone: string;
  onValidateSuccess: (newPhone: string) => void;
}

const ChangePhoneEnterModal: React.FC<Props> = ({ isOpen, onClose, currentPhone, onValidateSuccess }) => {
  const [phone, setPhone] = useState("");
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-md p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-white text-lg font-semibold">Enter New Phone</h3>
            <p className="text-white/60 text-sm mt-1">Current: {currentPhone || "-"}</p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <IoClose className="text-2xl" />
          </button>
        </div>

        <label className="text-white/60 text-xs mb-2 block">New Phone Number</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onKeyDown={handleNumericKeyDown}
          onPaste={handleNumericPaste}
          placeholder="08012345678"
          className="w-full bg-[#1C1C1E] border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#FF6B2C]"
          maxLength={11}
        />

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 rounded-lg bg-white/5 border border-white/10 text-white">
            Cancel
          </button>
          <CustomButton
            onClick={() => onValidateSuccess(phone)}
            disabled={phone.trim().length !== 11}
            className="flex-1 py-3 bg-[#FF6B2C] hover:bg-[#FF7A3D] text-black disabled:opacity-50"
          >
            Continue
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default ChangePhoneEnterModal;




