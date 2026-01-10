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
import {
  useGetEducationBillerItems,
  useGetEducationBillers,
  usePayEducationSchoolFee,
  useVerifyEducationCustomer,
  useGetSchoolBillInfo,
  useVerifySchoolBillerNumber,
  usePaySchoolFee,
  useGetSchoolFeePlan,
} from "@/api/education/education.queries";

type Step = "details" | "confirm";

const EducationBillSteps: React.FC<{ onClose: () => void; billerNameFilter?: (name: string) => boolean }> = ({
  onClose,
  billerNameFilter,
}) => {
  const { user } = useUserStore();
  const fingerprintEnabled = useFingerprintForPayments();
  const ngnWallet = user?.wallet?.find((w: any) => w.currency === CURRENCY.NGN);
  const walletAccountNumber = ngnWallet?.accountNumber || "";

  const [step, setStep] = useState<Step>("details");

  const [institutionOpen, setInstitutionOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const institutionRef = useRef<HTMLDivElement>(null);
  const serviceRef = useRef<HTMLDivElement>(null);

  const [biller, setBiller] = useState<any>(null);
  const [item, setItem] = useState<any>(null);
  const [customerId, setCustomerId] = useState("");
  const [amountText, setAmountText] = useState("");
  const amount = useMemo(() => Number(amountText) || 0, [amountText]);
  const [walletPin, setWalletPin] = useState("");

  const [verifiedCustomerName, setVerifiedCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState(user?.email || "");
  const [customerPhone, setCustomerPhone] = useState(user?.phoneNumber || "");

  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionData, setTransactionData] = useState<any>(null);

  // Institutions list must come from GET /bill/school/get-plan?currency=NGN
  const {
    institutions,
    isPending: institutionsPending,
    isError: institutionsError,
  } = useGetSchoolFeePlan("NGN", true);
  const institutionsLoading = institutionsPending && !institutionsError;

  const filteredBillers = useMemo(() => {
    const list = institutions || [];
    return billerNameFilter
      ? list.filter((b: any) => billerNameFilter(String(b.billerName || b.name || "")))
      : list;
  }, [institutions, billerNameFilter]);

  // Schools: returned shape: { id, name, amount, billerCode }
  const billerCode = String(biller?.billerCode || biller?.billerId || "");
  // Use school bill info endpoint to get plans/services
  const { plans, isPending: itemsPending, isError: itemsError } = useGetSchoolBillInfo(billerCode);
  const itemsLoading = itemsPending && !itemsError;
  
  // Map plans to items format for compatibility
  const items = plans.map((plan: any) => ({
    itemCode: plan.itemCode || `${billerCode}-${plan.name?.toUpperCase().replace(/\s+/g, "-") || plan.id}`,
    itemName: plan.name,
    name: plan.name,
    amount: plan.amount,
  }));

  const onVerifyError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage) ? errorMessage : [errorMessage || "Verification failed"];
    ErrorToast({ title: "Unable to verify customer", descriptions });
  };

  const onVerifySuccess = (data: any) => {
    const payload = data?.data?.data;
    setVerifiedCustomerName(String(payload?.customerName || payload?.name || ""));
    // Spec returns amount on verify; prefer it
    const verifiedAmount = Number(payload?.amount);
    if (Number.isFinite(verifiedAmount) && verifiedAmount > 0) {
      setAmountText(String(verifiedAmount));
    }
    setStep("confirm");
  };

  // Use school verification endpoint
  const { mutate: verifyCustomer, isPending: verifying, isError: verifyErr } = useVerifySchoolBillerNumber(
    onVerifyError,
    onVerifySuccess
  );
  const verifyLoading = verifying && !verifyErr;

  const onPayError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage) ? errorMessage : [errorMessage || "Education payment failed"];
    ErrorToast({ title: "Payment failed", descriptions });
  };

  const onPaySuccess = (data: any) => {
    SuccessToast({ title: "Payment successful", description: "Your payment was successful" });
    const ref = data?.data?.data?.transactionRef || data?.data?.data?.reference || `education_${Date.now()}`;
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
      recipientName: String(biller?.billerName || biller?.name || "Education"),
      recipientAccount: customerId,
      recipientBank: "Education",
      description: String(item?.itemName || item?.name || "Education"),
      provider: String(biller?.billerName || biller?.name || "Education"),
      billerNumber: customerId,
      planName: String(item?.itemName || item?.name || ""),
    });
    setShowSuccess(true);
  };

  // Use school payment endpoint
  const { mutate: payEducation, isPending: payPending, isError: payErr } = usePaySchoolFee(onPayError, onPaySuccess);
  const paying = payPending && !payErr;

  const billerLabel = String(biller?.billerName || biller?.name || "").trim();
  const itemLabel = String(item?.itemName || item?.name || "").trim();

  const canNext = !!billerCode && !!item?.itemCode && customerId.length >= 3 && amount > 0;
  const canPay = canNext && walletPin.length === 4 && !!(verifiedCustomerName || user?.fullname);

  return (
    <>
      <div className="w-full flex flex-col bg-white dark:bg-bg-1100">
        <div className="px-5 pt-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#0A0A0A] dark:text-white text-sm font-semibold">Education</p>
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
              <div className="relative flex flex-col gap-1" ref={institutionRef}>
                <label className="text-[11px] text-gray-500 dark:text-gray-400">Institution Name</label>
                <button
                  type="button"
                  onClick={() => setInstitutionOpen((v) => !v)}
                  className="w-full flex items-center justify-between bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm text-black dark:text-white"
                >
                  <span className={biller ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-600"}>
                    {biller ? billerLabel : "Select institution"}
                  </span>
                  <span className="text-gray-500 dark:text-gray-500">▾</span>
                </button>
                {institutionOpen && (
                  <div className="absolute left-0 top-full mt-2 w-full bg-white dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-xl overflow-x-hidden overflow-y-auto max-h-56 overscroll-contain touch-pan-y [-webkit-overflow-scrolling:touch] shadow-2xl z-[9999]">
                    {institutionsLoading ? (
                      <div className="p-4 flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                        <SpinnerLoader width={18} height={18} color="#FF6B2C" /> Loading...
                      </div>
                    ) : (
                      (filteredBillers || []).map((b: any) => (
                        <button
                          key={String(b.billerCode || b.billerId || b.id || b.billerName || b.name)}
                          type="button"
                          onClick={() => {
                            setBiller(b);
                            setItem(null);
                            setInstitutionOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-[#1C1C1E] transition-colors"
                        >
                          {String(b.billerName || b.name || b.billerCode || b.billerId)}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className="relative flex flex-col gap-1" ref={serviceRef}>
                <label className="text-[11px] text-gray-500 dark:text-gray-400">Service</label>
                <button
                  type="button"
                  disabled={!billerCode}
                  onClick={() => billerCode && setServiceOpen((v) => !v)}
                  className="w-full flex items-center justify-between bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm text-black dark:text-white disabled:opacity-60"
                >
                  <span className={item ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-600"}>
                    {item ? itemLabel : billerCode ? "Select service" : "Select institution first"}
                  </span>
                  <span className="text-gray-500 dark:text-gray-500">▾</span>
                </button>
                {serviceOpen && (
                  <div className="absolute left-0 top-full mt-2 w-full bg-white dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-xl overflow-x-hidden overflow-y-auto max-h-56 overscroll-contain touch-pan-y [-webkit-overflow-scrolling:touch] shadow-2xl z-[9999]">
                    {itemsLoading ? (
                      <div className="p-4 flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                        <SpinnerLoader width={18} height={18} color="#FF6B2C" /> Loading...
                      </div>
                    ) : (
                      (items || []).map((it: any) => (
                        <button
                          key={String(it.itemCode)}
                          type="button"
                          onClick={() => {
                            setItem(it);
                            if (it.amount) setAmountText(String(it.amount));
                            setServiceOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-[#1C1C1E] transition-colors"
                        >
                          {String(it.itemName || it.name || it.itemCode)}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-gray-500 dark:text-gray-400">Student ID</label>
                <div className="w-full flex items-center bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm">
                  <input
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value.trim())}
                    className="w-full bg-transparent border-none outline-none text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-600 text-sm"
                    placeholder="Enter student ID"
                    inputMode="text"
                  />
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
                    placeholder="NGN"
                    inputMode="decimal"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-4">
              <div className="rounded-xl bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 p-4">
                <div className="flex items-center justify-between py-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Institution</p>
                  <p className="text-xs font-medium text-black dark:text-white">{billerLabel || "-"}</p>
                </div>
                <div className="flex items-center justify-between py-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Service</p>
                  <p className="text-xs font-medium text-black dark:text-white">{itemLabel || "-"}</p>
                </div>
                <div className="flex items-center justify-between py-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Student ID</p>
                  <p className="text-xs font-medium text-black dark:text-white">{customerId || "-"}</p>
                </div>
                {verifiedCustomerName ? (
                  <div className="flex items-center justify-between py-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Student Name</p>
                    <p className="text-xs font-medium text-black dark:text-white">{verifiedCustomerName}</p>
                  </div>
                ) : null}
                <div className="flex items-center justify-between py-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Amount Debited</p>
                  <p className="text-xs font-semibold text-black dark:text-white">₦{Number(amount).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <p className="text-gray-600 dark:text-gray-400 text-[11px]">Email</p>
                  <div className="w-full flex items-center bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm">
                    <input
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-transparent border-none outline-none text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-600 text-sm"
                      placeholder="Email"
                      inputMode="email"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-gray-600 dark:text-gray-400 text-[11px]">Phone Number</p>
                  <div className="w-full flex items-center bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm">
                    <input
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-transparent border-none outline-none text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-600 text-sm"
                      placeholder="Phone"
                      inputMode="text"
                    />
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
            </div>
          )}
        </div>

        <div className="px-5 pb-5">
          {step === "details" ? (
            <button
              onClick={() => {
                if (!billerCode || !item?.itemCode) return;
                verifyCustomer({ 
                  billerCode, 
                  itemCode: String(item.itemCode), 
                  billerNumber: customerId 
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
                  if (!billerCode || !item?.itemCode) return;
                  payEducation({
                    itemCode: String(item.itemCode),
                    billerCode,
                    currency: "NGN",
                    billerNumber: customerId,
                    amount: Number(amount),
                    walletPin,
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
            setBiller(null);
            setItem(null);
            setCustomerId("");
            setAmountText("");
            setWalletPin("");
            setVerifiedCustomerName("");
            onClose();
          }}
          transaction={transactionData}
        />
      )}
    </>
  );
};

export default EducationBillSteps;




















