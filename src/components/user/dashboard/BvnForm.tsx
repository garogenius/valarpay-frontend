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
import { useInitiateBvnVerification } from "@/api/wallet/wallet.queries";
import SuccessToast from "@/components/toast/SuccessToast";

const schema = yup.object().shape({
  bvn: yup.string().required("BVN is required"),
});

type EnterBvnFormData = yup.InferType<typeof schema>;

const BvnForm = ({
  handleComplete,
  setBvnDetails,
}: {
  handleComplete: (step: number) => void;
  setBvnDetails: (bvnDetails: { bvn: string; verificationId: string }) => void;
}) => {
  const form = useForm<EnterBvnFormData>({
    defaultValues: {
      bvn: "",
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
      title: "Error during bvn initialization",
      descriptions,
    });
  };

  const onSuccess = (data: any) => {
    SuccessToast({
      title: "BVN Verification Initiated",
      description: data?.data?.message,
    });
    setBvnDetails({
      bvn: data?.data?.data?.bvn,
      verificationId: data?.data?.data?.verificationId,
    });
    handleComplete(1);
    reset();
  };

  const {
    mutate: initiateBvn,
    isPending: bvnPending,
    isError: bvnError,
  } = useInitiateBvnVerification(onError, onSuccess);

  const bvnLoading = bvnPending && !bvnError;

  const onSubmit = async (data: EnterBvnFormData) => {
    initiateBvn(data);
  };

  return (
    <motion.form
      whileInView={{ opacity: [0, 1] }}
      transition={{ duration: 0.5, type: "tween" }}
      className="flex flex-col justify-start items-start w-full gap-4"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
        <label
          className="w-full text-sm sm:text-base text-text-200 dark:text-text-800 mb-1 flex items-start "
          htmlFor={"bvn"}
        >
          Your BVN{" "}
        </label>
        <div className="w-full flex gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
          <input
            className="w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-400 dark:placeholder:text-text-1000 placeholder:text-sm"
            placeholder={"22212345678"}
            required={true}
            {...register("bvn")}
            onKeyDown={handleNumericKeyDown}
            onPaste={handleNumericPaste}
          />
        </div>

        {errors?.bvn?.message ? (
          <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
            {errors?.bvn?.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {" "}
        <CustomButton
          type="submit"
          disabled={!isValid || bvnLoading}
          isLoading={bvnLoading}
          className="w-full  border-2 border-primary text-black text-base 2xs:text-lg max-2xs:px-6 py-3.5"
        >
          Initiate BVN Verification{" "}
        </CustomButton>
        <p className="w-full 2xs:w-[90%] sm:w-[80%] font-medium text-sm text-text-200 dark:text-text-800 ">
          Your BVN is secured with us. It only gives us access to your phone
          number, full name, gender, and date of birth.
        </p>
      </div>
    </motion.form>
  );
};

export default BvnForm;
