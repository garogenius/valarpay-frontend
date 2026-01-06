import { request } from "@/utils/axios-utils";
import {
  IGetSavingsInterest,
  IGetDepositInterest,
  IGetInvestmentInterest,
  InterestResponse,
} from "./finance.types";

// Get total interest for Fixed Savings
export const getFixedSavingsInterest = async () => {
  const response = await request({
    url: "/finance/savings/interest?type=fixed-savings",
    method: "get",
  });
  return response.data;
};

// Get total interest for Fixed Deposit
export const getFixedDepositInterest = async () => {
  const response = await request({
    url: "/finance/deposit/interest?type=fixed-deposit",
    method: "get",
  });
  return response.data;
};

// Get total interest for Investment
export const getInvestmentInterest = async () => {
  const response = await request({
    url: "/finance/investment/interest",
    method: "get",
  });
  return response.data;
};




































