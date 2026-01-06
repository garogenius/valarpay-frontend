export interface ILogin {
  username: string;
  password: string;
  ipAddress: string;
  deviceName: string;
  operatingSystem: string;
}

export interface IRegister {
  email: string;
  password: string;
  username: string;
  fullname: string;
  referralCode?: string;
  dateOfBirth: string;
  phoneNumber: string;
  currency: string;
  accountType?: string;
  countryCode?: string;
  isBusinessRegistered?: boolean;
  businessName?: string;
}

export interface IVerifyEmail {
  email: string;
  otpCode: string;
}

export interface IVerify2fa {
  username: string;
  otpCode: string;
}

export interface IResendVerificationCode {
  email: string;
}

export interface IForgotPassword {
  username: string;
}

export interface IResetPassword {
  username: string;
  password: string;
  confirmPassword: string;
}
