"use client";

import React, { useMemo, useState } from "react";
import { FiPieChart, FiTrendingUp, FiPlusCircle } from "react-icons/fi";
import InvestmentStatCard from "@/components/user/dashboard/cards/InvestmentStatCard";
import StartInvestmentModal from "@/components/modals/investment/StartInvestmentModal";
import InvestmentModal from "@/components/modals/investment/InvestmentModal";
import CustomButton from "@/components/shared/Button";
import InvestmentCard, { Investment } from "./InvestmentCard";
import { formatCurrency } from "@/utils/utilityFunctions";
import useNavigate from "@/hooks/useNavigate";
import { useGetInvestments } from "@/api/investment/investment.queries";
import { format } from "date-fns";
import type { InvestmentRecord, InvestmentStatus } from "@/api/investment/investment.types";
import InvestmentProductInfoCard from "./InvestmentProductInfoCard";
import { useQueryClient } from "@tanstack/react-query";

const InvestmentContent = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [startOpen, setStartOpen] = useState(false);
  const [investmentModalOpen, setInvestmentModalOpen] = useState(false);
  const [tab, setTab] = useState<"active" | "completed">("active");

  const [pageNumber] = useState(1);
  const [pageSize] = useState(20);

  const { investmentsData, isPending } = useGetInvestments({
    page: pageNumber,
    limit: pageSize,
    sort: "newest",
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["investments"] });
  };

  const records: InvestmentRecord[] = investmentsData?.investments || (Array.isArray((investmentsData as any)) ? (investmentsData as any) : []);

  const toUiStatus = (status: InvestmentStatus): "active" | "completed" => {
    if (status === "ACTIVE" || status === "PENDING") return "active";
    return "completed";
  };

  const safeDate = (d?: string) => {
    if (!d) return "-";
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return "-";
    return format(dt, "dd MMM yyyy");
  };

  const uiInvestments = useMemo<Investment[]>(() => {
    return records
      .map((r) => {
        const uiStatus = toUiStatus(r.status);
        const amount = Number(r.investmentAmount || r.amount || 0);
        const earned =
          typeof r.earnedAmount === "number"
            ? r.earnedAmount
            : typeof r.expectedReturn === "number"
              ? Math.max(0, r.expectedReturn - amount)
              : 0;
        const roi = r.roiRate ?? (r as any).roi ?? (r as any).interestRate;
        const interestRate = typeof roi === "number" ? `${(roi * 100).toFixed(1)}%` : roi ? String(roi) : "-";

        return {
          id: r.id,
          name: r.name || (r as any).investName || "Investment",
          amount,
          earnedAmount: earned,
          startDate: safeDate(r.startDate || r.createdAt),
          maturityDate: safeDate(r.maturityDate),
          interestRate,
          status: uiStatus,
        };
      })
      .sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
  }, [records]);

  const activeInvestments = useMemo(() => uiInvestments.filter((i) => i.status === "active"), [uiInvestments]);
  const completedInvestments = useMemo(() => uiInvestments.filter((i) => i.status === "completed"), [uiInvestments]);
  const visibleInvestments = tab === "active" ? activeInvestments : completedInvestments;

  const portfolio = useMemo(() => {
    const totalInvested = uiInvestments.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
    return { totalInvested };
  }, [uiInvestments]);

  return (
    <div className="flex flex-col gap-6 pb-10 overflow-x-hidden">
      <div className="w-full flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-3 sm:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-white text-base sm:text-xl lg:text-2xl font-semibold truncate">Investment</h1>
          <p className="text-gray-400 text-[10px] sm:text-xs lg:text-sm mt-0.5 sm:mt-1">Manage your investment portfolio</p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
          <CustomButton
            onClick={() => navigate("/user/investment/policy")}
            className="flex-1 sm:flex-none bg-white/5 hover:bg-white/10 border border-white/10 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs lg:text-sm font-semibold whitespace-nowrap"
          >
            <span className="hidden xs:inline">Investment Policy</span>
            <span className="xs:hidden">Policy</span>
          </CustomButton>
          <CustomButton
            onClick={() => setStartOpen(true)}
            className="flex-1 sm:flex-none bg-[#FF6B2C] hover:bg-[#FF7A3D] text-black px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs lg:text-sm font-semibold whitespace-nowrap"
          >
            <span className="hidden xs:inline">Start Investment</span>
            <span className="xs:hidden">Start</span>
          </CustomButton>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InvestmentStatCard />
        <div className="relative bg-[#2C2C2E] dark:bg-[#2C2C2E] rounded-xl p-5 hover:bg-[#3A3A3C] transition-colors">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-white">
              <FiPieChart className="w-5 h-5 text-[#FF6B2C]" />
              <span className="text-sm font-medium">Portfolio</span>
            </div>
            <span className="text-xs text-gray-400">
              {uiInvestments.length > 0
                ? `${uiInvestments.length} investment${uiInvestments.length > 1 ? "s" : ""}`
                : "No investments"}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-400">Total Invested</span>
          </div>

          <div>
            <p className="text-3xl font-bold text-white">
              {formatCurrency(portfolio.totalInvested, "NGN")}
            </p>
          </div>
        </div>
      </div>

      {/* Investment Product Information */}
      <InvestmentProductInfoCard />

      {/* List */}
      <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden">
        {/* Tabs (Active / Completed) */}
        <div className="flex items-center gap-6 px-4 sm:px-6 pt-4 sm:pt-5">
          {[
            { key: "active" as const, label: "Active" },
            { key: "completed" as const, label: "Completed" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`text-sm font-medium pb-3 ${
                tab === t.key ? "text-[#FF6B2C]" : "text-gray-500 hover:text-white/80"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="h-px bg-white/10" />

        {/* Body */}
        <div className="p-4 sm:p-6">
          {isPending ? (
            <div className="flex flex-col items-center justify-center text-center py-10 sm:py-12 gap-2">
              <p className="text-gray-400 text-sm">Loading...</p>
            </div>
          ) : visibleInvestments.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-10 sm:py-12 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#FF6B2C]/10 border border-[#FF6B2C]/20 flex items-center justify-center">
                <FiTrendingUp className="text-3xl text-[#FF6B2C]" />
              </div>
              <div className="max-w-md">
                <p className="text-white font-semibold text-base sm:text-lg mb-1">
                  {tab === "active" ? "No active investments" : "No completed investments"}
                </p>
                <p className="text-gray-400 text-sm">
                  {tab === "active"
                    ? "Start an investment to see it listed here."
                    : "Completed investments will appear here after maturity."}
                </p>
              </div>
              {tab === "active" && (
                <CustomButton
                  onClick={() => setStartOpen(true)}
                  className="bg-[#FF6B2C] hover:bg-[#FF7A3D] text-black px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2"
                >
                  <FiPlusCircle />
                  Start Investment
                </CustomButton>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {visibleInvestments.map((inv) => (
                <InvestmentCard
                  key={inv.id}
                  investment={inv}
                  onViewDetails={() => navigate(`/user/investment/${inv.id}`)}
                  onRefresh={handleRefresh}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <StartInvestmentModal 
        isOpen={startOpen} 
        onClose={() => {
          setStartOpen(false);
        }}
        onSelectType={() => {
          setStartOpen(false);
          setInvestmentModalOpen(true);
        }}
      />
      <InvestmentModal
        isOpen={investmentModalOpen}
        onClose={() => {
          setInvestmentModalOpen(false);
          handleRefresh();
        }}
      />
    </div>
  );
};

export default InvestmentContent;
