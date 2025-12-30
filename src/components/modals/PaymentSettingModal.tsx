"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useMemo, useState } from "react";
import { IoClose } from "react-icons/io5";
import useUserStore from "@/store/user.store";
import CustomButton from "@/components/shared/Button";
import { CURRENCY } from "@/constants/types";
import { useGetVirtualCardDetails } from "@/api/wallet/wallet.queries";

type PaymentSource =
  | { kind: "available_balance" }
  | { kind: "wallet"; walletId: string }
  | { kind: "card"; cardId: string };

const STORAGE_KEY = "valarpay_payment_source";

const PaymentSettingModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { user } = useUserStore();

  const wallets = (user?.wallet || []) as any[];
  const ngnWallet = wallets.find((w) => w.currency === CURRENCY.NGN);

  const [storedCardId, setStoredCardId] = useState<string>("");
  useEffect(() => {
    if (typeof window === "undefined") return;
    setStoredCardId(localStorage.getItem("usdVirtualCardId") || "");
  }, []);

  const { card } = useGetVirtualCardDetails({
    cardId: storedCardId || undefined,
    provider: "graph",
    enabled: !!storedCardId,
  });

  const [selected, setSelected] = useState<PaymentSource>({ kind: "available_balance" });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.kind) setSelected(parsed);
    } catch {
      // ignore
    }
  }, []);

  const items = useMemo(() => {
    const list: { key: string; label: string; sub: string; tag: "Account" | "Card" | "Balance"; source: PaymentSource }[] = [];

    list.push({
      key: "available_balance",
      label: `Available Balance (${ngnWallet ? `₦${Number(ngnWallet.balance || 0).toLocaleString()}` : "₦0"})`,
      sub: "",
      tag: "Balance",
      source: { kind: "available_balance" },
    });

    (wallets || []).forEach((w) => {
      const bank = String(w.bankName || "Wallet");
      const acct = String(w.accountNumber || "");
      list.push({
        key: `wallet_${w.id}`,
        label: bank,
        sub: acct,
        tag: "Account",
        source: { kind: "wallet", walletId: String(w.id) },
      });
    });

    if (card?.cardId) {
      list.push({
        key: `card_${card.cardId}`,
        label: "Virtual Card",
        sub: String(card.cardNumber || ""),
        tag: "Card",
        source: { kind: "card", cardId: String(card.cardId) },
      });
    }

    return list;
  }, [wallets, ngnWallet, card?.cardId, card?.cardNumber]);

  const isSame = (a: PaymentSource, b: PaymentSource) => JSON.stringify(a) === JSON.stringify(b);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0A0A0A] shadow-2xl overflow-hidden">
        <div className="px-5 pt-4 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[#0A0A0A] dark:text-white text-sm font-semibold">Payment Setting</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                Choose the account you’d like to use for payments
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              aria-label="Close"
            >
              <IoClose className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-5 py-5">
          <div className="rounded-2xl bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 overflow-hidden">
            {items.map((it) => {
              const active = isSame(selected, it.source);
              return (
                <button
                  key={it.key}
                  type="button"
                  onClick={() => setSelected(it.source)}
                  className="w-full px-4 py-4 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-800 flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-300">
                      {it.tag === "Balance" ? "₦" : it.tag === "Card" ? "C" : "A"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#0A0A0A] dark:text-white truncate">{it.label}</p>
                      {it.sub ? <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{it.sub}</p> : null}
                      {it.tag !== "Balance" ? (
                        <span className="inline-flex mt-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800/40">
                          {it.tag}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      active
                        ? "border-[#FF6B2C] bg-[#FF6B2C]"
                        : "border-gray-300 dark:border-gray-700 bg-transparent"
                    }`}
                  >
                    {active ? <span className="w-2 h-2 rounded-full bg-black" /> : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-5 pb-5">
          <CustomButton
            onClick={() => {
              if (typeof window !== "undefined") {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
              }
              onClose();
            }}
            className="w-full py-3"
          >
            Done
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default PaymentSettingModal;















