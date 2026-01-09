"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import CustomButton from "@/components/shared/Button";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import { useCreateVirtualCard } from "@/api/wallet/wallet.queries";

interface GetVirtualCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  walletId: string;
  cardholderName: string;
}

type Step = "amount" | "confirmation" | "success";

const GetVirtualCardModal: React.FC<GetVirtualCardModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  walletId,
  cardholderName,
}) => {
  const [step, setStep] = useState<Step>("amount");
  const [amount, setAmount] = useState("");
  const [cardName, setCardName] = useState("");

  if (!isOpen) return null;

  const handleClose = () => {
    setStep("amount");
    onClose();
  };

  const onError = (error: any) => {
    const errorMessage = error?.response?.data?.message ?? "Something went wrong";
    ErrorToast({
      title: "Unable to create card",
      descriptions: Array.isArray(errorMessage) ? errorMessage : [errorMessage],
    });
  };

  const onCreateSuccess = (data: any) => {
    SuccessToast({
      title: "Virtual card created",
      description: data?.data?.message || "Your USD virtual card has been created",
    });

    const cardId = data?.data?.data?.cardId;
    if (cardId && typeof window !== "undefined") {
      localStorage.setItem("usdVirtualCardId", cardId);
    }

    setStep("success");
  };

  const { mutate: createCard, isPending } = useCreateVirtualCard(onError, onCreateSuccess);

  useEffect(() => {
    if (!isOpen) return;
    setStep("amount");
    setAmount("");
    setCardName("");
  }, [isOpen]);

  const handleNext = () => {
    if (step === "amount") {
      setStep("confirmation");
      return;
    }

    if (step === "confirmation") {
      createCard({
        walletId,
        currency: "USD",
        cardholderName,
      });
      return;
    }

    if (step === "success") {
      onSuccess();
    }
  };

  const renderAmount = () => (
    <div className="space-y-5">
      <div>
        <label className="text-gray-400 text-xs mb-2 block">Card Name</label>
        <input
          type="text"
          placeholder="e.g., Shopping Card"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#FF6B2C]"
        />
      </div>

      <div>
        <label className="text-gray-400 text-xs mb-2 block">Amount to Fund</label>
        <div className="flex">
          <input
            type="text"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-[#1C1C1E] border border-gray-700 border-r-0 rounded-l-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#FF6B2C]"
          />
          <span className="bg-[#2C2C2E] border border-gray-700 rounded-r-lg px-4 py-3 text-gray-400 text-sm flex items-center">
            USD
          </span>
        </div>
      </div>

      <CustomButton onClick={handleNext} className="w-full py-3">
        Next
      </CustomButton>
    </div>
  );

  const renderConfirmation = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between py-2">
          <span className="text-gray-400 text-sm">Card Name</span>
          <span className="text-white text-sm">{cardName || "Shopping Card"}</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-gray-400 text-sm">Currency</span>
          <span className="text-white text-sm">USD</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-gray-400 text-sm">Amount</span>
          <span className="text-white text-sm">
            ${amount}
          </span>
        </div>
        <div className="h-px bg-gray-800" />
        <div className="flex items-center justify-between py-2">
          <span className="text-gray-400 text-sm">Card Creation Fee</span>
          <span className="text-white text-sm">₦1,000</span>
        </div>
        <div className="h-px bg-gray-800" />
        <div className="flex items-center justify-between py-2">
          <span className="text-white text-base font-semibold">Total</span>
          <span className="text-white text-base font-semibold">
            ${parseFloat(amount || "0") + 1000}
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setStep("amount")}
          className="flex-1 py-3 rounded-lg bg-[#2C2C2E] text-white text-sm font-medium hover:bg-[#3C3C3E] transition-colors"
        >
          Back
        </button>
        <CustomButton onClick={handleNext} isLoading={isPending} className="flex-1 py-3">
          Create USD Card
        </CustomButton>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
        <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-white text-xl font-semibold mb-2">Virtual Card Created!</h3>
      <p className="text-gray-400 text-sm">Your virtual card is ready to use</p>
    </div>
  );

  const getStepTitle = () => {
    switch (step) {
      case "amount":
        return "Create Virtual Card";
      case "confirmation":
        return "Confirm Card Details";
      case "success":
        return "";
      default:
        return "";
    }
  };

  const getStepSubtitle = () => {
    switch (step) {
      case "amount":
        return "USD cards only (for now)";
      case "confirmation":
        return "Review your card details";
      default:
        return "";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} aria-hidden="true" />
      <div className="relative bg-[#0A0A0A] rounded-2xl w-full max-w-md mx-4 p-6 shadow-xl">
        {step !== "success" && (
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-white text-lg font-semibold">{getStepTitle()}</h3>
              <p className="text-gray-400 text-sm mt-1">{getStepSubtitle()}</p>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
              <IoClose className="text-2xl" />
            </button>
          </div>
        )}

        <div>
          {step === "amount" && renderAmount()}
          {step === "confirmation" && renderConfirmation()}
          {step === "success" && renderSuccess()}
        </div>
      </div>
    </div>
  );
};

export default GetVirtualCardModal;


