/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getEducationBillerItemsRequest,
  getEducationBillersRequest,
  payEducationSchoolFeeRequest,
  verifyEducationCustomerRequest,
  getWaecPlanRequest,
  getJambPlanRequest,
  verifyWaecBillerNumberRequest,
  verifyJambBillerNumberRequest,
  payWaecRequest,
  payJambRequest,
  getSchoolFeePlanRequest,
  getSchoolBillInfoRequest,
  verifySchoolBillerNumberRequest,
  paySchoolFeeRequest,
} from "./education.apis";
import type {
  EducationBiller,
  EducationBillerItem,
  IPayEducation,
  IVerifyEducationCustomer,
  VerifiedEducationCustomer,
  JambWaecPlanData,
  IVerifyJambWaec,
  VerifiedJambWaec,
  IPayJambWaec,
  SchoolBillInfo,
  SchoolFeePlan,
} from "./education.types";

export const useGetSchoolFeePlan = (currency: string = "NGN", enabled: boolean = true) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["school-fee-plan", { currency }],
    queryFn: () => getSchoolFeePlanRequest(currency),
    enabled,
  });
  // Support multiple backend response shapes:
  // 1) { statusCode, data: [...] }
  // 2) { statusCode, data: { data: [...] } }
  // 3) [...] (array directly)
  const body: any = data?.data ?? null;
  const payload: any = body?.data ?? null;
  const institutions: any[] = Array.isArray(body)
    ? body
    : Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
        ? payload.data
        : [];
  return { institutions, isPending, isError };
};

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

// School fee bill info (for services/plans)
export const useGetSchoolBillInfo = (billerCode: string) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["school-bill-info", billerCode],
    queryFn: () => getSchoolBillInfoRequest(billerCode),
    enabled: !!billerCode,
  });
  // Support multiple backend response shapes:
  // 1) { statusCode, data: { billerCode, billerName, plans: [...] } }
  // 2) { statusCode, data: { data: { billerCode, billerName, plans: [...] } } }
  const body: any = data?.data ?? null;
  const payload: any = body?.data ?? null;
  const billInfo: SchoolBillInfo | null =
    payload && !Array.isArray(payload)
      ? (payload?.billerCode ? payload : payload?.data ?? null)
      : null;
  const rawPlans: any = billInfo?.plans ?? [];
  const plans: any[] = Array.isArray(rawPlans) ? rawPlans : [];
  return { billInfo, plans, isPending, isError };
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

// School fee verification
export const useVerifySchoolBillerNumber = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  return useMutation({
    mutationFn: (payload: { itemCode: string; billerCode: string; billerNumber: string }) =>
      verifySchoolBillerNumberRequest(payload),
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

// School fee payment
export const usePaySchoolFee = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { itemCode: string; billerCode: string; currency: string; billerNumber: string; amount: number; walletPin: string; addBeneficiary?: boolean }) => 
      paySchoolFeeRequest(payload),
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      onSuccess(data);
    },
  });
};

// JAMB & WAEC Hooks
export const useGetWaecPlan = (enabled: boolean = true) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["waec-plan"],
    queryFn: getWaecPlanRequest,
    enabled,
    retry: 2,
  });
  const planData: JambWaecPlanData | null = data?.data?.data ?? null;
  return { planData, isPending, isError };
};

export const useGetJambPlan = (enabled: boolean = true) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["jamb-plan"],
    queryFn: getJambPlanRequest,
    enabled,
    retry: 2,
  });
  const planData: JambWaecPlanData | null = data?.data?.data ?? null;
  return { planData, isPending, isError };
};

export const useVerifyWaecBillerNumber = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  return useMutation({
    mutationFn: (payload: IVerifyJambWaec) => verifyWaecBillerNumberRequest(payload),
    onError,
    onSuccess,
  });
};

export const useVerifyJambBillerNumber = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  return useMutation({
    mutationFn: (payload: IVerifyJambWaec) => verifyJambBillerNumberRequest(payload),
    onError,
    onSuccess,
  });
};

export const usePayWaec = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IPayJambWaec) => payWaecRequest(payload),
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["get-beneficiaries"] });
      onSuccess(data);
    },
  });
};

export const usePayJamb = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IPayJambWaec) => payJambRequest(payload),
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["get-beneficiaries"] });
      onSuccess(data);
    },
  });
};





















































