import { request } from "@/utils/axios-utils";
import type {
  ICreateSavingsPlan,
  IFundSavingsPlan,
  IGetSavingsPlanDetails,
  IWithdrawSavingsPlan,
} from "./savings.types";

export const getSavingsProductsRequest = async () => {
  return request({
    url: "/savings/products",
    method: "get",
  });
};

export const createSavingsPlanRequest = async (data: ICreateSavingsPlan) => {
  return request({
    url: "/savings/plans",
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
    url: `/savings/plans/${data.planId}`,
    method: "get",
  });
};

export const fundSavingsPlanRequest = async (data: IFundSavingsPlan) => {
  return request({
    url: "/savings/plans/fund",
    method: "post",
    data: {
      planId: data.planId,
      amount: data.amount,
      currency: data.currency,
    },
  });
};

export const withdrawSavingsPlanRequest = async (data: IWithdrawSavingsPlan) => {
  return request({
    url: `/savings/plans/${data.planId}/withdraw`,
    method: "post",
    data: data.walletPin ? { walletPin: data.walletPin } : {},
  });
};
