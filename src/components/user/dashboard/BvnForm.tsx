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
// OTP BVN flow removed – BVN verification is now Face ID only
import VerificationResultModal from "@/components/modals/VerificationResultModal";
import { useState } from "react";

const schema = yup.object().shape({
  bvn: yup.string().required("BVN is required"),
});

type EnterBvnFormData = yup.InferType<typeof schema>;

const BvnForm = ({
  handleComplete,
  setBvnDetails,
  onFaceIdSelected,
}: {
  handleComplete: (step: number) => void;
  setBvnDetails: (bvnDetails: { bvn: string }) => void;
  onFaceIdSelected?: (bvn: string) => void;
}) => {
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultType, setResultType] = useState<"success" | "error">("success");
  const [resultTitle, setResultTitle] = useState("");
  const [resultMessage, setResultMessage] = useState<string[]>([]);
  // OTP verification removed

  const form = useForm<EnterBvnFormData>({
    defaultValues: {
      bvn: "",
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const { register, handleSubmit, formState, reset } = form;
  const { errors, isValid } = formState;

  const bvnLoading = false;

  const onSubmit = async (data: EnterBvnFormData) => {
    setBvnDetails({ bvn: data.bvn });
    if (onFaceIdSelected) onFaceIdSelected(data.bvn);
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

      <div className="flex flex-col gap-4 mt-4">
        <CustomButton
          type="submit"
          disabled={!isValid}
          isLoading={bvnLoading}
          className="w-full bg-[#FF6B2C] hover:bg-[#FF7A3D] text-white text-base 2xs:text-lg max-2xs:px-6 py-3.5"
        >
          Verify with Face ID
        </CustomButton>
        <p className="w-full 2xs:w-[90%] sm:w-[80%] font-medium text-sm text-gray-400">
          Your BVN is secured with us. It only gives us access to your phone
          number, full name, gender, and date of birth.
        </p>
      </div>
    </motion.form>
  );
};

export default BvnForm;
