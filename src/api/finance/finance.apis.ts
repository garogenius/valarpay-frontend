import { request } from "@/utils/axios-utils";
import {
  IGetSavingsInterest,
  IGetDepositInterest,
  IGetInvestmentInterest,
  InterestResponse,
} from "./finance.types";

// Get total interest for Fixed Savings
export const getFixedSavingsInterest = async (): Promise<InterestResponse> => {
  return request({
    url: "/finance/savings/interest?type=fixed-savings",
    method: "get",
  });
};

// Get total interest for Fixed Deposit
export const getFixedDepositInterest = async (): Promise<InterestResponse> => {
  return request({
    url: "/finance/deposit/interest?type=fixed-deposit",
    method: "get",
  });
};

// Get total interest for Investment
export const getInvestmentInterest = async (): Promise<InterestResponse> => {
  return request({
    url: "/finance/investment/interest",
    method: "get",
  });
};
































