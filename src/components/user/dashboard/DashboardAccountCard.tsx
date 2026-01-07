"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoMdCheckmark } from "react-icons/io";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { Wallet } from "@/constants/types";
import icons from "../../../../public/icons";
import AddMoneyModal from "@/components/modals/AddMoneyModal";

const currencyLabel: Record<string, string> = {
  NGN: "NGN Account",
  USD: "USD Account",
  EUR: "Euro Account",
  GBP: "Pounds Account",
};

const DashboardAccountCard = ({ wallets }: { wallets: Wallet[] }) => {
  const primary = useMemo(() => wallets?.[0], [wallets]);
  const [active, setActive] = useState<Wallet | null>(primary || null);
  const [open, setOpen] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setOpen(false));

  const iconByCurrency = (code?: string) => {
    const map: Record<string, string> = {
      NGN: icons.currenciesIcons.ngnIcon,
      USD: icons.currenciesIcons.usdIcon,
      EUR: icons.currenciesIcons.eurIcon,
      GBP: icons.currenciesIcons.gbpIcon,
    };
    return (code && map[code]) || icons.currenciesIcons.ngnIcon;
  };

  return (
    <div className="relative bg-[#2C2C2E] dark:bg-[#2C2C2E] rounded-xl p-4">
      {/* Header with currency selector and add money button */}
      <div className="flex items-center justify-between mb-4">
        <button
          className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
          onClick={() => setOpen((s) => !s)}
        >
          <svg className="w-5 h-5 text-[#FF6B2C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span className="text-sm font-medium">
            {currencyLabel[active?.currency || "NGN"]}
          </span>
          <MdKeyboardArrowDown className="text-lg" />
        </button>
        <button 
          onClick={() => setIsAddMoneyModalOpen(true)}
          className="w-8 h-8 rounded-full bg-[#FF6B2C] hover:bg-[#FF7D3D] flex items-center justify-center transition-colors"
        >
          <span className="text-white text-lg font-bold">+</span>
        </button>
      </div>

      {/* Label */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-gray-400">Main Balance</span>
        <button
          onClick={() => setShowBalance(!showBalance)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {showBalance ? <RiEyeLine size={14} /> : <RiEyeOffLine size={14} />}
        </button>
      </div>

      {/* Amount */}
      <div className="flex items-center">
        <p className="text-2xl font-bold text-white">
          {showBalance ? `₦${(active?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "₦•••••••"}
        </p>
      </div>

      {/* Dropdown */}
      {open ? (
        <div
          ref={ref}
          className="absolute z-20 mt-2 right-4 top-16 w-64 sm:w-72 rounded-xl border border-gray-700 bg-[#1C1C1E] shadow-2xl"
        >
          <div className="p-3 border-b border-gray-700">
            <p className="text-sm font-semibold text-gray-300">
              Select Account
            </p>
          </div>
          <div className="max-h-72 overflow-auto">
            {wallets?.map((w) => (
              <div
                key={w.id}
                onClick={() => {
                  setActive(w);
                  setOpen(false);
                }}
                className="cursor-pointer flex items-center justify-between gap-2 px-4 py-3 hover:bg-[#2C2C2E] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Image src={iconByCurrency(w.currency)} alt="cur" width={20} height={20} />
                  <span className="text-sm text-gray-300">
                    {currencyLabel[w.currency]}
                  </span>
                </div>
                {active?.id === w.id ? (
                  <IoMdCheckmark className="text-[#FF6B2C]" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Add Money Modal */}
      <AddMoneyModal
        isOpen={isAddMoneyModalOpen}
        onClose={() => setIsAddMoneyModalOpen(false)}
      />
    </div>
  );
};

export default DashboardAccountCard;
