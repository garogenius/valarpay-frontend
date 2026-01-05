/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fundBettingPlatformRequest,
  fundBettingWalletRequest,
  getBettingPlatformsRequest,
  getBettingWalletRequest,
  getBettingWalletTransactionsRequest,
  getBettingTransactionsRequest,
  withdrawBettingWalletRequest,
  queryBettingTransactionRequest,
} from "./betting.apis";
import type {
  BettingPlatform,
  BettingTransaction,
  BettingWallet,
  IFundBettingPlatform,
  IFundBettingWallet,
  IWithdrawBettingWallet,
} from "./betting.types";

export const useGetBettingPlatforms = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["betting-platforms"],
    queryFn: getBettingPlatformsRequest,
  });
  const platforms: BettingPlatform[] = data?.data?.data ?? [];
  return { platforms, isPending, isError };
};

export const useGetBettingWallet = () => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["betting-wallet"],
    queryFn: getBettingWalletRequest,
  });
  const wallet: BettingWallet | null = data?.data?.data ?? null;
  return { data, wallet, isPending, isError, refetch };
};

export const useGetBettingWalletTransactions = ({ limit = 20 }: { limit?: number }) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["betting-wallet-transactions", { limit }],
    queryFn: () => getBettingWalletTransactionsRequest({ limit }),
  });
  const transactions: BettingTransaction[] = data?.data?.data ?? [];
  return { transactions, isPending, isError };
};

export const useGetBettingTransactions = (params: {
  type?: "FUND" | "WITHDRAW";
  status?: "PENDING" | "PROCESSING" | "SUCCESS" | "FAILED" | "CANCELLED";
  platform?: string;
  page?: number;
  limit?: number;
}) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["betting-transactions", params],
    queryFn: () => getBettingTransactionsRequest(params),
  });
  const transactions: BettingTransaction[] = data?.data?.data ?? [];
  const meta = data?.data?.meta;
  return { transactions, meta, isPending, isError };
};

export const useFundBettingPlatform = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IFundBettingPlatform) => fundBettingPlatformRequest(payload),
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["betting-wallet"] });
      queryClient.invalidateQueries({ queryKey: ["betting-wallet-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      onSuccess(data);
    },
  });
};

export const useFundBettingWallet = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IFundBettingWallet) => fundBettingWalletRequest(payload),
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["betting-wallet"] });
      queryClient.invalidateQueries({ queryKey: ["betting-wallet-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      onSuccess(data);
    },
  });
};

export const useWithdrawBettingWallet = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IWithdrawBettingWallet) => withdrawBettingWalletRequest(payload),
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["betting-wallet"] });
      queryClient.invalidateQueries({ queryKey: ["betting-wallet-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      onSuccess(data);
    },
  });
};


















