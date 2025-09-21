"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { usePayForData } from "@/api/data/data.queries";
import ErrorToast from "@/components/toast/ErrorToast";
import { useState } from "react";
import CableStageOne from "./StageOne";
import CableStageTwo from "../StageTwo";
import CableStageThree from "../StageThree";
import { IoChevronBack } from "react-icons/io5";
import useNavigate from "@/hooks/useNavigate";
import { usePayForCable } from "@/api/cable/cable.queries";
import { BILL_TYPE } from "@/constants/types";

const CableContent = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<"one" | "two" | "three">("one");
  const [billerNumber, setBillerNumber] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [billerCode, setBillerCode] = useState<string>("");
  const [itemCode, setItemCode] = useState<string>("");
  const [currency, _] = useState<string>("NGN");
  const [cablePlan, setCablePlan] = useState<string>("");
  const [cableProvider, setCableProvider] = useState<string>("");
  const [isBeneficiaryChecked, setIsBeneficiaryChecked] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState<string>("");

  /* eslint-enable @typescript-eslint/no-unused-vars */
  const onPayCableSuccess = () => {
    setStage("three");
  };

  const onPayCableError = (error: any) => {
    console.log("errror buying cable", error);

    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage)
      ? errorMessage
      : [errorMessage];

    ErrorToast({
      title: "Error during cable purchase",
      descriptions,
    });
  };

  const {
    mutate: PayForCable,
    isPending: cablePending,
    isError: cableError,
  } = usePayForCable(onPayCableError, onPayCableSuccess);

  const cableLoading = cablePending && !cableError;

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
          <CableStageOne
            billerNumber={billerNumber}
            setStage={setStage}
            setBillerCode={setBillerCode}
            setAmount={setAmount}
            setBillerNumber={setBillerNumber}
            setCableProvider={setCableProvider}
            currency={currency}
            setItemCode={setItemCode}
            isBeneficiaryChecked={isBeneficiaryChecked}
            setIsBeneficiaryChecked={setIsBeneficiaryChecked}
            setCheckoutMessage={setCheckoutMessage}
          />
        )}
        {stage === "two" && (
          <CableStageTwo
            type={BILL_TYPE.CABLE}
            itemCode={itemCode}
            billerCode={billerCode}
            amount={amount}
            billerNumber={billerNumber}
            currency={currency}
            payFunction={(walletPin: string) => {
              PayForCable({
                billerCode,
                billerNumber,
                itemCode,
                currency,
                walletPin,
                amount: Number(amount),
                addBeneficiary: isBeneficiaryChecked,
              });
            }}
            isLoading={cableLoading}
            isBeneficiaryChecked={isBeneficiaryChecked}
            checkoutMessage={checkoutMessage}
          />
        )}
        {stage === "three" && (
          <CableStageThree
            type={BILL_TYPE.CABLE}
            setStage={setStage}
            cableProvider={cableProvider}
            amount={amount}
            checkoutMessage={checkoutMessage}
          />
        )}
      </div>
    </div>
  );
};

export default CableContent;
