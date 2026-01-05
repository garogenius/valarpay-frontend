/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSavingsPlanRequest,
  fundSavingsPlanRequest,
  getSavingsPlanDetailsRequest,
  getSavingsPlansRequest,
  getSavingsProductsRequest,
  withdrawSavingsPlanRequest,
} from "./savings.apis";
import type { ICreateSavingsPlan, IFundSavingsPlan, IGetSavingsPlanDetails, IWithdrawSavingsPlan } from "./savings.types";

export const useSavingsProducts = () => {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["savingsProducts"],
    queryFn: getSavingsProductsRequest,
    staleTime: 60 * 1000,
    retry: 1,
  });

  const products = data?.data?.data || data?.data || data?.products || [];
  return { products, isPending, isError, error, refetch };
};

export const useSavingsPlans = () => {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["savingsPlans"],
    queryFn: getSavingsPlansRequest,
    staleTime: 15 * 1000,
    retry: 1,
  });

  // Handle new API structure: { message: "...", data: [...] }
  const plans = data?.data?.data || data?.data || data?.plans || [];
  return { plans, isPending, isError, error, refetch };
};

export const useGetSavingsPlanById = (planId: string | number | null, enabled = true) => {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["savingsPlanDetails", planId],
    queryFn: () => getSavingsPlanDetailsRequest({ planId: planId! }),
    enabled: !!planId && enabled,
    staleTime: 10 * 1000,
    retry: 1,
  });

  // Handle new API structure: { message: "...", data: {...} }
  const plan = data?.data?.data || data?.data || {};
  return { plan, isPending, isError, error, refetch };
};

export const useSavingsPlanDetails = (payload: IGetSavingsPlanDetails, enabled = true) => {
  return useGetSavingsPlanById(payload.planId, enabled);
};

export const useCreateSavingsPlan = (onError: (e: any) => void, onSuccess: (d: any) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICreateSavingsPlan) => createSavingsPlanRequest(payload),
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["savingsPlans"] });
      queryClient.invalidateQueries({ queryKey: ["savingsProducts"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["walletAccounts"] });
      onSuccess(data);
    },
  });
};

export const useFundSavingsPlan = (onError: (e: any) => void, onSuccess: (d: any) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IFundSavingsPlan) => fundSavingsPlanRequest(payload),
    onError,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["savingsPlans"] });
      queryClient.invalidateQueries({ queryKey: ["savingsPlanDetails", variables?.planId] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["walletAccounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      onSuccess(data);
    },
  });
};

export const useWithdrawSavingsPlan = (onError: (e: any) => void, onSuccess: (d: any) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IWithdrawSavingsPlan) => withdrawSavingsPlanRequest(payload),
    onError,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["savingsPlans"] });
      queryClient.invalidateQueries({ queryKey: ["savingsPlanDetails", variables?.planId] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["walletAccounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      onSuccess(data);
    },
  });
};
