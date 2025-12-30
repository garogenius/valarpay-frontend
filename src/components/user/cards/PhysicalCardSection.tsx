"use client";

import React, { useState } from "react";
import { IoEyeOutline, IoLockClosedOutline } from "react-icons/io5";
import { HiOutlineKey } from "react-icons/hi2";
import { MdOutlineEdit, MdBlock } from "react-icons/md";
import CustomButton from "@/components/shared/Button";
import ChangePinModal from "@/components/modals/ChangePinModal";
import ResetPinModal from "@/components/modals/ResetPinModal";
import SetSpendingLimitModal from "@/components/modals/SetSpendingLimitModal";
import BlockCardModal from "@/components/modals/BlockCardModal";
import GetPhysicalCardModal from "@/components/modals/GetPhysicalCardModal";
import PhysicalCardDesign from "./card-designs/PhysicalCardDesign";
import useUserStore from "@/store/user.store";

const PhysicalCardSection = () => {
  const { user } = useUserStore();
  const [hasCard, setHasCard] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [changePinOpen, setChangePinOpen] = useState(false);
  const [resetPinOpen, setResetPinOpen] = useState(false);
  const [spendingLimitOpen, setSpendingLimitOpen] = useState(false);
  const [blockCardOpen, setBlockCardOpen] = useState(false);
  const [getCardOpen, setGetCardOpen] = useState(false);

  const cardNumber = "5399 8342 7156 4242";
  const cardholderName = user?.fullname?.toUpperCase() || "CARD HOLDER";
  const expiryDate = "12/28";
  const cvv = "123";

  if (!hasCard) {
    return (
      <>
        <div className="relative w-full flex flex-col items-center justify-center py-16 px-4">
          {/* Coming soon overlay */}
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-xl" />
            <div className="relative z-20 px-4 py-3 rounded-2xl bg-[#0A0A0A] border border-gray-800 text-center shadow-2xl">
              <p className="text-white text-sm font-semibold">Coming Soon</p>
              <p className="text-gray-400 text-xs mt-1">Physical cards are not available yet.</p>
            </div>
          </div>
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
                You currently do not have any physical card linked to this account.
              </p>
            </div>
            <CustomButton
              onClick={() => setGetCardOpen(true)}
              className="px-8 py-3 text-base"
              disabled
            >
              Create Physical Card
            </CustomButton>
          </div>
        </div>
        <GetPhysicalCardModal
          isOpen={getCardOpen}
          onClose={() => setGetCardOpen(false)}
          onSuccess={() => {
            setHasCard(true);
            setGetCardOpen(false);
          }}
        />
      </>
    );
  }

  return (
    <>
      <div className="w-full flex flex-col gap-6">
        <div className="w-full flex items-center justify-center px-4">
          <div className="w-full max-w-[420px]">
            <PhysicalCardDesign
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2C2C2E] border border-gray-700 text-white text-sm hover:bg-[#3C3C3E] transition-colors"
          >
            <IoEyeOutline className="text-lg" />
            {showDetails ? "Hide Details" : "Show Details"}
          </button>
          {isActivated ? (
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2C2C2E] border border-gray-700 text-white text-sm hover:bg-[#3C3C3E] transition-colors">
              <IoLockClosedOutline className="text-lg" />
              Freeze Card
            </button>
          ) : (
            <CustomButton
              onClick={() => setIsActivated(true)}
              className="flex items-center gap-2 px-5 py-2.5 text-sm"
            >
              <IoLockClosedOutline className="text-lg" />
              Activate Card
            </CustomButton>
          )}
        </div>

        <div className="w-full bg-[#1C1C1E] rounded-2xl border border-gray-800 p-6">
          <h3 className="text-white text-base font-semibold mb-4">Manage Card</h3>
          <div className="rounded-2xl border border-gray-800 bg-[#0A0A0A] overflow-hidden">
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

export default PhysicalCardSection;
