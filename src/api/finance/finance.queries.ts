import { useQuery } from "@tanstack/react-query";
import {
  getFixedSavingsInterest,
  getFixedDepositInterest,
  getInvestmentInterest,
} from "./finance.apis";

export const useGetFixedSavingsInterest = () => {
  return useQuery({
    queryKey: ["fixed-savings-interest"],
    queryFn: getFixedSavingsInterest,
    staleTime: 30 * 1000, // 30 seconds
    retry: 1,
  });
};

export const useGetFixedDepositInterest = () => {
  return useQuery({
    queryKey: ["fixed-deposit-interest"],
    queryFn: getFixedDepositInterest,
    staleTime: 30 * 1000,
    retry: 1,
  });
};

export const useGetInvestmentInterest = () => {
  return useQuery({
    queryKey: ["investment-interest"],
    queryFn: getInvestmentInterest,
    staleTime: 30 * 1000,
    retry: 1,
  });
};






























































