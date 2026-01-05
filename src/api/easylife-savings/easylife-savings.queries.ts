/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getEasyLifeProductRequest,
  createEasyLifePlanRequest,
  getEasyLifePlansRequest,
  getEasyLifePlanDetailsRequest,
  fundEasyLifePlanRequest,
  withdrawEasyLifePlanRequest,
} from "./easylife-savings.apis";
import type {
  ICreateEasyLifePlan,
  IGetEasyLifePlanDetails,
  IFundEasyLifePlan,
  IWithdrawEasyLifePlan,
} from "./easylife-savings.types";

export const useEasyLifeProduct = () => {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["easyLifeProduct"],
    queryFn: getEasyLifeProductRequest,
    staleTime: 60 * 1000,
    retry: 1,
  });

  const product = data?.data?.data || data?.data || {};
  return { product, isPending, isError, error, refetch };
};

export const useEasyLifePlans = () => {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["easyLifePlans"],
    queryFn: getEasyLifePlansRequest,
    staleTime: 15 * 1000,
    retry: 1,
  });

  // Handle new API structure: { message: "...", data: [...] }
  const plans = data?.data?.data || data?.data || [];
  return { plans, isPending, isError, error, refetch };
};

export const useGetEasyLifePlanById = (planId: string | null, enabled = true) => {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["easyLifePlanDetails", planId],
    queryFn: () => getEasyLifePlanDetailsRequest({ planId: planId! }),
    enabled: !!planId && enabled,
    staleTime: 10 * 1000,
    retry: 1,
  });

  // Handle new API structure: { message: "...", data: {...} }
  const plan = data?.data?.data || data?.data || {};
  return { plan, isPending, isError, error, refetch };
};

export const useEasyLifePlanDetails = (payload: IGetEasyLifePlanDetails, enabled = true) => {
  return useGetEasyLifePlanById(payload.planId, enabled);
};

export const useCreateEasyLifePlan = (onError: (e: any) => void, onSuccess: (d: any) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICreateEasyLifePlan) => createEasyLifePlanRequest(payload),
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["easyLifePlans"] });
      queryClient.invalidateQueries({ queryKey: ["easyLifeProduct"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["walletAccounts"] });
      onSuccess(data);
    },
  });
};

export const useFundEasyLifePlan = (onError: (e: any) => void, onSuccess: (d: any) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IFundEasyLifePlan) => fundEasyLifePlanRequest(payload),
    onError,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["easyLifePlans"] });
      queryClient.invalidateQueries({ queryKey: ["easyLifePlanDetails", variables?.planId] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["walletAccounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      onSuccess(data);
    },
  });
};

export const useWithdrawEasyLifePlan = (onError: (e: any) => void, onSuccess: (d: any) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IWithdrawEasyLifePlan) => withdrawEasyLifePlanRequest(payload),
    onError,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["easyLifePlans"] });
      queryClient.invalidateQueries({ queryKey: ["easyLifePlanDetails", variables?.planId] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["walletAccounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      onSuccess(data);
    },
  });
};
