"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CgClose } from "react-icons/cg";
import { FiDownload, FiMessageCircle, FiCheckCircle, FiXCircle, FiClock, FiShare2 } from "react-icons/fi";
import images from "../../../public/images";
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
  const [isSharing, setIsSharing] = useState(false);

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

  // Helper function to generate receipt as blob
  const generateReceiptBlob = async (): Promise<Blob> => {
    const receiptTransaction = convertToReceiptTransaction();
    
    // Format date as EEEE, MMMM d, yyyy h:mm a (e.g., "Monday, January 9, 2026 10:20 AM")
    const formatReceiptDate = (dateString: string) => {
      const date = new Date(dateString);
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const dayName = days[date.getDay()];
      const monthName = months[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();
      const hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${dayName}, ${monthName} ${day}, ${year} ${displayHours}:${minutes} ${ampm}`;
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
        if (amount % 1 === 0) {
          return `₦${amount.toLocaleString()}`;
        }
        return `₦${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
      return `${currency}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };
    
    // Get logo as base64 - try to load from public path
    let logoBase64 = "";
    try {
      const logoResponse = await fetch('/images/logo.png');
      if (logoResponse.ok) {
        const logoBlob = await logoResponse.blob();
        logoBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = () => resolve("");
          reader.readAsDataURL(logoBlob);
        });
      }
    } catch (error) {
      console.warn("Could not load logo:", error);
    }
    
    // Create a temporary receipt element
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    tempDiv.style.top = "0";
    tempDiv.style.width = "500px";
    tempDiv.style.minHeight = "auto";
    tempDiv.style.backgroundColor = "#ffffff";
    tempDiv.style.padding = "0";
    tempDiv.style.color = "#000000";
    tempDiv.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    tempDiv.style.boxSizing = "border-box";
    tempDiv.style.overflow = "visible";
    document.body.appendChild(tempDiv);

    // Build receipt HTML matching exact design from provided code
    const isTransfer = receiptTransaction.type === "TRANSFER";
    const formattedDate = formatReceiptDate(receiptTransaction.createdAt);
    
    const receiptHTML = `
      <div id="receipt-container" style="flex-direction: column; max-width: 500px; margin: 0 auto; overflow: hidden; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <!-- Orange Header -->
        <div style="background: #f76301; padding: 16px; border-radius: 16px 16px 0 0; position: relative;">
          <!-- Circular cutouts -->
          <div style="position: absolute; left: -12px; top: -4px; width: 24px; height: 24px; background: white; border-radius: 50%;"></div>
          <div style="position: absolute; right: -12px; top: -4px; width: 24px; height: 24px; background: white; border-radius: 50%;"></div>
          
          <!-- Logo and Smart Banking -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; background: white; padding: 8px; border-radius: 8px;">
              ${logoBase64 ? `<img src="${logoBase64}" alt="logo" style="height: 32px; width: auto; object-fit: contain; font-weight: bold;" />` : '<span style="color: #f76301; font-size: 20px; font-weight: bold;">V</span>'}
            </div>
            <div style="color: #374151; font-size: 14px; font-weight: 500;">Smart Banking</div>
          </div>
          
          <!-- Transaction Receipt Title -->
          <h1 style="font-size: 20px; font-weight: bold; text-align: center; color: #1F2937; margin: 0 0 4px 0;">Transaction Receipt</h1>
          <p style="font-size: 12px; text-align: center; color: #6B7280; margin: 0;">
            Generated by ValarPay on ${formattedDate}
          </p>
        </div>

        <!-- Transaction Details -->
        <div style="background: white;">
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #F3F4F6; width: 100%;">
            <p style="color: #f76301; font-size: 12px; font-weight: 500; margin: 0;">Category</p>
            <p style="color: #1F2937; font-size: 12px; font-weight: 500; text-align: right; margin: 0;">${getTransactionTypeLabel()}</p>
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #F3F4F6; width: 100%;">
            <p style="color: #f76301; font-size: 12px; font-weight: 500; margin: 0;">Currency</p>
            <p style="color: #1F2937; font-size: 12px; font-weight: 500; text-align: right; margin: 0;">${receiptTransaction.currency}</p>
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #F3F4F6; width: 100%;">
            <p style="color: #f76301; font-size: 12px; font-weight: 500; margin: 0;">Transaction Type</p>
            <p style="color: #1F2937; font-size: 12px; font-weight: 500; text-align: right; margin: 0;">${receiptTransaction.type}</p>
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #F3F4F6; width: 100%;">
            <p style="color: #f76301; font-size: 12px; font-weight: 500; margin: 0;">Total Amount Paid</p>
            <p style="color: #1F2937; font-size: 12px; font-weight: 500; text-align: right; margin: 0;">${formatAmount(receiptTransaction.amount, receiptTransaction.currency)}</p>
          </div>
          
          ${isTransfer ? `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #F3F4F6; width: 100%;">
            <p style="color: #f76301; font-size: 12px; font-weight: 500; margin: 0;">Sender Name</p>
            <p style="color: #1F2937; font-size: 12px; font-weight: 500; text-align: right; margin: 0;">${senderName}</p>
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #F3F4F6; width: 100%;">
            <p style="color: #f76301; font-size: 12px; font-weight: 500; margin: 0;">Beneficiary Name</p>
            <p style="color: #1F2937; font-size: 12px; font-weight: 500; text-align: right; margin: 0;">${beneficiaryName}</p>
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #F3F4F6; width: 100%;">
            <p style="color: #f76301; font-size: 12px; font-weight: 500; margin: 0;">Beneficiary Bank Name</p>
            <p style="color: #1F2937; font-size: 12px; font-weight: 500; text-align: right; margin: 0;">${beneficiaryBank}</p>
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #F3F4F6; width: 100%;">
            <p style="color: #f76301; font-size: 12px; font-weight: 500; margin: 0;">Beneficiary Account Number</p>
            <p style="color: #1F2937; font-size: 12px; font-weight: 500; text-align: right; margin: 0;">${beneficiaryAccount || "N/A"}</p>
          </div>
          ` : `
          ${planName ? `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #F3F4F6; width: 100%;">
            <p style="color: #f76301; font-size: 12px; font-weight: 500; margin: 0;">Plan</p>
            <p style="color: #1F2937; font-size: 12px; font-weight: 500; text-align: right; margin: 0;">${planName}</p>
          </div>
          ` : ''}
          ${validity ? `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #F3F4F6; width: 100%;">
            <p style="color: #f76301; font-size: 12px; font-weight: 500; margin: 0;">Duration</p>
            <p style="color: #1F2937; font-size: 12px; font-weight: 500; text-align: right; margin: 0;">${validity}</p>
          </div>
          ` : ''}
          ${provider ? `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #F3F4F6; width: 100%;">
            <p style="color: #f76301; font-size: 12px; font-weight: 500; margin: 0;">Provider</p>
            <p style="color: #1F2937; font-size: 12px; font-weight: 500; text-align: right; margin: 0;">${provider}</p>
          </div>
          ` : ''}
          ${phoneNumber ? `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #F3F4F6; width: 100%;">
            <p style="color: #f76301; font-size: 12px; font-weight: 500; margin: 0;">Phone Number</p>
            <p style="color: #1F2937; font-size: 12px; font-weight: 500; text-align: right; margin: 0;">${phoneNumber}</p>
          </div>
          ` : ''}
          `}
          
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #F3F4F6; width: 100%;">
            <p style="color: #f76301; font-size: 12px; font-weight: 500; margin: 0;">Date & Time</p>
            <p style="color: #1F2937; font-size: 12px; font-weight: 500; text-align: right; margin: 0;">${formattedDate}</p>
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #F3F4F6; width: 100%;">
            <p style="color: #f76301; font-size: 12px; font-weight: 500; margin: 0;">Transaction Ref</p>
            <p style="color: #1F2937; font-size: 12px; font-weight: 500; text-align: right; margin: 0;">${receiptTransaction.reference}</p>
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; width: 100%;">
            <p style="color: #f76301; font-size: 12px; font-weight: 500; margin: 0;">Status</p>
            <span style="display: inline-flex; align-items: center; justify-content: center; padding: 6px 12px; border-radius: 9999px; font-size: 12px; font-weight: 500; color: ${statusColor === "#22C55E" ? "#059669" : statusColor === "#EF4444" ? "#DC2626" : "#D97706"};">
              ${statusText}
            </span>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: white; padding: 12px; text-align: center; border-top: 1px solid #F3F4F6; border-radius: 0 0 16px 16px;">
          <p style="font-size: 12px; color: #6B7280; margin: 0 0 4px 0;">
            If You Have Questions Or You Would Like To Know More Informations About ValarPay, Please Call Our 24/7 Contact Centre On <span style="color: #f76301;">+2348134146906</span> Or Send Us Mail To <a href="mailto:support@valarpay.com" style="color: #f76301; text-decoration: none;">support@valarpay.com</a>
          </p>
          <p style="font-size: 12px; color: #6B7280; margin: 0;">
            Thanks For Choosing ValarPay
          </p>
        </div>
      </div>
    `;

    tempDiv.innerHTML = receiptHTML;

    // Wait for content to render
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Get the actual rendered height
    const actualHeight = tempDiv.scrollHeight;
    const actualWidth = tempDiv.scrollWidth;

    // Convert to canvas with proper dimensions
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      width: actualWidth,
      height: actualHeight,
      allowTaint: true,
      windowWidth: actualWidth,
      windowHeight: actualHeight,
    });

    // Convert canvas to blob
    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to create blob"));
        }
        // Clean up
        document.body.removeChild(tempDiv);
      }, "image/png", 1.0);
    });
  };

  const handleDownloadReceipt = async () => {
    setIsDownloading(true);
    try {
      const receiptTransaction = convertToReceiptTransaction();
      const blob = await generateReceiptBlob();
      
      // Create download link with blob
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `receipt-${receiptTransaction.reference || receiptTransaction.id}.png`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Receipt downloaded as PNG");
    } catch (error) {
      console.error("Error generating PNG:", error);
      toast.error("Failed to download receipt");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShareReceipt = async () => {
    setIsSharing(true);
    try {
      const receiptTransaction = convertToReceiptTransaction();
      const blob = await generateReceiptBlob();
      
      // Check if Web Share API is available
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], `receipt-${receiptTransaction.reference || receiptTransaction.id}.png`, {
          type: "image/png",
        });
        
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "Transaction Receipt",
            text: `Transaction receipt for ${receiptTransaction.reference}`,
          });
          toast.success("Receipt shared successfully");
        } else {
          // Fallback to download if sharing is not supported
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.download = `receipt-${receiptTransaction.reference || receiptTransaction.id}.png`;
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          toast.success("Receipt downloaded (sharing not available)");
        }
      } else {
        // Fallback to download if Web Share API is not available
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `receipt-${receiptTransaction.reference || receiptTransaction.id}.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success("Receipt downloaded (sharing not supported on this device)");
      }
    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error("Error sharing receipt:", error);
        toast.error("Failed to share receipt");
      }
    } finally {
      setIsSharing(false);
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
                <div className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    <CustomButton
                      onClick={handleContactSupport}
                      className="flex-1 bg-transparent border border-white/15 text-white hover:bg-white/5 rounded-xl py-3 flex items-center justify-center gap-2"
                    >
                      <FiMessageCircle className="text-base" />
                      <span>Contact Support</span>
                    </CustomButton>
                    <CustomButton
                      onClick={handleShareReceipt}
                      disabled={isSharing || isDownloading}
                      isLoading={isSharing}
                      className="flex-1 bg-transparent border border-white/15 text-white hover:bg-white/5 rounded-xl py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <FiShare2 className="text-base" />
                      <span>{isSharing ? "Sharing..." : "Share Receipt"}</span>
                    </CustomButton>
                  </div>
                  <CustomButton
                    onClick={handleDownloadReceipt}
                    disabled={isDownloading || isSharing}
                    isLoading={isDownloading}
                    className="w-full bg-[#f76301] hover:bg-[#e55a00] text-black font-semibold rounded-xl py-3 flex items-center justify-center gap-2 disabled:opacity-50"
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
