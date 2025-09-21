"use client";
import useNavigate from "@/hooks/useNavigate";
import classNames from "classnames";
import { usePathname } from "next/navigation";
import { LuPhoneOutgoing } from "react-icons/lu";
import { TbWorldUp } from "react-icons/tb";

const navItems = [
  {
    name: "Airtime",
    path: "/user/airtime",
    icon: LuPhoneOutgoing,
  },
  {
    name: "International Airtime",
    path: "/user/airtime/international",
    icon: TbWorldUp,
  },
];

const AirtimeNav = () => {
  const navigate = useNavigate();
  const pathname = usePathname();
  return (
    <div className="w-full flex items-center gap-2.5 2xs:gap-4 md:gap-6">
      {navItems.map((item, index) => (
        <div
          key={index}
          onClick={() => {
            navigate(item.path);
          }}
          className={classNames({
            "w-fit flex items-center gap-2 py-3 sm:py-4 px-3 2xs:px-4 sm:px-6 rounded-full cursor-pointer":
              true,
            "bg-[#A4A4A4]": pathname !== item.path,
            "bg-primary font-semibold": pathname === item.path,
          })}
        >
          <item.icon className="md:w-6 md:h-6 2xs:w-5 2xs:h-5 w-4 h-4" />
          <p className="text-sm sm:text-base">{item.name}</p>
        </div>
      ))}
    </div>
  );
};

export default AirtimeNav;
