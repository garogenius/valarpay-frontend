import useNavigate from "@/hooks/useNavigate";
import React from "react";
import toast from "react-hot-toast";
import { FaTowerCell } from "react-icons/fa6";
import { IoIosOptions } from "react-icons/io";
import { IoWalletOutline } from "react-icons/io5";
import { LiaMoneyBillWaveSolid, LiaPiggyBankSolid } from "react-icons/lia";
import { LuSmartphone } from "react-icons/lu";

const QuickAccessData = [
  {
    title: "Send Money",
    icon: IoWalletOutline,
    path: "/user/send-money",
  },
  {
    title: "Buy Airtime",
    icon: LuSmartphone,
    path: "/user/airtime",
  },
  {
    title: "Mobile Data",
    icon: FaTowerCell,
    path: "/user/internet/mobile-data",
  },
  {
    title: "Bills Payment",
    icon: LiaMoneyBillWaveSolid,
    path: "/user/bills",
  },
  {
    title: "My Savings",
    icon: LiaPiggyBankSolid,
    path: "/",
  },
  {
    title: "My Portfolio",
    icon: IoIosOptions,
    path: "/",
  },
];

const QuickAccess = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-4">
      <div className="w-full flex items-center justify-between gap-4">
        <h2 className="text-text-200 dark:text-text-800 text-xl sm:text-2xl font-semibold">
          Quick Access{" "}
        </h2>
      </div>

      <div className="pb-10  w-full grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 justify-center items-center ">
        {QuickAccessData.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              if (["My Savings", "My Portfolio"].includes(item.title)) {
                toast.dismiss();
                toast.error("Unavailable at the moment", {
                  duration: 3000,
                });
              } else {
                navigate(item.path);
              }
            }}
            className="cursor-pointer px-6 py-6 rounded-xl bg-bg-600 dark:bg-bg-1100 flex flex-col justify-center items-center gap-5"
          >
            <div className="flex justify-center items-center w-12 h-12 rounded-full bg-secondary text-text-900">
              <item.icon className="text-2xl" />
            </div>
            <p className="text-base text-center text-black dark:text-white">
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickAccess;
