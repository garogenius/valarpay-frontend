"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useMemo, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaFingerprint } from "react-icons/fa";
import NextImage from "next/image";
import SpinnerLoader from "@/components/Loader/SpinnerLoader";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import useUserStore from "@/store/user.store";
import { CURRENCY } from "@/constants/types";
import GlobalTransactionHistoryModal from "@/components/shared/GlobalTransactionHistoryModal";
import { useFingerprintForPayments } from "@/store/paymentPreferences.store";
import { useGetDataPlan, useGetDataVariation, usePayForData } from "@/api/data/data.queries";
import { getNetworkIconByString } from "@/utils/utilityFunctions";

type Step = "details" | "confirm";

const MobileDataBillSteps: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user } = useUserStore();
  const fingerprintEnabled = useFingerprintForPayments();
  const ngnWallet = user?.wallet?.find((w: any) => w.currency === CURRENCY.NGN);
  const walletAccountNumber = ngnWallet?.accountNumber || "";

  const [step, setStep] = useState<Step>("details");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [planOpen, setPlanOpen] = useState(false);
  const [amountOpen, setAmountOpen] = useState(false);
  const planRef = useRef<HTMLDivElement>(null);
  const amountRef = useRef<HTMLDivElement>(null);

  const [selectedPlan, setSelectedPlan] = useState<any>(null); // NetworkPlan
  const [selectedAmountKey, setSelectedAmountKey] = useState<string>("");
  const [walletPin, setWalletPin] = useState("");

  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionData, setTransactionData] = useState<any>(null);

  const cleanPhone = phoneNumber.replace(/\D/g, "").slice(-11);
  const { network, networkPlans, isLoading: plansPending, isError: plansError } = useGetDataPlan({
    phone: cleanPhone,
    currency: "NGN",
  });
  const plansLoading = plansPending && !plansError;

  // Auto-select first plan when network is detected and plans are available
  React.useEffect(() => {
    if (network && networkPlans && networkPlans.length > 0 && !selectedPlan) {
      // Auto-select the first plan when network is detected
      setSelectedPlan(networkPlans[0]);
    }
  }, [network, networkPlans, selectedPlan]);

  const operatorId = useMemo(() => Number(selectedPlan?.operatorId || 0) || 0, [selectedPlan]);

  const { variations, isPending: varsPending, isError: varsError } = useGetDataVariation({
    operatorId: operatorId || undefined,
  });
  const varsLoading = varsPending && !varsError;

  const amountOptions = useMemo(() => {
    const map = variations || {};
    return Object.keys(map || {}).sort((a, b) => Number(a) - Number(b));
  }, [variations]);

  const selectedPlanLabel = useMemo(() => {
    if (!selectedPlan) return "";
    return String(selectedPlan.planName || selectedPlan.name || selectedPlan.network || "").trim() || "Plan";
  }, [selectedPlan]);

  const selectedAmountLabel = useMemo(() => {
    if (!selectedAmountKey) return "";
    const desc = (variations || {})[selectedAmountKey];
    return String(desc || `${selectedAmountKey}`).trim();
  }, [selectedAmountKey, variations]);

  const amount = useMemo(() => Number(selectedAmountKey) || 0, [selectedAmountKey]);

  const formatNgn = (v: number) =>
    `₦${new Intl.NumberFormat("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
      Number.isFinite(v) ? v : 0
    )}`;

  const onPayError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage) ? errorMessage : [errorMessage || "Data purchase failed"];
    ErrorToast({ title: "Error during data purchase", descriptions });
  };

  const onPaySuccess = (data: any) => {
    SuccessToast({ title: "Data purchase successful", description: "Your purchase was successful" });
    const ref = data?.data?.data?.transactionRef || data?.data?.data?.reference || `data_${Date.now()}`;
    const now = new Date().toISOString();
    setTransactionData({
      id: ref,
      type: "DATA",
      status: "SUCCESSFUL",
      direction: "debit",
      amount: Number(amount) || 0,
      currency: "NGN",
      reference: ref,
      createdAt: now,
      paymentMethod: "Available Balance",
      senderName: user?.fullname || undefined,
      senderAccount: walletAccountNumber,
      recipientName: (network || selectedPlan?.network || "Data").toString().toUpperCase(),
      recipientAccount: phoneNumber,
      recipientBank: "Mobile Data",
      description: "Mobile Data",
      network: (network || selectedPlan?.network || "").toString().toUpperCase(),
      billerNumber: phoneNumber,
      planName: selectedAmountLabel || undefined,
    });
    setShowSuccess(true);
  };

  const { mutate: payData, isPending: payPending, isError: payErr } = usePayForData(onPayError, onPaySuccess);
  const paying = payPending && !payErr;

  const canNext = phoneNumber.length >= 10 && !!selectedPlan && amount > 0;
  const canPay = canNext && walletPin.length === 4;

  return (
    <>
      <div className="w-full flex flex-col bg-white dark:bg-bg-1100">
        <div className="px-5 pt-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#0A0A0A] dark:text-white text-sm font-semibold">Mobile Data</p>
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
                    placeholder="Enter phone number"
                    inputMode="text"
                  />
                </div>
              </div>

              <div className="rounded-xl bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 p-4">
                {plansLoading ? (
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                    <SpinnerLoader width={18} height={18} color="#FF6B2C" /> Detecting network...
                  </div>
                ) : network ? (
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Network</p>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const networkIcon = getNetworkIconByString(String(network).toLowerCase());
                        return networkIcon ? (
                          <NextImage
                            src={networkIcon}
                            alt={String(network)}
                            width={20}
                            height={20}
                            className="w-5 h-5 object-contain"
                          />
                        ) : null;
                      })()}
                      <p className="text-xs font-medium text-black dark:text-white">{String(network).toUpperCase()}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-600 dark:text-gray-400">Enter phone number to detect network</p>
                )}
              </div>

              {/* Plan */}
              <div className="relative flex flex-col gap-1" ref={planRef}>
                <label className="text-[11px] text-gray-500 dark:text-gray-400">Plan</label>
                <button
                  type="button"
                  onClick={() => setPlanOpen((v) => !v)}
                  disabled={!networkPlans?.length}
                  className="w-full flex items-center justify-between bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm text-black dark:text-white disabled:opacity-60"
                >
                  <span className={selectedPlan ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-600"}>
                    {selectedPlan ? selectedPlanLabel : "Select plan"}
                  </span>
                  <span className="text-gray-500 dark:text-gray-500">▾</span>
                </button>

                {planOpen && (
                  <div className="absolute left-0 top-full mt-2 w-full bg-white dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden max-h-52 overflow-y-auto shadow-2xl z-[999999]">
                    {(networkPlans || []).map((p: any) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setSelectedPlan(p);
                          setSelectedAmountKey("");
                          setPlanOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-[#1C1C1E] transition-colors"
                      >
                        {String(p.planName || p.name || "Plan")}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Amount / Variation */}
              <div className="relative flex flex-col gap-1" ref={amountRef}>
                <label className="text-[11px] text-gray-500 dark:text-gray-400">Bundle</label>
                <button
                  type="button"
                  onClick={() => setAmountOpen((v) => !v)}
                  disabled={!operatorId}
                  className="w-full flex items-center justify-between bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm text-black dark:text-white disabled:opacity-60"
                >
                  <span className={selectedAmountKey ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-600"}>
                    {selectedAmountKey ? selectedAmountLabel : operatorId ? "Select bundle" : "Select plan first"}
                  </span>
                  <span className="text-gray-500 dark:text-gray-500">▾</span>
                </button>

                {amountOpen && (
                  <div className="absolute left-0 top-full mt-2 w-full bg-white dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden max-h-52 overflow-y-auto shadow-2xl z-[999999]">
                    {varsLoading ? (
                      <div className="p-4 flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                        <SpinnerLoader width={18} height={18} color="#FF6B2C" /> Loading...
                      </div>
                    ) : (
                      amountOptions.map((k) => (
                        <button
                          key={k}
                          type="button"
                          onClick={() => {
                            setSelectedAmountKey(k);
                            setAmountOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-[#1C1C1E] transition-colors"
                        >
                          {String((variations || {})[k] || k)}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {amount > 0 ? (
                <div className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-800/40">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400" />
                    <p className="text-xs text-green-700 dark:text-green-300 font-medium">{formatNgn(amount)}</p>
                  </div>
                  <p className="text-[11px] text-green-700 dark:text-green-300">From Available Balance</p>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="w-full flex flex-col gap-4">
              <div className="rounded-xl bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 p-4">
                <div className="flex items-center justify-between py-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Network</p>
                  <p className="text-xs font-medium text-black dark:text-white">
                    {String(network || selectedPlan?.network || "-").toUpperCase()}
                  </p>
                </div>
                <div className="flex items-center justify-between py-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Phone Number</p>
                  <p className="text-xs font-medium text-black dark:text-white">{phoneNumber || "-"}</p>
                </div>
                <div className="flex items-center justify-between py-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Plan</p>
                  <p className="text-xs font-medium text-black dark:text-white">{selectedAmountLabel || "-"}</p>
                </div>
                <div className="flex items-center justify-between py-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Amount Debited</p>
                  <p className="text-xs font-semibold text-black dark:text-white">{formatNgn(amount)}</p>
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
                  if (!selectedPlan) return;
                  payData({
                    phone: phoneNumber,
                    currency: "NGN",
                    operatorId: Number(selectedPlan.operatorId),
                    amount: Number(amount),
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
            setSelectedPlan(null);
            setSelectedAmountKey("");
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

export default MobileDataBillSteps;




















