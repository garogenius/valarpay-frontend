"use client";

import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { useState } from "react";
import { useGetFixedDepositInterest } from "@/api/finance/finance.queries";
import { formatCurrency } from "@/utils/utilityFunctions";
import useNavigate from "@/hooks/useNavigate";

const FixedDepositCard = () => {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);
  const { data: interestData, isLoading } = useGetFixedDepositInterest();
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="text-sm font-medium">Fixed Deposit</span>
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

export default FixedDepositCard;
