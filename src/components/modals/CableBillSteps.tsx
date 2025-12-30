"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaFingerprint } from "react-icons/fa";
import SpinnerLoader from "@/components/Loader/SpinnerLoader";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import useUserStore from "@/store/user.store";
import { CURRENCY, CablePlan, CableVariationProps } from "@/constants/types";
import GlobalTransactionHistoryModal from "@/components/shared/GlobalTransactionHistoryModal";
import { useFingerprintForPayments } from "@/store/paymentPreferences.store";
import {
  useGetCablePlans,
  useGetCableVariations,
  usePayForCable,
  useVerifyCableNumber,
} from "@/api/cable/cable.queries";

type Step = "details" | "confirm";

const CableBillSteps: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user } = useUserStore();
  const fingerprintEnabled = useFingerprintForPayments();
  const ngnWallet = user?.wallet?.find((w: any) => w.currency === CURRENCY.NGN);
  const walletAccountNumber = ngnWallet?.accountNumber || "";

  const [step, setStep] = useState<Step>("details");

  const [providerOpen, setProviderOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const providerRef = useRef<HTMLDivElement>(null);
  const planRef = useRef<HTMLDivElement>(null);

  const [provider, setProvider] = useState<CablePlan | null>(null);
  const [plan, setPlan] = useState<CableVariationProps | null>(null);
  const [smartcardNumber, setSmartcardNumber] = useState("");
  const [walletPin, setWalletPin] = useState("");

  const [verifiedName, setVerifiedName] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionData, setTransactionData] = useState<any>(null);

  const { cablePlans, isPending: plansPending, isError: plansError } = useGetCablePlans({
    currency: "NGN",
    isEnabled: true,
  });
  const plansLoading = plansPending && !plansError;

  const { variations, isLoading: variationsPending, isError: variationsError } = useGetCableVariations({
    billerCode: provider?.billerCode || "",
  });
  const variationsLoading = variationsPending && !variationsError;

  useEffect(() => {
    setPlan(null);
    setVerifiedName("");
  }, [provider?.billerCode]);

  const providerLabel =
    String((provider as any)?.planName || "").trim() ||
    String((provider as any)?.shortName || "").trim() ||
    String((provider as any)?.description || "").trim() ||
    String((provider as any)?.billerCode || "").trim() ||
    "Cable TV";

  const amount = useMemo(() => {
    if (!plan) return 0;
    const base = Number((plan as any).payAmount || plan.amount || 0);
    const fee = Number((plan as any).fee || 0);
    return base + fee;
  }, [plan]);

  const formatNgn = (v: number) =>
    `₦${new Intl.NumberFormat("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
      Number.isFinite(v) ? v : 0
    )}`;

  const onVerifyError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage) ? errorMessage : [errorMessage || "Verification failed"];
    ErrorToast({ title: "Unable to verify smartcard", descriptions });
  };

  const onVerifySuccess = (data: any) => {
    const name = data?.data?.data?.customerName || data?.data?.data?.name || "";
    setVerifiedName(String(name || ""));
    setStep("confirm");
  };

  const { mutate: verifySmartcard, isPending: verifying, isError: verifyErr } = useVerifyCableNumber(
    onVerifyError,
    onVerifySuccess
  );
  const verifyLoading = verifying && !verifyErr;

  const onPayError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage) ? errorMessage : [errorMessage || "Cable purchase failed"];
    ErrorToast({ title: "Error during cable purchase", descriptions });
  };

  const onPaySuccess = (data: any) => {
    SuccessToast({ title: "Cable payment successful", description: "Your purchase was successful" });
    const ref = data?.data?.data?.transactionRef || data?.data?.data?.reference || `cable_${Date.now()}`;
    const now = new Date().toISOString();
    setTransactionData({
      id: ref,
      type: "CABLE",
      status: "SUCCESSFUL",
      direction: "debit",
      amount: Number(amount) || 0,
      currency: "NGN",
      reference: ref,
      createdAt: now,
      paymentMethod: "Available Balance",
      senderName: user?.fullname || undefined,
      senderAccount: walletAccountNumber,
      recipientName: providerLabel,
      recipientAccount: smartcardNumber,
      recipientBank: providerLabel,
      description: plan?.name || "Cable TV",
      provider: providerLabel,
      billerNumber: smartcardNumber,
      planName: plan?.name || undefined,
      validity: (plan as any)?.validity_period || undefined,
    });
    setShowSuccess(true);
  };

  const { mutate: payCable, isPending: payPending, isError: payErr } = usePayForCable(onPayError, onPaySuccess);
  const paying = payPending && !payErr;

  const canNext = !!provider && !!plan && smartcardNumber.length >= 6;
  const canPay = canNext && walletPin.length === 4;

  return (
    <>
      <div className="w-full flex flex-col bg-white dark:bg-[#0A0A0A]">
        <div className="px-5 pt-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#0A0A0A] dark:text-white text-sm font-semibold">Cable TV</p>
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
              <div className="relative flex flex-col gap-1" ref={providerRef}>
                <label className="text-[11px] text-gray-500 dark:text-gray-400">Provider</label>
                <button
                  type="button"
                  onClick={() => setProviderOpen((v) => !v)}
                  className="w-full flex items-center justify-between bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm text-black dark:text-white"
                >
                  <span className={provider ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-600"}>
                    {provider ? providerLabel : "Select provider"}
                  </span>
                  <span className="text-gray-500 dark:text-gray-500">▾</span>
                </button>
                {providerOpen && (
                  <div className="absolute left-0 top-full mt-2 w-full bg-white dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden max-h-52 overflow-y-auto shadow-2xl z-20">
                    {plansLoading ? (
                      <div className="p-4 flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                        <SpinnerLoader width={18} height={18} color="#FF6B2C" /> Loading...
                      </div>
                    ) : (
                      (cablePlans || []).map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setProvider(p);
                            setProviderOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-[#1C1C1E] transition-colors"
                        >
                          {String((p as any).planName || (p as any).shortName || (p as any).description || "Cable TV")}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-gray-500 dark:text-gray-400">Smartcard Number</label>
                <div className="w-full flex items-center bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm">
                  <input
                    value={smartcardNumber}
                    onChange={(e) => setSmartcardNumber(e.target.value.replace(/\D/g, "").slice(0, 12))}
                    className="w-full bg-transparent border-none outline-none text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-600 text-sm"
                    placeholder="Enter smartcard number"
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div className="relative flex flex-col gap-1" ref={planRef}>
                <label className="text-[11px] text-gray-500 dark:text-gray-400">Plan</label>
                <button
                  type="button"
                  disabled={!provider}
                  onClick={() => provider && setPlanOpen((v) => !v)}
                  className="w-full flex items-center justify-between bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm text-black dark:text-white disabled:opacity-60"
                >
                  <span className={plan ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-600"}>
                    {plan ? plan.name : provider ? "Select plan" : "Select provider first"}
                  </span>
                  <span className="text-gray-500 dark:text-gray-500">▾</span>
                </button>
                {planOpen && (
                  <div className="absolute left-0 top-full mt-2 w-full bg-white dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden max-h-52 overflow-y-auto shadow-2xl z-20">
                    {variationsLoading ? (
                      <div className="p-4 flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                        <SpinnerLoader width={18} height={18} color="#FF6B2C" /> Loading...
                      </div>
                    ) : (
                      (variations || []).map((v) => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => {
                            setPlan(v);
                            setPlanOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-[#1C1C1E] transition-colors"
                        >
                          {v.name}
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
                  <p className="text-xs text-gray-600 dark:text-gray-400">Provider</p>
                  <p className="text-xs font-medium text-black dark:text-white">{providerLabel}</p>
                </div>
                <div className="flex items-center justify-between py-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Smartcard</p>
                  <p className="text-xs font-medium text-black dark:text-white">{smartcardNumber || "-"}</p>
                </div>
                <div className="flex items-center justify-between py-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Plan</p>
                  <p className="text-xs font-medium text-black dark:text-white">{plan?.name || "-"}</p>
                </div>
                {verifiedName ? (
                  <div className="flex items-center justify-between py-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Customer</p>
                    <p className="text-xs font-medium text-black dark:text-white">{verifiedName}</p>
                  </div>
                ) : null}
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
              onClick={() => {
                if (!provider || !plan) return;
                verifySmartcard({
                  billerCode: provider.billerCode,
                  itemCode: plan.item_code,
                  billerNumber: smartcardNumber,
                });
              }}
              disabled={!canNext || verifyLoading}
              className="w-full px-4 py-3 rounded-full bg-[#FF6B2C] text-black font-semibold hover:bg-[#FF7A3D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {verifyLoading ? "Verifying..." : "Next"}
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
                  if (!provider || !plan) return;
                  payCable({
                    billerCode: provider.billerCode,
                    billerNumber: smartcardNumber,
                    itemCode: plan.item_code,
                    currency: "NGN",
                    walletPin,
                    amount: Number(amount),
                    addBeneficiary: false,
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
            setPlan(null);
            setSmartcardNumber("");
            setWalletPin("");
            setVerifiedName("");
            onClose();
          }}
          transaction={transactionData}
        />
      )}
    </>
  );
};

export default CableBillSteps;















