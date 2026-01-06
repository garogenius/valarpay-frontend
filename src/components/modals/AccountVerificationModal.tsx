"use client";

import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import useUserStore from "@/store/user.store";
import { TIER_LEVEL } from "@/constants/types";
import VerificationNav from "@/components/user/dashboard/VerificationNav";
import BvnForm from "@/components/user/dashboard/BvnForm";
import VerifyBvnForm from "@/components/user/dashboard/VerifyBvnForm";
import CreatePinForm from "@/components/user/dashboard/CreatePinForm";
import BvnFaceCaptureModal from "@/components/modals/BvnFaceCaptureModal";
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
  const isPinCreated = user?.isWalletPinSet;

  const [steps, setSteps] = useState([
    {
      value: 1,
      clickable: true,
      completed: isBvnVerified || false,
    },
    {
      value: 2,
      clickable: false,
      completed: isBvnVerified || false,
    },
    {
      value: 3,
      clickable: false,
      completed: isPinCreated || false,
    },
  ]);
  const [currentStep, setCurrentStep] = useState(
    (isBvnVerified && !isPinCreated) ? 3 : (isBvnVerified && isPinCreated) ? 3 : 1
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
  const { setUser } = useUserStore();

  // Face ID verification
  const onFaceVerificationError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage) ? errorMessage : [errorMessage || "Face verification failed"];
    ErrorToast({ title: "Face Verification Failed", descriptions });
    setShowFaceCapture(false);
    setCapturedSelfie("");
  };

  const onFaceVerificationSuccess = (data: any) => {
    const responseData = data?.data?.data;
    if (responseData?.verified) {
      SuccessToast({
        title: "BVN Verified Successfully!",
        description: "Your BVN has been verified using face ID. Your wallet has been created.",
      });
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
      handleComplete(1);
      setShowFaceCapture(false);
      setCapturedSelfie("");
      // Close modal if required verification is complete
      if (isRequired) {
        setTimeout(() => {
          onSuccess?.();
        }, 1000);
      }
    } else {
      ErrorToast({
        title: "Face Verification Failed",
        descriptions: ["Face match verification failed. Please try again."],
      });
      setShowFaceCapture(false);
      setCapturedSelfie("");
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

  // Update steps when user data changes
  useEffect(() => {
    setSteps([
      {
        value: 1,
        clickable: true,
        completed: isBvnVerified || false,
      },
      {
        value: 2,
        clickable: false,
        completed: isBvnVerified || false,
      },
      {
        value: 3,
        clickable: false,
        completed: isPinCreated || false,
      },
    ]);
    setCurrentStep(
      (isBvnVerified && !isPinCreated) || (isBvnVerified && isPinCreated) ? 3 : 1
    );
    
    // If verification is complete and modal is required, close it
    if (isBvnVerified && isPinCreated && isRequired) {
      setTimeout(() => {
        onSuccess?.();
      }, 1000);
    }
  }, [isBvnVerified, isPinCreated, isRequired, onSuccess]);

  const handleStepClick = (step: number) => {
    const stepIndex = steps.findIndex((s) => s.value === step);
    if (stepIndex === 0 || steps[stepIndex - 1].completed) {
      setCurrentStep(step);
    }
  };

  // OTP Validation handlers
  const onOtpValidationError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage) ? errorMessage : [errorMessage || "OTP validation failed"];
    ErrorToast({ title: "Verification Failed", descriptions });
  };

  const onOtpValidationSuccess = (data: any) => {
    SuccessToast({
      title: "BVN Verified Successfully!",
      description: "Your BVN has been verified. Your wallet has been created.",
    });
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
    handleComplete(2);
  };

  const { mutate: validateOtp, isPending: validatingOtp } = useValidateBvnVerification(
    onOtpValidationError,
    onOtpValidationSuccess
  );

  const handleComplete = (step: number) => {
    if (step === 1) {
      // BVN initiated - check if OTP method was used
      if (bvnDetails.verificationMethod === "otp" && bvnDetails.verificationId) {
        // Show OTP step
        setShowOtpStep(true);
        setCurrentStep(2);
      } else {
        // Face ID method - already handled in onFaceVerificationSuccess
        setSteps((prevSteps) =>
          prevSteps.map((s) =>
            s.value === 1 || s.value === 2 ? { ...s, completed: true } : s
          )
        );
        setCurrentStep(3);
      }
      return;
    }

    if (step === 2) {
      // OTP validated - move to PIN step
      setSteps((prevSteps) =>
        prevSteps.map((s) =>
          s.value === 1 || s.value === 2 ? { ...s, completed: true } : s
        )
      );
      setCurrentStep(3);
      return;
    }

    setSteps((prevSteps) =>
      prevSteps.map((s) => (s.value === step ? { ...s, completed: true } : s))
    );

    if (step === 3) {
      // All steps completed - PIN created
      // Wait a moment for user data to refresh, then close modal
      setTimeout(() => {
        onSuccess?.();
        if (!isRequired) {
          handleClose();
        }
      }, 1500);
    }
  };

  const handleClose = () => {
    // Only allow closing if not required or verification is complete
    if (!isRequired || isBvnVerified) {
      onClose();
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
            className="relative w-full max-w-2xl bg-bg-600 dark:bg-bg-1100 rounded-2xl border border-border-800 dark:border-border-700 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-800 dark:border-border-700 bg-bg-500 dark:bg-bg-900">
              <div>
                <h2 className="text-white text-xl font-semibold">Complete Your Profile</h2>
                <p className="text-white/60 text-sm mt-1">Verify your identity to access all features</p>
              </div>
              {!isRequired && (
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                  aria-label="Close modal"
                >
                  <IoClose className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-bg-600 dark:bg-bg-1100">
              <div className="py-6 sm:py-8 flex flex-col h-full gap-6 sm:gap-10 px-4 sm:px-6">
                {isRequired && (
                  <div className="bg-[#FF6B2C]/10 border border-[#FF6B2C]/20 rounded-lg p-4 mb-2">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#FF6B2C] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">Verification Required</p>
                        <p className="text-white/70 text-xs mt-1">
                          You must verify your BVN or NIN to access your dashboard. This is a one-time verification process.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3 justify-center items-center">
                  <h2 className="text-xl sm:text-2xl text-white font-semibold">
                    {currentStep === 1 && "Verify Your Identity"}
                    {currentStep === 2 && "Enter OTP Code"}
                    {currentStep === 3 && "Create Transaction PIN"}
                  </h2>

                  <VerificationNav
                    currentStep={currentStep}
                    steps={steps}
                    handleStepClick={handleStepClick}
                  />

                  <p className="w-[90%] 2xs:w-[80%] xs:w-[70%] sm:w-[60%] md:w-[50%] text-center text-white/60 text-sm sm:text-base">
                    {currentStep === 1 &&
                      "Verify your identity using BVN with OTP or Face ID to secure your account"}
                    {currentStep === 2 &&
                      "Enter the 6-digit OTP code sent to your registered phone number"}
                    {currentStep === 3 &&
                      "Create a 4-digit PIN for secure transactions and payment confirmations"}
                  </p>
                </div>

                {currentStep === 1 && (
                  <div className="w-full max-w-xl mx-auto flex flex-col h-full items-center gap-6 sm:gap-8">
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
                  </div>
                )}
                {currentStep === 2 && showOtpStep && bvnDetails.verificationId && (
                  <div className="w-full max-w-xl mx-auto flex flex-col h-full items-center gap-6 sm:gap-8">
                    <VerifyBvnForm
                      bvnDetails={bvnDetails}
                      handleComplete={handleComplete}
                    />
                  </div>
                )}
                {currentStep === 3 && (
                  <div className="w-full max-w-xl mx-auto flex flex-col h-full items-center gap-6 sm:gap-8">
                    <CreatePinForm handleComplete={handleComplete} />
                  </div>
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
  </>
  );
};

export default AccountVerificationModal;




