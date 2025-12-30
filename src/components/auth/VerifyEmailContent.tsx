"use client";

import { motion } from "framer-motion";
import CustomButton from "@/components/shared/Button";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import useNavigate from "@/hooks/useNavigate";
import { useEffect, useState } from "react";
import OtpInput from "react-otp-input";

import useAuthEmailStore from "@/store/authEmail.store";
import useTimerStore from "@/store/timer.store";
import { useRouter } from "next/navigation";
import SpinnerLoader from "../Loader/SpinnerLoader";
import icons from "../../../public/icons";
import {
  useResendVerificationCode,
  useVerifyEmail,
} from "@/api/auth/auth.queries";
import images from "../../../public/images";
import AuthHeader from "./AuthHeader";

const VerifyEmailContent = () => {
  const navigate = useNavigate();
  const router = useRouter();

  const { authEmail } = useAuthEmailStore();
  const [token, setToken] = useState("");

  const isValid = token.length === 6;

  const onVerificationSuccess = () => {
    SuccessToast({
      title: "Email verified",
      description: "Your email address verification successful",
    });
    navigate("/validate-phoneNumber", "replace");
    setToken("");
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
  };

  const {
    mutate: verifyEmail,
    isPending: verificationPending,
    isError: verificationError,
  } = useVerifyEmail(onVerificationError, onVerificationSuccess);

  const onResendVerificationCodeSuccess = (data: any) => {
    useTimerStore.getState().setTimer(120);
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

    ErrorToast({
      title: "Sending Failed",
      descriptions,
    });
  };

  const {
    mutate: resendVerificationCode,
    isPending: resendVerificationCodePending,
    isError: resendVerificationCodeError,
  } = useResendVerificationCode(
    onResendVerificationCodeError,
    onResendVerificationCodeSuccess
  );

  const handleVerify = async () => {
    if (authEmail) {
      verifyEmail({
        email: authEmail,
        otpCode: token,
      });
    }
  };

  const handleResendClick = async () => {
    if (resendTimer === 0) {
      resendVerificationCode({ email: authEmail });
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

  useEffect(() => {
    if (!authEmail) {
      ErrorToast({
        title: "Error",
        descriptions: ["No email found. Please try again."],
      });
      router.back();
    }
  }, [authEmail, router, navigate]);

  const loadingStatus = verificationPending && !verificationError;
  const resendLoadingStatus =
    resendVerificationCodePending && !resendVerificationCodeError;

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      {/* Left image section (desktop) */}
      <div className="hidden md:block absolute inset-y-0 left-0 w-1/2">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("/images/home/landingPage/care.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center right',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(23, 51, 102, 0.8)' }} />

        {/* Header on top of left section */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <AuthHeader showCta={false} />
        </div>

        {/* Left content */}
        <div className="relative z-20 h-full flex items-center">
          <div className="pl-12 pr-8 max-w-2xl text-white space-y-6">
            <div>
              <h2 className="text-5xl font-bold mb-4 leading-tight text-primary">Verify your email</h2>
              <p className="text-2xl opacity-95 mb-6 leading-relaxed">Enter the 6-digit code sent to your email to continue.</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-xl opacity-90">Code expires soon for security</p>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-xl opacity-90">You can request a new code when the timer ends</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right brand section */}
      <div className="relative min-h-screen md:ml-[50%] bg-dark-primary flex items-center">
        {/* Header on mobile */}
        <div className="md:hidden absolute top-0 left-0 right-0 z-20">
          <AuthHeader showCta={false} />
        </div>

        <div className="w-full flex justify-center px-4 sm:px-6 lg:px-12">
          <motion.div
            whileInView={{ opacity: [0, 1] }}
            transition={{ duration: 0.5, type: "tween" }}
            className="z-10 flex flex-col justify-start items-start w-full max-w-md bg-dark-primary dark:bg-bg-1100 dark:border dark:border-border-600 rounded-2xl px-6 2xs:px-8 sm:px-10 py-8 2xs:py-10 sm:py-12 gap-6 2xs:gap-8"
          >
            <div className="text-white flex flex-col items-center justify-center w-full text-center gap-2 sm:gap-4">

            {/* <Image
              className="w-10 2xs:w-12 xs:w-16"
              src={images.logo}
              alt="logo"
              onClick={() => {
                navigate("/");
              }}
            /> */}
            <div className="w-full 2xs:w-[90%] xs:w-[80%] sm:w-[70%] md:w-[60%] flex flex-col justify-center items-center gap-0.5 sm:gap-2 text-text-700 dark:text-text-900">
              {/* <h2 className="text-xl xs:text-2xl xl:text-3xl font-semibold">
                Confirm Your Email Address{" "}
              </h2> */}
              <p className="text-xs 2xs:text-sm xs:text-base dark:text-text-400">
 we just sent a verification code to{" "}
                {authEmail}
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center w-full gap-4">
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
            <div className=" my-1 sm:my-2.5 text-center w-[90%] xs:w-[80%] text-sm 2xs:text-base text-text-1000  font-medium">
              {resendTimer && resendTimer > 0 ? (
                <>
                  Didn't get the code?{" "}
                  <span className="text-secondary">Resend</span> in{" "}
                  <span className="text-secondary">
                    {formatTimer(resendTimer)}
                  </span>
                </>
              ) : (
                <span className="flex items-center justify-center ">
                  Didn't receive any code?
                  <span
                    className="cursor-pointer text-secondary ml-1"
                    onClick={handleResendClick}
                  >
                    {resendLoadingStatus ? (
                      <SpinnerLoader width={20} height={20} color="#D4B139" />
                    ) : (
                      "Resend"
                    )}
                  </span>
                </span>
              )}
            </div>
            <CustomButton
              type="button"
              disabled={loadingStatus || !isValid}
              isLoading={loadingStatus}
              onClick={handleVerify}
              className="w-full 2xs:w-[90%] sm:w-[80%] border-2 border-primary text-black text-base 2xs:text-lg max-2xs:px-6 py-3.5 xs:py-4 mt-2 2xs:mt-4 xs:mt-6 sm:mt-8 mb-2"
            >
              Next{" "}
            </CustomButton>
          </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailContent;
