/* eslint-disable @typescript-eslint/no-explicit-any */

export enum CURRENCY {
  NGN = "NGN",
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
}

export enum ACCOUNT_TYPE {
  PERSONAL = "PERSONAL",
  BUSINESS = "BUSINESS",
}

export enum SCAM_TICKET_STATUS {
  opened = "opened",
  closed = "closed",
}

export enum USER_ACCOUNT_STATUS {
  active = "active",
  restricted = "restricted",
  frozen = "frozen",
}

export enum USER_ROLE {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum TIER_LEVEL {
  notSet = "notSet",
  one = "one",
  two = "two",
  three = "three",
}

export interface User {
  id: string;
  email: string;
  username: string;
  fullname: string;
  createdAt: string;
  updatedAt: string;
  currency: CURRENCY;
  businessName: string | null;
  isBusiness: boolean | null;
  phoneNumber: string | null;
  isPasscodeSet: boolean;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  isBvnVerified: boolean;
  isNinVerified: boolean;
  nin: string | null;
  selfieBase64Image: string | null;
  accountType: ACCOUNT_TYPE;
  isWalletPinSet: boolean;
  profileImageFilename: string | null;
  profileImageUrl: string | null;
  referralCode: string | null;
  dateOfBirth: string | null;
  status: USER_ACCOUNT_STATUS;
  role: USER_ROLE;
  dailyCummulativeTransactionLimit: number;
  cummulativeBalanceLimit: number;
  tierLevel: TIER_LEVEL;
  wallet?: Wallet[];
  scamTicket?: ScamTicket[];
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: CURRENCY;
  accountNumber: string;
  accountName: string | null;
  bankName: string | null;
  bankCode: string | null;
  createdAt: string;
  updatedAt: string;
  accountRef: string | null;
  user: User;
  transactions?: Transaction[]; // You might need to create a Transaction interface
}

export interface ScamTicket {
  id: string;
  userId: string;
  ref_number: number;
  title: string;
  screenshotImageUrl: string;
  status: SCAM_TICKET_STATUS;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export enum TRANSACTION_TYPE {
  DEBIT = "DEBIT",
  CREDIT = "CREDIT",
}

export enum TRANSACTION_STATUS {
  pending = "pending",
  success = "success",
  failed = "failed",
}

export enum TRANSACTION_CATEGORY {
  TRANSFER = "TRANSFER",
  DEPOSIT = "DEPOSIT",
  BILL_PAYMENT = "BILL_PAYMENT",
}

export interface Transaction {
  id: string;
  walletId: string;
  transactionRef: string | null;
  type: TRANSACTION_TYPE;
  category: TRANSACTION_CATEGORY;
  currency: string;
  status: TRANSACTION_STATUS;
  description: string | null;
  previousBalance: number;
  currentBalance: number;
  reference: string | null;
  billDetails: any | null;
  transferDetails: any | null;
  depositDetails: any | null;
  createdAt: string;
  updatedAt: string;
  wallet: Wallet;
}

export interface BankProps {
  name: string;
  routingKey: string;
  logoImage: string | null;
  bankCode: string;
  categoryId: string;
  nubanCode: string | null;
}

export interface LineStatsProps {
  id: number;
  date: string;
  credits: number;
  debits: number;
}

export interface PieStatsProps {
  id: number;
  title: string;
  value: number;
  color: string;
}

export interface NetworkPlan {
  id: string;
  network: string;
  planName: string;
  countryISOCode: string;
  operatorId: number;
  createdAt: string; // ISO 8601 date format
  updatedAt: string; // ISO 8601 date format
}

export interface CablePlan {
  id: string;
  planName: string;
  countryISOCode: string;
  billerCode: string;
  description: string;
  shortName: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface CableVariationProps {
  id: number;
  biller_code: string;
  name: string;
  default_commission: number;
  date_added: string; // ISO date string
  country: string;
  is_airtime: boolean;
  biller_name: string;
  item_code: string;
  short_name: string;
  fee: number;
  commission_on_fee: boolean;
  reg_expression: string;
  label_name: string;
  amount: number;
  is_resolvable: boolean;
  group_name: string;
  category_name: string;
  is_data: boolean | null;
  default_commission_on_amount: number | null;
  commission_on_fee_or_amount: number;
  validity_period: string; // Assuming this is always a string
  payAmount: number;
}

export interface ElectricityPlan {
  id: string;
  planName: string;
  countryISOCode: string;
  billerCode: string;
  description: string;
  shortName: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface ElectricityVariationProps {
  id: number;
  biller_code: string;
  name: string;
  default_commission: number;
  date_added: string; // ISO date string
  country: string;
  is_airtime: boolean;
  biller_name: string;
  item_code: string;
  short_name: string;
  fee: number;
  commission_on_fee: boolean;
  reg_expression: string;
  label_name: string;
  amount: number;
  is_resolvable: boolean;
  group_name: string;
  category_name: string;
  is_data: boolean | null;
  default_commission_on_amount: number | null;
  commission_on_fee_or_amount: number;
  validity_period: string; // Assuming this is always a string
  payAmount: number;
}

export interface InternetPlan {
  id: string;
  planName: string;
  countryISOCode: string;
  billerCode: string;
  description: string;
  shortName: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface InternetVariationProps {
  id: number;
  biller_code: string;
  name: string;
  default_commission: number;
  date_added: string; // ISO date string
  country: string;
  is_airtime: boolean;
  biller_name: string;
  item_code: string;
  short_name: string;
  fee: number;
  commission_on_fee: boolean;
  reg_expression: string;
  label_name: string;
  amount: number;
  is_resolvable: boolean;
  group_name: string;
  category_name: string;
  is_data: boolean | null;
  default_commission_on_amount: number | null;
  commission_on_fee_or_amount: number;
  validity_period: string; // Assuming this is always a string
  payAmount: number;
}

export enum NETWORK {
  mtn = "mtn",
  airtel = "airtel",
  etisalat = "etisalat",
  glo = "glo",
}

export enum BILL_TYPE {
  DATA = "data",
  AIRTIME = "airtime",
  CABLE = "cable",
  ELECTRICITY = "electricity",
  INTERNET = "internet",
  INTERNATIONAL_AIRTIME = "internationalAirtime",
  TRANSPORT = "transport",
  SCHOOL_FEE = "schoolFee",
  GIFTCARD = "giftcard",
}

export enum BENEFICIARY_TYPE {
  TRANSFER = "TRANSFER",
  BILL = "BILL",
}

export enum TRANSFER_TYPE {
  INTRA = "intra",
  INTER = "inter",
}

export interface BeneficiaryProps {
  id: string;
  userId: string;
  type: BENEFICIARY_TYPE;
  bankName?: string;
  bankCode?: string;
  accountNumber?: string;
  accountName?: string;
  network?: NETWORK;
  billerNumber?: string;
  operatorId?: number;
  billerCode?: string;
  itemCode?: string;
  currency?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GiftCardCategory {
  id: string;
  name: string;
}

export interface GiftCardProduct {
  productId: number;
  productName: string;
  global: boolean;
  status: "ACTIVE" | "INACTIVE";
  supportsPreOrder: boolean;
  senderFee: number;
  senderFeePercentage: number;
  discountPercentage: number;
  denominationType: "FIXED" | "RANGE";
  recipientCurrencyCode: string;
  minRecipientDenomination?: number;
  maxRecipientDenomination?: number;
  senderCurrencyCode: string;
  minSenderDenomination?: number;
  maxSenderDenomination?: number;
  fixedRecipientDenominations: number[];
  fixedSenderDenominations: number[] | null;
  fixedRecipientToSenderDenominationsMap: Record<string, number> | null;
  metadata: any | null;
  logoUrls: string[];
  brand: {
    brandId: number;
    brandName: string;
  };
  category: {
    id: number;
    name: string;
  };
  country: {
    isoName: string;
    name: string;
    flagUrl: string;
  };
  redeemInstruction: {
    concise: string;
    verbose: string;
  };
  additionalRequirements: {
    userIdRequired: boolean;
  };
  fixedRecipientToPayAmount: Record<string, number>;
}

export interface GiftCardPriceDetail {
  price: number;
  amount: number;
  fee: number;
}

export interface GiftCardDetails {
  product: GiftCardProduct;
  currency: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}
