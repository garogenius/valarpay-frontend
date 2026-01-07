"use client";

import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import useUserStore from "@/store/user.store";
import { TIER_LEVEL } from "@/constants/types";
import BvnForm from "@/components/user/dashboard/BvnForm";
import NinForm from "@/components/user/dashboard/NinForm";
import VerifyBvnForm from "@/components/user/dashboard/VerifyBvnForm";
import CreatePinForm from "@/components/user/dashboard/CreatePinForm";
import BvnFaceCaptureModal from "@/components/modals/BvnFaceCaptureModal";
import WelcomeSuccessModal from "@/components/modals/WelcomeSuccessModal";
import VerificationResultModal from "@/components/modals/VerificationResultModal";
import { useBvnVerificationWithSelfie, useValidateBvnVerification } from "@/api/wallet/wallet.queries";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";

interface AccountVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  isRequired?: boolean; // If true, modal cannot be dismissed
}

const AccountVerificationModal: React.FC<AccountVerificationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  isRequired = false,
}) => {
  const { user } = useUserStore();
  const hasNgnWallet = !!user?.wallet?.find((w: any) => w.currency === "NGN");
  const isBvnVerified =
    hasNgnWallet || (user?.tierLevel !== TIER_LEVEL.notSet && user?.isBvnVerified);
  const isNinVerified = user?.isNinVerified || false;
  const isIdentityVerified = isBvnVerified || isNinVerified;
  const isPinCreated = user?.isWalletPinSet;

  const [identityType, setIdentityType] = useState<"nin" | "bvn">("nin");
  const [currentStep, setCurrentStep] = useState(
    (isIdentityVerified && !isPinCreated) ? 2 : (isIdentityVerified && isPinCreated) ? 2 : 1
  );
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [bvnDetails, setBvnDetails] = useState<{
    bvn: string;
    verificationId: string;
    verificationMethod: "otp" | "faceid";
  }>({
    bvn: "",
    verificationId: "",
    verificationMethod: "otp",
  });
  const [showFaceCapture, setShowFaceCapture] = useState(false);
  const [capturedSelfie, setCapturedSelfie] = useState<string>("");
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showVerificationResultModal, setShowVerificationResultModal] = useState(false);
  const [verificationResultType, setVerificationResultType] = useState<"success" | "error">("success");
  const [verificationResultTitle, setVerificationResultTitle] = useState("");
  const [verificationResultMessage, setVerificationResultMessage] = useState<string[]>([]);
  const { setUser } = useUserStore();

  // Face ID verification
  const onFaceVerificationError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage) ? errorMessage : [errorMessage || "Face verification failed"];
    
    setVerificationResultType("error");
    setVerificationResultTitle("Face Verification Failed");
    setVerificationResultMessage(descriptions);
    setShowVerificationResultModal(true);
    setShowFaceCapture(false);
    setCapturedSelfie("");
  };

  const onFaceVerificationSuccess = (data: any) => {
    const responseData = data?.data?.data;
    if (responseData?.verified) {
      // Update user data
      if (responseData?.wallet) {
        const { user } = useUserStore.getState();
        const updatedUser = {
          ...user,
          isBvnVerified: true,
          bvn: bvnDetails.bvn,
          wallet: [...(user?.wallet || []), responseData.wallet],
        };
        setUser(updatedUser as any);
      }
      
      setVerificationResultType("success");
      setVerificationResultTitle("BVN Verified Successfully!");
      setVerificationResultMessage(["Your BVN has been verified using face ID. Your wallet has been created."]);
      setShowVerificationResultModal(true);
      setShowFaceCapture(false);
      setCapturedSelfie("");
    } else {
      setVerificationResultType("error");
      setVerificationResultTitle("Face Verification Failed");
      setVerificationResultMessage(["Face match verification failed. Please try again."]);
      setShowVerificationResultModal(true);
      setShowFaceCapture(false);
      setCapturedSelfie("");
    }
  };

  const handleVerificationResultModalClose = () => {
    setShowVerificationResultModal(false);
    if (verificationResultType === "success") {
      // Move to PIN step directly (Face ID doesn't need OTP)
      handleComplete(1);
    }
  };

  const { mutate: verifyBvnWithFace, isPending: verifyingFace } = useBvnVerificationWithSelfie(
    onFaceVerificationError,
    onFaceVerificationSuccess
  );

  const handleFaceCapture = (image: string) => {
    setCapturedSelfie(image);
    if (bvnDetails.bvn) {
      verifyBvnWithFace({
        bvn: bvnDetails.bvn,
        selfieImage: image,
      });
    }
  };

  // Update current step when user data changes
  useEffect(() => {
    setCurrentStep(
      (isIdentityVerified && !isPinCreated) ? 2 : (isIdentityVerified && isPinCreated) ? 2 : 1
    );
    
    // If verification is complete and modal is required, close it
    if (isIdentityVerified && isPinCreated && isRequired) {
      setTimeout(() => {
        onSuccess?.();
      }, 1000);
    }
  }, [isBvnVerified, isNinVerified, isIdentityVerified, isPinCreated, isRequired, onSuccess]);

  // OTP Validation handlers
  const onOtpValidationError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage) ? errorMessage : [errorMessage || "OTP validation failed"];
    ErrorToast({ title: "Verification Failed", descriptions });
  };

  const onOtpValidationSuccess = (data: any) => {
    // Update user data - wallet is created by the API
    const walletData = data?.data?.data;
    if (walletData) {
      const { user } = useUserStore.getState();
      const updatedUser = {
        ...user,
        isBvnVerified: true,
        bvn: bvnDetails.bvn,
        wallet: walletData.id ? [...(user?.wallet || []), walletData] : user?.wallet || [],
      };
      setUser(updatedUser as any);
    }
    // Mark BVN step as complete and move to PIN
    handleComplete(1.5);
  };

  const { mutate: validateOtp, isPending: validatingOtp } = useValidateBvnVerification(
    onOtpValidationError,
    onOtpValidationSuccess
  );

  const handleComplete = (step: number) => {
    if (step === 1) {
      // Identity verified (BVN or NIN) - check if BVN OTP method was used
      if (identityType === "bvn" && bvnDetails.verificationMethod === "otp" && bvnDetails.verificationId) {
        // Show OTP step for BVN
        setShowOtpStep(true);
        setCurrentStep(1.5); // Intermediate step for OTP
      } else {
        // NIN verified or BVN Face ID - move to PIN step
        setCurrentStep(2);
      }
      return;
    }

    if (step === 1.5) {
      // OTP validated for BVN - move to PIN step
      setCurrentStep(2);
      return;
    }

    if (step === 2) {
      // PIN created - show welcome modal
      setShowWelcomeModal(true);
    }
  };

  const handleClose = () => {
    // Only allow closing if not required or verification is complete
    if (!isRequired || isIdentityVerified) {
      onClose();
    }
  };

  const handleWelcomeClose = () => {
    setShowWelcomeModal(false);
    onSuccess?.();
    if (!isRequired) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={isRequired ? undefined : handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-lg bg-bg-600 dark:bg-bg-1100 rounded-xl border border-border-800 dark:border-border-700 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button - top right */}
            {!isRequired && (
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <IoClose className="w-5 h-5" />
              </button>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-bg-600 dark:bg-bg-1100">
              <div className="py-6 sm:py-8 flex flex-col h-full gap-4 sm:gap-6 px-4 sm:px-6">
                {currentStep === 1 && (
                  <>
                    <div className="flex flex-col gap-3 justify-center items-center">
                      <h2 className="text-lg sm:text-xl text-white font-semibold">
                        Verify Your Identity
                      </h2>
                      <p className="w-full max-w-md text-center text-white/60 text-xs sm:text-sm">
                        If you want to open account with
                      </p>
                    </div>

                    {/* NIN/BVN Selection */}
                    <div className="w-full max-w-md mx-auto flex flex-col gap-4">
                      <div className="flex gap-3">
                        <label className="flex-1 cursor-pointer">
                          <input
                            type="radio"
                            name="identityType"
                            value="nin"
                            checked={identityType === "nin"}
                            onChange={() => setIdentityType("nin")}
                            className="hidden"
                          />
                          <div className={`w-full p-4 rounded-xl border-2 transition-all ${
                            identityType === "nin"
                              ? "border-[#FF6B2C] bg-[#FF6B2C]/10"
                              : "border-gray-700 bg-[#1C1C1E] hover:bg-[#2C2C2E]"
                          }`}>
                            <div className="flex items-center justify-center gap-3">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                identityType === "nin"
                                  ? "border-[#FF6B2C] bg-[#FF6B2C]"
                                  : "border-gray-500 bg-transparent"
                              }`}>
                                {identityType === "nin" && (
                                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                                )}
                              </div>
                              <span className={`text-sm font-semibold ${
                                identityType === "nin"
                                  ? "text-[#FF6B2C]"
                                  : "text-gray-300"
                              }`}>
                                NIN
                              </span>
                            </div>
                          </div>
                        </label>
                        <label className="flex-1 cursor-pointer">
                          <input
                            type="radio"
                            name="identityType"
                            value="bvn"
                            checked={identityType === "bvn"}
                            onChange={() => setIdentityType("bvn")}
                            className="hidden"
                          />
                          <div className={`w-full p-4 rounded-xl border-2 transition-all ${
                            identityType === "bvn"
                              ? "border-[#FF6B2C] bg-[#FF6B2C]/10"
                              : "border-gray-700 bg-[#1C1C1E] hover:bg-[#2C2C2E]"
                          }`}>
                            <div className="flex items-center justify-center gap-3">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                identityType === "bvn"
                                  ? "border-[#FF6B2C] bg-[#FF6B2C]"
                                  : "border-gray-500 bg-transparent"
                              }`}>
                                {identityType === "bvn" && (
                                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                                )}
                              </div>
                              <span className={`text-sm font-semibold ${
                                identityType === "bvn"
                                  ? "text-[#FF6B2C]"
                                  : "text-gray-300"
                              }`}>
                                BVN
                              </span>
                            </div>
                          </div>
                        </label>
                      </div>

                      {/* Show appropriate form based on selection */}
                      {identityType === "nin" ? (
                        <NinForm handleComplete={handleComplete} />
                      ) : (
                        <BvnForm
                          handleComplete={handleComplete}
                          setBvnDetails={(bvnDetails) => {
                            setBvnDetails({
                              ...bvnDetails,
                              verificationMethod: bvnDetails.verificationMethod || "otp",
                            });
                          }}
                          verificationMethod={bvnDetails.verificationMethod}
                          setVerificationMethod={(method) => {
                            setBvnDetails({ ...bvnDetails, verificationMethod: method });
                          }}
                          onFaceIdSelected={(bvn) => {
                            setBvnDetails({ ...bvnDetails, bvn });
                            setShowFaceCapture(true);
                          }}
                        />
                      )}
                    </div>
                  </>
                )}
                {showOtpStep && bvnDetails.verificationId && currentStep !== 2 && (
                  <>
                    <div className="flex flex-col gap-3 justify-center items-center">
                      <h2 className="text-lg sm:text-xl text-white font-semibold">
                        Enter OTP Code
                      </h2>
                      <p className="w-full max-w-md text-center text-white/60 text-xs sm:text-sm">
                        Enter the 6-digit OTP code sent to your registered phone number
                      </p>
                    </div>
                    <div className="w-full max-w-md mx-auto flex flex-col h-full items-center gap-4 sm:gap-6">
                      <VerifyBvnForm
                        bvnDetails={bvnDetails}
                        handleComplete={() => {
                          // After OTP validation, move to PIN step
                          handleComplete(1.5);
                        }}
                      />
                    </div>
                  </>
                )}
                {currentStep === 2 && (
                  <>
                    <div className="flex flex-col gap-3 justify-center items-center">
                      <h2 className="text-lg sm:text-xl text-white font-semibold">
                        Create Transaction PIN
                      </h2>
                      <p className="w-full max-w-md text-center text-white/60 text-xs sm:text-sm">
                        Create a 4-digit PIN for secure transactions and payment confirmations
                      </p>
                    </div>
                    <div className="w-full max-w-md mx-auto flex flex-col h-full items-center gap-4 sm:gap-6">
                      <CreatePinForm handleComplete={handleComplete} />
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    {/* Face Capture Modal */}
    <BvnFaceCaptureModal
      isOpen={showFaceCapture}
      onClose={() => {
        setShowFaceCapture(false);
        setCapturedSelfie("");
      }}
      onCapture={handleFaceCapture}
      bvn={bvnDetails.bvn}
      isVerifying={verifyingFace}
    />

    {/* Welcome Success Modal */}
    <WelcomeSuccessModal
      isOpen={showWelcomeModal}
      onClose={handleWelcomeClose}
    />

    {/* Verification Result Modal for Face ID */}
    <VerificationResultModal
      isOpen={showVerificationResultModal}
      onClose={handleVerificationResultModalClose}
      type={verificationResultType}
      title={verificationResultTitle}
      message={verificationResultMessage}
      proceedButtonText={verificationResultType === "success" ? "Continue" : "Try Again"}
    />
  </>
  );
};

export default AccountVerificationModal;




