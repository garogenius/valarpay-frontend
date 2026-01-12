/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import CustomButton from "@/components/shared/Button";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import {
  handleNumericKeyDown,
  handleNumericPaste,
} from "@/utils/utilityFunctions";
import { useBvnVerificationWithSelfie, useCreateAccount } from "@/api/wallet/wallet.queries";
import useUserStore from "@/store/user.store";
import { FaCamera, FaUpload, FaTimes } from "react-icons/fa";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useOnClickOutside from "@/hooks/useOnClickOutside";

interface BvnVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type VerificationMethod = "otp" | "faceid" | null;

const BvnVerificationModal: React.FC<BvnVerificationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useUserStore();
  const [bvn, setBvn] = useState("");
  const [verificationMethod, setVerificationMethod] = useState<VerificationMethod>(null);
  const [selfieImage, setSelfieImage] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useOnClickOutside(datePickerRef as React.RefObject<HTMLElement>, () => {
    setShowDatePicker(false);
  });

  const ngnWallet = user?.wallet?.find((w) => w.currency === "NGN");
  const hasNgnWallet = !!ngnWallet;

  const resetForm = () => {
    setBvn("");
    setVerificationMethod(null);
    setSelfieImage("");
    setDateOfBirth(null);
    setPreviewUrl("");
    setShowDatePicker(false);
    stopCamera();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraReady(false);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraReady(true);
        videoRef.current.onloadedmetadata = () => {
          setIsCameraReady(true);
        };
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      ErrorToast({
        title: "Camera Error",
        descriptions: ["Unable to access camera. Please check permissions."],
      });
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (video) {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0);
        const base64Image = canvas.toDataURL("image/png");
        setPreviewUrl(base64Image);
        setSelfieImage(base64Image);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        setSelfieImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setDateOfBirth(date);
      setShowDatePicker(false);
    }
  };

  const formatDateForAPI = (date: Date): string => {
    // API expects YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Face ID + Selfie flow
  const onFaceIdError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage)
      ? errorMessage
      : [errorMessage];
    ErrorToast({
      title: "BVN Verification Failed",
      descriptions,
    });
  };

  const onFaceIdSuccess = (data: any) => {
    SuccessToast({
      title: "BVN Verified Successfully",
      description: data?.data?.message || "Your BVN has been verified successfully.",
    });
    handleClose();
    onSuccess?.();
  };

  const {
    mutate: verifyWithSelfie,
    isPending: selfiePending,
  } = useBvnVerificationWithSelfie(onFaceIdError, onFaceIdSuccess);

  // OTP / Create Account flow
  const onCreateAccountError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage)
      ? errorMessage
      : [errorMessage];
    
    // Handle 406 - wallet already exists
    if (error?.response?.status === 406) {
      ErrorToast({
        title: "Wallet Already Exists",
        descriptions: ["You already have an NGN wallet. No need to create another one."],
      });
    } else {
      ErrorToast({
        title: "Account Creation Failed",
        descriptions,
      });
    }
  };

  const onCreateAccountSuccess = (data: any) => {
    SuccessToast({
      title: "Account Created Successfully",
      description: data?.data?.message || "Your account has been created successfully.",
    });
    handleClose();
    onSuccess?.();
  };

  const {
    mutate: createAccount,
    isPending: createAccountPending,
  } = useCreateAccount(onCreateAccountError, onCreateAccountSuccess);

  const handleVerifyWithFaceId = () => {
    if (!bvn || bvn.length !== 11) {
      ErrorToast({
        title: "Invalid BVN",
        descriptions: ["BVN must be exactly 11 digits"],
      });
      return;
    }

    if (!selfieImage) {
      ErrorToast({
        title: "Selfie Required",
        descriptions: ["Please capture or upload a selfie"],
      });
      return;
    }

    if (!dateOfBirth) {
      ErrorToast({
        title: "Date of Birth Required",
        descriptions: ["Please select your date of birth"],
      });
      return;
    }

    verifyWithSelfie({
      bvn,
      selfieImage,
      dateOfBirth: formatDateForAPI(dateOfBirth),
    });
  };

  const handleVerifyWithOtp = () => {
    if (!bvn || bvn.length !== 11) {
      ErrorToast({
        title: "Invalid BVN",
        descriptions: ["BVN must be exactly 11 digits"],
      });
      return;
    }

    if (hasNgnWallet) {
      ErrorToast({
        title: "Wallet Already Exists",
        descriptions: ["You already have an NGN wallet. No need to create another one."],
      });
      return;
    }

    createAccount({ bvn });
  };

  const isLoading = selfiePending || createAccountPending;
  const canProceedWithFaceId = bvn.length === 11 && !!selfieImage && !!dateOfBirth;
  const canProceedWithOtp = bvn.length === 11 && !hasNgnWallet;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60"
          onClick={handleClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-[#1C1C1E] rounded-2xl border border-gray-800 p-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-lg font-semibold">Enter your BVN</h2>
            <button
              onClick={handleClose}
              className="p-1 rounded-lg hover:bg-[#2C2C2E] text-gray-400 hover:text-white transition-colors"
              disabled={isLoading}
            >
              <IoClose className="w-5 h-5" />
            </button>
          </div>

          {/* BVN Input */}
          <div className="mb-6">
            <label className="block text-sm text-gray-300 mb-2">BVN</label>
            <input
              type="text"
              value={bvn}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 11);
                setBvn(value);
              }}
              onKeyDown={handleNumericKeyDown}
              onPaste={handleNumericPaste}
              placeholder="Enter 11-digit BVN"
              className="w-full bg-[#2C2C2E] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B2C] focus:border-transparent"
              disabled={isLoading}
            />
            <p className="mt-2 text-xs text-gray-400">
              Your BVN is secured with us. It only gives us access to your phone number, full name, gender, and date of birth.
            </p>
          </div>

          {/* Verification Method Selection */}
          {bvn.length === 11 && !verificationMethod && (
            <div className="mb-6 space-y-3">
              <p className="text-sm text-gray-300 mb-3">Choose verification method:</p>
              
              <button
                onClick={() => setVerificationMethod("faceid")}
                className="w-full bg-[#2C2C2E] border border-gray-700 rounded-lg px-4 py-4 text-left hover:bg-[#3A3A3C] transition-colors"
                disabled={isLoading}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FF6B2C]/20 flex items-center justify-center">
                    <FaCamera className="text-[#FF6B2C] text-lg" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Verify with Face ID</p>
                    <p className="text-xs text-gray-400">Capture selfie and provide date of birth</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setVerificationMethod("otp")}
                className="w-full bg-[#2C2C2E] border border-gray-700 rounded-lg px-4 py-4 text-left hover:bg-[#3A3A3C] transition-colors"
                disabled={isLoading || hasNgnWallet}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FF6B2C]/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#FF6B2C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">Verify with OTP</p>
                    <p className="text-xs text-gray-400">
                      {hasNgnWallet ? "Wallet already exists" : "Create account with BVN verification"}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Face ID Flow */}
          {verificationMethod === "faceid" && (
            <div className="space-y-4 mb-6">
              {/* Selfie Capture */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Selfie</label>
                {previewUrl ? (
                  <div className="relative">
                    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
                      <Image
                        src={previewUrl}
                        alt="Selfie preview"
                        width={400}
                        height={300}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <button
                      onClick={() => {
                        setPreviewUrl("");
                        setSelfieImage("");
                      }}
                      className="mt-2 text-red-500 hover:text-red-700 flex items-center gap-2 text-sm"
                      disabled={isLoading}
                    >
                      <FaTimes /> Remove Photo
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {isCameraReady ? (
                      <div className="relative">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full aspect-video bg-black rounded-lg"
                          style={{ transform: "scaleX(-1)" }}
                        />
                        <div className="mt-3 flex gap-3">
                          <button
                            onClick={capturePhoto}
                            className="flex-1 bg-[#FF6B2C] text-white px-4 py-2 rounded-lg hover:bg-[#FF6B2C]/90 transition-colors"
                          >
                            Capture
                          </button>
                          <button
                            onClick={stopCamera}
                            className="flex-1 bg-[#2C2C2E] text-white px-4 py-2 rounded-lg hover:bg-[#3A3A3C] transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <button
                          onClick={startCamera}
                          className="flex items-center gap-2 bg-[#FF6B2C] text-white px-4 py-3 rounded-lg hover:bg-[#FF6B2C]/90 transition-colors flex-1 justify-center"
                          disabled={isLoading}
                        >
                          <FaCamera className="text-lg" />
                          Open Camera
                        </button>
                        <label className="flex items-center gap-2 bg-[#2C2C2E] text-white px-4 py-3 rounded-lg cursor-pointer hover:bg-[#3A3A3C] transition-colors flex-1 justify-center">
                          <FaUpload className="text-lg" />
                          <span>Upload</span>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileUpload}
                            disabled={isLoading}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Date of Birth</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="w-full bg-[#2C2C2E] border border-gray-700 rounded-lg px-4 py-3 text-left text-white"
                    disabled={isLoading}
                  >
                    {dateOfBirth
                      ? formatDateForAPI(dateOfBirth)
                      : "Select Date of Birth (DD-MM-YYYY)"}
                  </button>
                  {showDatePicker && (
                    <div ref={datePickerRef} className="absolute z-10 mt-1">
                      <DatePicker
                        selected={dateOfBirth}
                        onChange={handleDateChange}
                        inline
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={100}
                        dropdownMode="select"
                        openToDate={new Date(2000, 0, 1)}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Verify Button */}
              <CustomButton
                onClick={handleVerifyWithFaceId}
                disabled={!canProceedWithFaceId || isLoading}
                isLoading={isLoading}
                className="w-full"
              >
                Verify with Face ID
              </CustomButton>
            </div>
          )}

          {/* OTP Flow */}
          {verificationMethod === "otp" && (
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-4">
                Click below to create your account. An OTP will be sent to the phone number linked to your BVN.
              </p>
              <CustomButton
                onClick={handleVerifyWithOtp}
                disabled={!canProceedWithOtp || isLoading}
                isLoading={isLoading}
                className="w-full"
              >
                Verify with OTP
              </CustomButton>
            </div>
          )}

          {/* Back Button */}
          {verificationMethod && (
            <button
              onClick={() => {
                setVerificationMethod(null);
                setSelfieImage("");
                setPreviewUrl("");
                setDateOfBirth(null);
                stopCamera();
              }}
              className="w-full mt-3 bg-[#2C2C2E] text-white px-4 py-3 rounded-lg hover:bg-[#3A3A3C] transition-colors"
              disabled={isLoading}
            >
              Back
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BvnVerificationModal;

