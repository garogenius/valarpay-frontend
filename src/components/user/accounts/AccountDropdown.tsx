"use client";

import React, { useMemo, useRef } from "react";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import type { WalletAccount } from "@/api/wallet/wallet.types";

interface AccountDropdownProps {
  onClose: () => void;
  onSelect: (account: { name: string; currency: "NGN" | "USD" | "EUR" | "GBP"; flag: string }) => void;
  accounts?: WalletAccount[];
}

const AccountDropdown: React.FC<AccountDropdownProps> = ({ onClose, onSelect, accounts = [] }) => {
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, onClose);

  const hasCurrency = useMemo(() => {
    const set = new Set((accounts || []).map((a) => a.currency));
    return set;
  }, [accounts]);

  const items = useMemo(
    () => [
      { id: "NGN", name: "NGN Account", flag: "🇳🇬", currency: "NGN" as const, enabled: true },
      { id: "USD", name: "USD Account", flag: "🇺🇸", currency: "USD" as const, enabled: true },
      { id: "EUR", name: "EUR Account", flag: "🇪🇺", currency: "EUR" as const, enabled: false },
      { id: "GBP", name: "GBP Account", flag: "🇬🇧", currency: "GBP" as const, enabled: false },
    ],
    []
  );

  return (
    <div
      ref={ref}
      className="absolute top-full right-0 mt-2 w-full sm:w-[280px] bg-[#0A0A0A] border border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden"
    >
      {items.map((account) => {
        const exists = hasCurrency.has(account.currency);
        const status = exists ? ("active" as const) : ("setup" as const);
        const isDisabled = false;

        return (
        <button
          key={account.id}
          onClick={() => {
            onSelect({ name: account.name, currency: account.currency, flag: account.flag });
          }}
          disabled={isDisabled}
          className={`w-full flex items-center justify-between px-4 py-3 transition-colors border-b border-gray-800 last:border-b-0 ${
            status === "active" ? "bg-white/5" : ""
          } ${isDisabled ? "opacity-60 cursor-not-allowed" : "hover:bg-white/5"}`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{account.flag}</span>
            <span className="text-white text-sm font-medium">{account.name}</span>
          </div>
          {status === "active" ? (
            <span className="px-2 py-1 bg-white/10 text-gray-200 text-[10px] font-medium rounded-full">Active</span>
          ) : account.enabled ? (
            <span className="px-2 py-1 bg-green-500/10 text-green-400 text-[10px] font-medium rounded-full">
              Setup
            </span>
          ) : (
            <span className="px-2 py-1 bg-white/10 text-gray-300 text-[10px] font-medium rounded-full">
              Coming soon
            </span>
          )}
        </button>
      )})}
    </div>
  );
};

export default AccountDropdown;
