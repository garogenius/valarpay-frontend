export interface IInitiateBvnVerification {
  bvn: string;
}

export interface IValidateBvnVerification {
  bvn: string;
  verificationId: string;
  otpCode: string;
}

export interface IBvnVerificationWithSelfie {
  bvn: string;
  selfieImage: string; // base64
  dateOfBirth: string; // DD-MM-YYYY format
}

export interface ICreateAccount {
  bvn: string;
}

// Multi-currency wallet account creation (USD/EUR/GBP)
export type WALLET_PROVIDER = "graph" | "fincra";
export type WALLET_CURRENCY = "NGN" | "USD" | "EUR" | "GBP";

export interface ICreateMultiCurrencyAccount {
  currency: Exclude<WALLET_CURRENCY, "NGN">;
  provider: WALLET_PROVIDER;
}

export interface WalletAccount {
  id: string;
  currency: WALLET_CURRENCY;
  balance: number;
  accountNumber: string;
  accountName?: string;
  bankName?: string;
}

// Virtual USD cards
export interface ICreateVirtualCard {
  walletId: string;
  currency: "USD";
  cardholderName: string;
  provider: WALLET_PROVIDER;
}

export interface VirtualCard {
  cardId: string;
  cardNumber: string;
  cvv: string;
  expiryMonth: string;
  expiryYear: string;
  cardType: string;
  currency: "USD";
  status: string;
}

// FX / currency conversion
export interface IGetExchangeRate {
  fromCurrency: "NGN" | "USD" | "EUR" | "GBP";
  toCurrency: "NGN" | "USD" | "EUR" | "GBP";
  provider?: "graph" | "fincra";
}

export interface ExchangeRateData {
  rate: number;
  fromCurrency: string;
  toCurrency: string;
  timestamp: string;
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
