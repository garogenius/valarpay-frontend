"use client";

import React from "react";
import { FaFingerprint } from "react-icons/fa";
import { useFingerprintForPayments } from "@/store/paymentPreferences.store";
import ErrorToast from "@/components/toast/ErrorToast";

interface PinInputWithFingerprintProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const PinInputWithFingerprint: React.FC<PinInputWithFingerprintProps> = ({
  value,
  onChange,
  placeholder = "••••",
  disabled = false,
}) => {
  const fingerprintEnabled = useFingerprintForPayments();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, "").slice(0, 4);
    onChange(v);
  };

  const handleFingerprintClick = () => {
    ErrorToast({
      title: "Fingerprint not available",
      descriptions: ["Fingerprint sign-in isn't enabled on web yet."],
    });
  };

  return (
    <div className="w-full flex items-center gap-3 bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg px-4 py-3.5">
      <input
        type="password"
        inputMode="numeric"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={4}
        disabled={disabled}
        className="w-full bg-transparent border-none outline-none text-white placeholder:text-white/50 text-sm tracking-widest focus:outline-none"
      />
      {fingerprintEnabled && (
        <button
          type="button"
          onClick={handleFingerprintClick}
          disabled={disabled}
          className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/15 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Use fingerprint"
        >
          <FaFingerprint className="text-white text-lg" />
        </button>
      )}
    </div>
  );
};

export default PinInputWithFingerprint;

