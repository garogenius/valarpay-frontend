"use client";

import React from "react";
import NextImage from "next/image";
import { CgClose } from "react-icons/cg";
import { useCreateCurrencyAccount } from "@/api/currency/currency.queries";
import CustomButton from "@/components/shared/Button";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import { getCurrencyIconByString } from "@/utils/utilityFunctions";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import KYCRequirementsModal from "./KYCRequirementsModal";

interface CreateCurrencyAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateCurrencyAccountModal: React.FC<CreateCurrencyAccountModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [currency, setCurrency] = React.useState<"USD" | "EUR" | "GBP">("USD");
  const [label, setLabel] = React.useState("");
  const [currencyOpen, setCurrencyOpen] = React.useState(false);
  const [showKYCModal, setShowKYCModal] = React.useState(false);
  const [kycErrorMessage, setKycErrorMessage] = React.useState<string>("");
  const currencyRef = React.useRef<HTMLDivElement>(null);

  useOnClickOutside(currencyRef, () => setCurrencyOpen(false));

  const currencies: Array<{ value: "USD" | "EUR" | "GBP"; label: string }> = [
    { value: "USD", label: "US Dollar" },
    { value: "EUR", label: "Euro" },
    { value: "GBP", label: "British Pound" },
  ];

  const handleClose = () => {
    setCurrency("USD");
    setLabel("");
    setCurrencyOpen(false);
    setShowKYCModal(false);
    setKycErrorMessage("");
    onClose();
  };

  const onError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const errorText = Array.isArray(errorMessage)
      ? errorMessage.join(" ")
      : errorMessage || "Failed to create account";
    
    // Check if error is related to KYC requirements
    const isKYCError = 
      errorText.toLowerCase().includes("postal code") ||
      errorText.toLowerCase().includes("passport number") ||
      errorText.toLowerCase().includes("passport country") ||
      errorText.toLowerCase().includes("passport issue date") ||
      errorText.toLowerCase().includes("passport expiry date") ||
      errorText.toLowerCase().includes("employment status") ||
      errorText.toLowerCase().includes("occupation") ||
      errorText.toLowerCase().includes("primary purpose") ||
      errorText.toLowerCase().includes("source of funds") ||
      errorText.toLowerCase().includes("expected monthly inflow") ||
      errorText.toLowerCase().includes("kyc document") ||
      errorText.toLowerCase().includes("kyc identity verification");

    if (isKYCError) {
      // Show KYC requirements modal
      setKycErrorMessage(errorText);
      setShowKYCModal(true);
    } else {
      // Show regular error toast for other errors
      const descriptions = Array.isArray(errorMessage)
        ? errorMessage
        : [errorMessage || "Failed to create account"];
      ErrorToast({
        title: "Account Creation Failed",
        descriptions,
      });
    }
  };

  const onSuccessCallback = (data: any) => {
    SuccessToast({
      title: "Account Created",
      description: `${currency} account created successfully`,
    });
    handleClose();
    onSuccess();
  };

  const { mutate: createAccount, isPending } = useCreateCurrencyAccount(onError, onSuccessCallback);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !currency) return;
    createAccount({ currency, label: label.trim() });
  };

  if (!isOpen) return null;

  const canSubmit = !!currency && label.trim().length > 0;

  return (
    <div className="z-[999999] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 flex justify-center items-center w-full md:inset-0 h-[100dvh]">
      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
        <div className="absolute inset-0 bg-black/80 dark:bg-black/60" onClick={handleClose} />
      </div>
      <div className="relative mx-2.5 2xs:mx-4 bg-bg-600 dark:bg-bg-1100 border border-border-800 dark:border-border-700 w-full max-w-md rounded-2xl overflow-visible">
        <div className="flex items-center justify-between p-4 pb-2">
          <div>
            <h2 className="text-white text-lg font-semibold">Create Currency Account</h2>
            <p className="text-white/60 text-sm">Create a multi-currency wallet account. Only USD is available for now.</p>
          </div>
          <button onClick={handleClose} className="p-1 hover:bg-white/10 rounded transition-colors">
            <CgClose className="text-xl text-white/70" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4">
          {/* Currency Selection */}
          <div>
            <label className="block text-sm text-white/80 mb-2">Select Currency</label>
            <div className="space-y-2">
              {currencies.map((curr) => (
                <button
                  key={curr.value}
                  type="button"
                  onClick={() => setCurrency(curr.value)}
                  className={`w-full flex items-center justify-between rounded-xl border-2 px-4 py-3.5 transition-all ${
                    currency === curr.value
                      ? "border-[#f76301] bg-[#f76301]/10"
                      : "border-gray-700 dark:border-gray-800 bg-[#1C1C1E] dark:bg-[#141416] hover:bg-[#2C2C2E] dark:hover:bg-[#1C1C1E]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <NextImage
                      src={getCurrencyIconByString(curr.value.toLowerCase()) || ""}
                      alt={curr.value}
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                    <div className="flex flex-col items-start">
                      <span className="text-white text-sm font-semibold">{curr.value}</span>
                      <span className="text-gray-300 dark:text-gray-400 text-xs">{curr.label}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 text-[10px] font-medium">
                    Available
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Account Label */}
          <div>
            <label className="block text-sm text-white/80 mb-2">Account Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., My USD Account"
              className="w-full bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-3.5 px-3 text-white placeholder:text-white/50 outline-none focus:border-[#f76301]"
              maxLength={50}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <CustomButton
              type="button"
              onClick={handleClose}
              className="flex-1 bg-transparent border border-white/15 text-white hover:bg-white/5 py-3 rounded-lg transition-colors"
            >
              Cancel
            </CustomButton>
            <CustomButton
              type="submit"
              isLoading={isPending}
              disabled={!canSubmit || isPending}
              className="flex-1 bg-[#f76301] hover:bg-[#e55a00] text-black font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create {currency} Account
            </CustomButton>
          </div>
        </form>
      </div>

      {/* KYC Requirements Modal */}
      <KYCRequirementsModal
        isOpen={showKYCModal}
        onClose={() => setShowKYCModal(false)}
        currency={currency}
        errorMessage={kycErrorMessage}
      />
    </div>
  );
};

export default CreateCurrencyAccountModal;
