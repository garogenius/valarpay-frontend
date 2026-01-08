"use client";

import React from "react";
import { CgClose } from "react-icons/cg";
import useUserStore from "@/store/user.store";
import CustomButton from "@/components/shared/Button";
import CustomSelect from "@/components/CustomSelect";
import { useCreateEasyLifePlan } from "@/api/easylife-savings/easylife-savings.queries";
import type { EasyLifeContributionFrequency } from "@/api/easylife-savings/easylife-savings.types";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import ValidationErrorModal from "@/components/modals/ValidationErrorModal";
import useGlobalModalsStore from "@/store/globalModals.store";

type Frequency = "Daily" | "Weekly" | "Monthly";

interface EasyLifeSavingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EasyLifeSavingsModal: React.FC<EasyLifeSavingsModalProps> = ({ isOpen, onClose }) => {
  const { user } = useUserStore();
  const wallets = user?.wallet || [];

  const [step, setStep] = React.useState<1 | 2>(1);
  const [autoDebitEnabled, setAutoDebitEnabled] = React.useState(false);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [frequency, setFrequency] = React.useState<Frequency>("Monthly");
  const [earlyWithdrawalEnabled, setEarlyWithdrawalEnabled] = React.useState(false);
  const [showValidationModal, setShowValidationModal] = React.useState(false);
  const [validationError, setValidationError] = React.useState<{ title: string; descriptions: string[] } | null>(null);
  
  const { handleError, showInsufficientFundsModal } = useGlobalModalsStore();

