"use client";
import useNavigate from "@/hooks/useNavigate";
import classNames from "classnames";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { GiBuyCard } from "react-icons/gi";
import { MdOutlineRedeem, MdSell } from "react-icons/md";

const navItems = [
  {
    name: "Buy",
    path: "/user/bills/gift-card",
    icon: GiBuyCard,
  },
  {
    name: "Sell",
    path: "/user/bills/gift-card/sell",
    icon: MdSell,
  },

  {
    name: "Redeem",
    path: "/user/bills/gift-card/redeem",
    icon: MdOutlineRedeem,
  },
];

const GiftCardNav = () => {
  const navigate = useNavigate();
  const pathname = usePathname();
  return (
    <div className="w-full flex items-center gap-2.5 2xs:gap-4">
      {navItems.map((item, index) => (
        <div
          key={index}
          onClick={() => {
            if (item.path === "/user/bills/gift-card/sell") {
              toast.dismiss();
              toast.error("This feature is not available yet", {
                duration: 3000,
              });
              return;
            }
            navigate(item.path);
          }}
          className={classNames({
            "w-fit flex items-center gap-2 py-2 sm:py-3 px-3 2xs:px-4 sm:px-6 rounded-full cursor-pointer":
              true,
            "bg-[#A4A4A4]": pathname !== item.path,
            "bg-primary font-semibold": pathname === item.path,
          })}
        >
          <item.icon className=" 2xs:w-5 2xs:h-5 w-4 h-4" />
          <p className="text-sm sm:text-base">{item.name}</p>
        </div>
      ))}
    </div>
  );
};

export default GiftCardNav;
