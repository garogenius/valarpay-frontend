"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import Image from "next/image";
import images from "../../../../../../public/images";
import Switch from "@mui/material/Switch";
import { addBeneficiaryLabel, dataPlanNetwork } from "../../bill.data";
import classNames from "classnames";
import { useGetDataPlan, useGetDataVariation } from "@/api/data/data.queries";
import { useTheme } from "@/store/theme.store";
import {
  getNetworkIconByString,
  handleNumericKeyDown,
  handleNumericPaste,
} from "@/utils/utilityFunctions";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { motion } from "framer-motion";
import SearchableDropdown from "@/components/shared/SearchableDropdown";
import SpinnerLoader from "@/components/Loader/SpinnerLoader";
import Skeleton from "react-loading-skeleton";
import EmptyState from "@/components/user/table/EmptyState";
import {
  BENEFICIARY_TYPE,
  BeneficiaryProps,
  BILL_TYPE,
} from "@/constants/types";
import { useGetBeneficiaries } from "@/api/user/user.queries";
import Beneficiaries from "../../Beneficiaries";

type DataStageOneProps = {
  network: string;
  currency: string;
  setStage: (stage: "one" | "two" | "three") => void;
  setPhone?: (phone: string) => void;
  setAmount: (amount: string) => void;
  setNetwork?: (network: string) => void;
  setOperatorId: (operatorId: number | undefined) => void;
  isBeneficiaryChecked?: boolean;
  setIsBeneficiaryChecked?: (isBeneficiaryChecked: boolean) => void;
  setCheckoutMessage: (checkoutMessage: string) => void;
};

