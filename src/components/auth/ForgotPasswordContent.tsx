/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForgotPassword } from "@/api/auth/auth.queries";
import { motion } from "framer-motion";
import images from "../../../public/images";
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
import AuthHeader from "./AuthHeader";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Email format is not valid")
    .required("Email is required"),
});

type ForgotPasswordFormData = yup.InferType<typeof schema>;

const ForgotPasswordContent = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { setAuthEmail } = useAuthEmailStore();

  const form = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const { register, handleSubmit, formState } = form;
  const { errors, isValid } = formState;

  const onError = async (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage)
      ? errorMessage
      : [errorMessage];

    ErrorToast({
      title: "Error during sending password reset otp",
      descriptions,
    });
  };

  const onSuccess = () => {
    setAuthEmail(form.getValues("email"));
    SuccessToast({
      title: "Password reset otp sent!",
      description:
        "Check your email for verification code to continue with reseting your password",
    });
    navigate("/verify-reset-email");
  };

  const {
    mutate: forgotPassword,
    isPending: forgotPasswordPending,
    isError: forgotPasswordError,
  } = useForgotPassword(onError, onSuccess);

  const forgotPasswordLoading = forgotPasswordPending && !forgotPasswordError;

  const onSubmit = async (data: ForgotPasswordFormData) => {
    forgotPassword(data);
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
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: '#1C2E50CC' }}
        />

        {/* Header on top of left section */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <AuthHeader showCta={false} />
        </div>

        {/* Left content */}
        <div className="relative z-20 h-full flex items-center">
          <div className="pl-12 pr-8 max-w-2xl text-white space-y-6">
            <div>
              <h2 className="text-5xl font-bold mb-4 leading-tight text-primary">Forgot your password?</h2>
              <p className="text-2xl opacity-95 mb-6 leading-relaxed">Enter your email address to receive a password reset code.</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-xl opacity-90">We’ll send a 6-digit code to your email</p>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-xl opacity-90">Use the code to reset your password securely</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right brand section (always visible) */}
      <div className="relative min-h-screen md:ml-[50%] bg-dark-primary flex items-center">
        {/* Header on mobile */}
        <div className="md:hidden absolute top-0 left-0 right-0 z-20">
          <AuthHeader showCta={false} />
        </div>

        {/* Form card */}
        <div className="w-full flex justify-center px-4 sm:px-6 lg:px-12">
          <motion.div
            whileInView={{ opacity: [0, 1] }}
            transition={{ duration: 0.5, type: "tween" }}
            className="z-10 flex flex-col justify-center items-center w-full max-w-md bg-dark-primary dark:bg-bg-1100 dark:xs:border dark:border-border-600 rounded-2xl p-6 sm:p-8 gap-6"
          >
            <div className="text-white flex flex-col items-center justify-center w-full text-center gap-3">
              <h2 className="text-2xl font-semibold text-text-200 dark:text-white">Forgot Password</h2>
            </div>

            <form
              className="flex flex-col justify-start items-start w-full gap-7"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <AuthInput
                id="email"
                label="Email"
                type="email"
                htmlFor="email"
                placeholder="Email"
                icon={
                  <Image
                    src={theme === "dark" ? icons.authIcons.mailDark : icons.authIcons.mail}
                    alt="email"
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                }
                error={errors.email?.message}
                {...register("email")}
              />

              <p className="w-full flex justify-center items-center gap-1 text-sm sm:text-base text-text-200 dark:text-white ">
                Back to
                <Link className="text-primary ml-1" href="/login">
                  Login
                </Link>
              </p>

              <CustomButton
                type="submit"
                disabled={!isValid || forgotPasswordLoading}
                isLoading={forgotPasswordLoading}
                className="w-full border-2 border-primary text-black text-base py-3.5"
              >
                Send OTP
              </CustomButton>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordContent;
