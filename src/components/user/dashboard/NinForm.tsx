/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import CustomButton from "@/components/shared/Button";
import {
  handleNumericKeyDown,
  handleNumericPaste,
} from "@/utils/utilityFunctions";
import { useTier2Verification } from "@/api/user/user.queries";
import VerificationResultModal from "@/components/modals/VerificationResultModal";
import { useState } from "react";

const schema = yup.object().shape({
  nin: yup.string().required("NIN is required").length(11, "NIN must be exactly 11 digits"),
});

type EnterNinFormData = yup.InferType<typeof schema>;

const NinForm = ({
  handleComplete,
}: {
  handleComplete: (step: number) => void;
}) => {
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultType, setResultType] = useState<"success" | "error">("success");
  const [resultTitle, setResultTitle] = useState("");
  const [resultMessage, setResultMessage] = useState<string[]>([]);

  const form = useForm<EnterNinFormData>({
    defaultValues: {
      nin: "",
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
      : [errorMessage || "NIN verification failed. Please try again."];

    setResultType("error");
    setResultTitle("NIN Verification Failed");
    setResultMessage(descriptions);
    setShowResultModal(true);
  };

  const onSuccess = (data: any) => {
    const successMessage = data?.data?.message || "Your NIN has been verified successfully. Your wallet has been created.";
    
    setResultType("success");
    setResultTitle("NIN Verified Successfully!");
    setResultMessage([successMessage]);
    setShowResultModal(true);
  };

  const handleResultModalClose = () => {
    setShowResultModal(false);
    if (resultType === "success") {
      // Move to PIN creation step
      handleComplete(1);
      reset();
    }
  };

  const {
    mutate: verifyNin,
    isPending: ninPending,
    isError: ninError,
  } = useTier2Verification(onError, onSuccess);

  const ninLoading = ninPending && !ninError;

  const onSubmit = async (data: EnterNinFormData) => {
    verifyNin({ nin: data.nin });
  };

  return (
    <motion.form
      whileInView={{ opacity: [0, 1] }}
      transition={{ duration: 0.5, type: "tween" }}
      className="flex flex-col justify-start items-start w-full gap-4"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="flex flex-col justify-center items-center gap-1 w-full text-white">
        <label
          className="w-full text-sm sm:text-base text-white mb-1 flex items-start font-medium"
          htmlFor={"nin"}
        >
          Your NIN{" "}
        </label>
        <div className="w-full flex gap-2 justify-center items-center bg-[#1C1C1E] border border-gray-700 rounded-lg py-4 px-3">
          <input
            className="w-full bg-transparent p-0 border-none outline-none text-base text-white placeholder:text-gray-500 placeholder:text-sm"
            placeholder={"Enter your NIN"}
            required={true}
            maxLength={11}
            {...register("nin")}
            onKeyDown={handleNumericKeyDown}
            onPaste={handleNumericPaste}
          />
        </div>

        {errors?.nin?.message ? (
          <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
            {errors?.nin?.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-4 mt-4 w-full">
        <CustomButton
          type="submit"
          disabled={!isValid || ninLoading}
          isLoading={ninLoading}
          className="w-full bg-[#FF6B2C] hover:bg-[#FF7A3D] text-white text-base 2xs:text-lg max-2xs:px-6 py-3.5"
        >
          Proceed
        </CustomButton>
        <div className="flex items-start gap-2 text-gray-300">
          <svg className="w-5 h-5 text-[#FF6B2C] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-sm">
            Why we need your NIN
          </p>
        </div>
        <p className="text-xs text-gray-400">
          To check your NIN, dial *346# using the phone number linked to your bank account
        </p>
      </div>

      {/* Verification Result Modal */}
      <VerificationResultModal
        isOpen={showResultModal}
        onClose={handleResultModalClose}
        type={resultType}
        title={resultTitle}
        message={resultMessage}
        proceedButtonText={resultType === "success" ? "Continue" : "Try Again"}
      />
    </motion.form>
  );
};

export default NinForm;

