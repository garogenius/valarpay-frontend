/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  biometricEnrollRequest,
  biometricLoginRequest,
  biometricChallengeRequest,
  biometricStatusRequest,
  biometricDisableRequest,
} from "./biometric.apis";
import { IBiometricStatusResponse } from "./biometric.types";

export const useBiometricEnroll = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  return useMutation({
    mutationFn: biometricEnrollRequest,
    onError,
    onSuccess,
  });
};

export const useBiometricLogin = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  return useMutation({
    mutationFn: biometricLoginRequest,
    onError,
    onSuccess,
  });
};

export const useBiometricChallenge = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  return useMutation({
    mutationFn: biometricChallengeRequest,
    onError,
    onSuccess,
  });
};

export const useBiometricStatus = (deviceId: string) => {
  return useQuery<IBiometricStatusResponse>({
    queryKey: ["biometric-status", deviceId],
    queryFn: async () => (await biometricStatusRequest(deviceId)).data,
    enabled: !!deviceId,
  });
};

export const useBiometricDisable = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  return useMutation({
    mutationFn: biometricDisableRequest,
    onError,
    onSuccess,
  });
};