export interface IInitiateBvnVerification {
  bvn: string;
}

export interface IValidateBvnVerification {
  bvn: string;
  verificationId: string;
  otpCode: string;
  isBusiness?: boolean;
}

export interface IBvnVerificationWithSelfie {
  bvn: string;
  selfieImage: string; // base64 data:image/jpeg;base64,...
  dateOfBirth?: string;
}

export interface ICreateAccount {
  bvn: string;
}

// Multi-currency wallet account creation (USD/EUR/GBP)
export type WALLET_PROVIDER = "graph" | "fincra";
export type WALLET_CURRENCY = "NGN" | "USD" | "EUR" | "GBP";

export interface ICreateMultiCurrencyAccount {
  currency: Exclude<WALLET_CURRENCY, "NGN">;
  label?: string; // Optional label for account identification
  provider?: WALLET_PROVIDER; // Optional - stripped by API function before sending
}

export interface WalletAccount {
  id: string;
  currency: WALLET_CURRENCY;
  balance: number;
  accountNumber: string;
  accountName?: string;
  bankName?: string;
}

// Virtual multi-currency cards (USD, GBP, EUR, NGN)
export interface ICreateVirtualCard {
  walletId: string;
  currency: "USD" | "GBP" | "EUR" | "NGN";
  cardholderName: string;
}

export interface VirtualCard {
  cardId: string;
  cardNumber: string;
  cvv: string;
  expiryMonth: string;
  expiryYear: string;
  cardType: "virtual";
  currency: "USD" | "GBP" | "EUR" | "NGN";
  status: "active" | "frozen" | "blocked" | "closed";
}

// FX / currency conversion
export interface IGetExchangeRate {
  amount: number;
  currency: "USD" | "EUR" | "GBP";
}

export interface ExchangeRateData {
  senderCurrency: string;
  senderAmount: number;
  recipientCurrency: string;
  recipientAmount: number;
  // Computed fields (for backward compatibility)
  rate?: number;
  amount?: number;
  convertedAmount?: number;
  fromCurrency?: string;
  toCurrency?: string;
}

export interface IConvertCurrency {
  amount: number;
  fromCurrency: "NGN" | "USD" | "EUR" | "GBP";
  toCurrency: "NGN" | "USD" | "EUR" | "GBP";
  walletPin: string;
}

// QR Code decode
export interface IDecodeQrCode {
  qrCode: string; // data:image/png;base64,...
}

export interface DecodedQrCodeData {
  bankCode: string;
  accountNumber: string;
  currency: string;
  amount: string;
}

export interface IVerifyAccount {
  accountNumber: string;
  bankCode?: string;
}

export interface IInitiateTransfer {
  accountNumber: string;
  accountName: string;
  sessionId: string;
  bankCode: string;
  amount: number;
  description?: string;
  currency: string;
  walletPin: string;
  addBeneficiary?: boolean;
}

export interface IChangeWalletPin {
  oldPin: string;
  newPin: string;
}
