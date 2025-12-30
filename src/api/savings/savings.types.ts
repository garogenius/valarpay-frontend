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
  type?: string; // fixed-savings | target-savings | easy-life | fixed-deposit (backend dependent)
  status?: string;
  [k: string]: any;
};

export type SavingsPlanStatus = "ACTIVE" | "COMPLETED" | "BROKEN" | "CLOSED" | string;

export type SavingsPlan = {
  id?: string | number;
  planId?: string | number;
  productId?: string | number;
  product?: SavingsProduct | any;
  name?: string;
  type?: string; // backend dependent
  currency?: string;
  targetAmount?: number;
  currentAmount?: number;
  interestRate?: number;
  status?: SavingsPlanStatus;
  createdAt?: string;
  startDate?: string;
  endDate?: string;
  maturityDate?: string;
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
  totalPayout?: number;
  interestEarned?: number;
  principal?: number;
  [k: string]: any;
};

export type ICreateSavingsPlan = {
  productId?: string | number;
  planType?: string;
  name?: string;
  currency?: string; // NGN
  targetAmount?: number;

  // optional fields used by existing UI (backend dependent)
  fundingType?: "manual" | "auto-save" | string;
  amount?: number;
  startDate?: string;
  endDate?: string;
  frequency?: string;
  topUpAmount?: number;
  strictMode?: boolean;
  preferredTime?: string;
  targetType?: string;
  duration?: string;
  rules?: any;
  [k: string]: any;
};

export type IGetSavingsPlanDetails = {
  planId: string | number;
};

export type IFundSavingsPlan = {
  planId: string | number;
  amount: number;
  currency: string;
  walletPin: string;
  [k: string]: any;
};

export type ICloseSavingsPlan = {
  planId: string | number;
  walletPin: string;
  [k: string]: any;
};











