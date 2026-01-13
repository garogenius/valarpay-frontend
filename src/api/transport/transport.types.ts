export type IGetTransportPlans = {
  currency?: string;
};

export type IGetTransportBillInfo = {
  billerCode: string;
};

export type IPayTransport = {
  itemCode: string;
  billerCode: string;
  billerNumber: string;
  currency: string;
  amount: number;
  walletPin: string;
  addBeneficiary?: boolean;
};


























