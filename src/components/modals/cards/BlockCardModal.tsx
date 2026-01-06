"use client";

import React, { useState } from "react";
import { CgClose } from "react-icons/cg";
import CustomButton from "@/components/shared/Button";
import { useBlockCard } from "@/api/currency/cards.queries";
import { IVirtualCard } from "@/api/currency/cards.types";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";

interface BlockCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: IVirtualCard | null;
  onSuccess?: () => void;
}

const BlockCardModal: React.FC<BlockCardModalProps> = ({ isOpen, onClose, card, onSuccess }) => {
  const [reason, setReason] = useState("");
  const [walletPin, setWalletPin] = useState("");
  const [showPinStep, setShowPinStep] = useState(false);

  const onError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage)
      ? errorMessage
      : [errorMessage || "Failed to block card"];

    ErrorToast({
      title: "Block Failed",
      descriptions,
    });
    setShowPinStep(false);
    setWalletPin("");
  };

  const onBlockSuccess = (data: any) => {
    SuccessToast({
      title: "Card Blocked Successfully!",
      description: "Your card has been permanently blocked.",
    });
    setReason("");
    setWalletPin("");
    setShowPinStep(false);
    if (onSuccess) onSuccess();
    onClose();
  };

  const { mutate: blockCard, isPending: blocking } = useBlockCard(onError, onBlockSuccess);

  React.useEffect(() => {
    if (!isOpen) {
      setReason("");
      setWalletPin("");
      setShowPinStep(false);
    }
  }, [isOpen]);

  const handleContinue = () => {
    if (!card) {
      ErrorToast({
        title: "Error",
        descriptions: ["Card information is missing"],
      });
      return;
    }
    setShowPinStep(true);
  };

  const handleConfirm = () => {
    if (!walletPin || walletPin.length !== 4) {
      ErrorToast({
        title: "Validation Error",
        descriptions: ["Please enter a valid 4-digit PIN"],
      });
      return;
    }

    if (!card) {
      ErrorToast({
        title: "Error",
        descriptions: ["Card information is missing"],
      });
      return;
    }

    blockCard({
      cardId: card.id,
      data: {
        walletPin,
        ...(reason.trim() && { reason: reason.trim() }),
      },
    });
  };

  if (!isOpen || !card) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="relative w-full max-w-md bg-bg-600 dark:bg-bg-1100 border border-white/10 rounded-2xl p-5 z-10">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 hover:bg-white/10 rounded-full">
          <CgClose className="text-xl text-white" />
        </button>
        <h2 className="text-white text-base font-semibold mb-2">Block Card</h2>
        <p className="text-white/70 text-sm mb-4">
          This action will permanently block your card. This cannot be undone.
        </p>

        {!showPinStep ? (
          <>
            <div className="space-y-3 mb-4">
              <div className="flex flex-col gap-1">
                <label className="text-white/70 text-xs">Reason for blocking (Optional)</label>
                <textarea
                  placeholder="Tell us why you're blocking this card"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  className="w-full bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg px-3 py-2 text-white text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#FF6B2C] resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <CustomButton
                onClick={onClose}
                className="flex-1 bg-transparent border border-white/15 text-white rounded-lg py-2.5"
              >
                Cancel
              </CustomButton>
              <CustomButton
                onClick={handleContinue}
                className="flex-1 bg-[#FF6B2C] hover:bg-[#FF7A3D] text-black rounded-lg py-2.5"
              >
                Continue
              </CustomButton>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-3 mb-4">
              {reason && (
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Reason</span>
                  <span className="text-white text-sm font-medium">{reason}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-white/70 text-xs">Enter Transaction PIN</label>
              <input
                type="password"
                maxLength={4}
                value={walletPin}
                onChange={(e) => setWalletPin(e.target.value.replace(/\D/g, ""))}
                className="w-full bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-3 px-3 text-white text-sm placeholder:text-white/50 outline-none focus:ring-2 focus:ring-[#FF6B2C]"
                placeholder="••••"
              />
            </div>
            <div className="flex gap-3">
              <CustomButton
                onClick={() => setShowPinStep(false)}
                className="flex-1 bg-transparent border border-white/15 text-white rounded-lg py-2.5"
              >
                Back
              </CustomButton>
              <CustomButton
                onClick={handleConfirm}
                disabled={walletPin.length !== 4 || blocking}
                isLoading={blocking}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg py-2.5"
              >
                Block Card
              </CustomButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BlockCardModal;










