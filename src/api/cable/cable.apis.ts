import { request } from "@/utils/axios-utils";
import {
  IGetCablePlans,
  IGetCableVariationsPayload,
  IPayCable,
  IVerifyCableNumber,
} from "./cable.types";

export const getCablePlansRequest = async (formdata: IGetCablePlans) => {
  return request({
    url: `/bill/cable/get-plan?currency=${formdata.currency}`,
    method: "get",
  });
};

export const getCableVariationsRequest = async (
  formdata: IGetCableVariationsPayload
) => {
  return request({
    url: `/bill/cable/get-bill-info?billerCode=${formdata.billerCode}`,
    method: "get",
  });
};

export const cablePaymentRequest = async (formdata: IPayCable) => {
  return request({
    url: `/bill/cable/pay`,
    method: "post",
    data: formdata,
  });
};

export const verifyCableNumberRequest = async (
  formdata: IVerifyCableNumber
) => {
  return request({
    url: `/bill/cable/verify-cable-number`,
    method: "post",
    data: formdata,
  });
};
