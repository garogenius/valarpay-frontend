export type EducationBiller = {
  id?: string | number;
  billerCode: string;
  billerName?: string;
  name?: string;
};

export type EducationBillerItem = {
  id?: string | number;
  itemCode: string;
  itemName?: string;
  name?: string;
  amount?: number;
  fee?: number;
  currency?: string;
};

export type IVerifyEducationCustomer = {
  billerCode: string;
  itemCode: string;
  customerId: string;
};

export type VerifiedEducationCustomer = {
  customerName?: string;
  customerId?: string;
  amount?: number;
  billerName?: string;
  itemName?: string;
  [k: string]: any;
};

export type IPayEducation = {
  billerCode: string;
  itemCode: string;
  customerId: string;
  amount: number;
  currency: string;
  walletPin: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  addBeneficiary?: boolean;
};

























