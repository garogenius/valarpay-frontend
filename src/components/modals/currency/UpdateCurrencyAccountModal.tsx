"use client";

import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import CustomButton from "@/components/shared/Button";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import { useUpdateCurrencyAccount } from "@/api/currency/currency.queries";
import { ICurrencyAccount } from "@/api/currency/currency.types";

interface UpdateCurrencyAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: ICurrencyAccount;
  onSuccess: () => void;
}

const UpdateCurrencyAccountModal: React.FC<UpdateCurrencyAccountModalProps> = ({
  isOpen,
  onClose,
  account,
  onSuccess,
}) => {
  const [label, setLabel] = useState(account.label || "");

  const onError = (error: any) => {
    const errorMessage = error?.response?.data?.message ?? "Something went wrong";
    ErrorToast({
      title: "Unable to update account",
      descriptions: Array.isArray(errorMessage) ? errorMessage : [errorMessage],
    });
  };

  const onSuccessCallback = (data: any) => {
    SuccessToast({
      title: "Account updated",
      description: data?.data?.message || "Account label has been updated successfully",
    });
    onClose();
    onSuccess();
  };

  const { mutate: updateAccount, isPending } = useUpdateCurrencyAccount(onError, onSuccessCallback);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!label.trim()) {
      ErrorToast({
        title: "Validation Error",
        descriptions: ["Label cannot be empty"],
      });
      return;
    }
    updateAccount({ walletId: account.id, data: { label: label.trim() } });
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
              <p className="text-white text-sm font-semibold">Edit Account Label</p>
              <p className="text-gray-400 text-xs mt-1">Update the label for your {account.currency} account</p>
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
          <div className="space-y-2">
            <label className="text-gray-400 text-[11px]">Account Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Enter account label"
              className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#FF6B2C]"
            />
          </div>

          <CustomButton
            type="button"
            isLoading={isPending}
            disabled={isPending || !label.trim()}
            className="w-full py-3 border-2 border-primary text-black"
            onClick={handleSubmit}
          >
            Update Label
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default UpdateCurrencyAccountModal;

