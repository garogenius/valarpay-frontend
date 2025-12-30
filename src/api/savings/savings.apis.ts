import { request } from "@/utils/axios-utils";
import type {
  ICloseSavingsPlan,
  ICreateSavingsPlan,
  IFundSavingsPlan,
  IGetSavingsPlanDetails,
} from "./savings.types";

export const getSavingsProductsRequest = async () => {
  return request({
    url: "/savings/products",
    method: "get",
  });
};

export const createSavingsPlanRequest = async (data: ICreateSavingsPlan) => {
  return request({
    url: "/savings/plan",
    method: "post",
    data,
  });
};

export const getSavingsPlansRequest = async () => {
  return request({
    url: "/savings/plans",
    method: "get",
  });
};

export const getSavingsPlanDetailsRequest = async (data: IGetSavingsPlanDetails) => {
  return request({
    url: "/savings/plan/details",
    method: "post",
    data,
  });
};

export const fundSavingsPlanRequest = async (data: IFundSavingsPlan) => {
  return request({
    url: "/savings/plan/fund",
    method: "post",
    data,
  });
};

export const closeSavingsPlanAtMaturityRequest = async (data: ICloseSavingsPlan) => {
  return request({
    url: "/savings/plan/close/maturity",
    method: "post",
    data,
  });
};

export const closeSavingsPlanEarlyRequest = async (data: ICloseSavingsPlan) => {
  return request({
    url: "/savings/plan/close/early",
    method: "post",
    data,
  });
};











