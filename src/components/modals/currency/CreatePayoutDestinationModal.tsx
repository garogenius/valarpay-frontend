"use client";

import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import CustomButton from "@/components/shared/Button";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import { useCreatePayoutDestination } from "@/api/currency/currency.queries";
import { ICurrencyAccount } from "@/api/currency/currency.types";

interface CreatePayoutDestinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: ICurrencyAccount;
  onSuccess: () => void;
}

const CreatePayoutDestinationModal: React.FC<CreatePayoutDestinationModalProps> = ({
  isOpen,
  onClose,
  account,
  onSuccess,
}) => {
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");

  const onError = (error: any) => {
    const errorMessage = error?.response?.data?.message ?? "Something went wrong";
    ErrorToast({
      title: "Unable to create destination",
      descriptions: Array.isArray(errorMessage) ? errorMessage : [errorMessage],
    });
  };

  const onSuccessCallback = (data: any) => {
    SuccessToast({
      title: "Destination created",
      description: data?.data?.message || "Payout destination has been created successfully",
    });
    onClose();
    setAccountName("");
    setAccountNumber("");
    setBankName("");
    onSuccess();
  };

  const { mutate: createDestination, isPending } = useCreatePayoutDestination(onError, onSuccessCallback);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!accountName.trim() || !accountNumber.trim()) {
      ErrorToast({
        title: "Validation Error",
        descriptions: ["Account name and account number are required"],
      });
      return;
    }
    createDestination({
      currency: account.currency,
      data: {
        accountName: accountName.trim(),
        accountNumber: accountNumber.trim(),
        bankName: bankName.trim() || undefined,
        type: "bank_account",
      },
    });
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
              <p className="text-white text-sm font-semibold">Add Payout Destination</p>
              <p className="text-gray-400 text-xs mt-1">Add a destination for {account.currency} payouts</p>
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
            <label className="text-gray-400 text-[11px]">Account Name *</label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="Enter account name"
              className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#FF6B2C]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-gray-400 text-[11px]">Account Number *</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Enter account number"
              className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#FF6B2C]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-gray-400 text-[11px]">Bank Name (Optional)</label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Enter bank name"
              className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#FF6B2C]"
            />
          </div>

          <CustomButton
            type="button"
            isLoading={isPending}
            disabled={isPending || !accountName.trim() || !accountNumber.trim()}
            className="w-full py-3 border-2 border-primary text-black"
            onClick={handleSubmit}
          >
            Add Destination
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default CreatePayoutDestinationModal;

