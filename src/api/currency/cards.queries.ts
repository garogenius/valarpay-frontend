/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCardRequest,
  getCardsRequest,
  getCardByIdRequest,
  updateCardRequest,
  blockCardRequest,
  closeCardRequest,
  freezeCardRequest,
  fundCardRequest,
  withdrawCardRequest,
  setCardLimitsRequest,
  getCardTransactionsRequest,
  updateCardSecureSettingsRequest,
} from "./cards.apis";
import type {
  ICreateCardPayload,
  IUpdateCardPayload,
  IBlockCardPayload,
  ICloseCardPayload,
  IFundCardPayload,
  IWithdrawCardPayload,
  ISetCardLimitsPayload,
  IGetCardTransactionsQuery,
  IVirtualCard,
  ICardTransaction,
} from "./cards.types";

// Create card
export const useCreateCard = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICreateCardPayload) => createCardRequest(payload),
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      queryClient.invalidateQueries({ queryKey: ["currency-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      onSuccess(data);
    },
  });
};

// Get all cards
export const useGetCards = () => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["cards"],
    queryFn: getCardsRequest,
  });

  const responseData = data?.data?.data ?? data?.data ?? [];
  const cards: IVirtualCard[] = Array.isArray(responseData)
    ? (responseData as any)
    : (responseData?.cards ?? responseData?.data ?? []);
  const count: number = Array.isArray(responseData)
    ? cards.length
    : (responseData?.count ?? cards.length);

  return { cards, count, isPending, isError, refetch };
};

// Get card by ID
export const useGetCardById = (cardId: string, enabled: boolean = true) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["card", cardId],
    queryFn: () => getCardByIdRequest(cardId),
    enabled: enabled && !!cardId,
  });

  const card: IVirtualCard | undefined = data?.data?.data || data?.data;

  return { card, isPending, isError };
};

// Update card
export const useUpdateCard = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cardId, data }: { cardId: string; data: IUpdateCardPayload }) =>
      updateCardRequest(cardId, data),
    onError,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      queryClient.invalidateQueries({ queryKey: ["card", variables.cardId] });
      onSuccess(data);
    },
  });
};

// Block card
export const useBlockCard = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cardId, data }: { cardId: string; data: IBlockCardPayload }) =>
      blockCardRequest(cardId, data),
    onError,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      queryClient.invalidateQueries({ queryKey: ["card", variables.cardId] });
      onSuccess(data);
    },
  });
};

// Close card
export const useCloseCard = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cardId, data }: { cardId: string; data: ICloseCardPayload }) =>
      closeCardRequest(cardId, data),
    onError,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      queryClient.invalidateQueries({ queryKey: ["card", variables.cardId] });
      queryClient.invalidateQueries({ queryKey: ["currency-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      onSuccess(data);
    },
  });
};

// Freeze/unfreeze card
export const useFreezeCard = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cardId, freeze }: { cardId: string; freeze: boolean }) =>
      freezeCardRequest(cardId, freeze),
    onError,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      queryClient.invalidateQueries({ queryKey: ["card", variables.cardId] });
      onSuccess(data);
    },
  });
};

// Update card secure settings
export const useUpdateCardSecureSettings = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cardId, data }: { cardId: string; data: Record<string, any> }) =>
      updateCardSecureSettingsRequest(cardId, data),
    onError,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      queryClient.invalidateQueries({ queryKey: ["card", variables.cardId] });
      onSuccess(data);
    },
  });
};

// Fund card
export const useFundCard = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cardId, data }: { cardId: string; data: IFundCardPayload }) =>
      fundCardRequest(cardId, data),
    onError,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      queryClient.invalidateQueries({ queryKey: ["card", variables.cardId] });
      queryClient.invalidateQueries({ queryKey: ["currency-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      onSuccess(data);
    },
  });
};

// Withdraw from card
export const useWithdrawCard = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cardId, data }: { cardId: string; data: IWithdrawCardPayload }) =>
      withdrawCardRequest(cardId, data),
    onError,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      queryClient.invalidateQueries({ queryKey: ["card", variables.cardId] });
      queryClient.invalidateQueries({ queryKey: ["currency-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      onSuccess(data);
    },
  });
};

// Set card limits
export const useSetCardLimits = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cardId, data }: { cardId: string; data: ISetCardLimitsPayload }) =>
      setCardLimitsRequest(cardId, data),
    onError,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      queryClient.invalidateQueries({ queryKey: ["card", variables.cardId] });
      onSuccess(data);
    },
  });
};

// Get card transactions
export const useGetCardTransactions = (cardId: string, query: IGetCardTransactionsQuery) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["card-transactions", cardId, query],
    queryFn: () => getCardTransactionsRequest(cardId, query),
    enabled: !!cardId,
  });

  const responseData = data?.data || data;
  const transactions: ICardTransaction[] = responseData?.transactions || responseData?.data || [];
  const count: number = responseData?.count || transactions.length;
  const limit: number = responseData?.limit || query.limit || 50;
  const offset: number = responseData?.offset || query.offset || 0;

  return { transactions, count, limit, offset, isPending, isError };
};
































