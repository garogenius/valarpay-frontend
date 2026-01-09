"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaFingerprint } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";
import SpinnerLoader from "@/components/Loader/SpinnerLoader";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import useUserStore from "@/store/user.store";
import { useInitiateTransfer, useVerifyAccount } from "@/api/wallet/wallet.queries";
import GlobalTransactionHistoryModal from "@/components/shared/GlobalTransactionHistoryModal";
import { useGetAllBanks } from "@/api/wallet/wallet.queries";
import { BankProps } from "@/constants/types";
import SearchableDropdown from "@/components/shared/SearchableDropdown";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useFingerprintForPayments } from "@/store/paymentPreferences.store";
import useGlobalModalsStore from "@/store/globalModals.store";

type Step = "details" | "confirm";

interface BankResponseData {
  responseCode: string;
  responseMessage: string;
  sessionId: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  kycLevel: string;
  bvn: string;
}

const WithdrawSteps: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user } = useUserStore();
  const fingerprintEnabled = useFingerprintForPayments();

  const [step, setStep] = useState<Step>("details");
  const [bankData, setBankData] = useState<BankResponseData | null>(null);
  const [bankDropdownOpen, setBankDropdownOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<BankProps | undefined>(undefined);
  const [bankName, setBankName] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [walletPin, setWalletPin] = useState("");

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transactionData, setTransactionData] = useState<any>(null);

  const onVerifyAccountError = async (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage) ? errorMessage : [errorMessage || "Unable to verify account"];
    ErrorToast({ title: "Error during Account Verification", descriptions });
    setBankData(null);
  };

  const onVerifyAccountSuccess = (data: any) => {
    setBankData(data?.data?.data);
  };

  const {
    mutate: verifyAccount,
    isPending: verifyPending,
    isError: verifyError,
  } = useVerifyAccount(onVerifyAccountError, onVerifyAccountSuccess);

  const verifyLoading = verifyPending && !verifyError;
  const { banks, isPending: banksPending } = useGetAllBanks();

  const bankDropdownRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(bankDropdownRef, () => setBankDropdownOpen(false));

  // Verify when 10 digits (ValarPay-style: verify by accountNumber only)
  const lastVerifyKeyRef = useRef<string>("");
  useEffect(() => {
    if (accountNumber.length !== 10) {
      setBankData(null);
      lastVerifyKeyRef.current = "";
      return;
    }
    const key = `${selectedBank?.bankCode || ""}:${accountNumber}`;
    if (key === lastVerifyKeyRef.current) return;
    lastVerifyKeyRef.current = key;
    // If a bank is selected, pass bankCode; otherwise, keep ValarPay-style verification.
    verifyAccount({ accountNumber, bankCode: selectedBank?.bankCode });
  }, [accountNumber, selectedBank?.bankCode, verifyAccount]);

  const onTransferError = async (error: any) => {
    // Hide processing loader
    useGlobalModalsStore.getState().hideProcessingLoaderModal();
    
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage) ? errorMessage : [errorMessage || "Withdrawal failed"];
    ErrorToast({ title: "Withdrawal Failed", descriptions });
  };

  const onTransferSuccess = (data: any) => {
    // Hide processing loader
    useGlobalModalsStore.getState().hideProcessingLoaderModal();
    
    SuccessToast({ title: "Withdrawal successful", description: "Your withdrawal was successful" });
    const ref = data?.data?.data?.transactionRef || `withdraw_${Date.now()}`;
    const now = new Date().toISOString();
    setTransactionData({
      id: ref,
      type: "TRANSFER",
      status: "SUCCESSFUL",
      direction: "debit",
      amount: Number(amount) || 0,
      currency: "NGN",
      reference: ref,
      createdAt: now,
      paymentMethod: "Available Balance",
      senderName: user?.fullname || undefined,
      recipientName: bankData?.accountName,
      recipientAccount: accountNumber,
      recipientBank: bankName || selectedBank?.name || "-",
      description: "Withdraw",
    });
    setShowSuccessModal(true);
  };

  const {
    mutate: initiateTransfer,
    isPending: transferPending,
    isError: transferError,
  } = useInitiateTransfer(onTransferError, onTransferSuccess);

  const transferLoading = transferPending && !transferError;

  const canProceedDetails = !!bankData && !!selectedBank && accountNumber.length === 10 && Number(amount) > 0;
  const canProceedConfirm = canProceedDetails && walletPin.length === 4;

  const stepIndex = () => (step === "details" ? 0 : 2);

  const renderTopBar = () => (
    <div className="px-5 pt-4">
      <div className="flex items-center justify-between">
        <p className="text-white text-sm font-semibold">Withdraw Funds</p>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close">
          <IoClose className="w-5 h-5" />
        </button>
      </div>
      <div className="mt-3 flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`h-[2px] flex-1 rounded-full ${i === stepIndex() ? "bg-[#FF6B2C]" : "bg-gray-800"}`} />
        ))}
      </div>
    </div>
  );

  const renderDetails = () => (
    <div className="w-full flex flex-col gap-4">
      {/* Bank */}
      <div className="relative flex flex-col gap-1" ref={bankDropdownRef}>
        <label className="text-sm text-gray-400">Bank</label>
        <button
          type="button"
          onClick={() => setBankDropdownOpen((v) => !v)}
          className="w-full flex items-center justify-between bg-[#141416] border border-gray-800 rounded-lg px-4 py-3 text-left"
        >
          <span className={`text-sm ${selectedBank ? "text-white" : "text-gray-600"}`}>
            {selectedBank ? selectedBank.name : "Select bank"}
          </span>
          <span className="text-gray-500 text-sm">{bankDropdownOpen ? "▲" : "▼"}</span>
        </button>

        {bankDropdownOpen ? (
          <div className="absolute top-full mt-2 w-full bg-[#0F0F10] border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50 max-h-64 overflow-y-auto">
            <SearchableDropdown
              items={banks || []}
              searchKey="name"
              displayFormat={(b: BankProps) => (
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-white">{b.name}</p>
                </div>
              )}
              onSelect={(b: BankProps) => {
                setSelectedBank(b);
                setBankName(b.name);
                setBankDropdownOpen(false);
                // bank choice impacts name-enquiry; re-verify if account already entered
                setBankData(null);
                lastVerifyKeyRef.current = "";
              }}
              placeholder="Search bank..."
              isOpen={bankDropdownOpen}
              onClose={() => setBankDropdownOpen(false)}
              isLoading={banksPending}
            />
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-400">Account Number</label>
        <div className="w-full flex items-center bg-[#141416] border border-gray-800 rounded-lg px-4 py-3">
          <input
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
            className="w-full bg-transparent border-none outline-none text-sm text-white placeholder:text-gray-600"
            placeholder="0000000000"
          />
          {verifyLoading && accountNumber.length === 10 ? <SpinnerLoader width={18} height={18} color="#FF6B2C" /> : null}
        </div>
      </div>

      {bankData?.accountName ? (
        <div className="w-full flex items-center gap-2 rounded-lg px-3 py-3 bg-green-500/20 border border-green-700/40">
          <FiCheckCircle className="text-green-500 text-lg flex-shrink-0" />
          <p className="text-white text-sm font-medium">{bankData.accountName}</p>
        </div>
      ) : null}

      {/* Amount is required for logic; keep minimal UI */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-400">Amount</label>
        <div className="w-full flex items-center bg-[#141416] border border-gray-800 rounded-lg px-4 py-3">
          <span className="text-gray-400 text-sm mr-2">₦</span>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))}
            className="w-full bg-transparent border-none outline-none text-sm text-white placeholder:text-gray-600"
            placeholder="0"
            inputMode="numeric"
          />
        </div>
      </div>
    </div>
  );

  const renderConfirm = () => (
    <div className="w-full flex flex-col gap-4">
      <p className="text-white text-sm font-semibold">Confirm Transactions</p>
      <div className="bg-[#1C1C1E] rounded-lg p-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Merchant Name</span>
          <span className="text-white text-sm font-medium">{bankData?.accountName || "-"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Bank</span>
          <span className="text-white text-sm font-medium">{bankName || selectedBank?.name || "-"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Account Number</span>
          <span className="text-white text-sm font-medium">{accountNumber || "-"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Amount</span>
          <span className="text-white text-sm font-medium">₦{Number(amount || 0).toLocaleString()}</span>
        </div>
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
          {fingerprintEnabled ? (
            <button
              type="button"
              className="w-11 h-11 rounded-lg bg-white/10 border border-gray-800 flex items-center justify-center hover:bg-white/15 transition-colors"
              aria-label="Use fingerprint"
              onClick={() =>
                ErrorToast({
                  title: "Fingerprint not available",
                  descriptions: ["Fingerprint sign-in isn't enabled on web yet."],
                })
              }
            >
              <FaFingerprint className="text-white text-lg" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );

  const handlePay = () => {
    const bankCodeToUse = bankData?.bankCode || selectedBank?.bankCode;
    if (!bankCodeToUse) return;
    if (!canProceedConfirm) return;
    
    // Show processing loader
    useGlobalModalsStore.getState().showProcessingLoaderModal();
    
    initiateTransfer({
      accountName: bankData.accountName,
      accountNumber,
      amount: Number(amount),
      description: "Withdraw",
      walletPin,
      sessionId: bankData.sessionId || "",
      bankCode: String(bankCodeToUse),
      currency: "NGN",
    });
  };

  return (
    <>
      <div className="w-full flex flex-col bg-[#0A0A0A]">
        {renderTopBar()}

        <div className="px-5 py-5 border-t border-gray-800">
          {step === "details" ? renderDetails() : renderConfirm()}
        </div>

        <div className="px-5 pb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => (step === "details" ? onClose() : setStep("details"))}
              className="flex-1 px-4 py-3 rounded-full bg-[#2C2C2E] text-white hover:bg-[#353539] transition-colors font-medium"
            >
              Back
            </button>
            {step === "details" ? (
              <button
                onClick={() => setStep("confirm")}
                disabled={!canProceedDetails}
                className="flex-1 px-4 py-3 rounded-full bg-[#FF6B2C] text-white font-semibold hover:bg-[#FF7A3D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handlePay}
                disabled={!canProceedConfirm || transferLoading}
                className="flex-1 px-4 py-3 rounded-full bg-[#FF6B2C] text-white font-semibold hover:bg-[#FF7A3D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {transferLoading ? "Processing..." : "Pay"}
              </button>
            )}
          </div>
        </div>
      </div>

      {transactionData && (
        <GlobalTransactionHistoryModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            setTransactionData(null);
            setStep("details");
            setAccountNumber("");
            setAmount("");
            setWalletPin("");
            setBankData(null);
            onClose();
          }}
          transaction={transactionData}
        />
      )}
    </>
  );
};

export default WithdrawSteps;



