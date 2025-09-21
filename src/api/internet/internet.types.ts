export type IGetInternetPlans = {
  currency: string;
  isEnabled?: boolean;
};

export type IGetInternetVariationsPayload = {
  billerCode: string;
};

export type IPayInternet = {
  amount: number;
  itemCode: string;
  billerCode: string;
  billerNumber: string;
  currency: string;
  addBeneficiary?: boolean;
  walletPin: string;
};

export type IVerifyInternetNumber = {
  itemCode: string;
  billerCode: string;
  billerNumber: string;
};
