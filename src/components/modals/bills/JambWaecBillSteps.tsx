"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useMemo, useRef, useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaFingerprint } from "react-icons/fa";
import SpinnerLoader from "@/components/Loader/SpinnerLoader";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import useUserStore from "@/store/user.store";
import { CURRENCY } from "@/constants/types";
import GlobalTransactionHistoryModal from "@/components/shared/GlobalTransactionHistoryModal";
import { useFingerprintForPayments } from "@/store/paymentPreferences.store";
import useGlobalModalsStore from "@/store/globalModals.store";
import {
  useGetWaecPlan,
  useGetJambPlan,
  useVerifyWaecBillerNumber,
  useVerifyJambBillerNumber,
  usePayWaec,
  usePayJamb,
} from "@/api/education/education.queries";

type Step = "details" | "confirm";
type ExamType = "JAMB" | "WAEC" | null;

const JambWaecBillSteps: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user } = useUserStore();
  const fingerprintEnabled = useFingerprintForPayments();
  const ngnWallet = user?.wallet?.find((w: any) => w.currency === CURRENCY.NGN);
  const walletAccountNumber = ngnWallet?.accountNumber || "";

  const { handleError } = useGlobalModalsStore();

  const [step, setStep] = useState<Step>("details");
  const [examType, setExamType] = useState<ExamType>(null);
  const [planOpen, setPlanOpen] = useState(false);
  const [examTypeOpen, setExamTypeOpen] = useState(false);
  const planRef = useRef<HTMLDivElement>(null);
  const examTypeRef = useRef<HTMLDivElement>(null);

  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [billerNumber, setBillerNumber] = useState("");
  const [walletPin, setWalletPin] = useState("");

  const [verifiedCustomerName, setVerifiedCustomerName] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionData, setTransactionData] = useState<any>(null);

  // Fetch plans based on exam type
  const { planData: waecPlanData, isPending: waecPlanPending, isError: waecPlanError } = useGetWaecPlan();
  const { planData: jambPlanData, isPending: jambPlanPending, isError: jambPlanError } = useGetJambPlan();

  const currentPlanData = examType === "WAEC" ? waecPlanData : examType === "JAMB" ? jambPlanData : null;
  const plansLoading = (examType === "WAEC" && waecPlanPending) || (examType === "JAMB" && jambPlanPending);
  const plansError = (examType === "WAEC" && waecPlanError) || (examType === "JAMB" && jambPlanError);

  const plans = currentPlanData?.plans || [];
  const billerCode = currentPlanData?.billerCode || "";
  const billerName = currentPlanData?.billerName || examType || "";

  const amount = useMemo(() => Number(selectedPlan?.amount) || 0, [selectedPlan]);

  const formatNgn = (v: number) =>
    `₦${new Intl.NumberFormat("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
      Number.isFinite(v) ? v : 0
    )}`;

  // Reset plan when exam type changes
  useEffect(() => {
    setSelectedPlan(null);
    setBillerNumber("");
    setVerifiedCustomerName("");
  }, [examType]);

  const onVerifyError = (error: any) => {
      handleError(error, {
        currency: "NGN",
        onRetry: () => {
          if (!examType || !selectedPlan || !billerNumber) return;
          const itemCode = selectedPlan.itemCode || `${examType}-REG`;
          if (examType === "WAEC") {
            verifyWaec({ itemCode, billerCode, billerNumber });
          } else {
            verifyJamb({ itemCode, billerCode, billerNumber });
          }
        },
      });
  };

  const onVerifySuccess = (data: any) => {
    const payload = data?.data?.data;
    setVerifiedCustomerName(String(payload?.customerName || payload?.name || ""));
    setStep("confirm");
  };

  const { mutate: verifyWaec, isPending: verifyingWaec, isError: verifyWaecErr } = useVerifyWaecBillerNumber(
    onVerifyError,
    onVerifySuccess
  );
  const { mutate: verifyJamb, isPending: verifyingJamb, isError: verifyJambErr } = useVerifyJambBillerNumber(
    onVerifyError,
    onVerifySuccess
  );

  const verifyLoading = (examType === "WAEC" && verifyingWaec) || (examType === "JAMB" && verifyingJamb);

  const onPayError = (error: any) => {
      handleError(error, {
        currency: "NGN",
        onRetry: () => {
          if (!examType || !selectedPlan || !billerNumber || !walletPin) return;
          const itemCode = selectedPlan.itemCode || `${examType}-REG`;
          if (examType === "WAEC") {
            payWaec({
              itemCode,
              billerCode,
              currency: "NGN",
              billerNumber,
              amount,
              walletPin,
              addBeneficiary: false,
            });
          } else {
            payJamb({
              itemCode,
              billerCode,
              currency: "NGN",
              billerNumber,
              amount,
              walletPin,
              addBeneficiary: false,
            });
          }
        },
      });
  };

  const onPaySuccess = (data: any) => {
    SuccessToast({ title: `${examType} payment successful`, description: "Your payment was successful" });
    const ref = data?.data?.data?.transactionRef || data?.data?.data?.reference || `${examType?.toLowerCase()}_${Date.now()}`;
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
      recipientName: billerName,
      recipientAccount: billerNumber,
      recipientBank: billerName,
      description: selectedPlan?.name || `${examType} Payment`,
      provider: billerName,
      billerNumber,
      planName: selectedPlan?.name || undefined,
    });
    setShowSuccess(true);
  };

  const { mutate: payWaec, isPending: payWaecPending, isError: payWaecErr } = usePayWaec(onPayError, onPaySuccess);
  const { mutate: payJamb, isPending: payJambPending, isError: payJambErr } = usePayJamb(onPayError, onPaySuccess);

  const paying = (examType === "WAEC" && payWaecPending) || (examType === "JAMB" && payJambPending);

  const canNext = !!examType && !!selectedPlan && billerNumber.length >= 6 && amount > 0;
  const canPay = canNext && walletPin.length === 4 && !!verifiedCustomerName;

  return (
    <>
      <div className="w-full flex flex-col bg-white dark:bg-bg-1100 min-h-0">
        <div className="px-5 pt-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#0A0A0A] dark:text-white text-sm font-semibold">JAMB & WAEC</p>
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

        <div className="px-5 py-5 border-t border-gray-200 dark:border-gray-800 min-h-0">
          {step === "details" ? (
            <div className="w-full flex flex-col gap-4 min-h-0">
              {/* Exam Type Selection */}
              <div className="relative flex flex-col gap-1" ref={examTypeRef}>
                <label className="text-[11px] text-gray-500 dark:text-gray-400">Select Exam Type</label>
                <button
                  type="button"
                  onClick={() => setExamTypeOpen((v) => !v)}
                  className="w-full flex items-center justify-between bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm text-black dark:text-white"
                >
                  <span className={examType ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-600"}>
                    {examType || "Select exam type"}
                  </span>
                  <span className="text-gray-500 dark:text-gray-500">▾</span>
                </button>
                {examTypeOpen && (
                  <div className="absolute left-0 top-full mt-2 w-full bg-white dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-2xl z-[9999]">
                    <button
                      type="button"
                      onClick={() => {
                        setExamType("JAMB");
                        setExamTypeOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-[#1C1C1E] transition-colors"
                    >
                      JAMB
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setExamType("WAEC");
                        setExamTypeOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-[#1C1C1E] transition-colors"
                    >
                      WAEC
                    </button>
                  </div>
                )}
              </div>

              {/* Plan Selection */}
              <div className="relative flex flex-col gap-1" ref={planRef}>
                <label className="text-[11px] text-gray-500 dark:text-gray-400">Plan</label>
                <button
                  type="button"
                  disabled={!examType || plansLoading}
                  onClick={() => examType && !plansLoading && setPlanOpen((v) => !v)}
                  className="w-full flex items-center justify-between bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm text-black dark:text-white disabled:opacity-60"
                >
                  <span className={selectedPlan ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-600"}>
                    {plansLoading
                      ? "Loading plans..."
                      : selectedPlan
                      ? selectedPlan.name
                      : examType
                      ? "Select plan"
                      : "Select exam type first"}
                  </span>
                  <span className="text-gray-500 dark:text-gray-500">▾</span>
                </button>
                {planOpen && examType && (
                  <div className="relative left-0 w-full bg-white dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-2xl z-[9999] mt-2">
                    {plansLoading ? (
                      <div className="p-4 flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                        <SpinnerLoader width={18} height={18} color="#FF6B2C" /> Loading...
                      </div>
                    ) : plans.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                        No plans available
                      </div>
                    ) : (
                      plans.map((plan: any) => (
                        <button
                          key={plan.id}
                          type="button"
                          onClick={() => {
                            setSelectedPlan(plan);
                            setPlanOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-[#1C1C1E] transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span>{plan.name}</span>
                            <span className="text-gray-500 dark:text-gray-400">{formatNgn(plan.amount)}</span>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Biller Number Input */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-gray-500 dark:text-gray-400">
                  {examType === "JAMB" ? "Registration Number" : examType === "WAEC" ? "Candidate Number" : "Number"}
                </label>
                <div className="w-full flex items-center bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm">
                  <input
                    value={billerNumber}
                    onChange={(e) => setBillerNumber(e.target.value.trim())}
                    className="w-full bg-transparent border-none outline-none text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-600 text-sm"
                    placeholder={examType === "JAMB" ? "Enter registration number" : examType === "WAEC" ? "Enter candidate number" : "Enter number"}
                    inputMode="text"
                  />
                </div>
              </div>

              {/* Amount Display */}
              {amount > 0 && (
                <div className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-800/40">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400" />
                    <p className="text-xs text-green-700 dark:text-green-300 font-medium">{formatNgn(amount)}</p>
                  </div>
                  <p className="text-[11px] text-green-700 dark:text-green-300">From Available Balance</p>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full flex flex-col gap-4">
              <div className="rounded-xl bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 p-4">
                <div className="flex items-center justify-between py-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Exam Type</p>
                  <p className="text-xs font-medium text-black dark:text-white">{examType || "-"}</p>
                </div>
                <div className="flex items-center justify-between py-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Plan</p>
                  <p className="text-xs font-medium text-black dark:text-white">{selectedPlan?.name || "-"}</p>
                </div>
                <div className="flex items-center justify-between py-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {examType === "JAMB" ? "Registration Number" : "Candidate Number"}
                  </p>
                  <p className="text-xs font-medium text-black dark:text-white">{billerNumber || "-"}</p>
                </div>
                {verifiedCustomerName && (
                  <div className="flex items-center justify-between py-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Name</p>
                    <p className="text-xs font-medium text-black dark:text-white">{verifiedCustomerName}</p>
                  </div>
                )}
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
                if (!examType || !selectedPlan || !billerNumber) return;
                // Construct itemCode: use plan.itemCode if available, otherwise construct from exam type
                const itemCode = selectedPlan.itemCode || `${examType}-REG`;
                if (examType === "WAEC") {
                  verifyWaec({ itemCode, billerCode, billerNumber });
                } else {
                  verifyJamb({ itemCode, billerCode, billerNumber });
                }
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
                  if (!examType || !selectedPlan || !billerNumber || !walletPin) return;
                  // Construct itemCode: use plan.itemCode if available, otherwise construct from exam type
                  const itemCode = selectedPlan.itemCode || `${examType}-REG`;
                  if (examType === "WAEC") {
                    payWaec({
                      itemCode,
                      billerCode,
                      currency: "NGN",
                      billerNumber,
                      amount,
                      walletPin,
                      addBeneficiary: false,
                    });
                  } else {
                    payJamb({
                      itemCode,
                      billerCode,
                      currency: "NGN",
                      billerNumber,
                      amount,
                      walletPin,
                      addBeneficiary: false,
                    });
                  }
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
            setExamType(null);
            setSelectedPlan(null);
            setBillerNumber("");
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

export default JambWaecBillSteps;

