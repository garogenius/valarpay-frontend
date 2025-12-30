"use client";

import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { useState } from "react";
import { useGetInvestmentInterest } from "@/api/finance/finance.queries";
import { formatCurrency } from "@/utils/utilityFunctions";
import useNavigate from "@/hooks/useNavigate";

const InvestmentStatCard = () => {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);
  const { data: interestData, isLoading } = useGetInvestmentInterest();
  // Handle API response structure: { data: { totalInterest, currency } } or { totalInterest, currency }
  const totalInterest = interestData?.data?.totalInterest || interestData?.totalInterest || 0;
  const currency = interestData?.data?.currency || interestData?.currency || "NGN";

  return (
    <div 
      className="relative bg-[#2C2C2E] dark:bg-[#2C2C2E] rounded-xl p-5 cursor-pointer hover:bg-[#3A3A3C] transition-colors"
      onClick={() => navigate("/user/finance")}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-white">
          <svg className="w-5 h-5 text-[#FF6B2C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span className="text-sm font-medium">Investment</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-gray-400">Total Interest Credited</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowBalance(!showBalance);
          }}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {showBalance ? <RiEyeLine size={14} /> : <RiEyeOffLine size={14} />}
        </button>
      </div>

      <div>
        <p className="text-3xl font-bold text-white">
          {isLoading ? (
            <span className="text-gray-400 text-lg">Loading...</span>
          ) : showBalance ? (
            formatCurrency(totalInterest, currency)
          ) : (
            "₦•••••••"
          )}
        </p>
      </div>
    </div>
  );
};

export default InvestmentStatCard;
