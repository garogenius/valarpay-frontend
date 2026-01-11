"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaFingerprint } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import SpinnerLoader from "@/components/Loader/SpinnerLoader";
import useUserStore from "@/store/user.store";
import { useGetTransportPlans, useGetTransportBillInfo, usePayForTransport } from "@/api/transport/transport.queries";
import { CURRENCY } from "@/constants/types";
import GlobalTransactionHistoryModal from "@/components/shared/GlobalTransactionHistoryModal";
import { useFingerprintForPayments } from "@/store/paymentPreferences.store";
import useGlobalModalsStore from "@/store/globalModals.store";

type Step = "details" | "confirm";

const TransportBillSteps: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user } = useUserStore();
  const fingerprintEnabled = useFingerprintForPayments();
  const ngnWallet = user?.wallet?.find((w: any) => w.currency === CURRENCY.NGN);
  const walletAccountNumber = ngnWallet?.accountNumber || "";

  const [step, setStep] = useState<Step>("details");

  const [providerOpen, setProviderOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);

  const [provider, setProvider] = useState<any | null>(null);
  const [plan, setPlan] = useState<any | null>(null);

  const [billerNumber, setBillerNumber] = useState("");
  const [walletPin, setWalletPin] = useState("");

  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionData, setTransactionData] = useState<any>(null);

  const providerRef = useRef<HTMLDivElement>(null);
  const planRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (providerRef.current && !providerRef.current.contains(e.target as Node)) setProviderOpen(false);
      if (planRef.current && !planRef.current.contains(e.target as Node)) setPlanOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const { transportPlans, isPending: plansPending, isError: plansError } = useGetTransportPlans({
    currency: "NGN",
  });
  const plansLoading = plansPending && !plansError;

  const providerLabel = useMemo(() => {
    if (!provider) return "";
    const fromName = String((provider as any).name || "").trim();
    if (fromName) return fromName;
    const fromBillerCode = String((provider as any).billerCode || "").trim();
    if (fromBillerCode) return fromBillerCode;
    return "Transport";
  }, [provider]);

  const { plans, isLoading: billInfoLoading, isError: billInfoError } = useGetTransportBillInfo({
    billerCode: provider?.billerCode || "",
  });
  const variationsLoading = billInfoLoading && !billInfoError;

  // Reset plan when provider changes
  useEffect(() => {
    setPlan(null);
  }, [provider?.billerCode]);

  const amount = useMemo(() => {
    if (!plan) return 0;
    const base = Number((plan as any).amount || (plan as any).payAmount || 0);
    const fee = Number((plan as any).fee || 0);
    return base + fee;
  }, [plan]);

  const formatNgn = (v: number) =>
    `₦${new Intl.NumberFormat("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
      Number.isFinite(v) ? v : 0
    )}`;

  const onPayTransportError = (error: any) => {
    // Hide processing loader
    useGlobalModalsStore.getState().hideProcessingLoaderModal();
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage) ? errorMessage : [errorMessage || "Transport payment failed"];
    ErrorToast({ title: "Error during transport payment", descriptions });
  };

  const onPayTransportSuccess = (data: any) => {
    // Hide processing loader
    useGlobalModalsStore.getState().hideProcessingLoaderModal();
    SuccessToast({ title: "Transport payment successful", description: "Your payment was successful" });
    const ref = data?.data?.data?.transactionRef || `transport_${Date.now()}`;
    const now = new Date().toISOString();
    setTransactionData({
      id: ref,
      type: "BILL_PAYMENT",
      status: "SUCCESSFUL",
      direction: "debit",
      amount: Number(amount) || 0,
      currency: "NGN",
      reference: ref,
      createdAt: now,
      paymentMethod: "Available Balance",
      senderName: user?.fullname || undefined,
      senderAccount: walletAccountNumber,
      recipientName: providerLabel || "Transport",
      recipientAccount: billerNumber,
      recipientBank: providerLabel || "Transport",
      description: plan ? String((plan as any).name || "Transport") : "Transport",
      provider: providerLabel || undefined,
      billerNumber: billerNumber,
      planName: plan ? String((plan as any).name || "") : undefined,
    });
    setShowSuccess(true);
  };

  const { mutate: payTransport, isPending: payPending, isError: payErr } = usePayForTransport(
    onPayTransportError,
    onPayTransportSuccess
  );
  const paying = payPending && !payErr;

  const canNext = !!provider && !!plan && billerNumber.length >= 3;
  const canPay = canNext && walletPin.length === 4;

  const renderTopBar = () => (
    <div className="px-5 pt-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[#0A0A0A] dark:text-white text-sm font-semibold">Bus Tickets</p>
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
  );

  const renderDetails = () => (
    <div className="w-full flex flex-col gap-4">
      {/* Provider */}
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
          <div
            className="absolute left-0 top-full mt-2 w-full bg-white dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden max-h-52 overflow-y-auto shadow-2xl z-20"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#2C2C2E transparent" }}
          >
            {plansLoading ? (
              <div className="p-4 flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                <SpinnerLoader width={18} height={18} color="#FF6B2C" /> Loading...
              </div>
            ) : (
              (transportPlans || []).map((p: any) => (
                <button
                  key={p.id || p.billerCode}
                  type="button"
                  onClick={() => {
                    setProvider(p);
                    setProviderOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-[#1C1C1E] transition-colors"
                >
                  {String((p as any).name || "").trim() ||
                    String((p as any).billerCode || "").trim() ||
                    "Transport"}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Biller Number */}
      <div className="flex flex-col gap-1">
        <label className="text-[11px] text-gray-500 dark:text-gray-400">Customer Number</label>
        <div className="w-full flex items-center bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm text-black dark:text-white">
          <input
            value={billerNumber}
            onChange={(e) => {
              const raw = e.target.value;
              const cleaned = raw.replace(/[^\d]/g, "");
              setBillerNumber(cleaned.slice(0, 20));
            }}
            className="w-full bg-transparent border-none outline-none text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-600 text-sm"
            placeholder="Enter customer number"
            inputMode="numeric"
          />
        </div>
      </div>

      {/* Plan */}
      <div className="relative flex flex-col gap-1" ref={planRef}>
        <label className="text-[11px] text-gray-500 dark:text-gray-400">Plan</label>
        <button
          type="button"
          disabled={!provider}
          onClick={() => provider && setPlanOpen((v) => !v)}
          className={`w-full flex items-center justify-between bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm ${
            provider ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-600 opacity-60 cursor-not-allowed"
          }`}
        >
          <span className={plan ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-600"}>
            {plan ? String((plan as any).name || "") : "Select plan"}
          </span>
          <span className="text-gray-500 dark:text-gray-500">▾</span>
        </button>

        {planOpen && (
          <div
            className="absolute left-0 top-full mt-2 w-full bg-white dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden max-h-52 overflow-y-auto shadow-2xl z-20"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#2C2C2E transparent" }}
          >
            {variationsLoading ? (
              <div className="p-4 flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                <SpinnerLoader width={18} height={18} color="#FF6B2C" /> Loading...
              </div>
            ) : (
              (plans || []).map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    setPlan(v);
                    setPlanOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-[#1C1C1E] transition-colors"
                >
                  {String((v as any).name || "")} {v.amount ? `- ${formatNgn(v.amount)}` : ""}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Amount badge */}
      {amount > 0 ? (
        <div className="w-full flex items-center gap-2 rounded-lg px-3 py-3 bg-green-500/20 border border-green-700/40">
          <FiCheckCircle className="text-green-500 text-lg" />
          <p className="text-green-400 text-sm font-semibold">{formatNgn(amount)}</p>
        </div>
      ) : null}
    </div>
  );

  const renderConfirm = () => (
    <div className="w-full flex flex-col gap-4">
      <div className="bg-[#1C1C1E] rounded-lg p-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Provider</span>
          <span className="text-white text-sm font-medium">{provider ? providerLabel : "-"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Customer Number</span>
          <span className="text-white text-sm font-medium">{billerNumber || "-"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Plan</span>
          <span className="text-white text-sm font-medium">{plan ? String((plan as any).name || "") : "-"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Amount</span>
          <span className="text-white text-sm font-medium">{formatNgn(amount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Amount Debited</span>
          <span className="text-white text-sm font-medium">{formatNgn(amount)}</span>
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
              className="w-11 h-11 rounded-lg bg-white border border-white flex items-center justify-center hover:bg-gray-100 transition-colors"
              aria-label="Use fingerprint"
              onClick={() =>
                ErrorToast({
                  title: "Fingerprint not available",
                  descriptions: ["Fingerprint sign-in isn't enabled on web yet."],
                })
              }
            >
              <FaFingerprint className="text-black text-lg" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );

  const handlePay = () => {
    if (!provider?.billerCode || !plan || !canPay) return;
    
    // Show processing loader
    useGlobalModalsStore.getState().showProcessingLoaderModal();
    
    payTransport({
      billerCode: provider.billerCode,
      billerNumber: billerNumber,
      itemCode: String((plan as any).itemCode || plan.id || "TRANSPORT"),
      currency: "NGN",
      walletPin,
      amount: Number(amount),
      addBeneficiary: false,
    });
  };

  return (
    <>
      <div className="w-full flex flex-col bg-white dark:bg-[#0A0A0A]">
        {renderTopBar()}

        <div className="px-5 py-5 border-t border-gray-200 dark:border-gray-800">
          {step === "details" ? renderDetails() : renderConfirm()}
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
                onClick={handlePay}
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
            setBillerNumber("");
            setWalletPin("");
            onClose();
          }}
          transaction={transactionData}
        />
      )}
    </>
  );
};

export default TransportBillSteps;