const DataStageOne: React.FC<DataStageOneProps> = ({
  currency,
  setStage,
  setPhone = () => {},
  setAmount,
  setNetwork = () => {},
  setOperatorId,
  isBeneficiaryChecked = false,
  setIsBeneficiaryChecked = () => {},
  setCheckoutMessage = () => {},
}) => {
  const theme = useTheme();
  const schema = yup.object().shape({
    phone: yup
      .string()
      .required("Phone Number is required")
      .min(11, "Phone Number must be at least 11 digits")
      .max(11, "Phone Number must be exactly 11 digits"),

    amount: yup
      .number()
      .required("Amount is required")
      .typeError("Amount is required"),

    network: yup.string().required("Network is required"),
  });

  type AirtimeFormData = yup.InferType<typeof schema>;

  const form = useForm<AirtimeFormData>({
    defaultValues: {
      phone: "",
      network: "",
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

  const watchedPhone = watch("phone");
  const watchedNetwork = watch("network");

  const [networkState, setNetworkState] = useState(false);

  const {
    networkPlans,
    network,
    isLoading: isDataPlanPending,
    isError: isDataPlanError,
  } = useGetDataPlan({
    phone: watchedPhone,
    currency,
  });

  const isDataPlanLoading = isDataPlanPending && !isDataPlanError;
  const [selectedNetworkPlan, setSelectedNetworkPlan] = useState<number>();
  const [selectedBeneficiary, setSelectedBeneficiary] = useState("");

  // const { data: dataPlanByNetwork } = useGetDataPlanByNetwork(
  //   network?.toLocaleUpperCase()
  // );

  const {
    variations,
    isPending: dataVariationsPending,
    isError: dataVariationsError,
  } = useGetDataVariation({
    operatorId: selectedNetworkPlan,
  });

  const dataVariationsLoading = dataVariationsPending && !dataVariationsError;

  useEffect(() => {
    if (watchedPhone.length === 11 && network) {
      setValue("network", network);
      setNetwork(network.toLocaleUpperCase());
      setSelectedNetworkPlan(networkPlans[0].operatorId);
    }
  }, [watchedPhone, network, networkPlans, setNetwork, setValue]);

  const onBackPressClick = () => {
    setValue("phone", "");
    setSelectedBeneficiary("");
  };

  const dropdownRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(dropdownRef, () => {
    setNetworkState(false);
  });

  const handleBeneficiarySelect = (beneficiary: BeneficiaryProps) => {
    setSelectedBeneficiary(beneficiary.id);

    if (beneficiary?.billerNumber) {
      setValue("phone", beneficiary.billerNumber);
    }
  };

  const { beneficiaries } = useGetBeneficiaries({
    category: BENEFICIARY_TYPE.BILL,
    billType: BILL_TYPE.DATA,
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
              type={BILL_TYPE.DATA}
            />
          </div>
        )}
        <div className="flex flex-col gap-2 h-full w-full">
          <div className="flex flex-col sm:flex-row items-start h-full w-full  lg:w-[90%] xl:w-[80%] 2xl:w-[70%] gap-4">
            {/* phone number section */}
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
                  maxLength={11}
                  minLength={11}
                  {...register("phone")}
                  onKeyDown={handleNumericKeyDown}
                  onPaste={handleNumericPaste}
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

            <div
              ref={dropdownRef}
              className="relative w-full flex flex-col gap-1"
            >
              <label
                htmlFor="network"
                className="text-base text-text-200 dark:text-text-400 mb-1 flex items-start w-full"
              >
                What is your network provider{" "}
              </label>
              <div
                onClick={() => {
                  // setNetworkState(!networkState);
                }}
                className="w-full flex gap-2 justify-center items-center bg-bg-2000 border border-border-600 rounded-lg py-4 px-3"
              >
                <div className="w-full flex items-center justify-between text-text-700 dark:text-text-1000">
                  {isDataPlanLoading ? (
                    <div className="flex items-center gap-2 px-2 text-text-200 dark:text-text-400">
                      <SpinnerLoader width={20} height={20} color="#d4b139" />
                      <p>Fetching...</p>
                    </div>
                  ) : (
                    <>
                      {" "}
                      {!watchedNetwork ||
                      !watchedPhone ||
                      watchedPhone.length !== 11 ? (
                        <p className="text-sm 2xs:text-base">
                          Enter phone number{" "}
                        </p>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Image
                            src={getNetworkIconByString(watchedNetwork) || ""}
                            alt={`${watchedNetwork} logo`}
                            className="w-6 h-6 rounded-full"
                          />
                          <p className="uppercase 2xs:text-base text-sm font-medium">
                            {watchedNetwork} data
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  <motion.svg
                    animate={{
                      rotate: networkState ? 180 : 0,
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
              {errors.network?.message && (
                <p className="text-text-2700 text-sm">
                  {errors.network.message}
                </p>
              )}
              {networkState && (
                <div className="absolute top-full my-2.5 px-1 py-2 overflow-y-auto h-fit max-h-60 w-full bg-bg-600 border dark:bg-bg-1100 border-gray-300 dark:border-border-600 rounded-md shadow-md z-10 no-scrollbar">
                  <SearchableDropdown
                    items={dataPlanNetwork}
                    searchKey="value"
                    displayFormat={(network) => (
                      <div className="flex items-center gap-2">
                        <Image
                          src={getNetworkIconByString(network.value) || ""}
                          alt={`${network.value} logo`}
                          className="w-7 h-7 rounded-full"
                        />
                        <p className="uppercase 2xs:text-base text-sm font-medium">
                          {network.label}
                        </p>
                      </div>
                    )}
                    onSelect={(network) => {
                      setValue("network", network.value);
                      clearErrors("network");
                      setNetworkState(false);
                    }}
                    showSearch={false}
                    placeholder="Search Network..."
                    isOpen={networkState}
                    onClose={() => setNetworkState(false)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Add beneficiary section */}
          <div className="flex items-center gap-2 sm:gap-4">
            <p className="text-sm md:text-base dark:text-white dark:text-opacity-70">
              Add as beneficiary
            </p>
            <Switch
              checked={isBeneficiaryChecked}
              onChange={(e) => setIsBeneficiaryChecked(e.target.checked)}
              {...addBeneficiaryLabel(theme === "dark")}
            />
          </div>

          {/* data plans */}

          {networkPlans && networkPlans?.length > 0 ? (
            <div className="flex flex-col gap-4 mt-4 ">
              {/* header */}
              <h2 className="text-lg font-medium text-text-200 dark:text-text-400">
                Data Plans
              </h2>

              {/* tabs section */}
              <div className="flex items-start gap-6 overflow-x-auto">
                {networkPlans.map((plan) => (
                  <div
                    onClick={() => {
                      if (selectedNetworkPlan !== plan.operatorId) {
                        setSelectedNetworkPlan(plan.operatorId);
                      }
                    }}
                    key={plan.operatorId}
                    className={classNames({
                      "text-sm cursor-pointer": true,
                      "text-[#797B86] font-normal":
                        selectedNetworkPlan !== plan.operatorId,
                      "text-primary pb-2 border-b-2 border-primary font-bold":
                        selectedNetworkPlan === plan.operatorId,
                    })}
                  >
                    {plan.planName}
                  </div>
                ))}
              </div>

              <div className="w-full">
                {dataVariationsLoading ? (
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
                ) : variations ? (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                    {Object.entries(variations).map(
                      ([amount, description], index: number) => {
                        return (
                          <div
                            onClick={() => {
                              setAmount(amount);
                              setOperatorId(selectedNetworkPlan ?? undefined);
                              setCheckoutMessage(String(description));
                              setPhone(watchedPhone);
                              setStage("two");
                            }}
                            key={index}
                            className=" flex flex-col items-center justify-center gap-2 p-4 text-center border border-border-200 dark:border-border-700 cursor-pointer hover:bg-primary hover:text-text-1500 hover:dark:text-text-200 text-text-200 dark:text-text-800 hover:border-none rounded"
                          >
                            <p className="text-xs lg:text-sm">
                              {String(description)}
                            </p>
                            <p className="font-semibold text-sm lg:text-base">
                              &#8358;{" "}
                              {new Intl.NumberFormat("en-NG", {
                                maximumFractionDigits: 2,
                              }).format(Number(amount))}{" "}
                            </p>
                          </div>
                        );
                      }
                    )}
                  </div>
                ) : (
                  <EmptyState
                    image={images.emptyState.emptyMiniSchedule}
                    title={"No data plans"}
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
