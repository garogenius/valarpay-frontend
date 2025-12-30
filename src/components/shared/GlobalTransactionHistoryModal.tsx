"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { LuCopy } from "react-icons/lu";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { MdDownload } from "react-icons/md";
import { MdOutlineSupportAgent } from "react-icons/md";
import { FiCheckCircle, FiX } from "react-icons/fi";
import { getReceiptHtml, ReceiptDirection } from "@/api/receipt/receipt.apis";

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

  const downloadReceiptFromApi = async () => {
    if (!transaction.reference) return;
    setDownloading(true);
    try {
      const direction: ReceiptDirection =
        transaction.direction ||
        (transaction.type === "TRANSFER" ? "debit" : "credit");

      const dateAndTime = format(new Date(transaction.createdAt), "yyyy-MM-dd HH:mm:ss");
      const amountStr = Number(transaction.amount).toFixed(2);
      const availableBalance = transaction.availableBalance || "0.00";
      const narration = transaction.description || "Transaction";

      const html = await getReceiptHtml(direction, direction === "debit" ? {
        reference: transaction.reference,
        dateAndTime,
        availableBalance,
        narration,
        receipientName: transaction.recipientName || "Unknown",
        accountNumber: transaction.senderAccount || "",
        amount: amountStr,
        accountName: transaction.senderName || "Unknown",
      } : {
        reference: transaction.reference,
        dateAndTime,
        availableBalance,
        narration,
        senderName: transaction.senderName || "Unknown",
        accountNumber: transaction.recipientAccount || "",
        amount: amountStr,
        accountName: transaction.recipientName || "Unknown",
      });

      // Download as HTML file
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${transaction.reference}.html`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Receipt downloaded");
    } catch (e: any) {
      toast.error("Failed to download receipt");
    } finally {
      setDownloading(false);
    }
  };

  const getTransactionTypeLabel = () => {
    switch (transaction.type) {
      case "TRANSFER":
        return transaction.recipientBank === "ValarPay" ? "Merchant Transfer" : "Inter-bank Transfer";
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

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={onClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-[#0A0A0A] rounded-2xl border border-gray-800 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between px-6 py-4 border-b border-gray-800 bg-[#0A0A0A]">
                <div>
                  <h3 className="text-white text-lg font-semibold">Transaction History</h3>
                  <p className="text-gray-400 text-sm mt-0.5">
                    View complete information about this transaction
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-[#1A1A1F] text-white hover:text-gray-200 transition-colors"
                >
                  <IoClose className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto bg-[#0A0A0A]">
                <div className="px-6 py-6 space-y-6">
                  {/* Status Badge */}
                  <div
                    className={`w-full rounded-xl px-6 py-8 flex flex-col items-center justify-center ${
                      transaction.status === "SUCCESSFUL"
                        ? "bg-green-500/10 border border-green-700/40"
                        : "bg-red-500/10 border border-red-700/40"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      {transaction.status === "SUCCESSFUL" ? (
                        <FiCheckCircle className="text-green-500 text-2xl" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-red-500 flex items-center justify-center">
                          <FiX className="text-red-500 text-lg" />
                        </div>
                      )}
                      <span
                        className={`text-lg font-medium ${
                          transaction.status === "SUCCESSFUL" ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {transaction.status === "SUCCESSFUL" ? "Successful" : "Failed"}
                      </span>
                    </div>
                    <p className="text-white text-3xl font-bold">
                      {transaction.currency === "NGN" ? "₦" : transaction.currency}
                      {transaction.amount.toLocaleString()}
                    </p>
                  </div>

                  {/* Transaction Details */}
                  <div className="bg-[#1C1C1E] rounded-xl px-5 py-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Transaction ID</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-medium">
                          {transaction.id}
                        </span>
                        <button
                          onClick={() => copyToClipboard(transaction.id)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <LuCopy className="text-sm" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Date & Time</span>
                      <span className="text-white text-sm font-medium">
                        {format(new Date(transaction.createdAt), "MMM dd, yyyy hh:mm a")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Payment Method</span>
                      <span className="text-white text-sm font-medium">
                        {transaction.paymentMethod || "Available Balance"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Transaction Type</span>
                      <span className="text-white text-sm font-medium">
                        {getTransactionTypeLabel()}
                      </span>
                    </div>

                    {/* Transfer specific */}
                    {transaction.type === "TRANSFER" && (
                      <>
                        {transaction.senderName && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">From</span>
                            <span className="text-white text-sm font-medium">
                              {transaction.senderName}
                            </span>
                          </div>
                        )}
                        {transaction.recipientName && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">To</span>
                            <span className="text-white text-sm font-medium">
                              {transaction.recipientName}
                            </span>
                          </div>
                        )}
                        {transaction.recipientAccount && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Number</span>
                            <span className="text-white text-sm font-medium">
                              {transaction.recipientAccount}
                            </span>
                          </div>
                        )}
                      </>
                    )}

                    {/* Internet/Bill Payment specific */}
                    {(transaction.type === "INTERNET" || transaction.type === "DATA" || transaction.type === "AIRTIME") && (
                      <>
                        {transaction.provider && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">To</span>
                            <span className="text-white text-sm font-medium">
                              {transaction.provider}
                            </span>
                          </div>
                        )}
                        {transaction.billerNumber && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Number</span>
                            <span className="text-white text-sm font-medium">
                              {transaction.billerNumber}
                            </span>
                          </div>
                        )}
                        {transaction.planName && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Plan</span>
                            <span className="text-white text-sm font-medium">
                              {transaction.planName}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#2C2C2E] border border-gray-700 text-white hover:bg-[#353539] transition-colors">
                      <MdOutlineSupportAgent className="text-lg" />
                      <span className="text-sm font-medium">Contact Support</span>
                    </button>
                    <button
                      onClick={downloadReceiptFromApi}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#FF6B2C] text-white hover:bg-[#FF7A3D] transition-colors"
                    >
                      <MdDownload className="text-lg" />
                      <span className="text-sm font-medium">
                        {downloading ? "Preparing..." : "Download Receipt"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GlobalTransactionHistoryModal;


