/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
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
import { useResend2faCode, useVerify2faCode } from "@/api/auth/auth.queries";
import useUserStore from "@/store/user.store";
import Cookies from "js-cookie";
import AuthHeader from "./AuthHeader";

const TwoFactorAuthContent = () => {
  const navigate = useNavigate();
  const router = useRouter();

  const { authEmail, authUsername } = useAuthEmailStore();
  const [token, setToken] = useState("");
  const { setUser, setIsLoggedIn } = useUserStore();

  const isValid = token.length === 6 && !!authUsername;

  const onVerificationSuccess = (data: any) => {
    Cookies.set("accessToken", data?.data?.accessToken);
    setUser(data?.data?.user);
    setIsLoggedIn(true);
    SuccessToast({
      title: "Email verified",
      description: "Your email address verification successful",
    });
    const redirectPath =
      sessionStorage.getItem("returnTo") || "/user/dashboard";
    navigate(redirectPath, "replace");
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
    mutate: verify2faCode,
    isPending: verificationPending,
    isError: verificationError,
  } = useVerify2faCode(onVerificationError, onVerificationSuccess);

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
    mutate: resend2faCode,
    isPending: resend2faCodePending,
    isError: resend2faCodeError,
  } = useResend2faCode(
    onResendVerificationCodeError,
    onResendVerificationCodeSuccess
  );

  const handleVerify = async () => {
    if (authUsername) {
      verify2faCode({
        username: authUsername,
        otpCode: token,
      });
    }
  };

  const handleResendClick = async () => {
    if (resendTimer === 0) {
      // API expects no body - email is retrieved from auth session
      resend2faCode(undefined);
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
  const resendLoadingStatus = resend2faCodePending && !resend2faCodeError;

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      {/* Left image section (desktop) */}
      <div className="hidden md:block absolute inset-y-0 left-0 w-1/2">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'url("/images/home/landingPage/glassBuilding.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "#1C2E50CC" }}
        />

        {/* Header on top of left section */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <AuthHeader showCta={false} />
        </div>

        {/* Left content */}
        <div className="relative z-20 h-full flex items-center">
          <div className="pl-12 pr-8 max-w-2xl text-white space-y-6">
            <div>
              <h2 className="text-5xl font-bold mb-4 leading-tight text-primary">
                Secure Your Account
              </h2>
              <p className="text-2xl opacity-95 mb-6 leading-relaxed">
                Two-factor authentication adds an extra layer of security to
                your account.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-xl opacity-90">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-xl opacity-90">
                  Or use a backup code if you have one
                </p>
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

        {/* Form */}
        <div className="w-full flex justify-center px-4 sm:px-6 lg:px-12">
          <motion.div
            whileInView={{ opacity: [0, 1] }}
            transition={{ duration: 0.5, type: "tween" }}
            className="z-10 flex flex-col justify-center items-center w-full max-w-md bg-dark-primary dark:bg-bg-1100 dark:xs:border dark:border-border-600 rounded-2xl p-6 sm:p-8 gap-6"
          >
            <div className="text-white flex flex-col items-center justify-center w-full text-center gap-3">
              <h2 className="text-2xl font-semibold text-text-200 dark:text-white">
                Two-Factor Authentication
              </h2>
            </div>
            <form
              className="flex flex-col justify-start items-start w-full gap-6"
              onSubmit={(e) => {
                e.preventDefault();
                handleVerify();
              }}
            >
              <p className="text-sm text-text-200 dark:text-text-400 mb-2">
                We've sent a verification code to{" "}
                <span className="font-medium">{authEmail}</span>
              </p>

              <div className="w-full">
                <label className="block text-sm font-medium text-text-200 dark:text-text-400 mb-2">
                  Verification Code
                </label>
                <div className="flex justify-center w-full">
                  <OtpInput
                    value={token}
                    onChange={setToken}
                    onPaste={handlePaste}
                    numInputs={6}
                    renderSeparator={<span className="w-3"></span>}
                    containerStyle={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      maxWidth: "320px",
                    }}
                    skipDefaultStyles
                    inputType="number"
                    renderInput={(props) => (
                      <input
                        {...props}
                        className="w-12 h-12 bg-bg-500 dark:bg-bg-900 border border-border-600 dark:border-border-700 rounded-lg text-base text-text-200 dark:text-white text-center font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    )}
                  />
                </div>
              </div>

              <div className="w-full text-center mt-2">
                {resendTimer && resendTimer > 0 ? (
                  <p className="text-sm text-text-300 dark:text-text-500">
                    Resend code in{" "}
                    <span className="text-primary">
                      {formatTimer(resendTimer)}
                    </span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendClick}
                    disabled={resendLoadingStatus}
                    className="text-sm text-primary hover:opacity-80 transition-opacity disabled:opacity-50"
                  >
                    {resendLoadingStatus ? (
                      <span className="flex items-center justify-center">
                        <SpinnerLoader
                          width={16}
                          height={16}
                          color="currentColor"
                          className="mr-2"
                        />
                        Sending...
                      </span>
                    ) : (
                      "Resend verification code"
                    )}
                  </button>
                )}
              </div>

              <CustomButton
                type="submit"
                disabled={loadingStatus || !isValid}
                isLoading={loadingStatus}
                className="w-full border-2 border-primary text-black text-base py-3.5 mt-4"
              >
                Verify Code
              </CustomButton>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuthContent;
