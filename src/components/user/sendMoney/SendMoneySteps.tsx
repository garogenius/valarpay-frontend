"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
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
import { FiCheckCircle, FiArrowRight } from "react-icons/fi";
import { IoWalletOutline } from "react-icons/io5";
import { RiBankLine } from "react-icons/ri";
import { useGetBeneficiaries } from "@/api/user/user.queries";
import { useGetTransactions } from "@/api/wallet/wallet.queries";
import { TRANSACTION_CATEGORY } from "@/constants/types";
import GlobalTransactionHistoryModal from "@/components/shared/GlobalTransactionHistoryModal";
import useUserStore from "@/store/user.store";
import { IoClose } from "react-icons/io5";
import { MdHistory, MdPersonOff } from "react-icons/md";
import { FaFingerprint } from "react-icons/fa";
import { useFingerprintForPayments } from "@/store/paymentPreferences.store";

type Step = "selectType" | "enterAccount" | "enterAmount" | "confirm";

const transferMethods = [
  {
    id: 1,
    label: "ValarPay Transfer",
    description: "Instant & Free",
    value: "valarpay",
    icon: IoWalletOutline,
  },
  {
    id: 2,
    label: "Other Banks",
    description: "₦10 Fee, Arrives in 5-10 mins",
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

const SendMoneySteps: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user } = useUserStore();
  const fingerprintEnabled = useFingerprintForPayments();
  const [step, setStep] = useState<Step>("selectType");
  const [selectedType, setSelectedType] = useState<string>("valarpay");
  const [bankData, setBankData] = useState<BankResponseData | null>(null);
  const [bankState, setBankState] = useState(false);
  const [selectedBank, setSelectedBank] = useState<BankProps>();
  const [bankName, setBankName] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"transactions" | "beneficiaries">("transactions");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transactionData, setTransactionData] = useState<any>(null);
  const [walletPin, setWalletPin] = useState("");
  const [addBeneficiary, setAddBeneficiary] = useState(false);

  const { banks } = useGetAllBanks();
  const ngnWallet = user?.wallet?.find((w) => w.currency === "NGN");
  const availableBalance = ngnWallet?.balance || 0;

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
    const descriptions = Array.isArray(errorMessage)
      ? errorMessage
      : [errorMessage];

    ErrorToast({
      title: "Error during transfer",
      descriptions,
    });
  };

  const onSuccess = (data: any) => {
    SuccessToast({
      title: "Transfer successful",
      description: "Your transfer was successful",
    });
    setTransactionData({
      id: data?.data?.data?.transactionRef || "",
      type: "TRANSFER",
      status: "SUCCESSFUL",
      direction: "debit",
      amount: watchedAmount,
      currency: "NGN",
      reference: data?.data?.data?.transactionRef || "",
      createdAt: new Date().toISOString(),
      senderName: user?.fullname || undefined,
      recipientName: bankData?.accountName,
      recipientAccount: watchedAccountNumber,
      recipientBank: selectedType === "bank" ? bankName : "ValarPay",
      description: watchedDescription,
      paymentMethod: "Available Balance",
    });
    setShowSuccessModal(true);
  };

  const {
    mutate: initiateTransfer,
    isPending: transferPending,
    isError: transferError,
  } = useInitiateTransfer(onError, onSuccess);

  const transferLoading = transferPending && !transferError;

  const canProceedEnterAccount =
    !!bankData &&
    watchedAccountNumber?.length === 10 &&
    (selectedType === "valarpay" ? true : !!watchedBankCode);

  const canProceedEnterAmount =
    canProceedEnterAccount && !!watchedAmount && watchedAmount >= 50;

  const canProceedConfirm =
    canProceedEnterAmount && walletPin.trim().length === 4;

  const submitTransfer = () => {
    if (!canProceedConfirm) {
      ErrorToast({
        title: "Enter Transaction PIN",
        descriptions: ["PIN must be exactly 4 digits."],
      });
      return;
    }
    if (!bankData) return;

    initiateTransfer({
      accountName: bankData?.accountName,
      accountNumber: watchedAccountNumber,
      amount: watchedAmount,
      description: watchedDescription,
      walletPin,
      sessionId: watchedSessionId || "",
      bankCode: watchedBankCode || "",
      currency: "NGN",
      ...(addBeneficiary ? { addBeneficiary: true } : {}),
    });
  };

  const dropdownRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(dropdownRef, () => {
    setBankState(false);
  });

  const { beneficiaries } = useGetBeneficiaries({
    category: BENEFICIARY_TYPE.TRANSFER,
    transferType:
      selectedType === "valarpay" ? TRANSFER_TYPE.INTRA : TRANSFER_TYPE.INTER,
  });

  const { transactionsData } = useGetTransactions({
    page: 1,
    limit: 10,
    category: TRANSACTION_CATEGORY.TRANSFER,
  });

  const recentTransfers = (transactionsData?.transactions || []).slice(0, 5);
  const savedBeneficiaries = beneficiaries || [];

  const EmptyListState = ({
    icon,
    title,
    subtitle,
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
  }) => (
    <div className="py-10 flex flex-col items-center justify-center px-4">
      <div className="w-16 h-16 rounded-full bg-[#2C2C2E] flex items-center justify-center mb-4 border-2 border-gray-700">
        {icon}
      </div>
      <p className="text-white text-sm font-semibold text-center">{title}</p>
      <p className="text-gray-400 text-xs text-center mt-1 max-w-[260px]">{subtitle}</p>
    </div>
  );

  const handleBeneficiarySelect = (beneficiary: BeneficiaryProps) => {
    const bank = banks?.find((bank) => bank.bankCode === beneficiary.bankCode);
    if (beneficiary?.accountNumber && bank) {
      setValue("accountNumber", beneficiary.accountNumber);
      setValue("bankCode", bank.bankCode);
      setSelectedBank(bank);
      setBankName(bank.name);
      if (selectedType === "bank") {
        verifyAccount({
          accountNumber: beneficiary.accountNumber,
          bankCode: bank.bankCode,
        });
      } else {
        verifyAccount({ accountNumber: beneficiary.accountNumber });
      }
    }
  };

  const handleNext = () => {
    if (step === "selectType") {
      setStep("enterAccount");
    } else if (step === "enterAccount") {
      if (!canProceedEnterAccount) {
        ErrorToast({
          title: "Complete recipient details",
          descriptions: ["Enter a valid account number and wait for verification."],
        });
        return;
      }
      setStep("enterAmount");
    } else if (step === "enterAmount") {
      if (!canProceedEnterAmount) {
        ErrorToast({
          title: "Enter amount",
          descriptions: ["Enter a valid amount (minimum ₦50)."],
        });
        return;
      }
      setStep("confirm");
    } else if (step === "confirm") {
      submitTransfer();
    }
  };

  const handleBack = () => {
    if (step === "enterAccount") {
      setStep("selectType");
      reset();
      setBankData(null);
    } else if (step === "enterAmount") {
      setStep("enterAccount");
    } else if (step === "confirm") {
      setStep("enterAmount");
    }
  };

  // Step 1: Select Transfer Type
  const renderSelectType = () => (
    <div className="w-full flex flex-col gap-4">
      <h3 className="text-white text-base font-semibold">Select Transfer Type</h3>
      <div className="flex flex-col gap-3">
        {transferMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => {
              setSelectedType(method.value);
              setBankData(null);
              reset();
            }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors ${
              selectedType === method.value
                ? "bg-[#1C1C1E] border-[#FF6B2C]"
                : "bg-[#141416] border-gray-800 hover:border-gray-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-start">
                <span className="text-white font-semibold text-sm">{method.label}</span>
                <span className="text-gray-400 text-xs">{method.description}</span>
              </div>
            </div>
            {selectedType === method.value && (
              <div className="w-5 h-5 rounded-full bg-[#FF6B2C] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const stepIndex = () => {
    // 3-step underline (to match the screenshot):
    // 1) Select Transfer Type, 2) Details (account + amount), 3) Confirm
    if (step === "selectType") return 0;
    if (step === "confirm") return 2;
    return 1;
  };

  const renderTopBar = () => (
    <div className="px-5 pt-4">
      <div className="flex items-center justify-between">
        <p className="text-white text-sm font-semibold">Send Money</p>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <IoClose className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-[2px] flex-1 rounded-full ${
              i === stepIndex() ? "bg-[#FF6B2C]" : "bg-gray-800"
            }`}
          />
        ))}
      </div>
    </div>
  );

  // Step 2: Enter Account Number
  const renderEnterAccount = () => (
    <div className="w-full flex flex-col gap-4">
      {selectedType === "bank" && (
        <div ref={dropdownRef} className="relative w-full flex flex-col gap-1">
          <label className="text-sm text-gray-400 mb-1">Select Banks</label>
          <div
            onClick={() => setBankState(!bankState)}
            className="w-full flex items-center justify-between bg-[#1C1C1E] border border-gray-800 rounded-lg py-3 px-4 cursor-pointer hover:border-gray-700 transition-colors"
          >
            <span className="text-white text-sm">
              {selectedBank?.name || "Select Recipient Bank"}
            </span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${bankState ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {bankState && (
            <div className="absolute top-full mt-2 w-full bg-[#1C1C1E] border border-gray-800 rounded-lg shadow-xl z-10 max-h-60 overflow-y-auto">
              <SearchableDropdown
                items={banks || []}
                searchKey="name"
                displayFormat={(bank: BankProps) => (
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-white">{bank.name}</p>
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

      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-400">Account Number</label>
        <div className="w-full flex items-center bg-[#1C1C1E] border border-gray-800 rounded-lg py-3 px-4">
          <input
            className="w-full bg-transparent border-none outline-none text-white placeholder:text-gray-600 text-sm"
            placeholder={
              selectedType === "valarpay"
                ? "Enter Valarpay Account Number"
                : "Enter Bank Account Number"
            }
            type="text"
            {...register("accountNumber")}
            onKeyDown={handleNumericKeyDown}
            onPaste={handleNumericPaste}
          />
          {verifyLoading && watchedAccountNumber.length === 10 && (
            <SpinnerLoader width={20} height={20} color="#FF6B2C" />
          )}
        </div>
        {errors?.accountNumber?.message && (
          <p className="text-red-500 text-xs mt-1">{errors.accountNumber.message}</p>
        )}
      </div>

      {/* Account Verification Badge */}
      {bankData && (
        <div className="w-full flex items-center gap-2 rounded-lg px-3 py-3 bg-green-500/20 border border-green-700/40">
          <FiCheckCircle className="text-green-500 text-lg flex-shrink-0" />
          <p className="text-white text-sm font-medium">{bankData?.accountName}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-800">
        <button
          onClick={() => setActiveTab("transactions")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "transactions"
              ? "text-[#FF6B2C] border-b-2 border-[#FF6B2C]"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Recent Transactions
        </button>
        <button
          onClick={() => setActiveTab("beneficiaries")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "beneficiaries"
              ? "text-[#FF6B2C] border-b-2 border-[#FF6B2C]"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Saved Beneficiary
        </button>
      </div>

      {/* Recent Transactions / Beneficiaries List */}
      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
        {activeTab === "transactions" ? (
          recentTransfers.length === 0 ? (
            <EmptyListState
              icon={<MdHistory className="text-3xl text-gray-400" />}
              title="No recent transactions"
              subtitle="Your recent transfers will appear here once you start sending money."
            />
          ) : (
            recentTransfers.map((transaction: any) => {
              const transferDetails = transaction.transferDetails;
              const name = transferDetails?.beneficiaryName || "Unknown";
              const account = transferDetails?.beneficiaryAccountNumber || "";
              return (
                <button
                  key={transaction.id}
                  onClick={() => {
                    setValue("accountNumber", account);
                    if (selectedType === "valarpay") {
                      verifyAccount({ accountNumber: account });
                    }
                  }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-[#2C2C2E] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="text-green-500 font-semibold text-xs">
                        {name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-white text-sm font-medium">{name}</span>
                      <span className="text-gray-400 text-xs">{account}</span>
                    </div>
                  </div>
                  <FiArrowRight className="text-gray-500 group-hover:text-white transition-colors" />
                </button>
              );
            })
          )
        ) : (
          savedBeneficiaries.length === 0 ? (
            <EmptyListState
              icon={<MdPersonOff className="text-3xl text-gray-400" />}
              title="No saved beneficiaries"
              subtitle="Save a beneficiary after a transfer to access them quickly next time."
            />
          ) : (
            savedBeneficiaries.map((beneficiary) => (
              <button
                key={beneficiary.id}
                onClick={() => handleBeneficiarySelect(beneficiary)}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-[#2C2C2E] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-blue-500 font-semibold text-xs">
                      {beneficiary.accountName?.charAt(0).toUpperCase() || "B"}
                    </span>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-white text-sm font-medium">
                      {beneficiary.accountName}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {beneficiary.accountNumber}
                    </span>
                  </div>
                </div>
                <FiArrowRight className="text-gray-500 group-hover:text-white transition-colors" />
              </button>
            ))
          )
        )}
      </div>
    </div>
  );

  // Step 3: Enter Amount
  const renderEnterAmount = () => (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-400">Enter Amount</label>
        <div className="w-full flex items-center bg-[#1C1C1E] border border-gray-800 rounded-lg py-3 px-4">
          <span className="text-gray-400 mr-2">₦</span>
          <input
            className="w-full bg-transparent border-none outline-none text-white placeholder:text-gray-600 text-sm"
            placeholder="0.00"
            type="number"
            {...register("amount")}
          />
        </div>
        {errors?.amount?.message && (
          <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
        )}
      </div>

      <p className="text-xs text-blue-400 font-medium">
        Available Balance (₦{availableBalance.toLocaleString()})
      </p>

      <div className="flex flex-wrap gap-2">
        {[5000, 10000, 20000, 50000].map((amt) => (
          <button
            key={amt}
            type="button"
            onClick={() => {
              setValue("amount", amt);
              clearErrors("amount");
            }}
            className="px-4 py-2 rounded-lg text-sm border border-gray-800 bg-[#1C1C1E] text-gray-300 hover:bg-[#2C2C2E] hover:border-gray-700 transition-colors"
          >
            ₦{amt.toLocaleString()}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-400">Narration (Optional)</label>
        <div className="w-full flex items-center bg-[#1C1C1E] border border-gray-800 rounded-lg py-3 px-4">
          <input
            className="w-full bg-transparent border-none outline-none text-white placeholder:text-gray-600 text-sm"
            placeholder="Enter narration"
            type="text"
            {...register("description")}
          />
        </div>
      </div>

      {/* Save beneficiary toggle */}
      <div className="w-full flex items-center justify-between pt-1">
        <div className="flex flex-col">
          <p className="text-sm text-white font-medium">Save Beneficiary</p>
          <p className="text-xs text-gray-400">Add this recipient to your saved beneficiaries</p>
        </div>
        <button
          type="button"
          onClick={() => setAddBeneficiary((s) => !s)}
          aria-pressed={addBeneficiary}
          className={`w-12 h-7 rounded-full border transition-colors flex items-center px-1 ${
            addBeneficiary ? "bg-[#FF6B2C] border-[#FF6B2C] justify-end" : "bg-[#1C1C1E] border-gray-700 justify-start"
          }`}
        >
          <span className={`w-5 h-5 rounded-full ${addBeneficiary ? "bg-black" : "bg-gray-400"}`} />
        </button>
      </div>
    </div>
  );

  // Step 4: Confirm Transaction
  const renderConfirm = () => (
    <div className="w-full flex flex-col gap-4">
      <h3 className="text-white text-base font-semibold">Confirm Transactions</h3>
      <div className="bg-[#1C1C1E] rounded-lg p-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Recipient</span>
          <span className="text-white text-sm font-medium">{bankData?.accountName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Bank</span>
          <span className="text-white text-sm font-medium">
            {selectedType === "bank" ? bankName : "ValarPay"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Account Number</span>
          <span className="text-white text-sm font-medium">{watchedAccountNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Amount</span>
          <span className="text-white text-sm font-medium">₦{watchedAmount.toLocaleString()}</span>
        </div>
        {selectedType === "bank" && fee && fee.length > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Fee</span>
            <span className="text-white text-sm font-medium">₦{fee[0].toLocaleString()}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-400">Enter Transaction PIN</label>
        <div className="w-full flex items-center gap-3">
          <div className="flex-1 flex items-center bg-[#1C1C1E] border border-gray-800 rounded-lg py-3 px-4">
            <input
              className="w-full bg-transparent border-none outline-none text-white placeholder:text-gray-600 text-sm tracking-widest"
              placeholder="••••"
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={walletPin}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                setWalletPin(v);
              }}
            />
          </div>
          {fingerprintEnabled ? (
            <button
              type="button"
              className="w-11 h-11 rounded-lg bg-white/10 border border-gray-800 flex items-center justify-center hover:bg-white/15 transition-colors"
              aria-label="Use fingerprint"
              // Hook up biometric later; UI only for now
              onClick={() => {
                ErrorToast({
                  title: "Fingerprint not available",
                  descriptions: ["Fingerprint sign-in isn't enabled on web yet."],
                });
              }}
            >
              <FaFingerprint className="text-white text-lg" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="w-full flex flex-col bg-[#0A0A0A]">
        {renderTopBar()}

        <div className="px-5 py-5 border-t border-gray-800">
          {step === "selectType" && renderSelectType()}
          {step === "enterAccount" && renderEnterAccount()}
          {step === "enterAmount" && renderEnterAmount()}
          {step === "confirm" && renderConfirm()}
        </div>

        <div className="px-5 pb-5">
          {step === "selectType" ? (
            <button
              onClick={handleNext}
              className="w-full px-4 py-3 rounded-full bg-[#FF6B2C] text-white font-semibold hover:bg-[#FF7A3D] transition-colors"
            >
              Next
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="flex-1 px-4 py-3 rounded-full bg-[#2C2C2E] text-white hover:bg-[#353539] transition-colors font-medium"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={
                  (step === "enterAccount" && !canProceedEnterAccount) ||
                  (step === "enterAmount" && !canProceedEnterAmount) ||
                  (step === "confirm" && !canProceedConfirm) ||
                  (step === "confirm" && transferLoading)
                }
                className="flex-1 px-4 py-3 rounded-full bg-[#FF6B2C] text-white font-semibold hover:bg-[#FF7A3D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {step === "confirm" ? (transferLoading ? "Processing..." : "Next") : "Next"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {transactionData && (
        <GlobalTransactionHistoryModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            onClose();
            reset();
            setStep("selectType");
            setWalletPin("");
            setAddBeneficiary(false);
          }}
          transaction={transactionData}
        />
      )}
    </>
  );
};

export default SendMoneySteps;

