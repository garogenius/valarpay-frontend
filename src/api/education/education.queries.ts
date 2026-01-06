/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getEducationBillerItemsRequest,
  getEducationBillersRequest,
  payEducationSchoolFeeRequest,
  verifyEducationCustomerRequest,
} from "./education.apis";
import type {
  EducationBiller,
  EducationBillerItem,
  IPayEducation,
  IVerifyEducationCustomer,
  VerifiedEducationCustomer,
} from "./education.types";

export const useGetEducationBillers = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["education-billers"],
    queryFn: getEducationBillersRequest,
  });
  const billers: EducationBiller[] = data?.data?.data ?? data?.data ?? [];
  return { billers, isPending, isError };
};

export const useGetEducationBillerItems = (billerCode: string) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["education-biller-items", billerCode],
    queryFn: () => getEducationBillerItemsRequest({ billerCode }),
    enabled: !!billerCode,
  });
  const items: EducationBillerItem[] = data?.data?.data ?? data?.data ?? [];
  return { items, isPending, isError };
};

export const useVerifyEducationCustomer = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  return useMutation({
    mutationFn: (payload: IVerifyEducationCustomer) =>
      verifyEducationCustomerRequest(payload),
    onError,
    onSuccess,
  });
};

export const usePayEducationSchoolFee = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IPayEducation) => payEducationSchoolFeeRequest(payload),
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      onSuccess(data);
    },
  });
};






































