"use client";

import { FiEye, FiEyeOff } from "react-icons/fi";
import { useRef, useState, useMemo } from "react";
import { MdClose, MdKeyboardArrowDown } from "react-icons/md";
import { FiTrendingUp } from "react-icons/fi";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useGetInvestments } from "@/api/investment/investment.queries";

const InvestmentStatCard = () => {
  const [visible, setVisible] = useState(true);
  const [open, setOpen] = useState(false);
  const [investmentType, setInvestmentType] = useState<string>("All Investments");
  const menuRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(menuRef, () => setOpen(false));
  
  // Fetch investments
  const { investmentsData } = useGetInvestments({
    page: 1,
    limit: 100, // Get all investments to calculate total
  });
  
  const investments = investmentsData?.investments || [];
  
  // Calculate total interest based on selected investment type
  const totalInterest = useMemo(() => {
    let filteredInvestments = [];
    
    switch (investmentType) {
      case "All Investments":
        filteredInvestments = investments;
        break;
      case "Active Investments":
        filteredInvestments = investments.filter((inv) => inv.status === "ACTIVE" || inv.status === "PENDING");
        break;
      case "Matured Investments":
        filteredInvestments = investments.filter((inv) => inv.status === "MATURED" || inv.status === "PAID_OUT");
        break;
      default:
        filteredInvestments = investments;
    }
    
    return filteredInvestments.reduce((total, inv) => {
      const interestAmount = Number(inv.interestAmount || inv.earnedAmount || 0);
      return total + interestAmount;
    }, 0);
  }, [investments, investmentType]);

  return (
    <div className="bg-bg-600 dark:bg-bg-1100 rounded-xl px-4 py-5 2xs:py-6 flex flex-col gap-3 sm:gap-4">
      <div className="relative flex items-center gap-2 text-text-200 dark:text-text-800">
        <div className="w-8 h-8 rounded-md bg-secondary/15 grid place-items-center text-secondary">
          <FiTrendingUp className="text-lg" />
        </div>
        <p className="text-sm sm:text-base font-semibold">{investmentType}</p>
        <MdKeyboardArrowDown onClick={() => setOpen((v) => !v)} className="ml-auto cursor-pointer" />

        {open && (
          <div ref={menuRef} className="absolute right-0 top-9 z-50 w-64 rounded-xl bg-bg-600 dark:bg-bg-2200 border border-border-800 dark:border-border-700 shadow-2xl p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-text-200 dark:text-text-800 font-semibold">Investment Types</p>
              <MdClose onClick={() => setOpen(false)} className="cursor-pointer" />
            </div>
            {[
              "All Investments",
              "Active Investments",
              "Matured Investments",
            ].map((label, idx, arr) => (
              <button
                key={label}
                onClick={() => {
                  setInvestmentType(label);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between py-2.5 ${idx !== arr.length - 1 ? "border-b border-border-800 dark:border-border-700" : ""}`}
              >
                <span className="text-left text-text-200 dark:text-text-800 text-sm">{label}</span>
                <span className={`w-3.5 h-3.5 rounded-full border ${investmentType === label ? "bg-secondary border-secondary" : "border-border-800 dark:border-border-700"}`}></span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 font-semibold">
        <p className="text-text-200 dark:text-text-800 text-xs sm:text-sm">Total Interest Credited</p>
        {visible ? (
          <FiEyeOff onClick={() => setVisible(false)} className="cursor-pointer text-text-200 dark:text-text-800 text-base" />
        ) : (
          <FiEye onClick={() => setVisible(true)} className="cursor-pointer text-text-200 dark:text-text-800 text-base" />
        )}
      </div>
      <p className="text-text-400 text-2xl sm:text-3xl font-semibold">
        {visible ? `₦ ${Number(totalInterest || 0).toLocaleString()}` : "---"}
      </p>
    </div>
  );
};

export default InvestmentStatCard;
