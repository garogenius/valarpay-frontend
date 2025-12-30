import { request } from "@/utils/axios-utils";
import type { CreateInvestmentPayload, GetInvestmentsParams } from "./investment.types";

export const getInvestmentProductRequest = async () => {
  return request({
    url: "/investment/product",
    method: "get",
  });
};

export const createInvestmentRequest = async (data: CreateInvestmentPayload) => {
  return request({
    url: "/investment",
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
    url: `/investment/${id}`,
    method: "get",
  });
};



