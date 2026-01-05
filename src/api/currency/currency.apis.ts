import { request } from "@/utils/axios-utils";
import {
  ICurrencyAccount,
  IUpdateCurrencyAccount,
  ICloseCurrencyAccount,
  ICreatePayoutDestination,
  ICreatePayout,
  IGetCurrencyAccountTransactionsQuery,
  IGetCurrencyAccountDepositsQuery,
  IGetCurrencyAccountPayoutsQuery,
} from "./currency.types";

export const getCurrencyAccountsRequest = async () => {
  return request({
    url: "/wallet/accounts/graph",
    method: "get",
  });
};

export const getCurrencyAccountByCurrencyRequest = async (currency: "USD" | "EUR" | "GBP") => {
  return request({
    url: `/wallet/accounts/graph?currency=${currency}`,
    method: "get",
  });
};

export const getCurrencyAccountDetailsRequest = async (walletId: string) => {
  return request({
    url: "/wallet/account/details",
    method: "post",
    data: { walletId },
  });
};

export const getCurrencyAccountBalanceRequest = async (walletId: string) => {
  return request({
    url: `/wallet/account/${walletId}/balance`,
    method: "get",
  });
};

export const updateCurrencyAccountRequest = async (
  walletId: string,
  data: IUpdateCurrencyAccount
) => {
  return request({
    url: `/wallet/account/${walletId}`,
    method: "patch",
    data,
  });
};

export const closeCurrencyAccountRequest = async (
  walletId: string,
  data: ICloseCurrencyAccount
) => {
  return request({
    url: `/wallet/account/${walletId}`,
    method: "delete",
    data,
  });
};

export const getCurrencyAccountTransactionsRequest = async (
  currency: "USD" | "EUR" | "GBP",
  query: IGetCurrencyAccountTransactionsQuery
) => {
  const queryParams = new URLSearchParams();
  if (query.limit) queryParams.set("limit", query.limit.toString());
  if (query.offset) queryParams.set("offset", query.offset.toString());
  return request({
    url: `/wallet/account/${currency}/transactions?${queryParams.toString()}`,
    method: "get",
  });
};

export const getCurrencyAccountDepositsRequest = async (
  currency: "USD" | "EUR" | "GBP",
  query: IGetCurrencyAccountDepositsQuery
) => {
  const queryParams = new URLSearchParams();
  if (query.limit) queryParams.set("limit", query.limit.toString());
  if (query.offset) queryParams.set("offset", query.offset.toString());
  return request({
    url: `/wallet/account/${currency}/deposits?${queryParams.toString()}`,
    method: "get",
  });
};

export const getCurrencyAccountPayoutsRequest = async (
  currency: "USD" | "EUR" | "GBP",
  query: IGetCurrencyAccountPayoutsQuery
) => {
  const queryParams = new URLSearchParams();
  if (query.limit) queryParams.set("limit", query.limit.toString());
  if (query.offset) queryParams.set("offset", query.offset.toString());
  return request({
    url: `/wallet/account/${currency}/payouts?${queryParams.toString()}`,
    method: "get",
  });
};

export const getCurrencyAccountPayoutDestinationsRequest = async (
  currency: "USD" | "EUR" | "GBP"
) => {
  return request({
    url: `/wallet/account/${currency}/payout-destinations`,
    method: "get",
  });
};

export const createPayoutDestinationRequest = async (
  currency: "USD" | "EUR" | "GBP",
  data: ICreatePayoutDestination
) => {
  return request({
    url: `/wallet/account/${currency}/payout-destinations`,
    method: "post",
    data,
  });
};

export const createPayoutRequest = async (
  currency: "USD" | "EUR" | "GBP",
  data: ICreatePayout
) => {
  return request({
    url: `/wallet/account/${currency}/payouts`,
    method: "post",
    data,
  });
};

