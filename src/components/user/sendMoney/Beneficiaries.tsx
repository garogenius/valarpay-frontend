import { BeneficiaryProps } from "@/constants/types";
import { SwiperSlide } from "swiper/react";
import { Swiper } from "swiper/react";
import "swiper/css";
import { LuCopy } from "react-icons/lu";
import { handleCopy, shortenReference } from "@/utils/utilityFunctions";
import toast from "react-hot-toast";

const Beneficiaries = ({
  beneficiaries,
  handleBeneficiarySelect,
  selectedBeneficiary,
}: {
  handleBeneficiarySelect: (beneficiary: BeneficiaryProps) => void;
  beneficiaries: BeneficiaryProps[];
  selectedBeneficiary: string;
}) => {
  return (
    <Swiper
      className="w-full text-white"
      spaceBetween={16}
      autoplay={{
        disableOnInteraction: false,
      }}
      slidesPerView={1.1}
      breakpoints={{
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
      }}
    >
      {beneficiaries?.map((item, index) => (
        <SwiperSlide key={index}>
          <div
            key={index}
            onClick={() => {
              handleBeneficiarySelect(item);
            }}
            className={`w-full text-xs 2xs:text-sm font-medium cursor-pointer flex flex-col gap-0.5 border rounded-md  px-3 py-2 ${
              selectedBeneficiary === item.id
                ? "bg-primary border-primary text-text-200"
                : "bg-white dark:bg-bg-1100 text-text-200 dark:text-text-400"
            }`}
          >
            <div className="w-full flex items-center gap-2">
              <p className="!no-underline">{item.accountNumber}</p>

              <button
                onClick={() => {
                  handleCopy(item?.accountNumber || "", () => {
                    toast.dismiss();
                    toast.success("Copied", {
                      duration: 3000,
                    });
                  });
                }}
                className="hover:text-primary transition-colors"
              >
                <LuCopy className="w-4 h-4" />
              </button>
            </div>
            <span className="underline-none">
              {shortenReference({
                ref: item.accountName || "",
                first: 10,
                last: 6,
                limit: 15,
              })}
            </span>

            <span className="">
              {shortenReference({
                ref: item.bankName || "",
                first: 10,
                last: 6,
                limit: 15,
              })}
            </span>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Beneficiaries;
