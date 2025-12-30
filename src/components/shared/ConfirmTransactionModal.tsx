"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { FaFingerprint } from "react-icons/fa";
import CustomButton from "./Button";
import { useFingerprintForPayments } from "@/store/paymentPreferences.store";

interface ConfirmTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (pin: string) => void;
  recipient: string;
  bank?: string;
  accountNumber: string;
  amount: number;
  currency?: string;
  isLoading?: boolean;
}

const ConfirmTransactionModal = ({
  isOpen,
  onClose,
  onConfirm,
  recipient,
  bank,
  accountNumber,
  amount,
  currency = "NGN",
  isLoading = false,
}: ConfirmTransactionModalProps) => {
  const [pin, setPin] = useState("");
  const fingerprintEnabled = useFingerprintForPayments();

  const handleConfirm = () => {
    if (pin && pin.length === 4) {
      onConfirm(pin);
    }
  };

  const handleClose = () => {
    setPin("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md bg-[#1C1C1E] rounded-2xl border border-gray-800 p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-lg font-semibold">Confirm Transaction</h2>
              <button
                onClick={handleClose}
                className="p-1 rounded-lg hover:bg-[#2C2C2E] text-gray-400 hover:text-white transition-colors"
              >
                <IoClose className="w-5 h-5" />
              </button>
            </div>

            {/* Transaction Details */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Recipient</span>
                <span className="text-sm text-white font-medium text-right">{recipient}</span>
              </div>

              {bank && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Bank</span>
                  <span className="text-sm text-white font-medium text-right">{bank}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Account Number</span>
                <span className="text-sm text-white font-medium font-mono">{accountNumber}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Amount</span>
                <span className="text-sm text-white font-medium">
                  {currency === "NGN" ? "₦" : currency}
                  {amount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* PIN Input */}
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">
                Enter Transaction PIN
              </label>
              <div className="w-full flex gap-2 items-center bg-[#2C2C2E] border border-gray-700 rounded-lg py-3 px-4">
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter PIN"
                  className="w-full bg-transparent border-none outline-none text-white placeholder:text-gray-500 text-base"
                />
                {fingerprintEnabled ? <FaFingerprint className="text-2xl text-gray-400" /> : null}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 py-3 rounded-lg bg-transparent border border-gray-700 text-white hover:bg-[#2C2C2E] transition-colors disabled:opacity-50"
              >
                Back
              </button>
              <CustomButton
                type="button"
                onClick={handleConfirm}
                disabled={!pin || pin.length !== 4 || isLoading}
                className="flex-1 border-2 border-primary text-white text-base py-3"
              >
                {isLoading ? "Processing..." : "Pay"}
              </CustomButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmTransactionModal;
