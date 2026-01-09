export type EducationBiller = {
  id?: string | number;
  billerId?: string;
  billerCode: string;
  billerName?: string;
  name?: string;
  category?: string;
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

// JAMB & WAEC Types
export type JambWaecPlan = {
  id: number;
  name: string;
  amount: number;
  itemCode?: string;
};

export type JambWaecPlanData = {
  billerCode: string;
  billerName: string;
  plans: JambWaecPlan[];
};

export type IVerifyJambWaec = {
  itemCode: string;
  billerCode: string;
  billerNumber: string;
};

export type VerifiedJambWaec = {
  customerName?: string;
  candidateNumber?: string;
  registrationNumber?: string;
  amount?: number;
};

export type IPayJambWaec = {
  itemCode: string;
  billerCode: string;
  currency: string;
  billerNumber: string;
  amount: number;
  walletPin: string;
  addBeneficiary?: boolean;
};

// School fee bill info types
export type SchoolFeePlan = {
  id: number;
  name: string;
  amount: number;
  itemCode?: string;
};

export type SchoolBillInfo = {
  billerCode: string;
  billerName: string;
  plans: SchoolFeePlan[];
};





















































