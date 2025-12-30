"use client";

import { CURRENCY } from "@/constants/types";
import useUserStore from "@/store/user.store";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoQrCodeSharp } from "react-icons/io5";
import { LuCopy } from "react-icons/lu";
import { RiBankLine } from "react-icons/ri";
import QrCodeModal from "@/components/modals/QrCodeModal";

const transferMethods = [
  {
    id: 1,
    label: "Bank Transfer",
    description: "Fund wallet via instant mobile transfer",
    value: "bank",
    icon: RiBankLine,
  },

  {
    id: 2,
    label: "Fund with QR Code",
    description: "Scan the QR of the Valarpay user",
    value: "qrCode",
    icon: IoQrCodeSharp,
  },
];

const TransferNgnProcess = () => {
  const { user } = useUserStore();
  const [selectedType, setSelectedType] = useState<string>("bank");
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const accountNumber = user?.wallet?.find(
    (w) => w.currency === CURRENCY.NGN
  )?.accountNumber;
  const bankName = user?.wallet?.find(
    (w) => w.currency === CURRENCY.NGN
  )?.bankName;
  const accountName = user?.wallet?.find(
    (w) => w.currency === CURRENCY.NGN
  )?.accountName;
  return (
    <div className="w-full flex max-xl:flex-col 2xs:px-2 xs:px-4 sm:px-6 md:px-8 py-4 2xs:py-6 sm:py-10 bg-transparent xs:bg-dark-primary dark:xs:bg-bg-1100 gap-6 xs:gap-10 lg:gap-12 2xl:gap-16 rounded-xl">
      <div className="w-full xl:w-[40%] flex flex-col gap-4 md:gap-6 lg:gap-8 2xl:gap-10">
        <h2 className="text-xl sm:text-2xl font-medium text-text-200 dark:text-text-400">
          Select Method{" "}
        </h2>
        <div className="flex flex-col gap-4">
          {transferMethods.map((method) => (
            <label
              key={method.id}
              className={`bg-bg-2000 dark:bg-bg-2500 relative flex items-center px-4 2xs:px-5 py-4 border rounded-lg sm:rounded-xl cursor-pointer hover:opacity-80 ${selectedType === method.value
                  ? " border-primary"
                  : "border-transparent"
                }`}
            >
              <input
                type="radio"
                className="hidden"
                checked={selectedType === method.value}
                onChange={() => {
                  setSelectedType(method.value);
                }}
              />
              <div className="flex-1 flex items-center gap-2.5">
                <div
                  className={`flex items-center justify-center w-10 2xl:w-12 h-10 2xl:h-12 rounded-full ${selectedType === method.value ? "bg-primary" : "bg-bg-200 "
                    }`}
                >
                  <method.icon className="text-2xl text-text-1200" />
                </div>
                <div className="flex flex-col">
                  {" "}
                  <h3 className="text-lg 2xl:text-xl font-medium text-text-200 dark:text-text-1300">
                    {method.label}
                  </h3>
                  <p className="text-sm text-text-200 dark:text-text-1000">
                    {method.description}
                  </p>
                </div>
              </div>
              <div
                className={`w-5 h-5 sm:w-6 sm:h-6 border-2 ${selectedType === method.value
                    ? "border-primary"
                    : "border-border-600 dark:border-border-100"
                  } rounded-full flex items-center justify-center`}
              >
                <div
                  className={`w-3 h-3 bg-primary rounded-full ${selectedType === method.value ? "block" : "hidden"
                    }`}
                />
              </div>
            </label>
          ))}
        </div>
      </div>
      <div className="w-full xl:w-[60%] flex">
        {selectedType === "bank" && (
          <div className="w-full px-4 xs:px-6 md:px-8 lg:px-10 2xl:px-12 py-8 flex flex-col gap-8 items-center bg-bg-400 max-xs:bg-dark-primary dark:bg-black dark:max-xs:bg-bg-1100 rounded-xl ">
            <h2 className="text-lg 2xs:text-xl sm:text-2xl font-medium text-text-200 dark:text-text-400 text-center">
              Bank Transfer{" "}
            </h2>

            <div className="w-full flex flex-col gap-2 text-sm sm:text-base">
              <div className="w-full flex justify-between gap-2 ">
                <p className="text-sm text-text-200 dark:text-text-400">
                  Account number
                </p>
                <div className="flex items-center gap-2 text-text-200 dark:text-text-400 font-semibold text-right">
                  {accountNumber}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(accountNumber || "");
                      toast.success("Copied to clipboard", {
                        duration: 3000,
                      });
                    }}
                    className="hover:opacity-70 transition-colors"
                  >
                    <LuCopy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="w-full flex justify-between gap-2 ">
                <p className="text-sm text-text-200 dark:text-text-400">
                  Bank Name{" "}
                </p>
                <p className="text-text-200 dark:text-text-400 font-semibold text-right">
                  {bankName}
                </p>
              </div>

              <div className="w-full flex justify-between gap-2 ">
                <p className="text-sm text-text-200 dark:text-text-400">
                  Account name
                </p>
                <p className="text-text-200 dark:text-text-400 font-semibold text-right">
                  {accountName}
                </p>
              </div>
            </div>
          </div>
        )}

        {selectedType === "qrCode" && (
          <div className="w-full px-4 xs:px-6 md:px-8 lg:px-10 2xl:px-12 py-8 flex flex-col gap-8 items-center bg-bg-400 max-xs:bg-dark-primary dark:bg-black dark:max-xs:bg-bg-1100 rounded-xl ">
            <h2 className="text-lg 2xs:text-xl sm:text-2xl font-medium text-text-200 dark:text-text-400 text-center">
              Fund with QR Code{" "}
            </h2>

            <div className="w-full flex flex-col gap-3">
              <p className="text-sm text-text-200 dark:text-text-1000 text-center">
                Generate a QR code to receive funds or scan/decode a QR code.
              </p>
              <button
                type="button"
                onClick={() => setQrModalOpen(true)}
                className="w-full rounded-xl bg-primary text-black font-semibold py-3 hover:opacity-90 transition-opacity"
              >
                Open QR Code
              </button>
            </div>
          </div>
        )}
      </div>

      <QrCodeModal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} defaultTab="generate" />
    </div>
  );
};

export default TransferNgnProcess;
