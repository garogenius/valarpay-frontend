/* eslint-disable @typescript-eslint/no-explicit-any */

// Backend plan types are not stable across versions (e.g. SHORT_TERM_90_DAYS)
export type FixedDepositPlanType = string;

export type FixedDepositPlan = {
  planType: FixedDepositPlanType;
  name: string;
  minimumDeposit: number;
  // New API fields
  interestRatePerAnnum?: number; // e.g. 0.04
  tenureDays?: number;
  tenureMonths?: number;
  description?: string;
  earlyWithdrawalPenaltyRate?: number;
  earlyWithdrawalMinDays?: number;
  // Legacy/normalized fields (some UIs still read these)
  interestRate?: number;
  interestRatePercentage?: string;
  durationDays?: number;
  durationMonths?: number;
  [k: string]: any;
};

export type FixedDepositStatus = "ACTIVE" | "MATURED" | "PAID_OUT" | "EARLY_WITHDRAWN" | string;

export type FixedDeposit = {
  id: string;
  userId: string;
  walletId: string;
  planType: FixedDepositPlanType;
  principalAmount: number;
  currency: string;
  // Some backends return interestRate, others return interestRatePerAnnum
  interestRate?: number;
  interestRatePerAnnum?: number;
  minimumDeposit: number;
  durationDays?: number;
  durationMonths?: number;
  interestPaymentFrequency: "AT_MATURITY" | "MONTHLY" | "QUARTERLY" | string;
  reinvestInterest: boolean;
  autoRenewal: boolean;
  startDate: string;
  maturityDate: string;
  certificateReference?: string;
  status: FixedDepositStatus;
  createdAt?: string;
  updatedAt?: string;
  interestPayments?: any[];
  interestDetails?: {
    totalInterestEarned: number;
    totalInterestPaid: number;
    remainingInterest: number;
    nextPaymentDate: string;
    nextPaymentAmount: number;
  };
  [k: string]: any;
};

export type ICreateFixedDeposit = {
  planType: FixedDepositPlanType;
  principalAmount: number;
  currency: string;
  interestPaymentFrequency: "AT_MATURITY" | "MONTHLY" | "QUARTERLY";
  reinvestInterest: boolean;
  autoRenewal: boolean;
  walletPin?: string;
  [k: string]: any;
};

export type IPayoutFixedDeposit = {
  fixedDepositId: string;
  walletPin?: string;
  [k: string]: any;
};

export type IEarlyWithdrawFixedDeposit = {
  fixedDepositId: string;
  reason: string;
  walletPin?: string;
  [k: string]: any;
};

export type IRolloverFixedDeposit = {
  fixedDepositId: string;
  rolloverType: "PRINCIPAL_ONLY" | "PRINCIPAL_PLUS_INTEREST";
  autoRenewal?: boolean;
  walletPin?: string;
  [k: string]: any;
};
