"use client";

import Image from "next/image";
import images from "../../../../../public/images";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Switch from "@mui/material/Switch";
import CustomButton from "@/components/shared/Button";

import { addBeneficiaryLabel } from "../bill.data";
import { useTheme } from "@/store/theme.store";
import {
  handleNumericKeyDown,
  handleNumericPaste,
} from "@/utils/utilityFunctions";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import {
  useGetInternetPlans,
  useGetInternetVariations,
} from "@/api/internet/internet.queries";

import { motion } from "framer-motion";
import SearchableDropdown from "@/components/shared/SearchableDropdown";
import {
  BENEFICIARY_TYPE,
  BeneficiaryProps,
  BILL_TYPE,
} from "@/constants/types";
import { useGetBeneficiaries } from "@/api/user/user.queries";
import Beneficiaries from "../Beneficiaries";

type StageOneProps = {
  billerNumber: string;
  currency: string;
  setStage: (stage: "one" | "two" | "three") => void;
  setBillerCode?: (code: string) => void;
  setAmount: (amount: string) => void;
  setBillerNumber?: (code: string) => void;
  setItemCode: (code: string) => void;
  setInternetProvider: (provider: string) => void;
  isBeneficiaryChecked?: boolean;
  setIsBeneficiaryChecked?: (isBeneficiaryChecked: boolean) => void;
  setCheckoutMessage: (checkoutMessage: string) => void;
};

