"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useMemo, useState } from "react";
import { IoClose } from "react-icons/io5";
import CustomButton from "@/components/shared/Button";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import { useCreateMultiCurrencyAccount } from "@/api/wallet/wallet.queries";
import type { WALLET_CURRENCY, WALLET_PROVIDER } from "@/api/wallet/wallet.types";

interface CreateCurrencyAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultCurrency?: Exclude<WALLET_CURRENCY, "NGN">;
}

const CreateCurrencyAccountModal: React.FC<CreateCurrencyAccountModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultCurrency = "USD",
}) => {
  const [currency, setCurrency] = useState<Exclude<WALLET_CURRENCY, "NGN">>(
    defaultCurrency
  );
  const provider: WALLET_PROVIDER = "graph";

  const supportedCurrencies = useMemo(
    () =>
      [
        { code: "USD" as const, name: "US Dollar", enabled: true, badge: "Available" },
        { code: "EUR" as const, name: "Euro", enabled: true, badge: "Available" },
        { code: "GBP" as const, name: "British Pound", enabled: true, badge: "Available" },
      ] as const,
    []
  );

  const onError = (error: any) => {
    const errorMessage = error?.response?.data?.message ?? "Something went wrong";
    ErrorToast({
      title: "Unable to create account",
      descriptions: Array.isArray(errorMessage) ? errorMessage : [errorMessage],
    });
  };

  const onSuccessCallback = (data: any) => {
    SuccessToast({
      title: "Account created",
      description: data?.data?.message || "Your currency account has been created successfully",
    });
    onClose();
    onSuccess?.();
  };

  const { mutate: createAccount, isPending } = useCreateMultiCurrencyAccount(onError, onSuccessCallback);

  if (!isOpen) return null;

  const selectedMeta = supportedCurrencies.find((c) => c.code === currency);
  const isEnabled = selectedMeta?.enabled ?? false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={isPending ? undefined : onClose} />

      <div
        className="relative w-full max-w-md bg-[#0A0A0A] rounded-2xl border border-gray-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-4 pb-4 border-b border-gray-800">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-white text-sm font-semibold">Create Currency Account</p>
              <p className="text-gray-400 text-xs mt-1">
                Create a multi-currency wallet account. Only USD is available for now.
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isPending}
              className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              aria-label="Close"
            >
              <IoClose className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-5 py-5 space-y-4">
          <div className="space-y-2">
            <p className="text-gray-400 text-[11px]">Select Currency</p>
            <div className="grid grid-cols-1 gap-2">
              {supportedCurrencies.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  disabled={!c.enabled}
                  onClick={() => setCurrency(c.code)}
                  className={[
                    "w-full flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors",
                    currency === c.code ? "border-[#FF6B2C] bg-white/5" : "border-gray-800 bg-[#141416]",
                    !c.enabled ? "opacity-60 cursor-not-allowed" : "hover:bg-white/5",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-white text-sm font-medium">{c.code}</span>
                    <span className="text-gray-400 text-xs">{c.name}</span>
                  </div>
                  <span
                    className={[
                      "px-2 py-1 rounded-full text-[10px] font-medium",
                      c.enabled ? "bg-green-500/10 text-green-400" : "bg-white/10 text-gray-300",
                    ].join(" ")}
                  >
                    {c.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <CustomButton
            type="button"
            isLoading={isPending}
            disabled={!isEnabled || isPending}
            className="w-full py-3 border-2 border-primary text-black"
            onClick={() => {
              if (!isEnabled) return;
              createAccount({ currency, provider });
            }}
          >
            Create {currency} Account
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default CreateCurrencyAccountModal;



















