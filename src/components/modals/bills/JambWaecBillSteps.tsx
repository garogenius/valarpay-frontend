"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useMemo, useRef, useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaFingerprint } from "react-icons/fa";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import useUserStore from "@/store/user.store";
import { CURRENCY } from "@/constants/types";
import GlobalTransactionHistoryModal from "@/components/shared/GlobalTransactionHistoryModal";
import { useFingerprintForPayments } from "@/store/paymentPreferences.store";
import useGlobalModalsStore from "@/store/globalModals.store";
import {
  useVerifyWaecBillerNumber,
  useVerifyJambBillerNumber,
  usePayWaec,
  usePayJamb,
} from "@/api/education/education.queries";

type Step = "details" | "confirm";
type ExamType = "JAMB" | "WAEC" | null;

type ProductOption = {
  itemCode: string;
  name: string;
  // Optional display amount; actual amount is always taken from verify response
  displayAmount?: number;
};

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

  const [selectedProduct, setSelectedProduct] = useState<ProductOption | null>(null);
  const [billerNumber, setBillerNumber] = useState("");
  const [walletPin, setWalletPin] = useState("");

  const [verifiedCustomerName, setVerifiedCustomerName] = useState("");
  const [verifiedAmount, setVerifiedAmount] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionData, setTransactionData] = useState<any>(null);

  // Opay-style: fixed product IDs
  const waecProducts: ProductOption[] = useMemo(
    () => [
      { itemCode: "1473", name: "Result Checker", displayAmount: 4000 },
      { itemCode: "1474", name: "Registration PIN", displayAmount: 27000 },
    ],
    []
  );

  const jambProducts: ProductOption[] = useMemo(
    () => [
      { itemCode: "308", name: "JAMB DE", displayAmount: 5700 },
      { itemCode: "309", name: "JAMB UME Mock", displayAmount: 8700 },
      { itemCode: "1612", name: "JAMB UTME (Variable)" },
      { itemCode: "1613", name: "JAMB UTME Mock (Variable)" },
      { itemCode: "1614", name: "Mock Only", displayAmount: 3500 },
    ],
    []
  );

  const products = examType === "WAEC" ? waecProducts : examType === "JAMB" ? jambProducts : [];
  const billerCode = examType || "";
  const billerName = examType || "";

  const amount = useMemo(() => Number(verifiedAmount) || 0, [verifiedAmount]);

  const formatNgn = (v: number) =>
    `₦${new Intl.NumberFormat("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
      Number.isFinite(v) ? v : 0
    )}`;

  // Reset plan when exam type changes
  useEffect(() => {
    setSelectedProduct(null);
    setBillerNumber("");
    setVerifiedCustomerName("");
    setVerifiedAmount(0);
    setWalletPin("");
    setStep("details");
  }, [examType]);

  const onVerifyError = (error: any) => {
      handleError(error, {
        currency: "NGN",
        onRetry: () => {
          if (!examType || !selectedProduct || !billerNumber) return;
          const itemCode = selectedProduct.itemCode;
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
    setVerifiedAmount(Number(payload?.amount) || 0);
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
          if (!examType || !selectedProduct || !billerNumber || !walletPin) return;
          const itemCode = selectedProduct.itemCode;
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
      description: selectedProduct?.name || `${examType} Payment`,
      provider: billerName,
      billerNumber,
      planName: selectedProduct?.name || undefined,
    });
    setShowSuccess(true);
  };

  const { mutate: payWaec, isPending: payWaecPending, isError: payWaecErr } = usePayWaec(onPayError, onPaySuccess);
  const { mutate: payJamb, isPending: payJambPending, isError: payJambErr } = usePayJamb(onPayError, onPaySuccess);

  const paying = (examType === "WAEC" && payWaecPending) || (examType === "JAMB" && payJambPending);

  const canNext =
    !!examType && !!selectedProduct && !!billerCode && billerNumber.trim().length >= 6;
  const canPay = canNext && walletPin.length === 4 && !!verifiedCustomerName && amount > 0;

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
                  disabled={!examType}
                  onClick={() => examType && setPlanOpen((v) => !v)}
                  className="w-full flex items-center justify-between bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm text-black dark:text-white disabled:opacity-60"
                >
                  <span className={selectedProduct ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-600"}>
                    {selectedProduct
                      ? selectedProduct.name
                      : examType
                        ? "Select plan"
                        : "Select exam type first"}
                  </span>
                  <span className="text-gray-500 dark:text-gray-500">▾</span>
                </button>
                {planOpen && examType && (
                  <div className="relative left-0 w-full bg-white dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-2xl z-[9999] mt-2">
                    {products.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                        No plans available
                      </div>
                    ) : (
                      products.map((p) => (
                        <button
                          key={p.itemCode}
                          type="button"
                          onClick={() => {
                            setSelectedProduct(p);
                            setPlanOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-[#1C1C1E] transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span>{p.name}</span>
                            <span className="text-gray-500 dark:text-gray-400">
                              {typeof p.displayAmount === "number" ? formatNgn(p.displayAmount) : "—"}
                            </span>
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

              {/* Note */}
              {examType && selectedProduct ? (
                <div className="w-full px-4 py-3 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-800/40">
                  <p className="text-[11px] text-blue-700 dark:text-blue-300">
                    Tap <span className="font-semibold">Next</span> to verify the number and fetch the payable amount.
                  </p>
                </div>
              ) : null}
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
                  <p className="text-xs font-medium text-black dark:text-white">{selectedProduct?.name || "-"}</p>
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
                if (!examType || !selectedProduct || !billerNumber || !billerCode) return;
                const itemCode = selectedProduct.itemCode;
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
                  if (!examType || !selectedProduct || !billerNumber || !walletPin) return;
                  const itemCode = selectedProduct.itemCode;
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
            setSelectedProduct(null);
            setBillerNumber("");
            setWalletPin("");
            setVerifiedCustomerName("");
            setVerifiedAmount(0);
            onClose();
          }}
          transaction={transactionData}
        />
      )}
    </>
  );
};

export default JambWaecBillSteps;

