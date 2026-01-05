"use client";

import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import CustomButton from "@/components/shared/Button";
import { handleNumericKeyDown, handleNumericPaste } from "@/utils/utilityFunctions";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (pin: string) => void;
}

const VerifyWalletPinModal: React.FC<Props> = ({ isOpen, onClose, onVerify }) => {
  const [pin, setPin] = useState("");

  useEffect(() => {
    return () => {
      // Clear sensitive value on unmount
      setPin("");
    };
  }, []);

  if (!isOpen) return null;

  const closeAndClear = () => {
    setPin("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={closeAndClear} aria-hidden="true" />
      <div className="relative bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-md p-4 sm:p-6 max-h-[calc(100vh-1.5rem)] sm:max-h-[90vh] overflow-y-auto my-auto">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-white text-lg font-semibold">Verify Transaction PIN</h3>
            <p className="text-white/60 text-sm mt-1">Enter your 4-digit PIN to continue.</p>
          </div>
          <button onClick={closeAndClear} className="text-white/60 hover:text-white">
            <IoClose className="text-2xl" />
          </button>
        </div>

        <input
          type="password"
          inputMode="numeric"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          onKeyDown={handleNumericKeyDown}
          onPaste={handleNumericPaste}
          placeholder="****"
          maxLength={4}
          className="w-full bg-[#1C1C1E] border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#FF6B2C]"
        />

        <div className="flex gap-3 mt-6">
          <button onClick={closeAndClear} className="flex-1 py-3 rounded-lg bg-white/5 border border-white/10 text-white">
            Cancel
          </button>
          <CustomButton
            onClick={() => {
              const p = pin;
              setPin("");
              onVerify(p);
            }}
            disabled={pin.length !== 4}
            className="flex-1 py-3 bg-[#FF6B2C] hover:bg-[#FF7A3D] text-black disabled:opacity-50"
          >
            Verify
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default VerifyWalletPinModal;



