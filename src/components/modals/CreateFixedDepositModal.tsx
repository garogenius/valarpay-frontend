"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useMemo, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FiChevronDown } from "react-icons/fi";
import { cn } from "@/utils/cn";
import CustomButton from "@/components/shared/Button";
import type { SavingsProduct } from "@/api/savings/savings.types";
import { useCreateSavingsPlan } from "@/api/savings/savings.queries";
import SuccessToast from "@/components/toast/SuccessToast";
import ErrorToast from "@/components/toast/ErrorToast";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  selectedProduct?: SavingsProduct | null;
  availableBalance?: number;
  onSuccess?: () => void;
};

const durationOptions = ["6 Months (17% per annum)", "9 Months (18% per annum)", "12 Months (20% per annum)"];

export default function CreateFixedDepositModal({
  isOpen,
  onClose,
  selectedProduct,
  availableBalance = 0,
  onSuccess,
}: Props) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);

  const [fundingMethod, setFundingMethod] = useState("");
  const [amountError, setAmountError] = useState<string | null>(null);

  const minAmount = Number((selectedProduct as any)?.minAmount ?? (selectedProduct as any)?.min_amount ?? 0) || 0;
  const maxAmount = Number((selectedProduct as any)?.maxAmount ?? (selectedProduct as any)?.max_amount ?? 0) || 0;
  const amountNum = useMemo(() => Number(amount || 0), [amount]);

  const amountInRange =
    !!amountNum && (minAmount ? amountNum >= minAmount : true) && (maxAmount ? amountNum <= maxAmount : true);

  const isStep1Valid = name && amount && amountInRange && duration;
  const isStep2Valid = !!fundingMethod;

  const reset = () => {
    setStep(1);
    setName("");
    setAmount("");
    setDuration("");
    setShowDurationDropdown(false);
    setFundingMethod("");
    setAmountError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const { mutate: createPlan, isPending: creatingPlan } = useCreateSavingsPlan(
    (e: any) => {
      const msg = e?.response?.data?.message;
      const descriptions = Array.isArray(msg) ? msg : [msg || "Unable to create fixed deposit"];
      ErrorToast({ title: "Create plan failed", descriptions });
    },
    () => {
      SuccessToast({ title: "Plan created", description: "Your fixed deposit has been created successfully." });
      onSuccess?.();
      handleClose();
    }
  );

  const handleNext = () => {
    if (step === 1) {
      setAmountError(null);
      setStep(2);
      return;
    }
    createPlan({
      productId: selectedProduct?.id,
      planType: selectedProduct?.type || "fixed-deposit",
      name,
      currency: selectedProduct?.currency || "NGN",
      amount: amountNum,
      targetAmount: amountNum,
      duration,
      fundingMethod,
    });
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
    else handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} aria-hidden="true" />
      <div className="relative bg-[#0A0A0A] rounded-2xl w-full max-w-md mx-4 p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-6">
          <h3 className="text-white text-xl font-semibold">Start Fixed Deposit</h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
            <IoClose className="text-2xl" />
          </button>
        </div>

        {step === 1 ? (
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter target type"
                className="w-full bg-[#1C1C1E] border border-gray-800 rounded-lg px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-700"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Amount</label>
              <div className="flex items-center bg-[#1C1C1E] border border-gray-800 rounded-lg px-4 py-3">
                <span className="text-gray-400 text-sm mr-2">NGN</span>
                <span className="text-gray-600 mr-2">|</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    const next = e.target.value;
                    setAmount(next);
                    const nextNum = Number(next || 0);
                    if (!nextNum) {
                      setAmountError(null);
                      return;
                    }
                    if (minAmount && nextNum < minAmount) {
                      setAmountError(`Minimum amount is ₦${minAmount.toLocaleString()}`);
                      return;
                    }
                    if (maxAmount && nextNum > maxAmount) {
                      setAmountError(`Maximum amount is ₦${maxAmount.toLocaleString()}`);
                      return;
                    }
                    setAmountError(null);
                  }}
                  placeholder="0.00"
                  className="flex-1 bg-transparent text-white text-sm placeholder:text-gray-600 focus:outline-none"
                />
              </div>
              {(minAmount || maxAmount) && (
                <p className="text-gray-500 text-xs mt-1">
                  {minAmount ? `Min: ₦${minAmount.toLocaleString()}` : null}
                  {minAmount && maxAmount ? " • " : null}
                  {maxAmount ? `Max: ₦${maxAmount.toLocaleString()}` : null}
                </p>
              )}
              {amountError ? <p className="text-xs text-red-500 mt-1">{amountError}</p> : null}
            </div>

            <div className="relative">
              <label className="text-gray-400 text-sm mb-2 block">Duration</label>
              <button
                onClick={() => setShowDurationDropdown(!showDurationDropdown)}
                className="w-full bg-[#1C1C1E] border border-gray-800 rounded-lg px-4 py-3 text-left flex items-center justify-between focus:outline-none focus:border-gray-700"
              >
                <span className={duration ? "text-white text-sm" : "text-gray-600 text-sm"}>
                  {duration || "Select duration"}
                </span>
                <FiChevronDown className={cn("text-gray-500 transition-transform", showDurationDropdown && "rotate-180")} />
              </button>
              {showDurationDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#1C1C1E] border border-gray-800 rounded-lg overflow-hidden z-10">
                  {durationOptions.map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        setDuration(d);
                        setShowDurationDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left text-white text-sm hover:bg-[#2C2C2E] transition-colors"
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div>
              <label className="text-gray-400 text-sm mb-3 block">Select Funding Method</label>
              <button
                onClick={() => setFundingMethod("balance")}
                className={cn(
                  "w-full text-left p-4 rounded-lg border transition-colors flex items-center justify-between",
                  fundingMethod === "balance"
                    ? "bg-[#1C1C1E] border-[#FF6B2C]"
                    : "bg-[#1C1C1E] border-gray-800 hover:border-gray-700"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2C2C2E] flex items-center justify-center">
                    <span className="text-white text-lg">₦</span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Available Balance</p>
                    <p className="text-gray-500 text-xs">₦{Number(availableBalance || 0).toLocaleString()}</p>
                  </div>
                </div>
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                    fundingMethod === "balance" ? "border-[#FF6B2C]" : "border-gray-600"
                  )}
                >
                  {fundingMethod === "balance" && <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B2C]" />}
                </div>
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleBack}
            className="flex-1 py-3 rounded-full bg-[#2C2C2E] text-white text-sm font-medium hover:bg-[#3C3C3E] transition-colors"
          >
            Back
          </button>
          <CustomButton
            onClick={handleNext}
            disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
            isLoading={creatingPlan}
            className="flex-1 py-3 rounded-full text-sm"
          >
            Next
          </CustomButton>
        </div>
      </div>
    </div>
  );
}











