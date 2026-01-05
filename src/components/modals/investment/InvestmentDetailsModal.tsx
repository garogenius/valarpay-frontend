"use client";

import React, { useMemo, useState, useEffect } from "react";
import { CgClose } from "react-icons/cg";
import { FiCopy, FiExternalLink } from "react-icons/fi";
import CustomButton from "@/components/shared/Button";
import { useGetInvestmentDetails, usePayoutInvestment } from "@/api/investment/investment.queries";
import { formatCurrency } from "@/utils/utilityFunctions";
import SpinnerLoader from "@/components/Loader/SpinnerLoader";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";

interface InvestmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  investmentId: string;
  onRefresh?: () => void;
}

function formatDate(d?: string) {
  if (!d) return "-";
  try {
    const dt = new Date(d);
    const dd = String(dt.getDate()).padStart(2, "0");
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const yyyy = String(dt.getFullYear());
    return `${dd}-${mm}-${yyyy}`;
  } catch {
    return d;
  }
}

const InvestmentDetailsModal: React.FC<InvestmentDetailsModalProps> = ({
  isOpen,
  onClose,
  investmentId,
  onRefresh,
}) => {
  const [walletPin, setWalletPin] = useState("");
  const [showPayoutStep, setShowPayoutStep] = useState(false);

  const { investment, isPending, isError } = useGetInvestmentDetails({
    id: investmentId,
    enabled: isOpen,
  });

  const derived = useMemo(() => {
    if (!investment) return { principal: 0, interestEarned: 0, expectedReturn: 0, totalPayable: 0 };
    
    const principal = Number(investment.capitalAmount || investment.investmentAmount || investment.amount || 0);
    const interestEarned = Number(investment.interestAmount || investment.earnedAmount || 0);
    const expectedReturn = typeof investment.expectedReturn === "number" ? investment.expectedReturn : (principal + interestEarned);
    const totalPayable = expectedReturn || principal + interestEarned;

    return { principal, interestEarned, expectedReturn, totalPayable };
  }, [investment]);

  const isMatured = useMemo(() => {
    if (!investment?.maturityDate) return false;
    return new Date(investment.maturityDate) <= new Date();
  }, [investment?.maturityDate]);

  const canPayout = useMemo(() => {
    return investment?.status === "ACTIVE" && isMatured && Boolean(investmentId);
  }, [investment?.status, isMatured, investmentId]);

  const onPayoutError = (error: unknown) => {
    const errorMessage = (error as { response?: { data?: { message?: unknown } } })?.response?.data
      ?.message as unknown;
    const descriptions = Array.isArray(errorMessage)
      ? (errorMessage as string[])
      : [typeof errorMessage === "string" ? errorMessage : "Failed to process payout"];

    ErrorToast({
      title: "Payout Failed",
      descriptions,
    });
    setShowPayoutStep(false);
    setWalletPin("");
  };

  const onPayoutSuccess = (data: unknown) => {
    // API response structure: { message: "...", data: { investment: {...}, payout: { totalPayout: ... } } }
    // After axios wrapper: { data: { message: "...", data: { investment: {...}, payout: { totalPayout: ... } } } }
    const responseData = (data as { data?: { data?: { payout?: { totalPayout?: number } } } })?.data?.data;
    const totalPayout = responseData?.payout?.totalPayout;
    const fallbackAmount = derived.totalPayable;
    SuccessToast({
      title: "Payout Successful!",
      description: `₦${Number(totalPayout ?? fallbackAmount).toLocaleString()} has been paid to your wallet.`,
    });
    setShowPayoutStep(false);
    setWalletPin("");
    if (onRefresh) onRefresh();
    onClose();
  };

  const { mutate: payoutInvestment, isPending: payingOut } = usePayoutInvestment(
    onPayoutError,
    onPayoutSuccess
  );

  useEffect(() => {
    if (!isOpen) {
      setShowPayoutStep(false);
      setWalletPin("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getStatusBadge = () => {
    const status = investment?.status || (isMatured ? "MATURED" : "ACTIVE");
    const isPaidOut = status === "PAID_OUT";
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
        isPaidOut 
          ? 'bg-emerald-500/10 text-emerald-400' 
          : 'bg-[#f76301]/10 text-[#f76301]'
      }`}>
        {isPaidOut ? 'Paid Out' : isMatured ? 'Matured' : 'Active'}
      </span>
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    SuccessToast({
      title: "Copied!",
      description: "Reference copied to clipboard",
    });
  };

  const handlePayout = () => {
    if (!walletPin || walletPin.length !== 4) {
      ErrorToast({
        title: "Validation Error",
        descriptions: ["Please enter a valid 4-digit PIN"],
      });
      return;
    }

    if (!investmentId) {
      ErrorToast({
        title: "Error",
        descriptions: ["Investment ID is missing"],
      });
      return;
    }

    payoutInvestment({
      investmentId,
      formdata: { walletPin },
    });
  };

  const roiRate = investment?.roiRate ? (investment.roiRate * 100).toFixed(0) : "0";
  const tenureMonths = investment?.tenureMonths || 12;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-bg-600 dark:bg-bg-1100 border border-border-800 dark:border-border-700 rounded-2xl p-6 z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Investment #{investmentId.slice(-8).toUpperCase()}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              {getStatusBadge()}
              <span className="text-xs text-white/50">Investment</span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
          >
            <CgClose className="text-xl text-white" />
          </button>
        </div>

        {isPending ? (
          <div className="flex items-center justify-center py-12">
            <SpinnerLoader width={32} height={32} color="#FF6B2C" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-red-400 text-sm">Failed to load investment details</p>
          </div>
        ) : !investment ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-400 text-sm">Investment not found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-bg-500 dark:bg-bg-900 p-4 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/70">Total Value</span>
                <span className="text-white font-medium text-lg">{formatCurrency(derived.totalPayable, "NGN")}</span>
              </div>
              
              <div className="h-px bg-white/10 my-3" />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/60 text-xs mb-1">Capital Amount</p>
                  <p className="text-white font-medium">{formatCurrency(derived.principal, "NGN")}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs mb-1">Interest Amount</p>
                  <p className="text-emerald-400 font-medium">+{formatCurrency(derived.interestEarned, "NGN")}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs mb-1">Expected Return</p>
                  <p className="text-white font-medium">{formatCurrency(derived.expectedReturn, "NGN")}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs mb-1">Interest Rate</p>
                  <p className="text-white font-medium">{roiRate}% per annum</p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <h3 className="text-white font-medium">Investment Details</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">Investment ID</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm">{investmentId.slice(-12).toUpperCase()}</span>
                    <button 
                      onClick={() => copyToClipboard(investmentId)}
                      className="text-white/50 hover:text-[#f76301] transition-colors"
                    >
                      <FiCopy className="text-sm" />
                    </button>
                  </div>
                </div>
                
                {investment.agreementReference && (
                  <div className="flex justify-between">
                    <span className="text-white/60 text-sm">Agreement Reference</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm">{investment.agreementReference}</span>
                      <button 
                        onClick={() => copyToClipboard(investment.agreementReference || "")}
                        className="text-white/50 hover:text-[#f76301] transition-colors"
                      >
                        <FiCopy className="text-sm" />
                      </button>
                    </div>
                  </div>
                )}

                {investment.transaction?.transactionRef && (
                  <div className="flex justify-between">
                    <span className="text-white/60 text-sm">Transaction Reference</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm">{investment.transaction.transactionRef}</span>
                      <button 
                        onClick={() => copyToClipboard(investment.transaction.transactionRef || "")}
                        className="text-white/50 hover:text-[#f76301] transition-colors"
                      >
                        <FiCopy className="text-sm" />
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">Start Date</span>
                  <span className="text-white text-sm">{formatDate(investment.startDate || investment.createdAt)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">Maturity Date</span>
                  <span className="text-white text-sm">{formatDate(investment.maturityDate)}</span>
                </div>

                {investment.legalDocumentUrl && (
                  <div className="flex justify-between">
                    <span className="text-white/60 text-sm">Agreement Document</span>
                    <a
                      href={investment.legalDocumentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#f76301] hover:underline text-sm flex items-center gap-1"
                    >
                      View Document
                      <FiExternalLink className="text-xs" />
                    </a>
                  </div>
                )}

                {investment.expectedReturn && (
                  <div className="flex justify-between">
                    <span className="text-white/60 text-sm">Expected Return</span>
                    <span className="text-white text-sm">{formatCurrency(investment.expectedReturn, "NGN")}</span>
                  </div>
                )}

                {tenureMonths > 0 && (
                  <div className="flex justify-between">
                    <span className="text-white/60 text-sm">Duration</span>
                    <span className="text-white text-sm">{tenureMonths} {tenureMonths === 1 ? 'month' : 'months'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              <h3 className="text-white font-medium">Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#f76301] mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">Investment Started</p>
                    <p className="text-white/60 text-xs">{formatDate(investment.startDate || investment.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${isMatured ? 'bg-emerald-400' : 'bg-white/30'}`}></div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">Maturity Date</p>
                    <p className="text-white/60 text-xs">{formatDate(investment.maturityDate)}</p>
                    {isMatured && investment.status === "PAID_OUT" && (
                      <p className="text-emerald-400 text-xs mt-1">✓ Paid Out</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2">
              {showPayoutStep ? (
                <div className="space-y-4">
                  <div className="bg-bg-500 dark:bg-bg-900 p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-3">Payout Breakdown</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/70">Capital Amount:</span>
                        <span className="text-white">{formatCurrency(derived.principal, "NGN")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Interest Amount:</span>
                        <span className="text-emerald-400">+{formatCurrency(derived.interestEarned, "NGN")}</span>
                      </div>
                      <div className="h-px bg-white/10 my-2" />
                      <div className="flex justify-between">
                        <span className="text-white font-medium">Total Payout:</span>
                        <span className="text-white font-medium">{formatCurrency(derived.totalPayable, "NGN")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-white/70 text-xs">Enter Transaction PIN</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={walletPin}
                      onChange={(e) => setWalletPin(e.target.value.replace(/\D/g, ""))}
                      className="w-full bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-3 px-3 text-white text-sm placeholder:text-white/50 outline-none"
                      placeholder="••••"
                    />
                  </div>

                  <div className="flex gap-3">
                    <CustomButton
                      onClick={() => {
                        setShowPayoutStep(false);
                        setWalletPin("");
                      }}
                      className="flex-1 bg-transparent border border-white/15 text-white rounded-lg py-2.5"
                    >
                      Cancel
                    </CustomButton>
                    <CustomButton
                      onClick={handlePayout}
                      disabled={payingOut || !walletPin || walletPin.length !== 4}
                      isLoading={payingOut}
                      className="flex-1 bg-[#f76301] hover:bg-[#e55a00] text-black rounded-lg py-2.5"
                    >
                      Confirm Payout
                    </CustomButton>
                  </div>
                </div>
              ) : (
                <>
                  {canPayout && (
                    <CustomButton
                      onClick={() => setShowPayoutStep(true)}
                      className="w-full bg-[#f76301] hover:bg-[#e55a00] text-black py-3 rounded-lg font-medium transition-colors mb-3"
                    >
                      Withdraw / Payout
                    </CustomButton>
                  )}

                  {investment.status === "PAID_OUT" && (
                    <div className="w-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 py-3 rounded-lg font-medium text-center mb-3">
                      Investment Paid Out
                    </div>
                  )}

                  {!canPayout && investment.status === "ACTIVE" && !isMatured && (
                    <div className="w-full bg-white/5 border border-white/10 text-white/60 py-3 rounded-lg font-medium text-center mb-3">
                      Investment locked until maturity
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentDetailsModal;
