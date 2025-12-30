/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createInvestmentRequest,
  getInvestmentDetailsRequest,
  getInvestmentProductRequest,
  getInvestmentsRequest,
} from "./investment.apis";
import type {
  CreateInvestmentPayload,
  GetInvestmentsParams,
  InvestmentProduct,
  InvestmentRecord,
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

  const investmentsData:
    | {
        investments: InvestmentRecord[];
        totalCount?: number;
        totalPages?: number;
        page?: number;
        limit?: number;
      }
    | undefined = data?.data?.data || data?.data;

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
      onSuccess(data);
    },
  });
};


