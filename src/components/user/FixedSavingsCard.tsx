"use client";

import { GiSettingsKnobs } from "react-icons/gi";

const FixedSavingsCard = () => {
  return (
    <div className="shadow-sm bg-white dark:bg-bg-1100 rounded-xl px-4 py-7 2xs:py-8 flex items-center gap-4 sm:gap-6">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-bg-500 dark:bg-bg-1000 text-dark-300 dark:text-text-900">
        <GiSettingsKnobs className="text-2xl" />
      </div>
      <div className="flex flex-col gap-0 sm:gap-1 font-semibold">
        <div className="flex items-center gap-2">
          <p className="text-dark-200 dark:text-text-800 text-base sm:text-lg ">Fixed Savings</p>
        </div>
        <p className="text-dark-400 dark:text-white text-2xl sm:text-3xl">₦ 0.00</p>
      </div>
    </div>
  );
};

export default FixedSavingsCard;
