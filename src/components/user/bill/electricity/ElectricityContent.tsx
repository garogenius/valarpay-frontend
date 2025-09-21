"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from "react";
import ElectricityStageOne from "./StageOne";
import ElectricityStageTwo from "../StageTwo";
import ElectricityStageThree from "../StageThree";
import { usePayForAirtime } from "@/api/airtime/airtime.queries";
import ErrorToast from "@/components/toast/ErrorToast";
import { IoChevronBack } from "react-icons/io5";
import useNavigate from "@/hooks/useNavigate";
import { usePayForElectricity } from "@/api/electricity/electricity.queries";
import { BILL_TYPE } from "@/constants/types";

const ElectricityContent = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<"one" | "two" | "three">("one");
  const [billerNumber, setBillerNumber] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [billerCode, setBillerCode] = useState<string>("");
  const [itemCode, setItemCode] = useState<string>("");
  const [currency, _] = useState<string>("NGN");
  const [electricityResCode, setElectricityResCode] = useState<string>("");
  const [isBeneficiaryChecked, setIsBeneficiaryChecked] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState<string>("");

  /* eslint-enable @typescript-eslint/no-unused-vars */
  const onPayElectricitySuccess = (data: any) => {
    const code = data?.data?.data?.recharge_token;
    setElectricityResCode(code);
    setStage("three");
  };

  const onPayElectricityError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage)
      ? errorMessage
      : [errorMessage];

    ErrorToast({
      title: "Error during electricity purchase",
      descriptions,
    });
  };

  const {
    mutate: PayForElectricity,
    isPending: electricityPending,
    isError: electricityError,
  } = usePayForElectricity(onPayElectricityError, onPayElectricitySuccess);

  const electricityLoading = electricityPending && !electricityError;

  return (
    <div className="flex flex-col gap-8">
      {stage === "one" && (
        <div
          onClick={() => {
            navigate("/user/bills");
          }}
          className="flex items-center gap-2 cursor-pointer text-text-200 dark:text-text-400"
        >
          <IoChevronBack className="text-2xl" />
          <p className="text-lg font-medium">Back</p>
        </div>
      )}
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
          <ElectricityStageOne
            billerNumber={billerNumber}
            setStage={setStage}
            setBillerCode={setBillerCode}
            setAmount={setAmount}
            setBillerNumber={setBillerNumber}
            currency={currency}
            setItemCode={setItemCode}
            isBeneficiaryChecked={isBeneficiaryChecked}
            setIsBeneficiaryChecked={setIsBeneficiaryChecked}
            setCheckoutMessage={setCheckoutMessage}
          />
        )}
        {stage === "two" && (
          <ElectricityStageTwo
            type={BILL_TYPE.ELECTRICITY}
            itemCode={itemCode}
            billerCode={billerCode}
            amount={amount}
            billerNumber={billerNumber}
            currency={currency}
            payFunction={(walletPin: string) => {
              PayForElectricity({
                billerCode,
                billerNumber,
                itemCode,
                currency,
                walletPin,
                amount: Number(amount),
                addBeneficiary: isBeneficiaryChecked,
              });
            }}
            isLoading={electricityLoading}
            isBeneficiaryChecked={isBeneficiaryChecked}
            checkoutMessage={checkoutMessage}
          />
        )}
        {stage === "three" && (
          <ElectricityStageThree
            type={BILL_TYPE.ELECTRICITY}
            setStage={setStage}
            electricityResCode={electricityResCode}
            amount={amount}
            checkoutMessage={checkoutMessage}
          />
        )}
      </div>
    </div>
  );
};

export default ElectricityContent;
