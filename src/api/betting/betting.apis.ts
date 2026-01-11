import { request } from "@/utils/axios-utils";
import type {
  IFundBettingPlatform,
  IFundBettingWallet,
  IWithdrawBettingWallet,
  IQueryBettingTransaction,
} from "./betting.types";

export const getBettingPlatformsRequest = async () => {
  return request({
    url: "/betting/platforms",
    method: "get",
  });
};

export const fundBettingPlatformRequest = async (formdata: IFundBettingPlatform) => {
  return request({
    // Updated route (PalmPay): fund betting wallet
    url: "/betting/wallet/fund",
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

export const getBettingTransactionsRequest = async (params: {
  type?: "FUND" | "WITHDRAW";
  status?: "PENDING" | "PROCESSING" | "SUCCESS" | "FAILED" | "CANCELLED";
  platform?: string;
  page?: number;
  limit?: number;
}) => {
  const queryParams = new URLSearchParams();
  if (params.type) queryParams.set("type", params.type);
  if (params.status) queryParams.set("status", params.status);
  if (params.platform) queryParams.set("platform", params.platform);
  if (params.page) queryParams.set("page", params.page.toString());
  if (params.limit) queryParams.set("limit", params.limit.toString());
  return request({
    url: `/betting/transactions${queryParams.toString() ? `?${queryParams.toString()}` : ""}`,
    method: "get",
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
    url: `/betting/transactions${query.toString() ? `?${query.toString()}` : ""}`,
    method: "get",
  });
};

export const withdrawBettingWalletRequest = async (formdata: IWithdrawBettingWallet) => {
  return request({
    url: "/betting/wallet/withdraw",
    method: "post",
    data: formdata,
  });
};

export const queryBettingTransactionRequest = async (params: IQueryBettingTransaction) => {
  return request({
    url: `/betting/query?orderReference=${params.orderReference}`,
    method: "get",
  });
};

export const placeBetRequest = async (formdata: {
  amount: number;
  currency: string;
  betType: "SINGLE" | "MULTIPLE" | "SYSTEM";
  odds: number;
  description?: string;
  metadata?: {
    sport?: string;
    event?: string;
    selection?: string;
    eventDate?: string;
    [key: string]: any;
  };
  walletPin: string;
}) => {
  return request({
    url: "/betting/bets",
    method: "post",
    data: formdata,
  });
};

export const getBetsRequest = async (params: {
  status?: "PENDING" | "WON" | "LOST" | "CANCELLED" | "REFUNDED";
  betType?: "SINGLE" | "MULTIPLE" | "SYSTEM";
  page?: number;
  limit?: number;
}) => {
  const queryParams = new URLSearchParams();
  if (params.status) queryParams.set("status", params.status);
  if (params.betType) queryParams.set("betType", params.betType);
  if (params.page) queryParams.set("page", params.page.toString());
  if (params.limit) queryParams.set("limit", params.limit.toString());
  return request({
    url: `/betting/bets${queryParams.toString() ? `?${queryParams.toString()}` : ""}`,
    method: "get",
  });
};

export const getBetByIdRequest = async (betId: string) => {
  return request({
    url: `/betting/bets/${betId}`,
    method: "get",
  });
};


















