/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCurrencyAccountRequest,
  getCurrencyAccountsRequest,
  getCurrencyAccountByCurrencyRequest,
  getCurrencyAccountDetailsRequest,
  getCurrencyAccountBalanceRequest,
  updateCurrencyAccountRequest,
  closeCurrencyAccountRequest,
  getCurrencyAccountTransactionsRequest,
  getCurrencyAccountDepositsRequest,
  getCurrencyAccountPayoutsRequest,
  getCurrencyAccountPayoutDestinationsRequest,
  createPayoutDestinationRequest,
  createPayoutRequest,
} from "./currency.apis";
import {
  ICurrencyAccount,
  ICreateCurrencyAccount,
  IUpdateCurrencyAccount,
  ICloseCurrencyAccount,
  ICreatePayoutDestination,
  ICreatePayout,
  IGetCurrencyAccountTransactionsQuery,
  IGetCurrencyAccountDepositsQuery,
  IGetCurrencyAccountPayoutsQuery,
} from "./currency.types";

export const useCreateCurrencyAccount = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateCurrencyAccount) => createCurrencyAccountRequest(data),
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["currency-accounts"] });
      onSuccess(data);
    },
  });
};

export const useGetCurrencyAccounts = () => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["currency-accounts"],
    queryFn: getCurrencyAccountsRequest,
  });

  const accounts: ICurrencyAccount[] = data?.data?.data?.accounts || data?.data?.data || [];

  return { accounts, isPending, isError, refetch };
};

export const useGetCurrencyAccountByCurrency = (currency: "USD" | "EUR" | "GBP") => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["currency-account", currency],
    queryFn: () => getCurrencyAccountByCurrencyRequest(currency),
    enabled: !!currency,
  });

  const account: ICurrencyAccount | undefined = data?.data?.data || data?.data;

  return { account, isPending, isError, refetch };
};

export const useGetCurrencyAccountDetails = (walletId: string, enabled: boolean = true) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["currency-account-details", walletId],
    queryFn: () => getCurrencyAccountDetailsRequest(walletId),
    enabled: enabled && !!walletId,
  });

  const account: ICurrencyAccount | undefined = data?.data?.data;

  return { account, isPending, isError };
};

export const useGetCurrencyAccountBalance = (walletId: string, enabled: boolean = true) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["currency-account-balance", walletId],
    queryFn: () => getCurrencyAccountBalanceRequest(walletId),
    enabled: enabled && !!walletId,
  });

  const balance: number | undefined = data?.data?.data?.balance;

  return { balance, isPending, isError };
};

export const useUpdateCurrencyAccount = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ walletId, data }: { walletId: string; data: IUpdateCurrencyAccount }) =>
      updateCurrencyAccountRequest(walletId, data),
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["currency-account"] });
      queryClient.invalidateQueries({ queryKey: ["currency-accounts"] });
      onSuccess(data);
    },
  });
};

export const useCloseCurrencyAccount = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ walletId }: { walletId: string }) =>
      closeCurrencyAccountRequest(walletId),
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["currency-account"] });
      queryClient.invalidateQueries({ queryKey: ["currency-accounts"] });
      onSuccess(data);
    },
  });
};

export const useGetCurrencyAccountTransactions = (
  currency: "USD" | "EUR" | "GBP",
  query: IGetCurrencyAccountTransactionsQuery
) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["currency-account-transactions", currency, query],
    queryFn: () => getCurrencyAccountTransactionsRequest(currency, query),
    enabled: !!currency,
  });

  const transactions: any[] = data?.data?.data?.transactions || data?.data?.data || [];
  const count: number = data?.data?.data?.count || data?.data?.count || 0;

  return { transactions, count, isPending, isError };
};

export const useGetCurrencyAccountDeposits = (
  currency: "USD" | "EUR" | "GBP",
  query: IGetCurrencyAccountDepositsQuery
) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["currency-account-deposits", currency, query],
    queryFn: () => getCurrencyAccountDepositsRequest(currency, query),
    enabled: !!currency,
  });

  const deposits: any[] = data?.data?.data?.deposits || data?.data?.data || [];
  const count: number = data?.data?.data?.count || data?.data?.count || 0;

  return { deposits, count, isPending, isError };
};

export const useGetCurrencyAccountPayouts = (
  currency: "USD" | "EUR" | "GBP",
  query: IGetCurrencyAccountPayoutsQuery
) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["currency-account-payouts", currency, query],
    queryFn: () => getCurrencyAccountPayoutsRequest(currency, query),
    enabled: !!currency,
  });

  const payouts: any[] = data?.data?.data?.payouts || data?.data?.data || [];
  const count: number = data?.data?.data?.count || data?.data?.count || 0;

  return { payouts, count, isPending, isError };
};

export const useGetCurrencyAccountPayoutDestinations = (currency: "USD" | "EUR" | "GBP") => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["currency-account-payout-destinations", currency],
    queryFn: () => getCurrencyAccountPayoutDestinationsRequest(currency),
    enabled: !!currency,
  });

  const destinations: any[] = data?.data?.data?.destinations || data?.data?.data || [];

  return { destinations, isPending, isError, refetch };
};

export const useCreateCurrencyAccountPayoutDestination = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      currency,
      formdata,
    }: {
      currency: "USD" | "EUR" | "GBP";
      formdata: ICreatePayoutDestination;
    }) => createPayoutDestinationRequest(currency, formdata),
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["currency-account-payout-destinations"] });
      onSuccess(data);
    },
  });
};

export const useCreateCurrencyAccountPayout = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      currency,
      formdata,
    }: {
      currency: "USD" | "EUR" | "GBP";
      formdata: ICreatePayout;
    }) => createPayoutRequest(currency, formdata),
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["currency-account-payouts"] });
      queryClient.invalidateQueries({ queryKey: ["currency-account"] });
      queryClient.invalidateQueries({ queryKey: ["currency-accounts"] });
      onSuccess(data);
    },
  });
};

export const useGetBanksByCurrency = (currency: "USD" | "EUR" | "GBP") => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["banks", currency],
    queryFn: async () => {
      const { getAllBanksByCurrency } = await import("@/api/wallet/wallet.apis");
      return getAllBanksByCurrency(currency);
    },
    enabled: !!currency,
  });

  const banks: Array<{ code: string; name: string }> = data?.data?.data || [];

  return { banks, isPending, isError };
};

export const useGetTransferFee = ({
  currency,
  amount,
  accountNumber,
  enabled = true,
}: {
  currency: "USD" | "EUR" | "GBP";
  amount: number;
  accountNumber: string;
  enabled?: boolean;
}) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["transfer-fee", currency, amount, accountNumber],
    queryFn: async () => {
      const { getTransferFee } = await import("@/api/wallet/wallet.apis");
      return getTransferFee({ currency, amount, accountNumber });
    },
    enabled: enabled && !!currency && amount > 0 && !!accountNumber,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const feeData = (data as any)?.data?.data || { fee: 0 };

  return { feeData, isPending, isError };
};


