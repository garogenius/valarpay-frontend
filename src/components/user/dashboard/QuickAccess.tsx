import React, { useState } from "react";
import { FaMoneyBillTransfer, FaWifi } from "react-icons/fa6";
import { BiMoneyWithdraw } from "react-icons/bi";
import { MdOutlinePayment } from "react-icons/md";
import SendMoneyModal from "@/components/modals/SendMoneyModal";
import AddMoneyModal from "@/components/modals/AddMoneyModal";
import WithdrawMoneyModal from "@/components/modals/WithdrawMoneyModal";
import InternetModal from "@/components/modals/InternetModal";

const QuickAccessData = [
  {
    title: "Send Money",
    icon: FaMoneyBillTransfer,
    action: "sendMoney",
  },
  {
    title: "Add Money",
    icon: MdOutlinePayment,
    action: "addMoney",
  },
  {
    title: "Withdraw",
    icon: BiMoneyWithdraw,
    action: "withdraw",
  },
  {
    title: "Internet",
    icon: FaWifi,
    action: "internet",
  },
];

const QuickAccess = () => {
  const [isSendMoneyModalOpen, setIsSendMoneyModalOpen] = useState(false);
  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
  const [isWithdrawMoneyModalOpen, setIsWithdrawMoneyModalOpen] = useState(false);
  const [isInternetModalOpen, setIsInternetModalOpen] = useState(false);

  const handleQuickAccessClick = (action: string) => {
    switch (action) {
      case "sendMoney":
        setIsSendMoneyModalOpen(true);
        break;
      case "addMoney":
        setIsAddMoneyModalOpen(true);
        break;
      case "withdraw":
        setIsWithdrawMoneyModalOpen(true);
        break;
      case "internet":
        setIsInternetModalOpen(true);
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full bg-transparent rounded-xl border border-gray-800 p-4 sm:p-6">
      <div className="w-full mb-4 sm:mb-5">
        <h2 className="text-base sm:text-lg font-semibold text-white">
          Quick Access
        </h2>
      </div>

      <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {QuickAccessData.map((item, index) => (
          <div
            key={index}
            onClick={() => handleQuickAccessClick(item.action)}
            className="cursor-pointer rounded-xl bg-[#2C2C2E] hover:bg-[#3A3A3C] transition-colors p-4 sm:p-5 flex flex-col items-center justify-center gap-2 sm:gap-3"
          >
            <div className="flex justify-center items-center w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-[#3A3A3C] text-[#FF6B2C]">
              <item.icon className="text-base sm:text-lg" />
            </div>
            <p className="text-[11px] sm:text-xs font-medium text-white text-center">
              {item.title}
            </p>
          </div>
        ))}
      </div>

      {/* Modals */}
      <SendMoneyModal
        isOpen={isSendMoneyModalOpen}
        onClose={() => setIsSendMoneyModalOpen(false)}
      />
      <AddMoneyModal
        isOpen={isAddMoneyModalOpen}
        onClose={() => setIsAddMoneyModalOpen(false)}
      />
      <WithdrawMoneyModal
        isOpen={isWithdrawMoneyModalOpen}
        onClose={() => setIsWithdrawMoneyModalOpen(false)}
      />
      <InternetModal
        isOpen={isInternetModalOpen}
        onClose={() => setIsInternetModalOpen(false)}
      />
    </div>
  );
};

export default QuickAccess;
