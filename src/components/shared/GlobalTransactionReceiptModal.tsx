"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CgClose } from "react-icons/cg";
import { LuCopy } from "react-icons/lu";
import { FiDownload } from "react-icons/fi";
import { format } from "date-fns";
import toast from "react-hot-toast";
import html2canvas from "html2canvas";

interface GlobalTransactionReceiptModalProps {
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

const GlobalTransactionReceiptModal: React.FC<GlobalTransactionReceiptModalProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard", { duration: 2000 });
  };

  const downloadReceiptAsPNG = async () => {
    setIsDownloading(true);
    try {
      const receiptElement = document.getElementById("global-transaction-receipt");
      if (!receiptElement) {
        toast.error("Receipt element not found");
        return;
      }

      // Create a temporary container with the receipt content
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.width = "400px";
      tempDiv.style.backgroundColor = "#0A0A0A";
      tempDiv.style.padding = "20px";
      document.body.appendChild(tempDiv);

      // Clone the receipt content
      const clonedContent = receiptElement.cloneNode(true) as HTMLElement;
      clonedContent.style.width = "100%";
      clonedContent.style.backgroundColor = "#0A0A0A";
      tempDiv.appendChild(clonedContent);

      // Wait for images to load
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Convert to canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#0A0A0A",
        width: 400,
        height: tempDiv.scrollHeight,
      });

      // Convert canvas to PNG and download
      const link = document.createElement("a");
      link.download = `receipt-${transaction.reference || transaction.id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      // Clean up
      document.body.removeChild(tempDiv);
      toast.success("Receipt downloaded as PNG");
    } catch (error) {
      console.error("Error generating PNG:", error);
      toast.error("Failed to download receipt");
    } finally {
      setIsDownloading(false);
    }
  };

  const getTransactionTypeLabel = () => {
    switch (transaction.type) {
      case "TRANSFER":
        return "Inter-bank Transfer";
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
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#f76301] rounded-sm flex items-center justify-center">
                    <span className="text-black font-bold text-[10px]">V</span>
                  </div>
                  <span className="text-white font-semibold text-sm">VALARPAY</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white/60 text-xs">Beyond Banking</span>
                  <button
                    onClick={onClose}
                    className="p-2 cursor-pointer bg-bg-1400 rounded-full hover:bg-bg-1200 transition-colors"
                    aria-label="Close"
                  >
                    <CgClose className="text-xl text-text-200 dark:text-text-400" />
                  </button>
                </div>
              </div>

              <div className="flex justify-center">
                <span className="px-4 py-1.5 rounded-lg bg-[#f76301] text-black text-xs font-semibold">
                  Transaction Receipt
                </span>
              </div>
            </div>

            {/* Receipt Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div id="global-transaction-receipt" className="text-white bg-[#1C1C1E] rounded-xl p-6">
                {/* Rows with dotted orange separators */}
                <div className="space-y-0">
                  <div className="flex items-center justify-between py-3 border-b border-dashed border-[#f76301]/30">
                    <span className="text-xs text-white/60">Transaction Date</span>
                    <span className="text-xs text-white font-medium">
                      {format(new Date(transaction.createdAt), "dd-MM-yyyy hh:mm a")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-dashed border-[#f76301]/30">
                    <span className="text-xs text-white/60">Transaction ID</span>
                    <div className="flex items-center gap-2 max-w-[210px]">
                      <span className="text-xs text-white font-medium truncate">
                        {transaction.reference || transaction.id}
                      </span>
                      <button
                        onClick={() => copyToClipboard(transaction.reference || transaction.id)}
                        className="text-white/60 hover:text-white transition-colors"
                        aria-label="Copy transaction id"
                      >
                        <LuCopy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-dashed border-[#f76301]/30">
                    <span className="text-xs text-white/60">Amount</span>
                    <span className="text-xs text-white font-medium">
                      {transaction.currency === "NGN" ? "₦" : transaction.currency}
                      {Number(transaction.amount).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-dashed border-[#f76301]/30">
                    <span className="text-xs text-white/60">Currency</span>
                    <span className="text-xs text-white font-medium">{transaction.currency}</span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-dashed border-[#f76301]/30">
                    <span className="text-xs text-white/60">Transaction Type</span>
                    <span className="text-xs text-white font-medium">{getTransactionTypeLabel()}</span>
                  </div>

                  {/* Transfer specific */}
                  {transaction.type === "TRANSFER" && (
                    <>
                      {transaction.senderName && (
                        <div className="flex justify-between items-center py-3 border-b border-dashed border-[#f76301]/30">
                          <span className="text-xs text-white/60">Sender Name</span>
                          <span className="text-xs text-white font-medium">{transaction.senderName}</span>
                        </div>
                      )}
                      {transaction.recipientName && (
                        <div className="flex justify-between items-center py-3 border-b border-dashed border-[#f76301]/30">
                          <span className="text-xs text-white/60">Beneficiary Details</span>
                          <span className="text-xs text-white font-medium text-right">
                            {transaction.recipientName}
                            {transaction.recipientAccount ? ` (${transaction.recipientAccount})` : ""}
                          </span>
                        </div>
                      )}
                      {transaction.recipientBank && (
                        <div className="flex justify-between items-center py-3 border-b border-dashed border-[#f76301]/30">
                          <span className="text-xs text-white/60">Beneficiary Bank</span>
                          <span className="text-xs text-white font-medium">{transaction.recipientBank}</span>
                        </div>
                      )}
                      {transaction.description && (
                        <div className="flex justify-between items-center py-3 border-b border-dashed border-[#f76301]/30">
                          <span className="text-xs text-white/60">Narration</span>
                          <span className="text-xs text-white font-medium text-right truncate max-w-[200px]">
                            {transaction.description}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {/* Bill Payment specific */}
                  {(transaction.type === "DATA" || transaction.type === "AIRTIME" || transaction.type === "CABLE" || transaction.type === "ELECTRICITY" || transaction.type === "INTERNET") && (
                    <>
                      {transaction.planName && (
                        <div className="flex justify-between items-center py-3 border-b border-dashed border-[#f76301]/30">
                          <span className="text-xs text-white/60">Plan</span>
                          <span className="text-xs text-white font-medium">{transaction.planName}</span>
                        </div>
                      )}
                      {transaction.validity && (
                        <div className="flex justify-between items-center py-3 border-b border-dashed border-[#f76301]/30">
                          <span className="text-xs text-white/60">Duration</span>
                          <span className="text-xs text-white font-medium">{transaction.validity}</span>
                        </div>
                      )}
                      {transaction.provider && (
                        <div className="flex justify-between items-center py-3 border-b border-dashed border-[#f76301]/30">
                          <span className="text-xs text-white/60">Provider</span>
                          <span className="text-xs text-white font-medium">{transaction.provider}</span>
                        </div>
                      )}
                      {transaction.billerNumber && (
                        <div className="flex justify-between items-center py-3 border-b border-dashed border-[#f76301]/30">
                          <span className="text-xs text-white/60">Phone Number</span>
                          <span className="text-xs text-white font-medium">{transaction.billerNumber}</span>
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex justify-between items-center py-3">
                    <span className="text-xs text-white/60">Status</span>
                    <span
                      className={`text-xs font-semibold ${
                        transaction.status === "SUCCESSFUL"
                          ? "text-green-500"
                          : transaction.status === "FAILED"
                            ? "text-red-500"
                            : "text-yellow-500"
                      }`}
                    >
                      {transaction.status === "SUCCESSFUL" ? "Successful" : transaction.status}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-dashed border-[#f76301]/30">
                  <p className="text-xs text-white/60 text-center mb-4">
                    Thank you for banking with ValarPay.
                  </p>
                  <div className="text-xs text-white/50 text-center space-y-1">
                    <p>For support, contact us at Support@valarpay.com.</p>
                    <p>call +2348134146006 or</p>
                    <p>Head Office: C3 C4 Suite 2nd Floor Eison Plaza 9a New Market Road Main Market Oritsha</p>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <div className="mt-6">
                <button
                  onClick={downloadReceiptAsPNG}
                  disabled={isDownloading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#f76301] hover:bg-[#e55a00] text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  <FiDownload className="text-base" />
                  <span className="text-sm">
                    {isDownloading ? "Downloading..." : "Download Receipt"}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GlobalTransactionReceiptModal;
