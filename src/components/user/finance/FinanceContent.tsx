"use client";

import React, { useState } from "react";
import { cn } from "@/utils/cn";
import { MdBlock } from "react-icons/md";
import CustomButton from "@/components/shared/Button";
import StartNewPlanModal from "@/components/modals/StartNewPlanModal";
import useUserStore from "@/store/user.store";
import { useSavingsPlans, useSavingsProducts } from "@/api/savings/savings.queries";
import type { SavingsPlan, SavingsProduct } from "@/api/savings/savings.types";
import CreateFixedSavingsModal from "@/components/modals/CreateFixedSavingsModal";
import CreateTargetSavingsModal from "@/components/modals/CreateTargetSavingsModal";
import CreateEasyLifeSavingsModal from "@/components/modals/CreateEasyLifeSavingsModal";
import CreateFixedDepositModal from "@/components/modals/CreateFixedDepositModal";
import SavingsPlanDetailsModal from "@/components/modals/SavingsPlanDetailsModal";

type TabKey = "fixed-savings" | "target-savings" | "easy-life" | "fixed-deposit";
type SubTabKey = "active" | "completed" | "broken";

const tabs: { key: TabKey; label: string }[] = [
  { key: "fixed-savings", label: "Fixed Savings" },
  { key: "target-savings", label: "Target Savings" },
  { key: "easy-life", label: "Easy-life Savings" },
  { key: "fixed-deposit", label: "Fixed-Deposit" },
];

const subTabs: { key: SubTabKey; label: string }[] = [
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
  { key: "broken", label: "Broken" },
];

