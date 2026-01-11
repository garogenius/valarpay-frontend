"use client";

import React, { useState, useMemo } from "react";
import { IoClose } from "react-icons/io5";
import { FiChevronDown } from "react-icons/fi";
import { cn } from "@/utils/cn";
import CustomButton from "@/components/shared/Button";
import { useFundBettingPlatform, useGetBettingPlatforms } from "@/api/betting/betting.queries";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import VerifyWalletPinModal from "@/components/modals/settings/VerifyWalletPinModal";
import useUserStore from "@/store/user.store";
import type { BettingPlatform } from "@/api/betting/betting.types";

interface FundPlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const FundPlatformModal: React.FC<FundPlatformModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useUserStore();
  const ngnBalance = (user?.wallet || []).find((w: any) => w.currency === "NGN")?.balance || 0;
  const { platforms, isPending: platformsLoading, isError: platformsError, refetch: refetchPlatforms } =
    useGetBettingPlatforms();
  
  const [selectedPlatform, setSelectedPlatform] = useState<BettingPlatform | null>(null);
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [amount, setAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [showPinModal, setShowPinModal] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<any>(null);

  const activePlatforms = useMemo(() => {
    return (platforms || []).filter((p) => p.isActive !== false);
  }, [platforms]);

  const onError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage) ? errorMessage : [errorMessage || "Failed to fund betting platform"];
    ErrorToast({ title: "Funding Failed", descriptions });
    setShowPinModal(false);
  };

  const handleSuccess = () => {
    SuccessToast({ title: "Platform Funded", description: "Your betting platform has been funded successfully." });
    resetAndClose();
    onSuccess?.();
  };

  const { mutate: fundPlatform, isPending: funding } = useFundBettingPlatform(onError, handleSuccess);

  const resetAndClose = () => {
    setSelectedPlatform(null);
    setAmount("");
    setRemark("");
    setShowPlatformDropdown(false);
    setShowPinModal(false);
    setPendingPayload(null);
    onClose();
  };

  const handleFund = () => {
    if (!selectedPlatform) {
      ErrorToast({ title: "Validation Error", descriptions: ["Please select a betting platform"] });
      return;
    }

    const amountNum = Number(amount);
    if (!amount || amountNum <= 0) {
      ErrorToast({ title: "Validation Error", descriptions: ["Please enter a valid amount"] });
      return;
    }

    const minAmount = selectedPlatform.minAmount || 0;
    const maxAmount = selectedPlatform.maxAmount;
    
    if (amountNum < minAmount) {
      ErrorToast({ title: "Validation Error", descriptions: [`Minimum amount is ₦${minAmount.toLocaleString()}`] });
      return;
    }

    if (maxAmount && amountNum > maxAmount) {
      ErrorToast({ title: "Validation Error", descriptions: [`Maximum amount is ₦${maxAmount.toLocaleString()}`] });
      return;
    }

    if (amountNum > ngnBalance) {
      ErrorToast({ title: "Validation Error", descriptions: ["Insufficient balance"] });
      return;
    }

    setPendingPayload({
      amount: amountNum,
      currency: "NGN",
      // API supports description; we keep platform selection for UX/context
      description: remark.trim() || `Funding betting wallet (${selectedPlatform.name})`,
    });
    setShowPinModal(true);
  };

  const handlePinVerify = (pin: string) => {
    if (!pendingPayload) return;
    fundPlatform({
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
              <h3 className="text-white text-lg sm:text-xl font-semibold">Fund Betting Platform</h3>
              <p className="text-gray-500 text-sm mt-1">Fund your betting account</p>
            </div>
            <button onClick={resetAndClose} className="text-gray-400 hover:text-white transition-colors">
              <IoClose className="text-2xl" />
            </button>
          </div>

          <div className="flex flex-col gap-5">
            {/* Platform Selection */}
            <div className="relative">
              <label className="text-gray-400 text-sm mb-2 block">Select Platform</label>
              <button
                onClick={() => setShowPlatformDropdown(!showPlatformDropdown)}
                className="w-full bg-[#1C1C1E] border border-gray-800 rounded-lg px-4 py-3 text-left flex items-center justify-between focus:outline-none focus:border-gray-700"
              >
                <span className={selectedPlatform ? "text-white text-sm" : "text-gray-600 text-sm"}>
                  {selectedPlatform ? selectedPlatform.name : "Select betting platform"}
                </span>
                <FiChevronDown className={cn("text-gray-500 transition-transform", showPlatformDropdown && "rotate-180")} />
              </button>
              {showPlatformDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#1C1C1E] border border-gray-800 rounded-lg overflow-hidden z-10 max-h-64 overflow-y-auto">
                  {platformsLoading ? (
                    <div className="px-4 py-3 text-center text-gray-400 text-sm">Loading platforms...</div>
                  ) : platformsError ? (
                    <div className="px-4 py-3 text-center text-gray-400 text-sm">
                      <p>Failed to load platforms</p>
                      <button
                        type="button"
                        onClick={() => refetchPlatforms()}
                        className="mt-2 text-[#FF6B2C] hover:text-[#FF7A3D] text-sm font-semibold"
                      >
                        Retry
                      </button>
                    </div>
                  ) : activePlatforms.length === 0 ? (
                    <div className="px-4 py-3 text-center text-gray-400 text-sm">No platforms available</div>
                  ) : (
                    activePlatforms.map((platform) => (
                      <button
                        key={platform.code}
                        onClick={() => {
                          setSelectedPlatform(platform);
                          setShowPlatformDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left text-white text-sm hover:bg-[#2C2C2E] transition-colors border-b border-gray-800 last:border-b-0"
                      >
                        <div className="font-medium">{platform.name}</div>
                        {platform.description && (
                          <div className="text-xs text-gray-400 mt-1">{platform.description}</div>
                        )}
                        <div className="text-xs text-gray-500 mt-1">
                          Min: ₦{platform.minAmount.toLocaleString()} • Max: ₦{platform.maxAmount.toLocaleString()}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Amount {selectedPlatform && `(Min: ₦${selectedPlatform.minAmount.toLocaleString()})`}
              </label>
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
              {selectedPlatform && (
                <p className="text-gray-500 text-xs mt-1">
                  Min: ₦{selectedPlatform.minAmount.toLocaleString()} • Max: ₦{selectedPlatform.maxAmount.toLocaleString()}
                </p>
              )}
              <p className="text-gray-500 text-xs mt-1">Available Balance: ₦{Number(ngnBalance || 0).toLocaleString()}</p>
              {Number(amount) > ngnBalance && (
                <p className="text-xs text-red-500 mt-1">Insufficient balance</p>
              )}
            </div>

            {/* Remark (Optional) */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Remark (Optional)</label>
              <input
                type="text"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Add a note"
                className="w-full bg-[#1C1C1E] border border-gray-800 rounded-lg px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-700"
              />
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
                disabled={!selectedPlatform || !amount || Number(amount) <= 0 || Number(amount) > ngnBalance || funding}
                isLoading={funding}
                className="flex-1 py-3 rounded-full text-sm"
              >
                Fund Platform
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

export default FundPlatformModal;







