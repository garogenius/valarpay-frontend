import CustomButton from "@/components/shared/Button";
import { BILL_TYPE, GiftCardDetails } from "@/constants/types";
import React, { useState } from "react";

type StageTwoProps = {
  billerCode?: string;
  billerNumber?: string;
  itemCode?: string;
  operatorId?: number;
  phone?: string;
  amount: string;
  network?: string;
  cableProvider?: string;
  type: BILL_TYPE;
  currency: string;
  payFunction: (walletPin: string) => void;
  isLoading?: boolean;
  isBeneficiaryChecked?: boolean;
  checkoutMessage?: string;
  giftCardDetails?: GiftCardDetails;
  compact?: boolean;
  onClose?: () => void;
};

const BillStageTwo: React.FC<StageTwoProps> = ({
  phone,
  amount,
  network,
  billerNumber,
  type,
  payFunction,
  isLoading = false,
  checkoutMessage,
  giftCardDetails,
  compact = false,
  onClose,
}) => {
  const [walletPin, setWalletPin] = useState("");

  const isValidated = walletPin.length !== 4;

  const getTitleMessage = () => {
    switch (type) {
      case "airtime":
      case "internationalAirtime":
        return "Airtime Topup for";
      case "data":
        return checkoutMessage;

      case "cable":
        return checkoutMessage;

      case "electricity":
        return checkoutMessage;

      case "internet":
        return checkoutMessage;

      case "giftcard":
        return checkoutMessage;
    }
  };

  const getSubTitlteMessage = () => {
    switch (type) {
      case "airtime":
      case "internationalAirtime":
      case "data":
        return `${phone} (${network?.toLocaleUpperCase()})`;

      case "cable":
        return `Cable Plan`;
      case "electricity":
        return `for meter No. ${billerNumber}`;

      case "internet":
        return `for ${billerNumber}`;

      case "giftcard":
        return `of ${giftCardDetails?.product.productName} (X${giftCardDetails?.quantity})`;
    }
  };

  const onConfirm = () => {
    payFunction(walletPin);
  };

  return (
    <div className={`w-full flex items-center justify-center ${compact ? "py-2" : "py-5 xs:py-10"} ${compact ? "" : "text-text-200 dark:text-text-400"}`}>
      <div className={`${compact ? "w-full px-5 py-5" : "w-[100%] sm:w-[85%] lg:w-[75%] xl:w-[65%] 2xl:w-[55%] flex flex-col gap-8 rounded-lg sm:rounded-xl p-0 2xs:p-4 md:p-8"}`}>
        {compact ? (
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white text-sm font-semibold">Buy Giftcards</p>
              <p className="text-[#9a9a9a] text-xs mt-0.5">Confirm Transactions</p>
            </div>
            {onClose ? (
              <button
                type="button"
                onClick={onClose}
                className="text-[#bcbcbc] hover:text-white transition-colors"
                aria-label="Close"
              >
                ×
              </button>
            ) : null}
          </div>
        ) : null}
        {/* airtime preview section */}
        <div className={`flex flex-col gap-1 text-center ${compact ? "mt-4" : ""}`}>
          <p className={`${compact ? "text-white text-lg font-semibold" : "text-lg font-medium"}`}>{getTitleMessage()}</p>
          <p className={`${compact ? "text-white/90 font-semibold text-sm" : "font-bold text-lg"}`}>{getSubTitlteMessage()}</p>

          <p className={`${compact ? "text-[#f76301] text-3xl font-bold" : "text-primary text-3xl font-bold "}`}>
            &#8358;{" "}
            {new Intl.NumberFormat("en-NG", {
              maximumFractionDigits: 2,
            }).format(Number(amount))}{" "}
          </p>
        </div>

        {/* wallet pin section */}

        <div className={`w-full ${compact ? "mt-6 mb-4" : "my-10"} flex flex-col gap-2 justify-center`}>
          <label className={`${compact ? "text-sm text-[#bcbcbc]" : "text-base"} mb-1 flex items-start `}>
            Enter transaction PIN
          </label>

          <input
            className={`${compact ? "w-full rounded-md bg-[#1c1c1e] border border-[#2a2a2a] py-3 px-4 outline-none text-sm text-white placeholder:text-[#7c7c7c]" : "w-full border rounded-lg border-[#46484F] bg-[#07070708] py-4 px-3  outline-none text-base text-text-200 dark:text-white placeholder:text-text-700 dark:placeholder:text-text-1000 placeholder:text-sm [&::-webkit-calendar-picker-indicator]:dark:invert"}`}
            required={true}
            maxLength={4}
            value={walletPin}
            onChange={(e) => setWalletPin(e.target.value)}
            type="password"
            placeholder="Enter your 4 digit PIN"
            onInput={(e) => {
              const input = e.target as HTMLInputElement;
              input.value = input.value.replace(/\D/g, ""); // Remove non-digit characters
            }}
          />

          <p className={`${compact ? "text-xs text-[#9a9a9a]" : "text-base"} flex items-start`}>
            Transaction PIN secured by Valarpay
          </p>
        </div>

        <div className="flex justify-center">
          <CustomButton
            type="submit"
            disabled={isValidated || isLoading}
            isLoading={isLoading}
            onClick={onConfirm}
            className={`${compact ? "w-full rounded-md bg-[#f76301] hover:bg-[#e55a00] text-black font-semibold py-3" : "w-full border-2 text-text-1500  dark:text-text-200 dark:font-bold border-primary text-base 2xs:text-lg max-2xs:px-6 py-3.5"}`}
          >
            Confirm{" "}
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default BillStageTwo;
