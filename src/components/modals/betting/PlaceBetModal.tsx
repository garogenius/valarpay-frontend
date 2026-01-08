"use client";

import React, { useState, useMemo } from "react";
import { IoClose } from "react-icons/io5";
import CustomButton from "@/components/shared/Button";
import { usePlaceBet, useGetBettingPlatforms, useGetBettingWallet } from "@/api/betting/betting.queries";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import VerifyWalletPinModal from "@/components/modals/settings/VerifyWalletPinModal";
import type { BettingPlatform } from "@/api/betting/betting.types";

interface PlaceBetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const PlaceBetModal: React.FC<PlaceBetModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { data: walletData } = useGetBettingWallet();
  const bettingWallet = walletData?.data?.data;
  const bettingBalance = bettingWallet?.balance || 0;
  
  const { platforms, isPending: platformsLoading } = useGetBettingPlatforms();
  
  const [selectedPlatform, setSelectedPlatform] = useState<BettingPlatform | null>(null);
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [amount, setAmount] = useState("");
  const [odds, setOdds] = useState("");
  const [description, setDescription] = useState("");
  const [showPinModal, setShowPinModal] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<any>(null);

  const activePlatforms = useMemo(() => {
    return (platforms || []).filter((p) => p.isActive !== false);
  }, [platforms]);

  const amountNum = useMemo(() => Number(amount) || 0, [amount]);
  const oddsNum = useMemo(() => Number(odds) || 0, [odds]);
  const potentialWinnings = useMemo(() => {
    if (amountNum > 0 && oddsNum > 0) {
      return amountNum * oddsNum;
    }
    return 0;
  }, [amountNum, oddsNum]);

  const onError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage) ? errorMessage : [errorMessage || "Failed to place bet"];
    ErrorToast({ title: "Bet Failed", descriptions });
    setShowPinModal(false);
  };

  const handleSuccess = () => {
    SuccessToast({ title: "Bet Placed", description: "Your bet has been placed successfully." });
    resetAndClose();
    onSuccess?.();
  };

  const { mutate: placeBet, isPending: placing } = usePlaceBet(onError, handleSuccess);

  const resetAndClose = () => {
    setSelectedPlatform(null);
    setAmount("");
    setOdds("");
    setDescription("");
    setShowPlatformDropdown(false);
    setShowPinModal(false);
    setPendingPayload(null);
    onClose();
  };

  const handlePlaceBet = () => {
    if (!selectedPlatform) {
      ErrorToast({ title: "Validation Error", descriptions: ["Please select a betting platform"] });
      return;
    }

    if (!amount || amountNum <= 0) {
      ErrorToast({ title: "Validation Error", descriptions: ["Please enter a valid bet amount"] });
      return;
    }

    if (amountNum < 100) {
      ErrorToast({ title: "Validation Error", descriptions: ["Minimum bet amount is ₦100"] });
      return;
    }

    if (amountNum > bettingBalance) {
      ErrorToast({ title: "Validation Error", descriptions: ["Insufficient betting wallet balance"] });
      return;
    }

    if (!odds || oddsNum <= 0) {
      ErrorToast({ title: "Validation Error", descriptions: ["Please enter valid odds"] });
      return;
    }

    if (oddsNum < 1) {
      ErrorToast({ title: "Validation Error", descriptions: ["Odds must be at least 1.0"] });
      return;
    }

    setPendingPayload({
      amount: amountNum,
      currency: "NGN",
      betType: "SINGLE",
      odds: oddsNum,
      description: description.trim() || undefined,
    });
    setShowPinModal(true);
  };

  const handlePinVerify = (pin: string) => {
    if (!pendingPayload) return;
    placeBet({
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
              <h3 className="text-white text-lg sm:text-xl font-semibold">Place Bet</h3>
              <p className="text-gray-500 text-sm mt-1">Place a bet using your betting wallet</p>
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
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform ${showPlatformDropdown ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showPlatformDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#1C1C1E] border border-gray-800 rounded-lg overflow-hidden z-10 max-h-64 overflow-y-auto">
                  {platformsLoading ? (
                    <div className="px-4 py-3 text-center text-gray-400 text-sm">Loading platforms...</div>
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
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Bet Amount */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Bet Amount (Min: ₦100)</label>
              <div className="flex items-center bg-[#1C1C1E] border border-gray-800 rounded-lg px-4 py-3">
                <span className="text-gray-400 text-sm mr-2">NGN</span>
                <span className="text-gray-600 mr-2">|</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setAmount(val);
                  }}
                  placeholder="0.00"
                  min="100"
                  className="flex-1 bg-transparent text-white text-sm placeholder:text-gray-600 focus:outline-none"
                />
              </div>
              <p className="text-gray-500 text-xs mt-1">Betting Wallet Balance: ₦{Number(bettingBalance || 0).toLocaleString()}</p>
              {amountNum > bettingBalance && (
                <p className="text-xs text-red-500 mt-1">Insufficient balance</p>
              )}
              {amountNum > 0 && amountNum < 100 && (
                <p className="text-xs text-red-500 mt-1">Minimum bet amount is ₦100</p>
              )}
            </div>

            {/* Odds */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Odds</label>
              <input
                type="number"
                value={odds}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^\d.]/g, "");
                  // Allow decimals like 2.5, 1.5, etc.
                  if (val === "" || (!isNaN(Number(val)) && Number(val) >= 1)) {
                    setOdds(val);
                  }
                }}
                placeholder="e.g., 2.5"
                min="1"
                step="0.1"
                className="w-full bg-[#1C1C1E] border border-gray-800 rounded-lg px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-700"
              />
              {oddsNum > 0 && oddsNum < 1 && (
                <p className="text-xs text-red-500 mt-1">Odds must be at least 1.0</p>
              )}
            </div>

            {/* Potential Winnings Display */}
            {amountNum > 0 && oddsNum >= 1 && (
              <div className="bg-[#1C1C1E]/50 border border-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Potential Winnings</span>
                  <span className="text-[#f76301] text-lg font-bold">₦{potentialWinnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-800">
                  <span className="text-gray-400 text-sm">Stake</span>
                  <span className="text-white text-sm font-medium">₦{amountNum.toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* Description (Optional) */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Description (Optional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Arsenal vs Chelsea - Arsenal to win"
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
                onClick={handlePlaceBet}
                disabled={
                  !selectedPlatform ||
                  !amount ||
                  amountNum < 100 ||
                  amountNum > bettingBalance ||
                  !odds ||
                  oddsNum < 1 ||
                  placing
                }
                isLoading={placing}
                className="flex-1 py-3 rounded-full text-sm"
              >
                Place Bet
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

export default PlaceBetModal;

