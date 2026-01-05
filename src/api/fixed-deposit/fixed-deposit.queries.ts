/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getFixedDepositPlansRequest,
  createFixedDepositRequest,
  getMyFixedDepositsRequest,
  getFixedDepositDetailsRequest,
  payoutFixedDepositRequest,
  withdrawFixedDepositEarlyRequest,
  rolloverFixedDepositRequest,
} from "./fixed-deposit.apis";
import type {
  ICreateFixedDeposit,
  IPayoutFixedDeposit,
  IEarlyWithdrawFixedDeposit,
  IRolloverFixedDeposit,
} from "./fixed-deposit.types";

export const useFixedDepositPlans = () => {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["fixedDepositPlans"],
    queryFn: getFixedDepositPlansRequest,
    staleTime: 60 * 1000,
    retry: 1,
  });

  // Handle new API structure: { message: "...", data: [...] }
  const plans = data?.data?.data || data?.data || [];
  return { plans, isPending, isError, error, refetch };
};

export const useMyFixedDeposits = () => {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["myFixedDeposits"],
    queryFn: getMyFixedDepositsRequest,
    staleTime: 15 * 1000,
    retry: 1,
  });

  // Handle new API structure: { message: "...", data: [...] }
  const deposits = data?.data?.data || data?.data || [];
  return { deposits, isPending, isError, error, refetch };
};

export const useGetFixedDepositById = (id: string | null, enabled = true) => {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["fixedDepositDetails", id],
    queryFn: () => getFixedDepositDetailsRequest(id!),
    enabled: !!id && enabled,
    staleTime: 10 * 1000,
    retry: 1,
  });

  // Handle new API structure: { message: "...", data: {...} }
  const fixedDeposit = data?.data?.data || data?.data || {};
  return { fixedDeposit, isPending, isError, error, refetch };
};

export const useFixedDepositDetails = (id: string, enabled = true) => {
  return useGetFixedDepositById(id, enabled);
};

export const useCreateFixedDeposit = (onError: (e: any) => void, onSuccess: (d: any) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICreateFixedDeposit) => createFixedDepositRequest(payload),
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["myFixedDeposits"] });
      queryClient.invalidateQueries({ queryKey: ["fixedDepositPlans"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["walletAccounts"] });
      onSuccess(data);
    },
  });
};

export const usePayoutFixedDeposit = (onError: (e: any) => void, onSuccess: (d: any) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IPayoutFixedDeposit) => payoutFixedDepositRequest(payload),
    onError,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["myFixedDeposits"] });
      queryClient.invalidateQueries({ queryKey: ["fixedDepositDetails", variables?.fixedDepositId] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["walletAccounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      onSuccess(data);
    },
  });
};

export const useEarlyWithdrawFixedDeposit = (onError: (e: any) => void, onSuccess: (d: any) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IEarlyWithdrawFixedDeposit) => withdrawFixedDepositEarlyRequest(payload),
    onError,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["myFixedDeposits"] });
      queryClient.invalidateQueries({ queryKey: ["fixedDepositDetails", variables?.fixedDepositId] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["walletAccounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      onSuccess(data);
    },
  });
};

export const useRolloverFixedDeposit = (onError: (e: any) => void, onSuccess: (d: any) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IRolloverFixedDeposit) => rolloverFixedDepositRequest(payload),
    onError,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["myFixedDeposits"] });
      queryClient.invalidateQueries({ queryKey: ["fixedDepositDetails", variables?.fixedDepositId] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["walletAccounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      onSuccess(data);
    },
  });
};
