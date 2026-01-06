"use client";

import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { BsFingerprint } from "react-icons/bs";
import { MdFaceUnlock } from "react-icons/md";
import CustomButton from "@/components/shared/Button";
import SuccessToast from "@/components/toast/SuccessToast";
import * as BiometricService from "@/services/biometric.service";
import { useBiometricChallenge, useBiometricEnroll } from "@/api/user/user.queries";
import useUserStore from "@/store/user.store";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type EnrollmentStep = "select" | "setup" | "scanning" | "success" | "error";

const BiometricEnrollmentModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useUserStore();
  const [step, setStep] = useState<EnrollmentStep>("select");
  const [selectedType, setSelectedType] = useState<"fingerprint" | "faceid" | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [deviceId] = useState(() => BiometricService.getDeviceId());

  const onChallengeError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage) ? errorMessage : [errorMessage || "Failed to get challenge"];
    setErrorMessage(descriptions[0] || "Failed to get challenge");
    setStep("error");
  };

  const onChallengeSuccess = async (data: any) => {
    const challenge = data?.data?.data?.challenge;
    if (!challenge) {
      setErrorMessage("Invalid challenge received");
      setStep("error");
      return;
    }

    // Store challenge for signing
    BiometricService.storeChallenge(challenge, data?.data?.data?.expiresIn || 300);

    // Move to scanning step
    setStep("scanning");

    // Trigger biometric prompt
    const biometricSuccess = await BiometricService.triggerBiometricPrompt(selectedType!);
    if (!biometricSuccess) {
      setErrorMessage("Biometric authentication cancelled or failed");
      setStep("error");
      return;
    }

    // Generate key pair for enrollment
    const keyPair = await BiometricService.generateKeyPair();
    if (!keyPair) {
      setErrorMessage("Failed to generate encryption keys");
      setStep("error");
      return;
    }

    // Sign the challenge
    const signature = await BiometricService.signChallenge(challenge);
    if (!signature) {
      setErrorMessage("Failed to sign challenge");
      setStep("error");
      return;
    }

    // Store biometric info locally
    const biometricInfo: BiometricService.BiometricInfo = {
      deviceId,
      biometricType: selectedType,
      deviceName: BiometricService.getDeviceName(),
      publicKey: keyPair.publicKey,
      enrolledAt: new Date().toISOString(),
    };
    BiometricService.storeBiometricInfo(biometricInfo);

    // Call enrollment API
    if (!selectedType) {
      // Type guard - selectedType cannot be null here due to UI flow, but TypeScript needs this check
      return;
    }
    enrollMutate({
      deviceId,
      biometricType: selectedType,
      deviceName: biometricInfo.deviceName,
      publicKey: keyPair.publicKey,
    });
  };

  const { mutate: getChallenge, isPending: challengePending } = useBiometricChallenge(
    onChallengeError,
    onChallengeSuccess
  );

  const onEnrollError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage) ? errorMessage : [errorMessage || "Enrollment failed"];
    setErrorMessage(descriptions[0] || "Enrollment failed");
    setStep("error");
  };

  const onEnrollSuccess = () => {
    setStep("success");
    setTimeout(() => {
      SuccessToast({
        title: "Biometric Enrollment Successful",
        description: `${selectedType === "fingerprint" ? "Fingerprint" : "Face ID"} has been enrolled successfully.`,
      });
      onSuccess?.();
      onClose();
    }, 1500);
  };

  const { mutate: enrollMutate, isPending: enrollPending } = useBiometricEnroll(onEnrollError, onEnrollSuccess);

  const handleBiometricSelect = (type: "fingerprint" | "faceid") => {
    setSelectedType(type);
    setStep("setup");
    setErrorMessage("");

    // Request challenge
    getChallenge({
      deviceId,
      identifier: user?.email || user?.phoneNumber || user?.username || "",
    });
  };

  const handleRetry = () => {
    setStep("select");
    setSelectedType(null);
    setErrorMessage("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-white text-lg font-semibold">Set Up Biometric Login</h3>
            <p className="text-white/60 text-sm mt-1">
              {step === "select" && "Choose your authentication method"}
              {step === "setup" && "Getting ready..."}
              {step === "scanning" && "Scanning..."}
              {step === "success" && "Setup complete!"}
              {step === "error" && "Setup failed"}
            </p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <IoClose className="text-2xl" />
          </button>
        </div>

        {/* Content */}
        {step === "select" && (
          <div className="space-y-3">
            <button
              onClick={() => handleBiometricSelect("fingerprint")}
              disabled={challengePending}
              className="w-full p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50 transition-colors flex items-center gap-3"
            >
              <BsFingerprint className="text-2xl text-[#FF6B2C]" />
              <div className="text-left">
                <p className="text-white font-medium">Fingerprint</p>
                <p className="text-white/60 text-sm">Use your fingerprint to log in</p>
              </div>
            </button>

            <button
              onClick={() => handleBiometricSelect("faceid")}
              disabled={challengePending}
              className="w-full p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50 transition-colors flex items-center gap-3"
            >
              <MdFaceUnlock className="text-2xl text-[#FF6B2C]" />
              <div className="text-left">
                <p className="text-white font-medium">Face ID</p>
                <p className="text-white/60 text-sm">Use your face to log in</p>
              </div>
            </button>
          </div>
        )}

        {(step === "setup" || step === "scanning") && (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-[#FF6B2C] animate-spin" />
            <p className="text-white/80 text-center">
              {step === "setup" && "Preparing your device..."}
              {step === "scanning" && (selectedType === "fingerprint" ? "Place your finger on the sensor..." : "Position your face...")}
            </p>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-white text-center">Biometric enrollment successful!</p>
          </div>
        )}

        {step === "error" && (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-white text-center">{errorMessage}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex gap-3 mt-6">
          {step === "error" && (
            <>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10"
              >
                Cancel
              </button>
              <CustomButton
                onClick={handleRetry}
                className="flex-1 py-3 bg-[#FF6B2C] hover:bg-[#FF7A3D] text-black"
              >
                Retry
              </CustomButton>
            </>
          )}
          {step !== "error" && step !== "success" && (
            <button
              onClick={onClose}
              className="w-full py-3 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BiometricEnrollmentModal;
