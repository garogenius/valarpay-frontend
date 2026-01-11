"use client";

import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import useUserStore from "@/store/user.store";
import { TIER_LEVEL } from "@/constants/types";
import BvnForm from "@/components/user/dashboard/BvnForm";
import CreatePinForm from "@/components/user/dashboard/CreatePinForm";
import BvnFaceCaptureModal from "@/components/modals/BvnFaceCaptureModal";
import WelcomeSuccessModal from "@/components/modals/WelcomeSuccessModal";
import VerificationResultModal from "@/components/modals/VerificationResultModal";
import { useBvnVerificationWithSelfie } from "@/api/wallet/wallet.queries";
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
  const queryClient = useQueryClient();
  const hasNgnWallet = !!user?.wallet?.find((w: any) => w.currency === "NGN");
  const isBvnVerified =
    hasNgnWallet || (user?.tierLevel !== TIER_LEVEL.notSet && user?.isBvnVerified);
  const isIdentityVerified = isBvnVerified;
  const isPinCreated = user?.isWalletPinSet;
  const [currentStep, setCurrentStep] = useState(
    (isIdentityVerified && !isPinCreated) ? 2 : (isIdentityVerified && isPinCreated) ? 2 : 1
  );
  // OTP BVN verification removed – Face ID only
  const [bvnDetails, setBvnDetails] = useState<{ bvn: string }>({ bvn: "" });
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
      // Don't manually update user - let the API refresh handle it
      // The invalidateQueries in the mutation will refresh user data from API
      // This ensures we get the actual verification status from the server
      
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
      // Move to PIN step
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
    const newStep = (isIdentityVerified && !isPinCreated) ? 2 : (isIdentityVerified && isPinCreated) ? 2 : 1;
    
    // Only update step if BVN is actually verified (prevents premature progression)
    if (isIdentityVerified && currentStep === 1.5) {
      // BVN verification just completed - move to PIN step
      setCurrentStep(2);
    } else if (newStep !== currentStep) {
      setCurrentStep(newStep);
    }
    
    // If verification is complete and modal is required, call onSuccess
    // This will trigger user data refresh and modal will close when isIdentityVerified becomes true
    if (isIdentityVerified && isPinCreated && isRequired) {
      // Wait a bit for user data to refresh from API
      setTimeout(() => {
        onSuccess?.();
      }, 1500);
    }
  }, [isBvnVerified, isIdentityVerified, isPinCreated, isRequired, onSuccess, currentStep]);

  const handleComplete = (step: number) => {
    if (step === 1) {
      // BVN verified (Face ID) - move to PIN step
      setCurrentStep(2);
      return;
    }

    if (step === 2) {
      // PIN created - show welcome modal
      setShowWelcomeModal(true);
    }
  };

  const handleClose = () => {
    // Only allow closing if not required AND verification is complete
    // If required, never allow closing until verification succeeds
    if (!isRequired && isIdentityVerified) {
      onClose();
    }
    // If isRequired is true, do nothing - modal cannot be closed
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
            onClick={isRequired ? () => {} : handleClose}
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
                        Verify your identity using your BVN to complete your account setup
                      </p>
                    </div>

                    {/* BVN Form */}
                    <div className="w-full max-w-md mx-auto flex flex-col gap-4">
                      <BvnForm
                        handleComplete={handleComplete}
                        setBvnDetails={(d) => setBvnDetails(d)}
                        onFaceIdSelected={(bvn) => {
                          setBvnDetails({ bvn });
                          setShowFaceCapture(true);
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




