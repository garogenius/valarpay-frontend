"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useMemo, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaFingerprint } from "react-icons/fa";
import SpinnerLoader from "@/components/Loader/SpinnerLoader";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import useUserStore from "@/store/user.store";
import { CURRENCY } from "@/constants/types";
import GlobalTransactionHistoryModal from "@/components/shared/GlobalTransactionHistoryModal";
import { useFingerprintForPayments } from "@/store/paymentPreferences.store";
import { useConvertCurrency, useGetExchangeRate } from "@/api/wallet/wallet.queries";

type Step = "details" | "confirm";
type Cur = "NGN" | "USD" | "EUR" | "GBP";

const CURRENCIES: Cur[] = ["USD", "NGN", "GBP", "EUR"];

const ConvertCurrencyBillSteps: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user } = useUserStore();
  const fingerprintEnabled = useFingerprintForPayments();
  const wallets = (user?.wallet || []) as any[];
  const ngnWallet = wallets.find((w) => w.currency === CURRENCY.NGN);
  const walletAccountNumber = ngnWallet?.accountNumber || "";

  const [step, setStep] = useState<Step>("details");

  const [fromCur, setFromCur] = useState<Cur | null>(null);
  const [toCur, setToCur] = useState<Cur | null>(null);
  const [amountText, setAmountText] = useState("");
  const amount = useMemo(() => Number(amountText) || 0, [amountText]);
  const [walletPin, setWalletPin] = useState("");

  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionData, setTransactionData] = useState<any>(null);

  // Determine which currency to use for API call (foreign currency)
  // The API converts foreign currency to NGN, so we always need a foreign currency
  const foreignCurrency = useMemo(() => {
    if (!fromCur || !toCur) return null;
    // If converting FROM foreign currency TO NGN, use fromCur
    if (fromCur !== "NGN" && toCur === "NGN") return fromCur;
    // If converting FROM NGN TO foreign currency, use toCur
    if (fromCur === "NGN" && toCur !== "NGN") return toCur;
    // If both are foreign currencies, use fromCur (we'll need to handle this case)
    if (fromCur !== "NGN" && toCur !== "NGN") return fromCur;
    return null;
  }, [fromCur, toCur]);

  // Calculate the amount to send to API
  // API expects amount in foreign currency, so:
  // - If converting FROM foreign TO NGN: use the amount directly
  // - If converting FROM NGN TO foreign: we need to estimate (use 1 as placeholder, rate will give us the conversion)
  const apiAmount = useMemo(() => {
    if (!fromCur || !toCur || amount <= 0) return 1;
    // If converting FROM foreign TO NGN: use the foreign currency amount
    if (fromCur !== "NGN" && toCur === "NGN") return amount;
    // If converting FROM NGN TO foreign: use 1 to get the rate, then calculate
    if (fromCur === "NGN" && toCur !== "NGN") return 1;
    // If both are foreign: use fromCur amount
    if (fromCur !== "NGN" && toCur !== "NGN") return amount;
    return 1;
  }, [amount, fromCur, toCur]);

  // Only fetch rate when both currencies are selected, they're different, amount > 0, and we have a foreign currency
  const shouldFetchRate = !!fromCur && !!toCur && fromCur !== toCur && amount > 0 && !!foreignCurrency;

  const { exchangeRate, isPending: ratePending, isError: rateError } = useGetExchangeRate({
    amount: apiAmount,
    currency: (foreignCurrency as "USD" | "EUR" | "GBP") || "USD", // Type assertion safe because enabled prevents call when null
    enabled: shouldFetchRate,
  });

  // Calculate rate and converted amount based on conversion direction
  const rate = useMemo(() => {
    if (!exchangeRate || !fromCur || !toCur) return 0;
    
    // Use the computed rate from the API response
    const apiRate = Number(exchangeRate.rate || 0);
    if (apiRate <= 0) return 0;
    
    // The API returns rate as recipientAmount / senderAmount
    // We need to adjust based on conversion direction
    if (fromCur === exchangeRate.senderCurrency && toCur === exchangeRate.recipientCurrency) {
      // Direct match: use rate as is
      return apiRate;
    } else if (fromCur === exchangeRate.recipientCurrency && toCur === exchangeRate.senderCurrency) {
      // Reverse direction: use inverse rate
      return 1 / apiRate;
    }
    
    // Fallback: use computed rate
    return apiRate;
  }, [exchangeRate, fromCur, toCur]);

  const converted = useMemo(() => {
    if (amount <= 0 || !exchangeRate || !fromCur || !toCur) return 0;
    
    // Calculate based on the actual API response structure
    // Scale the recipientAmount based on the ratio of actual amount to senderAmount
    if (exchangeRate.senderAmount > 0) {
      const scaleFactor = amount / exchangeRate.senderAmount;
      return exchangeRate.recipientAmount * scaleFactor;
    }
    
    // Fallback: use rate calculation
    if (rate > 0) {
      return amount * rate;
    }
    
    return 0;
  }, [amount, rate, fromCur, toCur, exchangeRate]);

  const onConvertError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage) ? errorMessage : [errorMessage || "Conversion failed"];
    ErrorToast({ title: "Currency conversion failed", descriptions });
  };

  const onConvertSuccess = (data: any) => {
    SuccessToast({ title: "Conversion successful", description: "Your currency conversion was successful" });
    const ref = data?.data?.data?.transactionRef || data?.data?.data?.reference || `convert_${Date.now()}`;
    const now = new Date().toISOString();
    setTransactionData({
      id: ref,
      type: "BILL_PAYMENT",
      status: "SUCCESSFUL",
      direction: "debit",
      amount: Number(amount) || 0,
      currency: fromCur || ("USD" as Cur),
      reference: ref,
      createdAt: now,
      paymentMethod: "Available Balance",
      senderName: user?.fullname || undefined,
      senderAccount: walletAccountNumber,
      recipientName: "Currency Conversion",
      recipientAccount: "",
      recipientBank: "ValarPay",
      description: fromCur && toCur ? `Convert ${fromCur} to ${toCur}` : "Currency conversion",
    });
    setShowSuccess(true);
  };

  const { mutate: convert, isPending: convertPending, isError: convertErr } = useConvertCurrency(onConvertError, onConvertSuccess);
  const converting = convertPending && !convertErr;

  const canNext = amount > 0 && !!fromCur && !!toCur && fromCur !== toCur && !!rate && !rateError;
  const canPay = canNext && walletPin.length === 4;

  return (
    <>
      <div className="w-full flex flex-col bg-white dark:bg-bg-1100">
        <div className="px-5 pt-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#0A0A0A] dark:text-white text-sm font-semibold">Convert Currency</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                {step === "details" ? "Enter payment details to continue" : "Confirm Transactions"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              aria-label="Close"
            >
              <IoClose className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-5 py-5 border-t border-gray-200 dark:border-gray-800">
          {step === "details" ? (
            <div className="w-full flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="relative flex flex-col gap-1" ref={fromRef}>
                  <label className="text-[11px] text-gray-500 dark:text-gray-400">From</label>
                  <button
                    type="button"
                    onClick={() => setFromOpen((v) => !v)}
                    className="w-full flex items-center justify-between bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm text-black dark:text-white"
                  >
                    <span className={fromCur ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-600"}>
                      {fromCur || "Select currency"}
                    </span>
                    <span className="text-gray-500 dark:text-gray-500">▾</span>
                  </button>
                  {fromOpen ? (
                    <div className="absolute left-0 top-full mt-2 w-full bg-white dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-2xl z-[9999]">
                      {CURRENCIES.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            setFromCur(c);
                            setFromOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-[#1C1C1E] transition-colors"
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="relative flex flex-col gap-1" ref={toRef}>
                  <label className="text-[11px] text-gray-500 dark:text-gray-400">To</label>
                  <button
                    type="button"
                    onClick={() => setToOpen((v) => !v)}
                    className="w-full flex items-center justify-between bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm text-black dark:text-white"
                  >
                    <span className={toCur ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-600"}>
                      {toCur || "Select currency"}
                    </span>
                    <span className="text-gray-500 dark:text-gray-500">▾</span>
                  </button>
                  {toOpen ? (
                    <div className="absolute left-0 top-full mt-2 w-full bg-white dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-2xl z-[9999]">
                      {CURRENCIES.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            setToCur(c);
                            setToOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-[#1C1C1E] transition-colors"
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-gray-500 dark:text-gray-400">Amount</label>
                <div className="w-full flex items-center bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm">
                  <input
                    value={amountText}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (/^\d*\.?\d*$/.test(v)) setAmountText(v);
                    }}
                    className="w-full bg-transparent border-none outline-none text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-600 text-sm"
                    placeholder="Enter amount"
                    inputMode="decimal"
                  />
                </div>
              </div>

              <div className="w-full rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-800/40 px-4 py-3 flex items-center justify-between">
                {ratePending ? (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-xs">
                    <SpinnerLoader width={16} height={16} color="#FF6B2C" /> Fetching rate...
                  </div>
                ) : rateError || !rate ? (
                  <p className="text-xs text-gray-600 dark:text-gray-300">Rate not available</p>
                ) : (
                  <p className="text-xs text-green-700 dark:text-green-300 font-medium">
                    {fromCur && toCur ? `Rate: 1 ${fromCur} = ${rate} ${toCur}` : "Select currencies to see rate"}
                  </p>
                )}
                <p className="text-xs text-green-700 dark:text-green-300 font-medium">
                  {converted > 0 ? `~ ${converted.toFixed(2)} ${toCur}` : ""}
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-4">
              <div className="rounded-xl bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 p-4">
                <div className="flex items-center justify-between py-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Rate</p>
                  <p className="text-xs font-medium text-black dark:text-white">
                    {rate && fromCur && toCur ? `1 ${fromCur} = ${rate} ${toCur}` : "-"}
                  </p>
                </div>
                <div className="flex items-center justify-between py-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Swap From</p>
                  <p className="text-xs font-medium text-black dark:text-white">{amount} {fromCur || "-"}</p>
                </div>
                <div className="flex items-center justify-between py-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Swap To</p>
                  <p className="text-xs font-medium text-black dark:text-white">{converted.toFixed(2)} {toCur || "-"}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-gray-600 dark:text-gray-400 text-[11px]">Enter Transaction PIN</p>
                <div className="w-full flex items-center bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3">
                  <input
                    value={walletPin}
                    onChange={(e) => setWalletPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    className="w-full bg-transparent border-none outline-none text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-600 text-sm"
                    placeholder="Enter PIN"
                    inputMode="numeric"
                    type="password"
                    maxLength={4}
                  />
                  {fingerprintEnabled ? (
                    <button
                      type="button"
                      className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/10 border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/15 transition-colors"
                      aria-label="Use fingerprint"
                      onClick={() =>
                        ErrorToast({
                          title: "Fingerprint not available",
                          descriptions: ["Fingerprint sign-in isn't enabled on web yet."],
                        })
                      }
                    >
                      <FaFingerprint className="text-gray-600 dark:text-gray-300 text-lg" />
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-5 pb-5">
          {step === "details" ? (
            <button
              onClick={() => setStep("confirm")}
              disabled={!canNext}
              className="w-full px-4 py-3 rounded-full bg-[#FF6B2C] text-black font-semibold hover:bg-[#FF7A3D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep("details")}
                className="flex-1 px-4 py-3 rounded-full bg-[#2C2C2E] text-white hover:bg-[#353539] transition-colors font-medium"
              >
                Back
              </button>
              <button
                onClick={() => {
                  if (!fromCur || !toCur) return;
                  convert({ amount, fromCurrency: fromCur, toCurrency: toCur, walletPin });
                }}
                disabled={!canPay || converting}
                className="flex-1 px-4 py-3 rounded-full bg-[#FF6B2C] text-black font-semibold hover:bg-[#FF7A3D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {converting ? "Processing..." : "Pay"}
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
            setStep("details");
            setWalletPin("");
            setAmountText("");
            setFromCur(null);
            setToCur(null);
            onClose();
          }}
          transaction={transactionData}
        />
      )}
    </>
  );
};

export default ConvertCurrencyBillSteps;



