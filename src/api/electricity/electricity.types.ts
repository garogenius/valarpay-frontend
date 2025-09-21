export type IGetElectricityPlans = {
  currency: string;
  isEnabled?: boolean;
};

export type IGetElectricityVariationsPayload = {
  billerCode: string;
};

export type IPayElectricity = {
  amount: number;
  itemCode: string;
  billerCode: string;
  billerNumber: string;
  currency: string;
  addBeneficiary?: boolean;
  walletPin: string;
};

export type IVerifyElectricityNumber = {
  itemCode: string;
  billerCode: string;
  billerNumber: string;
};
