"use client";

import React from "react";
import { CgClose } from "react-icons/cg";

interface StartNewPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (planType: "target" | "fixed" | "easylife") => void;
}

const StartNewPlanModal: React.FC<StartNewPlanModalProps> = ({
  isOpen,
  onClose,
  onSelectPlan,
}) => {
  if (!isOpen) return null;

  const plans = [
    {
      type: "target" as const,
      title: "Target Savings",
      description: "Achieve your financial goals faster with scheduled contributions",
    },
    {
      type: "fixed" as const,
      title: "Fixed Savings",
      description: "Earn consistent interest on your savings while keeping your funds secure",
    },
    {
      type: "easylife" as const,
      title: "Easy-life Savings",
      description: "Enjoy flexible savings that fit your lifestyle while earning steady interest on your balance",
    },
  ];

  return (
    <div className="z-[999999] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 flex justify-center items-center w-full md:inset-0 h-[100dvh]">
      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
        <div className="absolute inset-0 bg-black/80 dark:bg-black/60" onClick={onClose} />
      </div>
      <div className="relative mx-4 bg-bg-600 dark:bg-bg-1100 border border-border-800 dark:border-border-700 w-full max-w-md rounded-2xl overflow-visible">
        {/* Header */}
        <div className="flex items-center justify-between p-4 pb-2">
          <div>
            <h2 className="text-white text-lg font-semibold">Start New Plan</h2>
            <p className="text-white/60 text-sm">Select Plan Type</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded transition-colors">
            <CgClose className="text-xl text-white/70" />
          </button>
        </div>

        <div className="px-4 pb-4">
          <div className="flex flex-col gap-3">
            {plans.map((plan) => (
              <button
                key={plan.type}
                onClick={() => {
                  onSelectPlan(plan.type);
                  onClose();
                }}
                className="w-full bg-white/5 dark:bg-white/5 border border-white/10 rounded-lg p-4 text-left hover:bg-white/10 transition-colors"
              >
                <h3 className="text-white font-semibold text-base mb-1">{plan.title}</h3>
                <p className="text-white/70 text-sm">{plan.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartNewPlanModal;


