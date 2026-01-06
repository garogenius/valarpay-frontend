"use client";

import React, { useMemo, useState } from "react";
import { IoClose } from "react-icons/io5";
import CustomButton from "@/components/shared/Button";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import { useFundSavingsPlan } from "@/api/savings/savings.queries";
import { useFundEasyLifePlan } from "@/api/easylife-savings/easylife-savings.queries";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  planId: string | number;
  planType?: "target-savings" | "easylife-savings";
  currency?: string;
  availableBalance: number;
};

export default function FundSavingsPlanModal({
  isOpen,
  onClose,
  planId,
  planType = "target-savings",
  currency = "NGN",
  availableBalance,
}: Props) {
  const [amount, setAmount] = useState("");
  const [walletPin, setWalletPin] = useState("");

  const reset = () => {
    setAmount("");
    setWalletPin("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const amountNum = useMemo(() => Number(amount || 0), [amount]);
  const canSubmit = amountNum > 0 && amountNum <= Number(availableBalance || 0) && walletPin.length === 4;

  const { mutate: fundSavingsPlan, isPending: isPendingSavings } = useFundSavingsPlan(
    (e: any) => {
      const msg = e?.response?.data?.message;
      const descriptions = Array.isArray(msg) ? msg : [msg || "Unable to fund plan"];
      ErrorToast({ title: "Funding failed", descriptions });
    },
    () => {
      SuccessToast({ title: "Funded", description: "Your savings plan has been funded successfully." });
      reset();
      onClose();
    }
  );

  const { mutate: fundEasyLifePlan, isPending: isPendingEasyLife } = useFundEasyLifePlan(
    (e: any) => {
      const msg = e?.response?.data?.message;
      const descriptions = Array.isArray(msg) ? msg : [msg || "Unable to fund plan"];
      ErrorToast({ title: "Funding failed", descriptions });
    },
    () => {
      SuccessToast({ title: "Funded", description: "Your EasyLife savings plan has been funded successfully." });
      reset();
      onClose();
    }
  );

  const fundPlan = planType === "easylife-savings" ? fundEasyLifePlan : fundSavingsPlan;
  const isPending = planType === "easylife-savings" ? isPendingEasyLife : isPendingSavings;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} aria-hidden="true" />
      <div className="relative bg-[#0A0A0A] rounded-2xl w-full max-w-md p-4 sm:p-6 shadow-xl max-h-[calc(100vh-1.5rem)] sm:max-h-[90vh] overflow-y-auto my-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-white text-xl font-semibold">Fund Plan</h3>
            <p className="text-gray-500 text-sm mt-1">Top-up your savings plan</p>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
            <IoClose className="text-2xl" />
          </button>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Top-up Amount</label>
            <div className="flex items-center bg-[#1C1C1E] border border-gray-800 rounded-lg px-4 py-3">
              <span className="text-gray-400 text-sm mr-2">{currency}</span>
              <span className="text-gray-600 mr-2">|</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1 bg-transparent text-white text-sm placeholder:text-gray-600 focus:outline-none"
              />
            </div>
            <p className="text-gray-500 text-xs mt-1">Available Balance: ₦{Number(availableBalance || 0).toLocaleString()}</p>
            {amountNum > Number(availableBalance || 0) ? (
              <p className="text-xs text-red-500 mt-1">Insufficient wallet balance</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-400">Enter Transaction PIN</label>
            <div className="w-full flex items-center gap-3">
              <div className="flex-1 flex items-center bg-[#141416] border border-gray-800 rounded-lg py-3 px-4">
                <input
                  className="w-full bg-transparent border-none outline-none text-white placeholder:text-gray-600 text-sm tracking-widest"
                  placeholder="••••"
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={walletPin}
                  onChange={(e) => setWalletPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                />
              </div>
            </div>
          </div>

          <CustomButton
            type="button"
            disabled={!canSubmit}
            isLoading={isPending}
            className="w-full py-3 rounded-full text-sm"
            onClick={() => {
              if (planType === "easylife-savings") {
                fundPlan({ planId: planId.toString(), amount: amountNum, currency, walletPin });
              } else {
                fundPlan({ planId: planId.toString(), amount: amountNum, currency, walletPin });
              }
            }}
          >
            Next
          </CustomButton>
        </div>
      </div>
    </div>
  );
}














