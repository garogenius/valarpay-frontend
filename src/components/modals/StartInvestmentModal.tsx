"use client";

import React, { useEffect, useMemo, useState } from "react";
import { IoClose } from "react-icons/io5";
import { cn } from "@/utils/cn";
import CustomButton from "@/components/shared/Button";
import useUserStore from "@/store/user.store";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import { useCreateInvestment } from "@/api/investment/investment.queries";
import VerifyWalletPinModal from "@/components/modals/settings/VerifyWalletPinModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface StartInvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step =
  | "policy"
  | "personal"
  | "nextOfKin"
  | "relationship"
  | "financial"
  | "sourceOfIncome"
  | "incomeRange"
  | "aml"
  | "investmentDetails";

interface PersonalInfo {
  fullName: string;
  dateOfBirth: string;
  residentialAddress: string;
  phoneNumber: string;
  phoneNumberOptional: string;
  email: string;
}

interface NextOfKinInfo {
  fullName: string;
  relationship: string;
  phoneNumber: string;
  phoneNumberOptional: string;
}

interface FinancialInfo {
  occupation: string;
  employerName: string;
  sourceOfIncome: string;
  annualIncomeRange: string;
}

interface AmlCompliance {
  isPEP: boolean;
  hasFinancialCrimes: boolean;
  fundsFromLegal: boolean;
  isBeneficialOwner: boolean;
  agreeToDocuments: boolean;
  agreeToReporting: boolean;
  consentToMonitoring: boolean;
  notInvolvedInCrime: boolean;
}

interface InvestmentDetails {
  amount: string;
  investName: string;
  duration: string;
  interestAtMaturity: boolean;
}

const relationshipOptions = ["Parent", "Sibling", "Spouse", "Child"];
const sourceOfIncomeOptions = ["Salary", "Business", "Properties", "Pension"];
const incomeRangeOptions = [
  "Below ₦100,000",
  "₦100,000 - ₦1,000,000",
  "₦1,000,000 - ₦5,000,000",
  "₦5,000,000 - ₦10,000,000",
];
const durationOptions = ["3 Months", "6 Months", "12 Months", "24 Months"];

