"use client";

import React from "react";
import { AiOutlineInsurance, AiOutlineThunderbolt } from "react-icons/ai";
import { BiCameraMovie } from "react-icons/bi";
import { CiShop } from "react-icons/ci";
import { IoBusOutline, IoSchoolOutline } from "react-icons/io5";
import { LiaRedoAltSolid } from "react-icons/lia";
import { LuShieldPlus, LuTv } from "react-icons/lu";
import { MdCardGiftcard } from "react-icons/md";
import { RiGovernmentLine } from "react-icons/ri";
import { SlPlane, SlTrophy } from "react-icons/sl";
import BillsHubModal, { BillModalKey } from "@/components/modals/bills/BillsHubModal";
import { LuPhoneOutgoing } from "react-icons/lu";
import { BsPhone } from "react-icons/bs";
import { TbWorldUp, TbWorldPin } from "react-icons/tb";
import ComingSoonModal from "@/components/modals/ComingSoonModal";

type Tile = {
  label: string;
  icon: any;
  modal?: BillModalKey;
  comingSoonTitle?: string;
};

type Section = {
  title: string;
  gridClass: string;
  tiles: Tile[];
};

const responsiveGrid = (base: string) => {
  // Keep screenshot-like density: small tiles on mobile, slightly bigger spacing on desktop
  if (base === "grid-cols-4") return "grid-cols-4 sm:grid-cols-4";
  if (base === "grid-cols-3") return "grid-cols-3 sm:grid-cols-3";
  if (base === "grid-cols-2") return "grid-cols-2 sm:grid-cols-2";
  return base;
};

const SECTIONS: Section[] = [
  {
    title: "Mobile & Connectivity",
    gridClass: "grid-cols-4",
    tiles: [
      { label: "Airtime", icon: LuPhoneOutgoing, modal: "airtime" },
      { label: "Mobile Data", icon: BsPhone, modal: "mobile_data" },
      { label: "International Airtime", icon: TbWorldUp, modal: "intl_airtime" },
      { label: "Internet", icon: TbWorldPin, modal: "internet" },
    ],
  },
  {
    title: "Utilities",
    gridClass: "grid-cols-3",
    tiles: [
      { label: "Electricity", icon: AiOutlineThunderbolt, modal: "electricity" },
      { label: "Cable TV", icon: LuTv, modal: "cable" },
      { label: "Pay Water", icon: RiGovernmentLine, comingSoonTitle: "Pay Water" },
    ],
  },
  {
    title: "Payments",
    gridClass: "grid-cols-3",
    tiles: [
      { label: "Pay Tax", icon: RiGovernmentLine, comingSoonTitle: "Pay Tax" },
      { label: "TSA & States", icon: RiGovernmentLine, comingSoonTitle: "TSA & States" },
      { label: "Government Fee", icon: RiGovernmentLine, comingSoonTitle: "Government Fee" },
    ],
  },
  {
    title: "Entertainment & Travel",
    gridClass: "grid-cols-4",
    tiles: [
      { label: "Movie Tickets", icon: BiCameraMovie, comingSoonTitle: "Movie Tickets" },
      { label: "Flight", icon: SlPlane, comingSoonTitle: "Flight" },
      { label: "Bus Tickets", icon: IoBusOutline, comingSoonTitle: "Bus Tickets" },
      { label: "Hotel", icon: LuShieldPlus, comingSoonTitle: "Hotel" },
    ],
  },
  {
    title: "Betting & Currency",
    gridClass: "grid-cols-4",
    tiles: [
      { label: "Betting", icon: SlTrophy, modal: "betting" },
      { label: "Convert Currency", icon: LiaRedoAltSolid, modal: "convert" },
      { label: "Sell GiftCards", icon: MdCardGiftcard, modal: "giftcard_redeem" },
      { label: "Buy GiftCards", icon: MdCardGiftcard, modal: "giftcard_buy" },
    ],
  },
  {
    title: "Health & Lifestyle",
    gridClass: "grid-cols-3",
    tiles: [
      { label: "Health", icon: LuShieldPlus, comingSoonTitle: "Health" },
      { label: "Insurance", icon: AiOutlineInsurance, comingSoonTitle: "Insurance" },
      { label: "Shopping", icon: CiShop, comingSoonTitle: "Shopping" },
    ],
  },
  {
    title: "School",
    gridClass: "grid-cols-2",
    tiles: [
      { label: "Education", icon: IoSchoolOutline, modal: "education" },
      { label: "Jamb & Waec", icon: IoSchoolOutline, modal: "education" },
    ],
  },
];

const BillsPaymentContent = () => {
  const [billModalOpen, setBillModalOpen] = React.useState(false);
  const [billKey, setBillKey] = React.useState<BillModalKey>("electricity");
  const [comingSoonOpen, setComingSoonOpen] = React.useState(false);
  const [comingSoonTitle, setComingSoonTitle] = React.useState<string>("Coming Soon");

  return (
    <>
      <div className="w-full flex flex-col gap-5">
        {SECTIONS.map((section) => (
          <div
            key={section.title}
            className="w-full rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0A0A0A] overflow-hidden"
          >
            <div className="px-5 pt-5 pb-3">
              <p className="text-sm font-semibold text-[#0A0A0A] dark:text-white">{section.title}</p>
            </div>

            <div className="px-5 pb-5">
              <div className={`w-full grid ${responsiveGrid(section.gridClass)} gap-2 sm:gap-3`}>
                {section.tiles.map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.label}
                      type="button"
                      onClick={() => {
                        if (t.modal) {
                          setBillKey(t.modal);
                          setBillModalOpen(true);
                          return;
                        }
                        setComingSoonTitle(t.comingSoonTitle || t.label);
                        setComingSoonOpen(true);
                      }}
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent hover:bg-black/5 dark:hover:bg-white/5 transition-colors px-2 py-3 sm:py-4 flex flex-col items-center justify-center gap-2"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#0A0A0A] dark:bg-[#141416] flex items-center justify-center">
                        <Icon className="text-[#FF6B2C] text-lg" />
                      </div>
                      <p className="text-[11px] sm:text-xs text-gray-700 dark:text-gray-200 text-center leading-tight">
                        {t.label}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <BillsHubModal
        isOpen={billModalOpen}
        onClose={() => setBillModalOpen(false)}
        initialBill={billKey}
      />

      <ComingSoonModal
        isOpen={comingSoonOpen}
        onClose={() => setComingSoonOpen(false)}
        title={comingSoonTitle}
        subtitle="This service is coming soon."
      />
    </>
  );
};

export default BillsPaymentContent;
