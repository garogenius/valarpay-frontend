"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import Image from "next/image";
import images from "../../../../../../public/images";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Switch from "@mui/material/Switch";
import CustomSelect from "@/components/CustomSelect";
import CustomButton from "@/components/shared/Button";
import {
  useGetAirtimeNetWorkProvider,
  useGetAirtimePlan,
} from "@/api/airtime/airtime.queries";
import classNames from "classnames";
import { addBeneficiaryLabel, NetworkProvider } from "../../bill.data";
import { Option } from "../../type";
import { useTheme } from "@/store/theme.store";
import {
  handleNumericKeyDown,
  handleNumericPaste,
} from "@/utils/utilityFunctions";
import Beneficiaries from "../../Beneficiaries";
import {
  BENEFICIARY_TYPE,
  BeneficiaryProps,
  BILL_TYPE,
} from "@/constants/types";
import { useGetBeneficiaries } from "@/api/user/user.queries";

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

const AirtimeStageOne: React.FC<StageOneProps> = ({
  // stage,
  network,
  currency,
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

  const theme = useTheme();

  const schema = useMemo(
    () =>
      yup.object().shape({
        phone: yup
          .string()
          .required("Phone Number is required")
          .min(11, "Phone Number must be at least 11 digits")
          .max(11, "Phone Number must be exactly 11 digits"),

        amount: yup
          .number()
          .required("Amount is required")
          .typeError("Amount is required")
          .min(
            minimumAmount,
            `Minimum amount is ₦${minimumAmount.toLocaleString()}`
          )
          .max(maxAmount, `Maximum amount is ₦${maxAmount.toLocaleString()}`),
      }),
    [minimumAmount, maxAmount]
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
    // reset,
    watch,
    setValue,
    // clearErrors,
  } = form;
  const { errors, isValid } = formState;

  // const watchedAmount = Number(watch("amount"));
  // const watchedNetwork = watch("networkProvider");
  const watchedPhone = watch("phone");

  const [providerOptions, setProviderOptions] = useState<Option[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Option | null>(null);

  const { data: networkProviders } = useGetAirtimeNetWorkProvider();
  const { data: airtimePlan, isPending: isAirtimePlanLoading } =
    useGetAirtimePlan({
      phone: watchedPhone,
      currency,
    });

  console.log("airtimePlan", airtimePlan);
  useEffect(() => {
    const planData = airtimePlan?.data?.data;

    if (planData) {
      const { plan, network } = planData;
      setMinimumAmount(plan.minAmount);
      setMaximumAmount(plan.maxAmount);
      setNetwork(network.toLocaleUpperCase());

      const provider = NetworkProvider.find(
        (item) => item.name === network.toLocaleUpperCase()
      );

      setSelectedProvider({
        value: plan.operatorId,
        label: plan.name,
        logo: provider?.logo,
      });
    } else {
      setSelectedProvider(null);
    }
  }, [airtimePlan?.data?.data, setNetwork]);

  useEffect(() => {
    if (selectedProvider) {
      setOperatorId(Number(selectedProvider.value));
    }
  }, [selectedProvider, setOperatorId]);

  useEffect(() => {
    const networkProvidersData = networkProviders?.data?.data;
    if (networkProvidersData && networkProvidersData?.length > 0) {
      setProviderOptions(
        networkProvidersData?.map((item: any) => {
          const provider = NetworkProvider.find(
            (provider) => provider.name === item?.network?.toLocaleUpperCase()
          );
          return {
            value: item?.operatorId,
            label: item?.planName,
            logo: provider?.logo,
          };
        })
      );
    }
  }, [networkProviders, network]);

  const onBackPressClick = () => {
    setValue("phone", "");
    setSelectedBeneficiary("");
  };

  const onSubmit = async (data: AirtimeFormData) => {
    Promise.all([
      Promise.resolve(setPhone(data.phone)),
      Promise.resolve(setAmount(String(data.amount))),
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
    billType: BILL_TYPE.AIRTIME,
  });

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
            Local Airtime
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

          {/* network provider section */}
          <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
            <label
              className="w-full text-sm sm:text-base font-medium  text-text-200 dark:text-text-800 mb-1 flex items-start "
              htmlFor={"networkProvider"}
            >
              Network Provider{" "}
            </label>

            <CustomSelect
              options={providerOptions}
              value={selectedProvider}
              onChange={(option: Option) => {
                setSelectedProvider({
                  value: option.value,
                  label: option.label,
                  logo: option.logo,
                });
              }}
              disabled={
                isAirtimePlanLoading && !errors.phone && watchedPhone != ""
              }
              loading={
                isAirtimePlanLoading && !errors.phone && watchedPhone != ""
              }
              // renderOption={RenderOptions}
              placeholder="Select Network Provider"
              isSearchable={false}
              className="w-full bg-bg-2400 dark:bg-bg-2100 border outline-none border-border-600 rounded-lg text-base text-text-200 dark:text-white"
              selectClassName={classNames({
                "px-3": true,
                "py-4": !selectedProvider,
              })}
              placeholderClassName="text-text-200 dark:text-text-1000 text-sm"
            />
          </div>

          {/* amount section */}
          <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
            <label
              className="w-full text-sm sm:text-base font-medium  text-text-200 dark:text-text-800 mb-1 flex items-start "
              htmlFor={"amount"}
            >
              Amount{" "}
            </label>

            <div className="w-full flex gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
              <input
                className="w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-[#797B86] dark:placeholder:text-text-1000 placeholder:text-sm"
                placeholder="&#8358;5,000"
                required={true}
                min={minimumAmount}
                max={maxAmount}
                type="number"
                {...register("amount")}
                // onKeyDown={handleNumericKeyDown}
                // onPaste={handleNumericPaste}
              />
            </div>

            {errors?.amount?.message && (
              <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                {errors?.amount?.message}
              </p>
            )}
          </div>

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

export default AirtimeStageOne;
