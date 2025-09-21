export type IGetCablePlans = {
  currency: string;
  isEnabled?: boolean;
};

export type IGetCableVariationsPayload = {
  billerCode: string;
};

export type IPayCable = {
  amount: number;
  itemCode: string;
  billerCode: string;
  billerNumber: string;
  currency: string;
  addBeneficiary?: boolean;
  walletPin: string;
};

export type IVerifyCableNumber = {
  itemCode: string;
  billerCode: string;
  billerNumber: string;
};
