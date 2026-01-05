/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createInvestmentRequest,
  getInvestmentDetailsRequest,
  getInvestmentProductRequest,
  getInvestmentsRequest,
  payoutInvestmentRequest,
} from "./investment.apis";
import type {
  CreateInvestmentPayload,
  GetInvestmentsParams,
  InvestmentProduct,
  InvestmentRecord,
  PayoutInvestmentPayload,
} from "./investment.types";

export const useGetInvestmentProduct = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["investment-product"],
    queryFn: getInvestmentProductRequest,
    staleTime: 10 * 60 * 1000, // 10 mins
    retry: 1,
  });

  // support both { data: { data: ... } } and { data: ... }
  const product: InvestmentProduct | undefined = data?.data?.data || data?.data;

  return { product, isPending, isError, error };
};

export const useGetInvestments = (params: GetInvestmentsParams & { enabled?: boolean }) => {
  const { enabled = true, ...rest } = params;
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["investments", rest],
    queryFn: () => getInvestmentsRequest(rest),
    enabled,
    staleTime: 30 * 1000,
    retry: 1,
  });

  // Handle new API structure: { message: "...", data: [...] }
  const responseData = data?.data?.data || data?.data;
  const meta = data?.data?.meta;
  
  let investmentsData:
    | {
        investments: InvestmentRecord[];
        totalCount?: number;
        totalPages?: number;
        page?: number;
        limit?: number;
      }
    | undefined;

  if (Array.isArray(responseData)) {
    investmentsData = {
      investments: responseData,
      ...(meta && {
        totalCount: meta.total,
        page: meta.page,
        limit: meta.limit,
      }),
    };
  } else if (responseData && typeof responseData === "object") {
    if (Array.isArray(responseData.investments)) {
      investmentsData = responseData;
    } else if (Array.isArray(responseData.data)) {
      investmentsData = {
        investments: responseData.data,
        ...(meta && {
          totalCount: meta.total,
          page: meta.page,
          limit: meta.limit,
        }),
      };
    } else {
      investmentsData = undefined;
    }
  } else {
    investmentsData = undefined;
  }

  return { investmentsData, isPending, isError, error };
};

export const useGetInvestmentDetails = ({ id, enabled = true }: { id: string; enabled?: boolean }) => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["investment-details", { id }],
    queryFn: () => getInvestmentDetailsRequest({ id }),
    enabled: Boolean(id) && enabled,
    staleTime: 30 * 1000,
    retry: 1,
  });

  const investment: InvestmentRecord | undefined = data?.data?.data || data?.data;

  return { investment, isPending, isError, error };
};

export const useCreateInvestment = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateInvestmentPayload) => createInvestmentRequest(payload),
    onError,
    onSuccess: (data) => {
      // Wallet debit should reflect globally via user refetch.
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["investments"] });
      queryClient.invalidateQueries({ queryKey: ["walletAccounts"] });
      onSuccess(data);
    },
  });
};

export const usePayoutInvestment = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PayoutInvestmentPayload) => payoutInvestmentRequest(payload),
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["investments"] });
      queryClient.invalidateQueries({ queryKey: ["investment-details"] });
      queryClient.invalidateQueries({ queryKey: ["walletAccounts"] });
      onSuccess(data);
    },
  });
};


