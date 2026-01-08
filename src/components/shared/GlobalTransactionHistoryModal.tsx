"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CgClose } from "react-icons/cg";
import { LuCopy } from "react-icons/lu";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { MdDownload } from "react-icons/md";
import { MdOutlineSupportAgent } from "react-icons/md";
import { FiCheckCircle } from "react-icons/fi";

interface GlobalTransactionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: {
    id: string;
    type: "TRANSFER" | "BILL_PAYMENT" | "AIRTIME" | "DATA" | "CABLE" | "ELECTRICITY" | "INTERNET";
    status: "SUCCESSFUL" | "FAILED" | "PENDING";
    amount: number;
    fee?: number;
    currency: string;
    reference: string;
    description?: string;
    createdAt: string;
    paymentMethod?: string;
    direction?: "credit" | "debit";
    availableBalance?: string;
    
    // Transfer specific fields
    recipientName?: string;
    recipientAccount?: string;
    recipientBank?: string;
    senderName?: string;
    senderAccount?: string;
    
    // Bill payment specific fields
    billerName?: string;
    billerNumber?: string;
    network?: string;
    planName?: string;
    validity?: string;
    provider?: string;
  };
}

const GlobalTransactionHistoryModal: React.FC<GlobalTransactionHistoryModalProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  const [downloading, setDownloading] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard", { duration: 2000 });
  };

  const getTransactionTypeLabel = () => {
    switch (transaction.type) {
      case "TRANSFER":
        return transaction.recipientBank === "ValarPay" ? "Merchant Transfer" : "Transfer From";
      case "INTERNET":
        return "Internet";
      case "AIRTIME":
        return "Airtime";
      case "DATA":
        return "Mobile Data";
      case "CABLE":
        return "Cable / TV";
      case "ELECTRICITY":
        return "Electricity";
      default:
        return "Transaction";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy hh:mm a");
    } catch {
      return dateString;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 dark:bg-black/60"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md bg-bg-600 dark:bg-bg-1100 border border-border-800 dark:border-border-700 rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 sm:px-6 pt-4 pb-3 border-b border-white/10">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-white text-base sm:text-lg font-semibold">Transaction History</h3>
                  <p className="text-white/60 text-xs sm:text-sm mt-0.5">
                    View complete information about this transaction
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 cursor-pointer bg-bg-1400 rounded-full hover:bg-bg-1200 transition-colors"
                >
                  <CgClose className="text-xl text-text-200 dark:text-text-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4">
              {/* Status Badge */}
              <div className={`w-full rounded-xl px-6 py-8 flex flex-col items-center justify-center mb-4 ${
                transaction.status === "SUCCESSFUL"
                  ? "bg-[#224022]"
                  : transaction.status === "FAILED"
                    ? "bg-red-500/10 border border-red-700/40"
                    : "bg-yellow-500/10 border border-yellow-700/40"
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  {transaction.status === "SUCCESSFUL" && (
                    <FiCheckCircle className="text-white text-2xl" />
                  )}
                  <span className={`text-lg font-medium ${
                    transaction.status === "SUCCESSFUL" ? "text-white" : 
                    transaction.status === "FAILED" ? "text-red-500" : "text-yellow-500"
                  }`}>
                    {transaction.status === "SUCCESSFUL" ? "Successful" : transaction.status}
                  </span>
                </div>
                <p className="text-white text-3xl font-bold">
                  {transaction.currency === "NGN" ? "₦" : transaction.currency}
                  {Number(transaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              {/* Transaction Details */}
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-xs">Transaction ID</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-xs font-medium">
                      {transaction.reference || transaction.id}
                    </span>
                    <button
                      onClick={() => copyToClipboard(transaction.reference || transaction.id)}
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      <LuCopy className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-xs">Date & Time</span>
                  <span className="text-white text-xs font-medium">
                    {formatDate(transaction.createdAt)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-xs">Payment Method</span>
                  <span className="text-white text-xs font-medium">
                    {transaction.paymentMethod || "Available Balance"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-xs">Transaction Type</span>
                  <span className="text-white text-xs font-medium">
                    {getTransactionTypeLabel()}
                  </span>
                </div>

                {/* Transfer specific */}
                {transaction.type === "TRANSFER" && transaction.senderName && (
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-xs">From</span>
                    <span className="text-white text-xs font-medium">
                      {transaction.senderName}
                    </span>
                  </div>
                )}

                {/* Narration */}
                {transaction.description && (
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-xs">Narration</span>
                    <span className="text-white text-xs font-medium">
                      {transaction.description}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    window.location.href = `tel:+23481346906`;
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                >
                  <MdOutlineSupportAgent className="text-lg" />
                  <span className="text-sm font-medium">Contact Support</span>
                </button>
                <button
                  onClick={() => {
                    // This will trigger the receipt modal/download
                    // The parent component should handle this
                    toast.success("Receipt download initiated");
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#D4B139] hover:bg-[#c7a42f] text-black transition-colors"
                >
                  <MdDownload className="text-lg" />
                  <span className="text-sm font-medium">Download Receipt</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GlobalTransactionHistoryModal;