const StartInvestmentModal: React.FC<StartInvestmentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useUserStore();
  const [step, setStep] = useState<Step>("policy");
  const [dobDate, setDobDate] = useState<Date | null>(null);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: "",
    dateOfBirth: "",
    residentialAddress: "",
    phoneNumber: "",
    phoneNumberOptional: "",
    email: "",
  });
  const [nextOfKin, setNextOfKin] = useState<NextOfKinInfo>({
    fullName: "",
    relationship: "",
    phoneNumber: "",
    phoneNumberOptional: "",
  });
  const [financialInfo, setFinancialInfo] = useState<FinancialInfo>({
    occupation: "",
    employerName: "",
    sourceOfIncome: "",
    annualIncomeRange: "",
  });
  const [amlCompliance, setAmlCompliance] = useState<AmlCompliance>({
    isPEP: false,
    hasFinancialCrimes: false,
    fundsFromLegal: false,
    isBeneficialOwner: false,
    agreeToDocuments: false,
    agreeToReporting: false,
    consentToMonitoring: false,
    notInvolvedInCrime: false,
  });
  const [investmentDetails, setInvestmentDetails] = useState<InvestmentDetails>(
    {
      amount: "",
      investName: "",
      duration: "",
      interestAtMaturity: false,
    }
  );

  const [verifyPinOpen, setVerifyPinOpen] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);

  const ngnBalance = useMemo(() => {
    const w = (user?.wallet || []).find((x: any) => String(x.currency).toUpperCase() === "NGN");
    return Number(w?.balance || 0);
  }, [user?.wallet]);

  const resetAll = () => {
    setStep("policy");
    setDobDate(null);
    setPersonalInfo({
      fullName: "",
      dateOfBirth: "",
      residentialAddress: "",
      phoneNumber: "",
      phoneNumberOptional: "",
      email: "",
    });
    setNextOfKin({
      fullName: "",
      relationship: "",
      phoneNumber: "",
      phoneNumberOptional: "",
    });
    setFinancialInfo({
      occupation: "",
      employerName: "",
      sourceOfIncome: "",
      annualIncomeRange: "",
    });
    setAmlCompliance({
      isPEP: false,
      hasFinancialCrimes: false,
      fundsFromLegal: false,
      isBeneficialOwner: false,
      agreeToDocuments: false,
      agreeToReporting: false,
      consentToMonitoring: false,
      notInvolvedInCrime: false,
    });
    setInvestmentDetails({
      amount: "",
      investName: "",
      duration: "",
      interestAtMaturity: false,
    });
    setVerifyPinOpen(false);
    setPendingSubmit(false);
  };

  const handleClose = () => {
    resetAll();
    onClose();
  };

  const onCreateError = (error: any) => {
    const message = error?.response?.data?.message;
    const descriptions = Array.isArray(message)
      ? message
      : [message || "Unable to create investment. Please try again."];
    ErrorToast({ title: "Investment Failed", descriptions });
  };

  const onCreateSuccess = () => {
    SuccessToast({
      title: "Investment Created",
      description: "Your investment has been created successfully.",
    });
    setPendingSubmit(false);
    handleClose();
  };

  // IMPORTANT: Must be called on every render (even when isOpen=false) to avoid hook order mismatch.
  const { mutate: createInvestment, isPending: creating } = useCreateInvestment(
    onCreateError,
    onCreateSuccess
  );

  useEffect(() => {
    // Clear collected info when modal unmounts (best practice for sensitive flows)
    return () => resetAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isOpen) return null;

  const parseAmount = (raw: string) => {
    const numeric = String(raw || "").replace(/[^\d]/g, "");
    return Number(numeric || 0);
  };

  const MIN_INVESTMENT = 25_000_000;

  const beginSubmit = () => {
    const amount = parseAmount(investmentDetails.amount);
    if (!amount || amount <= 0) {
      ErrorToast({ title: "Invalid Amount", descriptions: ["Please enter a valid investment amount."] });
      return;
    }
    if (amount < MIN_INVESTMENT) {
      ErrorToast({
        title: "Minimum Investment",
        descriptions: [`Minimum investment amount is ₦${MIN_INVESTMENT.toLocaleString()}.`],
      });
      return;
    }
    if (ngnBalance < amount) {
      ErrorToast({
        title: "Insufficient Balance",
        descriptions: ["Your NGN wallet balance is insufficient for this investment."],
      });
      return;
    }
    setPendingSubmit(true);
    setVerifyPinOpen(true);
  };

  const renderPolicy = () => (
    <div className="flex flex-col gap-3">
      <p className="text-gray-300 text-sm leading-relaxed">
        Please review the key investment terms below before continuing:
      </p>
      <ul className="space-y-2">
        {[
          "Minimum investment is ₦25,000,000. Amounts below this will be rejected.",
          "Your NGN wallet will be debited immediately after a successful request.",
          "Returns, maturity dates and payout timelines are determined by product terms on the backend.",
          "Investments may be pending, active, matured, paid out, or cancelled based on processing status.",
          "Early liquidation may not be available for all products and is subject to backend rules.",
          "You must authorize this transaction using your wallet PIN.",
          "Do not share your PIN. ValarPay will never ask you to disclose it.",
          "By continuing, you confirm funds are from legitimate sources and agree to compliance checks.",
        ].map((t, idx) => (
          <li key={idx} className="flex items-start gap-2 text-gray-400 text-sm">
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#FF6B2C] flex-shrink-0" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderProgressBar = () => {
    const steps: Step[] = [
      "policy",
      "personal",
      "nextOfKin",
      "financial",
      "aml",
      "investmentDetails",
    ];
    const currentIndex = steps.indexOf(step);
    const progress =
      currentIndex >= 0 ? ((currentIndex + 1) / steps.length) * 100 : 20;

    return (
      <div className="w-full h-1 bg-gray-700 rounded-full mb-6">
        <div
          className="h-full bg-[#FF6B2C] rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    );
  };

  const renderPersonalInfo = () => (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-gray-400 text-xs mb-1 block">Full Name</label>
        <input
          type="text"
          placeholder="Enter full name"
          value={personalInfo.fullName}
          onChange={(e) =>
            setPersonalInfo({ ...personalInfo, fullName: e.target.value })
          }
          className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#FF6B2C]"
        />
      </div>
      <div>
        <label className="text-gray-400 text-xs mb-1 block">Date of Birth</label>
        <DatePicker
          selected={dobDate}
          onChange={(date: Date | null) => {
            setDobDate(date);
            if (date) {
              const day = String(date.getDate()).padStart(2, "0");
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const year = date.getFullYear();
              setPersonalInfo({ ...personalInfo, dateOfBirth: `${day}-${month}-${year}` });
            } else {
              setPersonalInfo({ ...personalInfo, dateOfBirth: "" });
            }
          }}
          placeholderText="DD-MM-YYYY"
          dateFormat="dd-MM-yyyy"
          maxDate={new Date()}
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#FF6B2C] [&::-webkit-calendar-picker-indicator]:invert"
        />
      </div>
      <div>
        <label className="text-gray-400 text-xs mb-1 block">
          Residential Address
        </label>
        <input
          type="text"
          placeholder="Enter residential address"
          value={personalInfo.residentialAddress}
          onChange={(e) =>
            setPersonalInfo({
              ...personalInfo,
              residentialAddress: e.target.value,
            })
          }
          className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#FF6B2C]"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-gray-400 text-xs mb-1 block">Phone Number</label>
          <PhoneInput
            country={"ng"}
            value={personalInfo.phoneNumber}
            onChange={(value: string) =>
              setPersonalInfo({ ...personalInfo, phoneNumber: value })
            }
            enableSearch
            containerClass="!w-full"
            inputClass="!w-full"
            buttonClass="!bg-[#1C1C1E] !border !border-gray-700"
            inputStyle={{
              width: "100%",
              backgroundColor: "#1C1C1E",
              border: "1px solid #374151",
              color: "#fff",
              borderRadius: "0.5rem",
              height: "48px",
              paddingLeft: "52px",
              fontSize: "14px",
            }}
            buttonStyle={{
              backgroundColor: "#1C1C1E",
              border: "1px solid #374151",
              borderRadius: "0.5rem 0 0 0.5rem",
            }}
            dropdownStyle={{ backgroundColor: "#0A0A0A", color: "#fff" }}
            searchStyle={{ backgroundColor: "#0A0A0A", color: "#fff" }}
            placeholder="Enter phone number"
          />
        </div>
        <div>
          <label className="text-gray-400 text-xs mb-1 block">
            Phone Number (Optional)
          </label>
          <PhoneInput
            country={"ng"}
            value={personalInfo.phoneNumberOptional}
            onChange={(value: string) =>
              setPersonalInfo({ ...personalInfo, phoneNumberOptional: value })
            }
            enableSearch
            containerClass="!w-full"
            inputClass="!w-full"
            buttonClass="!bg-[#1C1C1E] !border !border-gray-700"
            inputStyle={{
              width: "100%",
              backgroundColor: "#1C1C1E",
              border: "1px solid #374151",
              color: "#fff",
              borderRadius: "0.5rem",
              height: "48px",
              paddingLeft: "52px",
              fontSize: "14px",
            }}
            buttonStyle={{
              backgroundColor: "#1C1C1E",
              border: "1px solid #374151",
              borderRadius: "0.5rem 0 0 0.5rem",
            }}
            dropdownStyle={{ backgroundColor: "#0A0A0A", color: "#fff" }}
            searchStyle={{ backgroundColor: "#0A0A0A", color: "#fff" }}
            placeholder="Enter phone number"
          />
        </div>
      </div>
      <div>
        <label className="text-gray-400 text-xs mb-1 block">E-mail Address</label>
        <input
          type="email"
          placeholder="Enter email address"
          value={personalInfo.email}
          onChange={(e) =>
            setPersonalInfo({ ...personalInfo, email: e.target.value })
          }
          className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#FF6B2C]"
        />
      </div>
    </div>
  );

  const renderNextOfKin = () => (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-gray-400 text-xs mb-1 block">Full Name</label>
        <input
          type="text"
          placeholder="Enter full name"
          value={nextOfKin.fullName}
          onChange={(e) =>
            setNextOfKin({ ...nextOfKin, fullName: e.target.value })
          }
          className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#FF6B2C]"
        />
      </div>
      <div>
        <label className="text-gray-400 text-xs mb-1 block">Relationship</label>
        <select
          value={nextOfKin.relationship}
          onChange={(e) =>
            setNextOfKin({ ...nextOfKin, relationship: e.target.value })
          }
          className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF6B2C] appearance-none"
        >
          <option value="" className="text-gray-500">
            Select how you are related
          </option>
          {relationshipOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-gray-400 text-xs mb-1 block">Phone Number</label>
          <PhoneInput
            country={"ng"}
            value={nextOfKin.phoneNumber}
            onChange={(value: string) => setNextOfKin({ ...nextOfKin, phoneNumber: value })}
            enableSearch
            containerClass="!w-full"
            inputClass="!w-full"
            buttonClass="!bg-[#1C1C1E] !border !border-gray-700"
            inputStyle={{
              width: "100%",
              backgroundColor: "#1C1C1E",
              border: "1px solid #374151",
              color: "#fff",
              borderRadius: "0.5rem",
              height: "48px",
              paddingLeft: "52px",
              fontSize: "14px",
            }}
            buttonStyle={{
              backgroundColor: "#1C1C1E",
              border: "1px solid #374151",
              borderRadius: "0.5rem 0 0 0.5rem",
            }}
            dropdownStyle={{ backgroundColor: "#0A0A0A", color: "#fff" }}
            searchStyle={{ backgroundColor: "#0A0A0A", color: "#fff" }}
            placeholder="Enter phone number"
          />
        </div>
        <div>
          <label className="text-gray-400 text-xs mb-1 block">
            Phone Number (Optional)
          </label>
          <PhoneInput
            country={"ng"}
            value={nextOfKin.phoneNumberOptional}
            onChange={(value: string) =>
              setNextOfKin({ ...nextOfKin, phoneNumberOptional: value })
            }
            enableSearch
            containerClass="!w-full"
            inputClass="!w-full"
            buttonClass="!bg-[#1C1C1E] !border !border-gray-700"
            inputStyle={{
              width: "100%",
              backgroundColor: "#1C1C1E",
              border: "1px solid #374151",
              color: "#fff",
              borderRadius: "0.5rem",
              height: "48px",
              paddingLeft: "52px",
              fontSize: "14px",
            }}
            buttonStyle={{
              backgroundColor: "#1C1C1E",
              border: "1px solid #374151",
              borderRadius: "0.5rem 0 0 0.5rem",
            }}
            dropdownStyle={{ backgroundColor: "#0A0A0A", color: "#fff" }}
            searchStyle={{ backgroundColor: "#0A0A0A", color: "#fff" }}
            placeholder="Enter phone number"
          />
        </div>
      </div>
    </div>
  );

  const renderRelationshipSelect = () => (
    <div className="flex flex-col gap-2">
      {relationshipOptions.map((opt) => (
        <button
          key={opt}
          onClick={() => {
            setNextOfKin({ ...nextOfKin, relationship: opt });
            setStep("financial");
          }}
          className={cn(
            "w-full text-left p-4 rounded-lg transition-colors border-l-2",
            nextOfKin.relationship === opt
              ? "bg-[#2C2C2E] border-[#FF6B2C]"
              : "bg-[#1C1C1E] border-gray-700 hover:bg-[#2C2C2E]"
          )}
        >
          <p className="text-white text-sm">{opt}</p>
        </button>
      ))}
    </div>
  );

  const renderFinancialInfo = () => (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-gray-400 text-xs mb-1 block">
          Occupation/Profession
        </label>
        <input
          type="text"
          placeholder="Enter your occupation"
          value={financialInfo.occupation}
          onChange={(e) =>
            setFinancialInfo({ ...financialInfo, occupation: e.target.value })
          }
          className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#FF6B2C]"
        />
      </div>
      <div>
        <label className="text-gray-400 text-xs mb-1 block">
          Employer/Business Name
        </label>
        <input
          type="text"
          placeholder="Enter business name"
          value={financialInfo.employerName}
          onChange={(e) =>
            setFinancialInfo({ ...financialInfo, employerName: e.target.value })
          }
          className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#FF6B2C]"
        />
      </div>
      <div>
        <label className="text-gray-400 text-xs mb-1 block">Source of Income</label>
        <select
          value={financialInfo.sourceOfIncome}
          onChange={(e) =>
            setFinancialInfo({ ...financialInfo, sourceOfIncome: e.target.value })
          }
          className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF6B2C] appearance-none"
        >
          <option value="" className="text-gray-500">
            Select an Option
          </option>
          {sourceOfIncomeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-gray-400 text-xs mb-1 block">
          Annual Income Range
        </label>
        <select
          value={financialInfo.annualIncomeRange}
          onChange={(e) =>
            setFinancialInfo({
              ...financialInfo,
              annualIncomeRange: e.target.value,
            })
          }
          className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF6B2C] appearance-none"
        >
          <option value="" className="text-gray-500">
            Select an Option
          </option>
          {incomeRangeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const renderSourceOfIncomeSelect = () => (
    <div className="flex flex-col gap-2">
      {sourceOfIncomeOptions.map((opt) => (
        <button
          key={opt}
          onClick={() => {
            setFinancialInfo({ ...financialInfo, sourceOfIncome: opt });
            setStep("incomeRange");
          }}
          className={cn(
            "w-full text-left p-4 rounded-lg transition-colors border-l-2",
            financialInfo.sourceOfIncome === opt
              ? "bg-[#2C2C2E] border-[#FF6B2C]"
              : "bg-[#1C1C1E] border-gray-700 hover:bg-[#2C2C2E]"
          )}
        >
          <p className="text-white text-sm">{opt}</p>
        </button>
      ))}
    </div>
  );

  const renderIncomeRangeSelect = () => (
    <div className="flex flex-col gap-2">
      {incomeRangeOptions.map((opt) => (
        <button
          key={opt}
          onClick={() => {
            setFinancialInfo({ ...financialInfo, annualIncomeRange: opt });
            setStep("aml");
          }}
          className={cn(
            "w-full text-left p-4 rounded-lg transition-colors border-l-2",
            financialInfo.annualIncomeRange === opt
              ? "bg-[#2C2C2E] border-[#FF6B2C]"
              : "bg-[#1C1C1E] border-gray-700 hover:bg-[#2C2C2E]"
          )}
        >
          <p className="text-white text-sm">{opt}</p>
        </button>
      ))}
    </div>
  );

  const amlQuestions = [
    { key: "isPEP", label: "Are you a Politically Exposed Person(PEP)?" },
    {
      key: "hasFinancialCrimes",
      label: "Have you ever been convicted of financial crimes?",
    },
    {
      key: "fundsFromLegal",
      label:
        "I declare that all funds invested come from legal and verifiable sources.",
    },
    {
      key: "isBeneficialOwner",
      label:
        "I confirm I am the beneficial owner of this investment (not acting on behalf of another person or entity).",
    },
    {
      key: "agreeToDocuments",
      label:
        "I agree that ValarPay may request supporting documents (e.g., bank statements, tax clearance, business records) if required.",
    },
    {
      key: "agreeToReporting",
      label:
        "I understand that suspicious or unusual activity will be reported to relevant authorities in line with AML laws.",
    },
    {
      key: "consentToMonitoring",
      label:
        "I consent to transaction monitoring, record keeping, and verification checks for compliance purposes.",
    },
    {
      key: "notInvolvedInCrime",
      label:
        "I declare that I am not involved in money laundering, terrorism financing, fraud, or any other financial crime.",
    },
  ];

  const renderAmlCompliance = () => (
    <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2">
      {amlQuestions.map((q) => (
        <label
          key={q.key}
          className="flex items-start gap-3 cursor-pointer group"
        >
          <div className="relative mt-0.5">
            <input
              type="checkbox"
              checked={amlCompliance[q.key as keyof AmlCompliance]}
              onChange={(e) =>
                setAmlCompliance({
                  ...amlCompliance,
                  [q.key]: e.target.checked,
                })
              }
              className="sr-only"
            />
            <div
              className={cn(
                "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                amlCompliance[q.key as keyof AmlCompliance]
                  ? "bg-[#FF6B2C] border-[#FF6B2C]"
                  : "border-gray-600 group-hover:border-gray-500"
              )}
            >
              {amlCompliance[q.key as keyof AmlCompliance] && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          </div>
          <span className="text-gray-300 text-sm leading-relaxed">
            {q.label}
          </span>
        </label>
      ))}
    </div>
  );

  const renderInvestmentDetails = () => (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-gray-400 text-xs mb-1 block">Amount</label>
        <div className="flex">
          <input
            type="text"
            placeholder=""
            value={investmentDetails.amount}
            onChange={(e) =>
              setInvestmentDetails({
                ...investmentDetails,
                amount: e.target.value,
              })
            }
            className="w-full bg-[#1C1C1E] border border-gray-700 border-r-0 rounded-l-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#FF6B2C]"
          />
          <span className="bg-[#FF6B2C] rounded-r-lg px-4 py-3 text-white text-sm font-medium flex items-center">
            NGN
          </span>
        </div>
      </div>
      <div>
        <label className="text-gray-400 text-xs mb-1 block">Invest Name</label>
        <input
          type="text"
          placeholder="Give your investment a name"
          value={investmentDetails.investName}
          onChange={(e) =>
            setInvestmentDetails({
              ...investmentDetails,
              investName: e.target.value,
            })
          }
          className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#FF6B2C]"
        />
      </div>
      <div>
        <label className="text-gray-400 text-xs mb-1 block">Duration</label>
        <select
          value={investmentDetails.duration}
          onChange={(e) =>
            setInvestmentDetails({
              ...investmentDetails,
              duration: e.target.value,
            })
          }
          className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF6B2C] appearance-none"
        >
          <option value="" className="text-gray-500">
            Select duration
          </option>
          {durationOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <label className="flex items-center gap-3 cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            checked={investmentDetails.interestAtMaturity}
            onChange={(e) =>
              setInvestmentDetails({
                ...investmentDetails,
                interestAtMaturity: e.target.checked,
              })
            }
            className="sr-only"
          />
          <div
            className={cn(
              "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
              investmentDetails.interestAtMaturity
                ? "bg-[#FF6B2C] border-[#FF6B2C]"
                : "border-gray-600"
            )}
          >
            {investmentDetails.interestAtMaturity && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        </div>
        <span className="text-gray-300 text-sm">Interest paid at maturity</span>
      </label>
    </div>
  );

  const getStepTitle = () => {
    switch (step) {
      case "policy":
        return "Investment Policy & Terms";
      case "personal":
        return "Personal Information";
      case "nextOfKin":
        return "Next of Kin Details";
      case "relationship":
        return "Relationship";
      case "financial":
        return "Financial Information";
      case "sourceOfIncome":
        return "Source of Income";
      case "incomeRange":
        return "Annual Income Range";
      case "aml":
        return "AML & Compliance";
      case "investmentDetails":
        return "Investment Details";
      default:
        return "";
    }
  };

  const handleBack = () => {
    switch (step) {
      case "personal":
        setStep("policy");
        break;
      case "nextOfKin":
        setStep("personal");
        break;
      case "relationship":
        setStep("nextOfKin");
        break;
      case "financial":
        setStep("nextOfKin");
        break;
      case "sourceOfIncome":
        setStep("financial");
        break;
      case "incomeRange":
        setStep("sourceOfIncome");
        break;
      case "aml":
        setStep("financial");
        break;
      case "investmentDetails":
        setStep("aml");
        break;
      default:
        handleClose();
    }
  };

  const handleNext = () => {
    switch (step) {
      case "policy":
        setStep("personal");
        break;
      case "personal":
        setStep("nextOfKin");
        break;
      case "nextOfKin":
        setStep("financial");
        break;
      case "relationship":
        setStep("financial");
        break;
      case "financial":
        setStep("aml");
        break;
      case "sourceOfIncome":
        setStep("incomeRange");
        break;
      case "incomeRange":
        setStep("aml");
        break;
      case "aml":
        setStep("investmentDetails");
        break;
      case "investmentDetails":
        if (creating) return;
        beginSubmit();
        break;
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case "policy":
        return renderPolicy();
      case "personal":
        return renderPersonalInfo();
      case "nextOfKin":
        return renderNextOfKin();
      case "relationship":
        return renderRelationshipSelect();
      case "financial":
        return renderFinancialInfo();
      case "sourceOfIncome":
        return renderSourceOfIncomeSelect();
      case "incomeRange":
        return renderIncomeRangeSelect();
      case "aml":
        return renderAmlCompliance();
      case "investmentDetails":
        return renderInvestmentDetails();
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div className="relative bg-[#0A0A0A] rounded-2xl w-full max-w-md mx-4 p-6 shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
        {renderProgressBar()}

        <div className="flex items-start justify-between mb-6">
          <h3 className="text-white text-lg font-semibold">{getStepTitle()}</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <IoClose className="text-2xl" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto mb-6">{renderStepContent()}</div>

        <div className="flex gap-3">
          <button
            onClick={handleBack}
            disabled={creating}
            className="flex-1 py-3 rounded-lg bg-[#2C2C2E] text-white text-sm font-medium hover:bg-[#3C3C3E] transition-colors"
          >
            Back
          </button>
          <CustomButton onClick={handleNext} disabled={creating} className="flex-1 py-3 rounded-lg">
            {step === "policy" ? "Continue" : "Next"}
          </CustomButton>
        </div>
      </div>

      {/* Wallet PIN Verification (required for debit) */}
      <VerifyWalletPinModal
        isOpen={verifyPinOpen}
        onClose={() => {
          setVerifyPinOpen(false);
          setPendingSubmit(false);
        }}
        onVerify={(pin) => {
          if (!pendingSubmit || creating) return;
          setVerifyPinOpen(false);

          const amount = parseAmount(investmentDetails.amount);

          // Never store wallet pin; pass through directly.
          createInvestment({
            amount,
            walletPin: pin,
            // pass collected KYC fields through to backend (backend remains source of truth)
            personalInfo,
            nextOfKin,
            financialInfo,
            amlCompliance,
            investmentDetails: {
              ...investmentDetails,
              amount,
            },
          });
        }}
      />
    </div>
  );
};

export default StartInvestmentModal;
