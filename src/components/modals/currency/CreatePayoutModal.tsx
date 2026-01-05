"use client";

import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import CustomButton from "@/components/shared/Button";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import { useCreatePayout } from "@/api/currency/currency.queries";
import { ICurrencyAccount } from "@/api/currency/currency.types";
import VerifyWalletPinModal from "@/components/modals/settings/VerifyWalletPinModal";

interface CreatePayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: ICurrencyAccount;
  destinations: any[];
  onSuccess: () => void;
}

const CreatePayoutModal: React.FC<CreatePayoutModalProps> = ({
  isOpen,
  onClose,
  account,
  destinations,
  onSuccess,
}) => {
  const [selectedDestination, setSelectedDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [openPinModal, setOpenPinModal] = useState(false);
  const [pin, setPin] = useState("");

  const onError = (error: any) => {
    const errorMessage = error?.response?.data?.message ?? "Something went wrong";
    ErrorToast({
      title: "Unable to create payout",
      descriptions: Array.isArray(errorMessage) ? errorMessage : [errorMessage],
    });
    setOpenPinModal(false);
    setPin("");
  };

  const onSuccessCallback = (data: any) => {
    SuccessToast({
      title: "Payout created",
      description: data?.data?.message || "Payout has been created successfully",
    });
    onClose();
    setSelectedDestination("");
    setAmount("");
    setDescription("");
    setPin("");
    onSuccess();
  };

  const { mutate: createPayout, isPending } = useCreatePayout(onError, onSuccessCallback);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!selectedDestination) {
      ErrorToast({
        title: "Validation Error",
        descriptions: ["Please select a payout destination"],
      });
      return;
    }
    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0) {
      ErrorToast({
        title: "Validation Error",
        descriptions: ["Please enter a valid amount"],
      });
      return;
    }
    if (account.balance && amountNum > account.balance) {
      ErrorToast({
        title: "Insufficient Balance",
        descriptions: [`Insufficient balance. Available: ${account.currency} ${account.balance.toFixed(2)}`],
      });
      return;
    }
    setOpenPinModal(true);
  };

  const handlePinVerified = () => {
    const amountNum = parseFloat(amount);
    createPayout({
      currency: account.currency,
      data: {
        destinationId: selectedDestination,
        amount: amountNum,
        description: description.trim() || undefined,
        walletPin: pin,
      },
    });
    setPin("");
    setOpenPinModal(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={isPending ? undefined : onClose} />

        <div
          className="relative w-full max-w-md bg-[#0A0A0A] rounded-2xl border border-gray-800 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-5 pt-4 pb-4 border-b border-gray-800">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-white text-sm font-semibold">Create Payout</p>
                <p className="text-gray-400 text-xs mt-1">Send {account.currency} to a payout destination</p>
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
              <label className="text-gray-400 text-[11px]">Payout Destination *</label>
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF6B2C] appearance-none"
              >
                <option value="" className="text-gray-500">
                  Select destination
                </option>
                {destinations.map((dest) => (
                  <option key={dest.id} value={dest.id} className="text-white">
                    {dest.account_name} - {dest.account_number}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-gray-400 text-[11px]">Amount *</label>
              <div className="flex">
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d.]/g, "");
                    setAmount(value);
                  }}
                  placeholder="0.00"
                  className="w-full bg-[#1C1C1E] border border-gray-700 border-r-0 rounded-l-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#FF6B2C]"
                />
                <span className="bg-[#FF6B2C] rounded-r-lg px-4 py-3 text-white text-sm font-medium flex items-center">
                  {account.currency}
                </span>
              </div>
              {account.balance !== undefined && (
                <p className="text-white/60 text-xs">Available: {account.currency} {account.balance.toFixed(2)}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-gray-400 text-[11px]">Description (Optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                rows={3}
                className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#FF6B2C] resize-none"
              />
            </div>

            <CustomButton
              type="button"
              isLoading={isPending}
              disabled={isPending || !selectedDestination || !amount || parseFloat(amount) <= 0}
              className="w-full py-3 border-2 border-primary text-black"
              onClick={handleSubmit}
            >
              Create Payout
            </CustomButton>
          </div>
        </div>
      </div>

      <VerifyWalletPinModal
        isOpen={openPinModal}
        onClose={() => {
          setOpenPinModal(false);
          setPin("");
        }}
        onVerify={handlePinVerified}
      />
    </>
  );
};

export default CreatePayoutModal;

