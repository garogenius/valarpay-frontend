"use client";

import React, { useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import { FiArrowRight } from "react-icons/fi";
import useUserStore from "@/store/user.store";
import { useCreateFixedDeposit, useFixedDepositPlans } from "@/api/fixed-deposit/fixed-deposit.queries";
import { useVerifyWalletPin } from "@/api/user/user.queries";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import CustomButton from "@/components/shared/Button";
import useGlobalModalsStore from "@/store/globalModals.store";
import type { FixedDepositPlan, FixedDepositPlanType } from "@/api/fixed-deposit/fixed-deposit.types";

interface FixedSavingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FixedSavingsModal: React.FC<FixedSavingsModalProps> = ({ isOpen, onClose }) => {
  const { user } = useUserStore();
  const wallets = user?.wallet || [];
  const ngnWallet = wallets.find((w) => w.currency?.toUpperCase() === "NGN");

  const { plans, isPending: plansLoading } = useFixedDepositPlans();
  const [selectedPlanType, setSelectedPlanType] = useState<FixedDepositPlanType>("SHORT_TERM_90");
  const selectedPlan: FixedDepositPlan | undefined = plans.find((p: FixedDepositPlan) => p.planType === selectedPlanType) || plans[0];

  const minDeposit = selectedPlan?.minimumDeposit ?? 0;
  const [amount, setAmount] = useState<number>(minDeposit || 0);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [walletPin, setWalletPin] = useState("");
  const [transactionResult, setTransactionResult] = useState<unknown>(null);
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(ngnWallet?.id || null);
  
  const { handleError, showInsufficientFundsModal, showIncorrectPinModal } = useGlobalModalsStore();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[^0-9.]/g, '');
    const value = parseFloat(cleaned) || 0;
    // Ensure amount doesn't exceed reasonable maximum (₦1 billion)
    setAmount(Math.min(value, 1000000000));
  };

  // Generate quick select amounts based on minimum deposit
  const getQuickSelectAmounts = () => {
    if (!minDeposit || minDeposit === 0) {
      return [5000000, 10000000, 20000000, 50000000];
    }
    
    // For high minimum deposits, provide appropriate increments
    if (minDeposit >= 60000000) {
      // Long-term (₦90M+)
      return [
        minDeposit,
        minDeposit * 1.5,
        minDeposit * 2,
        minDeposit * 3
      ].map(v => Math.round(v));
    } else if (minDeposit >= 6000000) {
      // Medium-term (₦60M+)
      return [
        minDeposit,
        minDeposit * 1.5,
        minDeposit * 2,
        minDeposit * 3
      ].map(v => Math.round(v));
    } else {
      // Short-term (₦6M+)
      return [
        minDeposit,
        minDeposit * 1.5,
        minDeposit * 2,
        minDeposit * 3
      ].map(v => Math.round(v));
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const onError = (error: unknown) => {
    handleError(error, {
      currency: "NGN",
      onRetry: () => {
        if (!selectedPlan) return;
        createFixedDeposit({
          planType: selectedPlan.planType,
          principalAmount: amount,
          currency: "NGN",
          interestPaymentFrequency: "AT_MATURITY",
          reinvestInterest: false,
          autoRenewal: false,
        });
      },
    });
  };

  const onSuccess = (data: unknown) => {
    // Handle API response structure: { message: "...", data: {...} }
    const response = data as { data?: { data?: unknown; message?: string } } | { message?: string; data?: unknown };
    const payload = (response as any)?.data?.data || (response as any)?.data || null;
    setTransactionResult(payload);
    setStep(4);
    SuccessToast({
      title: "Fixed Deposit Created Successfully!",
      description: "Your fixed deposit has been created. It will mature on the specified date.",
    });
  };

  const { mutate: createFixedDeposit, isPending: creating } = useCreateFixedDeposit(onError, onSuccess);

  const onVerifyPinError = (error: unknown) => {
    const errorMessage = (error as { response?: { data?: { message?: unknown } } })?.response?.data
      ?.message as unknown;
    const message = Array.isArray(errorMessage)
      ? errorMessage.join(" ").toLowerCase()
      : String(errorMessage || "").toLowerCase();
    
    // Check if it's a PIN error
    if (message.includes("pin") || message.includes("password") || message.includes("authentication")) {
      showIncorrectPinModal({
        attemptsRemaining: (error as any)?.response?.data?.attemptsRemaining,
        onRetry: () => {
          if (!selectedPlan) return;
          verifyPin({ pin: walletPin });
        },
      });
    } else {
      handleError(error, {
        currency: "NGN",
        onRetry: () => {
          if (!selectedPlan) return;
          verifyPin({ pin: walletPin });
        },
      });
    }
  };

  const onVerifyPinSuccess = () => {
    if (!selectedPlan) return;
    createFixedDeposit({
      planType: selectedPlan.planType,
      principalAmount: amount,
      currency: "NGN",
      interestPaymentFrequency: "AT_MATURITY",
      reinvestInterest: false,
      autoRenewal: false,
    });
  };

  const { mutate: verifyPin, isPending: verifyingPin } = useVerifyWalletPin(
    onVerifyPinError,
    onVerifyPinSuccess
  );

  const handleCreate = () => {
    if (!selectedPlan) {
      ErrorToast({
        title: "Validation Error",
        descriptions: ["Please select a fixed deposit plan"],
      });
      return;
    }

    if (amount < minDeposit) {
      ErrorToast({
        title: "Validation Error",
        descriptions: [`Minimum deposit for this plan is ₦${Number(minDeposit).toLocaleString()}`],
      });
      return;
    }

    if (walletPin.length !== 4) {
      ErrorToast({
        title: "Validation Error",
        descriptions: ["Please enter a valid 4-digit PIN"],
      });
      return;
    }

    const selectedWallet = wallets.find(w => w.id === selectedWalletId);
    if (!selectedWallet) {
      ErrorToast({
        title: "Wallet Required",
        descriptions: ["Please select a wallet"],
      });
      return;
    }

    const walletBalance = Number(selectedWallet.balance || 0);
    if (Number(amount) > walletBalance) {
      showInsufficientFundsModal({
        requiredAmount: Number(amount),
        currentBalance: walletBalance,
        currency: "NGN",
      });
      return;
    }

    // Additional validation: ensure amount is a valid number
    if (isNaN(amount) || amount <= 0) {
      ErrorToast({
        title: "Validation Error",
        descriptions: ["Please enter a valid deposit amount"],
      });
      return;
    }

    verifyPin({ pin: walletPin });
  };

  const resetAndClose = () => {
    setStep(1);
    setAmount(minDeposit || 0);
    setWalletPin("");
    setTransactionResult(null);
    setSelectedWalletId(wallets.length > 0 ? wallets[0].id : null);
    onClose();
  };

  useEffect(() => {
    // When plans load, ensure we have a sensible default amount
    if (minDeposit > 0 && (!amount || amount < minDeposit)) {
      setAmount(minDeposit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minDeposit]);

  useEffect(() => {
    // Set default wallet if none selected
    if (!selectedWalletId && wallets.length > 0) {
      setSelectedWalletId(wallets[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallets.length]);

  const interestRateText = selectedPlan
    ? `${(selectedPlan.interestRate * 100).toFixed(2)}% per annum`
    : "N/A";

  const tr = transactionResult as null | Partial<{
    principalAmount: number;
    planType: string;
    interestRate: number;
    maturityDate: string;
    startDate?: string;
    certificateReference?: string;
    status?: string;
  }>;

  const displayPrincipal = tr?.principalAmount ?? amount;
  const displayPlanType = tr?.planType ?? selectedPlan?.planType;
  const displayInterestRate = tr?.interestRate !== undefined
    ? `${(tr.interestRate * 100).toFixed(2)}% per annum`
    : interestRateText;
  const displayMaturityDate = tr?.maturityDate
    ? new Date(tr.maturityDate).toLocaleDateString("en-GB", { 
        day: "2-digit", 
        month: "2-digit", 
        year: "numeric" 
      })
    : selectedPlan
    ? new Date(Date.now() + selectedPlan.durationDays * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB", { 
        day: "2-digit", 
        month: "2-digit", 
        year: "numeric" 
      })
    : "";

  if (!isOpen) return null;

  return (
    <div className="z-[999999] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 flex justify-center items-center w-full md:inset-0 h-[100dvh]">
      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
        <div className="absolute inset-0 bg-black/80 dark:bg-black/60" onClick={onClose} />
      </div>
      
      <div className="relative mx-2.5 2xs:mx-4 bg-bg-600 dark:bg-bg-1100 border border-border-800 dark:border-border-700 px-4 sm:px-6 py-4 w-full max-w-md max-h-[92vh] rounded-2xl z-10 overflow-x-hidden overflow-y-auto">
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 p-2 cursor-pointer bg-bg-1400 rounded-full hover:bg-bg-1200 transition-colors"
        >
          <CgClose className="text-xl text-text-200 dark:text-text-400" />
        </button>

        {step === 1 ? (
          <>
            <h2 className="text-white text-base font-semibold mb-6">Start Fixed Deposit</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Plan
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {plansLoading ? (
                    <div className="text-white/60 text-sm">Loading plans...</div>
                  ) : (
                     plans.map((p: FixedDepositPlan) => (
                      <button
                        key={p.planType}
                        onClick={() => {
                          setSelectedPlanType(p.planType);
                          setAmount((prev) => (prev < p.minimumDeposit ? p.minimumDeposit : prev));
                        }}
                        className={`py-2 text-sm rounded-lg text-left px-3 border ${
                          (selectedPlan?.planType || selectedPlanType) === p.planType
                            ? "bg-[#f76301] text-black border-transparent"
                            : "bg-bg-500 dark:bg-bg-900 text-white/80 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{p.name}</span>
                          <span className="text-xs">{(p.interestRate * 100).toFixed(2)}%</span>
                        </div>
                        <div className="text-[11px] opacity-80 mt-0.5">
                          Min ₦{Number(p.minimumDeposit).toLocaleString()} • {p.durationDays} days
                        </div>
                      </button>
                    ))
                  )}
                </div>
                <div className="mt-2 text-xs text-white/60">
                  Interest Rate: <span className="text-[#f76301]">{interestRateText}</span>
                </div>
              </div>

              <CustomButton
                onClick={() => setStep(2)}
                disabled={!selectedPlan}
                className="w-full bg-[#f76301] hover:bg-[#e55a00] text-black py-3 rounded-lg font-medium"
              >
                Continue <FiArrowRight className="inline ml-2" />
              </CustomButton>
            </div>
          </>
        ) : step === 2 ? (
          <>
            <h2 className="text-white text-base font-semibold mb-6">Start Fixed Deposit</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2 break-words">
                  Amount to Deposit {minDeposit ? `(Minimum ₦${Number(minDeposit).toLocaleString()})` : ""}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">₦</span>
                  <input
                    type="text"
                    value={formatCurrency(amount)}
                    onChange={handleAmountChange}
                    className="w-full bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-3 pl-8 pr-4 text-white text-sm placeholder:text-white/50 outline-none focus:ring-2 focus:ring-[#f76301] focus:border-transparent"
                  />
                </div>
                <div className="flex items-center justify-between mt-2 gap-1.5 sm:gap-2 flex-wrap">
                  {getQuickSelectAmounts().map((value) => (
                    <button
                      key={value}
                      onClick={() => setAmount(value)}
                      disabled={value < minDeposit}
                      className={`px-2 sm:px-3 py-1 text-[10px] sm:text-xs rounded-full whitespace-nowrap transition-colors ${
                        amount === value
                          ? 'bg-[#f76301] text-black'
                          : value < minDeposit
                          ? 'bg-bg-500 dark:bg-bg-900 text-white/30 cursor-not-allowed'
                          : 'bg-bg-500 dark:bg-bg-900 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {formatCurrency(value)}
                    </button>
                  ))}
                </div>
                {amount > 0 && amount < minDeposit && (
                  <p className="text-red-400 text-xs mt-1">
                    Minimum deposit is ₦{Number(minDeposit).toLocaleString()}
                  </p>
                )}
              </div>

              <div className="bg-bg-500 dark:bg-bg-900 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-white/70 text-sm">Principal Amount:</span>
                  <span className="text-white font-medium text-sm">{formatCurrency(amount)}</span>
                </div>
                {selectedPlan && (
                  <>
                    <div className="flex justify-between mb-2 mt-2">
                      <span className="text-white/70 text-sm">Interest Rate:</span>
                      <span className="text-[#f76301] font-medium text-sm">{interestRateText}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-white/70 text-sm">Duration:</span>
                      <span className="text-white font-medium text-sm">{selectedPlan.durationDays} days</span>
                    </div>
                  </>
                )}
                <div className="h-px bg-white/10 my-3" />
                <div className="flex justify-between">
                  <span className="text-white/70 text-sm">Maturity Amount:</span>
                  <span className="text-white/80 text-xs">Calculated by server</span>
                </div>
              </div>

              {/* Wallet Selection */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Select Wallet
                </label>
                <div className="rounded-lg border border-white/10 bg-transparent divide-y divide-white/10">
                  <div className="flex items-center justify-between py-3 px-3">
                    <span className="text-white/80 text-sm">Available Balance (₦{Number(wallets?.[0]?.balance || 0).toLocaleString()})</span>
                    <span className="w-4 h-4 rounded-full border-2 border-[#f76301] inline-block" />
                  </div>
                  {wallets.map((w) => (
                    <label key={w.id} className="flex items-center justify-between py-3 px-3 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white grid place-items-center">
                          <span className="text-black font-bold">{w.currency?.slice(0,1) || 'N'}</span>
                        </div>
                        <div className="flex flex-col">
                          <p className="text-white text-sm font-medium">{w.bankName || w.currency}</p>
                          <p className="text-white/60 text-xs">{w.accountNumber || '0000000000'} <span className="ml-2 inline-flex text-[10px] px-1.5 py-0.5 rounded bg-white/10">Account</span></p>
                        </div>
                      </div>
                      <input 
                        type="radio" 
                        checked={selectedWalletId === w.id} 
                        onChange={() => setSelectedWalletId(w.id)} 
                        className="w-4 h-4 accent-[#f76301]" 
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <CustomButton
                  onClick={() => setStep(1)}
                  className="flex-1 bg-transparent border border-white/10 text-white hover:bg-white/5 py-3 rounded-lg"
                >
                  Back
                </CustomButton>
                <CustomButton
                  onClick={() => setStep(3)}
                  disabled={!!minDeposit && amount < minDeposit || !selectedWalletId}
                  className="flex-1 bg-[#f76301] hover:bg-[#e55a00] text-black py-3 rounded-lg font-medium"
                >
                  Continue <FiArrowRight className="inline ml-2" />
                </CustomButton>
              </div>
            </div>
          </>
        ) : step === 3 ? (
          <div className="space-y-6">
            <h2 className="text-white text-base font-semibold mb-4">Confirm Fixed Deposit</h2>
            
            <div className="bg-bg-500 dark:bg-bg-900 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-white/70 text-sm">Principal Amount:</span>
                <span className="text-white font-medium text-sm">{formatCurrency(amount)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-white/70 text-sm">Plan:</span>
                <span className="text-white text-sm">{selectedPlan?.name || selectedPlanType}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-white/70 text-sm">Interest Rate:</span>
                <span className="text-[#f76301] text-sm">{interestRateText}</span>
              </div>
              <div className="h-px bg-white/10 my-3" />
              <div className="flex justify-between mb-2">
                <span className="text-white/70 text-sm">Maturity Date:</span>
                <span className="text-white text-sm">
                  {selectedPlan
                    ? new Date(Date.now() + selectedPlan.durationDays * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB", { 
                        day: "2-digit", 
                        month: "2-digit", 
                        year: "numeric" 
                      })
                    : ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70 text-sm">Maturity Amount:</span>
                <span className="text-white/80 text-xs">Calculated by server</span>
              </div>
              {selectedPlan && (
                <div className="flex justify-between mt-2">
                  <span className="text-white/70 text-sm">Duration:</span>
                  <span className="text-white text-sm">{selectedPlan.durationDays} days ({selectedPlan.durationMonths || Math.round(selectedPlan.durationDays / 30)} months)</span>
                </div>
              )}
            </div>

            {/* PIN Input */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Enter Transaction PIN
              </label>
              <input
                type="password"
                maxLength={4}
                value={walletPin}
                onChange={(e) => setWalletPin(e.target.value.replace(/\D/g, ""))}
                className="w-full bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-3 px-4 text-white text-center text-2xl tracking-widest placeholder:text-white/50 outline-none focus:ring-2 focus:ring-[#f76301] focus:border-transparent"
                placeholder="••••"
              />
            </div>

            <div className="flex gap-3">
              <CustomButton
                onClick={() => setStep(2)}
                className="flex-1 bg-transparent border border-white/10 text-white hover:bg-white/5 py-3 rounded-lg"
              >
                Back
              </CustomButton>
              <CustomButton
                onClick={handleCreate}
                disabled={walletPin.length !== 4 || creating || verifyingPin}
                isLoading={creating || verifyingPin}
                className="flex-1 bg-[#f76301] hover:bg-[#e55a00] text-black py-3 rounded-lg font-medium"
              >
                Create Fixed Deposit
              </CustomButton>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-[#f76301]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f76301" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h2 className="text-white text-base font-semibold mb-2">Fixed Deposit Created!</h2>
            <p className="text-white/70 text-sm mb-6">Your fixed deposit of {formatCurrency(displayPrincipal)} has been successfully created.</p>
            
            <div className="bg-bg-500 dark:bg-bg-900 p-4 rounded-lg mb-6 text-left">
              <div className="flex justify-between mb-2">
                <span className="text-white/70 text-sm">Principal:</span>
                <span className="text-white text-sm font-medium">{formatCurrency(displayPrincipal)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-white/70 text-sm">Plan Type:</span>
                <span className="text-white text-sm">{selectedPlan?.name || String(displayPlanType || "")}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-white/70 text-sm">Interest Rate:</span>
                <span className="text-[#f76301] text-sm font-medium">{displayInterestRate}</span>
              </div>
              {tr?.certificateReference && (
                <div className="flex justify-between mb-2">
                  <span className="text-white/70 text-sm">Certificate Ref:</span>
                  <span className="text-white text-xs font-mono">{tr.certificateReference}</span>
                </div>
              )}
              <div className="h-px bg-white/10 my-2" />
              <div className="flex justify-between">
                <span className="text-white/70 text-sm">Maturity Date:</span>
                <span className="text-white text-sm font-medium">{displayMaturityDate}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-white/70 text-sm">Maturity Amount:</span>
                <span className="text-white/80 text-xs">Calculated by server</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <CustomButton
                onClick={resetAndClose}
                className="w-full bg-[#f76301] hover:bg-[#e55a00] text-black py-3 rounded-lg font-medium"
              >
                View Fixed Deposit
              </CustomButton>
              <CustomButton
                onClick={resetAndClose}
                className="w-full bg-transparent hover:bg-white/5 text-white py-3 rounded-lg font-medium border border-white/10"
              >
                Close
              </CustomButton>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default FixedSavingsModal;
