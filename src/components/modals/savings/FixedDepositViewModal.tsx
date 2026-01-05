"use client";

import React from "react";
import { CgClose } from "react-icons/cg";
import { useGetFixedDepositById } from "@/api/fixed-deposit/fixed-deposit.queries";
import type { FixedDeposit } from "@/api/fixed-deposit/fixed-deposit.types";

interface FixedDepositViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string | null;
}

const FixedDepositViewModal: React.FC<FixedDepositViewModalProps> = ({ isOpen, onClose, planId }) => {
  // Fetch plan details
  const { fixedDeposit: fixedDepositData, isPending } = useGetFixedDepositById(planId);

  if (!isOpen || !planId) return null;

  const actualPlan: FixedDeposit | null = fixedDepositData || null;

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
  };

  // Get transaction history from interest payments
  const transactions = (actualPlan?.interestPayments || []).map((payment: any) => ({
    id: payment.id || payment.transactionId || String(Date.now()),
    amount: payment.amount || payment.interestAmount || 0,
    createdAt: payment.createdAt || payment.paymentDate || payment.date || new Date().toISOString(),
  })) as Array<{
    id: string;
    amount: number;
    createdAt: string;
  }>;
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const maturityDate = actualPlan?.maturityDate ? new Date(actualPlan.maturityDate) : null;
  const daysRemaining = maturityDate 
    ? (() => {
        const today = new Date();
        const diffTime = maturityDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      })()
    : 0;

  if (isPending) {
    return (
      <div className="z-[999999] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 flex justify-center items-center w-full md:inset-0 h-[100dvh]">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-black/80 dark:bg-black/60" onClick={onClose} />
        </div>
        <div className="relative mx-2.5 2xs:mx-4 bg-bg-600 dark:bg-bg-1100 border border-border-800 dark:border-border-700 px-4 py-8 w-full max-w-md rounded-2xl">
          <p className="text-white text-center">Loading plan details...</p>
        </div>
      </div>
    );
  }

  if (!actualPlan) {
    return (
      <div className="z-[999999] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 flex justify-center items-center w-full md:inset-0 h-[100dvh]">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-black/80 dark:bg-black/60" onClick={onClose} />
        </div>
        <div className="relative mx-2.5 2xs:mx-4 bg-bg-600 dark:bg-bg-1100 border border-border-800 dark:border-border-700 px-4 py-8 w-full max-w-md rounded-2xl">
          <p className="text-white text-center">Plan not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="z-[999999] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 flex justify-center items-center w-full md:inset-0 h-[100dvh]">
      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
        <div className="absolute inset-0 bg-black/80 dark:bg-black/60" onClick={onClose} />
      </div>
      <div className="relative mx-2.5 2xs:mx-4 bg-bg-600 dark:bg-bg-1100 border border-border-800 dark:border-border-700 px-0 py-4 w-full max-w-md max-h-[92vh] rounded-2xl flex flex-col overflow-hidden">
        <button onClick={onClose} className="absolute top-3 right-3 p-2 cursor-pointer bg-bg-1400 rounded-full hover:bg-bg-1200 transition-colors z-10">
          <CgClose className="text-xl text-text-200 dark:text-text-400" />
        </button>

        <div className="px-4 pt-1 pb-2">
          <h2 className="text-white text-xs font-medium">
            {actualPlan.planType?.replace(/_/g, " ") || "Fixed Deposit"}
          </h2>
        </div>

        <div className="px-4 pb-3 flex-1 overflow-y-auto">
          {/* Plan Type & Status */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
              Fixed Deposit
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              actualPlan.status === "ACTIVE" 
                ? "bg-emerald-500/20 text-emerald-400"
                : actualPlan.status === "MATURED" || actualPlan.status === "PAID_OUT"
                ? "bg-blue-500/20 text-blue-400"
                : "bg-red-500/20 text-red-400"
            }`}>
              {actualPlan.status || "ACTIVE"}
            </span>
          </div>

          {/* Amounts */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-white/50 text-[10px]">Principal Amount</span>
              <span className="text-white text-xs font-medium">₦{(actualPlan.principalAmount ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex flex-col gap-0.5 text-right">
              <span className="text-white/50 text-[10px]">Interest Earned</span>
              <span className="text-emerald-400 text-xs font-medium">+₦{(actualPlan.interestDetails?.totalInterestEarned ?? 0).toLocaleString()}</span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 pb-3 mb-3 border-t border-b border-white/10 pt-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-white/50 text-[10px]">Currency</span>
              <span className="text-white text-[11px]">{actualPlan.currency || "NGN"}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-white/50 text-[10px]">Duration</span>
              <span className="text-white text-[11px]">
                {actualPlan.durationMonths 
                  ? `${actualPlan.durationMonths} Months`
                  : actualPlan.durationDays 
                    ? `${actualPlan.durationDays} Days`
                    : "N/A"}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-white/50 text-[10px]">Start Date</span>
              <span className="text-white text-[11px]">
                {actualPlan.startDate ? formatDate(actualPlan.startDate) : "N/A"}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-white/50 text-[10px]">Maturity Date</span>
              <span className="text-white text-[11px]">
                {actualPlan.maturityDate ? formatDate(actualPlan.maturityDate) : "N/A"}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-white/50 text-[10px]">Days Left</span>
              <span className="text-white text-[11px]">
                {daysRemaining > 0 ? `${daysRemaining} Days` : "Matured"}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-white/50 text-[10px]">Interest Rate</span>
              <span className="text-white text-[11px]">
                {actualPlan.interestRate !== undefined && actualPlan.interestRate !== null
                  ? `${(actualPlan.interestRate * 100).toFixed(2)}% per annum`
                  : "N/A"}
              </span>
            </div>
            {actualPlan.certificateReference && (
              <div className="flex flex-col gap-0.5">
                <span className="text-white/50 text-[10px]">Certificate Reference</span>
                <span className="text-white text-[11px] font-mono text-[9px]">
                  {actualPlan.certificateReference}
                </span>
              </div>
            )}
            {actualPlan.interestPaymentFrequency && (
              <div className="flex flex-col gap-0.5">
                <span className="text-white/50 text-[10px]">Interest Payment</span>
                <span className="text-white text-[11px]">
                  {actualPlan.interestPaymentFrequency.replace(/_/g, " ")}
                </span>
              </div>
            )}
            {actualPlan.minimumDeposit && (
              <div className="flex flex-col gap-0.5">
                <span className="text-white/50 text-[10px]">Minimum Deposit</span>
                <span className="text-white text-[11px]">₦{actualPlan.minimumDeposit.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Fixed Deposit Settings */}
          <div className="mb-3 p-2.5 bg-white/5 rounded-lg border border-white/10">
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="flex flex-col gap-0.5">
                <span className="text-white/50">Auto Renewal</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full inline-block w-fit ${
                  actualPlan.autoRenewal 
                    ? "bg-emerald-500/20 text-emerald-400" 
                    : "bg-white/10 text-white/50"
                }`}>
                  {actualPlan.autoRenewal ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-white/50">Reinvest Interest</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full inline-block w-fit ${
                  actualPlan.reinvestInterest 
                    ? "bg-emerald-500/20 text-emerald-400" 
                    : "bg-white/10 text-white/50"
                }`}>
                  {actualPlan.reinvestInterest ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>

          {/* Interest Details */}
          {actualPlan.interestDetails && (
            <div className="mb-3 p-2.5 bg-white/5 rounded-lg border border-white/10">
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="flex flex-col gap-0.5">
                  <span className="text-white/50">Total Interest Paid</span>
                  <span className="text-white text-[11px]">₦{(actualPlan.interestDetails.totalInterestPaid ?? 0).toLocaleString()}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-white/50">Remaining Interest</span>
                  <span className="text-white text-[11px]">₦{(actualPlan.interestDetails.remainingInterest ?? 0).toLocaleString()}</span>
                </div>
                {actualPlan.interestDetails.nextPaymentDate && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-white/50">Next Payment Date</span>
                    <span className="text-white text-[11px]">{formatDate(actualPlan.interestDetails.nextPaymentDate)}</span>
                  </div>
                )}
                {actualPlan.interestDetails.nextPaymentAmount && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-white/50">Next Payment Amount</span>
                    <span className="text-white text-[11px]">₦{actualPlan.interestDetails.nextPaymentAmount.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Plan Info */}
          <div className="mb-3 p-2.5 bg-white/5 rounded-lg border border-white/10">
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="flex flex-col gap-0.5">
                <span className="text-white/50">Plan ID</span>
                <span className="text-white/70 font-mono text-[9px] truncate">{actualPlan.id || planId || "N/A"}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-white/50">Created</span>
                <span className="text-white/70 text-[9px]">
                  {actualPlan.createdAt ? formatDate(actualPlan.createdAt) : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="mb-2">
            <h3 className="text-white text-[11px] font-medium mb-2.5">Interest Payments</h3>
            {sortedTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 border border-white/10 rounded-lg">
                <p className="text-white/40 text-[10px]">No interest payments yet</p>
              </div>
            ) : (
              <div className="flex flex-col border border-white/10 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                {sortedTransactions.map((txn) => (
                  <div key={txn.id} className="flex items-center justify-between py-2.5 px-3 border-b border-white/10 last:border-0">
                    <div className="flex flex-col">
                      <span className="text-white text-[11px]">Interest Payment</span>
                      <span className="text-white/40 text-[9px]">{formatDate(txn.createdAt)}</span>
                    </div>
                    <span className="text-[11px] text-emerald-400">
                      +₦{Number(txn.amount || 0).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FixedDepositViewModal;

