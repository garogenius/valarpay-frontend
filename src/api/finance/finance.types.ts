export interface IGetSavingsInterest {
  type: "fixed-savings" | "target-savings" | "easy-life";
}

export interface IGetDepositInterest {
  type: "fixed-deposit";
}

export interface IGetInvestmentInterest {
  type: "investment";
}

export interface InterestResponse {
  totalInterest: number;
  currency: string;
}


















































































