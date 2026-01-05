"use client";

import React, { useMemo } from "react";
import { IoClose } from "react-icons/io5";
import { FiCheckCircle, FiDownload } from "react-icons/fi";
import CustomButton from "@/components/shared/Button";
import { useGetInvestmentDetails } from "@/api/investment/investment.queries";
import { formatCurrency } from "@/utils/utilityFunctions";
import SpinnerLoader from "@/components/Loader/SpinnerLoader";

interface InvestmentTransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  investmentId: string;
  onDownloadAgreement?: () => void;
}

function formatDate(d?: string) {
  if (!d) return "-";
  try {
    const dt = new Date(d);
    const dd = String(dt.getDate()).padStart(2, "0");
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const yyyy = String(dt.getFullYear());
    return `${dd}-${mm}-${yyyy}`;
  } catch {
    return d;
  }
}

const InvestmentTransactionDetailsModal: React.FC<InvestmentTransactionDetailsModalProps> = ({
  isOpen,
  onClose,
  investmentId,
  onDownloadAgreement,
}) => {
  const { investment, isPending, isError } = useGetInvestmentDetails({
    id: investmentId,
    enabled: isOpen,
  });

  const derived = useMemo(() => {
    if (!investment) return { principal: 0, interestEarned: 0, totalPayout: 0 };
    
    const principal = Number(investment.investmentAmount || investment.amount || 0);
    const expectedReturn = typeof investment.expectedReturn === "number" ? investment.expectedReturn : 0;
    const interestEarned = typeof investment.earnedAmount === "number" 
      ? investment.earnedAmount 
      : Math.max(0, expectedReturn - principal);
    const totalPayout = expectedReturn || principal + interestEarned;

    return { principal, interestEarned, totalPayout };
  }, [investment]);

  const tenureMonths = investment?.tenureMonths || 0;
  const roiRate = investment?.roiRate ? (investment.roiRate * 100).toFixed(0) : "0";

  // Mock transaction history - replace with actual API data when available
  const transactions = investment?.transaction 
    ? [investment.transaction]
    : [];

  const handleDownloadAgreement = () => {
    if (onDownloadAgreement) {
      onDownloadAgreement();
    } else {
      // Default download behavior
      const agreementContent = `
ValarPay Investment Agreement
============================

Investment ID: ${investmentId}
Investment Name: ${investment?.name || (investment as any)?.investName || "Investment Plan"}

Principal Amount: ${formatCurrency(derived.principal, "NGN")}
Interest Rate: ${roiRate}% per annum
Duration: ${tenureMonths} ${tenureMonths === 1 ? "Month" : "Months"}
Start Date: ${formatDate(investment?.startDate || investment?.createdAt)}
End Date: ${formatDate(investment?.maturityDate)}
Expected Return: ${formatCurrency(derived.totalPayout, "NGN")}

Status: ${investment?.status || "ACTIVE"}

This agreement confirms your investment with ValarPay.
Please keep this document for your records.

Generated: ${new Date().toLocaleString()}
      `.trim();

      const blob = new Blob([agreementContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `investment-agreement-${investmentId}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-[#0A0A0A] rounded-2xl w-full max-w-2xl p-4 sm:p-6 shadow-xl max-h-[calc(100vh-1.5rem)] sm:max-h-[90vh] overflow-y-auto my-auto border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl sm:text-2xl font-semibold">
            {investment?.name || (investment as any)?.investName || "Investment Plan"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <IoClose className="text-2xl" />
          </button>
        </div>

        {isPending ? (
          <div className="flex items-center justify-center py-12">
            <SpinnerLoader width={32} height={32} color="#FF6B2C" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-red-400 text-sm">Failed to load investment details</p>
          </div>
        ) : (
          <>
            {/* Total Payout Section */}
            <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 sm:p-5 mb-6 flex items-center justify-between">
              <div>
                <p className="text-white/70 text-xs sm:text-sm mb-1">Total Payout</p>
                <p className="text-white text-xl sm:text-2xl font-bold">
                  {formatCurrency(derived.totalPayout, "NGN")}
                </p>
              </div>
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <FiCheckCircle className="text-2xl sm:text-3xl text-green-400" />
              </div>
            </div>

            {/* Savings Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4">
                <p className="text-white/60 text-xs mb-1">Principal Amount</p>
                <p className="text-white text-sm sm:text-base font-semibold">
                  {formatCurrency(derived.principal, "NGN")}
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4">
                <p className="text-white/60 text-xs mb-1">Interest Earned</p>
                <p className="text-green-400 text-sm sm:text-base font-semibold">
                  +{formatCurrency(derived.interestEarned, "NGN")}
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4">
                <p className="text-white/60 text-xs mb-1">Start Date</p>
                <p className="text-white text-sm sm:text-base font-semibold">
                  {formatDate(investment?.startDate || investment?.createdAt)}
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4">
                <p className="text-white/60 text-xs mb-1">End Date</p>
                <p className="text-white text-sm sm:text-base font-semibold">
                  {formatDate(investment?.maturityDate)}
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4">
                <p className="text-white/60 text-xs mb-1">Interest Rate</p>
                <p className="text-white text-sm sm:text-base font-semibold">
                  {roiRate}% per annum
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4">
                <p className="text-white/60 text-xs mb-1">Duration</p>
                <p className="text-white text-sm sm:text-base font-semibold">
                  {tenureMonths} {tenureMonths === 1 ? "Month" : "Months"}
                </p>
              </div>
            </div>

            {/* Transaction History */}
            <div className="mb-6">
              <h3 className="text-white font-semibold text-base sm:text-lg mb-3">Transaction History</h3>
              {transactions.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <p className="text-gray-400 text-sm">No transactions yet</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {transactions.map((txn: any, idx: number) => (
                    <div
                      key={txn.id || idx}
                      className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-white text-sm font-medium">
                          {txn.type === "DEBIT" ? "Deposit" : txn.type === "WITHDRAWAL" ? "Withdrawal" : txn.type || "Transaction"}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          {formatDate(txn.createdAt)}
                        </p>
                      </div>
                      <p className="text-green-400 text-sm sm:text-base font-semibold">
                        +{formatCurrency(Number(txn.amount || 0), "NGN")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Download Agreement Button */}
            <CustomButton
              onClick={handleDownloadAgreement}
              className="w-full py-3 sm:py-4 rounded-xl bg-[#FF6B2C] hover:bg-[#FF7A3D] text-white font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <FiDownload className="text-lg" />
              Download Agreement
            </CustomButton>
          </>
        )}
      </div>
    </div>
  );
};

export default InvestmentTransactionDetailsModal;







