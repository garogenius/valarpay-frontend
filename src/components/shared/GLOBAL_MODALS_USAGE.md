# Global Modals Usage Guide

This guide explains how to use the global modals for consistent error handling and transaction feedback across the application.

## Available Modals

1. **GlobalInsufficientFundsModal** - Shows when user has insufficient balance
2. **GlobalIncorrectPinModal** - Shows when PIN is incorrect
3. **GlobalPaymentFailedModal** - Shows generic payment failures
4. **GlobalTransactionReceiptModal** - Shows transaction receipt with PNG download
5. **GlobalTransactionHistoryModal** - Shows transaction history/details

## Setup

### 1. Add GlobalModalsProvider to your root layout

```tsx
// app/layout.tsx or app/user/layout.tsx
import GlobalModalsProvider from "@/components/shared/GlobalModalsProvider";

export default function Layout({ children }) {
  return (
    <>
      <GlobalModalsProvider />
      {children}
    </>
  );
}
```

## Usage Examples

### Method 1: Using the useGlobalModalsStore (Recommended)

```tsx
"use client";

import useGlobalModalsStore from "@/store/globalModals.store";
import { useMutation } from "@tanstack/react-query";

const TransferComponent = () => {
  const { handleError, showInsufficientFundsModal } = useGlobalModalsStore();

  const { mutate: transfer, isPending } = useMutation({
    mutationFn: transferRequest,
    onError: (error) => {
      // Automatically detects error type and shows appropriate modal
      handleError(error, {
        currency: "NGN",
        onRetry: () => {
          // Retry logic
        },
        onFundAccount: () => {
          // Navigate to fund account
        },
      });
    },
    onSuccess: (data) => {
      // Handle success
    },
  });

  return (
    // Your component JSX
  );
};
```

### Method 2: Manual Modal Control

```tsx
"use client";

import useGlobalModalsStore from "@/store/globalModals.store";
import { useGetCurrencyAccounts } from "@/api/currency/currency.queries";

const PayBillComponent = () => {
  const {
    showInsufficientFundsModal,
    showIncorrectPinModal,
    showPaymentFailedModal,
  } = useGlobalModalsStore();
  
  const { accounts } = useGetCurrencyAccounts();
  const usdAccount = accounts?.find(a => a.currency === "USD");

  const handlePayment = async () => {
    try {
      // Your payment logic
      if (amount > usdAccount.balance) {
        showInsufficientFundsModal({
          requiredAmount: amount,
          currentBalance: usdAccount.balance,
          currency: "USD",
          onFundAccount: () => {
            // Navigate to fund account
          },
        });
        return;
      }
      
      // Continue with payment
    } catch (error) {
      showPaymentFailedModal({
        errorMessage: error.message,
        onRetry: () => handlePayment(),
      });
    }
  };

  return (
    // Your component JSX
  );
};
```

### Method 3: Direct Component Usage

```tsx
"use client";

import { useState } from "react";
import GlobalInsufficientFundsModal from "@/components/shared/GlobalInsufficientFundsModal";
import GlobalIncorrectPinModal from "@/components/shared/GlobalIncorrectPinModal";
import GlobalPaymentFailedModal from "@/components/shared/GlobalPaymentFailedModal";

const AddMoneyComponent = () => {
  const [showInsufficient, setShowInsufficient] = useState(false);
  const [showIncorrectPin, setShowIncorrectPin] = useState(false);
  const [showFailed, setShowFailed] = useState(false);

  const handleError = (error: any) => {
    if (error.message.includes("insufficient")) {
      setShowInsufficient(true);
    } else if (error.message.includes("pin")) {
      setShowIncorrectPin(true);
    } else {
      setShowFailed(true);
    }
  };

  return (
    <>
      {/* Your component JSX */}
      
      <GlobalInsufficientFundsModal
        isOpen={showInsufficient}
        onClose={() => setShowInsufficient(false)}
        requiredAmount={1000}
        currentBalance={500}
        currency="NGN"
      />
      
      <GlobalIncorrectPinModal
        isOpen={showIncorrectPin}
        onClose={() => setShowIncorrectPin(false)}
        onRetry={() => {
          setShowIncorrectPin(false);
          // Retry logic
        }}
      />
      
      <GlobalPaymentFailedModal
        isOpen={showFailed}
        onClose={() => setShowFailed(false)}
        errorMessage="Payment processing failed"
        onRetry={() => {
          setShowFailed(false);
          // Retry logic
        }}
      />
    </>
  );
};
```

## Transaction Receipt Modal

```tsx
"use client";

import { useState } from "react";
import GlobalTransactionReceiptModal from "@/components/shared/GlobalTransactionReceiptModal";

const TransactionComponent = () => {
  const [showReceipt, setShowReceipt] = useState(false);
  const [transaction, setTransaction] = useState(null);

  const handleViewReceipt = (txn: any) => {
    setTransaction(txn);
    setShowReceipt(true);
  };

  return (
    <>
      {/* Your component JSX */}
      
      {transaction && (
        <GlobalTransactionReceiptModal
          isOpen={showReceipt}
          onClose={() => setShowReceipt(false)}
          transaction={{
            id: transaction.id,
            type: "TRANSFER",
            status: "SUCCESSFUL",
            amount: transaction.amount,
            currency: transaction.currency,
            reference: transaction.reference,
            createdAt: transaction.createdAt,
            recipientName: transaction.recipientName,
            recipientAccount: transaction.recipientAccount,
            recipientBank: transaction.recipientBank,
            description: transaction.description,
          }}
        />
      )}
    </>
  );
};
```

## Error Detection

The `handleError` function automatically detects:
- **Insufficient Funds**: Checks for "insufficient", "low balance", "not enough" in error message
- **Incorrect PIN**: Checks for "pin", "password", "authentication" in error message
- **Payment Failed**: Generic fallback for all other errors

## Best Practices

1. **Use the hook method** for automatic error detection
2. **Always provide currency** when handling insufficient funds errors
3. **Provide retry callbacks** for better UX
4. **Use transaction receipt modal** for successful transactions
5. **Keep error messages user-friendly** and actionable

## Integration Points

These modals should be used in:
- Transfer operations
- Bill payments (airtime, data, cable, electricity, internet)
- Add money operations
- Betting transactions
- Card operations
- Any payment-related flows

