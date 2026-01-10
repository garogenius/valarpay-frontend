"use client";

import React from "react";
import { CgClose } from "react-icons/cg";

interface BreakPlanDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  reason: string;
  breakDate: string;
  principalAmount: number;
  interestForfeited: number;
  penalty: number;
  payoutAmount: number;
  startDate?: string;
  maturityDate?: string;
  interestRatePerAnnum?: number;
  durationMonths?: number;
}

const BreakPlanDetailsModal: React.FC<BreakPlanDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  planName, 
  reason,
  breakDate,
  principalAmount,
  interestForfeited,
  penalty,
  payoutAmount,
  startDate,
  maturityDate,
  interestRatePerAnnum,
  durationMonths,
}) => {
  if (!isOpen) return null;
  const fmt = (n: number) =>
    `₦${new Intl.NumberFormat("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
      Number.isFinite(n) ? n : 0
    )}`;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, "-");
  };

  return (
    <div className="z-[999999] fixed inset-0 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="relative mx-3 bg-bg-600 dark:bg-bg-1100 border border-border-800 dark:border-border-700 w-full max-w-sm rounded-2xl p-4">
        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 cursor-pointer hover:bg-white/5 rounded-full transition-colors">
          <CgClose className="text-lg text-white" />
        </button>

        <div className="flex flex-col gap-4">
          {/* Title */}
          <h3 className="text-white text-sm font-medium">{planName}</h3>

          {/* Break Info */}
          <div className="bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#ff6b6b] text-xs">Break Reason</span>
              <span className="text-white text-xs">{reason}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#ff6b6b] text-xs">Broken on</span>
              <span className="text-white text-xs">{breakDate}</span>
            </div>
          </div>

          {/* Payout */}
          <div className="bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 rounded-lg p-3">
            <p className="text-[#ff6b6b] text-xs mb-1">Total Payout</p>
            <p className="text-[#ff6b6b] text-xl font-semibold">{fmt(payoutAmount)}</p>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex flex-col gap-1">
              <span className="text-white/50">Original Amount</span>
              <span className="text-white">{fmt(principalAmount)}</span>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <span className="text-white/50">Penalty</span>
              <span className="text-[#ff6b6b]">-{fmt(penalty)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-white/50">Interest Forfeited</span>
              <span className="text-white">-{fmt(interestForfeited)}</span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 pb-3 border-b border-white/10 text-xs">
            <div className="flex flex-col gap-0.5">
              <span className="text-white/50">Start Date</span>
              <span className="text-white">{formatDate(startDate)}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-white/50">Interest Maturity Date</span>
              <span className="text-white">{formatDate(maturityDate)}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-white/50">Interest Rate</span>
              <span className="text-white">
                {typeof interestRatePerAnnum === "number"
                  ? `${(interestRatePerAnnum * 100).toFixed(2)}% per annum`
                  : "N/A"}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-white/50">Duration</span>
              <span className="text-white">{durationMonths ? `${durationMonths} Months` : "N/A"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakPlanDetailsModal;
