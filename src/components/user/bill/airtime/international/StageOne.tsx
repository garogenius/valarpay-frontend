"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import Image from "next/image";
import images from "../../../../../../public/images";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Switch from "@mui/material/Switch";
import CustomButton from "@/components/shared/Button";
import { useGetInternationalAirtimePlan } from "@/api/airtime/airtime.queries";
import { addBeneficiaryLabel } from "../../bill.data";
import { useTheme } from "@/store/theme.store";
import {
  formatNumberWithoutExponential,
  handleInput,
} from "@/utils/utilityFunctions";
import Beneficiaries from "../../Beneficiaries";
import {
  BENEFICIARY_TYPE,
  BeneficiaryProps,
  BILL_TYPE,
} from "@/constants/types";
import { useGetBeneficiaries } from "@/api/user/user.queries";
import SpinnerLoader from "@/components/Loader/SpinnerLoader";
import toast from "react-hot-toast";

type StageOneProps = {
  stage: "one" | "two" | "three";
  network: string;
  currency: string;
  setStage: (stage: "one" | "two" | "three") => void;
  setPhone?: (phone: string) => void;
  setAmount: (amount: string) => void;
  setNetwork?: (network: string) => void;
  setOperatorId: (operatorId: number) => void;
  isBeneficiaryChecked?: boolean;
  setIsBeneficiaryChecked?: (isBeneficiaryChecked: boolean) => void;
};

