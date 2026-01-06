import { request } from "@/utils/axios-utils";
import type { IPayEducation, IVerifyEducationCustomer } from "./education.types";

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






































