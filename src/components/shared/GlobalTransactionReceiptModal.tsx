"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CgClose } from "react-icons/cg";
import { LuCopy } from "react-icons/lu";
import { FiDownload, FiShare2 } from "react-icons/fi";
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
            <div className="flex-1 overflow-y-auto p-0">
              <div id="global-transaction-receipt" className="text-white bg-[#000000] p-8 font-sans">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                      <span className="text-[#f76301] font-bold text-lg">V</span>
                    </div>
                    <span className="text-white font-bold text-xl tracking-tight">VALARPAY</span>
                  </div>
                  <span className="text-white/90 text-sm font-medium">Beyond Banking</span>
                </div>

                {/* Title */}
                <div className="flex justify-center mb-10">
                  <div className="bg-[#f76301] px-10 py-3 rounded-xl">
                    <span className="text-black font-bold text-lg">Transaction Receipt</span>
                  </div>
                </div>

                {/* Content Rows */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between py-4">
                    <span className="text-white/60 text-sm">Transaction Date</span>
                    <span className="text-white text-sm font-medium">
                      {format(new Date(transaction.createdAt), "dd-MM-yyyy hh:mm a")}
                    </span>
                  </div>
                  <div className="w-full border-b border-dotted border-[#f76301] mb-1" />

                  <div className="flex items-center justify-between py-4">
                    <span className="text-white/60 text-sm">Transaction ID</span>
                    <span className="text-white text-sm font-medium truncate ml-4 max-w-[200px]">
                      {transaction.reference || transaction.id}
                    </span>
                  </div>
                  <div className="w-full border-b border-dotted border-[#f76301] mb-1" />

                  <div className="flex items-center justify-between py-4">
                    <span className="text-white/60 text-sm">Amount</span>
                    <span className="text-white text-sm font-medium">
                      {transaction.currency === "NGN" ? "₦" : transaction.currency}
                      {Number(transaction.amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full border-b border-dotted border-[#f76301] mb-1" />

                  <div className="flex items-center justify-between py-4">
                    <span className="text-white/60 text-sm">Currency</span>
                    <span className="text-white text-sm font-medium">{transaction.currency}</span>
                  </div>
                  <div className="w-full border-b border-dotted border-[#f76301] mb-1" />

                  <div className="flex items-center justify-between py-4">
                    <span className="text-white/60 text-sm">Transaction Type</span>
                    <span className="text-white text-sm font-medium">{getTransactionTypeLabel()}</span>
                  </div>
                  <div className="w-full border-b border-dotted border-[#f76301] mb-1" />

                  {/* Transfer specific */}
                  {transaction.type === "TRANSFER" && (
                    <>
                      <div className="flex justify-between items-center py-4">
                        <span className="text-white/60 text-sm">Sender Name</span>
                        <span className="text-white text-sm font-medium text-right uppercase">{transaction.senderName || "N/A"}</span>
                      </div>
                      <div className="w-full border-b border-dotted border-[#f76301] mb-1" />

                      <div className="flex justify-between items-center py-4">
                        <span className="text-white/60 text-sm">Beneficiary Details</span>
                        <span className="text-white text-sm font-medium text-right">
                          <span className="uppercase">{transaction.recipientName}</span>
                          {transaction.recipientAccount ? ` (${transaction.recipientAccount})` : ""}
                        </span>
                      </div>
                      <div className="w-full border-b border-dotted border-[#f76301] mb-1" />

                      <div className="flex justify-between items-center py-4">
                        <span className="text-white/60 text-sm">Beneficiary Bank</span>
                        <span className="text-white text-sm font-medium text-right">{transaction.recipientBank || "N/A"}</span>
                      </div>
                      <div className="w-full border-b border-dotted border-[#f76301] mb-1" />

                      <div className="flex justify-between items-center py-4">
                        <span className="text-white/60 text-sm">Narration</span>
                        <span className="text-white text-sm font-medium text-right truncate ml-4 max-w-[200px]">
                          {transaction.description || "N/A"}
                        </span>
                      </div>
                      <div className="w-full border-b border-dotted border-[#f76301] mb-1" />
                    </>
                  )}

                  <div className="flex justify-between items-center py-4">
                    <span className="text-white/60 text-sm">Status</span>
                    <span className="text-[#22C55E] text-sm font-bold uppercase tracking-wide">Successful</span>
                  </div>
                  <div className="w-full border-b border-dotted border-[#f76301] mb-1" />
                </div>

                {/* Footer */}
                <div className="mt-12">
                  <p className="text-[10px] text-white/70 leading-relaxed font-light">
                    Thank you for banking with ValarPay. For support, contact us at Support@valarpay.com, 
                    call +2348134146906 or Head Office: C3&C4 Suite 2nd Floor Ejison Plaza 9a New Market Road Main Market Onitsha
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 flex gap-4 bg-bg-600 dark:bg-bg-1100">
                <button
                  onClick={() => {
                    const shareText = `Transaction Receipt\nAmount: ${transaction.currency}${Number(transaction.amount).toLocaleString()}\nStatus: Successful\nID: ${transaction.reference || transaction.id}`;
                    if (navigator.share) {
                      navigator.share({
                        title: 'ValarPay Receipt',
                        text: shareText,
                        url: window.location.href
                      }).catch(console.error);
                    } else {
                      copyToClipboard(shareText);
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#f76301] text-[#f76301] hover:bg-[#f76301]/10 transition-colors font-semibold"
                >
                  <FiShare2 /> Share
                </button>
                <button
                  onClick={downloadReceiptAsPNG}
                  disabled={isDownloading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#f76301] hover:bg-[#e55a00] text-black transition-colors disabled:opacity-50 font-semibold"
                >
                  <FiDownload /> {isDownloading ? "..." : "Download"}
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
