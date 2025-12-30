"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import CustomButton from "@/components/shared/Button";
import { useDecodeQrCode, useGetQrCode } from "@/api/wallet/wallet.queries";
import SpinnerLoader from "@/components/Loader/SpinnerLoader";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import { cn } from "@/utils/cn";

type Tab = "generate" | "scan";

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: Tab;
}

const QrCodeModal: React.FC<QrCodeModalProps> = ({ isOpen, onClose, defaultTab = "generate" }) => {
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [amount, setAmount] = useState("");
  const parsedAmount = useMemo(() => Number(amount) || 0, [amount]);

  const [scanValue, setScanValue] = useState("");
  const [decoded, setDecoded] = useState<any>(null);

  const { qrCode, isPending: qrPending, isError: qrError } = useGetQrCode({
    amount: parsedAmount,
    enabled: tab === "generate",
  });

  const onDecodeError = (error: any) => {
    const errorMessage = error?.response?.data?.message ?? "Something went wrong";
    ErrorToast({
      title: "Unable to decode QR",
      descriptions: Array.isArray(errorMessage) ? errorMessage : [errorMessage],
    });
  };

  const onDecodeSuccess = (data: any) => {
    const payload = data?.data?.data;
    setDecoded(payload || null);
    SuccessToast({
      title: "QR decoded",
      description: "QR code decoded successfully",
    });
  };

  const { mutate: decodeQr, isPending: decodePending } = useDecodeQrCode(onDecodeError, onDecodeSuccess);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={decodePending ? undefined : onClose} />

      <div
        className="relative w-full max-w-md bg-[#0A0A0A] rounded-2xl border border-gray-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-4 pb-4 border-b border-gray-800">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-white text-sm font-semibold">QR Code</p>
              <p className="text-gray-400 text-xs mt-1">
                Generate a QR code to receive funds or scan/decode a QR code.
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={decodePending}
              className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              aria-label="Close"
            >
              <IoClose className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2 p-1 rounded-full border border-gray-800 bg-[#141416]">
            {[
              { key: "generate", label: "Generate" },
              { key: "scan", label: "Scan" },
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key as Tab)}
                className={cn(
                  "flex-1 text-xs px-4 py-2 rounded-full transition-colors",
                  tab === (t.key as Tab) ? "bg-[#2C2C2E] text-white" : "text-gray-300 hover:bg-[#1C1C1E]"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 py-5">
          {tab === "generate" ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-gray-400 text-[11px]">Amount (NGN)</p>
                <input
                  value={amount}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^\\d*\\.?\\d*$/.test(v)) setAmount(v);
                  }}
                  placeholder="Enter amount"
                  className="w-full bg-[#141416] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none"
                  inputMode="decimal"
                />
              </div>

              <div className="w-full flex items-center justify-center rounded-xl border border-gray-800 bg-[#141416] p-4 min-h-[220px]">
                {parsedAmount <= 0 ? (
                  <p className="text-gray-400 text-sm">Enter an amount to generate QR</p>
                ) : qrPending ? (
                  <SpinnerLoader width={44} height={44} color="#FF6B2C" />
                ) : qrError || !qrCode ? (
                  <p className="text-gray-400 text-sm">Unable to generate QR code</p>
                ) : (
                  <Image src={qrCode} alt="QR Code" width={220} height={220} className="w-56 h-56" />
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setAmount("")}
                  className="flex-1 py-3 rounded-full bg-[#2C2C2E] text-white text-sm font-medium hover:bg-[#353539] transition-colors"
                >
                  Clear
                </button>
                <CustomButton
                  type="button"
                  disabled={!qrCode}
                  className="flex-1 py-3 border-2 border-primary text-black"
                  onClick={() => {
                    if (!qrCode) return;
                    navigator.clipboard.writeText(qrCode);
                    SuccessToast({ title: "Copied", description: "QR code copied to clipboard" });
                  }}
                >
                  Copy QR
                </CustomButton>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-gray-400 text-[11px]">QR Code (data url)</p>
                <textarea
                  value={scanValue}
                  onChange={(e) => setScanValue(e.target.value)}
                  placeholder='Paste a QR code string like "data:image/png;base64,..."'
                  rows={5}
                  className="w-full bg-[#141416] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none resize-none"
                />
              </div>

              <CustomButton
                type="button"
                isLoading={decodePending}
                disabled={!scanValue || decodePending}
                className="w-full py-3 border-2 border-primary text-black"
                onClick={() => decodeQr({ qrCode: scanValue })}
              >
                Decode QR
              </CustomButton>

              {decoded ? (
                <div className="rounded-xl border border-gray-800 bg-[#141416] p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-400 text-xs">Account Number</p>
                    <p className="text-white text-sm font-medium">{decoded.accountNumber || "-"}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-400 text-xs">Bank Code</p>
                    <p className="text-white text-sm font-medium">{decoded.bankCode || "-"}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-400 text-xs">Currency</p>
                    <p className="text-white text-sm font-medium">{decoded.currency || "-"}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-400 text-xs">Amount</p>
                    <p className="text-white text-sm font-medium">{decoded.amount || "-"}</p>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QrCodeModal;

















