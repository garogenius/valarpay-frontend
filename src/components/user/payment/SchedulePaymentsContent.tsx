"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { FiPlus } from "react-icons/fi";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import ScheduleAirtimeModal, { ScheduledAirtimeDraft } from "@/components/modals/ScheduleAirtimeModal";
import ConfirmDeleteScheduleModal from "@/components/modals/ConfirmDeleteScheduleModal";

type ScheduledPayment = {
  id: string;
  type: "airtime";
  amount: number;
  currency: "NGN";
  phone: string;
  network: ScheduledAirtimeDraft["network"];
  cadenceLabel: string; // e.g. Every Sunday
  createdAt: string;
};

const STORAGE_KEY = "valarpay_scheduled_payments_v1";

function readSchedules(): ScheduledPayment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeSchedules(items: ScheduledPayment[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

const networkDotClass = (n: ScheduledAirtimeDraft["network"]) => {
  if (n === "MTN") return "bg-yellow-400";
  if (n === "Glo") return "bg-green-500";
  if (n === "Airtel") return "bg-red-500";
  return "bg-emerald-400";
};

const SchedulePaymentsContent = () => {
  const [items, setItems] = React.useState<ScheduledPayment[]>([]);
  const [open, setOpen] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setItems(readSchedules());
  }, []);

  const selected = React.useMemo(
    () => items.find((i) => i.id === editId) || null,
    [items, editId]
  );

  const onUpsert = (draft: ScheduledAirtimeDraft) => {
    const now = new Date().toISOString();
    setItems((prev) => {
      const next = [...prev];
      if (editId) {
        const idx = next.findIndex((x) => x.id === editId);
        if (idx >= 0) {
          next[idx] = {
            ...next[idx],
            phone: draft.phone,
            amount: draft.amount,
            network: draft.network,
          };
        }
      } else {
        next.unshift({
          id: `sched_${Date.now()}`,
          type: "airtime",
          currency: "NGN",
          phone: draft.phone,
          amount: draft.amount,
          network: draft.network,
          cadenceLabel: "Every Sunday",
          createdAt: now,
        });
      }
      writeSchedules(next);
      return next;
    });
    setEditId(null);
  };

  const onDelete = (id: string) => {
    setItems((prev) => {
      const next = prev.filter((x) => x.id !== id);
      writeSchedules(next);
      return next;
    });
  };

  return (
    <div className="w-full">
      <div className="w-full rounded-2xl border border-gray-800 bg-[#0A0A0A] overflow-hidden">
        <div className="px-5 pt-5 pb-4">
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setOpen(true);
            }}
            className="w-full flex items-center justify-start gap-2 text-[#FF6B2C] text-sm font-medium hover:opacity-90"
          >
            <FiPlus className="text-base" />
            Add New Schedule Payment
          </button>
        </div>

        <div className="border-t border-gray-800">
          {items.length === 0 ? (
            <div className="px-5 py-8 text-center text-gray-400 text-sm">
              No scheduled payments yet.
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {items.map((it) => (
                <div key={it.id} className="px-5 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#1C1C1E] border border-gray-800 flex items-center justify-center">
                      <div className={`w-5 h-5 rounded-full ${networkDotClass(it.network)}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium text-sm truncate">Airtime</p>
                        <p className="text-[#FF6B2C] text-xs font-semibold whitespace-nowrap">
                          ₦{it.amount.toLocaleString()}.00
                        </p>
                      </div>
                      <p className="text-gray-400 text-xs truncate">{it.cadenceLabel}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setEditId(it.id);
                        setOpen(true);
                      }}
                      className="text-gray-400 hover:text-white text-xs flex items-center gap-1"
                    >
                      <MdOutlineEdit className="text-base" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(it.id)}
                      className="text-gray-400 hover:text-white text-xs flex items-center gap-1"
                    >
                      <RiDeleteBinLine className="text-base" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ScheduleAirtimeModal
        isOpen={open}
        onClose={() => setOpen(false)}
        initial={
          selected
            ? { phone: selected.phone, amount: selected.amount, network: selected.network }
            : undefined
        }
        onSubmit={onUpsert}
      />

      <ConfirmDeleteScheduleModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) onDelete(deleteId);
          setDeleteId(null);
        }}
      />
    </div>
  );
};

export default SchedulePaymentsContent;
















































