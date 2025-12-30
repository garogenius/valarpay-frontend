/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  closeSavingsPlanAtMaturityRequest,
  closeSavingsPlanEarlyRequest,
  createSavingsPlanRequest,
  fundSavingsPlanRequest,
  getSavingsPlanDetailsRequest,
  getSavingsPlansRequest,
  getSavingsProductsRequest,
} from "./savings.apis";
import type { ICloseSavingsPlan, ICreateSavingsPlan, IFundSavingsPlan, IGetSavingsPlanDetails } from "./savings.types";

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

  const plans = data?.data?.data || data?.data || data?.plans || [];
  return { plans, isPending, isError, error, refetch };
};

export const useSavingsPlanDetails = (payload: IGetSavingsPlanDetails, enabled = true) => {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["savingsPlanDetails", payload?.planId],
    queryFn: () => getSavingsPlanDetailsRequest(payload),
    enabled: !!payload?.planId && enabled,
    staleTime: 10 * 1000,
    retry: 1,
  });

  const details = data?.data?.data || data?.data || data?.details || {};
  return { details, isPending, isError, error, refetch };
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
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      onSuccess(data);
    },
  });
};

export const useCloseSavingsPlanAtMaturity = (onError: (e: any) => void, onSuccess: (d: any) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICloseSavingsPlan) => closeSavingsPlanAtMaturityRequest(payload),
    onError,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["savingsPlans"] });
      queryClient.invalidateQueries({ queryKey: ["savingsPlanDetails", variables?.planId] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      onSuccess(data);
    },
  });
};

export const useCloseSavingsPlanEarly = (onError: (e: any) => void, onSuccess: (d: any) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICloseSavingsPlan) => closeSavingsPlanEarlyRequest(payload),
    onError,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["savingsPlans"] });
      queryClient.invalidateQueries({ queryKey: ["savingsPlanDetails", variables?.planId] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      onSuccess(data);
    },
  });
};











