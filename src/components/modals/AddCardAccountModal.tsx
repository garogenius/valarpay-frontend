"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { BankProps } from "@/constants/types";
import SearchableDropdown from "@/components/shared/SearchableDropdown";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import ErrorToast from "@/components/toast/ErrorToast";
import { useVerifyAccount } from "@/api/wallet/wallet.queries";
import SpinnerLoader from "@/components/Loader/SpinnerLoader";
import { FiCheckCircle } from "react-icons/fi";

type LinkTab = "card" | "account";

export type LinkedCard = {
  id: string;
  type: "card";
  label: string; // masked
};

export type LinkedBankAccount = {
  id: string;
  type: "account";
  label: string; // bank + masked
  bankName: string;
  accountNumber: string;
  bankCode: string;
  accountName?: string;
};

export type LinkedInstrument = LinkedCard | LinkedBankAccount;

function maskCard(cardNumber: string) {
  const digits = cardNumber.replace(/\D/g, "");
  if (digits.length < 4) return "****";
  return `**** **** **** ${digits.slice(-4)}`;
}

function maskAccount(acct: string) {
  const digits = acct.replace(/\D/g, "");
  if (digits.length < 4) return "****";
  return `******${digits.slice(-4)}`;
}

interface AddCardAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  banks: BankProps[];
  onAdd: (instrument: LinkedInstrument) => void;
}

