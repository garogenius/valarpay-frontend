"use client";

import React from "react";
import useGlobalModalsStore from "@/store/globalModals.store";
import GlobalInsufficientFundsModal from "./GlobalInsufficientFundsModal";
import GlobalIncorrectPinModal from "./GlobalIncorrectPinModal";
import GlobalPaymentFailedModal from "./GlobalPaymentFailedModal";
import GlobalTransactionHistoryModal from "./GlobalTransactionHistoryModal";
import TransactionProcessingLoader from "./TransactionProcessingLoader";

/**
 * Global Modals Provider Component
 * 
 * This component should be added to your root layout or app component
 * to provide global access to error modals throughout the application.
 * 
 * Usage:
 * ```tsx
 * // In your layout or app component
 * <GlobalModalsProvider />
 * ```
 * 
 * Then in any component:
 * ```tsx
 * import useGlobalModalsStore from "@/store/globalModals.store";
 * 
 * const { handleError, showInsufficientFundsModal } = useGlobalModalsStore();
 * 
 * // In error handler
 * const onError = (error: any) => {
 *   handleError(error, { currency: "NGN" });
 * };
 * ```
 */
const GlobalModalsProvider: React.FC = () => {
  const {
    showInsufficientFunds,
    showIncorrectPin,
    showPaymentFailed,
    showTransactionHistory,
    showProcessingLoader,
    insufficientFundsData,
    incorrectPinData,
    paymentFailedData,
    transactionHistoryData,
    closeAllModals,
  } = useGlobalModalsStore();

  return (
    <>
      <GlobalInsufficientFundsModal
        isOpen={showInsufficientFunds}
        onClose={() => {
          closeAllModals();
        }}
        requiredAmount={insufficientFundsData.requiredAmount}
        currentBalance={insufficientFundsData.currentBalance}
        currency={insufficientFundsData.currency}
        onFundAccount={insufficientFundsData.onFundAccount}
      />
      
      <GlobalIncorrectPinModal
        isOpen={showIncorrectPin}
        onClose={() => {
          closeAllModals();
        }}
        onRetry={incorrectPinData.onRetry}
        attemptsRemaining={incorrectPinData.attemptsRemaining}
      />
      
      <GlobalPaymentFailedModal
        isOpen={showPaymentFailed}
        onClose={() => {
          closeAllModals();
        }}
        onRetry={paymentFailedData.onRetry}
        errorMessage={paymentFailedData.errorMessage}
        errorCode={paymentFailedData.errorCode}
        transactionId={paymentFailedData.transactionId}
      />

      <GlobalTransactionHistoryModal
        isOpen={showTransactionHistory}
        onClose={() => {
          closeAllModals();
        }}
        transaction={transactionHistoryData.transaction}
      />

      <TransactionProcessingLoader
        isOpen={showProcessingLoader}
      />
    </>
  );
};

export default GlobalModalsProvider;

