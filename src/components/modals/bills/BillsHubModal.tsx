"use client";

import React from "react";
import AirtimeBillSteps from "@/components/modals/bills/AirtimeBillSteps";
import InternationalAirtimeBillSteps from "@/components/modals/bills/InternationalAirtimeBillSteps";
import MobileDataBillSteps from "@/components/modals/bills/MobileDataBillSteps";
import InternetSteps from "@/components/user/bill/internet/InternetSteps";
import CableBillSteps from "@/components/modals/bills/CableBillSteps";
import ElectricityBillSteps from "@/components/modals/bills/ElectricityBillSteps";
import BettingBillSteps from "@/components/modals/betting/BettingBillSteps";
import EducationBillSteps from "@/components/modals/bills/EducationBillSteps";
import ConvertCurrencyBillSteps from "@/components/modals/bills/ConvertCurrencyBillSteps";
import BuyGiftCardContent from "@/components/user/bill/gift-card/buy/BuyGiftCardContent";
import RedeemGiftCardContent from "@/components/user/bill/gift-card/redeem/RedeemGiftCardContent";

export type BillModalKey =
  | "airtime"
  | "intl_airtime"
  | "mobile_data"
  | "internet"
  | "cable"
  | "electricity"
  | "giftcard_buy"
  | "giftcard_redeem"
  | "betting"
  | "education"
  | "convert";

type BillsHubModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialBill: BillModalKey;
};

const BillsHubModal: React.FC<BillsHubModalProps> = ({ isOpen, onClose, initialBill }) => {
  const [bill, setBill] = React.useState<BillModalKey>(initialBill);

  React.useEffect(() => {
    setBill(initialBill);
  }, [initialBill]);

  if (!isOpen) return null;

  const onSelectPath = (path: string) => {
    // Airtime nav
    if (path === "/user/airtime") return setBill("airtime");
    if (path === "/user/airtime/international") return setBill("intl_airtime");

    // Internet nav
    if (path === "/user/internet/mobile-data") return setBill("mobile_data");
    if (path === "/user/internet") return setBill("internet");

    // Gift card nav
    if (path === "/user/bills/gift-card") return setBill("giftcard_buy");
    if (path === "/user/bills/gift-card/redeem") return setBill("giftcard_redeem");
  };

  const renderBody = () => {
    switch (bill) {
      case "airtime":
        return <AirtimeBillSteps onClose={onClose} />;
      case "intl_airtime":
        return <InternationalAirtimeBillSteps onClose={onClose} />;
      case "mobile_data":
        return <MobileDataBillSteps onClose={onClose} />;
      case "internet":
        return <InternetSteps onClose={onClose} />;
      case "cable":
        return <CableBillSteps onClose={onClose} />;
      case "electricity":
        return <ElectricityBillSteps onClose={onClose} />;
      case "betting":
        return <BettingBillSteps onClose={onClose} />;
      case "education":
        return <EducationBillSteps onClose={onClose} />;
      case "convert":
        return <ConvertCurrencyBillSteps onClose={onClose} />;
      case "giftcard_buy":
        return <BuyGiftCardContent onSelectPath={onSelectPath} />;
      case "giftcard_redeem":
        return <RedeemGiftCardContent onSelectPath={onSelectPath} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-visible rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0A0A0A] shadow-2xl">
        <div className="w-full max-h-[90vh] overflow-y-auto overflow-x-visible relative">{renderBody()}</div>
      </div>
    </div>
  );
};

export default BillsHubModal;