const AddCardAccountModal: React.FC<AddCardAccountModalProps> = ({
  isOpen,
  onClose,
  banks,
  onAdd,
}) => {
  const [tab, setTab] = useState<LinkTab>("card");

  // Card fields
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardPin, setCardPin] = useState("");

  // Account fields
  const [bankDropdownOpen, setBankDropdownOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<BankProps | null>(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [verifiedAccountName, setVerifiedAccountName] = useState<string>("");
  const lastVerifyKeyRef = useRef<string>("");

  const dropdownRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(dropdownRef, () => setBankDropdownOpen(false));

  const canSubmit = useMemo(() => {
    if (tab === "card") {
      return (
        cardNumber.replace(/\D/g, "").length >= 12 &&
        expiry.length >= 4 &&
        cvv.length === 3 &&
        cardPin.length === 4
      );
    }
    return !!selectedBank && accountNumber.length === 10 && !!verifiedAccountName;
  }, [tab, cardNumber, expiry, cvv, cardPin, selectedBank, accountNumber, verifiedAccountName]);

  const onVerifyError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage) ? errorMessage : [errorMessage || "Unable to verify account"];
    setVerifiedAccountName("");
    ErrorToast({
      title: "Account verification failed",
      descriptions,
    });
  };

  const onVerifySuccess = (data: any) => {
    const name = data?.data?.data?.accountName;
    setVerifiedAccountName(name || "");
  };

  const {
    mutate: verifyAccount,
    isPending: verifyPending,
    isError: verifyError,
  } = useVerifyAccount(onVerifyError, onVerifySuccess);

  const verifyLoading = verifyPending && !verifyError;

  // Trigger verification when bank + 10-digit account are present
  useEffect(() => {
    if (tab !== "account") return;
    if (!selectedBank?.bankCode) return;
    if (accountNumber.length !== 10) {
      setVerifiedAccountName("");
      lastVerifyKeyRef.current = "";
      return;
    }

    const verifyKey = `${selectedBank.bankCode}:${accountNumber}`;
    if (verifyKey === lastVerifyKeyRef.current) return;
    lastVerifyKeyRef.current = verifyKey;

    verifyAccount({ accountNumber, bankCode: String(selectedBank.bankCode) });
  }, [tab, selectedBank?.bankCode, accountNumber, verifyAccount]);

  const reset = () => {
    setCardNumber("");
    setExpiry("");
    setCvv("");
    setCardPin("");
    setSelectedBank(null);
    setAccountNumber("");
    setVerifiedAccountName("");
    lastVerifyKeyRef.current = "";
    setBankDropdownOpen(false);
    setTab("card");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleNext = () => {
    if (!canSubmit) {
      ErrorToast({
        title: "Incomplete details",
        descriptions: ["Please complete the required fields to continue."],
      });
      return;
    }

    const id = `${Date.now()}`;
    if (tab === "card") {
      onAdd({ id, type: "card", label: maskCard(cardNumber) });
    } else if (selectedBank) {
      onAdd({
        id,
        type: "account",
        label: `${selectedBank.name} • ${maskAccount(accountNumber)}`,
        bankName: selectedBank.name,
        bankCode: String(selectedBank.bankCode),
        accountNumber,
        accountName: verifiedAccountName || undefined,
      });
    }

    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md bg-[#0A0A0A] rounded-2xl border border-gray-800 shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 pt-4 pb-3">
              <div className="flex items-center justify-between">
                <p className="text-white text-sm font-semibold">Add Money</p>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <IoClose className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="mt-3 flex items-center justify-between text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setTab("card")}
                  className={tab === "card" ? "text-white" : "text-gray-400"}
                >
                  Bank Card
                </button>
                <button
                  type="button"
                  onClick={() => setTab("account")}
                  className={tab === "account" ? "text-white" : "text-gray-400"}
                >
                  Bank Account
                </button>
              </div>

              <div className="mt-2 flex">
                <div className={`h-[2px] w-1/2 ${tab === "card" ? "bg-[#FF6B2C]" : "bg-gray-800"}`} />
                <div className={`h-[2px] w-1/2 ${tab === "account" ? "bg-[#FF6B2C]" : "bg-gray-800"}`} />
              </div>

              <div className="mt-3 rounded-md bg-[#141416] border border-gray-800 px-3 py-2">
                <p className="text-[10px] text-gray-300">
                  Make sure the {tab === "card" ? "card" : "account"} you are adding is linked to your BVN
                </p>
              </div>
            </div>

            <div className="px-5 pb-5">
              {tab === "card" ? (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] text-gray-400">Card Number</label>
                    <input
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 19))
                      }
                      className="w-full bg-[#141416] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none"
                      placeholder="0000 0000 0000 0000"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] text-gray-400">Expiry Date</label>
                      <input
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value.slice(0, 5))}
                        className="w-full bg-[#141416] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] text-gray-400">CVV</label>
                      <input
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                        className="w-full bg-[#141416] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none"
                        placeholder="000"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] text-gray-400">Card Pin</label>
                    <input
                      value={cardPin}
                      onChange={(e) => setCardPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      className="w-full bg-[#141416] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none"
                      placeholder="••••"
                      type="password"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div ref={dropdownRef} className="relative w-full flex flex-col gap-1">
                    <label className="text-[11px] text-gray-400">Select Banks</label>
                    <button
                      type="button"
                      onClick={() => setBankDropdownOpen((s) => !s)}
                      className="w-full flex items-center justify-between bg-[#141416] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white"
                    >
                      <span className="truncate">{selectedBank?.name || "Select Bank"}</span>
                      <span className="text-gray-400">▾</span>
                    </button>
                    {bankDropdownOpen && (
                      <div className="absolute top-full mt-2 w-full bg-[#0A0A0A] border border-gray-800 rounded-lg shadow-xl z-10 max-h-60 overflow-y-auto">
                        <SearchableDropdown
                          items={banks || []}
                          searchKey="name"
                          displayFormat={(b: BankProps) => (
                            <div className="flex flex-col">
                              <p className="text-sm font-medium text-white">{b.name}</p>
                            </div>
                          )}
                          onSelect={(b: BankProps) => {
                            setSelectedBank(b);
                            setVerifiedAccountName("");
                            lastVerifyKeyRef.current = "";
                            setBankDropdownOpen(false);
                          }}
                          placeholder="Search bank..."
                          isOpen={bankDropdownOpen}
                          onClose={() => setBankDropdownOpen(false)}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] text-gray-400">Account Number</label>
                    <div className="w-full flex items-center bg-[#141416] border border-gray-800 rounded-lg px-4 py-3">
                      <input
                        value={accountNumber}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, "").slice(0, 10);
                          setAccountNumber(v);
                          setVerifiedAccountName("");
                          lastVerifyKeyRef.current = "";
                        }}
                        className="w-full bg-transparent border-none outline-none text-sm text-white placeholder:text-gray-600"
                        placeholder="0000000000"
                      />
                      {verifyLoading && accountNumber.length === 10 ? (
                        <SpinnerLoader width={18} height={18} color="#FF6B2C" />
                      ) : null}
                    </div>
                  </div>

                  {/* Verified name badge */}
                  {verifiedAccountName ? (
                    <div className="w-full flex items-center gap-2 rounded-lg px-3 py-3 bg-green-500/20 border border-green-700/40">
                      <FiCheckCircle className="text-green-500 text-lg flex-shrink-0" />
                      <p className="text-white text-sm font-medium">{verifiedAccountName}</p>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 pb-5">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 rounded-full bg-[#2C2C2E] text-white hover:bg-[#353539] transition-colors font-medium"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canSubmit}
                  className="flex-1 px-4 py-3 rounded-full bg-[#FF6B2C] text-white font-semibold hover:bg-[#FF7A3D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddCardAccountModal;


