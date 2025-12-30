import React from "react";
import { FiCheckCircle, FiX, FiCopy } from "react-icons/fi";
import { MdOutlineSupportAgent, MdDownload } from "react-icons/md";
import CustomButton from "./Button";

interface TransactionResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: "success" | "failed";
  amount: number;
  currency?: string;
  transactionId?: string;
  dateTime?: string;
  paymentMethod?: string;
  transactionType?: string;
  recipientName?: string;
  recipientAccount?: string;
  bankName?: string;
  narration?: string;
  transferFee?: number;
}

const TransactionResultModal: React.FC<TransactionResultModalProps> = ({
  isOpen,
  onClose,
  status,
  amount,
  currency = "NGN",
  transactionId,
  dateTime,
  paymentMethod = "Available Balance",
  transactionType,
  recipientName,
  recipientAccount,
  bankName,
  narration,
  transferFee,
}) => {
  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatDateTime = () => {
    if (dateTime) return dateTime;
    return new Date().toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg mx-4 bg-[#1C1C1E] rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#1C1C1E] border-b border-gray-800 px-6 py-4 flex items-start justify-between">
          <div>
            <h2 className="text-white text-lg font-semibold">Transaction History</h2>
            <p className="text-gray-400 text-sm mt-0.5">
              View complete information about this transaction
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FiX className="text-2xl" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Status Badge */}
          <div
            className={`w-full rounded-xl px-6 py-8 flex flex-col items-center justify-center ${
              status === "success"
                ? "bg-green-500/10 border border-green-700/40"
                : "bg-red-500/10 border border-red-700/40"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              {status === "success" ? (
                <FiCheckCircle className="text-green-500 text-2xl" />
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-red-500 flex items-center justify-center">
                  <FiX className="text-red-500 text-lg" />
                </div>
              )}
              <span
                className={`text-lg font-medium ${
                  status === "success" ? "text-green-500" : "text-red-500"
                }`}
              >
                {status === "success" ? "Successful" : "Failed"}
              </span>
            </div>
            <p className="text-white text-3xl font-bold">
              ₦{amount.toLocaleString()}
            </p>
          </div>

          {/* Transaction Details */}
          <div className="bg-[#2C2C2E] rounded-xl px-5 py-4 space-y-3">
            {transactionId && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Transaction ID</span>
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium">
                    {transactionId}
                  </span>
                  <button
                    onClick={() => copyToClipboard(transactionId)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <FiCopy className="text-sm" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Date & Time</span>
              <span className="text-white text-sm font-medium">
                {formatDateTime()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Payment Method</span>
              <span className="text-white text-sm font-medium">
                {paymentMethod}
              </span>
            </div>

            {transactionType && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Transaction Type</span>
                <span className="text-white text-sm font-medium">
                  {transactionType}
                </span>
              </div>
            )}

            {recipientName && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">To</span>
                <span className="text-white text-sm font-medium">
                  {recipientName}
                </span>
              </div>
            )}

            {recipientAccount && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Recipient Account</span>
                <span className="text-white text-sm font-medium">
                  {recipientAccount}
                </span>
              </div>
            )}

            {bankName && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Bank Name</span>
                <span className="text-white text-sm font-medium">
                  {bankName}
                </span>
              </div>
            )}

            {narration && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Narration</span>
                <span className="text-white text-sm font-medium text-right max-w-[200px] truncate">
                  {narration}
                </span>
              </div>
            )}

            {transferFee !== undefined && transferFee > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Transfer Fee</span>
                <span className="text-white text-sm font-medium">
                  ₦{transferFee.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#2C2C2E] border border-gray-700 text-white hover:bg-[#353539] transition-colors">
              <MdOutlineSupportAgent className="text-lg" />
              <span className="text-sm font-medium">Contact Support</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#FF6B2C] text-white hover:bg-[#FF7A3D] transition-colors">
              <MdDownload className="text-lg" />
              <span className="text-sm font-medium">Download Receipt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionResultModal;
