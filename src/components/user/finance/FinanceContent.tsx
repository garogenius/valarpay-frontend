"use client";

import React, { useState } from "react";
import { cn } from "@/utils/cn";
import { MdBlock } from "react-icons/md";
import CustomButton from "@/components/shared/Button";
import useUserStore from "@/store/user.store";
import { useSavingsPlans, useSavingsProducts } from "@/api/savings/savings.queries";
import type { SavingsPlan, SavingsProduct } from "@/api/savings/savings.types";
import { useMyFixedDeposits, useFixedDepositPlans } from "@/api/fixed-deposit/fixed-deposit.queries";
import type { FixedDeposit } from "@/api/fixed-deposit/fixed-deposit.types";
import { useEasyLifePlans, useEasyLifeProduct } from "@/api/easylife-savings/easylife-savings.queries";
import type { EasyLifePlan } from "@/api/easylife-savings/easylife-savings.types";
import TargetSavingsModal from "@/components/modals/savings/TargetSavingsModal";
import EasyLifeSavingsModal from "@/components/modals/savings/EasyLifeSavingsModal";
import FixedSavingsModal from "@/components/modals/savings/FixedSavingsModal";
import SavingsPlanViewModal from "@/components/modals/savings/SavingsPlanViewModal";
import EasyLifeSavingsViewModal from "@/components/modals/savings/EasyLifeSavingsViewModal";
import FixedDepositViewModal from "@/components/modals/savings/FixedDepositViewModal";
import StartNewPlanModal from "@/components/modals/savings/StartNewPlanModal";
import BreakPlanModal from "@/components/modals/savings/BreakPlanModal";
import FinancePlanCard from "@/components/shared/FinancePlanCard";

type TabKey = "target-savings" | "fixed-deposit" | "easylife-savings";
type SubTabKey = "active" | "completed" | "broken";

const tabs: { key: TabKey; label: string }[] = [
  { key: "target-savings", label: "Target Savings" },
  { key: "fixed-deposit", label: "Fixed Deposit" },
  { key: "easylife-savings", label: "EasyLife Savings" },
];

const subTabs: { key: SubTabKey; label: string }[] = [
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
  { key: "broken", label: "Broken" },
];

function inferTabKeyFromText(value?: string): TabKey {
  const v = String(value || "").toLowerCase();
  if (v.includes("deposit") || v.includes("fixed-deposit")) return "fixed-deposit";
  if (v.includes("easylife") || v.includes("easy-life")) return "easylife-savings";
  if (v.includes("target") || v.includes("flex") || v.includes("valar")) return "target-savings";
  return "target-savings";
}

function getPlanId(p: any) {
  return p?.id ?? p?.planId ?? p?.plan_id;
}

function normalizeStatus(value?: string): SubTabKey | null {
  const s = String(value || "").toUpperCase();
  if (!s) return null;
  if (s.includes("ACTIVE")) return "active";
  if (s.includes("BROKEN") || s.includes("CANCEL")) return "broken";
  if (s.includes("COMPLETED") || s.includes("CLOSED") || s.includes("SUCCESS")) return "completed";
  return null;
}

