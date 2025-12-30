"use client";

import { IoClose } from "react-icons/io5";
import type { SavingsProduct } from "@/api/savings/savings.types";

type PlanType = "target" | "fixed" | "easy-life" | "fixed-deposit";

interface PlanOption {
  key: PlanType;
  title: string;
  description: string;
}

interface StartNewPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan?: (planType: PlanType) => void;
  onSelectProduct?: (product: SavingsProduct) => void;
}

const planOptions: PlanOption[] = [
  {
    key: "target",
    title: "Target Savings",
    description:
      "Achieve your financial goals faster with scheduled contributions",
  },
  {
    key: "fixed",
    title: "Fixed Savings",
    description:
      "Earn consistent interest on your savings while keeping your funds secure",
  },
  {
    key: "easy-life",
    title: "Easy-life Savings",
    description:
      "Enjoy flexible savings that fit your lifestyle while earning steady interest on your balance",
  },
  {
    key: "fixed-deposit",
    title: "Fixed Deposit",
    description:
      "Lock your funds for a specific period and earn higher interest rates on maturity",
  },
];

const StartNewPlanModal: React.FC<StartNewPlanModalProps> = ({
  isOpen,
  onClose,
  onSelectPlan,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-[#0A0A0A] rounded-2xl w-full max-w-md mx-4 p-6 shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-white text-xl font-semibold">Start New Plan</h3>
            <p className="text-gray-400 text-sm mt-1">Select Plan Type</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <IoClose className="text-2xl" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {planOptions.map((plan) => (
              <button
                key={plan.key}
                onClick={() => {
                  onSelectPlan?.(plan.key);
                  onClose();
                }}
              className="w-full text-left p-4 rounded-lg bg-[#1C1C1E] border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <p className="text-white font-semibold text-base mb-2">{plan.title}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{plan.description}</p>
              </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StartNewPlanModal;
