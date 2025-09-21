"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { usePayForData } from "@/api/data/data.queries";
import ErrorToast from "@/components/toast/ErrorToast";
import { useState } from "react";
import DataStageOne from "./StageOne";
import DataStageTwo from "../../StageTwo";
import DataStageThree from "../../StageThree";
import { IoChevronBack } from "react-icons/io5";
import InternetNav from "../InternetNav";
import { BILL_TYPE } from "@/constants/types";

const MobileDataContent = () => {
  const [stage, setStage] = useState<"one" | "two" | "three">("one");
  const [phone, setPhone] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [network, setNetwork] = useState<string>("");
  const [currency, _] = useState<string>("NGN");
  const [operatorId, setOperatorId] = useState<number>();
  const [isBeneficiaryChecked, setIsBeneficiaryChecked] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState<string>("");

  /* eslint-enable @typescript-eslint/no-unused-vars */
  const onPayDataSuccess = () => {
    setStage("three");
  };

  const onPayDataError = (error: any) => {
    console.log("errror buying data", error);

    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage)
      ? errorMessage
      : [errorMessage];

    ErrorToast({
      title: "Error during data purchase",
      descriptions,
    });
  };

  const {
    mutate: PayForData,
    isPending: dataPending,
    isError: dataError,
  } = usePayForData(onPayDataError, onPayDataSuccess);

  const dataLoading = dataPending && !dataError;

  return (
    <div className="flex flex-col gap-8">
      {stage === "one" && <InternetNav />}
      {stage === "two" && (
        <div
          onClick={() => {
            setStage("one");
          }}
          className="flex items-center gap-2 cursor-pointer text-text-200 dark:text-text-400"
        >
          <IoChevronBack className="text-2xl" />
          <p className="text-lg font-medium">Back</p>
        </div>
      )}
      <div className="w-full flex flex-col 2xs:bg-bg-600 2xs:dark:bg-bg-1100 px-0 2xs:px-4 xs:px-6 2xs:py-4 xs:py-6 2xl:py-8  rounded-lg sm:rounded-xl">
        {stage === "one" && (
          <DataStageOne
            network={network}
            setStage={setStage}
            setPhone={setPhone}
            setAmount={setAmount}
            setNetwork={setNetwork}
            currency={currency}
            setOperatorId={setOperatorId}
            isBeneficiaryChecked={isBeneficiaryChecked}
            setIsBeneficiaryChecked={setIsBeneficiaryChecked}
            setCheckoutMessage={setCheckoutMessage}
          />
        )}
        {stage === "two" && (
          <DataStageTwo
            type={BILL_TYPE.DATA}
            operatorId={operatorId}
            phone={phone}
            amount={amount}
            network={network}
            currency={currency}
            payFunction={(walletPin: string) => {
              PayForData({
                phone,
                currency,
                walletPin,
                operatorId: operatorId!,
                amount: Number(amount),
                addBeneficiary: isBeneficiaryChecked,
              });
            }}
            isLoading={dataLoading}
            isBeneficiaryChecked={isBeneficiaryChecked}
            checkoutMessage={checkoutMessage}
          />
        )}
        {stage === "three" && (
          <DataStageThree
            type={BILL_TYPE.DATA}
            setStage={setStage}
            phone={phone}
            network={network}
            setNetwork={setNetwork}
            amount={amount}
            checkoutMessage={checkoutMessage}
          />
        )}
      </div>
    </div>
  );
};

export default MobileDataContent;
