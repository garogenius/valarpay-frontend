/* eslint-disable @typescript-eslint/no-explicit-any */

export type SavingsProduct = {
  id?: string | number;
  code?: string;
  name?: string;
  description?: string;
  interestRate?: number;
  minAmount?: number;
  maxAmount?: number;
  currency?: string;
  type?: string;
  status?: string;
  [k: string]: any;
};

export type SavingsPlanStatus = "ACTIVE" | "COMPLETED" | "BROKEN" | "CLOSED" | string;

export type SavingsPlanType = "FLEX_SAVE" | "VALAR_AUTO_SAVE";

export type SavingsPlan = {
  id?: string | number;
  planId?: string | number;
  userId?: string;
  productId?: string | number;
  product?: SavingsProduct | any;
  name?: string;
  title?: string;
  description?: string;
  type?: SavingsPlanType | string;
  currency?: string;
  goalAmount?: number;
  targetAmount?: number;
  duration?: string;
  currentAmount?: number;
  totalDeposited?: number;
  totalInterestAccrued?: number;
  interestRate?: number;
  // New API fields (v2)
  interestRatePerAnnum?: number;
  earlyWithdrawalPenaltyRate?: number;
  allowEarlyWithdrawal?: boolean;
  allowPartialWithdrawal?: boolean;
  isLocked?: boolean;
  penaltyRate?: number;
  durationMonths?: number;
  autoDebitEnabled?: boolean;
  autoDebitAmount?: number;
  contributionFrequency?: string;
  walletId?: string;
  minMonthlyDeposit?: number | null;
  status?: SavingsPlanStatus;
  startDate?: string;
  endDate?: string;
  maturityDate?: string;
  lockedUntil?: string;
  lastDepositDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
  fundings?: Array<{
    id: string;
    amount: number;
    createdAt: string;
    [k: string]: any;
  }>;
  deposits?: Array<{
    id: string;
    planId: string;
    walletId: string;
    amount: number;
    currency: string;
    transactionId: string;
    createdAt: string;
  }>;
  [k: string]: any;
};

export type FundingHistoryItem = {
  id?: string | number;
  type?: string;
  amount?: number;
  currency?: string;
  reference?: string;
  createdAt?: string;
  status?: string;
  [k: string]: any;
};

export type SavingsPlanDetails = {
  plan?: SavingsPlan;
  fundingHistory?: FundingHistoryItem[];
  deposits?: FundingHistoryItem[];
  totalPayout?: number;
  interestEarned?: number;
  principal?: number;
  [k: string]: any;
};

export type ICreateSavingsPlan = {
  type: SavingsPlanType;
  name: string;
  description?: string;
  goalAmount: number;
  currency: string;
  durationMonths: number;
  walletPin?: string;
  [k: string]: any;
};

export type IGetSavingsPlanDetails = {
  planId: string | number;
};

export type IFundSavingsPlan = {
  planId: string | number;
  amount: number;
  currency: string;
  walletPin?: string;
  [k: string]: any;
};

export type IWithdrawSavingsPlan = {
  planId: string | number;
  walletPin?: string;
  [k: string]: any;
};

export type ICloseSavingsPlan = {
  planId: string | number;
  walletPin: string;
  [k: string]: any;
};
