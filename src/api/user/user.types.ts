export interface IUpdateUser {
  fullName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  employmentStatus?: string;
  occupation?: string;
  primaryPurpose?: string;
  sourceOfFunds?: string;
  expectedMonthlyInflow?: number;
  passportNumber?: string;
  passportCountry?: string;
}

export interface IUploadDocument {
  documentType: "passport" | "bank_statement" | "utility_bill" | "drivers_license" | "national_id" | "other";
  document: File;
  documentNumber?: string;
  documentCountry?: string;
  issueDate?: string;
  expiryDate?: string;
}

export interface IBiometricChallenge {
  identifier: string;
  deviceId: string;
}

export interface IBiometricEnroll {
  deviceId: string;
  publicKey: string;
  biometricType: "fingerprint" | "faceid";
  deviceName: string;
}

export interface IBiometricLogin {
  identifier: string;
  deviceId: string;
  signature: string;
  challenge: string;
  publicKey: string;
}

export interface IBiometricDisable {
  deviceId: string;
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
  phoneNumber: string;
  otpCode: string;
}

export interface IValidatePhoneNumber {
  phoneNumber: string;
}

export interface IVerifyWalletPin {
  pin: string;
}

export interface IChangePin {
  oldPin: string;
  newPin: string;
}

export interface ICreatePasscode {
  passcode: string;
}

export interface IChangePasscode {
  oldPasscode: string;
  newPasscode: string;
}
