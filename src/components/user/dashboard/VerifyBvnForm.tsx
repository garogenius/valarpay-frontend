/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { motion } from "framer-motion";
import CustomButton from "@/components/shared/Button";
import { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import VerificationResultModal from "@/components/modals/VerificationResultModal";
import SuccessToast from "@/components/toast/SuccessToast";
import ErrorToast from "@/components/toast/ErrorToast";

import useTimerStore from "@/store/timer.store";
import {
  useInitiateBvnVerification,
  useValidateBvnVerification,
} from "@/api/wallet/wallet.queries";
import SpinnerLoader from "@/components/Loader/SpinnerLoader";

const VerifyBvnForm = ({
  bvnDetails,
  handleComplete,
}: {
  bvnDetails: { bvn: string; verificationId: string };
  handleComplete: (step: number) => void;
}) => {
  const [token, setToken] = useState("");
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultType, setResultType] = useState<"success" | "error">("success");
  const [resultTitle, setResultTitle] = useState("");
  const [resultMessage, setResultMessage] = useState<string[]>([]);

  const isValid = token.length === 6;

  const onVerificationSuccess = () => {
    setResultType("success");
    setResultTitle("BVN Verified Successfully!");
    setResultMessage(["Your BVN has been verified. Your wallet has been created."]);
    setShowResultModal(true);
    setToken("");
  };

  const onVerificationError = (error: any) => {
    const errorMessage = error.response.data.message;

    const descriptions = Array.isArray(errorMessage)
      ? errorMessage
      : [errorMessage || "BVN verification failed. Please try again."];

    setResultType("error");
    setResultTitle("Verification Failed");
    setResultMessage(descriptions);
    setShowResultModal(true);
  };

  const handleResultModalClose = () => {
    setShowResultModal(false);
    // Only proceed if verification was successful
    // Failed verification should keep user on the form to try again
    if (resultType === "success") {
      handleComplete(1.5);
    }
    // If error, user stays on OTP form to try again
  };

  const {
    mutate: validateBvnVerification,
    isPending: verificationPending,
    isError: verificationError,
  } = useValidateBvnVerification(onVerificationError, onVerificationSuccess);

  const onResendVerificationCodeSuccess = (data: any) => {
    useTimerStore.getState().setTimer(120);
    const responseData = data?.data?.data;
    const newVerificationId = responseData?.verificationId || "";
    // Update verificationId if provided
    if (newVerificationId && bvnDetails) {
      // Update bvnDetails with new verificationId
      // This will be handled by parent component
    }
    SuccessToast({
      title: "OTP Sent Successfully!",
      description: data?.data?.message || "A new OTP has been sent to your registered phone number.",
    });
  };

  const onResendVerificationCodeError = (error: any) => {
    const errorMessage = error.response.data.message;
    const descriptions = Array.isArray(errorMessage)
      ? errorMessage
      : [errorMessage];

    ErrorToast({
      title: "Sending Failed",
      descriptions,
    });
  };

  const {
    mutate: resendVerificationCode,
    isPending: resendVerificationCodePending,
    isError: resendVerificationCodeError,
  } = useInitiateBvnVerification(
    onResendVerificationCodeError,
    onResendVerificationCodeSuccess
  );

  const handleVerify = async () => {
    if (bvnDetails.bvn && bvnDetails.verificationId) {
      validateBvnVerification({
        bvn: bvnDetails.bvn,
        verificationId: bvnDetails.verificationId,
        otpCode: token,
      });
    }
  };

  const handleResendClick = async () => {
    if (resendTimer === 0) {
      resendVerificationCode({ bvn: bvnDetails.bvn });
    }
  };

  const timerStore = useTimerStore();
  const resendTimer = timerStore.resendTimer;
  const decrementTimer = timerStore.decrementTimer;
  const expireAt = timerStore.expireAt;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (resendTimer > 0) {
      interval = setInterval(() => {
        if (decrementTimer) decrementTimer();
      }, 1000);
    } else {
      // When timer reaches 0, clear the interval
      if (interval) clearInterval(interval);
      timerStore.clearTimer(); // Clear state to prevent reset
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer, decrementTimer, timerStore]);

  useEffect(() => {
    if (expireAt && Date.now() >= expireAt) {
      timerStore.clearTimer();
    }
  }, [expireAt, timerStore]);

  const formatTimer = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handlePaste: React.ClipboardEventHandler = (event) => {
    const data = event.clipboardData.getData("text").slice(0, 6); // Get first 6 characters
    setToken(data);
  };

  const loadingStatus = verificationPending && !verificationError;
  const resendLoadingStatus =
    resendVerificationCodePending && !resendVerificationCodeError;

  return (
    <motion.div
      whileInView={{ opacity: [0, 1] }}
      transition={{ duration: 0.5, type: "tween" }}
      className="flex flex-col justify-center items-center w-full gap-4"
    >
      <div className="flex items-center justify-center  w-full ">
        <OtpInput
          value={token}
          onChange={(props) => setToken(props)}
          onPaste={handlePaste}
          numInputs={6}
          renderSeparator={<span className="w-2 2xs:w-3 xs:w-4"></span>}
          containerStyle={{}}
          skipDefaultStyles
          inputType="number"
          renderInput={(props) => (
            <input
              {...props}
              className="w-10 h-10 2xs:w-12 2xs:h-12 bg-transparent border-[1.03px] border-border-700  rounded-md text-base 2xs:text-lg text-text-700 dark:text-text-400 text-center font-medium outline-none"
            />
          )}
        />
      </div>
      <p className=" my-1 sm:my-2.5 text-centertext-sm 2xs:text-base text-text-1000  font-medium">
        {resendTimer && resendTimer > 0 ? (
          <>
            Didn't get the code? <span className="text-[#FF6B2C]">Resend</span>{" "}
            in{" "}
            <span className="text-[#FF6B2C]">{formatTimer(resendTimer)}</span>
          </>
        ) : (
          <div className="flex items-center justify-center ">
            Didn’t receive any code?
            <span
              className="cursor-pointer text-[#FF6B2C] hover:text-[#FF7A3D] ml-1 font-medium"
              onClick={handleResendClick}
            >
              {resendLoadingStatus ? (
                <SpinnerLoader width={20} height={20} color="#FF6B2C" />
              ) : (
                "Resend"
              )}
            </span>
          </div>
        )}
      </p>
      <CustomButton
        type="button"
        disabled={loadingStatus || !isValid}
        isLoading={loadingStatus}
        onClick={handleVerify}
        className="w-full bg-[#FF6B2C] hover:bg-[#FF7A3D] text-white text-base 2xs:text-lg max-2xs:px-6 py-3.5 xs:py-4 mt-2 2xs:mt-4 xs:mt-6 sm:mt-8 mb-2"
      >
        Verify BVN
      </CustomButton>

      {/* Verification Result Modal */}
      <VerificationResultModal
        isOpen={showResultModal}
        onClose={handleResultModalClose}
        type={resultType}
        title={resultTitle}
        message={resultMessage}
        proceedButtonText={resultType === "success" ? "Continue" : "Try Again"}
      />
    </motion.div>
  );
};

export default VerifyBvnForm;
