"use client";

import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FiChevronDown } from "react-icons/fi";
import CustomButton from "@/components/shared/Button";

interface GetPhysicalCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Step = "questions" | "delivery" | "confirmation" | "success";

const nigeriaStates = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
  "FCT",
];

const securityQuestions = [
  "What is your mother's maiden name?",
  "What is the name of your first pet?",
  "What city were you born in?",
  "What is your favorite color?",
  "What is the name of your elementary school?",
];

const GetPhysicalCardModal: React.FC<GetPhysicalCardModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<Step>("questions");
  const [selectedQuestion1, setSelectedQuestion1] = useState("");
  const [answer1, setAnswer1] = useState("");
  const [selectedQuestion2, setSelectedQuestion2] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [selectedQuestion3, setSelectedQuestion3] = useState("");
  const [answer3, setAnswer3] = useState("");
  const [state, setState] = useState("");
  const [lga, setLga] = useState("");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberOptional, setPhoneNumberOptional] = useState("");

  if (!isOpen) return null;

  const handleClose = () => {
    setStep("questions");
    onClose();
  };

  const handleNext = () => {
    if (step === "questions") {
      setStep("delivery");
    } else if (step === "delivery") {
      setStep("confirmation");
    } else if (step === "confirmation") {
      setStep("success");
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }
  };

  const renderQuestions = () => (
    <div className="space-y-5">
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <label className="text-gray-400 text-xs">Question</label>
          <div className="relative">
            <select
              value={selectedQuestion1}
              onChange={(e) => setSelectedQuestion1(e.target.value)}
              className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm appearance-none focus:outline-none focus:border-[#FF6B2C]"
            >
              <option value="">Select a question</option>
              {securityQuestions.map((q, i) => (
                <option key={i} value={q}>
                  {q}
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <input
            type="text"
            placeholder="Enter answer"
            value={answer1}
            onChange={(e) => setAnswer1(e.target.value)}
            className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#FF6B2C]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-gray-400 text-xs">Question</label>
          <div className="relative">
            <select
              value={selectedQuestion2}
              onChange={(e) => setSelectedQuestion2(e.target.value)}
              className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm appearance-none focus:outline-none focus:border-[#FF6B2C]"
            >
              <option value="">Select a question</option>
              {securityQuestions.map((q, i) => (
                <option key={i} value={q}>
                  {q}
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <input
            type="text"
            placeholder="Enter answer"
            value={answer2}
            onChange={(e) => setAnswer2(e.target.value)}
            className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#FF6B2C]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-gray-400 text-xs">Question</label>
          <div className="relative">
            <select
              value={selectedQuestion3}
              onChange={(e) => setSelectedQuestion3(e.target.value)}
              className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm appearance-none focus:outline-none focus:border-[#FF6B2C]"
            >
              <option value="">Select a question</option>
              {securityQuestions.map((q, i) => (
                <option key={i} value={q}>
                  {q}
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <input
            type="text"
            placeholder="Enter answer"
            value={answer3}
            onChange={(e) => setAnswer3(e.target.value)}
            className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#FF6B2C]"
          />
        </div>
      </div>

      <CustomButton onClick={handleNext} className="w-full py-3">
        Update Question
      </CustomButton>
    </div>
  );

  const renderDelivery = () => (
    <div className="space-y-5">
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-start gap-2">
        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-green-500 text-xs leading-relaxed">
          Your card will arrive in 5-7 business days. You'll receive tracking information via SMS
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-gray-400 text-xs mb-2 block">State</label>
          <div className="relative">
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm appearance-none focus:outline-none focus:border-[#FF6B2C]"
            >
              <option value="">Select state</option>
              {nigeriaStates.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="text-gray-400 text-xs mb-2 block">LGA</label>
          <div className="relative">
            <select
              value={lga}
              onChange={(e) => setLga(e.target.value)}
              className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm appearance-none focus:outline-none focus:border-[#FF6B2C]"
            >
              <option value="">Select LGA</option>
            </select>
            <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="text-gray-400 text-xs mb-2 block">Area</label>
          <div className="relative">
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm appearance-none focus:outline-none focus:border-[#FF6B2C]"
            >
              <option value="">Select area</option>
            </select>
            <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="text-gray-400 text-xs mb-2 block">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#FF6B2C]"
          />
        </div>

        <div>
          <label className="text-gray-400 text-xs mb-2 block">Landmark</label>
          <input
            type="text"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#FF6B2C]"
          />
        </div>

        <div>
          <label className="text-gray-400 text-xs mb-2 block">Phone Number</label>
          <div className="flex gap-2">
            <span className="bg-[#2C2C2E] border border-gray-700 rounded-lg px-4 py-3 text-gray-400 text-sm flex items-center">
              +234
            </span>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1 bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#FF6B2C]"
            />
          </div>
        </div>

        <div>
          <label className="text-gray-400 text-xs mb-2 block">Phone Number (Optional)</label>
          <div className="flex gap-2">
            <span className="bg-[#2C2C2E] border border-gray-700 rounded-lg px-4 py-3 text-gray-400 text-sm flex items-center">
              +234
            </span>
            <input
              type="text"
              value={phoneNumberOptional}
              onChange={(e) => setPhoneNumberOptional(e.target.value)}
              className="flex-1 bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#FF6B2C]"
            />
          </div>
        </div>
      </div>

      <CustomButton onClick={handleNext} className="w-full py-3">
        Next
      </CustomButton>
    </div>
  );

  const renderConfirmation = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between py-2">
          <span className="text-gray-400 text-sm">Full Address</span>
          <span className="text-white text-sm text-right max-w-[60%]">
            10, Oluku by pass, Ugbowo, Ovia North East, Edo State
          </span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-gray-400 text-sm">Phone Number</span>
          <div className="text-right">
            <p className="text-white text-sm">+234 000 0000 0000</p>
            <p className="text-white text-sm">+234 999 9999 9999</p>
          </div>
        </div>
        <div className="h-px bg-gray-800" />
        <div className="flex items-center justify-between py-2">
          <span className="text-gray-400 text-sm">Issuance Fee</span>
          <span className="text-white text-sm">₦10,000</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-gray-400 text-sm">Maintenance Fee</span>
          <span className="text-white text-sm">₦50.00</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-gray-400 text-sm">Delivery Fee</span>
          <span className="text-white text-sm">₦10,000</span>
        </div>
        <div className="h-px bg-gray-800" />
        <div className="flex items-center justify-between py-2">
          <span className="text-white text-base font-semibold">Total Fee</span>
          <span className="text-white text-base font-semibold">₦5,000.00</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setStep("delivery")}
          className="flex-1 py-3 rounded-lg bg-[#2C2C2E] text-white text-sm font-medium hover:bg-[#3C3C3E] transition-colors"
        >
          Back
        </button>
        <CustomButton onClick={handleNext} className="flex-1 py-3">
          Next
        </CustomButton>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
        <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-white text-xl font-semibold mb-2">Card Requested Successfully!</h3>
      <p className="text-gray-400 text-sm">Your physical card will be delivered within 5-7 business days</p>
    </div>
  );

  const getStepTitle = () => {
    switch (step) {
      case "questions":
        return "Get Physical Card";
      case "delivery":
        return "Get Physical Card";
      case "confirmation":
        return "Get Physical Card";
      case "success":
        return "";
      default:
        return "";
    }
  };

  const getStepSubtitle = () => {
    switch (step) {
      case "questions":
        return "Question 1";
      case "delivery":
        return "Provide delivery details for your physical card";
      case "confirmation":
        return "Confirm Information";
      default:
        return "";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} aria-hidden="true" />
      <div className="relative bg-[#0A0A0A] rounded-2xl w-full max-w-md mx-4 p-6 shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
        {step !== "success" && (
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-white text-lg font-semibold">{getStepTitle()}</h3>
              <p className="text-gray-400 text-sm mt-1">{getStepSubtitle()}</p>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
              <IoClose className="text-2xl" />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {step === "questions" && renderQuestions()}
          {step === "delivery" && renderDelivery()}
          {step === "confirmation" && renderConfirmation()}
          {step === "success" && renderSuccess()}
        </div>
      </div>
    </div>
  );
};

export default GetPhysicalCardModal;



























