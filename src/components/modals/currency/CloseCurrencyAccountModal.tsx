"use client";

import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import CustomButton from "@/components/shared/Button";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import { useCloseCurrencyAccount } from "@/api/currency/currency.queries";
import { ICurrencyAccount } from "@/api/currency/currency.types";

interface CloseCurrencyAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: ICurrencyAccount;
  onSuccess: () => void;
}

const CloseCurrencyAccountModal: React.FC<CloseCurrencyAccountModalProps> = ({
  isOpen,
  onClose,
  account,
  onSuccess,
}) => {
  const [reason, setReason] = useState("");

  const onError = (error: any) => {
    const errorMessage = error?.response?.data?.message ?? "Something went wrong";
    ErrorToast({
      title: "Unable to close account",
      descriptions: Array.isArray(errorMessage) ? errorMessage : [errorMessage],
    });
  };

  const onSuccessCallback = (data: any) => {
    SuccessToast({
      title: "Account closed",
      description: data?.data?.message || "Account has been closed successfully",
    });
    onClose();
    onSuccess();
  };

  const { mutate: closeAccount, isPending } = useCloseCurrencyAccount(onError, onSuccessCallback);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (account.balance && account.balance > 0) {
      ErrorToast({
        title: "Cannot Close Account",
        descriptions: ["Account must have zero balance to be closed"],
      });
      return;
    }
    closeAccount({ walletId: account.id, data: { reason: reason.trim() || undefined } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={isPending ? undefined : onClose} />

      <div
        className="relative w-full max-w-md bg-[#0A0A0A] rounded-2xl border border-gray-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-4 pb-4 border-b border-gray-800">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-white text-sm font-semibold">Close Account</p>
              <p className="text-gray-400 text-xs mt-1">This action cannot be undone</p>
            </div>
            <button
              onClick={onClose}
              disabled={isPending}
              className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              aria-label="Close"
            >
              <IoClose className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-5 py-5 space-y-4">
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-red-400 text-sm">
              {account.balance && account.balance > 0
                ? `You cannot close this account while it has a balance of ${account.currency} ${account.balance.toFixed(2)}. Please withdraw all funds first.`
                : "Are you sure you want to close this account? This action cannot be undone."}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-gray-400 text-[11px]">Reason (Optional)</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for closing account"
              rows={3}
              className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#FF6B2C] resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isPending}
              className="flex-1 py-3 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-50"
            >
              Cancel
            </button>
            <CustomButton
              type="button"
              isLoading={isPending}
              disabled={isPending || !!(account.balance && account.balance > 0)}
              className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
              onClick={handleSubmit}
            >
              Close Account
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloseCurrencyAccountModal;

