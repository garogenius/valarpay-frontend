export type InvestmentStatus = "PENDING" | "ACTIVE" | "MATURED" | "PAID_OUT" | "CANCELLED";

export interface InvestmentProduct {
  id?: string;
  name: string;
  description?: string;
  minimumInvestmentAmount: number;
  minimumAmount?: number; // Support both field names
  roiRate: number; // percent (e.g. 0.1 for 10%)
  tenureMonths: number;
  capitalGuaranteed?: boolean;
  repaymentStructure?: string;
  features?: string[];
}

export interface CreateInvestmentPayload {
  amount: number;
  currency: string;
  agreementReference?: string;
  legalDocumentUrl?: string;
  walletPin?: string; // For PIN verification if needed
  [key: string]: any;
}

export interface InvestmentRecord {
  id: string;
  userId?: string;
  walletId?: string;
  name?: string;
  investmentAmount?: number;
  amount?: number; // Support both field names
  currency?: string;
  roiRate?: number;
  tenureMonths?: number;
  expectedReturn?: number;
  capitalAmount?: number;
  interestAmount?: number;
  status: InvestmentStatus;
  agreementReference?: string;
  agreementStatus?: string;
  legalDocumentUrl?: string | null;
  startDate?: string;
  maturityDate?: string;
  payoutDate?: string | null;
  paidOutAt?: string;
  earnedAmount?: number;
  createdAt?: string;
  updatedAt?: string;
  // Transaction data from backend
  transaction?: {
    id: string;
    transactionRef?: string;
    amount: number;
    type: string;
    status: string;
    createdAt: string;
    description?: string;
  };
  transactionId?: string;
  // optionally include transaction references if backend provides them
  walletTransactionId?: string;
  reference?: string;
  [key: string]: any;
}

export interface PayoutInvestmentPayload {
  investmentId: string;
  formdata?: {
    walletPin: string;
  };
  walletPin?: string;
}

export interface GetInvestmentsParams {
  page: number;
  limit: number;
  status?: InvestmentStatus;
  sort?: "newest" | "oldest";
}



