"use client";

import React from "react";
import { CgClose } from "react-icons/cg";
import CustomButton from "@/components/shared/Button";
import { useFundCard } from "@/api/currency/cards.queries";
import { IVirtualCard } from "@/api/currency/cards.types";
import { useGetCurrencyAccounts } from "@/api/currency/currency.queries";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import InsufficientBalanceModal from "@/components/shared/InsufficientBalanceModal";
import { isInsufficientBalanceError, extractBalanceInfo } from "@/utils/errorUtils";

interface FundCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: IVirtualCard | null;
  onSuccess?: () => void;
}

const FundCardModal: React.FC<FundCardModalProps> = ({ isOpen, onClose, card, onSuccess }) => {
  const [amount, setAmount] = React.useState("");
  const [walletPin, setWalletPin] = React.useState("");
  const [showPinStep, setShowPinStep] = React.useState(false);
  const [showInsufficientBalanceModal, setShowInsufficientBalanceModal] = React.useState(false);
  const [balanceInfo, setBalanceInfo] = React.useState<{ requiredAmount?: number; currentBalance?: number }>({});
  
  // Get currency account for the card's currency
  const { accounts } = useGetCurrencyAccounts();
  const currencyAccount = React.useMemo(
    () => accounts?.find((a) => a.currency === card?.currency),
    [accounts, card?.currency]
  );

  const onError = (error: any) => {
    // Check if it's an insufficient balance error
    if (isInsufficientBalanceError(error)) {
      const info = extractBalanceInfo(error);
      // If we don't have balance info from error, use the currency account balance
      if (!info.currentBalance && currencyAccount) {
        info.currentBalance = currencyAccount.balance || 0;
      }
      // If we don't have required amount, use the amount being funded
      if (!info.requiredAmount && amount) {
        info.requiredAmount = Number(amount);
      }
      setBalanceInfo(info);
      setShowInsufficientBalanceModal(true);
      setShowPinStep(false);
      setWalletPin("");
      return;
    }

    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage)
      ? errorMessage
      : [errorMessage || "Failed to fund card"];

    ErrorToast({
      title: "Funding Failed",
      descriptions,
    });
    setShowPinStep(false);
    setWalletPin("");
  };

  const onFundSuccess = () => {
    SuccessToast({
      title: "Card Funded Successfully!",
      description: `${card?.currency} ${Number(amount).toLocaleString()} has been added to your card.`,
    });
    setShowPinStep(false);
    setAmount("");
    setWalletPin("");
    if (onSuccess) onSuccess();
    onClose();
  };

  const { mutate: fundCard, isPending: funding } = useFundCard(onError, onFundSuccess);

  React.useEffect(() => {
    if (isOpen) {
      setAmount("");
      setWalletPin("");
      setShowPinStep(false);
    }
  }, [isOpen]);

  const handleContinue = () => {
    if (!amount || Number(amount) <= 0) {
      ErrorToast({
        title: "Validation Error",
        descriptions: ["Please enter a valid amount"],
      });
      return;
    }

    if (!currencyAccount) {
      ErrorToast({
        title: "Error",
        descriptions: [`${card?.currency} account not found`],
      });
      return;
    }

    if (Number(amount) > Number(currencyAccount.balance)) {
      setBalanceInfo({
        requiredAmount: Number(amount),
        currentBalance: Number(currencyAccount.balance),
      });
      setShowInsufficientBalanceModal(true);
      return;
    }

    if (!card) {
      ErrorToast({
        title: "Error",
        descriptions: ["Card information is missing"],
      });
      return;
    }

    setShowPinStep(true);
  };

  const handleConfirm = () => {
    if (!walletPin || walletPin.length !== 4) {
      ErrorToast({
        title: "Validation Error",
        descriptions: ["Please enter a valid 4-digit PIN"],
      });
      return;
    }

    if (!card) {
      ErrorToast({
        title: "Error",
        descriptions: ["Card information is missing"],
      });
      return;
    }

    fundCard({
      cardId: card.id,
      data: {
        amount: Number(amount),
        walletPin,
      },
    });
  };

  if (!isOpen || !card) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="relative w-full max-w-md bg-bg-600 dark:bg-bg-1100 border border-white/10 rounded-2xl p-5 z-10">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 hover:bg-white/10 rounded-full">
          <CgClose className="text-xl text-white" />
        </button>
        <h2 className="text-white text-base font-semibold mb-4">Fund Card</h2>

        {!showPinStep ? (
          <>
            <div className="flex flex-col gap-3">
              {currencyAccount && (
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <p className="text-white/60 text-xs mb-1">Available Balance</p>
                  <p className="text-white text-lg font-semibold">
                    {card.currency} {Number(currencyAccount.balance || 0).toLocaleString()}
                  </p>
                </div>
              )}
              <div className="flex flex-col gap-1">
                <label className="text-white/70 text-xs">Amount ({card.currency})</label>
                <input
                  type="number"
                  className="w-full bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-3 px-3 text-white text-sm placeholder:text-white/50 outline-none focus:ring-2 focus:ring-[#FF6B2C]"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
                />
              </div>

              <div className="flex gap-3 mt-2">
                <CustomButton
                  onClick={onClose}
                  className="flex-1 bg-transparent border border-white/15 text-white rounded-lg py-2.5"
                >
                  Cancel
                </CustomButton>
                <CustomButton
                  onClick={handleContinue}
                  className="flex-1 bg-[#FF6B2C] hover:bg-[#FF7A3D] text-black rounded-lg py-2.5"
                >
                  Continue
                </CustomButton>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Amount</span>
                <span className="text-white text-sm font-medium">{card.currency} {Number(amount).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Card</span>
                <span className="text-white text-sm font-medium">{card.label || card.currency} Card</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-4">
              <label className="text-white/70 text-xs">Enter Transaction PIN</label>
              <input
                type="password"
                maxLength={4}
                className="w-full bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-3 px-3 text-white text-sm placeholder:text-white/50 outline-none"
                placeholder="••••"
                value={walletPin}
                onChange={(e) => setWalletPin(e.target.value.replace(/\D/g, ""))}
              />
            </div>

            <div className="flex gap-3 mt-2">
              <CustomButton
                onClick={() => setShowPinStep(false)}
                className="flex-1 bg-transparent border border-white/15 text-white rounded-lg py-2.5"
              >
                Back
              </CustomButton>
              <CustomButton
                onClick={handleConfirm}
                disabled={walletPin.length !== 4 || funding}
                isLoading={funding}
                className="flex-1 bg-[#FF6B2C] hover:bg-[#FF7A3D] text-black rounded-lg py-2.5"
              >
                Confirm
              </CustomButton>
            </div>
          </>
        )}
      </div>

      {/* Insufficient Balance Modal */}
      <InsufficientBalanceModal
        isOpen={showInsufficientBalanceModal}
        onClose={() => setShowInsufficientBalanceModal(false)}
        requiredAmount={balanceInfo.requiredAmount}
        currentBalance={balanceInfo.currentBalance}
      />
    </div>
  );
};

export default FundCardModal;


