import { request } from "@/utils/axios-utils";
import {
  IBiometricEnroll,
  IBiometricLogin,
  IBiometricChallenge,
  IBiometricDisable,
  IBiometricStatusResponse,
} from "./biometric.types";

export const biometricEnrollRequest = async (formdata: IBiometricEnroll) => {
  return request({ url: "/auth/biometric/enroll", method: "post", data: formdata });
};

export const biometricLoginRequest = async (formdata: IBiometricLogin) => {
  return request({ url: "/auth/biometric/login", method: "post", data: formdata });
};

export const biometricChallengeRequest = async (formdata: IBiometricChallenge) => {
  return request({ url: "/auth/biometric/challenge", method: "post", data: formdata });
};

export const biometricStatusRequest = async (deviceId: string) => {
  return request({ url: `/auth/biometric/status?deviceId=${deviceId}`, method: "get" });
};

export const biometricDisableRequest = async (formdata: IBiometricDisable) => {
  return request({ url: "/auth/biometric/disable", method: "post", data: formdata });
};