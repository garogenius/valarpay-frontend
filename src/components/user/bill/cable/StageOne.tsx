"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import Image from "next/image";
import images from "../../../../../public/images";
import Switch from "@mui/material/Switch";
import { useTheme } from "@/store/theme.store";
import {
  getCableIconByString,
  handleNumericKeyDown,
  handleNumericPaste,
} from "@/utils/utilityFunctions";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { motion } from "framer-motion";
import SearchableDropdown from "@/components/shared/SearchableDropdown";
import SpinnerLoader from "@/components/Loader/SpinnerLoader";
import Skeleton from "react-loading-skeleton";
import EmptyState from "@/components/user/table/EmptyState";
import { addBeneficiaryLabel } from "../bill.data";
import {
  useGetCablePlans,
  useGetCableVariations,
  useVerifyCableNumber,
} from "@/api/cable/cable.queries";
import ErrorToast from "@/components/toast/ErrorToast";
import {
  BENEFICIARY_TYPE,
  BeneficiaryProps,
  BILL_TYPE,
} from "@/constants/types";
import { useGetBeneficiaries } from "@/api/user/user.queries";
import Beneficiaries from "../Beneficiaries";

type CableStageOneProps = {
  billerNumber: string;
  currency: string;
  setStage: (stage: "one" | "two" | "three") => void;
  setBillerCode?: (code: string) => void;
  setAmount: (amount: string) => void;
  setBillerNumber?: (code: string) => void;
  setCableProvider?: (provider: string) => void;
  setItemCode: (code: string) => void;
  isBeneficiaryChecked?: boolean;
  setIsBeneficiaryChecked?: (isBeneficiaryChecked: boolean) => void;
  setCheckoutMessage: (checkoutMessage: string) => void;
};

