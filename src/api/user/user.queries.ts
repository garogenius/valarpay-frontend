/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changePasswordRequest,
  createPinRequest,
  getBeneficiariesRequest,
  getUser,
  reportScamRequest,
  resetOtpRequest,
  resetPinRequest,
  tier2VerificationRequest,
  tier3VerificationRequest,
  updateUserRequest,
  validatePhoneNumberRequest,
  verifyPhoneNumberRequest,
  verifyWalletPinRequest,
  uploadDocumentRequest,
  biometricChallengeRequest,
  biometricEnrollRequest,
  biometricLoginRequest,
  biometricDisableRequest,
  biometricStatusRequest,
  changePinRequest,
  createPasscodeRequest,
  changePasscodeRequest,
} from "./user.apis";
import {
  BENEFICIARY_TYPE,
  BeneficiaryProps,
  BILL_TYPE,
  TRANSFER_TYPE,
  User,
} from "@/constants/types";

export const useGetUser = () => {
  const { data, isError, isSuccess, error } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    // Run in the background
    refetchOnWindowFocus: true,
    // Refetch every 5 minutes
    refetchInterval: 5 * 60 * 1000,
    // Keep fetching even when window/tab is not active
    refetchIntervalInBackground: true,
    // Prevent unnecessary loading states
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    // If error occurs, retry once
    retry: 1,
  });
  const user: User = data?.data;

  return { user, isError, isSuccess, error };
};

export const useUpdateUser = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserRequest,
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      onSuccess(data);
    },
  });
};

export const useCreatePin = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPinRequest,
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      onSuccess(data);
    },
  });
};

export const useResetOtp = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  return useMutation({
    mutationFn: resetOtpRequest,
    onError,
    onSuccess,
  });
};

export const useResetPin = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  return useMutation({
    mutationFn: resetPinRequest,
    onError,
    onSuccess,
  });
};

export const useChangePassword = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  return useMutation({
    mutationFn: changePasswordRequest,
    onError,
    onSuccess,
  });
};

export const useReportScam = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  return useMutation({
    mutationFn: reportScamRequest,
    onError,
    onSuccess,
  });
};

export const useTier2Verification = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tier2VerificationRequest,
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      onSuccess(data);
    },
  });
};

export const useTier3Verification = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tier3VerificationRequest,
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      onSuccess(data);
    },
  });
};

export const useGetBeneficiaries = ({
  category,
  transferType,
  billType,
}: {
  category: BENEFICIARY_TYPE;
  transferType?: TRANSFER_TYPE;
  billType?: BILL_TYPE;
}) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["get-beneficiaries", { category, transferType, billType }],

    queryFn: () =>
      getBeneficiariesRequest({ category, transferType, billType }),
  });

  const beneficiaries: BeneficiaryProps[] = data?.data?.data;

  return { beneficiaries, isPending, isError };
};

export const useValidatePhoneNumber = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  return useMutation({
    mutationFn: validatePhoneNumberRequest,
    onError,
    onSuccess,
  });
};

export const useVerifyPhoneNumber = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  return useMutation({
    mutationFn: verifyPhoneNumberRequest,
    onError,
    onSuccess,
  });
};

export const useVerifyWalletPin = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  return useMutation({
    mutationFn: verifyWalletPinRequest,
    onError,
    onSuccess,
  });
};

export const useUploadDocument = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadDocumentRequest,
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      onSuccess(data);
    },
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

export const useBiometricStatus = (deviceId: string) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["biometric-status", deviceId],
    queryFn: () => biometricStatusRequest(deviceId),
    enabled: !!deviceId,
  });

  return { 
    status: data?.data?.data, 
    isPending, 
    isError 
  };
};

export const useChangePin = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { oldPin: string; newPin: string }) => changePinRequest(payload),
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      onSuccess(data);
    },
  });
};

export const useCreatePasscode = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { passcode: string }) => createPasscodeRequest(payload),
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      onSuccess(data);
    },
  });
};

export const useChangePasscode = (
  onError: (error: any) => void,
  onSuccess: (data: any) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { oldPasscode: string; newPasscode: string }) => changePasscodeRequest(payload),
    onError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      onSuccess(data);
    },
  });
};
