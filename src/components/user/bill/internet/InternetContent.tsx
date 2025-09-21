"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from "react";
import InternetStageOne from "./StageOne";
import InternetStageTwo from "../StageTwo";
import InternetStageThree from "../StageThree";
import ErrorToast from "@/components/toast/ErrorToast";
import { IoChevronBack } from "react-icons/io5";
import useNavigate from "@/hooks/useNavigate";
import { usePayForInternet } from "@/api/internet/internet.queries";
import { BILL_TYPE } from "@/constants/types";
import InternetNav from "./InternetNav";

const InternetContent = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<"one" | "two" | "three">("one");
  const [billerNumber, setBillerNumber] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [billerCode, setBillerCode] = useState<string>("");
  const [itemCode, setItemCode] = useState<string>("");
  const [currency, _] = useState<string>("NGN");
  const [isBeneficiaryChecked, setIsBeneficiaryChecked] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState<string>("");
  const [internetProvider, setInternetProvider] = useState<string>("");

  /* eslint-enable @typescript-eslint/no-unused-vars */
  const onPayInternetSuccess = () => {
    // const code = data?.data?.data?.recharge_token;
    setStage("three");
  };

  const onPayInternetError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage)
      ? errorMessage
      : [errorMessage];

    ErrorToast({
      title: "Error during internet purchase",
      descriptions,
    });
  };

  const {
    mutate: PayForInternet,
    isPending: internetPending,
    isError: internetError,
  } = usePayForInternet(onPayInternetError, onPayInternetSuccess);

  const internetLoading = internetPending && !internetError;

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
          <InternetStageOne
            billerNumber={billerNumber}
            setStage={setStage}
            setBillerCode={setBillerCode}
            setAmount={setAmount}
            setBillerNumber={setBillerNumber}
            currency={currency}
            setItemCode={setItemCode}
            setInternetProvider={setInternetProvider}
            isBeneficiaryChecked={isBeneficiaryChecked}
            setIsBeneficiaryChecked={setIsBeneficiaryChecked}
            setCheckoutMessage={setCheckoutMessage}
          />
        )}
        {stage === "two" && (
          <InternetStageTwo
            type={BILL_TYPE.INTERNET}
            itemCode={itemCode}
            billerCode={billerCode}
            amount={amount}
            billerNumber={billerNumber}
            currency={currency}
            payFunction={(walletPin: string) => {
              PayForInternet({
                billerCode,
                billerNumber,
                itemCode,
                currency,
                walletPin,
                amount: Number(amount),
                addBeneficiary: isBeneficiaryChecked,
              });
            }}
            isLoading={internetLoading}
            isBeneficiaryChecked={isBeneficiaryChecked}
            checkoutMessage={checkoutMessage}
          />
        )}
        {stage === "three" && (
          <InternetStageThree
            type={BILL_TYPE.INTERNET}
            setStage={setStage}
            internetProvider={internetProvider}
            amount={amount}
            checkoutMessage={checkoutMessage}
          />
        )}
      </div>
    </div>
  );
};

export default InternetContent;