function inferTabKeyFromText(value?: string): TabKey {
  const v = String(value || "").toLowerCase();
  if (v.includes("deposit")) return "fixed-deposit";
  if (v.includes("target")) return "target-savings";
  if (v.includes("easy") || v.includes("flex")) return "easy-life";
  return "fixed-savings";
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

  const [activeTab, setActiveTab] = useState<TabKey>("fixed-savings");
  const [activeSubTab, setActiveSubTab] = useState<SubTabKey>("active");

  const [showStartPlan, setShowStartPlan] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct | null>(null);

  const [createFixedOpen, setCreateFixedOpen] = useState(false);
  const [createTargetOpen, setCreateTargetOpen] = useState(false);
  const [createEasyOpen, setCreateEasyOpen] = useState(false);
  const [createDepositOpen, setCreateDepositOpen] = useState(false);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | number | null>(null);

  const { products } = useSavingsProducts();
  const { plans, isPending: plansLoading, isError: plansIsError } = useSavingsPlans();

  const normalizedPlans: SavingsPlan[] = Array.isArray(plans) ? plans : [];

  const openCreateForProduct = (product: SavingsProduct) => {
    setSelectedProduct(product);
    const key = inferTabKeyFromText(product?.type || product?.name || product?.code);
    setActiveTab(key);
    if (key === "fixed-savings") setCreateFixedOpen(true);
    if (key === "target-savings") setCreateTargetOpen(true);
    if (key === "easy-life") setCreateEasyOpen(true);
    if (key === "fixed-deposit") setCreateDepositOpen(true);
  };

  const filteredPlans = normalizedPlans
    .filter((p) => {
      const key = inferTabKeyFromText(
        (p as any)?.type || (p as any)?.planType || (p as any)?.productType || (p as any)?.product?.type || (p as any)?.product?.name || ""
      );
      return key === activeTab;
    })
    .filter((p) => {
      const statusKey = normalizeStatus(String((p as any)?.status || (p as any)?.planStatus || ""));
      // If backend doesn't provide status, keep under Active by default
      return (statusKey || "active") === activeSubTab;
    });

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 rounded-full bg-[#2C2C2E] flex items-center justify-center mb-6 border-4 border-gray-600">
        <MdBlock className="text-5xl text-gray-500" />
      </div>
      <p className="text-gray-400 text-sm text-center max-w-xs">
        You have no active Plan — start a new one to keep building your portfolio
      </p>
      <CustomButton
        onClick={() => setShowStartPlan(true)}
        className="mt-8 px-16 py-3 rounded-full"
      >
        Start New Plan
      </CustomButton>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Header */}
      <div className="w-full flex items-start justify-between">
        <div>
          <h1 className="text-white text-xl sm:text-2xl font-semibold">Savings</h1>
          <p className="text-gray-400 text-xs sm:text-sm">
            Manage your savings goals and watch your progress grow.
          </p>
        </div>
        <CustomButton
          onClick={() => setShowStartPlan(true)}
          className="px-4 py-2 rounded-full text-sm"
        >
          Start New Plan
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
                  ? "text-[#FF6B2C]"
                  : "text-gray-400 hover:text-gray-300"
              )}
            >
              {subTab.label}
            </button>
          ))}
        </div>

        {plansLoading ? (
          <div className="py-12 text-center text-gray-400 text-sm">Loading...</div>
        ) : plansIsError ? (
          <div className="py-12 text-center text-gray-400 text-sm">Unable to load savings plans</div>
        ) : filteredPlans.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="flex flex-col gap-4">
            {filteredPlans.map((p: any) => {
              const planName = p?.name || p?.planName || p?.product?.name || "Savings Plan";
              const createdAt = p?.createdAt || p?.startDate;
              const maturityDate = p?.maturityDate || p?.endDate;
              const interestRate = p?.interestRate || p?.product?.interestRate || p?.rate || 0;
              const currentAmount = Number(p?.currentAmount ?? p?.balance ?? 0) || 0;
              const earned = Number(p?.interestEarned ?? 0) || 0;
              const planId = getPlanId(p);

              return (
                <div key={String(planId)} className="rounded-2xl border border-gray-800 bg-[#141416] overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-800 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{planName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-sm font-semibold">₦{currentAmount.toLocaleString()}</p>
                      {earned ? (
                        <p className="text-green-500 text-xs">₦{earned.toLocaleString()} earned</p>
                      ) : null}
                    </div>
                  </div>

                  <div className="px-5 py-4 grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <p className="text-gray-500">Start Date</p>
                      <p className="text-white">{createdAt ? new Date(createdAt).toLocaleDateString("en-GB").replace(/\//g, "-") : "-"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">{activeSubTab === "active" ? "Maturity Date" : "End Date"}</p>
                      <p className="text-white">{maturityDate ? new Date(maturityDate).toLocaleDateString("en-GB").replace(/\//g, "-") : "-"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500">Interest Rate</p>
                      <p className="text-white">{Number(interestRate || 0)}% per annum</p>
                    </div>
                  </div>

                  <div className="px-5 pb-5">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPlanId(planId);
                        setDetailsOpen(true);
                      }}
                      className="w-full py-3 rounded-full bg-[#2C2C2E] text-[#FF6B2C] text-sm font-medium hover:bg-[#3C3C3E] transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      <StartNewPlanModal
        isOpen={showStartPlan}
        onClose={() => setShowStartPlan(false)}
        onSelectPlan={(planType) => {
          if (planType === "fixed") {
            setCreateFixedOpen(true);
          } else if (planType === "target") {
            setCreateTargetOpen(true);
          } else if (planType === "easy-life") {
            setCreateEasyOpen(true);
          } else if (planType === "fixed-deposit") {
            setCreateDepositOpen(true);
          }
        }}
        onSelectProduct={(p) => openCreateForProduct(p)}
      />

      <CreateFixedSavingsModal
        isOpen={createFixedOpen}
        onClose={() => setCreateFixedOpen(false)}
        selectedProduct={selectedProduct}
        availableBalance={ngnBalance}
        onSuccess={() => {}}
      />

      <CreateTargetSavingsModal
        isOpen={createTargetOpen}
        onClose={() => setCreateTargetOpen(false)}
        selectedProduct={selectedProduct}
        availableBalance={ngnBalance}
        onSuccess={() => {}}
      />

      <CreateEasyLifeSavingsModal
        isOpen={createEasyOpen}
        onClose={() => setCreateEasyOpen(false)}
        selectedProduct={selectedProduct}
        availableBalance={ngnBalance}
        onSuccess={() => {}}
      />

      <CreateFixedDepositModal
        isOpen={createDepositOpen}
        onClose={() => setCreateDepositOpen(false)}
        selectedProduct={selectedProduct}
        availableBalance={ngnBalance}
        onSuccess={() => {}}
      />

      {selectedPlanId != null ? (
        <SavingsPlanDetailsModal
          isOpen={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          planId={selectedPlanId}
          availableBalance={ngnBalance}
        />
      ) : null}
    </div>
  );
};

export default FinanceContent;
