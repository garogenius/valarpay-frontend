"use client";

import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import CustomButton from "@/components/shared/Button";
import { useFundBettingWallet } from "@/api/betting/betting.queries";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import VerifyWalletPinModal from "@/components/modals/settings/VerifyWalletPinModal";
import useUserStore from "@/store/user.store";
import { useGetBettingWallet } from "@/api/betting/betting.queries";

interface FundWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const FundWalletModal: React.FC<FundWalletModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useUserStore();
  const ngnBalance = (user?.wallet || []).find((w: any) => w.currency === "NGN")?.balance || 0;
  const { data: walletData } = useGetBettingWallet();
  const bettingWallet = walletData?.data?.data;
  const [amount, setAmount] = useState("");
  const [showPinModal, setShowPinModal] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<any>(null);

  const onError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage) ? errorMessage : [errorMessage || "Failed to fund betting wallet"];
    ErrorToast({ title: "Funding Failed", descriptions });
    setShowPinModal(false);
  };

  const handleSuccess = () => {
    SuccessToast({ title: "Wallet Funded", description: "Your betting wallet has been funded successfully." });
    resetAndClose();
    onSuccess?.();
  };

  const { mutate: fundWallet, isPending: funding } = useFundBettingWallet(onError, handleSuccess);

  const resetAndClose = () => {
    setAmount("");
    setShowPinModal(false);
    setPendingPayload(null);
    onClose();
  };

  const handleFund = () => {
    const amountNum = Number(amount);
    if (!amount || amountNum <= 0) {
      ErrorToast({ title: "Validation Error", descriptions: ["Please enter a valid amount"] });
      return;
    }

    if (amountNum > ngnBalance) {
      ErrorToast({ title: "Validation Error", descriptions: ["Insufficient balance"] });
      return;
    }

    setPendingPayload({ amount: amountNum, currency: "NGN" });
    setShowPinModal(true);
  };

  const handlePinVerify = (pin: string) => {
    if (!pendingPayload) return;
    fundWallet({
      ...pendingPayload,
      walletPin: pin,
    });
    setShowPinModal(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={resetAndClose} aria-hidden="true" />
        <div className="relative bg-[#0A0A0A] rounded-2xl w-full max-w-md p-4 sm:p-6 shadow-xl max-h-[calc(100vh-1.5rem)] sm:max-h-[90vh] overflow-y-auto my-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-white text-lg sm:text-xl font-semibold">Fund Betting Wallet</h3>
              <p className="text-gray-500 text-sm mt-1">Add money to your betting wallet</p>
            </div>
            <button onClick={resetAndClose} className="text-gray-400 hover:text-white transition-colors">
              <IoClose className="text-2xl" />
            </button>
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Amount</label>
              <div className="flex items-center bg-[#1C1C1E] border border-gray-800 rounded-lg px-4 py-3">
                <span className="text-gray-400 text-sm mr-2">NGN</span>
                <span className="text-gray-600 mr-2">|</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 bg-transparent text-white text-sm placeholder:text-gray-600 focus:outline-none"
                />
              </div>
              <p className="text-gray-500 text-xs mt-1">Available Balance: ₦{Number(ngnBalance || 0).toLocaleString()}</p>
              {Number(amount) > ngnBalance && (
                <p className="text-xs text-red-500 mt-1">Insufficient balance</p>
              )}
            </div>

            <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2">
              <p className="text-white/60 text-xs">Betting Wallet Balance</p>
              <p className="text-white text-lg font-semibold">₦{Number(bettingWallet?.balance || 0).toLocaleString()}</p>
            </div>

            <div className="flex gap-3 mt-3">
              <button
                onClick={resetAndClose}
                className="flex-1 py-3 rounded-full bg-[#2C2C2E] text-white text-sm font-medium hover:bg-[#3C3C3E] transition-colors"
              >
                Cancel
              </button>
              <CustomButton
                onClick={handleFund}
                disabled={!amount || Number(amount) <= 0 || Number(amount) > ngnBalance || funding}
                isLoading={funding}
                className="flex-1 py-3 rounded-full text-sm"
              >
                Fund Wallet
              </CustomButton>
            </div>
          </div>
        </div>
      </div>

      <VerifyWalletPinModal
        isOpen={showPinModal}
        onClose={() => {
          setShowPinModal(false);
          setPendingPayload(null);
        }}
        onVerify={handlePinVerify}
      />
    </>
  );
};

export default FundWalletModal;

