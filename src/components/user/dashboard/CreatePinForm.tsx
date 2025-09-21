/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ErrorToast from "@/components/toast/ErrorToast";
import { motion } from "framer-motion";
import CustomButton from "@/components/shared/Button";
import {
  handleNumericKeyDown,
  handleNumericPaste,
} from "@/utils/utilityFunctions";
import SuccessToast from "@/components/toast/SuccessToast";
import { useCreatePin } from "@/api/user/user.queries";

const schema = yup.object().shape({
  pin: yup
    .string()
    .required("PIN is required")
    .min(4, "PIN must be at least 4 digits")
    .max(4, "PIN must be at most 4 digits"),
  confirmPin: yup
    .string()
    .oneOf([yup.ref("pin")], "PINs do not match")
    .required("Confirm PIN is required"),
});

type CreatePinFormData = yup.InferType<typeof schema>;

const CreatePinForm = ({
  handleComplete,
}: {
  handleComplete: (step: number) => void;
}) => {
  const form = useForm<CreatePinFormData>({
    defaultValues: {
      pin: "",
      confirmPin: "",
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const { register, handleSubmit, formState, reset } = form;
  const { errors, isValid } = formState;

  const onError = async (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage)
      ? errorMessage
      : [errorMessage];

    ErrorToast({
      title: "Error during PIN creation",
      descriptions,
    });
  };

  const onSuccess = () => {
    SuccessToast({
      title: "PIN Created",
      description: "Your PIN has been created successfully",
    });
    handleComplete(3);
    reset();
  };

  const {
    mutate: createPin,
    isPending: pinPending,
    isError: pinError,
  } = useCreatePin(onError, onSuccess);

  const pinLoading = pinPending && !pinError;

  const onSubmit = async (data: CreatePinFormData) => {
    createPin({
      pin: data.pin,
    });
  };

  return (
    <motion.form
      whileInView={{ opacity: [0, 1] }}
      transition={{ duration: 0.5, type: "tween" }}
      className="flex flex-col justify-start items-start w-full gap-6"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
        <label
          className="w-full text-sm sm:text-base text-text-200 dark:text-text-800 mb-1 flex items-start "
          htmlFor={"pin"}
        >
          Create transaction PIN{" "}
        </label>
        <div className="w-full flex gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
          <input
            className="w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-400 dark:placeholder:text-text-1000 placeholder:text-sm"
            placeholder="Enter PIN"
            required={true}
            type="password"
            {...register("pin")}
            onKeyDown={handleNumericKeyDown}
            onPaste={handleNumericPaste}
          />
        </div>

        {errors?.pin?.message ? (
          <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
            {errors?.pin?.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
        <label
          className="w-full text-sm sm:text-base text-text-200 dark:text-text-800 mb-1 flex items-start "
          htmlFor={"confirmPin"}
        >
          Confirm transaction PIN{" "}
        </label>
        <div className="w-full flex gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
          <input
            className="w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-400 dark:placeholder:text-text-1000 placeholder:text-sm"
            placeholder="Confirm PIN"
            required={true}
            type="password"
            {...register("confirmPin")}
            onKeyDown={handleNumericKeyDown}
            onPaste={handleNumericPaste}
          />
        </div>

        {errors?.confirmPin?.message ? (
          <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
            {errors?.confirmPin?.message}
          </p>
        ) : null}
      </div>

      <div className="w-full flex flex-col gap-4 mt-4">
        {" "}
        <CustomButton
          type="submit"
          disabled={!isValid || pinLoading}
          isLoading={pinLoading}
          className="w-full border-2 border-primary text-black text-base 2xs:text-lg max-2xs:px-6 py-3.5"
        >
          Create PIN{" "}
        </CustomButton>
      </div>
    </motion.form>
  );
};

export default CreatePinForm;
