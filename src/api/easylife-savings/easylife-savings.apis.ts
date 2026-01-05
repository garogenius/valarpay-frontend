import { request } from "@/utils/axios-utils";
import type {
  ICreateEasyLifePlan,
  IGetEasyLifePlanDetails,
  IFundEasyLifePlan,
  IWithdrawEasyLifePlan,
} from "./easylife-savings.types";

export const getEasyLifeProductRequest = async () => {
  return request({
    url: "/easylife-savings/product",
    method: "get",
  });
};

export const createEasyLifePlanRequest = async (data: ICreateEasyLifePlan) => {
  return request({
    url: "/easylife-savings/plans",
    method: "post",
    data: {
      name: data.name,
      description: data.description,
      goalAmount: data.goalAmount,
      currency: data.currency,
      durationDays: data.durationDays,
      contributionFrequency: data.contributionFrequency,
      autoDebitEnabled: data.autoDebitEnabled,
      earlyWithdrawalEnabled: data.earlyWithdrawalEnabled,
    },
  });
};

export const getEasyLifePlansRequest = async () => {
  return request({
    url: "/easylife-savings/plans",
    method: "get",
  });
};

export const getEasyLifePlanDetailsRequest = async (data: IGetEasyLifePlanDetails) => {
  return request({
    url: `/easylife-savings/plans/${data.planId}`,
    method: "get",
  });
};

export const fundEasyLifePlanRequest = async (data: IFundEasyLifePlan) => {
  return request({
    url: "/easylife-savings/plans/fund",
    method: "post",
    data: {
      planId: data.planId,
      amount: data.amount,
      currency: data.currency,
    },
  });
};

export const withdrawEasyLifePlanRequest = async (data: IWithdrawEasyLifePlan) => {
  return request({
    url: `/easylife-savings/plans/${data.planId}/withdraw`,
    method: "post",
    data: data.walletPin ? { walletPin: data.walletPin } : {},
  });
};
