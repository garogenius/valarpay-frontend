"use client";

import React from "react";
import { CgClose } from "react-icons/cg";
import { FiSettings, FiFileText, FiAlertCircle } from "react-icons/fi";
import CustomButton from "@/components/shared/Button";
import useNavigate from "@/hooks/useNavigate";

interface KYCRequirementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency?: string;
  errorMessage?: string;
}

const KYCRequirementsModal: React.FC<KYCRequirementsModalProps> = ({
  isOpen,
  onClose,
  currency = "USD",
  errorMessage,
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoToSettings = () => {
    onClose();
    navigate("/user/settings/profile", "push");
  };

  // Parse the error message to extract required fields
  const requiredFields = [
    "postal code",
    "passport number",
    "passport country",
    "passport issue date",
    "passport expiry date",
    "employment status",
    "occupation",
    "primary purpose",
    "source of funds",
    "expected monthly inflow",
    "KYC document (passport scan, bank statement, utility bill, etc.)",
  ];

  return (
    <div className="z-[999999] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 flex justify-center items-center w-full md:inset-0 h-[100dvh]">
      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
        <div className="absolute inset-0 bg-black/80 dark:bg-black/60" onClick={onClose} />
      </div>
      <div className="relative mx-2.5 2xs:mx-4 bg-bg-600 dark:bg-bg-1100 border border-border-800 dark:border-border-700 px-0 pt-6 pb-6 w-full max-w-lg max-h-[92vh] rounded-2xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 cursor-pointer bg-bg-1400 rounded-full hover:bg-bg-1200 transition-colors z-10"
        >
          <CgClose className="text-xl text-text-200 dark:text-text-400" />
        </button>

        <div className="px-6 pt-2 pb-4">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-[#f76301]/10 flex items-center justify-center text-[#f76301]">
              <FiAlertCircle className="text-4xl" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-white text-xl sm:text-2xl font-semibold text-center mb-3">
            Account Creation Failed
          </h2>

          {/* Description */}
          <p className="text-white/70 text-sm sm:text-base text-center mb-6 leading-relaxed">
            The following information is required to create a {currency} account:
          </p>

          {/* Required Fields List */}
          <div className="bg-bg-500 dark:bg-bg-900 border border-border-700 dark:border-border-600 rounded-xl p-4 mb-6 max-h-[300px] overflow-y-auto">
            <div className="flex items-start gap-3 mb-3">
              <div className="mt-0.5">
                <FiFileText className="text-[#f76301] text-lg flex-shrink-0" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium text-sm mb-3">
                  Required Information for KYC Verification:
                </h3>
                <ul className="text-white/70 text-xs sm:text-sm space-y-2">
                  {requiredFields.map((field, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-[#f76301] mt-1">•</span>
                      <span className="flex-1 capitalize">{field}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-[#f76301]/5 border border-[#f76301]/20 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <FiSettings className="text-[#f76301] text-lg" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium text-sm mb-1">What you need to do:</h3>
                <ol className="text-white/70 text-xs sm:text-sm space-y-1.5 list-decimal list-inside">
                  <li>Go to your Profile Settings</li>
                  <li>Complete your profile information</li>
                  <li>Upload the required KYC documents</li>
                  <li>Return here to create your {currency} account</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <CustomButton
              onClick={handleGoToSettings}
              className="w-full rounded-xl py-3.5 font-semibold bg-[#f76301] hover:bg-[#f76301]/90 text-white flex items-center justify-center gap-2 transition-colors"
            >
              <FiSettings className="text-lg" />
              <span>Go to Profile Settings</span>
            </CustomButton>
            <CustomButton
              onClick={onClose}
              className="w-full bg-transparent border border-white/15 text-white hover:bg-white/5 rounded-xl py-3 transition-colors"
            >
              Maybe Later
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCRequirementsModal;



