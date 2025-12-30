"use client";

import React, { useMemo, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FiCopy, FiEye, FiEyeOff } from "react-icons/fi";
import type { VirtualCard } from "@/api/wallet/wallet.types";
import SuccessToast from "@/components/toast/SuccessToast";

interface ShowCardDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  card?: VirtualCard | null;
  cardholderName?: string;
}

const maskNumber = (n?: string) => {
  if (!n) return "•••• •••• •••• ••••";
  const last4 = n.replace(/\s+/g, "").slice(-4);
  return `•••• •••• •••• ${last4}`;
};

const formatCardNumber = (n?: string) => {
  if (!n) return "";
  return n.replace(/\s+/g, "").replace(/(.{4})/g, "$1 ").trim();
};

const ShowCardDetailsModal: React.FC<ShowCardDetailsModalProps> = ({
  isOpen,
  onClose,
  card,
  cardholderName = "CARD HOLDER",
}) => {
  const [show, setShow] = useState(false);
  const expiry = useMemo(() => {
    if (!card?.expiryMonth || !card?.expiryYear) return "MM/YY";
    const m = String(card.expiryMonth).padStart(2, "0");
    const y = String(card.expiryYear).slice(-2);
    return `${m}/${y}`;
  }, [card?.expiryMonth, card?.expiryYear]);

  if (!isOpen) return null;

  const handleCopy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      SuccessToast({ title: "Copied", description: `${label} copied to clipboard` });
    } catch {
      // ignore
    }
  };

  const cardNumberToShow = show ? formatCardNumber(card?.cardNumber) : maskNumber(card?.cardNumber);
  const cvvToShow = show ? card?.cvv || "***" : "***";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-[#0A0A0A] rounded-2xl w-full max-w-md mx-4 p-6 shadow-xl border border-white/10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-white text-lg font-semibold">Card Details</h3>
            <p className="text-gray-400 text-sm mt-1">Keep your card details secure</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <IoClose className="text-2xl" />
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShow((v) => !v)}
            className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
          >
            {show ? <FiEyeOff /> : <FiEye />}
            <span>{show ? "Hide details" : "Show details"}</span>
          </button>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/60 text-xs mb-1">Card Number</p>
            <div className="flex items-center justify-between gap-3">
              <p className="text-white font-mono tracking-widest text-sm">{cardNumberToShow}</p>
              <button
                onClick={() => handleCopy(card?.cardNumber || "", "Card number")}
                className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white"
                disabled={!card?.cardNumber}
                title="Copy"
              >
                <FiCopy />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-white/60 text-xs mb-1">Expiry</p>
              <div className="flex items-center justify-between gap-3">
                <p className="text-white text-sm font-semibold">{expiry}</p>
                <button
                  onClick={() => handleCopy(expiry, "Expiry")}
                  className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white"
                  title="Copy"
                >
                  <FiCopy />
                </button>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-white/60 text-xs mb-1">CVV</p>
              <div className="flex items-center justify-between gap-3">
                <p className="text-white text-sm font-semibold">{cvvToShow}</p>
                <button
                  onClick={() => handleCopy(card?.cvv || "", "CVV")}
                  className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white"
                  disabled={!card?.cvv}
                  title="Copy"
                >
                  <FiCopy />
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/60 text-xs mb-1">Card Holder</p>
            <p className="text-white text-sm font-semibold">{cardholderName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowCardDetailsModal;





