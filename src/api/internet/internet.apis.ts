import { request } from "@/utils/axios-utils";
import {
  IGetInternetPlans,
  IGetInternetVariationsPayload,
  IPayInternet,
} from "./internet.types";

export const getInternetPlansRequest = async (formdata: IGetInternetPlans) => {
  return request({
    url: `/bill/internet/get-plan?currency=${formdata.currency}`,
    method: "get",
  });
};

export const getInternetVariationsRequest = async (
  formdata: IGetInternetVariationsPayload
) => {
  return request({
    url: `/bill/internet/get-bill-info?billerCode=${formdata.billerCode}`,
    method: "get",
  });
};

export const internetPaymentRequest = async (formdata: IPayInternet) => {
  return request({
    url: `/bill/internet/pay`,
    method: "post",
    data: formdata,
  });
};
