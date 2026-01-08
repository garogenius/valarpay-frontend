"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CgClose } from "react-icons/cg";
import { FiDownload, FiMessageCircle, FiCheckCircle, FiXCircle, FiClock } from "react-icons/fi";
import { LuCopy } from "react-icons/lu";
import { format } from "date-fns";
import toast from "react-hot-toast";
import CustomButton from "./Button";
import GlobalTransactionReceiptModal from "./GlobalTransactionReceiptModal";
import { Transaction } from "@/constants/types";
import useNavigate from "@/hooks/useNavigate";

interface GlobalTransactionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

const GlobalTransactionHistoryModal: React.FC<GlobalTransactionHistoryModalProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  const navigate = useNavigate();
  const [showReceipt, setShowReceipt] = useState(false);

  if (!isOpen || !transaction) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard", { duration: 2000 });
  };

  const getStatusIcon = () => {
    if (transaction.status === "SUCCESSFUL" || transaction.status === "SUCCESS") {
      return <FiCheckCircle className="text-2xl text-green-500" />;
    } else if (transaction.status === "FAILED" || transaction.status === "FAILURE") {
      return <FiXCircle className="text-2xl text-red-500" />;
    }
    return <FiClock className="text-2xl text-yellow-500" />;
  };

  const getStatusColor = () => {
    if (transaction.status === "SUCCESSFUL" || transaction.status === "SUCCESS") {
      return "bg-green-500/20 border-green-500/30";
    } else if (transaction.status === "FAILED" || transaction.status === "FAILURE") {
      return "bg-red-500/20 border-red-500/30";
    }
    return "bg-yellow-500/20 border-yellow-500/30";
  };

  const getStatusText = () => {
    if (transaction.status === "SUCCESSFUL" || transaction.status === "SUCCESS") {
      return "Successful";
    } else if (transaction.status === "FAILED" || transaction.status === "FAILURE") {
      return "Failed";
    }
    return "Pending";
  };

  const getAmount = () => {
    const amount =
      transaction.transferDetails?.amountPaid ||
      transaction.depositDetails?.amountPaid ||
      transaction.billDetails?.amountPaid ||
      0;
    return amount;
  };

  const getCurrencySymbol = () => {
    return transaction.currency === "NGN" ? "₦" : transaction.currency;
  };

  const getTransactionType = () => {
    if (transaction.category === "TRANSFER") {
      return "Inter-bank Transfer";
    } else if (transaction.category === "DEPOSIT") {
      return "Deposit";
    } else if (transaction.category === "BILL_PAYMENT") {
      const billType = transaction.billDetails?.type;
      if (billType === "airtime") return "Airtime";
      if (billType === "data") return "Mobile Data";
      if (billType === "cable") return "Cable / TV";
      if (billType === "electricity") return "Electricity";
      if (billType === "internet") return "Internet";
      return "Bill Payment";
    }
    return "Transaction";
  };

  const getPaymentMethod = () => {
    return "Available Balance";
  };

  const getToField = () => {
    if (transaction.category === "TRANSFER") {
      return transaction.transferDetails?.beneficiaryName || "N/A";
    } else if (transaction.category === "BILL_PAYMENT") {
      const billType = transaction.billDetails?.type;
      if (billType === "airtime" || billType === "data") {
        return transaction.billDetails?.provider || "N/A";
      }
      return transaction.billDetails?.provider || "N/A";
    }
    return "N/A";
  };

  const getNumber = () => {
    if (transaction.category === "BILL_PAYMENT") {
      return transaction.billDetails?.recipientPhone || "N/A";
    }
    return "N/A";
  };

  const getPlan = () => {
    if (transaction.category === "BILL_PAYMENT" && transaction.billDetails?.plan) {
      return transaction.billDetails.plan;
    }
    return "N/A";
  };

  const getDuration = () => {
    if (transaction.category === "BILL_PAYMENT" && transaction.billDetails?.validity) {
      return transaction.billDetails.validity;
    }
    return "N/A";
  };

  const handleContactSupport = () => {
    onClose();
    navigate("/user/settings/support", "push");
  };

  const handleDownloadReceipt = () => {
    setShowReceipt(true);
  };

  const convertToReceiptTransaction = () => {
    return {
      id: transaction.id,
      type: transaction.category === "TRANSFER" ? "TRANSFER" : 
            transaction.category === "BILL_PAYMENT" ? 
              (transaction.billDetails?.type === "data" ? "DATA" :
               transaction.billDetails?.type === "airtime" ? "AIRTIME" :
               transaction.billDetails?.type === "cable" ? "CABLE" :
               transaction.billDetails?.type === "electricity" ? "ELECTRICITY" :
               transaction.billDetails?.type === "internet" ? "INTERNET" : "BILL_PAYMENT") :
            "DEPOSIT",
      status: transaction.status === "SUCCESSFUL" || transaction.status === "SUCCESS" ? "SUCCESSFUL" :
              transaction.status === "FAILED" || transaction.status === "FAILURE" ? "FAILED" : "PENDING",
      amount: getAmount(),
      currency: transaction.currency,
      reference: transaction.transactionRef || transaction.reference || transaction.id,
      description: transaction.description || "",
      createdAt: transaction.createdAt,
      recipientName: transaction.transferDetails?.beneficiaryName,
      recipientAccount: transaction.transferDetails?.beneficiaryAccountNumber,
      recipientBank: transaction.transferDetails?.beneficiaryBankName,
      senderName: transaction.depositDetails?.senderName,
      senderAccount: transaction.depositDetails?.senderAccountNumber,
      billerName: transaction.billDetails?.provider,
      billerNumber: transaction.billDetails?.recipientPhone,
      network: transaction.billDetails?.provider,
      planName: transaction.billDetails?.plan,
      validity: transaction.billDetails?.validity,
      provider: transaction.billDetails?.provider,
    };
  };

  return (
    <>
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
              <div className="px-6 pt-5 pb-4 border-b border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-white text-lg font-semibold">Transaction History</h2>
                  <button
                    onClick={onClose}
                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                    aria-label="Close"
                  >
                    <CgClose className="text-xl text-white" />
                  </button>
                </div>
                <p className="text-white/60 text-sm">View complete information about this transaction</p>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {/* Status Section */}
                <div className={`mb-6 rounded-xl p-4 border ${getStatusColor()}`}>
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon()}
                    <span className={`text-lg font-semibold ${
                      transaction.status === "SUCCESSFUL" || transaction.status === "SUCCESS" 
                        ? "text-green-500" 
                        : transaction.status === "FAILED" || transaction.status === "FAILURE"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}>
                      {getStatusText()}
                    </span>
                  </div>
                  <p className="text-white text-xl font-bold">
                    {getCurrencySymbol()}{getAmount().toLocaleString(undefined, { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}
                  </p>
                </div>

                {/* Transaction Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-white/10">
                    <span className="text-sm text-white/60">Transaction ID</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white font-medium">
                        {transaction.transactionRef || transaction.reference || transaction.id}
                      </span>
                      <button
                        onClick={() => copyToClipboard(transaction.transactionRef || transaction.reference || transaction.id)}
                        className="text-white/60 hover:text-white transition-colors"
                        aria-label="Copy transaction ID"
                      >
                        <LuCopy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-white/10">
                    <span className="text-sm text-white/60">Date & Time</span>
                    <span className="text-sm text-white font-medium">
                      {format(new Date(transaction.createdAt), "MMM dd, yyyy h:mm a")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-white/10">
                    <span className="text-sm text-white/60">Payment Method</span>
                    <span className="text-sm text-white font-medium">{getPaymentMethod()}</span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-white/10">
                    <span className="text-sm text-white/60">Transaction Type</span>
                    <span className="text-sm text-white font-medium">{getTransactionType()}</span>
                  </div>

                  {(transaction.category === "TRANSFER" || transaction.category === "BILL_PAYMENT") && (
                    <>
                      <div className="flex items-center justify-between py-2 border-b border-white/10">
                        <span className="text-sm text-white/60">To</span>
                        <span className="text-sm text-white font-medium">{getToField()}</span>
                      </div>

                      {transaction.category === "BILL_PAYMENT" && (
                        <>
                          <div className="flex items-center justify-between py-2 border-b border-white/10">
                            <span className="text-sm text-white/60">Number</span>
                            <span className="text-sm text-white font-medium">{getNumber()}</span>
                          </div>

                          {getPlan() !== "N/A" && (
                            <div className="flex items-center justify-between py-2 border-b border-white/10">
                              <span className="text-sm text-white/60">Plan</span>
                              <span className="text-sm text-white font-medium">{getPlan()}</span>
                            </div>
                          )}

                          {getDuration() !== "N/A" && (
                            <div className="flex items-center justify-between py-2 border-b border-white/10">
                              <span className="text-sm text-white/60">Duration</span>
                              <span className="text-sm text-white font-medium">{getDuration()}</span>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 pb-6 pt-4 border-t border-white/10">
                <div className="flex gap-3">
                  <CustomButton
                    onClick={handleContactSupport}
                    className="flex-1 bg-transparent border border-white/15 text-white hover:bg-white/5 rounded-xl py-3 flex items-center justify-center gap-2"
                  >
                    <FiMessageCircle className="text-base" />
                    <span>Contact Support</span>
                  </CustomButton>
                  <CustomButton
                    onClick={handleDownloadReceipt}
                    className="flex-1 bg-[#f76301] hover:bg-[#e55a00] text-black font-semibold rounded-xl py-3 flex items-center justify-center gap-2"
                  >
                    <FiDownload className="text-base" />
                    <span>Download Receipt</span>
                  </CustomButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Receipt Modal */}
      <GlobalTransactionReceiptModal
        isOpen={showReceipt}
        onClose={() => setShowReceipt(false)}
        transaction={convertToReceiptTransaction()}
      />
    </>
  );
};

export default GlobalTransactionHistoryModal;
