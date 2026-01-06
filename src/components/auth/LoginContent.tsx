/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLogin } from "@/api/auth/auth.queries";
import { motion } from "framer-motion";
import images from "../../../public/images";
import AuthHeader from "./AuthHeader";
import Image from "next/image";
import AuthInput from "./AuthInput";
import CustomButton from "@/components/shared/Button";
import Link from "next/link";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import useNavigate from "@/hooks/useNavigate";
import icons from "../../../public/icons";
import { useTheme } from "@/store/theme.store";
import useAuthEmailStore from "@/store/authEmail.store";
import { useEffect, useState } from "react";
import { User } from "@/constants/types";
import { ILogin } from "@/api/auth/auth.types";
import Cookies from "js-cookie";
import * as BiometricService from "@/services/biometric.service";
import { useBiometricChallenge, useBiometricLogin } from "@/api/biometric/biometric.queries";
import useUserStore from "@/store/user.store";

const schema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required"),

  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),

  ipAddress: yup.string().optional(),
  deviceName: yup.string().optional(),
  operatingSystem: yup.string().optional(),
});

interface LoginFormData {
  username: string;
  password: string;
  ipAddress?: string;
  deviceName?: string;
  operatingSystem?: string;
}

const LoginContent = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { setAuthEmail, setAuthUsername } = useAuthEmailStore();
  const { setUser, setIsLoggedIn } = useUserStore();

  const [biometricType, setBiometricType] = useState<"fingerprint" | "faceid" | null>(null);
  const [deviceId] = useState(() => BiometricService.getDeviceId());

  const form = useForm<LoginFormData>({
    defaultValues: {
      username: "",
      password: "",
      ipAddress: "",
      deviceName: "",
      operatingSystem: "",
    },
    resolver: yupResolver(schema) as any,
    mode: "onChange",
  });

  const { register, handleSubmit, formState, reset, setValue } = form;
  const { errors, isValid } = formState;

  useEffect(() => {
    // Get operating system
    const getOS = () => {
      const userAgent = window.navigator.userAgent;

      if (/Windows/.test(userAgent)) return "Windows";
      if (/Mac/.test(userAgent)) return "MacOS";
      if (/Linux/.test(userAgent)) return "Linux";
      if (/Android/.test(userAgent)) return "Android";
      if (/iPhone|iPad|iPod/.test(userAgent)) return "iOS";

      return "Unknown OS";
    };

    // Get device name
    const getDeviceName = () => {
      const userAgent = window.navigator.userAgent;
      // Extract device info from user agent string
      const deviceInfo =
        userAgent.split(") ")[0].split("(")[1] || "Unknown Device";
      return deviceInfo;
    };

    // Get IP address
    const getIpAddress = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        setValue("ipAddress", data.ip);
      } catch (error) {
        console.error("Error fetching IP:", error);
        setValue("ipAddress", "Unable to fetch IP");
      }
    };

    setValue("operatingSystem", getOS());
    setValue("deviceName", getDeviceName());
    getIpAddress();

    // Detect biometric capability
    // COMMENTED OUT: Biometric login feature temporarily disabled
    // BiometricService.detectBiometricCapability().then(setBiometricType);
  }, [setValue]); // Run once when component mounts

  const onError = async (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage)
      ? errorMessage
      : [errorMessage];

    if (descriptions.includes("Email not verified")) {
      setAuthEmail(form.getValues("username"));
      navigate("/verify-email");
    } else {
      ErrorToast({
        title: "Error during login",
        descriptions,
      });
    }
  };

  const onSuccess = (data: any) => {
    const user: User = data?.data?.user;
    setAuthEmail(user?.email);
    setAuthUsername(form.getValues("username").toLowerCase());

    // After login, always go to 2FA verification
    SuccessToast({
      title: "Login successful!",
      description:
        "Check your email for verification code to continue with your two-factor authentication.",
    });
    navigate("/two-factor-auth");

    reset();
  };

  const {
    mutate: login,
    isPending: loginPending,
    isError: loginError,
  } = useLogin(onError, onSuccess);

  const loginLoading = loginPending && !loginError;

  // COMMENTED OUT: Biometric login feature temporarily disabled
  // Biometric login
  // const { mutate: getChallenge, isPending: challengePending } = useBiometricChallenge(
  //   (error) => {
  //     ErrorToast({ title: "Challenge Error", descriptions: [error?.response?.data?.message || "Failed to get challenge"] });
  //   },
  //   (data) => {
  //     const challenge = data.data.challenge;
  //     BiometricService.signChallenge(challenge).then((signed) => {
  //       if (signed) {
  //         biometricLoginMutate({
  //           identifier: form.getValues("username"),
  //           deviceId,
  //           signature: signed.signature,
  //           challenge,
  //           publicKey: BiometricService.getStoredBiometricInfo()?.publicKey || "",
  //         });
  //       } else {
  //         ErrorToast({ title: "Biometric Error", descriptions: ["Failed to sign challenge"] });
  //       }
  //     }).catch(() => {
  //       ErrorToast({ title: "Biometric Error", descriptions: ["Failed to sign challenge"] });
  //     });
  //   }
  // );

  // const { mutate: biometricLoginMutate, isPending: biometricLoginPending } = useBiometricLogin(
  //   (error) => {
  //     const errorMessage = error?.response?.data?.message;
  //     const descriptions = Array.isArray(errorMessage) ? errorMessage : [errorMessage || "Biometric login failed"];
  //     ErrorToast({ title: "Biometric Login Failed", descriptions });
  //   },
  //   (data) => {
  //     Cookies.set("accessToken", data.data.accessToken);
  //     setUser(data.data.user);
  //     setIsLoggedIn(true);
  //     SuccessToast({ title: "Login successful!", description: "You have been logged in using biometric authentication." });
  //     navigate("/user/dashboard");
  //   }
  // );

  const onSubmit = async (data: LoginFormData) => {
    console.log('data:',data)
    login({
      username: data.username.toLowerCase(),
      password: data.password,
      ipAddress: data.ipAddress || "",
      deviceName: data.deviceName || "",
      operatingSystem: data.operatingSystem || "",
    } as ILogin);
  };

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      {/* Left image section (desktop) */}
      <div className="hidden md:block absolute inset-y-0 left-0 w-1/2">
        {/* Background image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("/images/home/landingPage/glassBuilding.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Image overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: '#1C2E50CC' }} />

        {/* Header on top of left section */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <AuthHeader />
        </div>

        {/* Left content */}
        <div className="relative z-20 h-full flex items-center">
          <div className="pl-12 pr-8 max-w-2xl text-white space-y-6">
            <div>
              <h2 className="text-5xl font-bold mb-4 leading-tight text-primary">Welcome to ValarPay</h2>
              <p className="text-2xl opacity-95 mb-6 leading-relaxed">Your trusted partner in seamless digital payments and financial solutions.</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-xl opacity-90">Secure and instant money transfers</p>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-xl opacity-90">24/7 Customer Support</p>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-xl opacity-90">Competitive exchange rates</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right brand section */}
      <div className="relative min-h-screen md:ml-[50%] bg-dark-primary flex items-center">
        {/* Header on mobile */}
        <div className="md:hidden absolute top-0 left-0 right-0 z-20">
          <AuthHeader />
        </div>

        {/* Login form */}
        <div className="w-full flex justify-center px-4 sm:px-6 lg:px-12">
          <motion.div
            whileInView={{ opacity: [0, 1] }}
            transition={{ duration: 0.5, type: "tween" }}
            className="z-10 flex flex-col justify-center items-center w-full max-w-md bg-dark-primary dark:bg-bg-1100 dark:xs:border dark:border-border-600 rounded-2xl p-6 sm:p-8 gap-6"
          >
            <form
              className="flex flex-col justify-start items-start w-full gap-7"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <AuthInput
                id="username"
                label="Email or Phone Number"
                type="text"
                htmlFor="username"
                placeholder="Username"
                icon={
                  <Image
                    src={
                      theme === "dark"
                        ? icons.authIcons.mailDark
                        : icons.authIcons.mail
                    }
                    alt="username"
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                }
                error={errors.username?.message}
                {...register("username")}
              />

              <AuthInput
                id="password"
                label="Password"
                type="password"
                htmlFor="password"
                placeholder="Password"
                autoComplete="off"
                forgotPassword={true}
                icon={
                  <Image
                    src={
                      theme === "dark"
                        ? icons.authIcons.lockDark
                        : icons.authIcons.lock
                    }
                    alt="password"
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                }
                error={errors.password?.message}
                {...register("password")}
              />

              {/* Moved CTA to top-right header */}

              <CustomButton
                type="submit"
                disabled={isValid || loginLoading}
                isLoading={loginLoading}
                className="mb-4  w-full  border-2 border-primary text-black text-base 2xs:text-lg max-2xs:px-6 py-3.5 xs:py-4"
              >
                Sign In{" "}
              </CustomButton>

              {/* COMMENTED OUT: Biometric login feature temporarily disabled */}
              {/* {biometricType && BiometricService.isWebAuthnSupported() && (
                <CustomButton
                  type="button"
                  onClick={() => {
                    const username = form.getValues("username");
                    if (!username) {
                      ErrorToast({ title: "Username Required", descriptions: ["Please enter your username first"] });
                      return;
                    }
                    getChallenge({ identifier: username, deviceId });
                  }}
                  disabled={challengePending || biometricLoginPending || !form.getValues("username")}
                  isLoading={challengePending || biometricLoginPending}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white text-base py-3.5"
                >
                  {biometricType === "faceid" ? "Login with Face ID" : "Login with Fingerprint"}
                </CustomButton>
              )} */}
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginContent;
