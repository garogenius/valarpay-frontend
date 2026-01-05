"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/utils/utilityFunctions";
import InvestmentDetailsModal from "@/components/modals/investment/InvestmentDetailsModal";

export interface Investment {
  id: string;
  name: string;
  amount: number;
  earnedAmount: number;
  startDate: string;
  maturityDate: string;
  interestRate: string;
  status: "active" | "completed";
}

interface InvestmentCardProps {
  investment: Investment;
  onViewDetails?: (investment: Investment) => void;
  onRefresh?: () => void;
}

const InvestmentCard: React.FC<InvestmentCardProps> = ({
  investment,
  onViewDetails,
  onRefresh,
}) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(investment);
    } else {
      setIsDetailsModalOpen(true);
    }
  };

  return (
    <>
      <div className="w-full rounded-2xl border border-white/10 bg-[#0A0A0A] overflow-hidden">
        <div className="px-4 sm:px-6 py-4 sm:py-5">
          {/* Top Row */}
          <div className="flex items-start justify-between gap-4">
            <p className="text-white font-medium text-sm sm:text-base truncate">
              {investment.name}
            </p>
            <div className="text-right flex-shrink-0">
              <p className="text-white text-sm sm:text-base font-semibold">
                {formatCurrency(investment.amount, "NGN")}
              </p>
              <p className="text-green-400 text-[11px] sm:text-xs font-medium">
                {formatCurrency(investment.earnedAmount, "NGN")} earned
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="my-4 h-px bg-white/10" />

          {/* Details */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6">
            <div className="col-span-1">
              <p className="text-white/50 text-[11px] sm:text-xs mb-1">Start Date</p>
              <p className="text-white text-xs sm:text-sm font-medium">{investment.startDate}</p>
            </div>
            <div className="col-span-1 text-center">
              <p className="text-white/50 text-[11px] sm:text-xs mb-1">Maturity Date</p>
              <p className="text-white text-xs sm:text-sm font-medium">{investment.maturityDate}</p>
            </div>
            <div className="col-span-1 text-right">
              <p className="text-white/50 text-[11px] sm:text-xs mb-1">Interest Rate</p>
              <p className="text-white text-xs sm:text-sm font-medium">{investment.interestRate}</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-5">
          <button
            onClick={handleViewDetails}
            className="w-full h-11 sm:h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[#FF6B2C] text-sm font-medium transition-colors"
          >
            View Details
          </button>
        </div>
      </div>

      <InvestmentDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        investmentId={investment.id}
        onRefresh={onRefresh}
      />
    </>
  );
};

export default InvestmentCard;