  const onError = (error: unknown) => {
    handleError(error, {
      currency: "NGN",
      onRetry: () => {
        const cleanAmount = amount.replace(/[^0-9.]/g, "");
        const goalAmount = parseFloat(cleanAmount);
        if (!goalAmount || isNaN(goalAmount)) return;
        
        // Calculate duration days from start and end dates
        if (!startDate || !endDate) return;
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) return;
        const durationDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        
        const contributionFrequency: EasyLifeContributionFrequency =
          frequency === "Daily"
            ? "DAILY"
            : frequency === "Weekly"
            ? "WEEKLY"
            : "MONTHLY";
        
        createPlan({
          name: name.trim(),
          description: description.trim() || undefined,
          goalAmount,
          currency: "NGN",
          durationDays,
          contributionFrequency,
          autoDebitEnabled,
          earlyWithdrawalEnabled,
        });
      },
    });
  };

  const onSuccess = () => {
    SuccessToast({
      title: "Plan Created Successfully!",
      description: "Your easy-life savings plan has been created. Start funding it to grow your savings.",
    });
    setStep(2);
  };

  const { mutate: createPlan, isPending: creating } = useCreateEasyLifePlan(onError, onSuccess);

  const resetAndClose = () => {
    setStep(1);
    setName("");
    setDescription("");
    setAmount("");
    setStartDate("");
    setEndDate("");
    setAutoDebitEnabled(false);
    setFrequency("Monthly");
    setEarlyWithdrawalEnabled(false);
    onClose();
  };

  const handleCreate = () => {
    // Validation
    if (!name.trim()) {
      setValidationError({
        title: "Validation Error",
        descriptions: ["Plan name is required"],
      });
      setShowValidationModal(true);
      return;
    }

    // Parse amount by removing commas and other non-numeric characters except decimal point
    const cleanAmount = amount.replace(/[^0-9.]/g, "");
    const goalAmount = parseFloat(cleanAmount);
    
    if (!goalAmount || isNaN(goalAmount) || goalAmount < 50000) {
      setValidationError({
        title: "Validation Error",
        descriptions: ["Minimum goal amount for EasyLife is ₦50,000"],
      });
      setShowValidationModal(true);
      return;
    }

    // Start date and end date are required when auto-debit is enabled
    if (autoDebitEnabled) {
      if (!startDate || !endDate) {
        setValidationError({
          title: "Validation Error",
          descriptions: ["Start date and end date are required when auto-debit is enabled"],
        });
        setShowValidationModal(true);
        return;
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
        setValidationError({
          title: "Validation Error",
          descriptions: ["Please select valid start and end dates"],
        });
        setShowValidationModal(true);
        return;
      }
    }

    // Calculate duration days from start and end dates (required)
    if (!startDate || !endDate) {
      setValidationError({
        title: "Validation Error",
        descriptions: ["Start date and end date are required"],
      });
      setShowValidationModal(true);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
      setValidationError({
        title: "Validation Error",
        descriptions: ["Please select valid start and end dates"],
      });
      setShowValidationModal(true);
      return;
    }

    const durationDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (durationDays < 20) {
      setValidationError({
        title: "Validation Error",
        descriptions: ["EasyLife duration must be at least 20 days"],
      });
      setShowValidationModal(true);
      return;
    }

    const contributionFrequency: EasyLifeContributionFrequency =
      frequency === "Daily"
        ? "DAILY"
        : frequency === "Weekly"
        ? "WEEKLY"
        : "MONTHLY";

    const payload = {
      name: name.trim(),
      description: description.trim() || `EasyLife savings plan for ${name.trim()}`,
      goalAmount,
      currency: "NGN",
      durationDays,
      contributionFrequency,
      autoDebitEnabled,
      earlyWithdrawalEnabled,
    };

    createPlan(payload);
  };

  const handleCloseValidationModal = () => {
    setShowValidationModal(false);
    setValidationError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="z-[999999] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 flex justify-center items-center w-full md:inset-0 h-[100dvh]">
      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
        <div className="absolute inset-0 bg-black/80 dark:bg-black/60" onClick={resetAndClose} />
      </div>
      <div className="relative mx-2.5 2xs:mx-4 bg-bg-600 dark:bg-bg-1100 border border-border-800 dark:border-border-700 px-0 py-4 w-full max-w-lg max-h-[92vh] rounded-2xl flex flex-col">
        <button onClick={resetAndClose} className="absolute top-3 right-3 p-2 cursor-pointer bg-bg-1400 rounded-full hover:bg-bg-1200 transition-colors">
          <CgClose className="text-xl text-text-200 dark:text-text-400" />
        </button>

        {step !== 2 && (
          <div className="px-5 pt-1 pb-3">
            <h2 className="text-white text-base font-semibold">Create Easy-life Savings</h2>
          </div>
        )}

        <div className="overflow-y-auto overflow-x-hidden flex-1">
          {step === 1 && (
            <div className="px-5 sm:px-6 pb-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-white/70 text-xs">Plan Name</label>
                <input className="w-full bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-3 px-3 text-white text-sm placeholder:text-white/50 outline-none" placeholder="e.g., Wedding Savings" value={name} onChange={(e)=> setName(e.target.value)} />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-white/70 text-xs">Description (Optional)</label>
                <input className="w-full bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-3 px-3 text-white text-sm placeholder:text-white/50 outline-none" placeholder="e.g., Saving for my wedding" value={description} onChange={(e)=> setDescription(e.target.value)} />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-white/70 text-xs">Goal Amount</label>
                <input className="w-full bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-3 px-3 text-white text-sm placeholder:text-white/50 outline-none" placeholder="NGN" value={amount} onChange={(e)=> setAmount(e.target.value)} />
                <p className="text-white/50 text-xs mt-1">Minimum: ₦50,000</p>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-white/70 text-xs">Start Date <span className="text-red-400">*</span></label>
                <input type="date" className="w-full bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-3 px-3 text-white text-sm outline-none" value={startDate} onChange={(e)=> setStartDate(e.target.value)} />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-white/70 text-xs">End Date <span className="text-red-400">*</span></label>
                <input type="date" className="w-full bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-3 px-3 text-white text-sm outline-none" value={endDate} onChange={(e)=> setEndDate(e.target.value)} />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-white/70 text-xs">Contribution Frequency</label>
                <CustomSelect
                  options={["Daily","Weekly","Monthly"].map((f)=> ({ value: f, label: f }))}
                  value={{ value: frequency, label: frequency }}
                  onChange={(opt)=> setFrequency(opt.value as Frequency)}
                  placeholder="Select frequency"
                  selectClassName="bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-3 px-3 text-white text-sm outline-none"
                  placeholderClassName="text-white/50 text-sm"
                  isSearchable={false}
                  maxHeight="200"
                />
              </div>

              <div className="flex items-start justify-between gap-3 bg-white/5 border border-white/10 rounded-lg p-3">
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Enable Auto-debit</p>
                  <p className="text-white/60 text-xs mt-0.5">Automatically deduct contributions based on frequency</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoDebitEnabled((v) => !v)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    autoDebitEnabled ? "bg-[#f76301]" : "bg-white/20"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 ${
                      autoDebitEnabled ? "right-0.5" : "left-0.5"
                    } w-5 h-5 rounded-full bg-white transition-all`}
                  />
                </button>
              </div>

              <div className="flex items-start justify-between gap-3 bg-white/5 border border-white/10 rounded-lg p-3">
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Allow Early Withdrawal</p>
                  <p className="text-white/60 text-xs mt-0.5">If enabled, early withdrawal attracts a 1.5% penalty.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEarlyWithdrawalEnabled((v) => !v)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    earlyWithdrawalEnabled ? "bg-[#f76301]" : "bg-white/20"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 ${
                      earlyWithdrawalEnabled ? "right-0.5" : "left-0.5"
                    } w-5 h-5 rounded-full bg-white transition-all`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between gap-3 mt-3">
                <CustomButton type="button" className="flex-1 bg-transparent border border-[#f76301] text-white rounded-lg px-5 py-2.5 text-sm" onClick={resetAndClose}>Cancel</CustomButton>
                <CustomButton type="button" disabled={creating} isLoading={creating} className="flex-1 bg-[#f76301] hover:bg-[#e55a00] text-black rounded-lg px-5 py-2.5 text-sm font-medium" onClick={handleCreate}>Create Plan</CustomButton>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="px-5 pt-8 pb-8 flex flex-col items-center text-center gap-4">
              <div className="w-8 h-8 rounded-full bg-[#0E2C25] grid place-items-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h3 className="text-white text-base font-semibold">Plan Created Successfully</h3>
              <p className="text-white/80 text-sm leading-relaxed max-w-md">You&apos;re all set — start funding your EasyLife savings plan and watch it grow</p>
              <CustomButton type="button" className="w-full bg-[#f76301] hover:bg-[#e55a00] text-black py-3.5 rounded-xl" onClick={resetAndClose}>
                View Details
              </CustomButton>
            </div>
          )}
        </div>
      </div>

      {validationError && (
        <ValidationErrorModal
          isOpen={showValidationModal}
          onClose={handleCloseValidationModal}
          title={validationError.title}
          descriptions={validationError.descriptions}
        />
      )}

      {/* Insufficient Balance Modal */}
    </div>
  );
};

export default EasyLifeSavingsModal;
