"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import CustomButton from "@/components/shared/Button";
import { useTier2Verification } from "@/api/user/user.queries";
import SuccessToast from "@/components/toast/SuccessToast";
import ErrorToast from "@/components/toast/ErrorToast";
import { handleNumericKeyDown, handleNumericPaste } from "@/utils/utilityFunctions";

interface UpgradeTier2ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "nin" | "verifying" | "success";

const UpgradeTier2Modal: React.FC<UpgradeTier2ModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<Step>("nin");
  const [nin, setNin] = useState("");

  const handleClose = () => {
    setStep("nin");
    setNin("");
    onClose();
  };

  const onSuccess = () => {
    SuccessToast({
      title: "Upgrade Successful",
      description: "Successfully upgraded to Tier 2",
    });
    setStep("success");
    setTimeout(() => {
      handleClose();
      window.location.reload();
    }, 1500);
  };

  const onError = (error: any) => {
    const errorMessage = error?.response?.data?.message ?? "Something went wrong";
    ErrorToast({
      title: "Error upgrading tier",
      descriptions: Array.isArray(errorMessage) ? errorMessage : [errorMessage],
    });
    setStep("nin");
  };

  const { mutate: verify, isPending, isError } = useTier2Verification(onError, onSuccess);

  // When request starts, show verifying step (matches screenshot)
  useEffect(() => {
    if (isPending) setStep("verifying");
  }, [isPending]);

  const canNextNin = nin.length === 11;
  const progressPct = 40;

  const modalTitle = useMemo(() => {
    if (step === "verifying") return "Upgrade to Tier 2";
    if (step === "success") return "Success";
    return "Upgrade to Tier 2";
  }, [step]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={step === "verifying" ? undefined : handleClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 8 }}
          className="relative w-full max-w-md bg-[#0A0A0A] rounded-2xl border border-gray-800 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-5 pt-4 pb-4 border-b border-gray-800">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-white text-sm font-semibold">{modalTitle}</p>
                {step !== "success" ? (
                  <p className="text-gray-400 text-xs mt-1">Complete the following requirements to upgrade your account</p>
                ) : null}
              </div>
              <button
                onClick={handleClose}
                disabled={step === "verifying" || isPending}
                className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                aria-label="Close"
              >
                <IoClose className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="px-5 py-5">
            {/* Step 1: NIN */}
            {step === "nin" ? (
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xs mt-0.5">
                    i
                  </div>
                  <p className="text-green-400 text-xs leading-relaxed">
                    To get your National Identification Number (NIN), dial *346# on your registered mobile line
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-gray-400 text-[11px]">NIN</p>
                  <input
                    value={nin}
                    onChange={(e) => setNin(e.target.value.replace(/\D/g, "").slice(0, 11))}
                    onKeyDown={handleNumericKeyDown}
                    onPaste={handleNumericPaste}
                    maxLength={11}
                    placeholder="Enter NIN number"
                    className="w-full bg-[#141416] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none"
                    inputMode="numeric"
                  />
                </div>

                <CustomButton
                  type="button"
                  disabled={!canNextNin || isPending}
                  onClick={() => verify({ nin })}
                  className="w-full py-3 border-2 border-primary text-black"
                >
                  Next
                </CustomButton>
              </div>
            ) : null}

            {/* Step 3: Verifying */}
            {step === "verifying" ? (
              <div className="space-y-5">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xs mt-0.5">
                    i
                  </div>
                  <p className="text-green-400 text-xs leading-relaxed">
                    To get your National Identification Number (NIN), dial *346# on your registered mobile line
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center text-center">
                  <p className="text-gray-400 text-xs">Verifying NIN</p>
                  <p className="text-white text-2xl font-semibold mt-1">{progressPct}%</p>
                </div>

                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-[#7CFF9A] rounded-full" style={{ width: `${progressPct}%` }} />
                </div>
                <div className="w-full h-1 rounded-full bg-white/5" />
              </div>
            ) : null}

            {/* Step 4: Success */}
            {step === "success" ? (
              <div className="py-6 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                  <span className="text-green-500 text-2xl">✓</span>
                </div>
                <p className="text-white text-base font-semibold mt-4">Upgrade Successful!</p>
                <p className="text-gray-400 text-sm mt-1">You have been upgraded to Tier 2</p>
              </div>
            ) : null}

            {/* Fallback */}
            {!["nin", "verifying", "success"].includes(step) || isError ? null : null}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UpgradeTier2Modal;


