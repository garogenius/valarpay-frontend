"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import { IoChevronBack, IoArrowDownCircleOutline, IoArrowUpCircleOutline, IoWalletOutline } from "react-icons/io5";
import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";
import CustomButton from "@/components/shared/Button";
import useNavigate from "@/hooks/useNavigate";
import SpinnerLoader from "@/components/Loader/SpinnerLoader";
import { useGetBettingWallet, useGetBettingWalletTransactions } from "@/api/betting/betting.queries";
import FundWalletModal from "@/components/modals/betting/FundWalletModal";
import FundPlatformModal from "@/components/modals/betting/FundPlatformModal";
import WithdrawModal from "@/components/modals/betting/WithdrawModal";
import { formatDistanceToNow } from "date-fns";

const BettingContent = () => {
  const navigate = useNavigate();
  const [isFundWalletOpen, setIsFundWalletOpen] = useState(false);
  const [isFundPlatformOpen, setIsFundPlatformOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  // Fetch betting wallet
  const { data: walletData, isLoading: walletLoading, refetch: refetchWallet } = useGetBettingWallet();
  const bettingWallet = walletData?.data?.data;

  // Fetch transactions
  const { data: transactionsData, isLoading: transactionsLoading, refetch: refetchTransactions } = useGetBettingWalletTransactions({
    limit: 20,
  });
  const transactions = transactionsData?.data?.data || [];

  const handleModalSuccess = () => {
    refetchWallet();
    refetchTransactions();
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "SUCCESS":
      case "COMPLETED":
        return "text-green-400";
      case "FAILED":
      case "REJECTED":
        return "text-red-400";
      case "PENDING":
      case "PROCESSING":
        return "text-yellow-400";
      default:
        return "text-white/60";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status?.toUpperCase()) {
      case "SUCCESS":
      case "COMPLETED":
        return "bg-green-500/10 border-green-500/20";
      case "FAILED":
      case "REJECTED":
        return "bg-red-500/10 border-red-500/20";
      case "PENDING":
      case "PROCESSING":
        return "bg-yellow-500/10 border-yellow-500/20";
      default:
        return "bg-white/5 border-white/10";
    }
  };

  const getTransactionIcon = (type: string) => {
    const operationType = type?.toUpperCase() || "";
    if (operationType.includes("FUND") || operationType.includes("DEPOSIT")) {
      return <FiArrowDownLeft className="text-green-400" />;
    } else if (operationType.includes("WITHDRAW") || operationType.includes("WITHDRAWAL")) {
      return <FiArrowUpRight className="text-red-400" />;
    }
    return <IoWalletOutline className="text-white/60" />;
  };

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Back Button */}
      <div
        onClick={() => navigate("/user/payments")}
        className="flex items-center gap-2 cursor-pointer text-text-200 dark:text-text-400"
      >
        <IoChevronBack className="text-2xl" />
        <p className="text-lg font-medium">Back</p>
      </div>

      {/* Header */}
      <div className="w-full flex items-center gap-2 sm:gap-3 justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-white text-base sm:text-xl lg:text-2xl font-semibold truncate">Betting Wallet</h1>
          <p className="text-white/60 text-[10px] sm:text-xs lg:text-sm mt-0.5 sm:mt-1 line-clamp-1">Manage your betting wallet and transactions</p>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-[#FF6B2C]/20 to-[#FF6B2C]/10 border border-[#FF6B2C]/30 rounded-2xl p-4 sm:p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/70 text-xs sm:text-sm mb-1">Betting Wallet Balance</p>
            {walletLoading ? (
              <div className="flex items-center gap-2">
                <SpinnerLoader width={20} height={20} color="#FF6B2C" />
                <span className="text-white/70 text-xs sm:text-sm">Loading...</span>
              </div>
            ) : (
              <p className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold">
                ₦{bettingWallet?.balance?.toLocaleString() || "0.00"}
              </p>
            )}
          </div>
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#FF6B2C]/20 flex items-center justify-center flex-shrink-0">
            <IoWalletOutline className="text-2xl sm:text-3xl text-[#FF6B2C]" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <button
          onClick={() => setIsFundWalletOpen(true)}
          className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-3 sm:p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-500/20 flex items-center justify-center">
            <IoArrowDownCircleOutline className="text-xl sm:text-2xl text-green-400" />
          </div>
          <span className="text-white text-xs sm:text-sm font-medium text-center">Fund Wallet</span>
        </button>

        <button
          onClick={() => setIsFundPlatformOpen(true)}
          className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-3 sm:p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
            <FiArrowDownLeft className="text-xl sm:text-2xl text-blue-400" />
          </div>
          <span className="text-white text-xs sm:text-sm font-medium text-center">Fund Platform</span>
        </button>

        <button
          onClick={() => setIsWithdrawOpen(true)}
          className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-3 sm:p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-500/20 flex items-center justify-center">
            <IoArrowUpCircleOutline className="text-xl sm:text-2xl text-red-400" />
          </div>
          <span className="text-white text-xs sm:text-sm font-medium text-center">Withdraw</span>
        </button>
      </div>

      {/* Transactions Section */}
      <div className="bg-bg-600 dark:bg-bg-1100 border border-white/10 rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-base sm:text-lg font-semibold">Recent Transactions</h2>
          <span className="text-white/60 text-xs">{transactions.length} transactions</span>
        </div>

        {transactionsLoading ? (
          <div className="flex items-center justify-center py-12">
            <SpinnerLoader width={32} height={32} color="#FF6B2C" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
              <IoWalletOutline className="text-3xl text-white/40" />
            </div>
            <p className="text-white/60 text-sm">No transactions yet</p>
            <p className="text-white/40 text-xs text-center">Your betting wallet transactions will appear here</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {transactions.map((txn: any) => (
              <div
                key={txn.id}
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getStatusBg(txn.status)}`}>
                  {getTransactionIcon(txn.operationType || txn.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <p className="text-white font-medium text-xs sm:text-sm truncate">{txn.operationType || txn.type || "Transaction"}</p>
                    <p className={`text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex-shrink-0 ${getStatusBg(txn.status)} ${getStatusColor(txn.status)}`}>
                      {txn.status}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs sm:text-sm font-semibold ${
                      (txn.operationType?.toUpperCase() || txn.type?.toUpperCase() || "").includes("FUND") || 
                      (txn.operationType?.toUpperCase() || txn.type?.toUpperCase() || "").includes("DEPOSIT")
                        ? "text-green-400"
                        : "text-red-400"
                    }`}>
                      {(txn.operationType?.toUpperCase() || txn.type?.toUpperCase() || "").includes("FUND") || 
                       (txn.operationType?.toUpperCase() || txn.type?.toUpperCase() || "").includes("DEPOSIT")
                        ? "+"
                        : "-"}
                      ₦{Number(txn.amount || 0).toLocaleString()}
                    </p>
                    <p className="text-white/50 text-[10px] sm:text-xs flex-shrink-0">
                      {formatDistanceToNow(new Date(txn.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  {txn.description && (
                    <p className="text-white/60 text-[10px] sm:text-xs mt-1 truncate">{txn.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <FundWalletModal
        isOpen={isFundWalletOpen}
        onClose={() => setIsFundWalletOpen(false)}
        onSuccess={handleModalSuccess}
      />

      <FundPlatformModal
        isOpen={isFundPlatformOpen}
        onClose={() => setIsFundPlatformOpen(false)}
        onSuccess={handleModalSuccess}
      />

      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default BettingContent;







