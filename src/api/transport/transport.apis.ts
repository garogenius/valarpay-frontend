import { request } from "@/utils/axios-utils";
import {
  IGetTransportPlans,
  IGetTransportBillInfo,
  IPayTransport,
} from "./transport.types";

export const getTransportPlansRequest = async (formdata?: IGetTransportPlans) => {
  const query = formdata?.currency ? `?currency=${formdata.currency}` : "";
  return request({
    url: `/bill/transport/get-plan${query}`,
    method: "get",
  });
};

export const getTransportBillInfoRequest = async (
  formdata: IGetTransportBillInfo
) => {
  return request({
    url: `/bill/transport/get-bill-info?billerCode=${formdata.billerCode}`,
    method: "get",
  });
};

export const transportPaymentRequest = async (formdata: IPayTransport) => {
  return request({
    url: `/bill/transport/pay`,
    method: "post",
    data: formdata,
  });
};









