import { request } from "@/utils/axios-utils";
import {
  IChangePassword,
  ICreatePin,
  IResetPin,
  ITier2Verification,
  ITier3Verification,
  IValidatePhoneNumber,
  IVerifyPhoneNumber,
  IVerifyWalletPin,
  IUploadDocument,
  IBiometricChallenge,
  IBiometricEnroll,
  IBiometricLogin,
  IBiometricDisable,
} from "./user.types";
import { BENEFICIARY_TYPE, BILL_TYPE, TRANSFER_TYPE } from "@/constants/types";

export const getUser = () => {
  return request({ url: `/user/me` });
};

export const updateUserRequest = async (formData: FormData) => {
  return request({
    url: "/user/edit-profile",
    method: "put",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data", // Important for file upload
    },
  });
};

export const createPinRequest = async (formdata: ICreatePin) => {
  return request({
    url: "/user/set-wallet-pin",
    method: "post",
    data: formdata,
  });
};

export const resetOtpRequest = async () => {
  return request({
    url: "/user/forget-pin",
    method: "post",
  });
};

export const resetPinRequest = async (formdata: IResetPin) => {
  return request({
    url: "/user/reset-pin",
    method: "post",
    data: formdata,
  });
};

export const changePasswordRequest = async (formdata: IChangePassword) => {
  return request({
    url: "/user/change-password",
    method: "put",
    data: formdata,
  });
};

export const reportScamRequest = async (formdata: FormData) => {
  return request({
    url: "/user/report-scam",
    method: "post",
    data: formdata,
  });
};

export const tier2VerificationRequest = async (
  formdata: ITier2Verification
) => {
  return request({
    url: "/user/kyc-tier2",
    method: "post",
    data: formdata,
  });
};

export const tier3VerificationRequest = async (
  formdata: ITier3Verification
) => {
  return request({
    url: "/user/kyc-tier3",
    method: "post",
    data: formdata,
  });
};

export const getBeneficiariesRequest = async ({
  category,
  transferType,
  billType,
}: {
  category: BENEFICIARY_TYPE;
  transferType?: TRANSFER_TYPE;
  billType?: BILL_TYPE;
}) => {
  const url =
    `/user/get-beneficiaries?category=${category}` +
    (transferType ? `&transferType=${transferType}` : "") +
    (billType ? `&billType=${billType}` : "");
  return request({ url });
};

export const validatePhoneNumberRequest = async (
  formdata: IValidatePhoneNumber
) => {
  return request({
    url: "/user/validate-phoneNumber",
    method: "post",
    data: formdata,
  });
};

export const verifyPhoneNumberRequest = async (
  formdata: IVerifyPhoneNumber
) => {
  return request({
    url: "/user/verify-phoneNumber",
    method: "post",
    data: formdata,
  });
};

export const verifyWalletPinRequest = async (formdata: IVerifyWalletPin) => {
  return request({
    url: "/user/verify-wallet-pin",
    method: "post",
    data: formdata,
  });
};

export const uploadDocumentRequest = async (formData: FormData) => {
  return request({
    url: "/user/upload-document",
    method: "post",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const biometricChallengeRequest = async (formdata: IBiometricChallenge) => {
  return request({
    url: "/auth/biometric/challenge",
    method: "post",
    data: formdata,
  });
};

export const biometricEnrollRequest = async (formdata: IBiometricEnroll) => {
  return request({
    url: "/auth/biometric/enroll",
    method: "post",
    data: formdata,
  });
};

export const biometricLoginRequest = async (formdata: IBiometricLogin) => {
  return request({
    url: "/auth/biometric/login",
    method: "post",
    data: formdata,
  });
};

export const biometricDisableRequest = async (formdata: IBiometricDisable) => {
  return request({
    url: "/auth/biometric/disable",
    method: "post",
    data: formdata,
  });
};

export const biometricStatusRequest = async (deviceId: string) => {
  return request({
    url: `/auth/biometric/status?deviceId=${deviceId}`,
    method: "get",
  });
};
