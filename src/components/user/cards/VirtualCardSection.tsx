"use client";

import React, { useEffect, useMemo, useState } from "react";
import { IoEyeOutline, IoLockClosedOutline } from "react-icons/io5";
import { HiOutlineKey } from "react-icons/hi2";
import { MdOutlineEdit, MdBlock } from "react-icons/md";
import CustomButton from "@/components/shared/Button";
import GetVirtualCardModal from "@/components/modals/GetVirtualCardModal";
import VirtualCardDesign from "./card-designs/VirtualCardDesign";
import useUserStore from "@/store/user.store";
import {
  useFreezeVirtualCard,
  useGetWalletAccounts,
  useGetVirtualCardDetails,
  useUnfreezeVirtualCard,
} from "@/api/wallet/wallet.queries";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import ChangePinModal from "@/components/modals/ChangePinModal";
import ResetPinModal from "@/components/modals/ResetPinModal";
import SetSpendingLimitModal from "@/components/modals/SetSpendingLimitModal";
import BlockCardModal from "@/components/modals/BlockCardModal";
import { cn } from "@/utils/cn";

const VirtualCardSection = () => {
  const { user } = useUserStore();
  const [showDetails, setShowDetails] = useState(false);
  const [getCardOpen, setGetCardOpen] = useState(false);
  const [changePinOpen, setChangePinOpen] = useState(false);
  const [resetPinOpen, setResetPinOpen] = useState(false);
  const [spendingLimitOpen, setSpendingLimitOpen] = useState(false);
  const [blockCardOpen, setBlockCardOpen] = useState(false);

  const cardholderName = (user?.fullname || "CARD HOLDER").toUpperCase();

  const { accounts: walletAccounts } = useGetWalletAccounts();
  const usdWallet = useMemo(
    () => (walletAccounts || []).find((w) => w.currency === "USD"),
    [walletAccounts]
  );

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

  const hasCard = !!card;
  const cardNumber = card?.cardNumber || "----";
  const expiryDate = card ? `${card.expiryMonth}/${card.expiryYear}` : "--/--";
  const cvv = card?.cvv || "---";
  const isFrozen = (card?.status || "").toLowerCase() === "frozen";

  const onFreezeError = (error: any) => {
    const msg = error?.response?.data?.message ?? "Unable to update card";
    ErrorToast({
      title: "Card update failed",
      descriptions: Array.isArray(msg) ? msg : [msg],
    });
  };

  const onFreezeSuccess = (data: any) => {
    const msg = data?.data?.message ?? "Card updated";
    SuccessToast({ title: "Success", description: msg });
  };

  const { mutate: freezeCard, isPending: freezePending } = useFreezeVirtualCard(onFreezeError, onFreezeSuccess);
  const { mutate: unfreezeCard, isPending: unfreezePending } = useUnfreezeVirtualCard(onFreezeError, onFreezeSuccess);
  const freezeLoading = freezePending || unfreezePending;

  if (!hasCard) {
    const canCreateUsdCard = !!usdWallet?.id;

    return (
      <>
        <div className="w-full flex flex-col items-center justify-center py-16 px-4">
          <div className="w-full max-w-lg flex flex-col items-center gap-6">
            <div className="w-40 h-40 flex items-center justify-center">
              <svg
                className="w-full h-full"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="30"
                  y="60"
                  width="140"
                  height="90"
                  rx="8"
                  fill="#3C3C3E"
                  stroke="#5C5C5E"
                  strokeWidth="2"
                />
                <rect x="45" y="75" width="30" height="25" rx="4" fill="#6C6C6E" />
                <line
                  x1="85"
                  y1="82"
                  x2="155"
                  y2="82"
                  stroke="#6C6C6E"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <line
                  x1="85"
                  y1="93"
                  x2="130"
                  y2="93"
                  stroke="#6C6C6E"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="100" r="50" stroke="#FF6B2C" strokeWidth="3" opacity="0.3" />
                <line
                  x1="75"
                  y1="100"
                  x2="125"
                  y2="100"
                  stroke="#FF6B2C"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.5"
                />
                <line
                  x1="100"
                  y1="75"
                  x2="100"
                  y2="125"
                  stroke="#FF6B2C"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.5"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-white text-lg font-medium mb-2">
                You currently do not have any virtual card.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-gray-800">
                <span className="text-gray-200 text-[11px] font-medium">USD only</span>
                <span className="text-gray-500 text-[11px]">•</span>
                <span className="text-gray-400 text-[11px]">Other currencies coming soon</span>
              </div>
            </div>
            {canCreateUsdCard ? (
              <CustomButton onClick={() => setGetCardOpen(true)} className="px-8 py-3 text-base">
                Create USD Virtual Card
              </CustomButton>
            ) : (
              <div className="w-full flex flex-col items-center gap-3">
                <p className="text-gray-400 text-sm text-center max-w-md">
                  You must have a <span className="text-white font-medium">USD account</span> before you can create a USD
                  virtual card.
                </p>
                <CustomButton
                  onClick={() => {
                    ErrorToast({
                      title: "USD account required",
                      descriptions: ["Go to Accounts and create a USD wallet to continue."],
                    });
                  }}
                  className="px-8 py-3 text-base"
                >
                  Create USD Account (from Accounts)
                </CustomButton>
              </div>
            )}
          </div>
        </div>
        <GetVirtualCardModal
          isOpen={getCardOpen}
          onClose={() => setGetCardOpen(false)}
          onSuccess={() => {
            setGetCardOpen(false);
            if (typeof window !== "undefined") {
              setStoredCardId(localStorage.getItem("usdVirtualCardId") || "");
            }
          }}
          walletId={usdWallet?.id || ""}
          cardholderName={user?.fullname || "Card Holder"}
        />
      </>
    );
  }

  return (
    <>
      <div className="w-full flex flex-col gap-6">
        <div className="w-full flex items-center justify-center px-4">
          <div className="w-full max-w-[560px]">
          <VirtualCardDesign
            cardNumber={cardNumber}
            cardholderName={cardholderName}
            expiryDate={expiryDate}
            cvv={cvv}
            showDetails={showDetails}
          />
          </div>
        </div>

        <div className="w-full flex items-center justify-center gap-4 flex-wrap px-4">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#2C2C2E] border border-gray-700 text-white text-sm hover:bg-[#3C3C3E] transition-colors min-w-[220px]"
          >
            <IoEyeOutline className="text-lg" />
            {showDetails ? "Hide Details" : "Show Details"}
          </button>

          <button
            disabled={freezeLoading}
            onClick={() => {
              if (!storedCardId) return;
              if (isFrozen) {
                unfreezeCard({ cardId: storedCardId, provider: "graph" });
              } else {
                freezeCard({ cardId: storedCardId, provider: "graph" });
              }
            }}
            className={cn(
              "flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#2C2C2E] border border-gray-700 text-white text-sm hover:bg-[#3C3C3E] transition-colors min-w-[220px]",
              freezeLoading && "opacity-60 cursor-not-allowed"
            )}
          >
            <IoLockClosedOutline className="text-lg" />
            {isFrozen ? "Un-freeze Card" : "Freeze Card"}
          </button>
        </div>

        <div className="w-full max-w-[560px] mx-auto bg-[#0A0A0A] rounded-2xl border border-gray-800 overflow-hidden">
          <div className="px-5 py-4">
            <h3 className="text-white text-base font-semibold">Manage Card</h3>
          </div>

          <div className="border-t border-gray-800">
            <button
              onClick={() => setChangePinOpen(true)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors"
            >
              <span className="text-white text-sm">Change Pin</span>
              <span className="w-9 h-9 rounded-lg bg-[#1C1C1E] border border-gray-800 flex items-center justify-center">
                <MdOutlineEdit className="text-lg text-gray-300" />
              </span>
            </button>
            <div className="h-px bg-gray-800" />
            <button
              onClick={() => setResetPinOpen(true)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors"
            >
              <span className="text-white text-sm">Reset Pin</span>
              <span className="w-9 h-9 rounded-lg bg-[#1C1C1E] border border-gray-800 flex items-center justify-center">
                <HiOutlineKey className="text-lg text-gray-300" />
              </span>
            </button>
            <div className="h-px bg-gray-800" />
            <button
              onClick={() => setSpendingLimitOpen(true)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors"
            >
              <span className="text-white text-sm">Set Spending Limit</span>
              <span className="w-9 h-9 rounded-lg bg-[#1C1C1E] border border-gray-800 flex items-center justify-center">
                <MdOutlineEdit className="text-lg text-gray-300" />
              </span>
            </button>
            <div className="h-px bg-gray-800" />
            <button
              onClick={() => setBlockCardOpen(true)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors"
            >
              <span className="text-red-500 text-sm">Block Card</span>
              <span className="w-9 h-9 rounded-lg bg-[#1C1C1E] border border-gray-800 flex items-center justify-center">
                <MdBlock className="text-lg text-red-500" />
              </span>
            </button>
          </div>
        </div>
      </div>

      <ChangePinModal isOpen={changePinOpen} onClose={() => setChangePinOpen(false)} />
      <ResetPinModal isOpen={resetPinOpen} onClose={() => setResetPinOpen(false)} />
      <SetSpendingLimitModal isOpen={spendingLimitOpen} onClose={() => setSpendingLimitOpen(false)} />
      <BlockCardModal isOpen={blockCardOpen} onClose={() => setBlockCardOpen(false)} />
    </>
  );
};

export default VirtualCardSection;
