/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  dataPaymentRequest,
  dataPlanNetworkRequest,
  dataPlanRequest,
  dataVariationRequest,
} from "./data.apis";
import { IDataPlan, IDataVariationPayload } from "./data.types";
import { NetworkPlan } from "@/constants/types";

const validatePhone = (phone: string, currency: string) => {
  if (phone.length === 11 && currency === "NGN") {
    return true;
  }
  return false;
};

export const useGetDataPlan = (payload: IDataPlan) => {
  const { isLoading, isError, data } = useQuery({
    queryKey: ["data-plan", payload],
    queryFn: () => dataPlanRequest(payload),
    enabled: validatePhone(payload.phone, payload.currency),
  });

  const res = data?.data?.data;

  const network: string = res?.network;
  const networkPlans: NetworkPlan[] = res?.plan;

  return { isLoading, isError, network, networkPlans };
};

export const useGetDataVariation = (payload: IDataVariationPayload) => {
  const { isPending, isError, data } = useQuery({
    queryKey: ["data-variation", payload],
    queryFn: () => dataVariationRequest(payload),
    enabled: !!payload.operatorId,
  });

  const variations: {
    [price: string]: string;
  } = data?.data?.data?.fixedAmountsDescriptions;
  return { isPending, isError, variations };
};

export const usePayForData = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dataPaymentRequest,
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["get-beneficiaries"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      onSuccess(data);
    },
  });
};

export const useGetDataPlanByNetwork = (network: string) => {
  return useQuery({
    queryKey: ["data-plan-by-network", network],
    queryFn: () => dataPlanNetworkRequest(network),
    enabled: !!network,
  });
};
