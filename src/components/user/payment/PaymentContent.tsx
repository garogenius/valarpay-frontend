"use client";

import React, { useState } from "react";
import { IoWalletOutline, IoSettingsOutline } from "react-icons/io5";
import { RiBankLine } from "react-icons/ri";
import { MdStorefront } from "react-icons/md";
import { FiArrowRight, FiClock, FiUser } from "react-icons/fi";
import { HiOutlineReceiptRefund } from "react-icons/hi2";
import { IoQrCodeOutline } from "react-icons/io5";
import BillsPaymentContent from "@/components/user/bill/BillsPaymentContent";
import PaymentSettingModal from "@/components/modals/PaymentSettingModal";
import QRCodeModal from "@/components/modals/QrCodeModal";
import { useGetTransactions } from "@/api/wallet/wallet.queries";
import { useGetCurrencyAccountTransactions } from "@/api/currency/currency.queries";
import { useGetBeneficiaries } from "@/api/user/user.queries";
import {
  BENEFICIARY_TYPE,
  TRANSFER_TYPE,
  TRANSACTION_CATEGORY,
  Transaction,
} from "@/constants/types";
import TransferProcess from "@/components/user/sendMoney/TransferProcess";
import { cn } from "@/utils/cn";
import useUserStore from "@/store/user.store";
import SchedulePaymentsContent from "@/components/user/payment/SchedulePaymentsContent";
import usePaymentSettingsStore from "@/store/paymentSettings.store";
import useGlobalModalsStore from "@/store/globalModals.store";
import CustomButton from "@/components/shared/Button";
import { format } from "date-fns";


type TabKey = "transfer" | "bills" | "schedule";
type DestKey = "valarpay" | "bank" | "merchant";

type RightTab = "recent" | "saved";

const destCards: { key: DestKey; title: string; description: string; icon: any }[] = [
  {
    key: "valarpay",
    title: "To ValarPay",
    description: "Send money instantly and free to ValarPay users",
    icon: IoWalletOutline,
  },
  {
    key: "bank",
    title: "To Banks",
    description: "Send money securely to any bank account",
    icon: RiBankLine,
  },
  {
    key: "merchant",
    title: "To Merchant",
    description: "Pay merchants easily with your ValarPay account",
    icon: MdStorefront,
  },
];

