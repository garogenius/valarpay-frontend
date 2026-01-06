export type BettingPlatform = {
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  category: string;
  minAmount: number;
  maxAmount: number;
  enabled?: boolean;
};

export type BettingWallet = {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  palmpayAccountId?: string;
  palmpayAccountNumber?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type BettingTransaction = {
  id: string;
  type: "FUND" | "WITHDRAW";
  status: "PENDING" | "PROCESSING" | "SUCCESS" | "FAILED" | "CANCELLED";
  amount: number;
  platform: string;
  orderReference: string;
  operationType?: string;
  currency: string;
  transactionRef?: string;
  description?: string;
  createdAt: string;
};

export type IFundBettingPlatform = {
  amount: number;
  platform: string;
  platformUserId?: string;
  currency: string;
  remark?: string;
  description?: string;
  walletPin?: string;
};

export type IFundBettingWallet = {
  amount: number;
  currency: string;
  walletPin: string;
  description?: string;
};

export type IWithdrawBettingWallet = {
  amount: number;
  platform: string;
  accountNumber: string;
  accountName: string;
  bankCode: string;
  bankName?: string;
  currency: string;
  remark?: string;
  walletPin: string;
};

export type IQueryBettingTransaction = {
  orderReference: string;
};


















