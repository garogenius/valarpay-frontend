"use client";

import React, { useMemo, useState } from "react";
import { IoClose } from "react-icons/io5";
import CustomButton from "@/components/shared/Button";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import { useCloseSavingsPlanAtMaturity, useCloseSavingsPlanEarly } from "@/api/savings/savings.queries";

type Mode = "maturity" | "early";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  planId: string | number;
  mode: Mode;
  currency?: string;
  principalAmount?: number;
  interestEarned?: number;
  currentAmount?: number;
};

export default function CloseSavingsPlanModal({
  isOpen,
  onClose,
  planId,
  mode,
  currency = "NGN",
  principalAmount = 0,
  interestEarned = 0,
  currentAmount = 0,
}: Props) {
  const [walletPin, setWalletPin] = useState("");

  const reset = () => setWalletPin("");
  const handleClose = () => {
    reset();
    onClose();
  };

  const penalty = useMemo(() => {
    if (mode !== "early") return 0;
    const base = Number(currentAmount || principalAmount || 0);
    return base * 0.1;
  }, [mode, currentAmount, principalAmount]);

  const totalPayout = useMemo(() => {
    if (mode === "maturity") return Number(principalAmount || 0) + Number(interestEarned || 0);
    return Math.max(0, Number(currentAmount || principalAmount || 0) - penalty);
  }, [mode, principalAmount, interestEarned, currentAmount, penalty]);

  const canSubmit = walletPin.length === 4;

  const { mutate: closeAtMaturity, isPending: closingMaturity } = useCloseSavingsPlanAtMaturity(
    (e: any) => {
      const msg = e?.response?.data?.message;
      const descriptions = Array.isArray(msg) ? msg : [msg || "Unable to close plan"];
      ErrorToast({ title: "Close failed", descriptions });
    },
    () => {
      SuccessToast({ title: "Plan closed", description: "Your savings plan has been closed successfully." });
      reset();
      onClose();
    }
  );

  const { mutate: closeEarly, isPending: closingEarly } = useCloseSavingsPlanEarly(
    (e: any) => {
      const msg = e?.response?.data?.message;
      const descriptions = Array.isArray(msg) ? msg : [msg || "Unable to close plan"];
      ErrorToast({ title: "Close failed", descriptions });
    },
    () => {
      SuccessToast({ title: "Plan closed", description: "Your savings plan has been closed successfully." });
      reset();
      onClose();
    }
  );

  const isPending = mode === "maturity" ? closingMaturity : closingEarly;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} aria-hidden="true" />
      <div className="relative bg-[#0A0A0A] rounded-2xl w-full max-w-md mx-4 p-6 shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-white text-xl font-semibold">
              {mode === "maturity" ? "Close at Maturity" : "Close Early"}
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              {mode === "maturity"
                ? "Funds will be credited to your wallet"
                : "Early closure attracts a 10% penalty and no interest payout"}
            </p>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
            <IoClose className="text-2xl" />
          </button>
        </div>

        <div className="rounded-xl bg-[#141416] border border-gray-800 p-4">
          <div className="flex items-center justify-between text-sm">
            <p className="text-gray-400">Capital</p>
            <p className="text-white font-medium">
              {currency} {Number(principalAmount || 0).toLocaleString()}
            </p>
          </div>

          {mode === "maturity" ? (
            <div className="flex items-center justify-between text-sm mt-2">
              <p className="text-gray-400">Interest</p>
              <p className="text-green-500 font-medium">
                {currency} {Number(interestEarned || 0).toLocaleString()}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between text-sm mt-2">
              <p className="text-gray-400">Penalty (10%)</p>
              <p className="text-red-500 font-medium">
                - {currency} {Number(penalty || 0).toLocaleString()}
              </p>
            </div>
          )}

          <div className="h-px bg-gray-800 my-3" />
          <div className="flex items-center justify-between">
            <p className="text-gray-300 text-sm">Total Payout</p>
            <p className="text-white font-semibold">
              {currency} {Number(totalPayout || 0).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-1">
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

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleClose}
            className="flex-1 py-3 rounded-full bg-[#2C2C2E] text-white text-sm font-medium hover:bg-[#3C3C3E] transition-colors"
          >
            Back
          </button>
          <CustomButton
            type="button"
            disabled={!canSubmit}
            isLoading={isPending}
            className="flex-1 py-3 rounded-full text-sm"
            onClick={() =>
              mode === "maturity"
                ? closeAtMaturity({ planId, walletPin })
                : closeEarly({ planId, walletPin })
            }
          >
            Next
          </CustomButton>
        </div>
      </div>
    </div>
  );
}











