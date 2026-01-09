"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CgClose } from "react-icons/cg";
import { FiDownload, FiMessageCircle, FiCheckCircle, FiXCircle, FiClock } from "react-icons/fi";
import { LuCopy } from "react-icons/lu";
import { format } from "date-fns";
import toast from "react-hot-toast";
import html2canvas from "html2canvas";
import CustomButton from "./Button";
import { Transaction, TRANSACTION_STATUS } from "@/constants/types";
import useNavigate from "@/hooks/useNavigate";
import useUserStore from "@/store/user.store";

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
  const { user } = useUserStore();
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen || !transaction) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard", { duration: 2000 });
  };

  const getStatusIcon = () => {
    const status = String(transaction.status || "").toLowerCase();
    if (status === "successful" || status === "success" || status === TRANSACTION_STATUS.success) {
      return <FiCheckCircle className="text-2xl text-green-500" />;
    } else if (status === "failed" || status === "failure" || status === TRANSACTION_STATUS.failed) {
      return <FiXCircle className="text-2xl text-red-500" />;
    }
    return <FiClock className="text-2xl text-yellow-500" />;
  };

  const getStatusColor = () => {
    const status = String(transaction.status || "").toLowerCase();
    if (status === "successful" || status === "success" || status === TRANSACTION_STATUS.success) {
      return "bg-green-500/20 border-green-500/30";
    } else if (status === "failed" || status === "failure" || status === TRANSACTION_STATUS.failed) {
      return "bg-red-500/20 border-red-500/30";
    }
    return "bg-yellow-500/20 border-yellow-500/30";
  };

  const getStatusText = () => {
    const status = String(transaction.status || "").toLowerCase();
    if (status === "successful" || status === "success" || status === TRANSACTION_STATUS.success) {
      return "Successful";
    } else if (status === "failed" || status === "failure" || status === TRANSACTION_STATUS.failed) {
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

  const handleDownloadReceipt = async () => {
    setIsDownloading(true);
    try {
      const receiptTransaction = convertToReceiptTransaction();
      
      // Format date as DD-MM-YYYY HH:MM AM/PM
      const formatReceiptDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${day}-${month}-${year} ${displayHours}:${minutes} ${ampm}`;
      };

      // Get transaction type label
      const getTransactionTypeLabel = () => {
        if (receiptTransaction.type === "TRANSFER") return "Inter-bank Transfer";
        if (receiptTransaction.type === "AIRTIME") return "Airtime";
        if (receiptTransaction.type === "DATA") return "Mobile Data";
        if (receiptTransaction.type === "CABLE") return "Cable / TV";
        if (receiptTransaction.type === "ELECTRICITY") return "Electricity";
        if (receiptTransaction.type === "INTERNET") return "Internet";
        return "Bill Payment";
      };

      // Get sender name from transaction
      const senderName = transaction.depositDetails?.senderName || user?.fullname || "N/A";
      
      // Get beneficiary details for transfers
      const beneficiaryName = receiptTransaction.recipientName || "N/A";
      const beneficiaryAccount = receiptTransaction.recipientAccount || "";
      const beneficiaryBank = receiptTransaction.recipientBank || receiptTransaction.provider || "N/A";
      
      // Get bill payment details
      const planName = receiptTransaction.planName || "";
      const validity = receiptTransaction.validity || "";
      const provider = receiptTransaction.provider || "";
      const phoneNumber = receiptTransaction.billerNumber || "";
      
      // Get narration/description
      const narration = receiptTransaction.description || receiptTransaction.reference || "N/A";
      
      // Status color and text
      const statusColor = receiptTransaction.status === "SUCCESSFUL" ? "#22C55E" : receiptTransaction.status === "FAILED" ? "#EF4444" : "#F59E0B";
      const statusText = receiptTransaction.status === "SUCCESSFUL" ? "Successful" : receiptTransaction.status === "FAILED" ? "Failed" : "Pending";
      
      // Format amount - remove decimal if whole number for NGN
      const formatAmount = (amount: number, currency: string) => {
        if (currency === "NGN") {
          // For NGN, show without decimals if whole number, otherwise show 2 decimals
          if (amount % 1 === 0) {
            return `₦${amount.toLocaleString()}`;
          }
          return `₦${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
        return `${currency}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      };
      
      // Create a temporary receipt element
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.top = "0";
      tempDiv.style.width = "600px";
      tempDiv.style.minHeight = "auto";
      tempDiv.style.backgroundColor = "#1A1A1A";
      tempDiv.style.padding = "40px";
      tempDiv.style.color = "#FFFFFF";
      tempDiv.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
      tempDiv.style.boxSizing = "border-box";
      tempDiv.style.overflow = "visible";
      document.body.appendChild(tempDiv);

      // Build receipt HTML matching exact design
      const isTransfer = receiptTransaction.type === "TRANSFER";
      
      const receiptHTML = `
        <div style="background: #1A1A1A; color: #FFFFFF; padding: 0; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; width: 600px; box-sizing: border-box; overflow: visible;">
          <!-- Header with Logo and Tagline -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding: 0;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="background: #2D7FF9; width: 40px; height: 40px; border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <span style="color: #FFFFFF; font-size: 24px; font-weight: bold; line-height: 1;">V</span>
              </div>
              <span style="color: #FFFFFF; font-size: 20px; font-weight: bold; letter-spacing: 0.5px;">VALARPAY</span>
            </div>
            <span style="color: #FFFFFF; font-size: 14px; opacity: 0.8; font-weight: 400;">Beyond Banking</span>
          </div>

          <!-- Transaction Receipt Banner -->
          <div style="background: #f76301; padding: 14px 16px; text-align: center; margin-bottom: 30px; border-radius: 6px;">
            <span style="color: #FFFFFF; font-size: 16px; font-weight: bold; letter-spacing: 0.5px;">Transaction Receipt</span>
          </div>

          <!-- Transaction Details with Dotted Lines -->
          <div style="margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px dotted #f76301;">
              <span style="color: #FFFFFF; font-size: 14px; font-weight: 400;">Transaction Date:</span>
              <span style="color: #FFFFFF; font-size: 14px; font-weight: 500; text-align: right;">${formatReceiptDate(receiptTransaction.createdAt)}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px dotted #f76301;">
              <span style="color: #FFFFFF; font-size: 14px; font-weight: 400;">Transaction ID:</span>
              <span style="color: #FFFFFF; font-size: 14px; font-weight: 500; text-align: right;">${receiptTransaction.reference}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px dotted #f76301;">
              <span style="color: #FFFFFF; font-size: 14px; font-weight: 400;">Amount:</span>
              <span style="color: #FFFFFF; font-size: 14px; font-weight: 500; text-align: right;">${formatAmount(receiptTransaction.amount, receiptTransaction.currency)}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px dotted #f76301;">
              <span style="color: #FFFFFF; font-size: 14px; font-weight: 400;">Currency:</span>
              <span style="color: #FFFFFF; font-size: 14px; font-weight: 500; text-align: right;">${receiptTransaction.currency}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px dotted #f76301;">
              <span style="color: #FFFFFF; font-size: 14px; font-weight: 400;">Transaction Type:</span>
              <span style="color: #FFFFFF; font-size: 14px; font-weight: 500; text-align: right;">${getTransactionTypeLabel()}</span>
            </div>
            
            ${isTransfer ? `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px dotted #f76301;">
              <span style="color: #FFFFFF; font-size: 14px; font-weight: 400;">Sender Name:</span>
              <span style="color: #FFFFFF; font-size: 14px; font-weight: 500; text-align: right;">${senderName}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 14px 0; border-bottom: 1px dotted #f76301;">
              <span style="color: #FFFFFF; font-size: 14px; font-weight: 400;">Beneficiary Details:</span>
              <div style="text-align: right; flex-shrink: 0;">
                <div style="color: #FFFFFF; font-size: 14px; font-weight: 500;">${beneficiaryName}</div>
                ${beneficiaryAccount ? `<div style="color: #FFFFFF; font-size: 14px; font-weight: 500; margin-top: 2px;">(${beneficiaryAccount})</div>` : ''}
              </div>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px dotted #f76301;">
              <span style="color: #FFFFFF; font-size: 14px; font-weight: 400;">Beneficiary Bank:</span>
              <span style="color: #FFFFFF; font-size: 14px; font-weight: 500; text-align: right;">${beneficiaryBank}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px dotted #f76301;">
              <span style="color: #FFFFFF; font-size: 14px; font-weight: 400;">Narration:</span>
              <span style="color: #FFFFFF; font-size: 14px; font-weight: 500; text-align: right;">${narration}</span>
            </div>
            ` : `
            ${planName ? `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px dotted #f76301;">
              <span style="color: #FFFFFF; font-size: 14px; font-weight: 400;">Plan:</span>
              <span style="color: #FFFFFF; font-size: 14px; font-weight: 500; text-align: right;">${planName}</span>
            </div>
            ` : ''}
            ${validity ? `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px dotted #f76301;">
              <span style="color: #FFFFFF; font-size: 14px; font-weight: 400;">Duration:</span>
              <span style="color: #FFFFFF; font-size: 14px; font-weight: 500; text-align: right;">${validity}</span>
            </div>
            ` : ''}
            ${provider ? `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px dotted #f76301;">
              <span style="color: #FFFFFF; font-size: 14px; font-weight: 400;">Provider:</span>
              <span style="color: #FFFFFF; font-size: 14px; font-weight: 500; text-align: right;">${provider}</span>
            </div>
            ` : ''}
            ${phoneNumber ? `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px dotted #f76301;">
              <span style="color: #FFFFFF; font-size: 14px; font-weight: 400;">Phone Number:</span>
              <span style="color: #FFFFFF; font-size: 14px; font-weight: 500; text-align: right;">${phoneNumber}</span>
            </div>
            ` : ''}
            `}
            
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 0;">
              <span style="color: #FFFFFF; font-size: 14px; font-weight: 400;">Status:</span>
              <span style="color: ${statusColor}; font-size: 14px; font-weight: bold; text-align: right;">${statusText}</span>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; color: #FFFFFF; font-size: 12px; margin-top: 40px; line-height: 1.8; padding-top: 20px;">
            <p style="margin: 0 0 6px 0; font-weight: 400;">Thank you for banking with ValarPay. For support, contact us at Support@valarpay.com,</p>
            <p style="margin: 0 0 6px 0; font-weight: 400;">call +2348134146906 or Head Office: C3&C4 Suite 2nd Floor Ejison Plaza 9a New Market Road Main Market Onitsha</p>
          </div>
        </div>
      `;

      tempDiv.innerHTML = receiptHTML;

      // Wait for content to render
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Get the actual rendered height
      const actualHeight = tempDiv.scrollHeight;
      const actualWidth = tempDiv.scrollWidth;

      // Convert to canvas with proper dimensions
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#1A1A1A",
        width: actualWidth,
        height: actualHeight,
        allowTaint: true,
        windowWidth: actualWidth,
        windowHeight: actualHeight,
      });

      // Convert canvas to PNG and download
      const link = document.createElement("a");
      link.download = `receipt-${receiptTransaction.reference || receiptTransaction.id}.png`;
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

  const convertToReceiptTransaction = (): {
    id: string;
    type: "TRANSFER" | "BILL_PAYMENT" | "AIRTIME" | "DATA" | "CABLE" | "ELECTRICITY" | "INTERNET";
    status: "SUCCESSFUL" | "FAILED" | "PENDING";
    amount: number;
    currency: string;
    reference: string;
    description: string;
    createdAt: string;
    recipientName?: string;
    recipientAccount?: string;
    recipientBank?: string;
    senderName?: string;
    senderAccount?: string;
    billerName?: string;
    billerNumber?: string;
    network?: string;
    planName?: string;
    validity?: string;
    provider?: string;
  } => {
    const getTransactionType = (): "TRANSFER" | "BILL_PAYMENT" | "AIRTIME" | "DATA" | "CABLE" | "ELECTRICITY" | "INTERNET" => {
      if (transaction.category === "TRANSFER") {
        return "TRANSFER";
      }
      if (transaction.category === "BILL_PAYMENT") {
        const billType = String(transaction.billDetails?.type || "").toLowerCase();
        if (billType === "data") return "DATA";
        if (billType === "airtime") return "AIRTIME";
        if (billType === "cable") return "CABLE";
        if (billType === "electricity") return "ELECTRICITY";
        if (billType === "internet") return "INTERNET";
        return "BILL_PAYMENT";
      }
      // Default to BILL_PAYMENT for deposits or unknown types
      return "BILL_PAYMENT";
    };

    const getTransactionStatus = (): "SUCCESSFUL" | "FAILED" | "PENDING" => {
      const status = String(transaction.status || "").toLowerCase();
      if (status === "successful" || status === "success" || status === TRANSACTION_STATUS.success) {
        return "SUCCESSFUL";
      } else if (status === "failed" || status === "failure" || status === TRANSACTION_STATUS.failed) {
        return "FAILED";
      }
      return "PENDING";
    };

    return {
      id: transaction.id,
      type: getTransactionType(),
      status: getTransactionStatus(),
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
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="flex items-center gap-3">
                      {getStatusIcon()}
                      <span className={`text-lg font-semibold ${
                        (() => {
                          const status = String(transaction.status || "").toLowerCase();
                          if (status === "successful" || status === "success" || status === TRANSACTION_STATUS.success) {
                            return "text-green-500";
                          } else if (status === "failed" || status === "failure" || status === TRANSACTION_STATUS.failed) {
                            return "text-red-500";
                          }
                          return "text-yellow-500";
                        })()
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
                    disabled={isDownloading}
                    isLoading={isDownloading}
                    className="flex-1 bg-[#f76301] hover:bg-[#e55a00] text-black font-semibold rounded-xl py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <FiDownload className="text-base" />
                    <span>{isDownloading ? "Downloading..." : "Download Receipt"}</span>
                  </CustomButton>
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
