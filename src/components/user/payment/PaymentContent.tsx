"use client";

import React, { useState } from "react";
import { IoWalletOutline, IoSettingsOutline } from "react-icons/io5";
import { RiBankLine } from "react-icons/ri";
import { MdStorefront } from "react-icons/md";
import { FiArrowRight } from "react-icons/fi";
import { HiOutlineReceiptRefund } from "react-icons/hi2";
import { IoQrCodeOutline } from "react-icons/io5";
import BillsPaymentContent from "@/components/user/bill/BillsPaymentContent";
import PaymentSettingModal from "@/components/modals/PaymentSettingModal";
import QRCodeModal from "@/components/modals/QrCodeModal";
import { useGetTransactions } from "@/api/wallet/wallet.queries";
import { useGetBeneficiaries } from "@/api/user/user.queries";
import {
  BENEFICIARY_TYPE,
  TRANSFER_TYPE,
  TRANSACTION_CATEGORY,
  Transaction,
} from "@/constants/types";
import TransactionItem from "@/components/user/dashboard/TransactionItem";
import TransferProcess from "@/components/user/sendMoney/TransferProcess";
import { cn } from "@/utils/cn";
import useUserStore from "@/store/user.store";
import SchedulePaymentsContent from "@/components/user/payment/SchedulePaymentsContent";


type TabKey = "transfer" | "bills" | "schedule";
type DestKey = "valarpay" | "bank" | "merchant";

type RightTab = "transactions" | "beneficiaries";

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
  const [rightTab, setRightTab] = useState<RightTab>("transactions");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [qrCodeModalOpen, setQrCodeModalOpen] = useState(false);
  const [transferProcessRef, setTransferProcessRef] = useState<{ fillBeneficiary: (beneficiary: any) => void } | null>(null);
  const { user } = useUserStore();
  const ngnBalance = (user?.wallet || []).find((w: any) => w.currency === "NGN")?.balance || 0;

  const pageSize = 8;
  const pageNumber = 1;
  const { transactionsData, isPending } = useGetTransactions({
    page: pageNumber,
    limit: pageSize,
    category: TRANSACTION_CATEGORY.TRANSFER,
  });

  const { beneficiaries } = useGetBeneficiaries({
    category: BENEFICIARY_TYPE.TRANSFER,
    transferType: dest === "bank" ? TRANSFER_TYPE.INTER : TRANSFER_TYPE.INTRA,
  });

  const hasTransactions =
    transactionsData?.transactions && transactionsData.transactions.length > 0;

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
    <div className="w-full h-full flex">
      <div className="w-full h-full bg-white dark:bg-bg-1100 rounded-xl shadow-sm px-4 sm:px-5 py-5 flex flex-col">
        <div className="flex items-center gap-2 mb-3 flex-nowrap">
          <button
            onClick={() => setRightTab("transactions")}
            className={cn(
              "w-1/2 px-3 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs border whitespace-nowrap",
              rightTab === "transactions"
                ? "bg-[#2C2C2E] border-gray-700 text-white"
                : "bg-transparent border-gray-800 text-gray-300 hover:bg-[#1C1C1E]"
            )}
          >
            Recent Transactions
          </button>
          <button
            onClick={() => setRightTab("beneficiaries")}
            className={cn(
              "w-1/2 px-3 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs border whitespace-nowrap",
              rightTab === "beneficiaries"
                ? "bg-[#2C2C2E] border-gray-700 text-white"
                : "bg-transparent border-gray-800 text-gray-300 hover:bg-[#1C1C1E]"
            )}
          >
            Saved Beneficiary
          </button>
        </div>

        {rightTab === "transactions" ? (
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white font-semibold">Recent Transactions</p>
            </div>
            <div className="flex-1 flex flex-col">
              {isPending ? (
                <div className="py-8 text-center text-gray-400 text-sm">Loading...</div>
              ) : !hasTransactions ? (
                <div className="py-10 text-center text-gray-400 text-sm flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-gray-800 flex items-center justify-center">
                    <HiOutlineReceiptRefund className="text-gray-400 text-2xl" />
                  </div>
                  <p>No transactions</p>
                </div>
              ) : (
                (transactionsData?.transactions || []).slice(0, 7).map((t: Transaction) => (
                  <TransactionItem key={t.id} transaction={t} />
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white font-semibold">Saved Beneficiary</p>
            </div>
            <div className="flex-1 flex flex-col divide-y divide-gray-800">
              {(beneficiaries || []).length === 0 ? (
                <div className="py-10 text-center text-gray-400 text-sm">No saved beneficiaries</div>
              ) : (
                (beneficiaries || []).slice(0, 8).map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      if (transferProcessRef?.fillBeneficiary) {
                        transferProcessRef.fillBeneficiary(b);
                      }
                    }}
                    className="w-full flex items-center justify-between gap-3 py-3 hover:bg-white/5 transition-colors rounded-lg px-2 -mx-2"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-full bg-[#10B981] flex items-center justify-center text-black font-bold flex-shrink-0">$
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-white text-sm font-medium truncate">{b.accountName || "Beneficiary"}</p>
                        <p className="text-gray-400 text-xs truncate">{b.accountNumber || b.billerNumber || ""}</p>
                      </div>
                    </div>
                    <FiArrowRight className="text-gray-500 flex-shrink-0" />
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
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
