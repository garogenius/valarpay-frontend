export type IDataPlan = {
  phone: string;
  currency: string;
};

export type IDataVariationPayload = {
  operatorId?: number;
};

export type IDataPayPayload = {
  amount: number;
  operatorId: number;
  phone: string;
  currency: string;
  addBeneficiary?: boolean;
  walletPin: string;
};
