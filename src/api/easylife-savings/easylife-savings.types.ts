/* eslint-disable @typescript-eslint/no-explicit-any */

export type EasyLifeContributionFrequency = "DAILY" | "WEEKLY" | "MONTHLY";

export type EasyLifePlanStatus = "ACTIVE" | "COMPLETED" | "CLOSED" | string;

export type EasyLifePlan = {
  id: string;
  userId?: string;
  walletId?: string;
  type?: "EASYLIFE";
  name?: string;
  title?: string;
  description?: string;
  goalAmount: number;
  targetAmount?: number;
  currency: string;
  interestRate?: number;
  interestRatePerAnnum?: number; // API alternative field name
  penaltyRate?: number;
  earlyWithdrawalPenaltyRate?: number; // API alternative field name
  durationDays: number;
  minDepositAmount?: number;
  contributionFrequency: EasyLifeContributionFrequency;
  autoDebitEnabled?: boolean;
  earlyWithdrawalEnabled?: boolean;
  allowEarlyWithdrawal?: boolean; // API alternative field name
  allowPartialWithdrawal?: boolean;
  isLocked?: boolean;
  autoDebitAmount?: number | null;
  earlyWithdrawalOptedIn?: boolean;
  totalDeposited: number;
  totalSaved?: number; // API alternative field name
  totalInterestAccrued?: number;
  progress?: number;
  progressPercentage?: number;
  remainingAmount?: number;
  daysRemaining?: number;
  isGoalReached?: boolean;
  status: EasyLifePlanStatus;
  startDate?: string;
  maturityDate?: string;
  lockedUntil?: string;
  closedAt?: string | null;
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

export type EasyLifePlanDetails = {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  goalAmount: number;
  targetAmount?: number;
  totalDeposited: number;
  totalSaved?: number;
  durationDays: number;
  status: EasyLifePlanStatus;
  fundings: Array<{
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

export type ICreateEasyLifePlan = {
  name: string;
  description?: string;
  goalAmount: number;
  currency: string;
  durationDays: number;
  contributionFrequency: EasyLifeContributionFrequency;
  autoDebitEnabled: boolean;
  earlyWithdrawalEnabled: boolean;
  walletPin?: string;
  [k: string]: any;
};

export type IGetEasyLifePlanDetails = {
  planId: string;
};

export type IFundEasyLifePlan = {
  planId: string;
  amount: number;
  currency: string;
  walletPin?: string;
  [k: string]: any;
};

export type IWithdrawEasyLifePlan = {
  planId: string;
  walletPin?: string;
  [k: string]: any;
};

export type ICloseEasyLifePlan = {
  planId: string;
  walletPin: string;
  reason?: string;
  [k: string]: any;
};
