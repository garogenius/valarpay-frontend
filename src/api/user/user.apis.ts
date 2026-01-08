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
  IChangePin,
  ICreatePasscode,
  IChangePasscode,
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
    headers: {
      "Content-Type": "multipart/form-data",
    },
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
    url: "/user/validate-phonenumber",
    method: "post",
    data: formdata,
  });
};

export const verifyPhoneNumberRequest = async (
  formdata: IVerifyPhoneNumber
) => {
  return request({
    url: "/user/verify-phonenumber",
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

export const createBusinessAccountRequest = async (formdata: any) => {
  return request({
    url: "/user/create-business-account",
    method: "post",
    data: formdata,
  });
};

export const verifyNinRequest = async (formdata: any) => {
  return request({
    url: "/user/verify-nin",
    method: "post",
    data: formdata,
  });
};

export const checkUserExistenceRequest = async (formdata: any) => {
  return request({
    url: "/user/existance-check",
    method: "post",
    data: formdata,
  });
};

export const validateEmailRequest = async (formdata: any) => {
  return request({
    url: "/user/validate-email",
    method: "post",
    data: formdata,
  });
};

export const verifyEmailRequest = async (formdata: any) => {
  return request({
    url: "/user/verify-email",
    method: "post",
    data: formdata,
  });
};

export const changePinRequest = async (formdata: IChangePin) => {
  return request({
    url: "/user/change-pin",
    method: "put",
    data: formdata,
  });
};

export const createPasscodeRequest = async (formdata: ICreatePasscode) => {
  return request({
    url: "/user/create-passcode",
    method: "post",
    data: formdata,
  });
};

export const changePasscodeRequest = async (formdata: IChangePasscode) => {
  return request({
    url: "/user/change-passcode",
    method: "put",
    data: formdata,
  });
};

export const deleteUserRequest = async (userId: string) => {
  return request({
    url: `/user/${userId}`,
    method: "delete",
  });
};

export const getStatisticsLineChartRequest = async (query?: {
  startDate?: string;
  endDate?: string;
}) => {
  const queryParams = new URLSearchParams();
  if (query?.startDate) queryParams.set("startDate", query.startDate);
  if (query?.endDate) queryParams.set("endDate", query.endDate);
  return request({
    url: `/user/statistics-line-chart${queryParams.toString() ? `?${queryParams.toString()}` : ""}`,
    method: "get",
  });
};

export const getStatisticsPieChartRequest = async (query?: {
  startDate?: string;
  endDate?: string;
}) => {
  const queryParams = new URLSearchParams();
  if (query?.startDate) queryParams.set("startDate", query.startDate);
  if (query?.endDate) queryParams.set("endDate", query.endDate);
  return request({
    url: `/user/statistics-pie-chart${queryParams.toString() ? `?${queryParams.toString()}` : ""}`,
    method: "get",
  });
};

export const requestChangePasswordRequest = async () => {
  return request({
    url: "/user/request-change-password",
    method: "get",
  });
};
