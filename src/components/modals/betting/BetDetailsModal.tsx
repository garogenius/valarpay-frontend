"use client";

import React from "react";
import { IoClose } from "react-icons/io5";
import { useGetBetById } from "@/api/betting/betting.queries";
import SpinnerLoader from "@/components/Loader/SpinnerLoader";
import { format } from "date-fns";

interface BetDetailsModalProps {
  betId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const BetDetailsModal: React.FC<BetDetailsModalProps> = ({ betId, isOpen, onClose }) => {
  const { data, isPending } = useGetBetById(betId);

  const bet = data?.data?.data;

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-[#0A0A0A] rounded-2xl w-full max-w-md p-4 sm:p-6 shadow-xl max-h-[calc(100vh-1.5rem)] sm:max-h-[90vh] overflow-y-auto my-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-white text-lg sm:text-xl font-semibold">Bet Details</h3>
            <p className="text-gray-500 text-sm mt-1">View detailed information about your bet</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <IoClose className="text-2xl" />
          </button>
        </div>

        {isPending ? (
          <div className="flex items-center justify-center py-12">
            <SpinnerLoader width={32} height={32} color="#f76301" />
          </div>
        ) : !bet ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <p className="text-white/60 text-sm">Bet not found</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Status */}
            <div className="flex items-center justify-between p-4 bg-[#1C1C1E] rounded-lg">
              <span className="text-gray-400 text-sm">Status</span>
              <span className={`text-sm font-semibold px-3 py-1 rounded-full ${getStatusBg(bet.status)} ${getStatusColor(bet.status)}`}>
                {bet.status}
              </span>
            </div>

            {/* Bet Type */}
            <div className="flex items-center justify-between p-4 bg-[#1C1C1E] rounded-lg">
              <span className="text-gray-400 text-sm">Bet Type</span>
              <span className="text-white text-sm font-medium">{bet.betType}</span>
            </div>

            {/* Amount */}
            <div className="flex items-center justify-between p-4 bg-[#1C1C1E] rounded-lg">
              <span className="text-gray-400 text-sm">Stake Amount</span>
              <span className="text-white text-sm font-medium">₦{Number(bet.amount || 0).toLocaleString()}</span>
            </div>

            {/* Odds */}
            <div className="flex items-center justify-between p-4 bg-[#1C1C1E] rounded-lg">
              <span className="text-gray-400 text-sm">Odds</span>
              <span className="text-white text-sm font-medium">{bet.odds}</span>
            </div>

            {/* Potential Winnings */}
            {bet.potentialWinnings > 0 && (
              <div className="flex items-center justify-between p-4 bg-[#1C1C1E] rounded-lg">
                <span className="text-gray-400 text-sm">Potential Winnings</span>
                <span className="text-[#f76301] text-sm font-bold">₦{Number(bet.potentialWinnings || 0).toLocaleString()}</span>
              </div>
            )}

            {/* Description */}
            {bet.description && (
              <div className="p-4 bg-[#1C1C1E] rounded-lg">
                <span className="text-gray-400 text-sm block mb-2">Description</span>
                <span className="text-white text-sm">{bet.description}</span>
              </div>
            )}

            {/* Metadata */}
            {bet.metadata && Object.keys(bet.metadata).length > 0 && (
              <div className="p-4 bg-[#1C1C1E] rounded-lg">
                <span className="text-gray-400 text-sm block mb-2">Event Details</span>
                <div className="flex flex-col gap-2">
                  {bet.metadata.sport && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs">Sport</span>
                      <span className="text-white text-xs">{bet.metadata.sport}</span>
                    </div>
                  )}
                  {bet.metadata.event && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs">Event</span>
                      <span className="text-white text-xs">{bet.metadata.event}</span>
                    </div>
                  )}
                  {bet.metadata.selection && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs">Selection</span>
                      <span className="text-white text-xs">{bet.metadata.selection}</span>
                    </div>
                  )}
                  {bet.metadata.eventDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs">Event Date</span>
                      <span className="text-white text-xs">
                        {format(new Date(bet.metadata.eventDate), "MMM dd, yyyy HH:mm")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Transaction Reference */}
            {bet.transactionRef && (
              <div className="flex items-center justify-between p-4 bg-[#1C1C1E] rounded-lg">
                <span className="text-gray-400 text-sm">Transaction Ref</span>
                <span className="text-white text-xs font-mono">{bet.transactionRef}</span>
              </div>
            )}

            {/* Order Reference */}
            {bet.orderReference && (
              <div className="flex items-center justify-between p-4 bg-[#1C1C1E] rounded-lg">
                <span className="text-gray-400 text-sm">Order Reference</span>
                <span className="text-white text-xs font-mono">{bet.orderReference}</span>
              </div>
            )}

            {/* Created At */}
            <div className="flex items-center justify-between p-4 bg-[#1C1C1E] rounded-lg">
              <span className="text-gray-400 text-sm">Placed At</span>
              <span className="text-white text-xs">
                {format(new Date(bet.createdAt), "MMM dd, yyyy HH:mm:ss")}
              </span>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-full bg-[#f76301] hover:bg-[#f76301]/90 text-black text-sm font-medium transition-colors mt-4"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BetDetailsModal;