const InternetStageOne: React.FC<StageOneProps> = ({
  currency,
  setStage,
  setBillerNumber = () => {},
  setAmount,
  setBillerCode = () => {},
  setItemCode,
  setInternetProvider,
  isBeneficiaryChecked = false,
  setIsBeneficiaryChecked = () => {},
  setCheckoutMessage = () => {},
}) => {
  const theme = useTheme();

  const schema = useMemo(
    () =>
      yup.object().shape({
        billerNumber: yup.string().required("Meter Number is required"),

        billerCode: yup.string().required("Biller code is required"),

        itemCode: yup.string().required("Item Code is required"),
        provider: yup.string().required("Provider is required"),
        plan: yup.string().required("Plan is required"),

        amount: yup
          .number()
          .required("Amount is required")
          .typeError("Amount is required"),
        // .min(500, "Minimum amount is ₦500"),
      }),
    []
  );

  type AirtimeFormData = yup.InferType<typeof schema>;
  const [selectedBeneficiary, setSelectedBeneficiary] = useState("");

  const form = useForm<AirtimeFormData>({
    defaultValues: {
      billerNumber: "",
      billerCode: "",
      itemCode: "",
      provider: "",
      plan: "",
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
    clearErrors,
  } = form;
  const { errors } = formState;

  const watchedBillerNumber = watch("billerNumber");
  const watchedBillerCode = watch("billerCode");
  const watchedItemCode = watch("itemCode");
  const watchedProvider = watch("provider");
  const watchedPlan = watch("plan");

  const [providerState, setProviderState] = useState(false);
  const [planState, setPlanState] = useState(false);

  const [fee, setFee] = useState(0);

  const {
    internetPlans,
    isPending: isInternetPlanPending,
    isError: isInternetPlanError,
  } = useGetInternetPlans({
    currency,
    isEnabled: !!watchedBillerNumber,
  });

  const isInternetPlanLoading = isInternetPlanPending && !isInternetPlanError;

  const {
    variations,
    isLoading: internetVariationsPending,
    isError: internetVariationsError,
  } = useGetInternetVariations({
    billerCode: watchedBillerCode,
  });

  const internetVariationsLoading =
    internetVariationsPending && !internetVariationsError;

  useEffect(() => {
    if (errors?.billerNumber?.message) {
      setValue("billerCode", "");
      setValue("provider", "");
      setValue("plan", "");
      setValue("itemCode", "");
    }
  }, [watchedBillerNumber, errors?.billerNumber?.message, setValue]);

  const onBackPressClick = () => {
    setValue("billerNumber", "");
    setValue("provider", "");
    setValue("plan", "");
    reset();
    setSelectedBeneficiary("");
  };

  const dropdownProviderRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(dropdownProviderRef, () => {
    setProviderState(false);
  });

  const dropdownPlanRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(dropdownPlanRef, () => {
    setPlanState(false);
  });

  const onSubmit = async (data: AirtimeFormData) => {
    Promise.all([
      Promise.resolve(setItemCode(data.itemCode)),
      Promise.resolve(setBillerCode(data.billerCode)),
      Promise.resolve(setBillerNumber(data.billerNumber)),
      Promise.resolve(setAmount(String(data.amount + fee))),
      Promise.resolve(setCheckoutMessage(String(`${data.plan}`))),
      Promise.resolve(setInternetProvider(data.provider)),
      Promise.resolve(setStage("two")),
    ]);
  };

  const handleBeneficiarySelect = (beneficiary: BeneficiaryProps) => {
    setSelectedBeneficiary(beneficiary.id);

    if (beneficiary?.billerNumber) {
      setValue("billerNumber", beneficiary.billerNumber);
    }
  };

  const { beneficiaries } = useGetBeneficiaries({
    category: BENEFICIARY_TYPE.BILL,
    billType: BILL_TYPE.INTERNET,
  });

  // Add a derived isValid state based on specific fields
  const isSubmitValid =
    !!watchedBillerNumber &&
    !!watchedBillerCode &&
    !!watchedItemCode &&
    !!watchedProvider &&
    !!watchedPlan;

  return (
    <div className="w-full py-5 xs:py-10 flex flex-col items-center justify-center">
      <div className="w-[100%] sm:w-[85%] lg:w-[75%] xl:w-[65%] 2xl:w-[55%] dark:bg-[#000000] bg-transparent md:bg-[#F2F1EE] rounded-lg sm:rounded-xl p-0 2xs:p-4 md:p-8">
        {beneficiaries?.length > 0 && (
          <div className="mb-6 flex flex-col gap-1">
            <h2 className="text-base font-medum text-text-200 dark:text-text-400">
              Recent Beneficiaries
            </h2>
            <Beneficiaries
              beneficiaries={beneficiaries}
              handleBeneficiarySelect={handleBeneficiarySelect}
              selectedBeneficiary={selectedBeneficiary}
              type={BILL_TYPE.ELECTRICITY}
            />
          </div>
        )}

        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-4 md:gap-6"
        >
          <div className="flex flex-col items-end gap-2">
            <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
              <label
                className="w-full text-sm sm:text-base font-medium  text-text-200 dark:text-text-800 mb-1 flex items-start "
                htmlFor={"billerNumber"}
              >
                Device Number{" "}
              </label>
              <div className="w-full flex gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                <input
                  className="w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-200 dark:placeholder:text-text-1000 placeholder:text-sm"
                  placeholder="Enter Device Number"
                  required={true}
                  type="text"
                  {...register("billerNumber")}
                  onKeyDown={handleNumericKeyDown}
                  onPaste={handleNumericPaste}
                />

                {watchedBillerNumber && (
                  <Image
                    onClick={onBackPressClick}
                    src={images.airtime.backPress}
                    alt="backPress"
                    className="cursor-pointer"
                  />
                )}
              </div>

              {errors?.billerNumber?.message ? (
                <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                  {errors?.billerNumber?.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col  ">
              <div className="flex items-center gap-2 sm:gap-4 ">
                <p className="text-sm md:text-base dark:text-white dark:text-opacity-70">
                  Add as beneficiary
                </p>
                <Switch
                  checked={isBeneficiaryChecked}
                  onChange={(e) => setIsBeneficiaryChecked(e.target.checked)}
                  {...addBeneficiaryLabel(theme === "dark")}
                />
              </div>
            </div>
          </div>

          <div
            ref={dropdownProviderRef}
            className="relative w-full flex flex-col gap-1"
          >
            <label
              htmlFor="provider"
              className="text-base text-text-200 dark:text-text-400 mb-1 flex items-start w-full"
            >
              Network Provider{" "}
            </label>
            <div
              onClick={() => {
                if (watchedBillerNumber) {
                  setProviderState(!providerState);
                }
              }}
              className="w-full flex gap-2 justify-center items-center bg-bg-2000 border border-border-600 rounded-lg py-4 px-3"
            >
              <div className="w-full flex items-center justify-between text-text-700 dark:text-text-1000">
                {" "}
                {!watchedBillerNumber ? (
                  <p className="text-sm 2xs:text-base">
                    Enter valid device number{" "}
                  </p>
                ) : !watchedProvider || !watchedBillerCode ? (
                  <p className="text-sm 2xs:text-base">Select provider </p>
                ) : (
                  <div className="flex items-center gap-2">
                    {/* <Image
                      src={activeProvider?.logo || ""}
                      alt={`${watchedProvider} logo`}
                      className="w-6 h-6 rounded-full"
                    /> */}
                    <p className="uppercase 2xs:text-base text-sm font-medium">
                      {watchedProvider}
                    </p>
                  </div>
                )}
                <motion.svg
                  animate={{
                    rotate: providerState ? 180 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="w-4 h-4 text-text-700 dark:text-text-1000 cursor-pointer"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </motion.svg>
              </div>
            </div>

            {providerState && (
              <div className="absolute top-full my-2.5 px-1 py-2 overflow-y-auto h-fit max-h-60 w-full bg-bg-600 border dark:bg-bg-1100 border-gray-300 dark:border-border-600 rounded-md shadow-md z-10 no-scrollbar">
                <SearchableDropdown
                  items={internetPlans}
                  searchKey="shortName"
                  displayFormat={(provider) => {
                    // const providerData = ElectricityProvidersData.find(
                    //   (item) => provider.shortName.toLowerCase() === item.disco
                    // );
                    return (
                      <div className="flex items-center gap-2">
                        {/* <Image
                          src={providerData?.logo || ""}
                          alt={`${provider.shortName} logo`}
                          className="w-7 h-7 rounded-full"
                        /> */}
                        <p className="uppercase 2xs:text-base text-sm font-medium text-text-200 dark:text-text-400">
                          {provider.shortName}
                        </p>
                      </div>
                    );
                  }}
                  onSelect={(plan) => {
                    setValue("billerCode", plan.billerCode);
                    setValue("provider", plan.shortName);
                    setValue("itemCode", "");
                    clearErrors("billerCode");
                    clearErrors("provider");
                    setProviderState(false);
                  }}
                  showSearch={false}
                  placeholder="Search Provider..."
                  isOpen={providerState}
                  onClose={() => setProviderState(false)}
                  isLoading={isInternetPlanLoading}
                />
              </div>
            )}
          </div>

          <div
            ref={dropdownPlanRef}
            className="relative w-full flex flex-col gap-1"
          >
            <label
              htmlFor="plan"
              className="text-base text-text-200 dark:text-text-400 mb-1 flex items-start w-full"
            >
              Select a Plan{" "}
            </label>
            <div
              onClick={() => {
                if (
                  watchedBillerNumber &&
                  watchedProvider &&
                  watchedBillerCode
                ) {
                  setPlanState(!planState);
                }
              }}
              className="w-full flex gap-2 justify-center items-center bg-bg-2000 border border-border-600 rounded-lg py-4 px-3"
            >
              <div className="w-full flex items-center justify-between text-text-700 dark:text-text-1000">
                {" "}
                {!watchedBillerNumber ? (
                  <p className="text-sm 2xs:text-base">Select a provider </p>
                ) : !watchedProvider || !watchedBillerCode ? (
                  <p className="text-sm 2xs:text-base">Select provider </p>
                ) : !watchedItemCode || !watchedPlan ? (
                  <p className="text-sm 2xs:text-base">Select plan </p>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="uppercase 2xs:text-base text-sm font-medium">
                      {watchedPlan}
                    </p>
                  </div>
                )}
                <motion.svg
                  animate={{
                    rotate: planState ? 180 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="w-4 h-4 text-text-700 dark:text-text-1000 cursor-pointer"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </motion.svg>
              </div>
            </div>

            {planState && (
              <div className="absolute top-full my-2.5 px-1 py-2 overflow-y-auto h-fit max-h-60 w-full bg-bg-600 border dark:bg-bg-1100 border-gray-300 dark:border-border-600 rounded-md shadow-md z-10 no-scrollbar">
                <SearchableDropdown
                  items={variations}
                  searchKey="short_name"
                  displayFormat={(plan) => {
                    return (
                      <div className="flex items-center gap-2">
                        <p className="uppercase 2xs:text-base text-sm font-medium text-text-200 dark:text-text-400">
                          {plan.short_name}
                        </p>
                      </div>
                    );
                  }}
                  onSelect={(plan) => {
                    setValue("plan", plan.short_name);
                    setValue("itemCode", plan.item_code);
                    clearErrors("plan");
                    clearErrors("itemCode");
                    setProviderState(false);
                    setPlanState(false);
                    if (plan.amount === 0) {
                      setValue("amount", 0);
                      setFee(plan.payAmount);
                    } else {
                      setValue("amount", plan.payAmount);
                      setFee(0);
                    }
                  }}
                  showSearch={false}
                  placeholder="Search Plan..."
                  isOpen={planState}
                  onClose={() => setPlanState(false)}
                  isLoading={internetVariationsLoading}
                />
              </div>
            )}
          </div>

          {/* amount section */}
          <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
            <label
              className="w-full text-sm sm:text-base font-medium  text-text-200 dark:text-text-800 mb-1 flex items-start "
              htmlFor={"amount"}
            >
              Amount (₦)
            </label>

            <div className="w-full flex flex-col gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
              <input
                className="w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-[#797B86] dark:placeholder:text-text-1000 placeholder:text-sm"
                placeholder="₦5,000"
                type="number"
                disabled={fee === 0}
                {...register("amount")}
                // onKeyDown={handleNumericKeyDown}
                // onPaste={handleNumericPaste}
              />
            </div>
            {fee && fee !== 0 ? (
              <p className="flex self-start text-sm text-primary">
                Fee: {`₦${fee}`}
              </p>
            ) : null}

            {errors?.amount?.message && (
              <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                {errors?.amount?.message}
              </p>
            )}
          </div>

          <CustomButton
            type="submit"
            disabled={!isSubmitValid}
            className="w-full border-2 dark:text-black dark:font-bold border-primary text-white text-base 2xs:text-lg max-2xs:px-6 py-3.5"
          >
            Next{" "}
          </CustomButton>
        </form>
      </div>
    </div>
  );
};

export default InternetStageOne;
