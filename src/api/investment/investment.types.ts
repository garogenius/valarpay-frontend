export type InvestmentStatus = "PENDING" | "ACTIVE" | "MATURED" | "PAID_OUT" | "CANCELLED";

export interface InvestmentProduct {
  id?: string;
  name: string;
  description?: string;
  minimumAmount: number;
  roiRate: number; // percent (e.g. 15)
  tenureMonths: number;
  features?: string[];
}

export interface CreateInvestmentPayload {
  amount: number;
  walletPin: string;
  // The backend may accept additional KYC fields; we pass through everything collected by the modal.
  [key: string]: any;
}

export interface InvestmentRecord {
  id: string;
  name?: string;
  amount: number;
  roiRate?: number;
  tenureMonths?: number;
  status: InvestmentStatus;
  createdAt?: string;
  startDate?: string;
  maturityDate?: string;
  paidOutAt?: string;
  expectedReturn?: number;
  earnedAmount?: number;
  // optionally include transaction references if backend provides them
  walletTransactionId?: string;
  reference?: string;
  [key: string]: any;
}

export interface GetInvestmentsParams {
  page: number;
  limit: number;
  status?: InvestmentStatus;
  sort?: "newest" | "oldest";
}



