"use client";

import React, { useMemo } from "react";
import { FiCheckCircle, FiX, FiAlertCircle, FiWifiOff, FiLock, FiDollarSign, FiCopy, FiDownload } from "react-icons/fi";
import CustomButton from "./Button";
import SuccessToast from "../toast/SuccessToast";
import { formatCurrency } from "@/utils/utilityFunctions";

export type PaymentResultStatus = "success" | "failed";

export interface PaymentResultData {
  status: PaymentResultStatus;
  amount: number;
  currency?: string;
  accountNumber?: string;
  accountName?: string;
  bankName?: string;
  narration?: string;
  transactionId?: string;
  errorMessage?: string;
  errorCode?: string;
  errorDetails?: string;
  transactionType?: string;
  expectedReturn?: number;
  newWalletBalance?: number;
  dateTime?: string;
}

interface GlobalPaymentResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry?: () => void;
  data: PaymentResultData;
}

type ErrorType = "insufficient_funds" | "incorrect_pin" | "network_error" | "invalid_account" | "transaction_limit" | "generic";

const GlobalPaymentResultModal: React.FC<GlobalPaymentResultModalProps> = ({
  isOpen,
  onClose,
  onRetry,
  data,
}) => {
  if (!isOpen) return null;

  const detectErrorType = (errorMessage?: string, errorCode?: string): ErrorType => {
    if (!errorMessage) return "generic";
    
    const message = errorMessage.toLowerCase();
    const code = errorCode?.toLowerCase() || "";

    if (
      message.includes("insufficient") ||
      message.includes("low balance") ||
      message.includes("not enough") ||
      code.includes("insufficient")
    ) {
      return "insufficient_funds";
    }

    if (
      message.includes("pin") ||
      message.includes("password") ||
      message.includes("authentication") ||
      code.includes("pin")
    ) {
      return "incorrect_pin";
    }

    if (
      message.includes("network") ||
      message.includes("connection") ||
      message.includes("timeout") ||
      message.includes("failed to connect") ||
      code.includes("network")
    ) {
      return "network_error";
    }

    if (
      message.includes("invalid account") ||
      message.includes("account not found") ||
      message.includes("invalid recipient") ||
      code.includes("invalid_account")
    ) {
      return "invalid_account";
    }

    if (
      message.includes("limit") ||
      message.includes("exceeded") ||
      message.includes("maximum") ||
      code.includes("limit")
    ) {
      return "transaction_limit";
    }

    return "generic";
  };

  const errorType = useMemo(() => detectErrorType(data.errorDetails || data.errorMessage, data.errorCode), [data.errorDetails, data.errorMessage, data.errorCode]);

  const getErrorDetails = (): { icon: React.ReactNode; title: string; message: string } => {
    switch (errorType) {
      case "insufficient_funds":
        return {
          icon: <FiDollarSign className="text-3xl text-red-500" />,
          title: "Insufficient Funds",
          message: "Your account balance is not sufficient to complete this transaction. Please add funds and try again.",
        };
      case "incorrect_pin":
        return {
          icon: <FiLock className="text-3xl text-red-500" />,
          title: "Incorrect PIN",
          message: "The wallet PIN you entered is incorrect. Please verify your PIN and try again.",
        };
      case "network_error":
        return {
          icon: <FiWifiOff className="text-3xl text-red-500" />,
          title: "Network Error",
          message: "Unable to connect to our servers. Please check your internet connection and try again.",
        };
      case "invalid_account":
        return {
          icon: <FiAlertCircle className="text-3xl text-red-500" />,
          title: "Invalid Account",
          message: "The recipient account details are invalid. Please verify the account number and try again.",
        };
      case "transaction_limit":
        return {
          icon: <FiAlertCircle className="text-3xl text-red-500" />,
          title: "Transaction Limit Exceeded",
          message: "This transaction exceeds your account limit. Please contact support or try a smaller amount.",
        };
      default:
        return {
          icon: <FiX className="text-3xl text-red-500" />,
          title: "Payment Failed",
          message: data.errorDetails || data.errorMessage || "An error occurred while processing your payment. Please try again later.",
        };
    }
  };

  const formatCurrency = (amount: number, currency: string = "NGN") => {
    const symbol = currency === "NGN" ? "₦" : currency;
    return `${symbol}${amount.toLocaleString()}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    SuccessToast({
      title: "Copied",
      description: "Details copied to clipboard",
    });
  };

  const errorDetails = data.status === "failed" ? getErrorDetails() : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Status Icon Section */}
        <div className={`px-6 pt-8 pb-6 flex flex-col items-center ${
          data.status === "success" 
            ? "bg-green-500/10" 
            : "bg-red-500/10"
        }`}>
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
            data.status === "success"
              ? "bg-green-500/20 border-2 border-green-500/30"
              : "bg-red-500/20 border-2 border-red-500/30"
          }`}>
            {data.status === "success" ? (
              <FiCheckCircle className="text-4xl text-green-500" />
            ) : (
              errorDetails?.icon || <FiX className="text-4xl text-red-500" />
            )}
          </div>
          <h2 className={`text-xl font-bold mb-1 ${
            data.status === "success" ? "text-green-500" : "text-red-500"
          }`}>
            {data.status === "success" ? "Payment Successful" : errorDetails?.title || "Payment Failed"}
          </h2>
          <p className="text-gray-400 text-sm text-center">
            {data.status === "success" 
              ? "Your payment has been processed successfully" 
              : errorDetails?.message || "Please try again later"}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10" />

        {/* Transaction Details */}
        <div className="px-6 py-5 space-y-3 bg-[#0A0A0A]">
          {data.accountNumber && (
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-400 text-sm">Account number</span>
              <span className="text-white text-sm font-medium">{data.accountNumber}</span>
            </div>
          )}

          {data.accountName && (
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-400 text-sm">Account name</span>
              <span className="text-white text-sm font-medium text-right max-w-[60%] truncate">
                {data.accountName}
              </span>
            </div>
          )}

          {data.bankName && (
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-400 text-sm">Bank name</span>
              <span className="text-white text-sm font-medium">{data.bankName}</span>
            </div>
          )}

          <div className="flex items-center justify-between py-2">
            <span className="text-gray-400 text-sm">Amount</span>
            <span className="text-white text-base font-semibold">
              {formatCurrency(data.amount, data.currency)}
            </span>
          </div>

          {data.narration && (
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-400 text-sm">Narration</span>
              <span className="text-white text-sm font-medium text-right max-w-[60%] truncate">
                {data.narration}
              </span>
            </div>
          )}

          {data.transactionId && (
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-400 text-sm">Transaction ID</span>
              <div className="flex items-center gap-2">
                <span className="text-white text-sm font-medium font-mono">
                  {data.transactionId.length > 8 ? `${data.transactionId.slice(0, 8)}...` : data.transactionId}
                </span>
                <button
                  onClick={() => copyToClipboard(data.transactionId || "")}
                  className="text-gray-400 hover:text-white transition-colors"
                  title="Copy"
                >
                  <FiCopy className="text-sm" />
                </button>
              </div>
            </div>
          )}

          {data.expectedReturn && data.status === "success" && (
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-400 text-sm">Expected Return</span>
              <span className="text-green-400 text-base font-semibold">
                {formatCurrency(data.expectedReturn, data.currency || "NGN")}
              </span>
            </div>
          )}

          {data.newWalletBalance && data.status === "success" && (
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-400 text-sm">New Wallet Balance</span>
              <span className="text-white text-base font-semibold">
                {formatCurrency(data.newWalletBalance, data.currency || "NGN")}
              </span>
            </div>
          )}

          {data.dateTime && (
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-400 text-sm">Date & Time</span>
              <span className="text-white text-sm font-medium">
                {new Date(data.dateTime).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-6 pt-4 flex flex-col sm:flex-row items-center gap-3">
          <CustomButton
            onClick={onClose}
            className="flex-1 w-full sm:w-auto py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-colors"
          >
            Close
          </CustomButton>
          {data.status === "success" && (
            <CustomButton
              onClick={() => {
                // Generate receipt content
                const receiptContent = `
ValarPay Investment Receipt
============================

Transaction ID: ${data.transactionId || "N/A"}
Date: ${new Date(data.dateTime || Date.now()).toLocaleString()}
Type: ${data.transactionType || "Investment"}

Amount Invested: ${data.currency || "NGN"} ${data.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
${data.expectedReturn ? `Expected Return: ${data.currency || "NGN"} ${data.expectedReturn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ""}
${data.newWalletBalance ? `New Wallet Balance: ${data.currency || "NGN"} ${data.newWalletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ""}

${data.narration ? `Narration: ${data.narration}` : ""}

Status: SUCCESS

Thank you for using ValarPay!
                `.trim();
                
                // Create and download file
                const blob = new Blob([receiptContent], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `investment-receipt-${data.transactionId || Date.now()}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="flex-1 w-full sm:w-auto py-3 rounded-xl bg-[#FF6B2C] hover:bg-[#FF7A3D] text-black font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <FiDownload className="text-base" />
              Download Receipt
            </CustomButton>
          )}
          {data.status === "failed" && onRetry && (
            <CustomButton
              onClick={onRetry}
              className="flex-1 w-full sm:w-auto py-3 rounded-xl bg-[#FF6B2C] hover:bg-[#FF7A3D] text-black font-semibold transition-colors"
            >
              Retry
            </CustomButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalPaymentResultModal;

