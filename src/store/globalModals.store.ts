import { create } from "zustand";
import { isInsufficientBalanceError, extractBalanceInfo } from "@/utils/errorUtils";

interface GlobalModalsState {
  // Insufficient Funds Modal
  showInsufficientFunds: boolean;
  insufficientFundsData: {
    requiredAmount?: number;
    currentBalance?: number;
    currency?: "NGN" | "USD" | "EUR" | "GBP";
    onFundAccount?: () => void;
  };

  // Incorrect PIN Modal
  showIncorrectPin: boolean;
  incorrectPinData: {
    attemptsRemaining?: number;
    onRetry?: () => void;
  };

  // Payment Failed Modal
  showPaymentFailed: boolean;
  paymentFailedData: {
    errorMessage?: string;
    errorCode?: string;
    transactionId?: string;
    onRetry?: () => void;
  };

  // Transaction History Modal
  showTransactionHistory: boolean;
  transactionHistoryData: {
    transaction: any | null;
  };

  // Transaction Processing Loader
  showProcessingLoader: boolean;

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
  showTransactionHistoryModal: (transaction: any) => void;
  showProcessingLoaderModal: () => void;
  hideProcessingLoaderModal: () => void;
  closeAllModals: () => void;
}

const useGlobalModalsStore = create<GlobalModalsState>((set) => ({
  // Initial state
  showInsufficientFunds: false,
  insufficientFundsData: {},
  showIncorrectPin: false,
  incorrectPinData: {},
  showPaymentFailed: false,
  paymentFailedData: {},
  showTransactionHistory: false,
  transactionHistoryData: { transaction: null },
  showProcessingLoader: false,

  // Handle error automatically
  handleError: (error: any, options?: {
    currency?: "NGN" | "USD" | "EUR" | "GBP";
    onRetry?: () => void;
    onFundAccount?: () => void;
  }) => {
    const errorMessage = error?.response?.data?.message;
    const errorCode = error?.response?.data?.code || error?.response?.data?.errorCode;
    const message = Array.isArray(errorMessage) 
      ? errorMessage.join(" ").toLowerCase()
      : String(errorMessage || "").toLowerCase();

    // Check for insufficient funds
    if (isInsufficientBalanceError(error)) {
      const balanceInfo = extractBalanceInfo(error);
      set({
        showInsufficientFunds: true,
        insufficientFundsData: {
          requiredAmount: balanceInfo.requiredAmount,
          currentBalance: balanceInfo.currentBalance,
          currency: options?.currency || "NGN",
          onFundAccount: options?.onFundAccount,
        },
      });
      return;
    }

    // Check for incorrect PIN
    if (
      message.includes("pin") ||
      message.includes("password") ||
      message.includes("authentication") ||
      errorCode?.toLowerCase().includes("pin")
    ) {
      set({
        showIncorrectPin: true,
        incorrectPinData: {
          attemptsRemaining: error?.response?.data?.attemptsRemaining,
          onRetry: options?.onRetry,
        },
      });
      return;
    }

    // Generic payment failed
    set({
      showPaymentFailed: true,
      paymentFailedData: {
        errorMessage: errorMessage || "An error occurred while processing your payment.",
        errorCode,
        transactionId: error?.response?.data?.transactionId,
        onRetry: options?.onRetry,
      },
    });
  },

  showInsufficientFundsModal: (data) => {
    set({
      showInsufficientFunds: true,
      insufficientFundsData: data,
    });
  },

  showIncorrectPinModal: (data = {}) => {
    set({
      showIncorrectPin: true,
      incorrectPinData: data,
    });
  },

  showPaymentFailedModal: (data) => {
    set({
      showPaymentFailed: true,
      paymentFailedData: data,
    });
  },

  showTransactionHistoryModal: (transaction) => {
    set({
      showTransactionHistory: true,
      transactionHistoryData: { transaction },
    });
  },

  showProcessingLoaderModal: () => {
    set({
      showProcessingLoader: true,
    });
  },

  hideProcessingLoaderModal: () => {
    set({
      showProcessingLoader: false,
    });
  },

  closeAllModals: () => {
    set({
      showInsufficientFunds: false,
      insufficientFundsData: {},
      showIncorrectPin: false,
      incorrectPinData: {},
      showPaymentFailed: false,
      paymentFailedData: {},
      showTransactionHistory: false,
      transactionHistoryData: { transaction: null },
      showProcessingLoader: false,
    });
  },
}));

export default useGlobalModalsStore;

