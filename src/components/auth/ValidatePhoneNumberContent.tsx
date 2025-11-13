/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import AuthInput from "./AuthInput";
import CustomButton from "@/components/shared/Button";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import useNavigate from "@/hooks/useNavigate";
import useAuthEmailStore from "@/store/authEmail.store";
import { useValidatePhoneNumber } from "@/api/user/user.queries";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Controller } from "react-hook-form";
import AuthHeader from "./AuthHeader";
import { IValidatePhoneNumber } from "@/api/user/user.types";

const schema = yup.object().shape({
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^\d{13}$/, "Phone number must be 11 digits"),
});

type ValidatePhoneNumberFormData = yup.InferType<typeof schema>;

const ValidatePhoneNumberContent = () => {
  const navigate = useNavigate();
  const { setAuthEmail, setAuthPhoneNumber } = useAuthEmailStore();
  const router = useRouter();

  const { authEmail } = useAuthEmailStore();
  const form = useForm<ValidatePhoneNumberFormData>({
    defaultValues: {
      phoneNumber: "",
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
      title: "Error during validating phone number",
      descriptions,
    });
  };

  const onSuccess = () => {
    setAuthPhoneNumber(form.getValues("phoneNumber"));
    SuccessToast({
      title: "Phone number validated!",
      description:
        "Check your phone number for verification code to verify your phone number",
    });

    navigate("/verify-phoneNumber");
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

  const {
    mutate: validatePhoneNumber,
    isPending: validatePhoneNumberPending,
    isError: validatePhoneNumberError,
  } = useValidatePhoneNumber(onError, onSuccess);

  const validatePhoneNumberLoading =
    validatePhoneNumberPending && !validatePhoneNumberError;

  const onSubmit = async (data: ValidatePhoneNumberFormData) => {
    validatePhoneNumber(data as IValidatePhoneNumber);
  };

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
                Validate your phone
              </h2>
              <p className="text-2xl opacity-95 mb-6 leading-relaxed">
                Enter your phone number to receive a verification code.
              </p>
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
            className="z-10 flex flex-col justify-start items-start w-full max-w-md bg-dark-primary dark:bg-bg-1100 dark:xs:border dark:border-border-600 rounded-2xl px-6 2xs:px-8 sm:px-10 py-6 sm:py-8 gap-6"
          >
            <div className="text-white flex flex-col items-center justify-center w-full text-center">
              <h2 className="text-xl xs:text-2xl lg:text-3xl text-text-200 dark:text-white font-semibold">
                Validate Phone Number
              </h2>
            </div>
            <form
              className="flex flex-col justify-start items-start w-full gap-7"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <Controller
                name="phoneNumber"
                control={form.control}
                render={({ field }) => (
                  <AuthInput
                    id="phoneNumber"
                    label="Phone Number"
                    type="phone"
                    maxLength={10}
                    value={field.value}
                    onChange={(val: any) => {
                      field.onChange(val);
                      console.log("Phone input value:", val);
                    }}
                    error={errors.phoneNumber?.message}
                  />
                )}
              />

              <CustomButton
                type="submit"
                disabled={!isValid || validatePhoneNumberLoading}
                isLoading={validatePhoneNumberLoading}
                className="mb-4  w-full  border-2 border-primary text-black text-base 2xs:text-lg max-2xs:px-6 py-3.5 xs:py-4"
              >
                Validate Phone Number{" "}
              </CustomButton>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ValidatePhoneNumberContent;
