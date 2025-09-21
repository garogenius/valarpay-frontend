/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useVerifyResetEmail } from "@/api/auth/auth.queries";
import { useResetOtp } from "@/api/user/user.queries";
import SpinnerLoader from "@/components/Loader/SpinnerLoader";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import useNavigate from "@/hooks/useNavigate";
import useOtpCodeStore from "@/store/otpCode.store";
import useTimerStore from "@/store/timer.store";
import useUserStore from "@/store/user.store";
import { useEffect, useRef, useState } from "react";
import OTPInput from "react-otp-input";

const VerifyAccountForm = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const [pin, setPin] = useState("");
  const [error, setError] = useState<any>([]);
  const [isResending, setIsResending] = useState(false);
  const setOtpCode = useOtpCodeStore((state) => state.setOtpCode);

  const onVerificationSuccess = () => {
    setOtpCode(pin);
    SuccessToast({
      title: "Email verified",
      description: "Your email address verification successful",
    });
    setError([]);
    setPin("");

    navigate("/user/settings/reset-pin/reset", "replace");
  };

  const onVerificationError = (error: any) => {
    const errorMessage = error.response.data.message;
    const descriptions = Array.isArray(errorMessage)
      ? errorMessage
      : [errorMessage];

    ErrorToast({
      title: "Verification Failed",
      descriptions,
    });

    setError(descriptions);
    setPin("");
  };

  const {
    mutate: verifyEmail,
    isPending: verificationPending,
    isError: verificationError,
  } = useVerifyResetEmail(onVerificationError, onVerificationSuccess);

  const onResendVerificationCodeSuccess = (data: any) => {
    useTimerStore.getState().setTimer(120);
    setIsResending(false);
    SuccessToast({
      title: "Sent Successfully!",
      description: data.data.message,
    });
  };

  const onResendVerificationCodeError = (error: any) => {
    const errorMessage = error.response.data.message;
    const descriptions = Array.isArray(errorMessage)
      ? errorMessage
      : [errorMessage];

    setIsResending(false);
    ErrorToast({
      title: "Sending Failed",
      descriptions,
    });
  };

  const { mutate: resendVerificationCode } = useResetOtp(
    onResendVerificationCodeError,
    onResendVerificationCodeSuccess
  );

  const handleResendClick = async () => {
    if (resendTimer === 0) {
      setPin("");
      setIsResending(true);
      resendVerificationCode();
    }
  };

  const timerStore = useTimerStore();
  const resendTimer = timerStore.resendTimer;
  const decrementTimer = timerStore.decrementTimer;
  const expireAt = timerStore.expireAt;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (resendTimer && resendTimer > 0) {
      interval = setInterval(() => {
        if (decrementTimer) {
          decrementTimer();
        }
      }, 1000);
    } else if (resendTimer === 0 && interval) {
      clearInterval(interval);
      if (timerStore) {
        timerStore.clearTimer();
      }
      setIsResending(false); // Ensure loading is off when timer reaches 0
    }

    // Cleanup function
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [resendTimer, decrementTimer, timerStore]);

  useEffect(() => {
    if (expireAt && Date.now() >= expireAt) {
      timerStore.clearTimer();
      setIsResending(false); // Ensure loading is off when timer expires
    }
  }, [expireAt, timerStore]);

  const initialCallMade = useRef(false);
  useEffect(() => {
    const timerState = useTimerStore.getState();
    // Only send initial verification if there's no active timer and it hasn't been sent before
    if (
      !initialCallMade.current &&
      user?.email &&
      (!timerState.resendTimer || timerState.resendTimer <= 0)
    ) {
      setIsResending(true);
      resendVerificationCode();
      initialCallMade.current = true;
    }
  }, [user?.email, resendVerificationCode]);

  const formatTimer = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const isVerifying = useRef(false);

  const handlePinChange = (value: string) => {
    setPin(value);
    if (value.length === 4 && !isVerifying.current) {
      isVerifying.current = true;
      verifyEmail({ email: user?.email || "", otpCode: value });
    }
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData("text");
    const cleanedPin = pastedData.replace(/\D/g, "").slice(0, 4);
    if (cleanedPin.length === 4 && !isVerifying.current) {
      isVerifying.current = true;
      setPin(cleanedPin);
      verifyEmail({ email: user?.email || "", otpCode: cleanedPin });
    } else {
      setPin(cleanedPin);
    }
  };

  // Reset the verification flag when verification completes
  useEffect(() => {
    if (!verificationPending) {
      isVerifying.current = false;
    }
  }, [verificationPending]);

  const loadingStatus = verificationPending && !verificationError;

  return (
    <div className="w-full h-full 2xs:bg-bg-600 2xs:dark:bg-bg-1100 py-4 md:py-8 px-1 2xs:px-5 lg:px-8 flex justify-center  rounded-xl sm:rounded-2xl">
      <div className="flex flex-col justify-center items-center gap-6 xs:gap-8  w-full xl:w-[80%] 2xl:w-[70%] bg-transparent lg:bg-bg-400 dark:bg-transparent lg:dark:bg-black rounded-lg sm:rounded-xl p-0 2xs:p-4 md:p-8">
        <div className="pt-6 w-[90%] flex flex-col gap-1.5 justify-center items-center text-center text-text-200 dark:text-text-400">
          <p className="text-sm 2xs:text-base ">
            Enter code sent to your emails to set up your pin.{" "}
          </p>
          <p className="w-full font-bold text-lg 2xs:text-xl">Enter OTP Code</p>
        </div>
        <div className="flex flex-col items-center gap-2 justify-center w-full">
          {loadingStatus ? (
            <SpinnerLoader width={50} height={50} color="#D4B139" />
          ) : (
            <div className="flex flex-col items-center justify-center w-full">
              <OTPInput
                value={pin}
                onChange={handlePinChange}
                onPaste={handlePaste}
                numInputs={4}
                renderSeparator={<span className="w-2 2xs:w-3 xs:w-4"></span>}
                containerStyle={{}}
                skipDefaultStyles
                inputType="number"
                renderInput={(props) => (
                  <input
                    {...props}
                    onFocus={() => setError([])}
                    className={`${
                      error.length > 0 ? " border-red-500" : ""
                    } bg-bg-600 dark:bg-bg-1100 w-10 h-10 2xs:w-12 2xs:h-12 border border-border-600 rounded-md text-lg text-text-200 dark:text-text-400 text-center outline-none`}
                  />
                )}
              />
              <div className="flex flex-col text-center justify-center mt-2 gap-0.5">
                {error.map((item: any, index: number) => (
                  <p key={index} className="text-red-500 text-sm">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          )}
          <p className="my-10 text-text-200 dark:text-text-400 text-center w-[90%] xs:w-[80%] text-base font-normal">
            {resendTimer && resendTimer > 0 ? (
              <>
                <span className="">Resend Code</span>{" "}
                <span className="">{formatTimer(resendTimer)}</span>
              </>
            ) : (
              <div className="flex items-center justify-center">
                <span
                  className="cursor-pointer ml-1"
                  onClick={handleResendClick}
                >
                  {isResending ? (
                    <SpinnerLoader width={20} height={20} color="#D4B139" />
                  ) : (
                    "Resend Code"
                  )}
                </span>
              </div>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccountForm;
