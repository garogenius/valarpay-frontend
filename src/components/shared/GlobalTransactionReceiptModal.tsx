"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { LuCopy } from "react-icons/lu";
import { format } from "date-fns";
import toast from "react-hot-toast";

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

  const downloadReceipt = async () => {
    setIsDownloading(true);
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      const receiptContent = document.getElementById("global-transaction-receipt")?.innerHTML || "";
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Transaction Receipt - ${transaction.reference}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: #0A0A0A;
              color: white;
              padding: 20px;
            }
            .receipt-container {
              max-width: 400px;
              margin: 0 auto;
              background: #0A0A0A;
              border-radius: 16px;
              border: 1px solid #374151;
              overflow: hidden;
            }
            @media print {
              body { background: white; color: black; }
              .receipt-container { background: white; color: black; border: 1px solid #000; }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            ${receiptContent}
          </div>
        </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
      
      toast.success("Receipt ready for download");
    } catch (error) {
      toast.error("Failed to download receipt");
      console.error("Download error:", error);
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
            {/* Header (matches screenshot) */}
            <div className="px-6 pt-5 pb-4 border-b border-gray-800 bg-[#0A0A0A]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                    <span className="text-black font-bold text-[10px]">V</span>
                  </div>
                  <span className="text-white font-semibold text-sm">VALARPAY</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-300 text-xs">Beyond Banking</span>
                  <button
                    onClick={onClose}
                    className="text-gray-300 hover:text-white transition-colors"
                    aria-label="Close"
                  >
                    <IoClose className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="mt-3 flex justify-center">
                <span className="px-4 py-1.5 rounded-lg bg-[#FF6B2C] text-black text-xs font-semibold">
                  Transaction Receipt
                </span>
              </div>
            </div>

            {/* Receipt Content */}
            <div className="flex-1 overflow-y-auto bg-[#0A0A0A]">
              <div id="global-transaction-receipt" className="p-6 text-white">
                {/* Rows with dotted orange separators (matches screenshot) */}
                <div className="space-y-0">
                  <div className="flex items-center justify-between py-3 border-b border-dashed border-[#FF6B2C]/60">
                    <span className="text-xs text-gray-300">Transaction Date</span>
                    <span className="text-xs text-white font-medium">
                      {format(new Date(transaction.createdAt), "dd-MM-yyyy hh:mm a")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-dashed border-[#FF6B2C]/60">
                    <span className="text-xs text-gray-300">Transaction ID</span>
                    <div className="flex items-center gap-2 max-w-[210px]">
                      <span className="text-xs text-white font-medium truncate">
                        {transaction.id}
                      </span>
                      <button
                        onClick={() => copyToClipboard(transaction.id)}
                        className="text-gray-400 hover:text-white transition-colors"
                        aria-label="Copy transaction id"
                      >
                        <LuCopy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-dashed border-[#FF6B2C]/60">
                    <span className="text-xs text-gray-300">Amount</span>
                    <span className="text-xs text-white font-medium">
                      {transaction.currency === "NGN" ? "₦" : transaction.currency}
                      {transaction.amount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-dashed border-[#FF6B2C]/60">
                    <span className="text-xs text-gray-300">Currency</span>
                    <span className="text-xs text-white font-medium">{transaction.currency}</span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-dashed border-[#FF6B2C]/60">
                    <span className="text-xs text-gray-300">Transaction Detail</span>
                    <span className="text-xs text-white font-medium">{getTransactionTypeLabel()}</span>
                  </div>

                  {/* Transfer specific */}
                  {transaction.type === "TRANSFER" && (
                    <>
                      {transaction.senderName && (
                        <div className="flex justify-between items-center py-3 border-b border-dashed border-[#FF6B2C]/60">
                          <span className="text-xs text-gray-300">Sender Name</span>
                          <span className="text-xs text-white font-medium">{transaction.senderName}</span>
                        </div>
                      )}
                      {transaction.recipientName && (
                        <div className="flex justify-between items-center py-3 border-b border-dashed border-[#FF6B2C]/60">
                          <span className="text-xs text-gray-300">Beneficiary Details</span>
                          <span className="text-xs text-white font-medium text-right">
                            {transaction.recipientName}
                            {transaction.recipientAccount ? ` (${transaction.recipientAccount})` : ""}
                          </span>
                        </div>
                      )}
                      {transaction.recipientBank && (
                        <div className="flex justify-between items-center py-3 border-b border-dashed border-[#FF6B2C]/60">
                          <span className="text-xs text-gray-300">Beneficiary Bank</span>
                          <span className="text-xs text-white font-medium">{transaction.recipientBank}</span>
                        </div>
                      )}
                      {transaction.description && (
                        <div className="flex justify-between items-center py-3 border-b border-dashed border-[#FF6B2C]/60">
                          <span className="text-xs text-gray-300">Narration</span>
                          <span className="text-xs text-white font-medium text-right truncate max-w-[200px]">
                            {transaction.description}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {/* Internet/Bill Payment specific */}
                  {(transaction.type === "INTERNET" || transaction.type === "DATA" || transaction.type === "AIRTIME") && (
                    <>
                      {transaction.planName && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-800">
                          <span className="text-sm text-gray-400">Plan</span>
                          <span className="text-sm text-white font-medium">{transaction.planName}</span>
                        </div>
                      )}
                      {transaction.provider && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-800">
                          <span className="text-sm text-gray-400">Provider</span>
                          <span className="text-sm text-white font-medium">{transaction.provider}</span>
                        </div>
                      )}
                      {transaction.billerNumber && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-800">
                          <span className="text-sm text-gray-400">Phone Number</span>
                          <span className="text-sm text-white font-medium">{transaction.billerNumber}</span>
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex justify-between items-center py-3">
                    <span className="text-xs text-gray-300">Status</span>
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
                <div className="mt-8 pt-6 border-t border-gray-800">
                  <p className="text-xs text-gray-400 text-center mb-4">
                    Thank you for banking with ValarPay
                  </p>
                  <div className="text-xs text-gray-500 text-center space-y-1">
                    <p>support@valarpay.com</p>
                    <p>+234-800-VALARPAY</p>
                    <p>Head Office: [Address]</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GlobalTransactionReceiptModal;


