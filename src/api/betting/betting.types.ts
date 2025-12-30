export type BettingPlatform = {
  code: string;
  name: string;
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
  operationType: string;
  status: string;
  amount: number;
  currency: string;
  transactionRef: string;
  createdAt: string;
};

export type IFundBettingPlatform = {
  platform: string;
  platformUserId: string;
  amount: number;
  currency: string;
  walletPin: string;
  description?: string;
};

export type IFundBettingWallet = {
  amount: number;
  currency: string;
  walletPin: string;
  description?: string;
};

export type IWithdrawBettingWallet = {
  amount: number;
  currency: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  walletPin: string;
  description?: string;
};















