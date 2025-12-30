import { request } from "@/utils/axios-utils";
import {
  IRegister,
  ILogin,
  IForgotPassword,
  IVerifyEmail,
  IResendVerificationCode,
  IResetPassword,
} from "./auth.types";

export const registerRequest = async (formdata: IRegister) => {
  // baseURL already includes /api/v1, so use /user/register
  return request({ url: "/user/register", method: "post", data: formdata });
};

export const registerBusiness = async (formdata: IRegister) => {
  return request({ url: "/user/register-business", method: "post", data: formdata });
};


export const loginRequest = async (formdata: ILogin) => {
  return request({ url: "/auth/login", method: "post", data: formdata });
};

export const verifyEmailRequest = async (formdata: IVerifyEmail) => {
  return request({ url: "/user/verify-email", method: "post", data: formdata });
};

export const verifyResetEmailRequest = async (formdata: IVerifyEmail) => {
  return request({
    url: "/user/verify-email",
    method: "post",
    data: formdata,
  });
};

export const resendVerificationCodeRequest = async (
  formdata: IResendVerificationCode
) => {
  return request({
    url: "/auth/resend-2fa",
    method: "post",
    data: formdata,
  });
};

export const verify2faCodeRequest = async (formdata: IVerifyEmail) => {
  return request({
    url: "/auth/verify-2fa",
    method: "post",
    data: formdata,
  });
};

export const resend2faCodeRequest = async (
  formdata: IResendVerificationCode
) => {
  return request({
    url: "/auth/resend-2fa",
    method: "post",
    data: formdata,
  });
};

export const forgotPasswordRequest = async (formdata: IForgotPassword) => {
  return request({
    url: "/user/forgot-password",
    method: "post",
    data: formdata,
  });
};

export const resetPasswordRequest = async (formdata: IResetPassword) => {
  return request({
    url: "/user/reset-password",
    method: "post",
    data: formdata,
  });
};
