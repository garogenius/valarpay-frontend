"use client";

import useNavigate from "@/hooks/useNavigate";
import toast from "react-hot-toast";
import { AiOutlineInsurance, AiOutlineThunderbolt } from "react-icons/ai";
import { BiCameraMovie } from "react-icons/bi";
import { CiShop } from "react-icons/ci";
import { IoBusOutline, IoSchoolOutline } from "react-icons/io5";
import { LiaRedoAltSolid } from "react-icons/lia";
import { LuShieldPlus, LuTv } from "react-icons/lu";
import { MdCardGiftcard } from "react-icons/md";
import { RiGovernmentLine } from "react-icons/ri";
import { SlPlane, SlTrophy } from "react-icons/sl";

const Bills = [
  {
    name: "Cable /TV Bills",
    icon: LuTv,
    path: "/user/bills/cable",
  },
  {
    name: "Electricity Bills",
    icon: AiOutlineThunderbolt,
    path: "/user/bills/electricity",
  },
  {
    name: "Education",
    icon: IoSchoolOutline,
    path: "/user/bills/education",
  },
  {
    name: "Health Care",
    icon: LuShieldPlus,
    path: "/user/bills/health-care",
  },
  {
    name: "Convert",
    icon: LiaRedoAltSolid,
    path: "/user/bills/convert",
  },

  {
    name: "Flight Ticket",
    icon: SlPlane,
    path: "/user/bills/flight",
  },

  {
    name: "Bus Ticket",
    icon: IoBusOutline,
    path: "/user/bills/bus",
  },

  {
    name: "Movie Ticket",
    icon: BiCameraMovie,
    path: "/user/bills/movie",
  },

  {
    name: "Shop",
    icon: CiShop,
    path: "/user/bills/shop",
  },

  {
    name: "Insurance",
    icon: AiOutlineInsurance,
    path: "/user/bills/insurance",
  },

  {
    name: "Govt Fees",
    icon: RiGovernmentLine,
    path: "/user/bills/govt-fees",
  },

  {
    name: "Gift Cards",
    icon: MdCardGiftcard,
    path: "/user/bills/gift-card",
  },

  {
    name: "Betting",
    icon: SlTrophy,
    path: "/user/bills/betting",
  },
];

const BillsPaymentContent = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full flex max-xl:flex-col 2xs:px-2 xs:px-4 sm:px-6 md:px-8 py-4 2xs:py-6 sm:py-10 bg-transparent xs:bg-bg-600 dark:xs:bg-bg-1100 gap-6 xs:gap-10 lg:gap-12 2xl:gap-16 rounded-xl">
      <div className="w-full grid grid-cols-1 2xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {Bills.map((item, index) => (
          <div
            onClick={() => {
              if (
                [
                  "Cable /TV Bills",
                  "Electricity Bills",
                  // "Education",
                  "Gift Cards",
                ].includes(item.name)
              ) {
                navigate(item.path);
              } else {
                toast.dismiss();

                toast.error("Unavailable at the moment", {
                  duration: 3000,
                });
              }
            }}
            key={index}
            className="cursor-pointer flex px-4 py-5 flex-col gap-2.5 justify-center bg-bg-600 dark:bg-bg-1100 rounded-xl border border-border-600"
          >
            <div className="w-fit rounded-full p-3 flex justify-center items-center bg-bg-2700 dark:bg-bg-1200">
              <item.icon className="text-secondary text-xl" />
            </div>
            <p className="text-base font-medium text-text-200 dark:text-text-400">
              {item.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BillsPaymentContent;
