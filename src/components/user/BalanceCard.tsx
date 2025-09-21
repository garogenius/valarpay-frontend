"use client";
import { getCurrencyIconByString } from "@/utils/utilityFunctions";
import Image from "next/image";
import { useState } from "react";
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";

const BalanceCard = ({
  currency,
  balance,
}: {
  currency: string;
  balance: number;
}) => {
  const [isBalanceVisible, setBalanceVisible] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(
        `walletBalanceVisibility-${currency}`
      );
      return stored === null || stored === "true";
    }
    return true;
  });

  const toggleBalanceVisibility = () => {
    const newValue = !isBalanceVisible;
    setBalanceVisible(newValue);
    localStorage.setItem("walletBalanceVisibility", String(newValue));
  };

  return (
    <div className="bg-bg-600 dark:bg-bg-1100 rounded-xl px-4 py-7 2xs:py-8 flex items-center gap-4 sm:gap-6">
      <Image
        src={getCurrencyIconByString(currency) || ""}
        alt="currency"
        className="w-12 h-12"
      />
      <div className="flex flex-col gap-0 sm:gap-1 font-semibold">
        <div className="flex items-center gap-2">
          <p className="text-text-200 dark:text-text-800 text-base sm:text-lg ">
            My Balance
          </p>
          {isBalanceVisible ? (
            <FiEyeOff
              onClick={toggleBalanceVisibility}
              className="cursor-pointer text-text-200 dark:text-text-800 text-lg"
            />
          ) : (
            <FiEye
              onClick={toggleBalanceVisibility}
              className="cursor-pointer text-text-200 dark:text-text-800 text-lg"
            />
          )}
        </div>
        <p className="text-text-400 text-2xl sm:text-3xl">
          {" "}
          {isBalanceVisible ? `₦ ${balance?.toLocaleString() || 0.0}` : "---"}
        </p>
      </div>
    </div>
  );
};

export default BalanceCard;
