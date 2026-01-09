/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllBanks,
  getAllBanksByCurrency,
  changeWalletPinRequest,
  getQrCode,
  decodeQrCodeRequest,
  getTransactions,
  getTransferFee,
  getExchangeRateRequest,
  convertCurrencyRequest,
  initiateBvnVerificationRequest,
  initiateBvnVerificationV2Request,
  initiateTransferRequest,
  validateBvnVerificationRequest,
  verifyAccountRequest,
  bvnVerificationWithSelfieRequest,
  createAccountRequest,
  createMultiCurrencyAccountRequest,
  getWalletAccountsRequest,
  createVirtualCardRequest,
  getVirtualCardDetailsRequest,
  freezeVirtualCardRequest,
  unfreezeVirtualCardRequest,
} from "./wallet.apis";
import {
  BankProps,
  Transaction,
  TRANSACTION_TYPE,
  TRANSACTION_CATEGORY,
  TRANSACTION_STATUS,
} from "@/constants/types";
import type { VirtualCard, WalletAccount, ExchangeRateData, IGetExchangeRate, IConvertCurrency } from "./wallet.types";
import type { DecodedQrCodeData } from "./wallet.types";

export const useInitiateBvnVerification = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: initiateBvnVerificationRequest,
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      onSuccess(data);
    },
  });
};

export const useInitiateBvnVerificationV2 = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  return useMutation({
    mutationFn: initiateBvnVerificationV2Request,
    onError,
    onSuccess,
  });
};

export const useValidateBvnVerification = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: validateBvnVerificationRequest,
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      onSuccess(data);
    },
  });
};

export const useVerifyAccount = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  return useMutation({
    mutationFn: verifyAccountRequest,
    onError,
    onSuccess,
  });
};

export const useInitiateTransfer = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: initiateTransferRequest,
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["get-beneficiaries"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      onSuccess(data);
    },
  });
};

export const useGetAllBanks = (currency: string = "NGN") => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["banks", { currency }],
    queryFn: () => (currency === "NGN" ? getAllBanks() : getAllBanksByCurrency(currency)),
  });

  const banks: BankProps[] = data?.data?.data;

  return { banks, isPending, isError };
};

export const useChangeWalletPin = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  return useMutation({
    mutationFn: changeWalletPinRequest,
    onError,
    onSuccess,
  });
};

export const useGetTransferFee = ({
  currency,
  amount,
  active,
}: {
  currency: string;
  amount: number;
  active: boolean;
}) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["transferFee", { currency, amount, active }],
    queryFn: () => getTransferFee({ currency, amount }),
    enabled: active,
  });

  const fee: number[] = data?.data?.data?.fee;

  return { fee, isPending, isError };
};

export const useGetExchangeRate = (payload: IGetExchangeRate & { enabled?: boolean }) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["exchange-rate", payload],
    queryFn: () => getExchangeRateRequest(payload),
    enabled: payload.enabled !== false && !!payload.currency && payload.amount > 0,
  });

  const rawData = data?.data?.data;
  
  // Transform API response to include computed fields for backward compatibility
  const exchangeRate: ExchangeRateData | undefined = rawData ? {
    ...rawData,
    // Compute rate: recipientAmount / senderAmount
    rate: rawData.senderAmount > 0 ? rawData.recipientAmount / rawData.senderAmount : 0,
    amount: rawData.senderAmount,
    convertedAmount: rawData.recipientAmount,
    fromCurrency: rawData.senderCurrency,
    toCurrency: rawData.recipientCurrency,
  } : undefined;
  
  return { exchangeRate, isPending, isError };
};

export const useConvertCurrency = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IConvertCurrency) => convertCurrencyRequest(payload),
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["walletAccounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      onSuccess(data);
    },
  });
};

export const useGetTransactions = ({
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
  const { data, isPending, isError } = useQuery({
    queryKey: ["transactions", { page, limit, search, type, category, status }],
    queryFn: () =>
      getTransactions({ page, limit, search, type, category, status }),
  });

  const transactionsData: {
    transactions: Transaction[];
    totalCount: number;
    totalPages: number;
    message: string;
    statusCode: number;
  } = data?.data;

  return { transactionsData, isPending, isError };
};

export const useGetQrCode = ({
  amount,
  enabled = true,
}: {
  amount?: number;
  enabled?: boolean;
}) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["qrCode", { amount }],
    queryFn: () => getQrCode({ amount: amount || 0 }),
    enabled: enabled,
  });

  // Backend returns: { message: "...", data: { qrCode: "...", accountNumber: "...", accountName: "...", amount: ..., currency: "..." } }
  const qrCode: string = data?.data?.data?.qrCode || data?.data?.qrCode || "";

  return { qrCode, isPending, isError };
};

export const useDecodeQrCode = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  return useMutation({
    mutationFn: decodeQrCodeRequest,
    onError,
    onSuccess,
  });
};

export const useBvnVerificationWithSelfie = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bvnVerificationWithSelfieRequest,
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      onSuccess(data);
    },
  });
};

export const useCreateAccount = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAccountRequest,
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      onSuccess(data);
    },
  });
};

export const useGetWalletAccounts = () => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["walletAccounts"],
    queryFn: getWalletAccountsRequest,
  });

  const accounts: WalletAccount[] = data?.data?.data;

  return { accounts, isPending, isError, refetch };
};

export const useCreateMultiCurrencyAccount = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMultiCurrencyAccountRequest,
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["walletAccounts"] });
      onSuccess(data);
    },
  });
};

export const useCreateVirtualCard = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createVirtualCardRequest,
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["walletAccounts"] });
      onSuccess(data);
    },
  });
};

export const useGetVirtualCardDetails = ({
  cardId,
  enabled,
}: {
  cardId?: string;
  enabled: boolean;
}) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["virtualCard", cardId],
    queryFn: () => getVirtualCardDetailsRequest(cardId as string),
    enabled: enabled && !!cardId,
  });

  const card: VirtualCard | undefined = data?.data?.data;

  return { card, isPending, isError };
};

export const useFreezeVirtualCard = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cardId: string) => freezeVirtualCardRequest(cardId),
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["virtualCard"] });
      onSuccess(data);
    },
  });
};

export const useUnfreezeVirtualCard = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cardId: string) => unfreezeVirtualCardRequest(cardId),
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["virtualCard"] });
      onSuccess(data);
    },
  });
};
