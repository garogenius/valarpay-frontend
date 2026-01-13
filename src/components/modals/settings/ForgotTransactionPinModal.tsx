"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useMemo, useState } from "react";
import { IoClose } from "react-icons/io5";
import CustomButton from "@/components/shared/Button";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import { useResetOtp, useResetPin } from "@/api/user/user.queries";
import { useQueryClient } from "@tanstack/react-query";

type Step = "request" | "reset";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotTransactionPinModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [step, setStep] = useState<Step>("request");

  const [otpCode, setOtpCode] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const canRequestOtp = true;
  const canReset = useMemo(() => {
    return /^\d{6}$/.test(otpCode) && /^\d{4}$/.test(newPin) && newPin === confirmPin;
  }, [otpCode, newPin, confirmPin]);

  useEffect(() => {
    if (!isOpen) {
      setStep("request");
      setOtpCode("");
      setNewPin("");
      setConfirmPin("");
    }
  }, [isOpen]);

  const parseErrorDescriptions = (error: any, fallback: string) => {
    const msg = error?.response?.data?.message;
    const status = error?.response?.status;
    const descriptions = Array.isArray(msg) ? msg : [msg || fallback];
    if (status === 401) {
      return ["Session expired. Please login again."];
    }
    return descriptions;
  };

  const onRequestOtpError = (error: any) => {
    ErrorToast({
      title: "OTP Request Failed",
      descriptions: parseErrorDescriptions(error, "Unable to request OTP. Please try again."),
    });
  };

  const onRequestOtpSuccess = (data: any) => {
    SuccessToast({
      title: "OTP Sent",
      description: data?.data?.message || "A verification code has been sent to your registered contact.",
    });
    setStep("reset");
  };

  const { mutate: requestOtp, isPending: requestingOtp } = useResetOtp(
    onRequestOtpError,
    onRequestOtpSuccess
  );

  const onResetPinError = (error: any) => {
    ErrorToast({
      title: "Reset Failed",
      descriptions: parseErrorDescriptions(error, "Unable to reset PIN. Please try again."),
    });
  };

  const onResetPinSuccess = () => {
    SuccessToast({
      title: "Transaction PIN Updated",
      description: "Your transaction PIN has been reset successfully.",
    });
    queryClient.invalidateQueries({ queryKey: ["user"] });
    onClose();
  };

  const { mutate: resetPin, isPending: resettingPin } = useResetPin(
    onResetPinError,
    onResetPinSuccess
  );

  const handleRequestOtp = () => {
    if (!canRequestOtp || requestingOtp || resettingPin) return;
    requestOtp(undefined as any);
  };

  const handleReset = () => {
    if (!canReset || requestingOtp || resettingPin) return;
    resetPin({
      otpCode,
      pin: newPin,
      confirmPin,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={requestingOtp || resettingPin ? undefined : onClose}
        aria-hidden="true"
      />

      <div className="relative bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-md p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-white text-lg font-semibold">Forgot Transaction PIN</h3>
            <p className="text-white/60 text-sm mt-1">
              {step === "request"
                ? "Request an OTP to reset your transaction PIN"
                : "Enter OTP and set your new PIN"}
            </p>
          </div>
          <button
            onClick={requestingOtp || resettingPin ? undefined : onClose}
            disabled={requestingOtp || resettingPin}
            className="text-white/60 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close"
          >
            <IoClose className="text-2xl" />
          </button>
        </div>

        {step === "request" ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-white/80 text-sm">
                We&apos;ll send a one-time code (OTP) to your registered contact to verify this request.
              </p>
            </div>

            <CustomButton
              onClick={handleRequestOtp}
              disabled={requestingOtp || resettingPin}
              isLoading={requestingOtp}
              className="w-full py-3 bg-[#FF6B2C] hover:bg-[#FF7A3D] text-black disabled:opacity-50"
            >
              {requestingOtp ? "Sending..." : "Send OTP"}
            </CustomButton>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="text-white/60 text-xs mb-1 block">OTP</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                disabled={requestingOtp || resettingPin}
                className="w-full bg-[#1C1C1E] border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#FF6B2C] disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={handleRequestOtp}
                disabled={requestingOtp || resettingPin}
                className="mt-2 text-xs text-[#FF6B2C] hover:underline disabled:opacity-50"
              >
                {requestingOtp ? "Resending..." : "Resend OTP"}
              </button>
            </div>

            <div>
              <label className="text-white/60 text-xs mb-1 block">New PIN</label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="Enter new 4-digit PIN"
                disabled={requestingOtp || resettingPin}
                className="w-full bg-[#1C1C1E] border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#FF6B2C] disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-white/60 text-xs mb-1 block">Confirm New PIN</label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="Confirm new PIN"
                disabled={requestingOtp || resettingPin}
                className="w-full bg-[#1C1C1E] border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#FF6B2C] disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={requestingOtp || resettingPin ? undefined : onClose}
                disabled={requestingOtp || resettingPin}
                className="flex-1 py-3 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <CustomButton
                onClick={handleReset}
                disabled={!canReset || requestingOtp || resettingPin}
                isLoading={resettingPin}
                className="flex-1 py-3 bg-[#FF6B2C] hover:bg-[#FF7A3D] text-black disabled:opacity-50"
              >
                {resettingPin ? "Resetting..." : "Reset PIN"}
              </CustomButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotTransactionPinModal;

