const FinanceContent = () => {
  const { user } = useUserStore();
  const ngnBalance = (user?.wallet || []).find((w: any) => w.currency === "NGN")?.balance || 0;

  const [activeTab, setActiveTab] = useState<TabKey>("target-savings");
  const [activeSubTab, setActiveSubTab] = useState<SubTabKey>("active");

  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct | null>(null);

  const [startNewPlanOpen, setStartNewPlanOpen] = useState(false);
  const [createTargetOpen, setCreateTargetOpen] = useState(false);
  const [createEasyOpen, setCreateEasyOpen] = useState(false);
  const [createDepositOpen, setCreateDepositOpen] = useState(false);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | number | null>(null);
  
  const [breakPlanOpen, setBreakPlanOpen] = useState(false);
  const [breakPlanId, setBreakPlanId] = useState<string | number | null>(null);
  const [breakPlanName, setBreakPlanName] = useState("");
  const [breakPlanType, setBreakPlanType] = useState<"target" | "easylife">("target");

  // Fetch data for each tab
  const { products: savingsProducts } = useSavingsProducts();
  const { plans: savingsPlans, isPending: savingsPlansLoading, isError: savingsPlansError } = useSavingsPlans();
  
  const { deposits: fixedDeposits, isPending: fixedDepositsLoading, isError: fixedDepositsError } = useMyFixedDeposits();
  
  const { plans: easyLifePlans, isPending: easyLifePlansLoading, isError: easyLifePlansError } = useEasyLifePlans();

  // Normalize plans based on active tab
  const getPlansForTab = () => {
    if (activeTab === "target-savings") {
      return Array.isArray(savingsPlans) ? savingsPlans : [];
    } else if (activeTab === "fixed-deposit") {
      return Array.isArray(fixedDeposits) ? fixedDeposits : [];
    } else if (activeTab === "easylife-savings") {
      return Array.isArray(easyLifePlans) ? easyLifePlans : [];
    }
    return [];
  };

  const normalizedPlans = getPlansForTab();

  const openCreateForProduct = (product: SavingsProduct) => {
    setSelectedProduct(product);
    const key = inferTabKeyFromText(product?.type || product?.name || product?.code);
    setActiveTab(key);
    if (key === "target-savings") setCreateTargetOpen(true);
    if (key === "easylife-savings") setCreateEasyOpen(true);
    if (key === "fixed-deposit") setCreateDepositOpen(true);
  };

  const filteredPlans = normalizedPlans.filter((p) => {
    const statusKey = normalizeStatus(String((p as any)?.status || (p as any)?.planStatus || ""));
    // If backend doesn't provide status, keep under Active by default
    return (statusKey || "active") === activeSubTab;
  });

  const isLoading = 
    (activeTab === "target-savings" && savingsPlansLoading) ||
    (activeTab === "fixed-deposit" && fixedDepositsLoading) ||
    (activeTab === "easylife-savings" && easyLifePlansLoading);

  const isError = 
    (activeTab === "target-savings" && savingsPlansError) ||
    (activeTab === "fixed-deposit" && fixedDepositsError) ||
    (activeTab === "easylife-savings" && easyLifePlansError);

  const handleCreatePlan = () => {
    if (activeTab === "target-savings") {
      setCreateTargetOpen(true);
    } else if (activeTab === "fixed-deposit") {
      setCreateDepositOpen(true);
    } else if (activeTab === "easylife-savings") {
      setCreateEasyOpen(true);
    }
  };

  const getCreateButtonLabel = () => {
    if (activeTab === "target-savings") {
      return "Start Target Savings";
    } else if (activeTab === "fixed-deposit") {
      return "Start Fixed Deposit";
    } else if (activeTab === "easylife-savings") {
      return "Start EasyLife Savings";
    }
    return "Start New Plan";
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 rounded-full bg-[#2C2C2E] flex items-center justify-center mb-6 border-4 border-gray-600">
        <MdBlock className="text-5xl text-gray-500" />
      </div>
      <p className="text-gray-400 text-sm text-center max-w-xs">
        You have no active Plan — start a new one to keep building your portfolio
      </p>
      <div className="mt-8">
        <CustomButton
          onClick={handleCreatePlan}
          className="px-8 py-3 rounded-full"
        >
          {getCreateButtonLabel()}
        </CustomButton>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Header */}
      <div className="w-full flex items-center gap-2 sm:gap-3 justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-white text-base sm:text-xl lg:text-2xl font-semibold truncate">Savings</h1>
          <p className="text-gray-400 text-[10px] sm:text-xs lg:text-sm mt-0.5 sm:mt-1 line-clamp-1">
            Manage your savings goals and watch your progress grow.
          </p>
        </div>
      <CustomButton
        onClick={handleCreatePlan}
        className="flex-shrink-0 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-sm font-semibold whitespace-nowrap"
      >
        {getCreateButtonLabel()}
      </CustomButton>
      </div>

      {/* Tabs */}
      <div className="w-full">
        <div className="flex items-center gap-2 p-1 rounded-full border border-gray-800 bg-[#1C1C1E] w-full">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex-1 min-w-0 text-[10px] xs:text-[11px] sm:text-sm px-2.5 sm:px-4 py-2 rounded-full",
                activeTab === tab.key
                  ? "bg-[#2C2C2E] text-white"
                  : "text-gray-300 hover:bg-[#1C1C1E]"
              )}
            >
              <span className="block truncate">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="w-full bg-[#1C1C1E] rounded-xl min-h-[400px] p-5">
        {/* Sub Tabs */}
        <div className="flex items-center gap-6 mb-6">
          {subTabs.map((subTab) => (
            <button
              key={subTab.key}
              onClick={() => setActiveSubTab(subTab.key)}
              className={cn(
                "text-sm font-medium transition-colors",
                activeSubTab === subTab.key
                  ? "text-[#f76301]"
                  : "text-gray-400 hover:text-gray-300"
              )}
            >
              {subTab.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-gray-400 text-sm">Loading...</div>
        ) : isError ? (
          <div className="py-12 text-center text-gray-400 text-sm">Unable to load plans</div>
        ) : filteredPlans.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="flex flex-col gap-4">
            {filteredPlans.map((p: any) => {
              // Handle different plan types
              let planName = "Plan";
              let createdAt = "";
              let maturityDate = "";
              let interestRate = "";
              let currentAmount = 0;
              let targetAmount = 0;
              let earned = 0;
              let planId = getPlanId(p);
              let status: "active" | "completed" = "active";

              if (activeTab === "target-savings") {
                planName = p?.name || (p?.type === "FLEX_SAVE" ? "Flex Save" : p?.type === "VALAR_AUTO_SAVE" ? "Valar Auto Save" : "Target Savings");
                createdAt = p?.startDate || p?.createdAt || "";
                maturityDate = p?.maturityDate || "";
                const rate = p?.interestRate || 0;
                interestRate = `${(rate * 100).toFixed(1)}% per annum`;
                currentAmount = Number(p?.totalDeposited ?? p?.currentAmount ?? 0) || 0;
                targetAmount = Number(p?.goalAmount ?? p?.targetAmount ?? 0) || 0;
                earned = Number(p?.totalInterestAccrued ?? p?.interestEarned ?? 0) || 0;
                status = (p?.status === "COMPLETED" || p?.status === "CLOSED") ? "completed" : "active";
              } else if (activeTab === "fixed-deposit") {
                planName = p?.planType || "Fixed Deposit";
                createdAt = p?.startDate || p?.createdAt || "";
                maturityDate = p?.maturityDate || "";
                const rate = p?.interestRate || 0;
                interestRate = `${(rate * 100).toFixed(2)}% per annum`;
                currentAmount = Number(p?.principalAmount ?? 0) || 0;
                targetAmount = Number(p?.principalAmount ?? 0) || 0; // For fixed deposit, principal is the target
                earned = Number(p?.interestDetails?.totalInterestEarned ?? 0) || 0;
                status = (p?.status === "PAID_OUT" || p?.status === "MATURED") ? "completed" : "active";
              } else if (activeTab === "easylife-savings") {
                planName = p?.name || p?.title || "EasyLife Savings";
                createdAt = p?.startDate || p?.createdAt || "";
                maturityDate = p?.maturityDate || "";
                interestRate = "0% per annum"; // EasyLife has 0% interest
                currentAmount = Number(p?.totalDeposited ?? p?.totalSaved ?? 0) || 0;
                targetAmount = Number(p?.goalAmount ?? p?.targetAmount ?? 0) || 0;
                earned = 0;
                status = (p?.status === "COMPLETED" || p?.status === "CLOSED") ? "completed" : "active";
              }

              const formatDate = (dateStr: string) => {
                if (!dateStr) return "-";
                try {
                  const date = new Date(dateStr);
                  const dd = String(date.getDate()).padStart(2, "0");
                  const mm = String(date.getMonth() + 1).padStart(2, "0");
                  const yyyy = date.getFullYear();
                  return `${dd}-${mm}-${yyyy}`;
                } catch {
                  return dateStr;
                }
              };

              // Determine plan type for break plan
              const planTypeForBreak: "target" | "easylife" = activeTab === "easylife-savings" ? "easylife" : "target";
              
              return (
                <FinancePlanCard
                  key={String(planId)}
                  name={planName}
                  amount={currentAmount}
                  earned={earned}
                  startDate={formatDate(createdAt)}
                  endDate={formatDate(maturityDate)}
                  interestRate={interestRate}
                  status={status}
                  targetAmount={targetAmount}
                  onView={() => {
                    setSelectedPlanId(planId);
                    setDetailsOpen(true);
                  }}
                  onBreak={activeTab !== "fixed-deposit" ? () => {
                    setBreakPlanId(planId);
                    setBreakPlanName(planName);
                    setBreakPlanType(planTypeForBreak);
                    setBreakPlanOpen(true);
                  } : undefined}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <StartNewPlanModal
        isOpen={startNewPlanOpen}
        onClose={() => setStartNewPlanOpen(false)}
        onSelectPlan={(planType) => {
          if (planType === "target") {
            setCreateTargetOpen(true);
          } else if (planType === "easylife") {
            setCreateEasyOpen(true);
          } else if (planType === "fixed") {
            setCreateDepositOpen(true);
          }
        }}
      />

      <TargetSavingsModal
        isOpen={createTargetOpen}
        onClose={() => {
          setCreateTargetOpen(false);
          setSelectedProduct(null);
        }}
      />

      <EasyLifeSavingsModal
        isOpen={createEasyOpen}
        onClose={() => {
          setCreateEasyOpen(false);
          setSelectedProduct(null);
        }}
      />

      <FixedSavingsModal
        isOpen={createDepositOpen}
        onClose={() => {
          setCreateDepositOpen(false);
          setSelectedProduct(null);
        }}
      />

      {selectedPlanId != null && (
        <>
          {activeTab === "target-savings" && (
            <SavingsPlanViewModal
              isOpen={detailsOpen}
              onClose={() => {
                setDetailsOpen(false);
                setSelectedPlanId(null);
              }}
              plan={{
                name: "",
                amount: 0,
                type: "target",
                planId: String(selectedPlanId),
              }}
            />
          )}
          {activeTab === "easylife-savings" && (
            <EasyLifeSavingsViewModal
              isOpen={detailsOpen}
              onClose={() => {
                setDetailsOpen(false);
                setSelectedPlanId(null);
              }}
              planId={String(selectedPlanId)}
            />
          )}
          {activeTab === "fixed-deposit" && (
            <FixedDepositViewModal
              isOpen={detailsOpen}
              onClose={() => {
                setDetailsOpen(false);
                setSelectedPlanId(null);
              }}
              planId={String(selectedPlanId)}
            />
          )}
        </>
      )}

      <BreakPlanModal
        isOpen={breakPlanOpen}
        onClose={() => {
          setBreakPlanOpen(false);
          setBreakPlanId(null);
          setBreakPlanName("");
        }}
        planName={breakPlanName}
        planId={breakPlanId ? String(breakPlanId) : undefined}
        planType={breakPlanType}
        onConfirm={() => {
          setBreakPlanOpen(false);
          setBreakPlanId(null);
          setBreakPlanName("");
          // Refresh plans data
          window.location.reload();
        }}
      />
    </div>
  );
};

export default FinanceContent;
