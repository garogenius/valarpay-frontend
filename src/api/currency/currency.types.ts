export interface ICurrencyAccount {
  id: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  currency: "USD" | "EUR" | "GBP";
  balance: number;
  label?: string;
  status?: "ACTIVE" | "INACTIVE" | "CLOSED";
  providerAccountId?: string;
}

export interface IUpdateCurrencyAccount {
  label?: string;
}

export interface ICloseCurrencyAccount {
  reason?: string;
}

export interface ICreatePayoutDestination {
  accountName: string;
  accountNumber: string;
  bankName?: string;
  type?: string;
}

export interface ICreatePayout {
  destinationId: string;
  amount: number;
  description?: string;
  walletPin: string;
}

export interface ICurrencyTransaction {
  id: string;
  amount: number;
  transaction_type: "credit" | "debit";
  status: "completed" | "pending" | "failed";
  description?: string;
  reference?: string;
  created_at: string;
}

export interface ICurrencyDeposit {
  id: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  reference?: string;
  created_at: string;
}

export interface ICurrencyPayout {
  id: string;
  amount: number;
  fee?: number;
  status: "completed" | "pending" | "failed";
  description?: string;
  reference?: string;
  created_at: string;
}

export interface IPayoutDestination {
  id: string;
  accountName: string;
  accountNumber: string;
  bankName?: string;
  type?: string;
  created_at: string;
}

export interface IGetCurrencyAccountTransactionsQuery {
  limit?: number;
  offset?: number;
}

export interface IGetCurrencyAccountDepositsQuery {
  limit?: number;
  offset?: number;
}

export interface IGetCurrencyAccountPayoutsQuery {
  limit?: number;
  offset?: number;
}

