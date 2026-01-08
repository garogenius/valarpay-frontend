"use client";

import React, { useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import { useGetBets, useGetBetById } from "@/api/betting/betting.queries";
import SpinnerLoader from "@/components/Loader/SpinnerLoader";
import { formatDistanceToNow } from "date-fns";
import useNavigate from "@/hooks/useNavigate";
import BetDetailsModal from "@/components/modals/betting/BetDetailsModal";

const BetHistory: React.FC = () => {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedBetType, setSelectedBetType] = useState<string>("");
  const [selectedBetId, setSelectedBetId] = useState<string | null>(null);

  const { bets, isPending, refetch } = useGetBets({
    status: selectedStatus as any,
    betType: selectedBetType as any,
    limit: 50,
  });

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "WON":
        return "text-green-400";
      case "LOST":
        return "text-red-400";
      case "PENDING":
        return "text-yellow-400";
      case "CANCELLED":
      case "REFUNDED":
        return "text-gray-400";
      default:
        return "text-white/60";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status?.toUpperCase()) {
      case "WON":
        return "bg-green-500/10 border-green-500/20";
      case "LOST":
        return "bg-red-500/10 border-red-500/20";
      case "PENDING":
        return "bg-yellow-500/10 border-yellow-500/20";
      case "CANCELLED":
      case "REFUNDED":
        return "bg-gray-500/10 border-gray-500/20";
      default:
        return "bg-white/5 border-white/10";
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Back Button */}
      <div
        onClick={() => navigate("/user/betting")}
        className="flex items-center gap-2 cursor-pointer text-text-200 dark:text-text-400"
      >
        <IoChevronBack className="text-2xl" />
        <p className="text-lg font-medium">Back</p>
      </div>

      {/* Header */}
      <div className="w-full flex items-center gap-2 sm:gap-3 justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-white text-base sm:text-xl lg:text-2xl font-semibold truncate">Bet History</h1>
          <p className="text-white/60 text-[10px] sm:text-xs lg:text-sm mt-0.5 sm:mt-1 line-clamp-1">View all your betting history</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-[#1C1C1E] border border-gray-800 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-gray-700"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="WON">Won</option>
          <option value="LOST">Lost</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="REFUNDED">Refunded</option>
        </select>

        <select
          value={selectedBetType}
          onChange={(e) => setSelectedBetType(e.target.value)}
          className="bg-[#1C1C1E] border border-gray-800 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-gray-700"
        >
          <option value="">All Types</option>
          <option value="SINGLE">Single</option>
          <option value="MULTIPLE">Multiple</option>
          <option value="SYSTEM">System</option>
        </select>
      </div>

      {/* Bets List */}
      <div className="bg-bg-600 dark:bg-bg-1100 border border-white/10 rounded-2xl p-4 sm:p-6">
        {isPending ? (
          <div className="flex items-center justify-center py-12">
            <SpinnerLoader width={32} height={32} color="#f76301" />
          </div>
        ) : bets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
              <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-white/60 text-sm">No bets found</p>
            <p className="text-white/40 text-xs text-center">Your betting history will appear here</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {bets.map((bet) => (
              <div
                key={bet.id}
                onClick={() => setSelectedBetId(bet.id)}
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors cursor-pointer"
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getStatusBg(bet.status)}`}>
                  <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <p className="text-white font-medium text-xs sm:text-sm truncate">
                      {bet.description || `${bet.betType} Bet`}
                    </p>
                    <p className={`text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex-shrink-0 ${getStatusBg(bet.status)} ${getStatusColor(bet.status)}`}>
                      {bet.status}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <p className="text-white/70 text-xs sm:text-sm">
                        Stake: <span className="text-white font-medium">₦{Number(bet.amount || 0).toLocaleString()}</span>
                      </p>
                      <span className="text-white/40">•</span>
                      <p className="text-white/70 text-xs sm:text-sm">
                        Odds: <span className="text-white font-medium">{bet.odds}</span>
                      </p>
                    </div>
                    <p className="text-white/50 text-[10px] sm:text-xs flex-shrink-0">
                      {formatDistanceToNow(new Date(bet.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  {bet.potentialWinnings > 0 && (
                    <p className="text-[#f76301] text-xs sm:text-sm font-semibold mt-1">
                      Potential Winnings: ₦{Number(bet.potentialWinnings || 0).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bet Details Modal */}
      <BetDetailsModal
        betId={selectedBetId}
        isOpen={!!selectedBetId}
        onClose={() => setSelectedBetId(null)}
      />
    </div>
  );
};

export default BetHistory;

