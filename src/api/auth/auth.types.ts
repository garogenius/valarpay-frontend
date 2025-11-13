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
  countryCode: string;
  isBusinessRegistered?: boolean;
  businessName?: string;
  currency?: string;
}

export interface IVerifyEmail {
  username: string;
  otpCode: string;
}

export interface IResendVerificationCode {
  username: string;
}

export interface IForgotPassword {
  username: string;
}

export interface IResetPassword {
  username: string;
  password: string;
  confirmPassword: string;
}
