/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  IGetInternetPlans,
  IGetInternetVariationsPayload,
} from "./internet.types";
import {
  internetPaymentRequest,
  getInternetPlansRequest,
  getInternetVariationsRequest,
} from "./internet.apis";
import { InternetPlan, InternetVariationProps } from "@/constants/types";

export const useGetInternetPlans = (payload: IGetInternetPlans) => {
  const { isPending, isError, data } = useQuery({
    queryKey: ["internet-plan", payload],
    queryFn: () => getInternetPlansRequest(payload),
    enabled: payload.isEnabled,
  });

  const internetPlans: InternetPlan[] = data?.data?.data;

  return { isPending, isError, internetPlans };
};

export const useGetInternetVariations = (
  payload: IGetInternetVariationsPayload
) => {
  const { isLoading, isError, data } = useQuery({
    queryKey: ["internet-variation", payload],
    queryFn: () => getInternetVariationsRequest(payload),
    enabled: !!payload.billerCode,
  });

  // Support multiple backend response shapes:
  // 1) { statusCode, data: { billerCode, billerName, plans: [...] } }
  // 2) { statusCode, data: [...] }  (array directly)
  const body = data?.data ?? null;
  const payloadData = body?.data ?? null;

  const variations: any[] = Array.isArray(payloadData)
    ? payloadData
    : Array.isArray(payloadData?.plans)
      ? payloadData.plans
      : Array.isArray(body?.plans)
        ? body.plans
        : [];
  return { isLoading, isError, variations };
};

export const usePayForInternet = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: internetPaymentRequest,
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["get-beneficiaries"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      onSuccess(data);
    },
  });
};
