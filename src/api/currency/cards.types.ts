export type CardCurrency = "USD" | "EUR" | "GBP" | "NGN";
export type CardStatus = "ACTIVE" | "FROZEN" | "BLOCKED" | "CLOSED";

export interface IVirtualCard {
  id: string;
  cardId?: string;
  walletId: string;
  cardNumber: string;
  cvv: string;
  expiryMonth: string;
  expiryYear: string;
  currency: CardCurrency;
  balance: number;
  label?: string;
  status: CardStatus;
  providerCardId?: string;
  createdAt?: string;
  updatedAt?: string;
  dailyLimit?: number;
  monthlyLimit?: number;
  transactionLimit?: number;
}

export interface ICreateCardPayload {
  walletId: string;
  currency: CardCurrency;
  cardholderName: string;
  pin: string; // 4-digit card PIN
  initialBalance?: number;
}

export interface IUpdateCardPayload {
  label?: string;
}

export interface IBlockCardPayload {
  walletPin: string;
  reason?: string;
}

export interface ICloseCardPayload {
  walletPin: string;
}

export interface IFundCardPayload {
  amount: number;
  walletPin: string;
}

export interface IWithdrawCardPayload {
  amount: number;
  walletPin: string;
}

export interface ISetCardLimitsPayload {
  dailyLimit?: number;
  monthlyLimit?: number;
  transactionLimit?: number;
  walletPin: string;
}

export interface IGetCardTransactionsQuery {
  limit?: number;
  offset?: number;
}

export interface ICardTransaction {
  id: string;
  cardId: string;
  amount: number;
  currency: CardCurrency;
  transactionType: "DEBIT" | "CREDIT";
  status: "COMPLETED" | "PENDING" | "FAILED";
  merchantName?: string;
  description?: string;
  timestamp: string;
}






