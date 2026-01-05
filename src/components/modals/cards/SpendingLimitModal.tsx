"use client";

import React from "react";
import { CgClose } from "react-icons/cg";
import CustomButton from "@/components/shared/Button";
import { useSetCardLimits } from "@/api/currency/cards.queries";
import { IVirtualCard } from "@/api/currency/cards.types";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";

interface SpendingLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: IVirtualCard | null;
  onSuccess?: () => void;
}

const SpendingLimitModal: React.FC<SpendingLimitModalProps> = ({ isOpen, onClose, card, onSuccess }) => {
  const [dailyLimit, setDailyLimit] = React.useState("");
  const [monthlyLimit, setMonthlyLimit] = React.useState("");
  const [transactionLimit, setTransactionLimit] = React.useState("");
  const [walletPin, setWalletPin] = React.useState("");
  const [showPinStep, setShowPinStep] = React.useState(false);

  const onError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage)
      ? errorMessage
      : [errorMessage || "Failed to set card limits"];

    ErrorToast({
      title: "Action Failed",
      descriptions,
    });
  };

  const onSetLimitsSuccess = () => {
    SuccessToast({
      title: "Limits Updated!",
      description: "Card spending limits have been updated successfully.",
    });
    setDailyLimit("");
    setMonthlyLimit("");
    setTransactionLimit("");
    setWalletPin("");
    setShowPinStep(false);
    if (onSuccess) onSuccess();
    onClose();
  };

  const { mutate: setLimits, isPending: setting } = useSetCardLimits(onError, onSetLimitsSuccess);

  React.useEffect(() => {
    if (isOpen && card) {
      setDailyLimit(card.dailyLimit?.toString() || "");
      setMonthlyLimit(card.monthlyLimit?.toString() || "");
      setTransactionLimit(card.transactionLimit?.toString() || "");
    } else if (isOpen) {
      setDailyLimit("");
      setMonthlyLimit("");
      setTransactionLimit("");
    }
    setWalletPin("");
    setShowPinStep(false);
  }, [isOpen, card]);

  const handleContinue = () => {
    if (!card) {
      ErrorToast({
        title: "Error",
        descriptions: ["Card information is missing"],
      });
      return;
    }

    const limits: any = {};
    if (dailyLimit && Number(dailyLimit) > 0) {
      limits.dailyLimit = Number(dailyLimit);
    }
    if (monthlyLimit && Number(monthlyLimit) > 0) {
      limits.monthlyLimit = Number(monthlyLimit);
    }
    if (transactionLimit && Number(transactionLimit) > 0) {
      limits.transactionLimit = Number(transactionLimit);
    }

    if (Object.keys(limits).length === 0) {
      ErrorToast({
        title: "Validation Error",
        descriptions: ["Please enter at least one limit"],
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

    const limits: any = { walletPin };
    if (dailyLimit && Number(dailyLimit) > 0) {
      limits.dailyLimit = Number(dailyLimit);
    }
    if (monthlyLimit && Number(monthlyLimit) > 0) {
      limits.monthlyLimit = Number(monthlyLimit);
    }
    if (transactionLimit && Number(transactionLimit) > 0) {
      limits.transactionLimit = Number(transactionLimit);
    }

    setLimits({
      cardId: card.id,
      data: limits,
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
        <h2 className="text-white text-base font-semibold mb-4">Set Spending Limits</h2>
        {!showPinStep ? (
          <>
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-white/70 text-xs">Daily Limit ({card.currency})</label>
                <input
                  type="number"
                  value={dailyLimit}
                  onChange={(e) => setDailyLimit(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter daily limit"
                  className="w-full rounded-lg border border-white/10 bg-bg-2400 dark:bg-bg-2100 text-white placeholder-white/50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF6B2C]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-white/70 text-xs">Monthly Limit ({card.currency})</label>
                <input
                  type="number"
                  value={monthlyLimit}
                  onChange={(e) => setMonthlyLimit(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter monthly limit"
                  className="w-full rounded-lg border border-white/10 bg-bg-2400 dark:bg-bg-2100 text-white placeholder-white/50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF6B2C]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-white/70 text-xs">Transaction Limit ({card.currency})</label>
                <input
                  type="number"
                  value={transactionLimit}
                  onChange={(e) => setTransactionLimit(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter transaction limit"
                  className="w-full rounded-lg border border-white/10 bg-bg-2400 dark:bg-bg-2100 text-white placeholder-white/50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF6B2C]"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
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
              {dailyLimit && (
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Daily Limit</span>
                  <span className="text-white text-sm font-medium">{card.currency} {Number(dailyLimit).toLocaleString()}</span>
                </div>
              )}
              {monthlyLimit && (
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Monthly Limit</span>
                  <span className="text-white text-sm font-medium">{card.currency} {Number(monthlyLimit).toLocaleString()}</span>
                </div>
              )}
              {transactionLimit && (
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Transaction Limit</span>
                  <span className="text-white text-sm font-medium">{card.currency} {Number(transactionLimit).toLocaleString()}</span>
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
            <div className="flex gap-3 mt-2">
              <CustomButton
                onClick={() => setShowPinStep(false)}
                className="flex-1 bg-transparent border border-white/15 text-white rounded-lg py-2.5"
              >
                Back
              </CustomButton>
              <CustomButton
                onClick={handleConfirm}
                disabled={walletPin.length !== 4 || setting}
                isLoading={setting}
                className="flex-1 bg-[#FF6B2C] hover:bg-[#FF7A3D] text-black rounded-lg py-2.5"
              >
                Confirm
              </CustomButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SpendingLimitModal;

