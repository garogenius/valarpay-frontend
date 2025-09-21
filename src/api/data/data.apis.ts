import { request } from "@/utils/axios-utils";
import {
  IDataPayPayload,
  IDataPlan,
  IDataVariationPayload,
} from "./data.types";

export const dataPlanRequest = async (formdata: IDataPlan) => {
  return request({
    url: `/bill/data/get-plan?phone=${formdata.phone}&currency=${formdata.currency}`,
    method: "get",
  });
};

export const dataVariationRequest = async (formdata: IDataVariationPayload) => {
  return request({
    url: `/bill/data/get-variation?operatorId=${formdata.operatorId}`,
    method: "get",
  });
};

export const dataPaymentRequest = async (formdata: IDataPayPayload) => {
  return request({
    url: `/bill/data/pay`,
    method: "post",
    data: formdata,
  });
};

export const dataPlanNetworkRequest = async (network: string) => {
  return request({
    url: `/bill/data/get-plan/${network}`,
    method: "get",
  });
};
