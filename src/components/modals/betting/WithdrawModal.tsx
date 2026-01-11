"use client";

import React, { useState, useMemo } from "react";
import { IoClose } from "react-icons/io5";
import { FiChevronDown } from "react-icons/fi";
import { cn } from "@/utils/cn";
import CustomButton from "@/components/shared/Button";
import { useWithdrawBettingWallet, useGetBettingPlatforms } from "@/api/betting/betting.queries";
import { useGetAllBanks, useVerifyAccount } from "@/api/wallet/wallet.queries";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import VerifyWalletPinModal from "@/components/modals/settings/VerifyWalletPinModal";
import type { BettingPlatform } from "@/api/betting/betting.types";
import SearchableDropdown from "@/components/shared/SearchableDropdown";
import { useGetBettingWallet } from "@/api/betting/betting.queries";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { data: walletData } = useGetBettingWallet();
  const bettingWallet = walletData?.data?.data;
  const bettingBalance = bettingWallet?.balance || 0;
  
  const { platforms, isPending: platformsLoading, isError: platformsError, refetch: refetchPlatforms } =
    useGetBettingPlatforms();
  const { banks, isPending: banksLoading } = useGetAllBanks();
  
  const [selectedPlatform, setSelectedPlatform] = useState<BettingPlatform | null>(null);
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [selectedBank, setSelectedBank] = useState<any>(null);
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [amount, setAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [showPinModal, setShowPinModal] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<any>(null);
  const [verifyingAccount, setVerifyingAccount] = useState(false);

  const activePlatforms = useMemo(() => {
    return (platforms || []).filter((p) => p.isActive !== false);
  }, [platforms]);

  const { mutate: verifyAccount } = useVerifyAccount(
    (error: any) => {
      setVerifyingAccount(false);
      const errorMessage = error?.response?.data?.message;
      ErrorToast({ title: "Verification Failed", descriptions: [errorMessage || "Invalid account details"] });
    },
    (data: any) => {
      setVerifyingAccount(false);
      const accountNameFromApi = data?.data?.data?.accountName || data?.data?.accountName || "";
      setAccountName(accountNameFromApi);
      SuccessToast({ title: "Account Verified", description: `Account name: ${accountNameFromApi}` });
    }
  );

  const onError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage) ? errorMessage : [errorMessage || "Failed to withdraw from betting platform"];
    ErrorToast({ title: "Withdrawal Failed", descriptions });
    setShowPinModal(false);
  };

  const handleSuccess = () => {
    SuccessToast({ title: "Withdrawal Initiated", description: "Your withdrawal request has been submitted successfully." });
    resetAndClose();
    onSuccess?.();
  };

  const { mutate: withdraw, isPending: withdrawing } = useWithdrawBettingWallet(onError, handleSuccess);

  const resetAndClose = () => {
    setSelectedPlatform(null);
    setSelectedBank(null);
    setAccountNumber("");
    setAccountName("");
    setAmount("");
    setRemark("");
    setShowPlatformDropdown(false);
    setShowPinModal(false);
    setPendingPayload(null);
    onClose();
  };

  const handleVerifyAccount = () => {
    if (!selectedBank) {
      ErrorToast({ title: "Validation Error", descriptions: ["Please select a bank"] });
      return;
    }

    if (!accountNumber || accountNumber.length !== 10) {
      ErrorToast({ title: "Validation Error", descriptions: ["Please enter a valid 10-digit account number"] });
      return;
    }

    setVerifyingAccount(true);
    verifyAccount({
      bankCode: selectedBank.bankCode,
      accountNumber: accountNumber,
    });
  };

  const handleWithdraw = () => {
    if (!selectedPlatform) {
      ErrorToast({ title: "Validation Error", descriptions: ["Please select a betting platform"] });
      return;
    }

    if (!selectedBank) {
      ErrorToast({ title: "Validation Error", descriptions: ["Please select a bank"] });
      return;
    }

    if (!accountNumber || accountNumber.length !== 10) {
      ErrorToast({ title: "Validation Error", descriptions: ["Please enter a valid 10-digit account number"] });
      return;
    }

    if (!accountName) {
      ErrorToast({ title: "Validation Error", descriptions: ["Please verify account number first"] });
      return;
    }

    const amountNum = Number(amount);
    if (!amount || amountNum <= 0) {
      ErrorToast({ title: "Validation Error", descriptions: ["Please enter a valid amount"] });
      return;
    }

    if (amountNum > bettingBalance) {
      ErrorToast({ title: "Validation Error", descriptions: ["Insufficient betting wallet balance"] });
      return;
    }

    setPendingPayload({
      amount: amountNum,
      accountNumber: accountNumber,
      accountName: accountName,
      bankCode: selectedBank.bankCode,
      currency: "NGN",
      description: remark.trim() || `Withdrawal from betting wallet (${selectedPlatform.name})`,
    });
    setShowPinModal(true);
  };

  const handlePinVerify = (pin: string) => {
    if (!pendingPayload) return;
    withdraw({
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
              <h3 className="text-white text-lg sm:text-xl font-semibold">Withdraw from Betting</h3>
              <p className="text-gray-500 text-sm mt-1">Withdraw funds to your bank account</p>
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
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Bank Selection */}
            <div className="relative">
              <label className="text-gray-400 text-sm mb-2 block">Select Bank</label>
              <button
                type="button"
                onClick={() => setShowBankDropdown(!showBankDropdown)}
                className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg py-3 px-3 text-white text-sm outline-none focus:border-[#FF6B2C] flex items-center justify-between"
              >
                <span className={selectedBank ? "text-white" : "text-gray-400"}>
                  {selectedBank ? selectedBank.name : "Search and select bank"}
                </span>
                <FiChevronDown className={cn("text-gray-400 transition-transform", showBankDropdown && "rotate-180")} />
              </button>
              {showBankDropdown && (
                <div className="absolute top-full mt-2 w-full bg-[#0F0F10] border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50 max-h-64 overflow-y-auto">
                  <SearchableDropdown
                    items={banks || []}
                    searchKey="name"
                    displayFormat={(bank: any) => (
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-white">{bank.name}</p>
                      </div>
                    )}
                    onSelect={(bank: any) => {
                      setSelectedBank(bank);
                      setAccountName(""); // Clear account name when bank changes
                      setShowBankDropdown(false);
                    }}
                    placeholder="Search bank..."
                    isOpen={showBankDropdown}
                    onClose={() => setShowBankDropdown(false)}
                    isLoading={banksLoading}
                  />
                </div>
              )}
            </div>

            {/* Account Number */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Account Number</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setAccountNumber(value);
                    setAccountName(""); // Clear account name when account number changes
                  }}
                  placeholder="Enter 10-digit account number"
                  className="flex-1 bg-[#1C1C1E] border border-gray-800 rounded-lg px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-700"
                />
                <CustomButton
                  onClick={handleVerifyAccount}
                  disabled={!selectedBank || !accountNumber || accountNumber.length !== 10 || verifyingAccount}
                  isLoading={verifyingAccount}
                  className="px-4 py-3 rounded-lg text-sm whitespace-nowrap"
                >
                  Verify
                </CustomButton>
              </div>
              {accountName && (
                <p className="text-green-400 text-xs mt-1">✓ {accountName}</p>
              )}
            </div>

            {/* Amount */}
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
              <p className="text-gray-500 text-xs mt-1">Betting Wallet Balance: ₦{Number(bettingBalance || 0).toLocaleString()}</p>
              {Number(amount) > bettingBalance && (
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
                onClick={handleWithdraw}
                disabled={
                  !selectedPlatform ||
                  !selectedBank ||
                  !accountNumber ||
                  !accountName ||
                  !amount ||
                  Number(amount) <= 0 ||
                  Number(amount) > bettingBalance ||
                  withdrawing
                }
                isLoading={withdrawing}
                className="flex-1 py-3 rounded-full text-sm"
              >
                Withdraw
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

export default WithdrawModal;

