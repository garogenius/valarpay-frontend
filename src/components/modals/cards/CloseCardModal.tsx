"use client";

import React, { useState } from "react";
import { CgClose } from "react-icons/cg";
import CustomButton from "@/components/shared/Button";
import { useCloseCard } from "@/api/currency/cards.queries";
import { IVirtualCard } from "@/api/currency/cards.types";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";

interface CloseCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: IVirtualCard | null;
  onSuccess?: () => void;
}

const CloseCardModal: React.FC<CloseCardModalProps> = ({ isOpen, onClose, card, onSuccess }) => {
  const [walletPin, setWalletPin] = useState("");
  const [showPinStep, setShowPinStep] = useState(false);

  const onError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage)
      ? errorMessage
      : [errorMessage || "Failed to close card"];

    ErrorToast({
      title: "Close Failed",
      descriptions,
    });
    setShowPinStep(false);
    setWalletPin("");
  };

  const onCloseSuccess = (data: any) => {
    const refundedAmount = data?.data?.data?.refundedAmount || card?.balance || 0;
    SuccessToast({
      title: "Card Closed Successfully!",
      description: `Your card has been closed. ${refundedAmount > 0 ? `$${refundedAmount.toLocaleString()} has been refunded to your wallet.` : ""}`,
    });
    setWalletPin("");
    setShowPinStep(false);
    if (onSuccess) onSuccess();
    onClose();
  };

  const { mutate: closeCard, isPending: closing } = useCloseCard(onError, onCloseSuccess);

  React.useEffect(() => {
    if (!isOpen) {
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

    closeCard({
      cardId: card.id,
      data: {
        walletPin,
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
        <h2 className="text-white text-base font-semibold mb-2">Close Card</h2>
        <p className="text-white/70 text-sm mb-4">
          This action is permanent. Your card will be closed and any remaining balance will be refunded to your wallet.
        </p>

        {!showPinStep ? (
          <>
            {card.balance > 0 && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
                <p className="text-blue-400 text-xs font-medium mb-1">Balance Refund</p>
                <p className="text-white/80 text-xs">
                  Your card balance of {card.currency} {card.balance.toLocaleString()} will be refunded to your wallet.
                </p>
              </div>
            )}
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
                disabled={walletPin.length !== 4 || closing}
                isLoading={closing}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg py-2.5"
              >
                Close Card
              </CustomButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CloseCardModal;

























