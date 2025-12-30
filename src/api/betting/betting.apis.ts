import { request } from "@/utils/axios-utils";
import type {
  IFundBettingPlatform,
  IFundBettingWallet,
  IWithdrawBettingWallet,
} from "./betting.types";

export const getBettingPlatformsRequest = async () => {
  return request({
    url: "/betting/platforms",
    method: "get",
  });
};

export const fundBettingPlatformRequest = async (
  formdata: IFundBettingPlatform
) => {
  return request({
    url: "/betting/platforms/fund",
    method: "post",
    data: formdata,
  });
};

export const getBettingWalletRequest = async () => {
  return request({
    url: "/betting/wallet",
    method: "get",
  });
};

export const fundBettingWalletRequest = async (formdata: IFundBettingWallet) => {
  return request({
    url: "/betting/wallet/fund",
    method: "post",
    data: formdata,
  });
};

export const getBettingWalletTransactionsRequest = async ({
  limit,
}: {
  limit?: number;
}) => {
  const query = new URLSearchParams();
  if (limit) query.set("limit", String(limit));
  return request({
    url: `/betting/wallet/transactions${query.toString() ? `?${query.toString()}` : ""}`,
    method: "get",
  });
};

export const withdrawBettingWalletRequest = async (
  formdata: IWithdrawBettingWallet
) => {
  return request({
    url: "/betting/wallet/withdraw",
    method: "post",
    data: formdata,
  });
};















