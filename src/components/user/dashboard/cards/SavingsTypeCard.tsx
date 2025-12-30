"use client";

import { useRef, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoMdCheckmark } from "react-icons/io";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useGetFixedSavingsInterest } from "@/api/finance/finance.queries";
import { formatCurrency } from "@/utils/utilityFunctions";
import useNavigate from "@/hooks/useNavigate";

const options = [
  { id: 1, label: "Fixed Savings" },
  { id: 2, label: "Target Savings" },
  { id: 3, label: "Easyflex Savings" },
];

const SavingsTypeCard = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(options[0]);
  const [showBalance, setShowBalance] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setOpen(false));

  const { data: interestData, isLoading } = useGetFixedSavingsInterest();
  // Handle API response structure: { data: { totalInterest, currency } } or { totalInterest, currency }
  const totalInterest = interestData?.data?.totalInterest || interestData?.totalInterest || 0;
  const currency = interestData?.data?.currency || interestData?.currency || "NGN";

  return (
    <div 
      className="relative bg-[#2C2C2E] dark:bg-[#2C2C2E] rounded-xl p-5 cursor-pointer hover:bg-[#3A3A3C] transition-colors"
      onClick={() => navigate("/user/finance")}
    >
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
          className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
        >
          <svg className="w-5 h-5 text-[#FF6B2C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">{active.label}</span>
          <MdKeyboardArrowDown className="text-lg" />
        </button>
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

      {open ? (
        <div
          ref={ref}
          className="absolute z-20 mt-2 right-4 top-16 w-64 sm:w-72 rounded-xl border border-gray-700 bg-[#1C1C1E] shadow-2xl"
        >
          <div className="p-3 border-b border-gray-700">
            <p className="text-sm font-semibold text-gray-300">Saving Types</p>
          </div>
          <div className="max-h-72 overflow-auto">
            {options.map((o) => (
              <div
                key={o.id}
                onClick={() => {
                  setActive(o);
                  setOpen(false);
                }}
                className="cursor-pointer flex items-center justify-between gap-2 px-4 py-3 hover:bg-[#2C2C2E] transition-colors"
              >
                <span className="text-sm text-gray-300">{o.label}</span>
                {active.id === o.id ? <IoMdCheckmark className="text-[#FF6B2C]" /> : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SavingsTypeCard;
