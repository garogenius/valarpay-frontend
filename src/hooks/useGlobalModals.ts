"use client";

/**
 * @deprecated Use useGlobalModalsStore from "@/store/globalModals.store" instead
 * This hook is kept for backward compatibility but will be removed in future versions
 */
import useGlobalModalsStore from "@/store/globalModals.store";

interface UseGlobalModalsReturn {
  // State
  showInsufficientFunds: boolean;
  showIncorrectPin: boolean;
  showPaymentFailed: boolean;
  insufficientFundsData: {
    requiredAmount?: number;
    currentBalance?: number;
    currency?: "NGN" | "USD" | "EUR" | "GBP";
  };
  incorrectPinData: {
    attemptsRemaining?: number;
  };
  paymentFailedData: {
    errorMessage?: string;
    errorCode?: string;
    transactionId?: string;
  };

  // Actions
  handleError: (error: any, options?: {
    currency?: "NGN" | "USD" | "EUR" | "GBP";
    onRetry?: () => void;
    onFundAccount?: () => void;
  }) => void;
  showInsufficientFundsModal: (data: {
    requiredAmount?: number;
    currentBalance?: number;
    currency?: "NGN" | "USD" | "EUR" | "GBP";
    onFundAccount?: () => void;
  }) => void;
  showIncorrectPinModal: (data?: {
    attemptsRemaining?: number;
    onRetry?: () => void;
  }) => void;
  showPaymentFailedModal: (data: {
    errorMessage?: string;
    errorCode?: string;
    transactionId?: string;
    onRetry?: () => void;
  }) => void;
  closeAllModals: () => void;
}

export const useGlobalModals = (): UseGlobalModalsReturn => {
  return useGlobalModalsStore();
};

