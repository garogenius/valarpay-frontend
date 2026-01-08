"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaFingerprint } from "react-icons/fa";
import SpinnerLoader from "@/components/Loader/SpinnerLoader";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import useUserStore from "@/store/user.store";
import { CURRENCY } from "@/constants/types";
import GlobalTransactionHistoryModal from "@/components/shared/GlobalTransactionHistoryModal";
import { useFingerprintForPayments } from "@/store/paymentPreferences.store";
import {
  useGetInternationalAirtimePlan,
  usePayForInternationalAirtime,
} from "@/api/airtime/airtime.queries";

type Step = "details" | "confirm";

type IntlPlanData = {
  operatorId: number;
  name: string;
  denominationType?: "RANGE" | "FIXED";
  localFixedAmounts?: number[];
  destinationCurrencyCode?: string;
  fx?: { rate: number };
  minAmount?: number;
  maxAmount?: number;
  payAmount?: number;
};

const InternationalAirtimeBillSteps: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user } = useUserStore();
  const fingerprintEnabled = useFingerprintForPayments();
  const ngnWallet = user?.wallet?.find((w: any) => w.currency === CURRENCY.NGN);
  const walletAccountNumber = ngnWallet?.accountNumber || "";

  const [step, setStep] = useState<Step>("details");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedFixedAmount, setSelectedFixedAmount] = useState<number | null>(null);
  const [amountText, setAmountText] = useState("");
  const [walletPin, setWalletPin] = useState("");

  const [planOpen, setPlanOpen] = useState(false);
  const planRef = useRef<HTMLDivElement>(null);

  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionData, setTransactionData] = useState<any>(null);

  const { data, isPending: planPending, isError: planError } = useGetInternationalAirtimePlan({
    phone: phoneNumber,
  });
  const loadingPlan = planPending && !planError;

  const plan: IntlPlanData | null = useMemo(() => data?.data?.data ?? null, [data]);
  const providerName = plan?.name || "International Airtime";

  // If FIXED, default select first value
  useEffect(() => {
    if (!plan) return;
    if (plan.denominationType === "FIXED" && Array.isArray(plan.localFixedAmounts) && plan.localFixedAmounts.length) {
      setSelectedFixedAmount(plan.localFixedAmounts[0]);
    }
  }, [plan?.operatorId]);

  const effectiveLocalAmount = useMemo(() => {
    if (!plan) return 0;
    if (plan.denominationType === "FIXED") return Number(selectedFixedAmount) || 0;
    return Number(amountText) || 0;
  }, [plan, selectedFixedAmount, amountText]);

  // backend expects NGN amount? existing stage divides by rate + payAmount; keep consistent with old flow
  const amountForPayment = useMemo(() => {
    if (!plan) return 0;
    const rate = Number(plan.fx?.rate || 1) || 1;
    const payAmount = Number(plan.payAmount || 0) || 0;
    // Convert displayed local amount back to base amount and add payAmount fee
    return effectiveLocalAmount > 0 ? Number(effectiveLocalAmount / rate + payAmount) : 0;
  }, [plan, effectiveLocalAmount]);

  const formatMoney = (v: number, cur = "NGN") => {
    const symbol = cur === "NGN" ? "₦" : "";
    return `${symbol}${new Intl.NumberFormat("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
      Number.isFinite(v) ? v : 0
    )}`;
  };

  const onPayError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage) ? errorMessage : [errorMessage || "International airtime purchase failed"];
    ErrorToast({ title: "Error during international airtime purchase", descriptions });
  };

  const onPaySuccess = (data: any) => {
    SuccessToast({ title: "International airtime successful", description: "Your purchase was successful" });
    const ref = data?.data?.data?.transactionRef || data?.data?.data?.reference || `intl_airtime_${Date.now()}`;
    const now = new Date().toISOString();
    setTransactionData({
      id: ref,
      type: "AIRTIME",
      status: "SUCCESSFUL",
      direction: "debit",
      amount: Number(amountForPayment) || 0,
      currency: "NGN",
      reference: ref,
      createdAt: now,
      paymentMethod: "Available Balance",
      senderName: user?.fullname || undefined,
      senderAccount: walletAccountNumber,
      recipientName: providerName,
      recipientAccount: phoneNumber,
      recipientBank: providerName,
      description: "International Airtime",
      network: providerName,
      billerNumber: phoneNumber,
      planName: plan?.denominationType === "FIXED" ? String(selectedFixedAmount ?? "") : undefined,
    });
    setShowSuccess(true);
  };

  const { mutate: payIntl, isPending: payPending, isError: payErr } = usePayForInternationalAirtime(onPayError, onPaySuccess);
  const paying = payPending && !payErr;

  const min = Number(plan?.minAmount || 0) || 0;
  const max = Number(plan?.maxAmount || 0) || 0;
  const destCur = plan?.destinationCurrencyCode || "";

  const canNext =
    !!plan &&
    phoneNumber.length >= 7 &&
    effectiveLocalAmount > 0 &&
    (plan.denominationType !== "RANGE" || (effectiveLocalAmount >= min && (max ? effectiveLocalAmount <= max : true)));
  const canPay = canNext && walletPin.length === 4;

  return (
    <>
      <div className="w-full flex flex-col bg-white dark:bg-[#0A0A0A]">
        <div className="px-5 pt-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#0A0A0A] dark:text-white text-sm font-semibold">International Airtime</p>
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
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-gray-500 dark:text-gray-400">Phone Number</label>
                <div className="w-full flex items-center bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm">
                  <input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.trim())}
                    className="w-full bg-transparent border-none outline-none text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-600 text-sm"
                    placeholder="e.g. +2348000000000"
                    inputMode="text"
                  />
                </div>
              </div>

              <div className="rounded-xl bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 p-4">
                {loadingPlan ? (
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                    <SpinnerLoader width={18} height={18} color="#FF6B2C" /> Fetching provider...
                  </div>
                ) : plan ? (
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Provider</p>
                    <p className="text-xs font-medium text-black dark:text-white">{providerName}</p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-600 dark:text-gray-400">Enter phone number to fetch provider</p>
                )}
              </div>

              {plan?.denominationType === "FIXED" && Array.isArray(plan.localFixedAmounts) ? (
                <div className="relative flex flex-col gap-1" ref={planRef}>
                  <label className="text-[11px] text-gray-500 dark:text-gray-400">Plan</label>
                  <button
                    type="button"
                    disabled={!plan?.localFixedAmounts?.length}
                    onClick={() => setPlanOpen((v) => !v)}
                    className="w-full flex items-center justify-between bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm text-black dark:text-white disabled:opacity-60"
                  >
                    <span className={selectedFixedAmount ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-600"}>
                      {selectedFixedAmount ? `${selectedFixedAmount} ${destCur}` : "Select Plan"}
                    </span>
                    <span className="text-gray-500 dark:text-gray-500">▾</span>
                  </button>

                  {planOpen && (
                    <div className="absolute left-0 top-full mt-2 w-full bg-white dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden max-h-52 overflow-y-auto shadow-2xl z-[9999]">
                      {plan.localFixedAmounts.map((a) => (
                        <button
                          key={a}
                          type="button"
                          onClick={() => {
                            setSelectedFixedAmount(a);
                            setPlanOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-[#1C1C1E] transition-colors"
                        >
                          {a} {destCur}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-gray-500 dark:text-gray-400">
                    Amount {destCur ? `(${destCur})` : ""}
                  </label>
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
                  {plan?.denominationType === "RANGE" && min > 0 && max > 0 ? (
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      Min {min} {destCur} • Max {max} {destCur}
                    </p>
                  ) : null}
                </div>
              )}

              {amountForPayment > 0 ? (
                <div className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-800/40">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400" />
                    <p className="text-xs text-green-700 dark:text-green-300 font-medium">
                      {formatMoney(amountForPayment, "NGN")}
                    </p>
                  </div>
                  <p className="text-[11px] text-green-700 dark:text-green-300">From Available Balance</p>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="w-full flex flex-col gap-4">
              <div className="rounded-xl bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 p-4">
                <div className="flex items-center justify-between py-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Provider</p>
                  <p className="text-xs font-medium text-black dark:text-white">{providerName}</p>
                </div>
                <div className="flex items-center justify-between py-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Phone Number</p>
                  <p className="text-xs font-medium text-black dark:text-white">{phoneNumber || "-"}</p>
                </div>
                <div className="flex items-center justify-between py-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Amount Debited</p>
                  <p className="text-xs font-semibold text-black dark:text-white">{formatMoney(amountForPayment, "NGN")}</p>
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
                  if (!plan) return;
                  payIntl({
                    phone: phoneNumber,
                    currency: "NGN",
                    operatorId: plan.operatorId,
                    amount: Number(amountForPayment),
                    addBeneficiary: false,
                    walletPin,
                  });
                }}
                disabled={!canPay || paying}
                className="flex-1 px-4 py-3 rounded-full bg-[#FF6B2C] text-black font-semibold hover:bg-[#FF7A3D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {paying ? "Processing..." : "Pay"}
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
            setSelectedFixedAmount(null);
            setAmountText("");
            setWalletPin("");
            setPhoneNumber("");
            onClose();
          }}
          transaction={transactionData}
        />
      )}
    </>
  );
};

export default InternationalAirtimeBillSteps;




















