"use client";

import React from "react";
import { LuCopy } from "react-icons/lu";
import toast from "react-hot-toast";
import useUserStore from "@/store/user.store";
import { CURRENCY } from "@/constants/types";

const AccountNumberCard = () => {
  const { user } = useUserStore();

  const ngnWallet = user?.wallet?.find((w) => w.currency === CURRENCY.NGN);
  const fallbackWallet = user?.wallet?.[0];

  const accountNumber = ngnWallet?.accountNumber || fallbackWallet?.accountNumber;
  const bankName = ngnWallet?.bankName || fallbackWallet?.bankName;
  const accountName = ngnWallet?.accountName || fallbackWallet?.accountName;

  if (!accountNumber) return null;

  return (
    <div className="w-full bg-dark-primary dark:bg-bg-1100 rounded-xl px-4 py-5 sm:px-6 sm:py-6 flex flex-col gap-3">
      {/* <h3 className="text-text-200 dark:text-text-800 text-lg sm:text-xl font-semibold">
        Account Details
      </h3> */}
      <div className="flex flex-col gap-2 text-sm sm:text-base">
        <div className="w-full flex justify-between gap-2">
          <p className="text-text-200 dark:text-text-400">Account number</p>
          <div className="flex items-center gap-2 text-text-200 dark:text-text-400 font-semibold text-right">
            {accountNumber}
            <button
              onClick={() => {
                navigator.clipboard.writeText(accountNumber);
                toast.success("Copied to clipboard", { duration: 2500 });
              }}
              className="hover:opacity-70 transition-colors"
              aria-label="Copy account number"
            >
              <LuCopy className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* {bankName && (
          <div className="w-full flex justify-between gap-2">
            <p className="text-text-200 dark:text-text-400">Bank Name</p>
            <p className="text-text-200 dark:text-text-400 font-semibold text-right">{bankName}</p>
          </div>
        )} */}
        {accountName && (
          <div className="w-full flex justify-between gap-2">
            <p className="text-text-200 dark:text-text-400">Account name</p>
            <p className="text-text-200 dark:text-text-400 font-semibold text-right">{accountName}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountNumberCard;
