import { request } from "@/utils/axios-utils";
import {
  IGetElectricityPlans,
  IGetElectricityVariationsPayload,
  IPayElectricity,
  IVerifyElectricityNumber,
} from "./electricity.types";

export const getElectricityPlansRequest = async (
  formdata: IGetElectricityPlans
) => {
  return request({
    url: `/bill/electricity/get-plan?currency=${formdata.currency}`,
    method: "get",
  });
};

export const getElectricityVariationsRequest = async (
  formdata: IGetElectricityVariationsPayload
) => {
  return request({
    url: `/bill/electricity/get-bill-info?billerCode=${formdata.billerCode}`,
    method: "get",
  });
};

export const electricityPaymentRequest = async (formdata: IPayElectricity) => {
  return request({
    url: `/bill/electricity/pay`,
    method: "post",
    data: formdata,
  });
};

export const verifyElectricityNumberRequest = async (
  formdata: IVerifyElectricityNumber
) => {
  return request({
    url: `/bill/electricity/verify-meter-number`,
    method: "post",
    data: formdata,
  });
};
