"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from "react";
import BuyGiftCardStageOne from "./StageOne";
import BuyGiftCardStageTwo from "../../StageTwo";
import BuyGiftCardStageThree from "../../StageThree";
import ErrorToast from "@/components/toast/ErrorToast";
import { IoChevronBack } from "react-icons/io5";
import { BILL_TYPE, GiftCardDetails } from "@/constants/types";
import GiftCardNav from "../GiftCardNav";
import { usePayForGiftCard } from "@/api/gift-card/gift-card.queries";

const BuyGiftCardContent = () => {
  const [stage, setStage] = useState<"one" | "two" | "three">("one");
  const [phone, _setPhone] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [network, _setNetwork] = useState<string>("");
  const [currency, _] = useState<string>("NGN");
  const [operatorId, _setOperatorId] = useState<number | undefined>();
  const [isBeneficiaryChecked, _setIsBeneficiaryChecked] = useState(false);
  const [giftCardDetails, setGiftCardDetails] = useState<GiftCardDetails>();

  const onPayGiftCardSuccess = () => {
    setStage("three");
  };

  const onPayGiftCardError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage)
      ? errorMessage
      : [errorMessage];

    ErrorToast({
      title: "Error during airtime purchase",
      descriptions,
    });
  };

  const {
    mutate: PayForGiftCard,
    isPending: giftCardPending,
    isError: giftCardError,
  } = usePayForGiftCard(onPayGiftCardError, onPayGiftCardSuccess);

  const giftCardLoading = giftCardPending && !giftCardError;

  return (
    <div className="flex flex-col gap-8">
      {stage === "one" && <GiftCardNav />}
      {stage === "two" && (
        <div
          onClick={() => {
            setStage("one");
          }}
          className="flex items-center gap-2 cursor-pointer text-text-200 dark:text-text-400"
        >
          <IoChevronBack className="text-2xl" />
          <p className="text-lg font-medium ">Back</p>
        </div>
      )}
      <div className="w-full flex flex-col 2xs:bg-bg-600 2xs:dark:bg-bg-1100 px-0 2xs:px-4 xs:px-6 2xs:py-4 xs:py-6 2xl:py-8  rounded-lg sm:rounded-xl">
        {stage === "one" && (
          <BuyGiftCardStageOne
            stage={stage}
            setStage={setStage}
            setGiftCardDetails={setGiftCardDetails}
            setAmount={setAmount}
          />
        )}
        {stage === "two" && (
          <BuyGiftCardStageTwo
            operatorId={operatorId}
            phone={phone}
            amount={amount}
            network={network}
            currency={currency}
            type={BILL_TYPE.GIFTCARD}
            giftCardDetails={giftCardDetails}
            payFunction={(walletPin: string) => {
              if (giftCardDetails) {
                PayForGiftCard({
                  productId: Number(giftCardDetails.productId),
                  currency: "NGN",
                  walletPin,
                  amount: Number(amount),
                  unitPrice: giftCardDetails.unitPrice,
                  quantity: giftCardDetails.quantity,
                });
              }
            }}
            isLoading={giftCardLoading}
            isBeneficiaryChecked={isBeneficiaryChecked}
            checkoutMessage={`Gift Card Purchase`}
          />
        )}
        {stage === "three" && (
          <BuyGiftCardStageThree
            type={BILL_TYPE.GIFTCARD}
            setStage={setStage}
            phone={phone}
            network={network}
            amount={amount}
            giftCardDetails={giftCardDetails}
            checkoutMessage={`worth of ${giftCardDetails?.product.productName}`}
          />
        )}
      </div>
    </div>
  );
};

export default BuyGiftCardContent;
