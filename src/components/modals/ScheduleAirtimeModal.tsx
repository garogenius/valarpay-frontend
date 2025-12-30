"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useMemo, useState } from "react";
import { IoClose } from "react-icons/io5";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";

export type ScheduledAirtimeDraft = {
  phone: string;
  amount: number;
  network: "MTN" | "Glo" | "Airtel" | "9mobile";
};

const AMOUNTS = [1000, 2000, 5000, 10000];
const NETWORKS: ScheduledAirtimeDraft["network"][] = ["MTN", "Glo", "Airtel", "9mobile"];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initial?: Partial<ScheduledAirtimeDraft>;
  onSubmit: (draft: ScheduledAirtimeDraft) => void;
};

const ScheduleAirtimeModal: React.FC<Props> = ({ isOpen, onClose, initial, onSubmit }) => {
  const [phone, setPhone] = useState(initial?.phone || "");
  const [amount, setAmount] = useState<number>(initial?.amount || 0);
  const [network, setNetwork] = useState<ScheduledAirtimeDraft["network"]>(
    initial?.network || "MTN"
  );
  const [amountOpen, setAmountOpen] = useState(false);
  const [networkOpen, setNetworkOpen] = useState(false);

  const canContinue = useMemo(() => {
    const digits = phone.replace(/\D/g, "");
    return digits.length >= 10 && amount > 0 && !!network;
  }, [phone, amount, network]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0A0A0A] shadow-2xl overflow-hidden">
        <div className="px-5 pt-4 pb-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#0A0A0A] dark:text-white text-sm font-semibold">Schedule Airtime</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                {initial ? "Edit schedule airtime details" : "Easily set up automatic recharges"}
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

        <div className="px-5 pb-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-gray-500 dark:text-gray-400">Mobile Number</label>
              <div className="w-full flex items-center bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm">
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-600 text-sm"
                  placeholder="Enter Phone Number"
                  inputMode="tel"
                />
              </div>
            </div>

            <div className="relative flex flex-col gap-1">
              <label className="text-[11px] text-gray-500 dark:text-gray-400">Amount</label>
              <button
                type="button"
                onClick={() => setAmountOpen((v) => !v)}
                className="w-full flex items-center justify-between bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm text-black dark:text-white"
              >
                <span>{amount > 0 ? `₦${amount.toLocaleString()}.00` : "Select amount"}</span>
                <span className="text-gray-500 dark:text-gray-500">▾</span>
              </button>
              {amountOpen ? (
                <div className="absolute left-0 top-full mt-2 w-full bg-white dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-2xl z-20">
                  {AMOUNTS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => {
                        setAmount(a);
                        setAmountOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-[#1C1C1E] transition-colors"
                    >
                      ₦{a.toLocaleString()}.00
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="relative flex flex-col gap-1">
              <label className="text-[11px] text-gray-500 dark:text-gray-400">Network</label>
              <button
                type="button"
                onClick={() => setNetworkOpen((v) => !v)}
                className="w-full flex items-center justify-between bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm text-black dark:text-white"
              >
                <span>{network || "Select network"}</span>
                <span className="text-gray-500 dark:text-gray-500">▾</span>
              </button>
              {networkOpen ? (
                <div className="absolute left-0 top-full mt-2 w-full bg-white dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-2xl z-20">
                  {NETWORKS.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => {
                        setNetwork(n);
                        setNetworkOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-[#1C1C1E] transition-colors"
                    >
                      {n}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (!canContinue) {
                ErrorToast({
                  title: "Incomplete details",
                  descriptions: ["Please enter a valid phone number, amount, and network."],
                });
                return;
              }
              onSubmit({ phone, amount, network });
              SuccessToast({
                title: "Scheduled",
                description: "Your airtime schedule was saved",
              });
              onClose();
            }}
            disabled={!canContinue}
            className="w-full mt-5 px-4 py-3 rounded-full bg-[#FF6B2C] text-black font-semibold hover:bg-[#FF7A3D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleAirtimeModal;


