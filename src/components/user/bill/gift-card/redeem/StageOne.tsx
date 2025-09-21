/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomButton from "@/components/shared/Button";

import { useGetGCRedeemCode } from "@/api/gift-card/gift-card.queries";

import {
  handleNumericPaste,
  handleNumericKeyDown,
} from "@/utils/utilityFunctions";
import ErrorToast from "@/components/toast/ErrorToast";

const RedeemGiftCardStageOne = ({}) => {
  const [success, setSuccess] = useState(false);
  const schema = useMemo(
    () =>
      yup.object().shape({
        transactionId: yup.string().required("Transaction ID is required"),
      }),
    []
  );

  type FormData = yup.InferType<typeof schema>;

  const form = useForm<FormData>({
    defaultValues: {
      transactionId: "",
    },
    resolver: yupResolver(schema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const { register, handleSubmit, formState, watch, reset } = form;
  const { errors } = formState;

  const { response, isLoading, isError, refetch, error, isSuccess } =
    useGetGCRedeemCode({
      transactionId: Number(watch("transactionId")),
    });

  const loading = isLoading && !isError;

  const onSubmit = async () => {
    refetch();
  };

  useEffect(() => {
    if (isSuccess) {
      setSuccess(true);
    }
  }, [isSuccess]);

  if (error && (error as any).response) {
    ErrorToast({
      title: "Error during gift card redemption",
      descriptions: [(error as any).response.data?.message],
    });
  }

  if (success) {
    return (
      <div className="w-full py-5 xs:py-10 flex flex-col items-center justify-center">
        <div className="w-full sm:w-[85%] lg:w-[75%] xl:w-[65%] 2xl:w-[55%] dark:bg-[#000000] bg-transparent md:bg-[#F2F1EE] rounded-lg sm:rounded-xl p-0 2xs:p-4 md:p-8">
          <div className="flex flex-col gap-6">
            {response.map((item, index) => (
              <div key={index} className="text-text-200 dark:text-text-400">
                <p className="text-sm font-semibold">Gift Card {index + 1}</p>
                {item.cardNumber && (
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">Card Number:</p>
                    <p>{item.cardNumber}</p>
                  </div>
                )}
                {item.pinCode && (
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">Pin Code:</p>
                    <p>{item.pinCode}</p>
                  </div>
                )}
              </div>
            ))}

            <CustomButton
              type="button"
              onClick={() => {
                setSuccess(false);
                reset();
              }}
              className="mt-4 w-full border-2 dark:text-black dark:font-bold border-primary text-white text-base 2xs:text-lg max-2xs:px-6 py-3.5"
            >
              Continue
            </CustomButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-5 xs:py-10 flex flex-col items-center justify-center">
      <div className="w-full sm:w-[85%] lg:w-[75%] xl:w-[65%] 2xl:w-[55%] dark:bg-[#000000] bg-transparent md:bg-[#F2F1EE] rounded-lg sm:rounded-xl p-0 2xs:p-4 md:p-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-4 md:gap-6"
        >
          <h2 className="2xs:hidden text-2xl font-semibold text-text-800">
            Redeem Gift Card
          </h2>

          <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
            <label
              className="w-full text-sm sm:text-base font-medium  text-text-200 dark:text-text-800 mb-1 flex items-start "
              htmlFor={"transactionId"}
            >
              Transaction ID
            </label>
            <div className="w-full flex gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
              <input
                className="w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-200 dark:placeholder:text-text-1000 placeholder:text-sm"
                placeholder={`Enter transaction ID`}
                required={true}
                type="text"
                min={1}
                {...register("transactionId", {
                  valueAsNumber: true,
                })}
                onKeyDown={handleNumericKeyDown}
                onPaste={handleNumericPaste}
              />
            </div>

            {errors?.transactionId?.message && (
              <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                {errors?.transactionId?.message}
              </p>
            )}
          </div>

          <CustomButton
            type="submit"
            isLoading={loading}
            className="w-full border-2 dark:text-black dark:font-bold border-primary text-white text-base 2xs:text-lg max-2xs:px-6 py-3.5"
          >
            Redeem{" "}
          </CustomButton>
        </form>
      </div>
    </div>
  );
};

export default RedeemGiftCardStageOne;