const InternationalAirtimeStageOne: React.FC<StageOneProps> = ({
  setStage,
  setPhone = () => {},
  setAmount,
  setNetwork = () => {},
  setOperatorId,
  isBeneficiaryChecked = false,
  setIsBeneficiaryChecked = () => {},
}) => {
  const [minimumAmount, setMinimumAmount] = useState<number>(0);
  const [maxAmount, setMaximumAmount] = useState<number>(0);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState("");
  const [plan, setPlan] = useState<any>();

  const theme = useTheme();

  const schema = useMemo(
    () =>
      yup.object().shape({
        phone: yup.string().required("Phone Number is required"),

        amount: yup
          .number()
          .required("Amount is required")
          .typeError("Invalid amount")

          .min(
            minimumAmount,
            `Minimum amount is ${minimumAmount} ${plan?.destinationCurrencyCode}`
          )
          .max(
            maxAmount,
            `Maximum amount is ${maxAmount} ${plan?.destinationCurrencyCode}`
          ),
      }),
    [plan, minimumAmount, maxAmount]
  );
  type AirtimeFormData = yup.InferType<typeof schema>;

  const form = useForm<AirtimeFormData>({
    defaultValues: {
      phone: "",
      amount: undefined,
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    formState,
    reset,
    watch,
    setValue,
    // clearErrors,
  } = form;
  const { errors, isValid } = formState;

  const watchedAmount = Number(watch("amount"));
  const watchedPhone = watch("phone");

  const {
    data: internationalAirtimePlan,
    isLoading: isInternationalAirtimePlanLoading,
    isError: isInternationalAirtimePlanError,
  } = useGetInternationalAirtimePlan({
    phone: watchedPhone,
  });

  const iaLoading =
    isInternationalAirtimePlanLoading && !isInternationalAirtimePlanError;

  useEffect(() => {
    const planData = internationalAirtimePlan?.data?.data;

    if (planData) {
      const { minAmount, maxAmount, operatorId } = planData;
      const min = formatNumberWithoutExponential(
        minAmount * planData?.fx?.rate,
        4
      );
      const max = formatNumberWithoutExponential(
        maxAmount * planData?.fx?.rate,
        4
      );
      if (planData?.denominationType === "RANGE") {
        setMinimumAmount(Number(min));
        setMaximumAmount(Number(max));
      } else {
        setMinimumAmount(Number(0));
        setMaximumAmount(Number(Infinity));
        setValue("amount", planData?.localFixedAmounts[0]);
      }
      setOperatorId(operatorId);
      setPlan(planData);
    }
  }, [internationalAirtimePlan?.data?.data, setOperatorId, setValue]);

  const onBackPressClick = () => {
    setValue("phone", "");
    setSelectedBeneficiary("");
    setPlan(undefined);
    setMinimumAmount(0);
    setMaximumAmount(0);
    reset();
  };

  const onSubmit = async (data: AirtimeFormData) => {
    if (!plan) {
      toast.error("Invalid plan");
      return;
    }
    Promise.all([
      Promise.resolve(setPhone(data.phone)),
      Promise.resolve(setNetwork(plan?.name)),
      Promise.resolve(
        setAmount(String(data.amount / plan?.fx?.rate + plan?.payAmount))
      ),
      Promise.resolve(setStage("two")),
    ]);
  };

  const handleBeneficiarySelect = (beneficiary: BeneficiaryProps) => {
    setSelectedBeneficiary(beneficiary.id);

    if (beneficiary?.billerNumber) {
      setValue("phone", beneficiary.billerNumber);
    }
  };

  const { beneficiaries } = useGetBeneficiaries({
    category: BENEFICIARY_TYPE.BILL,
    billType: BILL_TYPE.INTERNATIONAL_AIRTIME,
  });

  // const {
  //   data: internationalAirtimeFxRate,
  //   isLoading: isInternationalAirtimeFxRateLoading,
  //   isError: isInternationalAirtimeFxRateError,
  // } = useGetInternationalAirtimeFxRate({
  //   operatorId: plan?.operatorId,
  //   amount: watchedAmount,
  // });

  // const iaFxRateLoading =
  //   isInternationalAirtimeFxRateLoading && !isInternationalAirtimeFxRateError;

  console.log(plan);

  return (
    <div className="w-full py-5 xs:py-10 flex flex-col items-center justify-center">
      <div className="w-full sm:w-[85%] lg:w-[75%] xl:w-[65%] 2xl:w-[55%] dark:bg-[#000000] bg-transparent md:bg-[#F2F1EE] rounded-lg sm:rounded-xl p-0 2xs:p-4 md:p-8">
        {beneficiaries?.length > 0 && (
          <div className="mb-6 flex flex-col gap-1">
            <h2 className="text-base font-medum text-text-200 dark:text-text-400">
              Recent Beneficiaries
            </h2>
            <Beneficiaries
              beneficiaries={beneficiaries}
              handleBeneficiarySelect={handleBeneficiarySelect}
              selectedBeneficiary={selectedBeneficiary}
              type={BILL_TYPE.AIRTIME}
            />
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-4 md:gap-6"
        >
          <h2 className="2xs:hidden text-2xl font-semibold text-text-800">
            International Airtime
          </h2>
          {/* phone number section */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
              <label
                className="w-full text-sm sm:text-base font-medium  text-text-200 dark:text-text-800 mb-1 flex items-start "
                htmlFor={"phone"}
              >
                Phone Number{" "}
              </label>
              <div className="w-full flex gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                <input
                  className="w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-200 dark:placeholder:text-text-1000 placeholder:text-sm"
                  placeholder="Enter Phone Number"
                  required={true}
                  type="text"
                  onInput={handleInput}
                  {...register("phone")}
                />

                {watchedPhone && (
                  <Image
                    onClick={onBackPressClick}
                    src={images.airtime.backPress}
                    alt="backPress"
                    className="cursor-pointer"
                  />
                )}
              </div>

              {errors?.phone?.message ? (
                <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                  {errors?.phone?.message}
                </p>
              ) : null}
            </div>

            {/* Add beneficiary section */}
            <div className="flex items-center gap-2 sm:gap-4">
              <p className="text-sm md:text-base dark:text-white dark:text-opacity-60">
                Add as beneficiary
              </p>
              <Switch
                checked={isBeneficiaryChecked}
                onChange={(e) => setIsBeneficiaryChecked(e.target.checked)}
                {...addBeneficiaryLabel(theme === "dark")}
              />
            </div>
          </div>

          <div className="relative w-full flex flex-col gap-1">
            <label
              htmlFor="plan"
              className="text-base text-text-200 dark:text-text-400 mb-1 flex items-start w-full"
            >
              Plan
            </label>
            <div
              onClick={() => {}}
              className="w-full flex gap-2 justify-center items-center bg-bg-2000 border border-border-600 rounded-lg py-4 px-3"
            >
              <div className="w-full flex items-center justify-between text-text-700 dark:text-text-1000">
                {iaLoading ? (
                  <div className="flex items-center gap-2 px-2 text-text-200 dark:text-text-400">
                    <SpinnerLoader width={20} height={20} color="#d4b139" />
                    <p>Fetching...</p>
                  </div>
                ) : (
                  <>
                    {!watchedPhone || !plan ? (
                      <p className="text-sm">Enter valid phone number </p>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Image
                          src={plan?.logoUrls[0] || ""}
                          alt={`${plan?.name} logo`}
                          width={24}
                          height={24}
                          className="w-7 h-7 rounded-full"
                          unoptimized
                        />
                        <p className="uppercase 2xs:text-base text-sm font-medium">
                          {plan?.name} data
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            {plan ? (
              <p className="text-sm text-primary">
                {plan?.destinationCurrencyCode !== "NGN" &&
                  `1 ${plan?.senderCurrencyCode} = ${Number(
                    formatNumberWithoutExponential(plan?.fx?.rate, 2)
                  )} ${plan?.destinationCurrencyCode}`}
              </p>
            ) : null}
          </div>

          {plan?.denominationType === "RANGE" ? (
            <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
              <label
                className="w-full text-sm sm:text-base font-medium  text-text-200 dark:text-text-800 mb-1 flex items-start "
                htmlFor={"amount"}
              >
                Amount{" "}
                {plan && plan?.destinationCurrencyCode
                  ? `in ${plan?.destinationCurrencyCode}`
                  : ""}
              </label>

              <div className="w-full flex gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                <input
                  className="w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-[#797B86] dark:placeholder:text-text-1000 placeholder:text-sm"
                  placeholder={`Enter amount  ${
                    plan?.destinationCurrencyCode
                      ? `in ${plan?.destinationCurrencyCode}`
                      : ""
                  }`}
                  required={true}
                  type="number"
                  {...register("amount")}
                  // onKeyDown={handleNumericKeyDown}
                  // onPaste={handleNumericPaste}
                />
              </div>

              <div className="flex flex-col gap-1 self-start text-sm text-primary">
                {plan && plan?.payAmount ? (
                  <p>Fee: {`₦${plan?.payAmount}`}</p>
                ) : null}
                {watchedAmount && plan && plan?.fx?.rate ? (
                  <p>
                    Paying:{" "}
                    {`₦${Number(
                      formatNumberWithoutExponential(
                        watchedAmount / plan?.fx?.rate + plan?.payAmount,
                        2
                      )
                    ).toLocaleString()}`}
                  </p>
                ) : null}
              </div>

              {errors?.amount?.message && (
                <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                  {errors?.amount?.message}
                </p>
              )}
            </div>
          ) : null}

          {plan?.denominationType === "FIXED" ? (
            <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
              <label
                className="w-full text-sm sm:text-base font-medium  text-text-200 dark:text-text-800 mb-1 flex items-start "
                htmlFor={"amount"}
              >
                Select Amount
                {plan && plan?.destinationCurrencyCode
                  ? `in ${plan?.destinationCurrencyCode}`
                  : ""}
              </label>

              <div className="w-full flex gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                <select
                  className="w-full bg-transparent p-0 border-none outline-none dark:bg-bg-2100 text-base text-text-200 dark:text-white placeholder:text-[#797B86] dark:placeholder:text-text-1000 placeholder:text-sm"
                  {...register("amount")}
                >
                  <option value={undefined}>Select Amount</option>
                  {plan &&
                    plan?.localFixedAmounts.map(
                      (denomination: number, index: number) => (
                        <option className="" key={index} value={denomination}>
                          {denomination} {plan?.destinationCurrencyCode}
                        </option>
                      )
                    )}
                </select>
              </div>

              <div className="flex flex-col gap-1 self-start text-sm text-primary">
                {plan && plan?.payAmount ? (
                  <p>Fee: {`₦${plan?.payAmount}`}</p>
                ) : null}
                {watchedAmount && plan && plan?.fx?.rate ? (
                  <p>
                    Paying:{" "}
                    {`₦${Number(
                      formatNumberWithoutExponential(
                        watchedAmount / plan?.fx?.rate + plan?.payAmount,
                        2
                      )
                    ).toLocaleString()}`}
                  </p>
                ) : null}
              </div>

              {errors?.amount?.message && (
                <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                  {errors?.amount?.message}
                </p>
              )}
            </div>
          ) : null}

          <CustomButton
            type="submit"
            disabled={!isValid}
            className="w-full border-2 dark:text-black dark:font-bold border-primary text-white text-base 2xs:text-lg max-2xs:px-6 py-3.5"
          >
            Next{" "}
          </CustomButton>
        </form>
      </div>
    </div>
  );
};

export default InternationalAirtimeStageOne;
