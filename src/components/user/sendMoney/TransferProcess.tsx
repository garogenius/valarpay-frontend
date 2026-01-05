/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { IoWalletOutline } from "react-icons/io5";
import { RiBankLine } from "react-icons/ri";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import CustomButton from "@/components/shared/Button";
import {
  handleNumericKeyDown,
  handleNumericPaste,
} from "@/utils/utilityFunctions";
import {
  useGetAllBanks,
  useGetTransferFee,
  useInitiateTransfer,
  useVerifyAccount,
} from "@/api/wallet/wallet.queries";
import SuccessToast from "@/components/toast/SuccessToast";
import ErrorToast from "@/components/toast/ErrorToast";
import SpinnerLoader from "@/components/Loader/SpinnerLoader";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import SearchableDropdown from "@/components/shared/SearchableDropdown";
import {
  BankProps,
  BENEFICIARY_TYPE,
  BeneficiaryProps,
  TRANSFER_TYPE,
} from "@/constants/types";
import { Switch } from "@mui/material";
import { addBeneficiaryLabel } from "../bill/bill.data";
import { useTheme } from "@/store/theme.store";
import Beneficiaries from "./Beneficiaries";
import { useGetBeneficiaries } from "@/api/user/user.queries";
import Image from "next/image";
import images from "../../../../public/images";
import { FiCheckCircle } from "react-icons/fi";
import { FaFingerprint } from "react-icons/fa";
import ConfirmTransactionModal from "@/components/shared/ConfirmTransactionModal";
import TransactionResultModal from "@/components/shared/TransactionResultModal";
import GlobalPaymentResultModal, { PaymentResultData } from "@/components/shared/GlobalPaymentResultModal";

const transferMethods = [
  {
    id: 1,
    label: "Send to Valarpay",
    value: "valarpay",
    icon: IoWalletOutline,
  },
  {
    id: 2,
    label: "Send to Bank",
    value: "bank",
    icon: RiBankLine,
  },
];

type TransferFormData = {
  bankCode?: string;
  accountNumber: string;
  amount: number;
  currency: string;
  sessionId?: string;
  description?: string;
};

const schema = yup.object().shape({
  bankCode: yup.string().optional(),

  accountNumber: yup
    .string()
    .required("Account Number is required")
    .min(10, "Account Number must be 10 digits")
    .max(10, "Account Number must be 10 digits"),

  amount: yup
    .number()
    .required("Amount is required")
    .typeError("Amount is required")
    .min(50, "Minimum amount is ₦50"),

  currency: yup.string().required("Currency is required"),
  sessionId: yup.string().optional(),

  description: yup.string().optional(),
});

interface BankResponseData {
  responseCode: string;
  responseMessage: string;
  sessionId: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  kycLevel: string;
  bvn: string;
}

