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
import { useInitiateBvnVerification } from "@/api/wallet/wallet.queries";
import VerificationResultModal from "@/components/modals/VerificationResultModal";
import { useState } from "react";

const schema = yup.object().shape({
  bvn: yup.string().required("BVN is required"),
});

type EnterBvnFormData = yup.InferType<typeof schema>;

const BvnForm = ({
  handleComplete,
  setBvnDetails,
  verificationMethod,
  setVerificationMethod,
  onFaceIdSelected,
}: {
  handleComplete: (step: number) => void;
  setBvnDetails: (bvnDetails: { bvn: string; verificationId: string; verificationMethod?: "otp" | "faceid" }) => void;
  verificationMethod?: "otp" | "faceid";
  setVerificationMethod?: (method: "otp" | "faceid") => void;
  onFaceIdSelected?: (bvn: string) => void;
}) => {
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultType, setResultType] = useState<"success" | "error">("success");
  const [resultTitle, setResultTitle] = useState("");
  const [resultMessage, setResultMessage] = useState<string[]>([]);
  const [verificationId, setVerificationId] = useState<string>("");

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
      : [errorMessage || "BVN verification failed. Please try again."];

    setResultType("error");
    setResultTitle("BVN Verification Failed");
    setResultMessage(descriptions);
    setShowResultModal(true);
  };

  const onSuccess = (data: any) => {
    const responseData = data?.data?.data;
    const receivedVerificationId = responseData?.verificationId || "";
    const successMessage = data?.data?.message || "An OTP has been sent to your registered phone number.";
    
    // Store verification ID in state
    setVerificationId(receivedVerificationId);
    
    // Store verification ID for OTP validation
    const bvnValue = form.getValues("bvn");
    setBvnDetails({ 
      bvn: bvnValue, 
      verificationId: receivedVerificationId,
      verificationMethod: "otp"
    });
    
    // Only show success modal if we have verificationId
    if (receivedVerificationId) {
      setResultType("success");
      setResultTitle("OTP Sent Successfully");
      setResultMessage([successMessage]);
      setShowResultModal(true);
    } else {
      setResultType("error");
      setResultTitle("Verification Error");
      setResultMessage(["Failed to receive verification ID. Please try again."]);
      setShowResultModal(true);
    }
  };

  const handleResultModalClose = () => {
    setShowResultModal(false);
    if (resultType === "success" && verificationId) {
      // Move to OTP verification step
      handleComplete(1);
      reset();
    }
  };

  const {
    mutate: initiateBvn,
    isPending: bvnPending,
    isError: bvnError,
  } = useInitiateBvnVerification(onError, onSuccess);

  const bvnLoading = bvnPending && !bvnError;

  const onSubmit = async (data: EnterBvnFormData) => {
    const method = verificationMethod || "otp";
    setBvnDetails({ bvn: data.bvn, verificationId: "", verificationMethod: method });
    
    if (method === "faceid") {
      // Trigger face capture modal
      if (onFaceIdSelected) {
        onFaceIdSelected(data.bvn);
      }
    } else {
      // OTP method - initiate BVN verification
      initiateBvn(data);
    }
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
          htmlFor={"bvn"}
        >
          Your BVN{" "}
        </label>
        <div className="w-full flex gap-2 justify-center items-center bg-[#1C1C1E] border border-gray-700 rounded-lg py-4 px-3">
          <input
            className="w-full bg-transparent p-0 border-none outline-none text-base text-white placeholder:text-gray-500 placeholder:text-sm"
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

      {/* Verification Method Selection */}
      <div className="w-full flex flex-col gap-3 mt-4">
        <label className="text-sm sm:text-base text-white font-medium">
          Choose Verification Method
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setVerificationMethod?.("otp")}
            className={`p-5 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
              verificationMethod === "otp" || !verificationMethod
                ? "border-[#FF6B2C] bg-[#FF6B2C]/10"
                : "border-gray-700 bg-[#1C1C1E] hover:bg-[#2C2C2E]"
            }`}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              verificationMethod === "otp" || !verificationMethod
                ? "bg-[#FF6B2C] text-white"
                : "bg-[#2C2C2E] text-gray-400"
            }`}>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className={`text-sm font-semibold ${
              verificationMethod === "otp" || !verificationMethod
                ? "text-[#FF6B2C]"
                : "text-gray-300"
            }`}>
              OTP Verification
            </span>
          </button>
          <button
            type="button"
            onClick={() => setVerificationMethod?.("faceid")}
            className={`p-5 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
              verificationMethod === "faceid"
                ? "border-[#FF6B2C] bg-[#FF6B2C]/10"
                : "border-gray-700 bg-[#1C1C1E] hover:bg-[#2C2C2E]"
            }`}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              verificationMethod === "faceid"
                ? "bg-[#FF6B2C] text-white"
                : "bg-[#2C2C2E] text-gray-400"
            }`}>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className={`text-sm font-semibold ${
              verificationMethod === "faceid"
                ? "text-[#FF6B2C]"
                : "text-gray-300"
            }`}>
              Face ID
            </span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <CustomButton
          type="submit"
          disabled={!isValid || (bvnLoading && verificationMethod !== "faceid")}
          isLoading={bvnLoading && verificationMethod !== "faceid"}
          className="w-full bg-[#FF6B2C] hover:bg-[#FF7A3D] text-white text-base 2xs:text-lg max-2xs:px-6 py-3.5"
        >
          {verificationMethod === "faceid" ? "Verify with Face ID" : "Initiate BVN Verification"}
        </CustomButton>
        <p className="w-full 2xs:w-[90%] sm:w-[80%] font-medium text-sm text-gray-400">
          Your BVN is secured with us. It only gives us access to your phone
          number, full name, gender, and date of birth.
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

export default BvnForm;
