import { request } from "@/utils/axios-utils";
import {
  IInitiateBvnVerification,
  IInitiateTransfer,
  IValidateBvnVerification,
  IVerifyAccount,
  IBvnVerificationWithSelfie,
  ICreateAccount,
  IChangeWalletPin,
  ICreateMultiCurrencyAccount,
  ICreateVirtualCard,
  IDecodeQrCode,
  IGetExchangeRate,
  IConvertCurrency,
} from "./wallet.types";
import {
  TRANSACTION_CATEGORY,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
} from "@/constants/types";

export const initiateBvnVerificationRequest = async (
  formdata: IInitiateBvnVerification
) => {
  return request({
    url: "/wallet/initiate-bvn-verification",
    method: "post",
    data: formdata,
  });
};

export const validateBvnVerificationRequest = async (
  formdata: IValidateBvnVerification
) => {
  return request({
    url: "/wallet/validate-bvn-verification",
    method: "post",
    data: formdata,
  });
};

export const verifyAccountRequest = async (formdata: IVerifyAccount) => {
  return request({
    url: "/wallet/verify-account",
    method: "post",
    data: formdata,
  });
};

export const initiateTransferRequest = async (formdata: IInitiateTransfer) => {
  return request({
    url: "/wallet/initiate-transfer",
    method: "post",
    data: formdata,
  });
};

export const getAllBanks = () => {
  return request({ url: `/wallet/get-banks/NGN` });
};

export const getAllBanksByCurrency = (currency: string) => {
  return request({ url: `/wallet/get-banks/${currency}` });
};

export const changeWalletPinRequest = async (formdata: IChangeWalletPin) => {
  return request({
    url: "/wallet/change-pin",
    method: "put",
    data: formdata,
  });
};

export const getTransferFee = ({
  currency,
  amount,
  accountNumber,
}: {
  currency: string;
  amount: number;
  accountNumber?: string;
}) => {
  const queryParams = new URLSearchParams();
  queryParams.set("currency", currency);
  queryParams.set("amount", amount.toString());
  if (accountNumber) queryParams.set("accountNumber", accountNumber);
  return request({
    url: `/wallet/get-transfer-fee?${queryParams.toString()}`,
  });
};

export const getMatchedBanksByAccountNumber = (accountNumber: string) => {
  return request({
    url: `/wallet/get-matched-banks/${accountNumber}`,
    method: "get",
  });
};

export const getExchangeRateRequest = async ({
  fromCurrency,
  toCurrency,
  provider,
}: IGetExchangeRate) => {
  const query = new URLSearchParams();
  query.set("fromCurrency", fromCurrency);
  query.set("toCurrency", toCurrency);
  if (provider) query.set("provider", provider);
  return request({
    url: `/wallet/exchange-rate?${query.toString()}`,
    method: "get",
  });
};

export const convertCurrencyRequest = async ({
  amount,
  fromCurrency,
  toCurrency,
  walletPin,
}: IConvertCurrency) => {
  return request({
    url: `/wallet/convert-currency`,
    method: "post",
    data: { amount, fromCurrency, toCurrency, walletPin },
  });
};

export const getTransactions = ({
  page,
  limit,
  search,
  type,
  category,
  status,
}: {
  page: number;
  limit: number;
  search?: string;
  type?: TRANSACTION_TYPE;
  category?: TRANSACTION_CATEGORY;
  status?: TRANSACTION_STATUS;
}) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", page.toString());
  queryParams.set("limit", limit.toString());
  if (search) queryParams.set("search", search);
  if (type) queryParams.set("type", type);
  if (category) queryParams.set("category", category);
  if (status) queryParams.set("status", status);
  return request({
    url: `/wallet/transaction?${queryParams.toString()}`,
  });
};

export const getQrCode = ({ amount }: { amount: number }) => {
  return request({
    url: `/wallet/generate-qrcode${amount ? `?amount=${amount}` : ""}`,
  });
};

export const decodeQrCodeRequest = async (formdata: IDecodeQrCode) => {
  return request({
    url: "/wallet/decode-qrcode",
    method: "post",
    data: formdata,
  });
};

export const bvnVerificationWithSelfieRequest = async (
  formdata: IBvnVerificationWithSelfie
) => {
  return request({
    url: "/wallet/bvn-verification",
    method: "post",
    data: formdata,
  });
};

export const initiateBvnVerificationV2Request = async (
  formdata: IInitiateBvnVerification
) => {
  return request({
    url: "/wallet/initiate-bvn-verification",
    method: "post",
    data: formdata,
  });
};

export const createAccountRequest = async (formdata: ICreateAccount) => {
  return request({
    url: "/user/create-account",
    method: "post",
    data: formdata,
  });
};

export const getWalletAccountsRequest = () => {
  return request({
    url: "/wallet/accounts",
  });
};

export const getGraphAccountsRequest = () => {
  return request({
    url: "/wallet/accounts/graph",
    method: "get",
  });
};

export const updateGraphAccountRequest = async (
  walletId: string,
  data: any
) => {
  return request({
    url: `/wallet/account/${walletId}`,
    method: "patch",
    data,
  });
};

export const closeGraphAccountRequest = async (walletId: string) => {
  return request({
    url: `/wallet/account/${walletId}`,
    method: "delete",
  });
};

export const createMockDepositRequest = async (data: any) => {
  return request({
    url: "/wallet/account/mock-deposit",
    method: "post",
    data,
  });
};

export const getPersonDetailsRequest = () => {
  return request({
    url: "/wallet/person/details",
    method: "get",
  });
};

export const updatePersonDetailsRequest = async (data: any) => {
  return request({
    url: "/wallet/person/update",
    method: "patch",
    data,
  });
};

export const createMultiCurrencyAccountRequest = async (
  formdata: ICreateMultiCurrencyAccount
) => {
  return request({
    url: "/wallet/create-account",
    method: "post",
    data: formdata,
  });
};

export const createVirtualCardRequest = async (formdata: ICreateVirtualCard) => {
  return request({
    url: "/wallet/virtual-card/create",
    method: "post",
    data: formdata,
  });
};

export const getVirtualCardDetailsRequest = ({
  cardId,
  provider,
}: {
  cardId: string;
  provider?: string;
}) => {
  const queryParams = new URLSearchParams();
  if (provider) queryParams.set("provider", provider);
  return request({
    url: `/wallet/virtual-card/${cardId}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`,
  });
};

export const freezeVirtualCardRequest = ({
  cardId,
  provider,
}: {
  cardId: string;
  provider?: string;
}) => {
  const queryParams = new URLSearchParams();
  if (provider) queryParams.set("provider", provider);
  return request({
    url: `/wallet/virtual-card/${cardId}/freeze${queryParams.toString() ? `?${queryParams.toString()}` : ""}`,
    method: "post",
  });
};

export const unfreezeVirtualCardRequest = ({
  cardId,
  provider,
}: {
  cardId: string;
  provider?: string;
}) => {
  const queryParams = new URLSearchParams();
  if (provider) queryParams.set("provider", provider);
  return request({
    url: `/wallet/virtual-card/${cardId}/unfreeze${queryParams.toString() ? `?${queryParams.toString()}` : ""}`,
    method: "post",
  });
};
