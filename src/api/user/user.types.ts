export interface IUpdateUser {
  fullname: string;
  phoneNumber: string;
  dateOfBirth: string;
}

export interface IUpdateUserCurrency {
  currency: string;
}

export interface ICreatePin {
  pin: string;
}

export interface IResetPin {
  pin: string;
  confirmPin: string;
  otpCode: string;
}

export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
}

export interface IReportScam {
  title: string;
  description: string;
}

export interface ITier2Verification {
  nin: string;
  // selfieImage: string;
}

export interface ITier3Verification {
  city: string;
  state: string;
  address: string;
}

export interface IVerifyPhoneNumber {
  email: string;
  otp: string;
}

export interface IValidatePhoneNumber {
  email: string;
  phoneNumber: string;
}
