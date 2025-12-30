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
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <div id="transaction-receipt" className="p-6 bg-[#1C1C1E] text-white">
                {/* Transaction Status */}
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                    transaction.status === "SUCCESSFUL" ? "bg-green-900/30 border border-green-800" :
                    transaction.status === "FAILED" ? "bg-red-900/30 border border-red-800" :
                    "bg-yellow-900/30 border border-yellow-800"
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      transaction.status === "SUCCESSFUL" ? "bg-green-500" :
                      transaction.status === "FAILED" ? "bg-red-500" :
                      "bg-yellow-500"
                    }`} />
                    <span className={`text-sm font-medium ${getStatusColor()}`}>
                      {transaction.status === "SUCCESSFUL" ? "Successful" : transaction.status}
                    </span>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-center mb-8">
                  <p className="text-3xl font-bold text-white">
                    {transaction.currency === "NGN" ? "₦" : transaction.currency}
                    {transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">{getTransactionTitle()}</p>
                </div>

                {/* Transaction Details */}
                <div className="space-y-4">
                  {/* Transaction Date */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <span className="text-sm text-gray-400">Transaction Date</span>
                    <span className="text-sm text-white font-medium">
                      {format(new Date(transaction.createdAt), "dd-MM-yyyy HH:mm")}
                    </span>
                  </div>

                  {/* Transaction ID */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <span className="text-sm text-gray-400">Transaction ID</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white font-medium font-mono">
                        {transaction.id.slice(0, 12)}...
                      </span>
                      <button
                        onClick={() => copyToClipboard(transaction.id)}
                        className="p-1 hover:bg-[#2C2C2E] rounded text-gray-400 hover:text-white"
                      >
                        <LuCopy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Reference */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <span className="text-sm text-gray-400">Reference</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white font-medium font-mono">
                        {transaction.reference}
                      </span>
                      <button
                        onClick={() => copyToClipboard(transaction.reference)}
                        className="p-1 hover:bg-[#2C2C2E] rounded text-gray-400 hover:text-white"
                      >
                        <LuCopy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Amount Breakdown */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <span className="text-sm text-gray-400">Amount</span>
                    <span className="text-sm text-white font-medium">
                      {transaction.currency === "NGN" ? "₦" : transaction.currency}
                      {transaction.amount.toLocaleString()}
                    </span>
                  </div>

                  {transaction.fee && transaction.fee > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-800">
                      <span className="text-sm text-gray-400">Fee</span>
                      <span className="text-sm text-white font-medium">
                        {transaction.currency === "NGN" ? "₦" : transaction.currency}
                        {transaction.fee.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {/* Transfer specific details */}
                  {transaction.type === "TRANSFER" && (
                    <>
                      {transaction.recipientName && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-800">
                          <span className="text-sm text-gray-400">Recipient</span>
                          <span className="text-sm text-white font-medium">{transaction.recipientName}</span>
                        </div>
                      )}
                      
                      {transaction.recipientAccount && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-800">
                          <span className="text-sm text-gray-400">Account Number</span>
                          <span className="text-sm text-white font-medium font-mono">{transaction.recipientAccount}</span>
                        </div>
                      )}
                      
                      {transaction.recipientBank && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-800">
                          <span className="text-sm text-gray-400">Bank</span>
                          <span className="text-sm text-white font-medium">{transaction.recipientBank}</span>
                        </div>
                      )}
                    </>
                  )}

                  {/* Bill payment specific details */}
                  {(transaction.type === "AIRTIME" || transaction.type === "DATA") && (
                    <>
                      {transaction.billerNumber && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-800">
                          <span className="text-sm text-gray-400">Phone Number</span>
                          <span className="text-sm text-white font-medium font-mono">{transaction.billerNumber}</span>
                        </div>
                      )}
                      
                      {transaction.network && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-800">
                          <span className="text-sm text-gray-400">Network</span>
                          <span className="text-sm text-white font-medium">{transaction.network}</span>
                        </div>
                      )}
                      
                      {transaction.planName && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-800">
                          <span className="text-sm text-gray-400">Plan</span>
                          <span className="text-sm text-white font-medium">{transaction.planName}</span>
                        </div>
                      )}
                    </>
                  )}

                  {transaction.type === "CABLE" && (
                    <>
                      {transaction.billerNumber && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-800">
                          <span className="text-sm text-gray-400">Smartcard Number</span>
                          <span className="text-sm text-white font-medium font-mono">{transaction.billerNumber}</span>
                        </div>
                      )}
                      
                      {transaction.billerName && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-800">
                          <span className="text-sm text-gray-400">Provider</span>
                          <span className="text-sm text-white font-medium">{transaction.billerName}</span>
                        </div>
                      )}
                      
                      {transaction.planName && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-800">
                          <span className="text-sm text-gray-400">Package</span>
                          <span className="text-sm text-white font-medium">{transaction.planName}</span>
                        </div>
                      )}
                      
                      {transaction.validity && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-800">
                          <span className="text-sm text-gray-400">Validity</span>
                          <span className="text-sm text-white font-medium">{transaction.validity}</span>
                        </div>
                      )}
                    </>
                  )}

                  {transaction.type === "ELECTRICITY" && (
                    <>
                      {transaction.billerNumber && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-800">
                          <span className="text-sm text-gray-400">Meter Number</span>
                          <span className="text-sm text-white font-medium font-mono">{transaction.billerNumber}</span>
                        </div>
                      )}
                      
                      {transaction.billerName && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-800">
                          <span className="text-sm text-gray-400">Provider</span>
                          <span className="text-sm text-white font-medium">{transaction.billerName}</span>
                        </div>
                      )}
                    </>
                  )}

                  {/* Additional details */}
                  {transaction.sessionId && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-800">
                      <span className="text-sm text-gray-400">Session ID</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white font-medium font-mono">
                          {transaction.sessionId.slice(0, 12)}...
                        </span>
                        <button
                          onClick={() => copyToClipboard(transaction.sessionId || "")}
                          className="p-1 hover:bg-[#2C2C2E] rounded text-gray-400 hover:text-white"
                        >
                          <LuCopy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <span className="text-sm text-gray-400">Channel</span>
                    <span className="text-sm text-white font-medium">{transaction.channel || "Mobile App"}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <span className="text-sm text-gray-400">Location</span>
                    <span className="text-sm text-white font-medium">{transaction.location || "Nigeria"}</span>
                  </div>

                  {transaction.description && (
                    <div className="flex justify-between items-start py-2 border-b border-gray-800">
                      <span className="text-sm text-gray-400">Description</span>
                      <span className="text-sm text-white font-medium text-right max-w-[200px]">
                        {transaction.description}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-400">Status</span>
                    <span className={`text-sm font-medium ${getStatusColor()}`}>
                      {transaction.status === "SUCCESSFUL" ? "Successful" : transaction.status}
                    </span>
                  </div>
                </div>

                {/* Footer Note */}
                <div className="mt-8 p-4 bg-[#2C2C2E] rounded-lg">
                  <p className="text-xs text-gray-400 text-center leading-relaxed">
                    Thank you for using Valarpay. For support and inquiries, contact us at support@valarpay.com or call +234-800-VALARPAY. 
                    This is an electronic receipt and does not require a signature.
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