const TransferProcess = ({
  fixedType,
  hideMethodSelector,
  initialActionLabel,
  showAvailableBalance,
  quickAmounts,
  availableBalance,
  compactBeneficiaryRow,
  onRef,
}: {
  fixedType?: "valarpay" | "bank";
  hideMethodSelector?: boolean;
  initialActionLabel?: string;
  showAvailableBalance?: boolean;
  quickAmounts?: number[];
  availableBalance?: number;
  compactBeneficiaryRow?: boolean;
  onRef?: (ref: { fillBeneficiary: (beneficiary: BeneficiaryProps) => void }) => void;
}) => {
  const theme = useTheme();
  const [selectedType, setSelectedType] = useState<string>(fixedType || "valarpay");
  const [bankData, setBankData] = useState<BankResponseData | null>(null);
  const [bankState, setBankState] = useState(false);
  const [selectedBank, setSelectedBank] = useState<BankProps>();
  const [bankName, setBankName] = useState<string>("");
  const [isBeneficiaryChecked, setIsBeneficiaryChecked] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [paymentResultData, setPaymentResultData] = useState<PaymentResultData | null>(null);

  const { banks } = useGetAllBanks();

  const form = useForm<TransferFormData>({
    defaultValues: {
      bankCode: "",
      accountNumber: "",
      amount: undefined,
      currency: "NGN",
      description: "",
      sessionId: "",
    },
    resolver: yupResolver(schema) as any,
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    formState,
    reset,
    watch,
    setValue,
    clearErrors,
  } = form;
  const { errors, isValid } = formState;

  const watchedAccountNumber = watch("accountNumber");
  const watchedBankCode = watch("bankCode");
  const watchedAmount = Number(watch("amount"));
  const watchedDescription = watch("description");
  const watchedSessionId = watch("sessionId");

  const { fee } = useGetTransferFee({
    currency: "NGN",
    amount: watchedAmount,
    active: selectedType === "bank",
  });

  const onVerifyAccountError = async (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage)
      ? errorMessage
      : [errorMessage];

    ErrorToast({
      title: "Error during Account Verification",
      descriptions,
    });
  };

  const onVerifyAccountSuccess = (data: any) => {
    setBankData(data?.data?.data);
    setValue("sessionId", data?.data?.data?.sessionId);

    if (selectedType === "valarpay") {
      setValue("bankCode", data?.data?.data?.bankCode);
    }
  };

  const {
    mutate: verifyAccount,
    isPending: verifyAccountPending,
    isError: verifyAccountError,
  } = useVerifyAccount(onVerifyAccountError, onVerifyAccountSuccess);

  const verifyLoading = verifyAccountPending && !verifyAccountError;

  useEffect(() => {
    if (fixedType) {
      setSelectedType(fixedType);
      setBankData(null);
      setSelectedBank(undefined);
      setIsBeneficiaryChecked(false);
      setSelectedBeneficiary("");
      reset();
    }
  }, [fixedType, reset]);

  useEffect(() => {
    if (watchedAccountNumber && watchedAccountNumber.length === 10) {
      if (selectedType === "valarpay") {
        verifyAccount({ accountNumber: watchedAccountNumber });
      } else {
        if (watchedBankCode) {
          verifyAccount({
            accountNumber: watchedAccountNumber,
            bankCode: watchedBankCode,
          });
        }
      }
    }
  }, [watchedAccountNumber, watchedBankCode, selectedType, verifyAccount]);

  // Reset verified data when inputs are incomplete or change
  useEffect(() => {
    if (selectedType === "bank") {
      if (!watchedAccountNumber || watchedAccountNumber.length !== 10 || !watchedBankCode) {
        setBankData(null);
        setValue("sessionId", "");
      }
    } else if (selectedType === "valarpay") {
      if (!watchedAccountNumber || watchedAccountNumber.length !== 10) {
        setBankData(null);
        setValue("sessionId", "");
      }
    }
  }, [selectedType, watchedAccountNumber, watchedBankCode, setValue]);

  const onError = async (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const errorCode = error?.response?.data?.code || error?.response?.data?.errorCode;
    const descriptions = Array.isArray(errorMessage)
      ? errorMessage
      : [errorMessage];

    ErrorToast({
      title: "Error during transfer",
      descriptions,
    });
    setShowConfirmModal(false);
    
    // Set payment result data for the global modal
    setPaymentResultData({
      status: "failed",
      amount: watchedAmount,
      currency: "NGN",
      accountNumber: watchedAccountNumber,
      accountName: bankData?.accountName,
      bankName: selectedType === "bank" ? bankName : undefined,
      narration: watchedDescription,
      errorMessage: Array.isArray(errorMessage) ? errorMessage[0] : errorMessage,
      errorCode: errorCode,
    });
    setShowErrorModal(true);
  };

  const onSuccess = (responseData?: any) => {
    SuccessToast({
      title: "Transfer successful",
      description: "Your transfer was successful",
    });
    setShowConfirmModal(false);
    
    // Set payment result data for the global modal
    setPaymentResultData({
      status: "success",
      amount: watchedAmount,
      currency: "NGN",
      accountNumber: watchedAccountNumber,
      accountName: bankData?.accountName,
      bankName: selectedType === "bank" ? bankName : undefined,
      narration: watchedDescription,
      transactionId: responseData?.data?.transactionId || responseData?.data?.id,
    });
    setShowSuccessModal(true);
  };

  const {
    mutate: initiateTransfer,
    isPending: transferPending,
    isError: transferError,
  } = useInitiateTransfer(onError, onSuccess);

  const transferLoading = transferPending && !transferError;

  const onSubmit = async () => {
    setShowConfirmModal(true);
  };

  const handleConfirmTransaction = (walletPin: string) => {
    if (bankData) {
      initiateTransfer({
        accountName: bankData?.accountName,
        accountNumber: watchedAccountNumber,
        amount: watchedAmount,
        description: watchedDescription,
        walletPin,
        sessionId: watchedSessionId || "",
        bankCode: watchedBankCode || "",
        currency: "NGN",
        ...(isBeneficiaryChecked ? { addBeneficiary: true } : {}),
      });
      setShowConfirmModal(false);
    }
  };

  const dropdownRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(dropdownRef, () => {
    setBankState(false);
  });

  const handleBeneficiarySelect = useCallback((beneficiary: BeneficiaryProps) => {
    console.log(beneficiary);
    setSelectedBeneficiary(beneficiary.id);
    clearErrors();

    if (beneficiary?.accountNumber) {
      setValue("accountNumber", beneficiary.accountNumber);
      
      // For bank transfers, we need bank code
      if (selectedType === "bank" && beneficiary.bankCode) {
        const bank = banks?.find((bank) => bank.bankCode === beneficiary.bankCode);
        if (bank) {
          setValue("bankCode", bank.bankCode);
          setSelectedBank(bank);
          setBankName(bank.name);
          
          // Trigger account verification
          if (beneficiary.accountNumber.length === 10) {
            verifyAccount({
              accountNumber: beneficiary.accountNumber,
              bankCode: bank.bankCode,
            });
          }
        }
      } else if (selectedType === "valarpay") {
        // For ValarPay transfers, bank code might be optional
        if (beneficiary.bankCode) {
          setValue("bankCode", beneficiary.bankCode);
        }
        
        // Trigger account verification
        if (beneficiary.accountNumber.length === 10) {
          verifyAccount({ accountNumber: beneficiary.accountNumber });
        }
      }
    }
  }, [banks, selectedType, setValue, verifyAccount, clearErrors]);

  // Store onRef callback in a ref to avoid infinite re-renders
  const onRefCallbackRef = useRef(onRef);
  useEffect(() => {
    onRefCallbackRef.current = onRef;
  }, [onRef]);

  // Expose fillBeneficiary function to parent component
  useEffect(() => {
    if (onRefCallbackRef.current) {
      onRefCallbackRef.current({
        fillBeneficiary: handleBeneficiarySelect,
      });
    }
  }, [handleBeneficiarySelect]);

  const onBackPressClick = () => {
    setValue("accountNumber", "");
    setSelectedBeneficiary("");
  };

  const { beneficiaries } = useGetBeneficiaries({
    category: BENEFICIARY_TYPE.TRANSFER,
    transferType:
      selectedType === "valarpay" ? TRANSFER_TYPE.INTRA : TRANSFER_TYPE.INTER,
  });

  return (
    <>
      <ConfirmTransactionModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmTransaction}
        recipient={bankData?.accountName || ""}
        bank={selectedType === "bank" ? bankName : "ValarPay"}
        accountNumber={watchedAccountNumber}
        amount={watchedAmount}
        currency="NGN"
        isLoading={transferLoading}
      />
      <div className="w-full flex max-xl:flex-col 2xs:px-2 xs:px-4 sm:px-6 md:px-8 py-4 2xs:py-6 sm:py-10 bg-white dark:bg-bg-1100 shadow-sm gap-6 xs:gap-10 lg:gap-12 2xl:gap-16 rounded-xl">
      {(!hideMethodSelector && !fixedType) && (
        <div className="w-full xl:w-[40%] flex flex-col gap-4 md:gap-6 lg:gap-8 2xl:gap-10">
          <h2 className="text-xl sm:text-2xl font-medium text-text-200 dark:text-text-400">
            Select Transfer Method
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
                    setBankData(null);
                    setSelectedBank(undefined);
                    setIsBeneficiaryChecked(false);
                    setSelectedBeneficiary("");
                    reset();
                  }}
                />
                <div className="flex-1 flex items-center gap-2.5">
                  <div
                    className={`flex items-center justify-center w-10 2xl:w-12 h-10 2xl:h-12 rounded-full ${selectedType === method.value ? "bg-[#F76301]" : "bg-gray-500"
                      }`}
                  >
                    <method.icon className="text-2xl text-text-1200" />
                  </div>
                  <h3 className="text-lg 2xl:text-xl font-medium text-text-200 dark:text-text-1300">
                    {method.label}
                  </h3>
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
      )}
      <div className={`w-full ${(!hideMethodSelector && !fixedType) ? "xl:w-[60%]" : "xl:w-full"} flex`}>
        <div className="w-full flex flex-col gap-6 items-start bg-transparent rounded-none p-0 sm:p-0 md:p-0 lg:p-0 px-4 sm:px-0 md:px-0 lg:px-0">

            {/* Recent Beneficiaries removed as requested */}

            <motion.form
              whileInView={{ opacity: [0, 1] }}
              transition={{ duration: 0.5, type: "tween" }}
              className="flex flex-col justify-start items-start w-full gap-6"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              {selectedType === "bank" && (
                <div
                  ref={dropdownRef}
                  className="relative w-full flex flex-col gap-1"
                >
                  <label
                    className="w-full text-sm text-text-200 dark:text-text-800 mb-1 flex items-start"
                    htmlFor={"bankCode"}
                  >
                    Select Banks
                  </label>
                  <div
                    onClick={() => {
                      setBankState(!bankState);
                    }}
                    className="w-full flex gap-2 justify-center items-center bg-bg-2000 border border-border-600 rounded-lg py-4 px-3"
                  >
                    <div className="w-full flex items-center justify-between text-text-700 dark:text-text-1000">
                      {!watchedBankCode || !selectedBank ? (
                        <p className=" text-sm 2xs:text-base">Select Recipient Bank </p>
                      ) : (
                        <p className="2xs:text-base text-sm font-medium">{selectedBank?.name}</p>
                      )}

                      <motion.svg
                        animate={{ rotate: bankState ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-4 h-4 text-text-700 dark:text-text-1000 cursor-pointer"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </motion.svg>
                    </div>
                  </div>
                  {errors.bankCode?.message && (
                    <p className="text-text-2700 text-sm">{errors.bankCode.message}</p>
                  )}
                  {bankState && (
                    <div className="absolute top-full my-2.5 px-1 py-2 overflow-y-auto h-fit max-h-60 w-full bg-dark-primary border dark:bg-bg-1100 border-gray-300 dark:border-border-600 rounded-md shadow-md z-10 no-scrollbar">
                      <SearchableDropdown
                        items={banks}
                        searchKey="name"
                        displayFormat={(bank) => (
                          <div className="flex flex-col text-text-700 dark:text-text-1000">
                            <p className="text-sm 2xs:text-base font-medium">{bank.name}</p>
                          </div>
                        )}
                        onSelect={(bank: BankProps) => {
                          setValue("bankCode", String(bank.bankCode));
                          clearErrors("bankCode");
                          setBankName(bank.name);
                          setBankState(false);
                          setSelectedBank(bank);
                        }}
                        placeholder="Search bank..."
                        isOpen={bankState}
                        onClose={() => setBankState(false)}
                      />
                    </div>
                  )}
                </div>
              )}
              <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
                <label
                  className="w-full text-sm text-text-200 dark:text-text-800 mb-1 flex items-start"
                  htmlFor={"accountNumber"}
                >
                  Account Number
                </label>
                <div className="w-full flex gap-2 justify-center items-center bg-white dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                  <input
                    className="w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-200 dark:placeholder:text-text-1000 placeholder:text-sm"
                    placeholder={
                      selectedType === "valarpay"
                        ? "Enter Valarpay Account Number"
                        : "Enter Bank Account Number"
                    }
                    required={true}
                    type="number"
                    {...register("accountNumber")}
                    onKeyDown={handleNumericKeyDown}
                    onPaste={handleNumericPaste}
                  />

                  {verifyLoading && watchedAccountNumber.length === 10 && (
                    <SpinnerLoader width={20} height={20} color="#f76301" />
                  )}

                  {watchedAccountNumber && !verifyLoading && (
                    <Image
                      onClick={onBackPressClick}
                      src={images.airtime.backPress}
                      alt="backPress"
                      className="cursor-pointer"
                    />
                  )}
                </div>

                {errors?.accountNumber?.message ? (
                  <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                    {errors?.accountNumber?.message}
                  </p>
                ) : null}
              </div>

              {/* Account verification badge - shows for both valarpay and bank */}
              {bankData && (
                <div className="w-full">
                  <div className="w-full flex items-center gap-2 rounded-lg px-3 py-3 bg-green-500/10 border border-green-700/40">
                    <FiCheckCircle className="text-green-500 text-lg" />
                    <p className="text-white text-sm font-medium">{bankData?.accountName}</p>
                  </div>
                </div>
              )}

            {selectedType === "valarpay" && (
                <>
                  <div className="w-full flex flex-col gap-4 items-start justify-start mt-2">
                    <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
                      <label
                        className="w-full text-sm text-text-200 dark:text-text-800 mb-1 flex items-start"
                        htmlFor={"amount"}
                      >
                        Enter Amount
                      </label>
                      <div className="w-full flex gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                        <input
                          className="w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-200 dark:placeholder:text-text-1000 placeholder:text-sm"
                          placeholder="Enter Amount"
                          required={true}
                          type="number"
                          {...register("amount")}
                        />
                      </div>

                      {showAvailableBalance && (
                        <div className="w-full mt-1">
                          <p className="text-xs text-blue-400 font-medium">
                            Available Balance (₦{(availableBalance || 0).toLocaleString()})
                          </p>
                        </div>
                      )}

                      {quickAmounts && quickAmounts.length > 0 && (
                        <div className="w-full flex flex-wrap gap-2 mt-2">
                          {quickAmounts.map((amt) => (
                            <button
                              key={amt}
                              type="button"
                              onClick={() => {
                                setValue("amount", Number(amt));
                                clearErrors("amount");
                              }}
                              className="px-3 py-1.5 rounded-md text-xs border border-gray-700 bg-[#2C2C2E] text-gray-200 hover:bg-[#353539]"
                            >
                              ₦{amt.toLocaleString()}
                            </button>
                          ))}
                        </div>
                      )}

                      {errors?.amount?.message ? (
                        <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                          {errors?.amount?.message}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
                      <label
                        className="w-full text-sm text-text-200 dark:text-text-800 mb-1 flex items-start"
                        htmlFor={"description"}
                      >
                        Narration ( Optional)
                      </label>
                      <div className="w-full flex gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                        <input
                          className="w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-200 dark:placeholder:text-text-1000 placeholder:text-sm"
                          placeholder="Reason (optional)"
                          type="text"
                          {...register("description")}
                        />
                      </div>

                      {errors?.description?.message ? (
                        <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                          {errors?.description?.message}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="w-full flex flex-col gap-4 mt-4">
                    <CustomButton
                      type="submit"
                      disabled={!isValid}
                      className="w-full border-2 border-primary text-white text-base 2xs:text-lg max-2xs:px-6 py-3.5"
                    >
                      {initialActionLabel || "Confirm"}{" "}
                    </CustomButton>
                  </div>
                </>
              )}


              {selectedType === "bank" && (
                <>

                  <div className="w-full flex flex-col gap-4 items-start justify-start mt-2">
                    <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
                      <label
                        className="w-full text-sm text-text-200 dark:text-text-800 mb-1 flex items-start"
                        htmlFor={"amount"}
                      >
                        Enter Amount
                      </label>
                      <div className="w-full flex gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                        <input
                          className="w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-200 dark:placeholder:text-text-1000 placeholder:text-sm"
                          placeholder="Enter Amount"
                          required={true}
                          type="number"
                          {...register("amount")}
                        />
                      </div>

                      {showAvailableBalance && (
                        <div className="w-full mt-1">
                          <p className="text-xs text-blue-400 font-medium">
                            Available Balance (₦{(availableBalance || 0).toLocaleString()})
                          </p>
                        </div>
                      )}

                      {quickAmounts && quickAmounts.length > 0 && (
                        <div className="w-full flex flex-wrap gap-2 mt-2">
                          {quickAmounts.map((amt) => (
                            <button
                              key={amt}
                              type="button"
                              onClick={() => {
                                setValue("amount", Number(amt));
                                clearErrors("amount");
                              }}
                              className="px-3 py-1.5 rounded-md text-xs border border-gray-700 bg-[#2C2C2E] text-gray-200 hover:bg-[#353539]"
                            >
                              ₦{amt.toLocaleString()}
                            </button>
                          ))}
                        </div>
                      )}

                      {errors?.amount?.message ? (
                        <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                          {errors?.amount?.message}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
                      <label
                        className="w-full text-sm text-text-200 dark:text-text-800 mb-1 flex items-start"
                        htmlFor={"description"}
                      >
                        Narration ( Optional)
                      </label>
                      <div className="w-full flex gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                        <input
                          className="w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-200 dark:placeholder:text-text-1000 placeholder:text-sm"
                          placeholder="Reason (optional)"
                          type="text"
                          {...register("description")}
                        />
                      </div>

                      {errors?.description?.message ? (
                        <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                          {errors?.description?.message}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="w-full flex flex-col gap-4 mt-4">
                    <CustomButton
                      type="submit"
                      disabled={!isValid}
                      className="w-full border-2 border-primary text-white text-base 2xs:text-lg max-2xs:px-6 py-3.5"
                    >
                      {initialActionLabel || "Confirm"}{" "}
                    </CustomButton>
                  </div>
                </>
              )}

              {/* Removed duplicate legacy bank block that re-rendered a second form */}
            </motion.form>
        </div>
      </div>

      {/* Global Payment Result Modal */}
      {paymentResultData && (
        <GlobalPaymentResultModal
          isOpen={showErrorModal || showSuccessModal}
          onClose={() => {
            setShowErrorModal(false);
            setShowSuccessModal(false);
            setPaymentResultData(null);
            setBankData(null);
            reset();
          }}
          onRetry={
            showErrorModal
              ? () => {
                  setShowErrorModal(false);
                  setPaymentResultData(null);
                  setShowConfirmModal(true);
                }
              : undefined
          }
          data={paymentResultData}
        />
      )}
    </div>
    </>
  );
};

export default TransferProcess;
