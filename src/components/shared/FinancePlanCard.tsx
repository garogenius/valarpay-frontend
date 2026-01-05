"use client";

import React from "react";

interface FinancePlanCardProps {
  name: string;
  amount: number;
  earned?: number;
  startDate: string;
  endDate: string;
  interestRate?: string;
  status?: "active" | "completed";
  targetAmount?: number;
  onView?: () => void;
  onBreak?: () => void;
}

const FinancePlanCard: React.FC<FinancePlanCardProps> = ({ 
  name, 
  amount, 
  earned = 0, 
  startDate, 
  endDate, 
  interestRate = "", 
  status = "active",
  targetAmount = 0,
  onView,
  onBreak
}) => {
  // Format amount with 2 decimal places
  const formatAmount = (value: number) => {
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Calculate progress percentage
  const progressPercentage = targetAmount > 0 
    ? Math.min(100, Math.round((amount / targetAmount) * 100))
    : 0;

  // Completed state layout
  if (status === "completed") {
    return (
      <div className="rounded-xl border border-white/10 bg-transparent p-3 sm:p-4 flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <p className="text-white font-medium text-xs sm:text-sm">{name}</p>
          <div className="text-right flex flex-col items-end shrink-0">
            <p className="text-white text-sm sm:text-base font-medium">₦{formatAmount(amount)}</p>
            <p className="text-emerald-400 text-[10px] sm:text-xs mt-0.5">₦{formatAmount(earned)} earned</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10" />

        {/* Goal Progress - only show if targetAmount exists */}
        {targetAmount > 0 && (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/50">Goal Progress</span>
              <span className="text-white font-medium">{progressPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#f76301] rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Details row - 3 columns for completed */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs">
          <div className="flex flex-col gap-1">
            <span className="text-white/50 text-[10px] sm:text-[11px]">Start Date</span>
            <span className="text-white text-[11px] sm:text-xs">{startDate}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-white/50 text-[10px] sm:text-[11px]">Maturity Date</span>
            <span className="text-white text-[11px] sm:text-xs">{endDate}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-white/50 text-[10px] sm:text-[11px]">Interest Rate</span>
            <span className="text-white text-[11px] sm:text-xs">{interestRate}</span>
          </div>
        </div>

        {/* Single View Details button for completed plans */}
        <button 
          onClick={onView} 
          className="w-full rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#f76301] py-2 sm:py-2.5 text-xs sm:text-sm transition-colors"
        >
          View Details
        </button>
      </div>
    );
  }

  // Active state layout
  return (
    <div className="rounded-xl border border-white/10 bg-transparent p-3 sm:p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-white font-medium text-xs sm:text-sm">{name}</p>
          <div className="text-right flex flex-col items-end shrink-0">
            <p className="text-white text-sm sm:text-base font-medium">₦{formatAmount(amount)}</p>
            <p className="text-emerald-400 text-[10px] sm:text-xs mt-0.5">₦{formatAmount(earned)} earned</p>
          </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/10" />

      {/* Goal Progress - only show if targetAmount exists */}
      {targetAmount > 0 && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/50">Goal Progress</span>
            <span className="text-white font-medium">{progressPercentage}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#f76301] rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Details row */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs">
        <div className="flex flex-col gap-1">
          <span className="text-white/50 text-[10px] sm:text-[11px]">Start Date</span>
          <span className="text-white text-[11px] sm:text-xs">{startDate}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-white/50 text-[10px] sm:text-[11px]">Maturity Date</span>
          <span className="text-white text-[11px] sm:text-xs">{endDate}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-white/50 text-[10px] sm:text-[11px]">Interest Rate</span>
          <span className="text-white text-[11px] sm:text-xs">{interestRate}</span>
        </div>
      </div>

      {/* Two buttons: View Details and Break Plan - Break Plan only hidden when completed */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button 
          onClick={onView} 
          className="flex-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#f76301] py-2 sm:py-2.5 text-xs sm:text-sm transition-colors"
        >
          View Details
        </button>
        {onBreak && status !== "completed" && (
          <button 
            onClick={onBreak} 
            className="flex-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-red-500 py-2 sm:py-2.5 text-xs sm:text-sm transition-colors"
          >
            Break Plan
          </button>
        )}
      </div>
    </div>
  );
};

export default FinancePlanCard;