const DataStageOne: React.FC<CableStageOneProps> = ({
  currency,
  setStage,
  setBillerNumber = () => {},
  setAmount,
  setBillerCode = () => {},
  setItemCode,
  isBeneficiaryChecked = false,
  setIsBeneficiaryChecked = () => {},
  setCheckoutMessage = () => {},
}) => {
  const theme = useTheme();
  const schema = yup.object().shape({
    billerNumber: yup
      .string()
      .required("Smartcard Number is required")
      .min(10, "Phone Number must be at least 11 digits")
      .max(15, "Phone Number must be exactly 11 digits"),
    billerCode: yup.string().required("Biller code is required"),

    itemCode: yup.string().required("Item Code is required"),
    provider: yup.string().required("Provider is required"),

    amount: yup
      .number()
      .required("Amount is required")
      .typeError("Amount is required"),
  });

  type AirtimeFormData = yup.InferType<typeof schema>;

  const form = useForm<AirtimeFormData>({
    defaultValues: {
      billerNumber: "",
      billerCode: "",
      provider: "",
      itemCode: "",
      amount: undefined,
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const {
    register,
    // handleSubmit,
    formState,
    // reset,
    watch,
    setValue,
    clearErrors,
  } = form;
  const { errors } = formState;

  const watchedBillerNumber = watch("billerNumber");
  const watchedBillerCode = watch("billerCode");
  const watchedProvider = watch("provider");

  const [providerState, setProviderState] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState("");

  const {
    cablePlans,
    isPending: isCablePlanPending,
    isError: isCablePlanError,
  } = useGetCablePlans({
    currency,
    isEnabled: !!watchedBillerNumber,
  });

  const isCablePlanLoading = isCablePlanPending && !isCablePlanError;
  const [verificationMessage, setVerificationMessage] = useState<string>("");
  const [verificationError, setVerificationError] = useState<string>("");

  const onVerifySuccess = (data: any) => {
    const res = data?.data?.data;
    setVerificationMessage(res?.name);
    setVerificationError("");
  };

  const onVerifyError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    console.log(errorMessage);
    setVerificationMessage("");
    setVerificationError(errorMessage);
    const descriptions = Array.isArray(errorMessage)
      ? errorMessage
      : [errorMessage];

    ErrorToast({
      title: "Error verifying smartcard number",
      descriptions,
    });
  };
  const {
    mutate: verify,
    isPending: verifyPending,
    isError: verifyError,
  } = useVerifyCableNumber(onVerifyError, onVerifySuccess);

  const verifyLoading = verifyPending && !verifyError;

  const {
    variations,
    isLoading: cableVariationsPending,
    isError: cableVariationsError,
  } = useGetCableVariations({
    billerCode: watchedBillerCode,
  });

  const cableVariationsLoading =
    cableVariationsPending && !cableVariationsError;

  useEffect(() => {
    if (
      watchedBillerNumber &&
      watchedBillerNumber.length >= 10 &&
      watchedBillerNumber.length < 15 &&
      watchedBillerCode &&
      variations &&
      variations.length > 0 &&
      watchedProvider
    ) {
      verify({
        itemCode: variations[0].item_code,
        billerCode: watchedBillerCode,
        billerNumber: watchedBillerNumber,
      });
    }
  }, [
    watchedBillerNumber,
    cablePlans,
    variations,
    watchedProvider,
    watchedBillerCode,
    verify,
  ]);

  useEffect(() => {
    if (errors?.billerNumber?.message) {
      setValue("billerCode", "");
      setValue("provider", "");
      setValue("itemCode", "");
    }
  }, [watchedBillerNumber, verify, errors?.billerNumber?.message, setValue]);

  const onBackPressClick = () => {
    setValue("billerNumber", "");
    setValue("provider", "");
    setVerificationError("");
    setVerificationMessage("");
    setSelectedBeneficiary("");
  };

  const dropdownRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(dropdownRef, () => {
    setProviderState(false);
  });

  const handleBeneficiarySelect = (beneficiary: BeneficiaryProps) => {
    setSelectedBeneficiary(beneficiary.id);

    if (beneficiary?.billerNumber) {
      setValue("billerNumber", beneficiary.billerNumber);
    }
  };

  const { beneficiaries } = useGetBeneficiaries({
    category: BENEFICIARY_TYPE.BILL,
    billType: BILL_TYPE.CABLE,
  });

  return (
    <div className="w-full py-5 xs:py-10 flex flex-col items-center justify-center">
      <div className="w-full bg-transparent p-2 xs:p-4">
        {beneficiaries?.length > 0 && (
          <div className="mb-6 flex flex-col gap-1">
            <h2 className="text-base font-medum text-text-200 dark:text-text-400">
              Recent Beneficiaries
            </h2>
            <Beneficiaries
              beneficiaries={beneficiaries}
              handleBeneficiarySelect={handleBeneficiarySelect}
              selectedBeneficiary={selectedBeneficiary}
              type={BILL_TYPE.CABLE}
            />
          </div>
        )}

        <div className="flex flex-col gap-2 h-full w-full">
          <div className="flex flex-col sm:flex-row items-start h-full w-full  lg:w-[90%] xl:w-[80%] 2xl:w-[70%] gap-4">
            {/* phone number section */}
            <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
              <label
                className="w-full text-sm sm:text-base font-medium  text-text-200 dark:text-text-800 mb-1 flex items-start "
                htmlFor={"billerNumber"}
              >
                Smartcard Number{" "}
              </label>
              <div className="w-full flex gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                <input
                  className="w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-200 dark:placeholder:text-text-1000 placeholder:text-sm"
                  placeholder="Enter Smart card"
                  required={true}
                  type="text"
                  minLength={10}
                  maxLength={15}
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

            <div
              ref={dropdownRef}
              className="relative w-full flex flex-col gap-1"
            >
              <label
                htmlFor="network"
                className="text-base text-text-200 dark:text-text-400 mb-1 flex items-start w-full"
              >
                Select Provider{" "}
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
                  {!watchedBillerNumber ||
                  watchedBillerNumber.length < 10 ||
                  watchedBillerNumber.length > 15 ? (
                    <p className="text-sm 2xs:text-base">
                      Enter valid smartcard number{" "}
                    </p>
                  ) : !watchedProvider || !watchedBillerCode ? (
                    <p className="text-sm 2xs:text-base">Select provider </p>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Image
                        src={
                          getCableIconByString(watchedProvider.toLowerCase()) ||
                          ""
                        }
                        alt={`${watchedProvider} logo`}
                        className="w-6 h-6 rounded-full"
                      />
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
                    items={cablePlans}
                    searchKey="shortName"
                    displayFormat={(plan) => (
                      <div className="flex items-center gap-2">
                        <Image
                          src={
                            getCableIconByString(
                              plan.shortName.toLowerCase()
                            ) || ""
                          }
                          alt={`${plan.shortName} logo`}
                          className="w-7 h-7 rounded-full"
                        />
                        <p className="uppercase 2xs:text-base text-sm font-medium text-text-200 dark:text-text-400">
                          {plan.shortName}
                        </p>
                      </div>
                    )}
                    onSelect={(plan) => {
                      setValue("billerCode", plan.billerCode);
                      setValue("provider", plan.shortName);
                      clearErrors("billerCode");
                      clearErrors("provider");
                      setProviderState(false);
                    }}
                    showSearch={false}
                    placeholder="Search Provider..."
                    isOpen={providerState}
                    onClose={() => setProviderState(false)}
                    isLoading={isCablePlanLoading}
                  />
                </div>
              )}
            </div>
          </div>

          {verifyLoading || cableVariationsLoading ? (
            <div className="flex items-center gap-2 p-2 text-text-200 dark:text-text-400">
              <SpinnerLoader width={20} height={20} color="#d4b139" />
              <p>Fetching customer and plans...</p>
            </div>
          ) : (
            <>
              {cablePlans &&
              verificationMessage &&
              !verificationError &&
              watchedProvider &&
              watchedBillerCode &&
              watchedBillerNumber &&
              watchedBillerNumber.length >= 10 &&
              watchedBillerNumber.length < 15 ? (
                <div className="flex flex-col gap-1.5 ">
                  <p className="text-primary text-sm">{verificationMessage}</p>{" "}
                  <div className="flex items-center gap-2 sm:gap-4 ">
                    <p className="text-sm md:text-base dark:text-white dark:text-opacity-70">
                      Add as beneficiary
                    </p>
                    <Switch
                      checked={isBeneficiaryChecked}
                      onChange={(e) =>
                        setIsBeneficiaryChecked(e.target.checked)
                      }
                      {...addBeneficiaryLabel(theme === "dark")}
                    />
                  </div>
                </div>
              ) : (
                <p className="flex self-start text-red-500 font-semibold  text-sm">
                  {verificationError}
                </p>
              )}
            </>
          )}

          {/* Add beneficiary section */}

          {/* data plans */}

          {cablePlans &&
          verificationMessage &&
          !verificationError &&
          watchedProvider &&
          watchedBillerCode &&
          watchedBillerNumber ? (
            <div className="flex flex-col gap-4 mt-4 ">
              <h2 className="text-lg font-medium text-text-200 dark:text-text-400">
                Select Plan{" "}
              </h2>

              <div className="w-full">
                {verifyLoading || cableVariationsLoading ? (
                  <div className="flex flex-col gap-3 py-4">
                    {[...Array(4)].map((_, index) => (
                      <Skeleton
                        key={index}
                        className="h-8"
                        baseColor={theme === "light" ? "#e0e0e0" : "#202020"}
                        highlightColor={
                          theme === "light" ? "#f5f5f5" : "#444444"
                        }
                      />
                    ))}
                  </div>
                ) : variations && variations?.length > 0 ? (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                    {variations.map((item, index: number) => {
                      return (
                        <div
                          onClick={() => {
                            setAmount(String(item.payAmount));
                            setBillerNumber(watchedBillerNumber);
                            setItemCode(item.item_code);
                            setCheckoutMessage(
                              String(
                                `${item.biller_name} ${item.validity_period} Days `
                              )
                            );
                            setBillerCode(item.biller_code);
                            setStage("two");
                          }}
                          key={index}
                          className=" flex flex-col items-center justify-center gap-1 p-4 text-center border border-border-200 dark:border-border-700 cursor-pointer hover:bg-primary hover:text-text-1500 hover:dark:text-text-200 text-text-200 dark:text-text-800 hover:border-none rounded"
                        >
                          <p className="text-xs lg:text-sm">
                            {String(item.biller_name)}
                          </p>
                          <p className="text-xs lg:text-sm">
                            {String(item.validity_period)} Days
                          </p>
                          <p className="font-semibold text-sm lg:text-base">
                            ₦{" "}
                            {new Intl.NumberFormat("en-NG", {
                              maximumFractionDigits: 2,
                            }).format(Number(item.amount))}{" "}
                          </p>
                          <p className="font-medium  text-xs lg:text-sm ">
                            Fee: ₦ {item.payAmount - item.amount}{" "}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <EmptyState
                    image={images.emptyState.emptyMiniSchedule}
                    title={"No cable plans"}
                    path={"/user/services"}
                    placeholder={"Pay a bill"}
                    showButton={false}
                  />
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DataStageOne;
