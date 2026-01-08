import { request } from "@/utils/axios-utils";
import type { CreateInvestmentPayload, GetInvestmentsParams, PayoutInvestmentPayload } from "./investment.types";

export const getInvestmentProductRequest = async () => {
  return request({
    url: "/investment/product",
    method: "get",
  });
};

export const createInvestmentRequest = async (data: CreateInvestmentPayload) => {
  return request({
    url: "/investments",
    method: "post",
    data,
  });
};

export const getInvestmentsRequest = async ({ page, limit, status, sort }: GetInvestmentsParams) => {
  const query = new URLSearchParams();
  query.set("page", String(page));
  query.set("limit", String(limit));
  if (status) query.set("status", status);
  if (sort) query.set("sort", sort);

  return request({
    url: `/investment?${query.toString()}`,
    method: "get",
  });
};

export const getInvestmentDetailsRequest = async ({ id }: { id: string }) => {
  return request({
    url: `/investments/${id}`,
    method: "get",
  });
};

export const payoutInvestmentRequest = async (payload: PayoutInvestmentPayload) => {
  const { investmentId, formdata, walletPin } = payload;
  return request({
    url: `/investments/${investmentId}/payout`,
    method: "post",
    data: formdata || { walletPin },
  });
};



