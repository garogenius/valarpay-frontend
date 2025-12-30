"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useMemo, useState } from "react";
import { IoClose } from "react-icons/io5";
import CustomButton from "@/components/shared/Button";
import { useSavingsPlanDetails } from "@/api/savings/savings.queries";
import FundSavingsPlanModal from "@/components/modals/FundSavingsPlanModal";
import CloseSavingsPlanModal from "@/components/modals/CloseSavingsPlanModal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  planId: string | number;
  availableBalance: number;
};

function formatDate(d?: string) {
  if (!d) return "-";
  try {
    const dt = new Date(d);
    // keep same short format used across app
    const dd = String(dt.getDate()).padStart(2, "0");
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const yyyy = String(dt.getFullYear());
    return `${dd}-${mm}-${yyyy}`;
  } catch {
    return d;
  }
}

export default function SavingsPlanDetailsModal({ isOpen, onClose, planId, availableBalance }: Props) {
  const [fundOpen, setFundOpen] = useState(false);
  const [closeEarlyOpen, setCloseEarlyOpen] = useState(false);
  const [closeMaturityOpen, setCloseMaturityOpen] = useState(false);

  const { details, isPending, isError } = useSavingsPlanDetails({ planId }, isOpen);

  const plan = (details?.plan || details?.data?.plan || details?.planDetails || details?.data || details) as any;
  const fundingHistory = (details?.fundingHistory ||
    details?.data?.fundingHistory ||
    details?.history ||
    details?.data?.history ||
    []) as any[];

  const currency = plan?.currency || plan?.walletCurrency || "NGN";
  const principal = Number(details?.principal ?? plan?.targetAmount ?? plan?.amount ?? 0) || 0;
  const interestEarned = Number(details?.interestEarned ?? plan?.interestEarned ?? 0) || 0;
  const currentAmount = Number(plan?.currentAmount ?? plan?.balance ?? 0) || 0;

  const matured = useMemo(() => {
    const m = plan?.maturityDate || plan?.endDate;
    if (!m) return false;
    const t = new Date(m).getTime();
    return Number.isFinite(t) && Date.now() >= t;
  }, [plan?.maturityDate, plan?.endDate]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[65] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
        <div className="relative bg-[#0A0A0A] rounded-2xl w-full max-w-md mx-4 p-6 shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-white text-lg font-semibold">{plan?.name || "Savings Plan"}</h3>
              <p className="text-gray-500 text-sm mt-1">Transaction History</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <IoClose className="text-2xl" />
            </button>
          </div>

          {isPending ? (
            <div className="py-10 text-center text-gray-400 text-sm">Loading...</div>
          ) : isError ? (
            <div className="py-10 text-center text-gray-400 text-sm">Unable to load plan details</div>
          ) : (
            <>
              {/* Summary */}
              <div className="rounded-xl bg-[#141416] border border-gray-800 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs">Total Payout</p>
                    <p className="text-white font-semibold">
                      {currency} {Number(details?.totalPayout ?? currentAmount ?? principal ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-green-500/15 border border-green-500/25 flex items-center justify-center">
                    <span className="text-green-500 font-bold">✓</span>
                  </div>
                </div>
                <div className="px-4 py-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Principal Amount</p>
                    <p className="text-white">{currency} {principal.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-xs">Interest Earned</p>
                    <p className="text-green-500">{currency} {interestEarned.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Start Date</p>
                    <p className="text-white">{formatDate(plan?.startDate || plan?.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-xs">End Date</p>
                    <p className="text-white">{formatDate(plan?.endDate || plan?.maturityDate)}</p>
                  </div>
                </div>
              </div>

              {/* Funding history */}
              <div className="mt-4 rounded-xl bg-[#141416] border border-gray-800 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-800">
                  <p className="text-white text-sm font-semibold">Transaction History</p>
                </div>
                <div className="max-h-64 overflow-auto">
                  {(fundingHistory || []).length === 0 ? (
                    <div className="py-8 text-center text-gray-500 text-sm">No transactions</div>
                  ) : (
                    (fundingHistory || []).map((h, idx) => (
                      <div key={String(h?.id ?? idx)} className="px-4 py-3 border-b border-gray-800/70 flex items-center justify-between">
                        <div className="min-w-0">
                          <p className="text-white text-sm truncate">{h?.type || h?.operationType || "Deposit"}</p>
                          <p className="text-gray-500 text-xs">{formatDate(h?.createdAt)}</p>
                        </div>
                        <p className="text-white text-sm font-medium">
                          +{currency} {Number(h?.amount || 0).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* CTA buttons */}
              <div className="mt-5 flex flex-col gap-3">
                <CustomButton onClick={() => setFundOpen(true)} className="w-full py-3 rounded-full text-sm">
                  Fund Plan
                </CustomButton>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCloseEarlyOpen(true)}
                    className="py-3 rounded-full bg-[#2C2C2E] text-white text-sm font-medium hover:bg-[#3C3C3E] transition-colors"
                  >
                    Close Early
                  </button>
                  <button
                    type="button"
                    disabled={!matured}
                    onClick={() => setCloseMaturityOpen(true)}
                    className="py-3 rounded-full bg-[#2C2C2E] text-white text-sm font-medium hover:bg-[#3C3C3E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Close at Maturity
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <FundSavingsPlanModal
        isOpen={fundOpen}
        onClose={() => setFundOpen(false)}
        planId={planId}
        currency={currency}
        availableBalance={availableBalance}
      />

      <CloseSavingsPlanModal
        isOpen={closeEarlyOpen}
        onClose={() => setCloseEarlyOpen(false)}
        planId={planId}
        mode="early"
        currency={currency}
        principalAmount={principal}
        interestEarned={0}
        currentAmount={currentAmount || principal}
      />

      <CloseSavingsPlanModal
        isOpen={closeMaturityOpen}
        onClose={() => setCloseMaturityOpen(false)}
        planId={planId}
        mode="maturity"
        currency={currency}
        principalAmount={principal}
        interestEarned={interestEarned}
        currentAmount={currentAmount}
      />
    </>
  );
}