const PaymentContent = () => {
  const [active, setActive] = useState<TabKey>("transfer");
  const [dest, setDest] = useState<DestKey>("valarpay");
  const [rightTab, setRightTab] = useState<RightTab>("recent");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [qrCodeModalOpen, setQrCodeModalOpen] = useState(false);
  const [transferProcessRef, setTransferProcessRef] = useState<{ fillBeneficiary: (beneficiary: any) => void } | null>(null);
  const { user } = useUserStore();
  const { selectedCurrency } = usePaymentSettingsStore();
  const { showTransactionHistoryModal } = useGlobalModalsStore();
  const ngnBalance = (user?.wallet || []).find((w: any) => w.currency === "NGN")?.balance || 0;

  const pageSize = 8;
  const pageNumber = 1;
  
  // For NGN, use wallet transactions API; for other currencies, use currency account transactions API
  const { transactionsData: ngnTransactionsData, isPending: ngnTransactionsLoading } = useGetTransactions({
    page: pageNumber,
    limit: pageSize,
    category: TRANSACTION_CATEGORY.TRANSFER,
  });
  
  const { transactions: currencyTransactions, isPending: currencyTransactionsLoading } = useGetCurrencyAccountTransactions(
    selectedCurrency !== "NGN" ? selectedCurrency : "",
    { limit: pageSize, offset: 0 }
  );
  
  // Determine which transactions to use based on selected currency
  const transactions = selectedCurrency === "NGN" 
    ? (ngnTransactionsData?.transactions || [])
    : (currencyTransactions || []);
  const transactionsLoading = selectedCurrency === "NGN"
    ? ngnTransactionsLoading
    : currencyTransactionsLoading;

  const { beneficiaries } = useGetBeneficiaries({
    category: BENEFICIARY_TYPE.TRANSFER,
    transferType: dest === "bank" ? TRANSFER_TYPE.INTER : TRANSFER_TYPE.INTRA,
  });

  const hasTransactions = transactions && transactions.length > 0;

  const handleViewReceipt = (tx: any) => {
    showTransactionHistoryModal(tx);
  };

  const renderDestCards = () => (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {destCards.map((c) => {
        const Icon = c.icon;
        const isActive = dest === c.key;
        return (
          <button
            key={c.key}
            onClick={() => setDest(c.key)}
            className={cn(
              "w-full rounded-xl border p-2.5 sm:p-4 transition-colors",
              "bg-[#1C1C1E] border-gray-800 hover:bg-[#242426]",
              isActive && "ring-1 ring-[#FF6B2C] border-[#FF6B2C]"
            )}
          >
            <div className="flex flex-col items-center text-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center",
                  isActive ? "bg-[#FF6B2C]" : "bg-[#2C2C2E]"
                )}
              >
                <Icon className="text-white text-base sm:text-lg" />
              </div>
              <p className="text-white font-medium text-[11px] sm:text-sm">{c.title}</p>
              <p className="text-gray-400 text-[9px] sm:text-xs leading-tight sm:leading-snug">
                {c.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );

  const renderRightPanel = () => (
    <div className="rounded-2xl border border-border-800 dark:border-border-700 bg-bg-600 dark:bg-bg-1100 p-4">
      <div className="flex items-center gap-6 border-b border-white/10 mb-3">
        <button
          className={`py-2 text-sm font-medium transition-colors ${
            rightTab === "recent" ? "text-[#f76301] border-b-2 border-[#f76301]" : "text-white/60 hover:text-white"
          }`}
          onClick={() => setRightTab("recent")}
        >
          Recent Transactions
        </button>
        <button
          className={`py-2 text-sm font-medium transition-colors ${
            rightTab === "saved" ? "text-[#f76301] border-b-2 border-[#f76301]" : "text-white/60 hover:text-white"
          }`}
          onClick={() => setRightTab("saved")}
        >
          Saved Beneficiary
        </button>
      </div>
      
      {rightTab === "saved" ? (
        beneficiaries && beneficiaries.length > 0 ? (
          <div className="w-full flex flex-col divide-y divide-white/5 rounded-lg overflow-hidden">
            {beneficiaries.slice(0, 6).map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  if (transferProcessRef?.fillBeneficiary) {
                    transferProcessRef.fillBeneficiary(b);
                  }
                }}
                className="w-full flex items-center justify-between gap-3 px-2 py-3 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-green-500/20 grid place-items-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M4 21v-2a4 4 0 0 1 3-3.87"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div className="flex flex-col text-left">
                    <p className="text-white text-sm font-medium leading-tight">{b.accountName || "Beneficiary"}</p>
                    <p className="text-white/70 text-xs leading-tight">{b.accountNumber || b.billerNumber || ""}</p>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 text-white/60">
                  <path fill="currentColor" d="M9.29 6.71a1 1 0 0 0 0 1.41L13.17 12l-3.88 3.88a1 1 0 1 0 1.42 1.41l4.59-4.58a1 1 0 0 0 0-1.41L10.71 6.7a1 1 0 0 0-1.42.01Z"/>
                </svg>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <FiUser className="text-3xl text-white/40" />
            </div>
            <div className="text-center">
              <p className="text-white/80 text-sm font-medium mb-1">No Saved Beneficiaries</p>
              <p className="text-white/60 text-xs">Your saved beneficiaries will appear here</p>
            </div>
          </div>
        )
      ) : (
        transactionsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-[#f76301] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : transactions && transactions.length > 0 ? (
          <div className="flex flex-col divide-y divide-white/10">
            {transactions.slice(0, 8).map((tx) => {
              // Get recipient name and account number for transfers
              const getTransactionLabel = () => {
                if (tx.category === "TRANSFER" && tx.transferDetails) {
                  const beneficiaryName = tx.transferDetails?.beneficiaryName || "Unknown";
                  const accountNumber = tx.transferDetails?.beneficiaryAccountNumber || "";
                  if (accountNumber) {
                    return `${beneficiaryName} ${accountNumber}`;
                  }
                  return beneficiaryName;
                }
                // For other transaction types, use description or fallback
                return tx.description || "Transaction";
              };

              return (
                <div key={tx.id} className="flex items-center justify-between py-3 hover:bg-white/5 rounded px-2 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#f76301]/20 grid place-items-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f76301" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M4 21v-2a4 4 0 0 1 3-3.87"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{getTransactionLabel()}</p>
                      <p className="text-white/50 text-xs">
                        {format(new Date(('created_at' in tx ? tx.created_at : tx.createdAt) || Date.now()), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleViewReceipt(tx)}
                      className="text-[#f76301] hover:text-[#e55a00] font-medium text-sm transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <FiClock className="text-3xl text-white/40" />
            </div>
            <div className="text-center">
              <p className="text-white/80 text-sm font-medium mb-1">No Recent Transactions</p>
              <p className="text-white/60 text-xs">Your recent transactions will appear here</p>
            </div>
          </div>
        )
      )}
    </div>
  );

  const renderTransferContent = () => (
    <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
      <div className="w-full h-full flex flex-col gap-6 sm:gap-4">
        {renderDestCards()}
        <div className="pt-2 sm:pt-0 px-4 sm:px-0">
          <TransferProcess
            fixedType={dest === "bank" ? "bank" : "valarpay"}
            hideMethodSelector
            initialActionLabel="Pay"
            showAvailableBalance
            quickAmounts={[1000, 5000, 10000, 20000]}
            availableBalance={ngnBalance}
            compactBeneficiaryRow
            onRef={(ref) => setTransferProcessRef(ref)}
          />
        </div>
      </div>
      {renderRightPanel()}
    </div>
  );

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Header (no card wrapper) */}
      <div className="w-full flex items-center gap-2 sm:gap-3 justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-white text-base sm:text-xl lg:text-2xl font-semibold truncate">Payments</h1>
          <p className="text-gray-400 text-[10px] sm:text-xs lg:text-sm mt-0.5 sm:mt-1 line-clamp-1">Pay bills securely, and manage scheduled payments easily</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQrCodeModalOpen(true)}
            className="flex-shrink-0 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-[#1C1C1E] border border-gray-800 text-white text-[10px] sm:text-xs hover:bg-[#2C2C2E] whitespace-nowrap"
          >
            <IoQrCodeOutline className="text-xs sm:text-base" />
            <span className="hidden xs:inline">QR Code</span>
          </button>
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex-shrink-0 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-[#1C1C1E] border border-gray-800 text-white text-[10px] sm:text-xs hover:bg-[#2C2C2E] whitespace-nowrap"
          >
            <IoSettingsOutline className="text-xs sm:text-base" />
            <span className="hidden xs:inline">Settings</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full">
        <div className="flex items-center gap-2 p-1 rounded-full border border-gray-800 bg-[#1C1C1E] w-full">
          {[
            { key: "transfer", label: "Transfer" },
            { key: "bills", label: "Pay Bills" },
            { key: "schedule", label: "Schedule Payments" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key as TabKey)}
              className={cn(
                "flex-1 text-[11px] sm:text-xs px-3 sm:px-4 py-2 rounded-full",
                active === (t.key as TabKey)
                  ? "bg-[#2C2C2E] text-white"
                  : "text-gray-300 hover:bg-[#1C1C1E]"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {active === "transfer" && renderTransferContent()}
      {active === "bills" && (
        <div className="w-full">
          <BillsPaymentContent />
        </div>
      )}
      {active === "schedule" && (
        <div className="w-full relative">
          {/* Schedule Payments (Coming Soon overlay) */}
          <div className="pointer-events-none opacity-60">
            <SchedulePaymentsContent />
          </div>

          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-auto">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-2xl" />
            <div className="relative z-20 px-5 py-4 rounded-2xl bg-[#0A0A0A] border border-gray-800 text-center shadow-2xl max-w-sm w-[92%]">
              <p className="text-white text-sm font-semibold">Coming Soon</p>
              <p className="text-gray-400 text-xs mt-1">
                Scheduled payments will be available shortly.
              </p>
            </div>
          </div>
        </div>
      )}

      <PaymentSettingModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <QRCodeModal isOpen={qrCodeModalOpen} onClose={() => setQrCodeModalOpen(false)} />
    </div>
  );
};

export default PaymentContent;
