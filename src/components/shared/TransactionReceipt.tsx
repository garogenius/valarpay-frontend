"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose, IoDownloadOutline, IoShareOutline } from "react-icons/io5";
import { LuCopy } from "react-icons/lu";
import { format } from "date-fns";
import toast from "react-hot-toast";

interface TransactionReceiptProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: {
    id: string;
    type: "TRANSFER" | "BILL_PAYMENT" | "AIRTIME" | "DATA" | "CABLE" | "ELECTRICITY";
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
    
    // Additional details
    sessionId?: string;
    channel?: string;
    location?: string;
  };
}

const TransactionReceipt = ({ isOpen, onClose, transaction }: TransactionReceiptProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const getTransactionTitle = () => {
    switch (transaction.type) {
      case "TRANSFER":
        return "Money Transfer";
      case "AIRTIME":
        return "Airtime Purchase";
      case "DATA":
        return "Data Purchase";
      case "CABLE":
        return "Cable Subscription";
      case "ELECTRICITY":
        return "Electricity Payment";
      default:
        return "Bill Payment";
    }
  };

  const getStatusColor = () => {
    switch (transaction.status) {
      case "SUCCESSFUL":
        return "text-green-500";
      case "FAILED":
        return "text-red-500";
      case "PENDING":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard", { duration: 2000 });
  };

  const downloadReceipt = async () => {
    setIsDownloading(true);
    try {
      // Create a printable version
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      const receiptContent = document.getElementById("transaction-receipt")?.innerHTML || "";
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Transaction Receipt - ${transaction.reference}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: #1C1C1E;
              color: white;
              padding: 20px;
            }
            .receipt-container {
              max-width: 400px;
              margin: 0 auto;
              background: #1C1C1E;
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

  const shareReceipt = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Transaction Receipt",
          text: `Transaction Receipt - ${transaction.reference}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Share failed:", error);
      }
    } else {
      copyToClipboard(`Transaction Receipt - ${transaction.reference}\nAmount: ${transaction.currency}${transaction.amount.toLocaleString()}\nReference: ${transaction.reference}`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-md bg-[#1C1C1E] rounded-2xl border border-gray-800 max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#FF6B2C] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">V</span>
                </div>
                <span className="text-white font-semibold">VALARPAY</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={shareReceipt}
                  className="p-2 rounded-lg hover:bg-[#2C2C2E] text-gray-400 hover:text-white transition-colors"
                  title="Share"
                >
                  <IoShareOutline className="w-5 h-5" />
                </button>
                
                <button
                  onClick={downloadReceipt}
                  disabled={isDownloading}
                  className="p-2 rounded-lg hover:bg-[#2C2C2E] text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                  title="Download"
                >
                  {isDownloading ? (
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <IoDownloadOutline className="w-5 h-5" />
                  )}
                </button>
                
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-[#2C2C2E] text-gray-400 hover:text-white transition-colors"
                >
                  <IoClose className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Receipt Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-0">
              <div id="transaction-receipt" className="text-white bg-[#000000] p-8 font-sans">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/logo.png"
                      alt="ValarPay logo"
                      crossOrigin="anonymous"
                      className="w-8 h-8 object-contain"
                    />
                    <span className="text-white font-bold text-xl tracking-tight uppercase leading-none relative top-px">VALARPAY</span>
                  </div>
                  <span className="text-white/90 text-sm font-medium">Beyond Banking</span>
                </div>

                {/* Title */}
                <div className="flex justify-center mb-10">
                  <div className="bg-[#f76301] px-10 py-3 rounded-xl">
                    <span className="text-black font-bold text-lg uppercase tracking-wider">Transaction Receipt</span>
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
                    <span className="text-white/60 text-sm">Transaction Date</span>
                    <span className="text-white text-sm font-medium">{getTransactionTitle()}</span>
                  </div>
                  <div className="w-full border-b border-dotted border-[#f76301] mb-1" />

                  {/* Transfer specific */}
                  {transaction.type === "TRANSFER" && (
                    <>
                      <div className="flex justify-between items-center py-4">
                        <span className="text-white/60 text-sm">Sender Name</span>
                        <span className="text-white text-sm font-medium text-right uppercase tracking-tight">{transaction.senderName || "N/A"}</span>
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
                    <span className="text-[#22C55E] text-sm font-bold uppercase tracking-wider">Successful</span>
                  </div>
                  <div className="w-full border-b border-dotted border-[#f76301] mb-1" />
                </div>

                {/* Footer */}
                <div className="mt-12 text-left">
                  <p className="text-[10px] text-white/70 leading-relaxed font-light">
                    Thank you for banking with ValarPay. For support, contact us at Support@valarpay.com, 
                    call +2348134146906 or Head Office: C3&C4 Suite 2nd Floor Ejison Plaza 9a New Market Road Main Market Onitsha
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TransactionReceipt;
