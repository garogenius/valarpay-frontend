"use client";

import Link from "next/link";
import { IconType } from "react-icons/lib";

const SettingsCard = (item: { path: string; text: string; icon: IconType }) => {
  return (
    <div
      className={`bg-dark-primary 2xs:bg-bg-400 dark:bg-bg-1100 2xs:dark:bg-bg-2200 text-text-200 dark:text-text-800 flex items-center gap-1.5 sm:gap-2 py-4 sm:py-6 px-2.5 sm:px-4 rounded-xl sm:rounded-2xl`}
    >
      <item.icon className="text-2xl sm:text-3xl" />
      <Link href={item.path} className="text-base 2xs:text-lg sm:text-xl">
        {item.text}
      </Link>
    </div>
  );
};

export default SettingsCard;
