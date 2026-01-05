import { request } from "@/utils/axios-utils";
import type {
  ICreateFixedDeposit,
  IPayoutFixedDeposit,
  IEarlyWithdrawFixedDeposit,
  IRolloverFixedDeposit,
} from "./fixed-deposit.types";

export const getFixedDepositPlansRequest = async () => {
  return request({
    url: "/fixed-deposits/plans",
    method: "get",
  });
};

export const createFixedDepositRequest = async (data: ICreateFixedDeposit) => {
  return request({
    url: "/fixed-deposits",
    method: "post",
    data: {
      planType: data.planType,
      principalAmount: data.principalAmount,
      currency: data.currency,
      interestPaymentFrequency: data.interestPaymentFrequency,
      reinvestInterest: data.reinvestInterest,
      autoRenewal: data.autoRenewal,
    },
  });
};

export const getMyFixedDepositsRequest = async () => {
  return request({
    url: "/fixed-deposits",
    method: "get",
  });
};

export const getFixedDepositDetailsRequest = async (id: string) => {
  return request({
    url: `/fixed-deposits/${id}`,
    method: "get",
  });
};

export const payoutFixedDepositRequest = async (data: IPayoutFixedDeposit) => {
  return request({
    url: `/fixed-deposits/${data.fixedDepositId}/payout`,
    method: "post",
    data: data.walletPin ? { walletPin: data.walletPin } : {},
  });
};

export const withdrawFixedDepositEarlyRequest = async (data: IEarlyWithdrawFixedDeposit) => {
  return request({
    url: "/fixed-deposits/early-withdrawal",
    method: "post",
    data: {
      fixedDepositId: data.fixedDepositId,
      reason: data.reason,
    },
  });
};

export const rolloverFixedDepositRequest = async (data: IRolloverFixedDeposit) => {
  return request({
    url: "/fixed-deposits/rollover",
    method: "post",
    data: {
      fixedDepositId: data.fixedDepositId,
      rolloverType: data.rolloverType,
      autoRenewal: data.autoRenewal || false,
    },
  });
};
