"use client";

import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { MdOutlineAccountBalanceWallet, MdCreditCard, MdOutlineAccountBalance } from "react-icons/md";
import useUserStore from "@/store/user.store";
import { CURRENCY } from "@/constants/types";
import ErrorToast from "@/components/toast/ErrorToast";
import GlobalTransactionHistoryModal from "@/components/shared/GlobalTransactionHistoryModal";

type AddMoneyMethod = "bankTransfer" | "agent" | "linked";
type Step = "method" | "bankInfo";

const AddMoneySteps: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user } = useUserStore();

  const ngnWallet = user?.wallet?.find((w) => w.currency === CURRENCY.NGN);
  const walletAccountNumber = ngnWallet?.accountNumber || "";
  const walletBankName = ngnWallet?.bankName || "";
  const walletAccountName = ngnWallet?.accountName || user?.fullname || "";
  const availableBalance = ngnWallet?.balance || 0;

  const [step, setStep] = useState<Step>("method");
  const [method, setMethod] = useState<AddMoneyMethod>("bankTransfer");

  // success modal (global)
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionData, setTransactionData] = useState<any>(null);

  const stepIndex = () => {
    // mirror the “3 bar” design
    if (step === "method") return 0;
    return 2;
  };

  const renderTopBar = () => (
    <div className="px-5 pt-4">
      <div className="flex items-center justify-between">
        <p className="text-white text-sm font-semibold">Add Money</p>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <IoClose className="w-5 h-5" />
        </button>
      </div>
      <div className="mt-3 flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-[2px] flex-1 rounded-full ${
              i === stepIndex() ? "bg-[#FF6B2C]" : "bg-gray-800"
            }`}
          />
        ))}
      </div>
    </div>
  );

  const renderMethod = () => (
    <div className="w-full flex flex-col gap-4">
      <p className="text-gray-400 text-xs">How would you like to add funds?</p>

      <div className="flex flex-col gap-3">
        {[
          {
            key: "bankTransfer" as const,
            title: "Bank Transfer",
            sub: "Instant & Free",
            icon: <MdOutlineAccountBalance className="text-lg text-gray-300" />,
          },
          {
            key: "agent" as const,
            title: "Via Agent",
            sub: "Instant & Free",
            icon: <MdOutlineAccountBalanceWallet className="text-lg text-gray-300" />,
          },
          {
            key: "linked" as const,
            title: "Via Linked Card/Account",
            sub: "Instant & Free",
            icon: <MdCreditCard className="text-lg text-gray-300" />,
          },
        ].map((opt) => {
          const isComingSoon = opt.key === "linked";
          return (
          <button
            key={opt.key}
            onClick={() => {
              if (isComingSoon) {
                ErrorToast({
                  title: "Coming soon",
                  descriptions: ["Via Linked Card/Account is coming soon."],
                });
                return;
              }
              setMethod(opt.key);
            }}
            disabled={isComingSoon}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors ${
              method === opt.key
                ? "bg-[#1C1C1E] border-[#FF6B2C]"
                : "bg-[#141416] border-gray-800 hover:border-gray-700"
            } ${isComingSoon ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-black/30 border border-gray-800 flex items-center justify-center">
                {opt.icon}
              </div>
              <div className="flex flex-col items-start">
                <span className="text-white text-sm font-semibold">{opt.title}</span>
                <span className="text-gray-400 text-xs">{opt.sub}</span>
              </div>
            </div>
            {isComingSoon ? (
              <span className="text-[10px] font-semibold bg-[#FF6B2C] text-black px-2 py-1 rounded-md">
                Coming soon
              </span>
            ) : null}
          </button>
        );})}
      </div>
    </div>
  );

  const renderBankInfo = () => (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full rounded-lg bg-green-500/10 border border-green-700/40 px-4 py-3">
        <p className="text-green-400 text-xs">
          Transfer any amount to the account below from any merchant. Funds will be credited instantly within 0-10 mins.
        </p>
      </div>

      <div className="w-full rounded-lg bg-[#1C1C1E] border border-gray-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">Account Name</p>
          <p className="text-xs text-white font-medium">{walletAccountName}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">Account Number</p>
          <p className="text-xs text-white font-medium">{walletAccountNumber}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">Bank Name</p>
          <p className="text-xs text-white font-medium">{walletBankName}</p>
        </div>
      </div>

      <div className="w-full rounded-lg bg-[#141416] border border-gray-800 p-4">
        <p className="text-white text-sm font-semibold mb-2">
          Fund your ValarPay wallet easily in three quick steps
        </p>
        <div className="text-xs text-gray-300 space-y-1">
          <p>Step 1: Copy your unique ValarPay account number from the app.</p>
          <p>Step 2: Open your mobile banking app and initiate a transfer.</p>
          <p>Step 3: Send the desired amount, and your ValarPay wallet will be credited instantly.</p>
        </div>
      </div>
    </div>
  );

  const canNext = () => {
    if (step === "method") return true;
    return true;
  };

  const handleBack = () => {
    if (step === "bankInfo") return setStep("method");
    setStep("method");
  };

  const handleNext = () => {
    if (step === "method") {
      if (method === "linked") {
        ErrorToast({
          title: "Coming soon",
          descriptions: ["Via Linked Card/Account is coming soon."],
        });
        return;
      }
      setStep("bankInfo");
      return;
    }
    if (step === "bankInfo") {
      onClose();
      return;
    }
  };

  const primaryLabel = step === "bankInfo" ? "Done" : "Next";

  return (
    <>
      <div className="w-full flex flex-col bg-[#0A0A0A]">
        {renderTopBar()}

        <div className="px-5 py-5 border-t border-gray-800">
          {step === "method" && renderMethod()}
          {step === "bankInfo" && renderBankInfo()}
        </div>

        <div className="px-5 pb-5">
          {step === "method" ? (
            <button
              onClick={handleNext}
              className="w-full px-4 py-3 rounded-full bg-[#FF6B2C] text-white font-semibold hover:bg-[#FF7A3D] transition-colors"
            >
              Next
            </button>
          ) : step === "bankInfo" ? (
            <button
              onClick={handleNext}
              className="w-full px-4 py-3 rounded-full bg-[#FF6B2C] text-white font-semibold hover:bg-[#FF7A3D] transition-colors"
            >
              Done
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="flex-1 px-4 py-3 rounded-full bg-[#2C2C2E] text-white hover:bg-[#353539] transition-colors font-medium"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!canNext()}
                className="flex-1 px-4 py-3 rounded-full bg-[#FF6B2C] text-white font-semibold hover:bg-[#FF7A3D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {primaryLabel}
              </button>
            </div>
          )}
        </div>
      </div>

      {transactionData && (
        <GlobalTransactionHistoryModal
          isOpen={showSuccess}
          onClose={() => {
            setShowSuccess(false);
            setTransactionData(null);
            setStep("method");
          }}
          transaction={transactionData}
        />
      )}
    </>
  );
};

export default AddMoneySteps;


