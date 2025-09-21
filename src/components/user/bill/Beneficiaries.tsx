import { BeneficiaryProps, BILL_TYPE } from "@/constants/types";
import Image from "next/image";
import React from "react";
import { SwiperSlide } from "swiper/react";
import { Swiper } from "swiper/react";
import "swiper/css";
import { getNetworkIconByString } from "@/utils/utilityFunctions";

const Beneficiaries = ({
  beneficiaries,
  handleBeneficiarySelect,
  selectedBeneficiary,
  type,
}: {
  handleBeneficiarySelect: (beneficiary: BeneficiaryProps) => void;
  beneficiaries: BeneficiaryProps[];
  selectedBeneficiary: string;
  type: BILL_TYPE;
}) => {
  const dataAnCableBreakpoints = {
    200: {
      slidesPerView: 1.4,
    },
    370: {
      slidesPerView: 1.6,
    },
    400: {
      slidesPerView: 1.8,
    },
    540: {
      slidesPerView: 2.2,
    },
    660: {
      slidesPerView: 2.4,
    },
    850: {
      slidesPerView: 2.7,
    },
    1025: {
      slidesPerView: 2.4,
    },

    1200: {
      slidesPerView: 2.8,
    },

    1300: {
      slidesPerView: 3.4,
    },

    1400: {
      slidesPerView: 3.8,
    },
  };

  const normalBreakpoints = {
    200: {
      slidesPerView: 1.4,
    },
    370: {
      slidesPerView: 1.6,
    },
    400: {
      slidesPerView: 1.8,
    },
    540: {
      slidesPerView: 2.2,
    },
    660: {
      slidesPerView: 2.4,
    },
    850: {
      slidesPerView: 2.7,
    },
    1025: {
      slidesPerView: 2.4,
    },

    1200: {
      slidesPerView: 1.9,
    },

    1300: {
      slidesPerView: 2.2,
    },

    1400: {
      slidesPerView: 2.4,
    },
  };
  return (
    <Swiper
      className="w-full text-white"
      spaceBetween={16}
      autoplay={{
        disableOnInteraction: false,
      }}
      slidesPerView={1.1}
      breakpoints={
        type === BILL_TYPE.DATA || type === BILL_TYPE.CABLE
          ? dataAnCableBreakpoints
          : normalBreakpoints
      }
    >
      {beneficiaries?.map((item, index) => (
        <SwiperSlide key={index}>
          <div
            key={index}
            onClick={() => {
              handleBeneficiarySelect(item);
            }}
            className={`text-xs 2xs:text-sm font-medium cursor-pointer flex items-center justify-center gap-2 border rounded-lg  px-3 py-3 ${
              selectedBeneficiary === item.id
                ? "bg-primary border-primary text-text-200"
                : "bg-white dark:bg-bg-1100 text-text-200 dark:text-text-400"
            }`}
          >
            {["airtime", "data"].includes(type || "") && item.network ? (
              <Image
                className="w-6 xl:w-7 rounded-full"
                src={
                  getNetworkIconByString(item.network.toLocaleLowerCase()) || ""
                }
                alt="network-icon"
              />
            ) : null}

            <p className="text-base !no-underline">{item.billerNumber}</p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Beneficiaries;
