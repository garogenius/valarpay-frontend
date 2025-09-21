/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import OTPInput from "react-otp-input";
import useOtpCodeStore from "@/store/otpCode.store";
import ErrorToast from "@/components/toast/ErrorToast";
import useNavigate from "@/hooks/useNavigate";
import SuccessToast from "@/components/toast/SuccessToast";
import { useResetPin } from "@/api/user/user.queries";
import CustomButton from "@/components/shared/Button";

const resetPinFormSchema = Yup.object().shape({
  newPin: Yup.string()
    .required("Pin is required")
    .length(4, "Pin must be 4 digits"),
  confirmPin: Yup.string()
    .required("Confirm Pin is required")
    .test("pins-match", "Pins must match", function (value) {
      return value === this.parent.newPin;
    }),
});

const ResetPinForm = () => {
  const otpCode = useOtpCodeStore((state) => state.otpCode);
  const navigate = useNavigate();

  const form = useForm<Yup.InferType<typeof resetPinFormSchema>>({
    defaultValues: {
      newPin: "",
      confirmPin: "",
    },
    resolver: yupResolver(resetPinFormSchema),
    mode: "onChange",
  });

  const { setValue, handleSubmit, formState, watch } = form;
  const { errors, isValid } = formState;

  const watchedNewPin = watch("newPin");
  const watchedConfirmPin = watch("confirmPin");

  const handlePinPaste: React.ClipboardEventHandler = (event) => {
    const data = event.clipboardData.getData("text").slice(0, 4); // Get first 6 characters
    form.setValue("newPin", data);
  };

  const handleConfirmPinPaste: React.ClipboardEventHandler = (event) => {
    const data = event.clipboardData.getData("text").slice(0, 4); // Get first 6 characters
    form.setValue("confirmPin", data);
  };

  const handleNewPinChange = (value: string) => {
    setValue("newPin", value, { shouldValidate: true });
  };

  const handleConfirmPinChange = (value: string) => {
    setValue("confirmPin", value, { shouldValidate: true });
  };

  const onUpdatePinSuccess = () => {
    SuccessToast({
      title: "Pin Updated",
      description: "Your transaction pin has been updated successfully",
    });

    navigate("/user/settings", "replace");
  };

  const onUpdatePinError = (error: any) => {
    const errorMessage = error.response.data.message;
    const descriptions = Array.isArray(errorMessage)
      ? errorMessage
      : [errorMessage];

    ErrorToast({
      title: "Transaction pin failed to update",
      descriptions,
    });
  };

  const {
    mutate: updatePin,
    isPending: updatePinPending,
    isError: updatePinError,
  } = useResetPin(onUpdatePinError, onUpdatePinSuccess);

  const updateLoadingState = updatePinPending && !updatePinError;

  const onSubmit = async (data: Yup.InferType<typeof resetPinFormSchema>) => {
    const { newPin, confirmPin } = data;

    updatePin({
      otpCode: otpCode,
      pin: newPin,
      confirmPin,
    });
  };

  useEffect(() => {
    if (!otpCode) {
      ErrorToast({
        title: "Error",
        descriptions: ["No otpCode. Please try again."],
      });
      navigate("/user/settings", "replace");
    }
  }, [otpCode, navigate]);

  return (
    <div className="w-full h-full 2xs:bg-bg-600 2xs:dark:bg-bg-1100 py-4 md:py-8 px-1 2xs:px-5 lg:px-8 flex justify-center  rounded-xl sm:rounded-2xl">
      <div className="flex flex-col justify-center items-center gap-6 xs:gap-8  w-full xl:w-[80%] 2xl:w-[70%] bg-transparent lg:bg-bg-400 dark:bg-transparent lg:dark:bg-black rounded-lg sm:rounded-xl p-0 2xs:p-4 md:p-8">
        <div className="pt-6 w-[90%] flex flex-col gap-1.5 justify-center items-center text-center text-text-200 dark:text-text-400">
          <p className="w-full font-bold text-lg 2xs:text-xl">
            Set your new pin
          </p>
        </div>{" "}
        <div className=" w-full flex flex-col gap-3 items-center justify-center text-center">
          <p className="w-full font-bold text-sm 2xs:text-base text-text-2600">
            New Pin{" "}
          </p>
          <div className="flex flex-col items-center gap-2 justify-center w-full">
            <OTPInput
              value={watchedNewPin}
              onChange={handleNewPinChange}
              onPaste={handlePinPaste}
              numInputs={4}
              renderSeparator={<span className="w-1.5 2xs:w-2 xs:w-3"></span>}
              containerStyle={{}}
              skipDefaultStyles
              inputType="number"
              renderInput={(props) => (
                <input
                  {...props}
                  className="bg-bg-600 dark:bg-bg-1100 w-10 h-10 2xs:w-12 2xs:h-12 border border-border-600 rounded-md text-lg text-text-200 dark:text-text-400 text-center outline-none"
                />
              )}
            />
            {errors.newPin?.message && (
              <p className="text-red-500 text-sm">{errors.newPin.message}</p>
            )}{" "}
          </div>
        </div>
        <div className=" w-full flex flex-col gap-3 items-center justify-center text-center">
          <p className="w-full font-bold text-sm 2xs:text-base text-text-2600">
            Confirm Pin{" "}
          </p>
          <div className="flex flex-col items-center gap-2 justify-center w-full">
            <OTPInput
              value={watchedConfirmPin}
              onChange={handleConfirmPinChange}
              onPaste={handleConfirmPinPaste}
              numInputs={4}
              renderSeparator={<span className="w-1.5 2xs:w-2 xs:w-3"></span>}
              containerStyle={{}}
              skipDefaultStyles
              inputType="number"
              renderInput={(props) => (
                <input
                  {...props}
                  className="bg-bg-600 dark:bg-bg-1100 w-10 h-10 2xs:w-12 2xs:h-12 border border-border-600 rounded-md text-lg text-text-200 dark:text-text-400 text-center outline-none"
                />
              )}
            />
            {errors.confirmPin?.message && (
              <p className="text-red-500 text-sm">
                {errors.confirmPin.message}
              </p>
            )}{" "}
          </div>
        </div>
        <div className="mb-6 md:mb-8 mt-4 md:mt-6 w-full flex flex-col justify-center items-center gap-2.5">
          <CustomButton
            onClick={handleSubmit(onSubmit)}
            type="button"
            className="w-full 2xs:w-[90%] md:w-[80%] border-2 dark:text-black dark:font-bold border-primary text-white text-base 2xs:text-lg max-2xs:px-6 py-3"
            disabled={!isValid || updateLoadingState}
            isLoading={updateLoadingState}
          >
            Continue
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default ResetPinForm;
