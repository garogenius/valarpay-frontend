"use client";

import React, { useMemo } from "react";
import { format } from "date-fns";
import { useGetInvestmentDetails } from "@/api/investment/investment.queries";
import { formatCurrency } from "@/utils/utilityFunctions";
import useNavigate from "@/hooks/useNavigate";
import ErrorToast from "@/components/toast/ErrorToast";

const safeDate = (d?: string) => {
  if (!d) return "-";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "-";
  return format(dt, "dd MMM yyyy");
};

const statusLabel = (s?: string) => {
  if (!s) return "-";
  return String(s).replace(/_/g, " ");
};

const InvestmentDetailsContent = ({ id }: { id: string }) => {
  const navigate = useNavigate();
  const { investment, isPending, isError, error } = useGetInvestmentDetails({ id });

  const httpStatus = (error as any)?.response?.status;

  const derived = useMemo(() => {
    const amount = Number(investment?.investmentAmount || investment?.amount || 0);
    const expectedReturn = typeof (investment as any)?.expectedReturn === "number" ? (investment as any).expectedReturn : undefined;
    const earned =
      typeof investment?.earnedAmount === "number"
        ? investment.earnedAmount
        : typeof expectedReturn === "number"
          ? Math.max(0, expectedReturn - amount)
          : 0;
    return { amount, earned, expectedReturn };
  }, [investment]);

  if (isError) {
    if (httpStatus === 404) {
      return (
        <div className="flex flex-col gap-6 pb-10">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-white text-xl sm:text-2xl font-semibold">Investment Details</h1>
              <p className="text-gray-400 text-xs sm:text-sm">Investment not found.</p>
            </div>
            <button
              onClick={() => navigate("/user/investment")}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs sm:text-sm"
            >
              Back
            </button>
          </div>
        </div>
      );
    }

    ErrorToast({
      title: "Unable to load investment",
      descriptions: ["Please try again."],
    });

    return (
      <div className="flex flex-col gap-6 pb-10">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-white text-xl sm:text-2xl font-semibold">Investment Details</h1>
            <p className="text-gray-400 text-xs sm:text-sm">Unable to load investment details.</p>
          </div>
          <button
            onClick={() => navigate("/user/investment")}
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs sm:text-sm"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  if (isPending || !investment) {
    return (
      <div className="flex flex-col gap-6 pb-10">
        <div>
          <h1 className="text-white text-xl sm:text-2xl font-semibold">Investment Details</h1>
          <p className="text-gray-400 text-xs sm:text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-white text-xl sm:text-2xl font-semibold">Investment Details</h1>
          <p className="text-gray-400 text-xs sm:text-sm">{investment.name || (investment as any).investName || "Investment"}</p>
        </div>
        <button
          onClick={() => navigate("/user/investment")}
          className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs sm:text-sm"
        >
          Back
        </button>
      </div>

      <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-white font-semibold">Summary</p>
            <p className="text-gray-400 text-sm mt-1">Status: {statusLabel(investment.status)}</p>
          </div>
          <div className="text-right">
            <p className="text-white text-lg font-semibold">{formatCurrency(derived.amount, "NGN")}</p>
            <p className="text-green-400 text-xs font-medium mt-1">{formatCurrency(derived.earned, "NGN")} earned</p>
          </div>
        </div>

        <div className="my-5 h-px bg-white/10" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-white/60 text-xs">Start Date</p>
            <p className="text-white text-sm font-medium mt-1">{safeDate(investment.startDate || investment.createdAt)}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-white/60 text-xs">Maturity Date</p>
            <p className="text-white text-sm font-medium mt-1">{safeDate(investment.maturityDate)}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-white/60 text-xs">ROI</p>
            <p className="text-white text-sm font-medium mt-1">{typeof investment.roiRate === "number" ? `${(investment.roiRate * 100).toFixed(1)}%` : "-"}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-white/60 text-xs">Tenure</p>
            <p className="text-white text-sm font-medium mt-1">{typeof investment.tenureMonths === "number" ? `${investment.tenureMonths} months` : "-"}</p>
          </div>
        </div>

        {/* Transaction Details */}
        {(investment.transaction || investment.walletTransactionId || investment.reference || investment.transactionId) ? (
          <>
            <div className="my-5 h-px bg-white/10" />
            <div>
              <p className="text-white font-semibold mb-3">Transaction Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {investment.transaction && (
                  <>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <p className="text-white/60 text-xs">Transaction ID</p>
                      <p className="text-white text-sm font-medium mt-1">{investment.transaction.id || "-"}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <p className="text-white/60 text-xs">Transaction Status</p>
                      <p className="text-white text-sm font-medium mt-1">{investment.transaction.status || "-"}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <p className="text-white/60 text-xs">Transaction Type</p>
                      <p className="text-white text-sm font-medium mt-1">{investment.transaction.type || "-"}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <p className="text-white/60 text-xs">Transaction Date</p>
                      <p className="text-white text-sm font-medium mt-1">{safeDate(investment.transaction.createdAt)}</p>
                    </div>
                  </>
                )}
                {investment.walletTransactionId && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-white/60 text-xs">Wallet Transaction ID</p>
                    <p className="text-white text-sm font-medium mt-1">{investment.walletTransactionId}</p>
                  </div>
                )}
                {investment.transactionId && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-white/60 text-xs">Transaction ID</p>
                    <p className="text-white text-sm font-medium mt-1">{investment.transactionId}</p>
                  </div>
                )}
                {investment.reference && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-white/60 text-xs">Reference</p>
                    <p className="text-white text-sm font-medium mt-1">{investment.reference}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default InvestmentDetailsContent;



