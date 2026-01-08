"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CgClose } from "react-icons/cg";
import { FiAlertCircle, FiArrowRight, FiDollarSign } from "react-icons/fi";
import CustomButton from "./Button";
import useNavigate from "@/hooks/useNavigate";

interface GlobalInsufficientFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredAmount?: number;
  currentBalance?: number;
  currency?: "NGN" | "USD" | "EUR" | "GBP";
  onFundAccount?: () => void;
}

const GlobalInsufficientFundsModal: React.FC<GlobalInsufficientFundsModalProps> = ({
  isOpen,
  onClose,
  requiredAmount,
  currentBalance,
  currency = "NGN",
  onFundAccount,
}) => {
  const navigate = useNavigate();

  const getCurrencySymbol = (curr: string) => {
    switch (curr) {
      case "NGN":
        return "₦";
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "GBP":
        return "£";
      default:
        return "₦";
    }
  };

  const handleFundAccount = () => {
    onClose();
    if (onFundAccount) {
      onFundAccount();
    } else {
      navigate("/user/dashboard");
    }
  };

  const shortfall = requiredAmount && currentBalance !== undefined 
    ? Math.max(0, requiredAmount - currentBalance) 
    : 0;

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
            className="relative w-full max-w-md bg-bg-600 dark:bg-bg-1100 border border-border-800 dark:border-border-700 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 hover:bg-white/10 rounded-full transition-colors z-10"
            >
              <CgClose className="text-xl text-white" />
            </button>

            {/* Error Icon */}
            <div className="px-6 pt-8 pb-6 flex flex-col items-center bg-red-500/10">
              <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500/30 flex items-center justify-center mb-4">
                <FiDollarSign className="text-4xl text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-red-500 mb-2">Insufficient Funds</h2>
              <p className="text-white/70 text-sm text-center">
                You don't have enough funds in your {currency} account to complete this transaction.
              </p>
            </div>

            {/* Balance Information */}
            {(requiredAmount !== undefined || currentBalance !== undefined) && (
              <div className="px-6 py-5 space-y-3 bg-bg-600 dark:bg-bg-1100">
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
                  {requiredAmount !== undefined && requiredAmount > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-sm">Required Amount:</span>
                      <span className="text-white font-semibold">
                        {getCurrencySymbol(currency)}{requiredAmount.toLocaleString(undefined, { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 2 
                        })}
                      </span>
                    </div>
                  )}
                  {currentBalance !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-sm">Current Balance:</span>
                      <span className="text-white font-semibold">
                        {getCurrencySymbol(currency)}{currentBalance.toLocaleString(undefined, { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 2 
                        })}
                      </span>
                    </div>
                  )}
                  {shortfall > 0 && (
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <span className="text-white/70 text-sm">Shortfall:</span>
                      <span className="text-red-400 font-semibold">
                        {getCurrencySymbol(currency)}{shortfall.toLocaleString(undefined, { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 2 
                        })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Information Card */}
                <div className="bg-[#f76301]/10 border border-[#f76301]/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#f76301]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FiAlertCircle className="text-[#f76301] text-xs" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium mb-1">Fund Your Account</p>
                      <p className="text-white/70 text-xs leading-relaxed">
                        Please fund your account with sufficient balance to complete this transaction. 
                        You can add funds through bank transfer, card payment, or other available payment methods.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="px-6 pb-6 pt-4 flex flex-col gap-3">
              <CustomButton
                onClick={handleFundAccount}
                className="w-full bg-[#f76301] hover:bg-[#e55a00] text-black font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
              >
                Fund Account
                <FiArrowRight className="text-base" />
              </CustomButton>
              <button
                onClick={onClose}
                className="w-full px-4 py-3 rounded-lg border border-white/10 text-white hover:bg-white/5 text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GlobalInsufficientFundsModal;

