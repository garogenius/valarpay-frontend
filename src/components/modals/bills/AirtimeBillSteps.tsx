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
import { useGetAirtimeNetWorkProvider, usePayForAirtime, useGetAirtimePlan } from "@/api/airtime/airtime.queries";
import { getNetworkIconByString } from "@/utils/utilityFunctions";

type Step = "details" | "confirm";

type AirtimeProvider = {
  operatorId: number;
  name: string;
};

const AirtimeBillSteps: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user } = useUserStore();
  const fingerprintEnabled = useFingerprintForPayments();
  const ngnWallet = user?.wallet?.find((w: any) => w.currency === CURRENCY.NGN);
  const walletAccountNumber = ngnWallet?.accountNumber || "";

  const [step, setStep] = useState<Step>("details");

  const [providerOpen, setProviderOpen] = useState(false);
  const providerRef = useRef<HTMLDivElement>(null);

  const [provider, setProvider] = useState<AirtimeProvider | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amountText, setAmountText] = useState("");
  const amount = useMemo(() => Number(amountText) || 0, [amountText]);
  const [walletPin, setWalletPin] = useState("");

  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionData, setTransactionData] = useState<any>(null);

  const { data, isPending: providersPending, isError: providersError } = useGetAirtimeNetWorkProvider();
  const providersLoading = providersPending && !providersError;

  const providers: AirtimeProvider[] = useMemo(() => {
    const raw = data?.data?.data ?? data?.data ?? [];
    return (raw || [])
      .map((p: any) => ({
        operatorId: Number(p.operatorId ?? p.id ?? p.operator_id),
        name: String(p.name ?? p.operator ?? p.network ?? "Network"),
      }))
      .filter((p: AirtimeProvider) => !!p.operatorId && !!p.name);
  }, [data]);

  // Auto-detect network when phone number is 11 digits
  const cleanPhone = phoneNumber.replace(/\D/g, "");
  const { data: airtimePlanData, isPending: detectingNetwork } = useGetAirtimePlan({
    phone: cleanPhone.length === 11 ? cleanPhone : "",
    currency: "NGN",
  });

  // Auto-select provider when network is detected
  React.useEffect(() => {
    if (!airtimePlanData?.data?.data) return;
    
    const planData = airtimePlanData.data.data;
    const detectedNetwork = planData?.network;
    const operatorId = planData?.plan?.operatorId;
    
    if (detectedNetwork && operatorId && providers.length > 0) {
      // Find provider that matches the detected network
      const matchedProvider = providers.find((p) => {
        const providerName = p.name.toLowerCase();
        const networkName = String(detectedNetwork).toLowerCase();
        return (
          providerName === networkName ||
          providerName.includes(networkName) ||
          networkName.includes(providerName) ||
          Number(p.operatorId) === Number(operatorId)
        );
      });
      
      if (matchedProvider && (!provider || provider.operatorId !== matchedProvider.operatorId)) {
        setProvider(matchedProvider);
      }
    }
  }, [airtimePlanData?.data?.data, providers, phoneNumber]);

  const formatNgn = (v: number) =>
    `₦${new Intl.NumberFormat("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
      Number.isFinite(v) ? v : 0
    )}`;

  const onPayError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage) ? errorMessage : [errorMessage || "Airtime purchase failed"];
    ErrorToast({ title: "Error during airtime purchase", descriptions });
  };

  const onPaySuccess = (data: any) => {
    SuccessToast({ title: "Airtime purchase successful", description: "Your purchase was successful" });
    const ref = data?.data?.data?.transactionRef || data?.data?.data?.reference || `airtime_${Date.now()}`;
    const now = new Date().toISOString();
    setTransactionData({
      id: ref,
      type: "AIRTIME",
      status: "SUCCESSFUL",
      direction: "debit",
      amount: Number(amount) || 0,
      currency: "NGN",
      reference: ref,
      createdAt: now,
      paymentMethod: "Available Balance",
      senderName: user?.fullname || undefined,
      senderAccount: walletAccountNumber,
      recipientName: provider?.name || "Airtime",
      recipientAccount: phoneNumber,
      recipientBank: provider?.name || "Airtime",
      description: "Airtime purchase",
      network: provider?.name || undefined,
      billerNumber: phoneNumber,
    });
    setShowSuccess(true);
  };

  const { mutate: payAirtime, isPending: payPending, isError: payErr } = usePayForAirtime(onPayError, onPaySuccess);
  const paying = payPending && !payErr;

  const canNext = !!provider && phoneNumber.length >= 10 && amount > 0;
  const canPay = canNext && walletPin.length === 4;

  const providerLabel = provider?.name || "";

  return (
    <>
      <div className="w-full flex flex-col bg-white dark:bg-bg-1100">
        {/* Top bar */}
        <div className="px-5 pt-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#0A0A0A] dark:text-white text-sm font-semibold">Airtime</p>
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
              {/* Provider */}
              <div className="relative flex flex-col gap-1" ref={providerRef}>
                <label className="text-[11px] text-gray-500 dark:text-gray-400">Network</label>
                <button
                  type="button"
                  onClick={() => setProviderOpen((v) => !v)}
                  disabled={detectingNetwork}
                  className="w-full flex items-center justify-between bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm text-black dark:text-white disabled:opacity-60"
                >
                  <div className="flex items-center gap-3">
                    {detectingNetwork && cleanPhone.length === 11 ? (
                      <>
                        <SpinnerLoader width={16} height={16} color="#FF6B2C" />
                        <span className="text-gray-500 dark:text-gray-600">Detecting network...</span>
                      </>
                    ) : (
                      <>
                        {provider && (() => {
                          const networkIcon = getNetworkIconByString(provider.name.toLowerCase().replace(/\s+/g, ""));
                          return networkIcon ? (
                            <NextImage
                              src={networkIcon}
                              alt={provider.name}
                              width={20}
                              height={20}
                              className="w-5 h-5 object-contain"
                            />
                          ) : null;
                        })()}
                        <span className={provider ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-600"}>
                          {provider ? providerLabel : "Select Network"}
                        </span>
                      </>
                    )}
                  </div>
                  {!detectingNetwork && <span className="text-gray-500 dark:text-gray-500">▾</span>}
                </button>

                {providerOpen && (
                  <div className="absolute left-0 top-full mt-2 w-full bg-white dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden max-h-52 overflow-y-auto shadow-2xl z-[999999]">
                    {providersLoading ? (
                      <div className="p-4 flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                        <SpinnerLoader width={18} height={18} color="#FF6B2C" /> Loading...
                      </div>
                    ) : (
                      (providers || []).map((p) => {
                        const networkIcon = getNetworkIconByString(p.name.toLowerCase().replace(/\s+/g, ""));
                        return (
                          <button
                            key={p.operatorId}
                            type="button"
                            onClick={() => {
                              setProvider(p);
                              setProviderOpen(false);
                            }}
                            className="w-full text-left px-4 py-3 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-[#1C1C1E] transition-colors flex items-center gap-3"
                          >
                            {networkIcon && (
                              <NextImage
                                src={networkIcon}
                                alt={p.name}
                                width={24}
                                height={24}
                                className="w-6 h-6 object-contain"
                              />
                            )}
                            <span>{p.name}</span>
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-gray-500 dark:text-gray-400">Mobile Number</label>
                <div className="w-full flex items-center bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm">
                  <input
                    value={phoneNumber}
                    onChange={(e) => {
                      // Only allow digits, limit to 11 characters for local numbers
                      const cleaned = e.target.value.replace(/\D/g, "");
                      setPhoneNumber(cleaned.slice(0, 11));
                    }}
                    className="w-full bg-transparent border-none outline-none text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-600 text-sm"
                    placeholder="08012345678"
                    inputMode="numeric"
                    maxLength={11}
                  />
                </div>
                {cleanPhone.length === 11 && detectingNetwork && (
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Detecting network...</p>
                )}
              </div>

              {/* Amount */}
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

              {amount > 0 ? (
                <div className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-800/40">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400" />
                    <p className="text-xs text-green-700 dark:text-green-300 font-medium">
                      {formatNgn(amount)}
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
                  <p className="text-xs text-gray-600 dark:text-gray-400">Network</p>
                  <p className="text-xs font-medium text-black dark:text-white">{providerLabel || "-"}</p>
                </div>
                <div className="flex items-center justify-between py-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Mobile Number</p>
                  <p className="text-xs font-medium text-black dark:text-white">{phoneNumber || "-"}</p>
                </div>
                <div className="flex items-center justify-between py-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Amount</p>
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
                  if (!provider) return;
                  payAirtime({
                    phone: phoneNumber,
                    currency: "NGN",
                    operatorId: provider.operatorId,
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
            setProvider(null);
            setPhoneNumber("");
            setAmountText("");
            setWalletPin("");
            onClose();
          }}
          transaction={transactionData}
        />
      )}
    </>
  );
};

export default AirtimeBillSteps;


