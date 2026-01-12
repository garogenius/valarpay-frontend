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
import { useBvnVerificationWithSelfie } from "@/api/wallet/wallet.queries";
import { FaCamera, FaUpload, FaTimes } from "react-icons/fa";
import Image from "next/image";

interface BvnVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const BvnVerificationModal: React.FC<BvnVerificationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [bvn, setBvn] = useState("");
  const [selfieImage, setSelfieImage] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setBvn("");
    setSelfieImage("");
    setPreviewUrl("");
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

  const toJpegDataUrl = (dataUrl: string): Promise<string> =>
    new Promise((resolve) => {
      if (typeof window === "undefined") {
        resolve(dataUrl);
        return;
      }
      const img = document.createElement("img");
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(dataUrl);
          return;
        }
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg", 0.92));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });

  const capturePhoto = async () => {
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
        const pngDataUrl = canvas.toDataURL("image/png");
        const jpegDataUrl = await toJpegDataUrl(pngDataUrl);
        setPreviewUrl(jpegDataUrl);
        setSelfieImage(jpegDataUrl);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        ErrorToast({
          title: "Invalid File",
          descriptions: ["Please upload an image file (JPEG, PNG, JPG)."],
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = reader.result as string;
        const jpegDataUrl = await toJpegDataUrl(result);
        setPreviewUrl(jpegDataUrl);
        setSelfieImage(jpegDataUrl);
      };
      reader.readAsDataURL(file);
    }
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

  const handleVerifyWithFaceId = async () => {
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

    let payloadImage = selfieImage;
    if (!payloadImage.startsWith("data:image/")) {
      ErrorToast({
        title: "Invalid Selfie",
        descriptions: ["Selfie must be an image (JPEG/PNG/WebP). Please recapture."],
      });
      return;
    }
    // Force JPEG data URL to match backend expectation
    if (!payloadImage.startsWith("data:image/jpeg")) {
      payloadImage = await toJpegDataUrl(payloadImage);
    }

    verifyWithSelfie({
      bvn: bvn.trim(),
      selfieImage: payloadImage,
    });
  };

  const isLoading = selfiePending;
  const canProceedWithFaceId = bvn.length === 11 && !!selfieImage;

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

          {/* Face verification flow (always used) */}
          {bvn.length === 11 && (
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

              {/* Verify Button */}
              <CustomButton
                onClick={handleVerifyWithFaceId}
                disabled={!canProceedWithFaceId || isLoading}
                isLoading={isLoading}
                className="w-full"
              >
                Verify with Face
              </CustomButton>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BvnVerificationModal;

