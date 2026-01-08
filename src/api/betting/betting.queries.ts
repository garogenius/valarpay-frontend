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
  placeBetRequest,
  getBetsRequest,
  getBetByIdRequest,
} from "./betting.apis";
import type {
  BettingPlatform,
  BettingTransaction,
  BettingWallet,
  IFundBettingPlatform,
  IFundBettingWallet,
  IWithdrawBettingWallet,
  Bet,
  IPlaceBet,
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
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["betting-wallet-transactions", { limit }],
    queryFn: () => getBettingWalletTransactionsRequest({ limit }),
  });
  const transactions: BettingTransaction[] = data?.data?.data ?? [];
  return { transactions, isPending, isError, refetch };
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

export const useQueryBettingTransaction = (orderReference: string | null) => {
  return useQuery({
    queryKey: ["betting-transaction-query", orderReference],
    queryFn: () => queryBettingTransactionRequest({ orderReference: orderReference! }),
    enabled: !!orderReference,
    refetchInterval: (query) => {
      const data = query.state.data?.data?.data;
      // Poll every 3 seconds if status is PENDING or PROCESSING
      if (data?.status === "PENDING" || data?.status === "PROCESSING") {
        return 3000;
      }
      return false;
    },
  });
};

export const useGetBets = (params: {
  status?: "PENDING" | "WON" | "LOST" | "CANCELLED" | "REFUNDED";
  betType?: "SINGLE" | "MULTIPLE" | "SYSTEM";
  page?: number;
  limit?: number;
}) => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["betting-bets", params],
    queryFn: () => getBetsRequest(params),
  });
  const bets: Bet[] = data?.data?.data ?? [];
  const meta = data?.data?.meta;
  return { bets, meta, isPending, isError, refetch };
};

export const useGetBetById = (betId: string | null) => {
  return useQuery({
    queryKey: ["betting-bet", betId],
    queryFn: () => getBetByIdRequest(betId!),
    enabled: !!betId,
  });
};

export const usePlaceBet = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IPlaceBet) => placeBetRequest(payload),
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["betting-wallet"] });
      queryClient.invalidateQueries({ queryKey: ["betting-bets"] });
      queryClient.invalidateQueries({ queryKey: ["betting-wallet-transactions"] });
      onSuccess(data);
    },
  });
};


















