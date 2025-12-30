"use client";

import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import useUserStore from "@/store/user.store";
import { TIER_LEVEL } from "@/constants/types";
import VerificationNav from "@/components/user/dashboard/VerificationNav";
import BvnForm from "@/components/user/dashboard/BvnForm";
import CreatePinForm from "@/components/user/dashboard/CreatePinForm";

interface AccountVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AccountVerificationModal: React.FC<AccountVerificationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
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
    (isBvnVerified && !isPinCreated) || (isBvnVerified && isPinCreated) ? 3 : 1
  );
  const [bvnDetails, setBvnDetails] = useState({
    bvn: "",
    verificationId: "",
  });

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
  }, [isBvnVerified, isPinCreated]);

  const handleStepClick = (step: number) => {
    const stepIndex = steps.findIndex((s) => s.value === step);
    if (stepIndex === 0 || steps[stepIndex - 1].completed) {
      setCurrentStep(step);
    }
  };

  const handleComplete = (step: number) => {
    // Step 2 (OTP) is no longer required; account creation completes BVN step.
    if (step === 1) {
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
      // All steps completed
      onSuccess?.();
      handleClose();
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-2xl bg-[#0A0A0A] rounded-2xl border border-gray-800 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h2 className="text-white text-xl font-semibold">Complete your Profile</h2>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg hover:bg-[#1A1A1F] text-gray-400 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <IoClose className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-[#0A0A0A]">
              <div className="py-8 flex flex-col h-full gap-10 sm:gap-16 px-6">
                <div className="flex flex-col gap-3 justify-center items-center">
                  <h2 className="text-xl sm:text-2xl text-white font-semibold">
                    {currentStep === 1 && "Enter your BVN"}
                    {currentStep === 3 && "Create transaction PIN"}
                  </h2>

                  <VerificationNav
                    currentStep={currentStep}
                    steps={steps}
                    handleStepClick={handleStepClick}
                  />

                  <p className="w-[90%] 2xs:w-[80%] xs:w-[70%] sm:w-[60%] md:w-[50%] text-center text-gray-400 text-sm sm:text-base">
                    {currentStep === 1 &&
                      "Your Bank Verification Number is required to confirm who you are"}
                    {currentStep === 3 &&
                      "This 4 digit PIN will be used for all transactions and payment confirmations"}
                  </p>
                </div>

                {currentStep === 1 && (
                  <div className="w-full max-w-xl mx-auto flex flex-col h-full items-center gap-6 sm:gap-8">
                    <BvnForm
                      handleComplete={handleComplete}
                      setBvnDetails={(bvnDetails) => {
                        setBvnDetails(bvnDetails);
                      }}
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
  );
};

export default AccountVerificationModal;




