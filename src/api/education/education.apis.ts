import { request } from "@/utils/axios-utils";
import type { IPayEducation, IVerifyEducationCustomer, IPayJambWaec, IVerifyJambWaec } from "./education.types";

export const getEducationBillersRequest = async () => {
  return request({
    url: "/bill/education/billers",
    method: "get",
    noAuth: true,
  });
};

export const getEducationBillerItemsRequest = async ({
  billerCode,
}: {
  billerCode: string;
}) => {
  return request({
    url: `/bill/education/biller-items?billerCode=${billerCode}`,
    method: "get",
    noAuth: true,
  });
};

export const verifyEducationCustomerRequest = async (
  formdata: IVerifyEducationCustomer
) => {
  return request({
    url: "/bill/education/verify-customer",
    method: "post",
    data: formdata,
    noAuth: true,
  });
};

export const payEducationSchoolFeeRequest = async (formdata: IPayEducation) => {
  return request({
    url: "/bill/education/school-fee/pay",
    method: "post",
    data: formdata,
  });
};

// JAMB & WAEC APIs
export const getWaecPlanRequest = async () => {
  return request({
    url: "/bill/waec/get-plan",
    method: "get",
  });
};

export const getJambPlanRequest = async () => {
  return request({
    url: "/bill/jamb/get-plan",
    method: "get",
  });
};

export const verifyWaecBillerNumberRequest = async (formdata: IVerifyJambWaec) => {
  return request({
    url: "/bill/waec/verify-biller-number",
    method: "post",
    data: formdata,
  });
};

export const verifyJambBillerNumberRequest = async (formdata: IVerifyJambWaec) => {
  return request({
    url: "/bill/jamb/verify-biller-number",
    method: "post",
    data: formdata,
  });
};

export const payWaecRequest = async (formdata: IPayJambWaec) => {
  return request({
    url: "/bill/waec/pay",
    method: "post",
    data: formdata,
  });
};

export const payJambRequest = async (formdata: IPayJambWaec) => {
  return request({
    url: "/bill/jamb/pay",
    method: "post",
    data: formdata,
  });
};





















































