"use client";

import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { MdFaceUnlock } from "react-icons/md";
import { BsFingerprint } from "react-icons/bs";
import CustomButton from "@/components/shared/Button";
import SuccessToast from "@/components/toast/SuccessToast";
import * as BiometricService from "@/services/biometric.service";
import { useBiometricChallenge, useBiometricLogin } from "@/api/user/user.queries";
import useNavigate from "@/hooks/useNavigate";
import useUserStore from "@/store/user.store";
import Cookies from "js-cookie";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  identifier: string;
}

type BiometricStep = "select" | "authenticating" | "success" | "error";

const BiometricLoginModal: React.FC<Props> = ({ isOpen, onClose, identifier }) => {
  const navigate = useNavigate();
  const { setUser, setIsLoggedIn } = useUserStore();
  const [step, setStep] = useState<BiometricStep>("select");
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

    // Trigger biometric prompt
    const biometricSuccess = await BiometricService.triggerBiometricPrompt(selectedType!);
    if (!biometricSuccess) {
      setErrorMessage("Biometric authentication cancelled or failed");
      setStep("error");
      return;
    }

    // Sign the challenge
    const signatureResult = await BiometricService.signChallenge(challenge);
    if (!signatureResult) {
      setErrorMessage("Failed to sign challenge");
      setStep("error");
      return;
    }

    // Get stored biometric info for public key
    const biometricInfo = BiometricService.getStoredBiometricInfo();
    if (!biometricInfo?.publicKey) {
      setErrorMessage("Biometric not enrolled on this device");
      setStep("error");
      return;
    }

    // Call biometric login
    loginMutate({
      identifier,
      deviceId,
      signature: signatureResult.signature,
      challenge,
      publicKey: biometricInfo.publicKey,
    });
  };

  const { mutate: getChallenge, isPending: challengePending } = useBiometricChallenge(
    onChallengeError,
    onChallengeSuccess
  );

  const onLoginError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage) ? errorMessage : [errorMessage || "Biometric login failed"];
    setErrorMessage(descriptions[0] || "Biometric login failed");
    setStep("error");
  };

  const onLoginSuccess = (data: any) => {
    const token = data?.data?.accessToken;
    const user = data?.data?.user;

    if (token) {
      // Note: This cookie is NOT HttpOnly because it's set client-side.
      // Prefer moving auth cookie setting to the backend (HttpOnly + Secure + SameSite) for stronger security.
      Cookies.set("accessToken", token, {
        expires: 7,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
      setUser(user);
      setIsLoggedIn(true);
      setStep("success");

      setTimeout(() => {
        SuccessToast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        navigate("/user/dashboard");
        onClose();
      }, 1500);
    } else {
      setErrorMessage("No token received");
      setStep("error");
    }
  };

  const { mutate: loginMutate, isPending: loginPending } = useBiometricLogin(onLoginError, onLoginSuccess);

  const handleBiometricSelect = (type: "fingerprint" | "faceid") => {
    setSelectedType(type);
    setStep("authenticating");
    setErrorMessage("");

    // Request challenge
    getChallenge({
      identifier,
      deviceId,
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
            <h3 className="text-white text-lg font-semibold">Biometric Login</h3>
            <p className="text-white/60 text-sm mt-1">
              {step === "select" && "Choose your authentication method"}
              {step === "authenticating" && "Authenticating..."}
              {step === "success" && "Login successful!"}
              {step === "error" && "Authentication failed"}
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
                <p className="text-white/60 text-sm">Use your fingerprint</p>
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
                <p className="text-white/60 text-sm">Use your face</p>
              </div>
            </button>
          </div>
        )}

        {step === "authenticating" && (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-[#FF6B2C] animate-spin" />
            <p className="text-white/80 text-center">
              {selectedType === "fingerprint" ? "Place your finger on the sensor..." : "Position your face..."}
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
            <p className="text-white text-center">Authentication successful!</p>
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

export default BiometricLoginModal;
