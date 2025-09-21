import CustomButton from "@/components/shared/Button";
import { BILL_TYPE, GiftCardDetails } from "@/constants/types";
import toast from "react-hot-toast";
import { LuCopy } from "react-icons/lu";

type StageThreeProps = {
  setStage: (stage: "one" | "two" | "three") => void;
  phone?: string;
  network?: string;
  cableProvider?: string;
  internetProvider?: string;
  amount: string;
  type: BILL_TYPE;
  checkoutMessage?: string;
  electricityResCode?: string;
  setNetwork?: (network: string) => void;
  giftCardDetails?: GiftCardDetails;
};

const BillStageThree: React.FC<StageThreeProps> = ({
  setStage,
  phone,
  network,
  amount,
  cableProvider,
  internetProvider,
  type,
  checkoutMessage,
  electricityResCode,
  setNetwork = () => {},
}) => {
  const getPurchaseMessage = () => {
    switch (type) {
      case "airtime":
        return "Airtime Purchase";
      case "internationalAirtime":
        return `${network} Purchase`;
      case "data":
        return "Mobile Data Purchase";
      case "cable":
        return `${cableProvider} Subscription`;
      case "electricity":
        return `Electricity Purchase`;
      case "internet":
        return `Internet Purchase`;
      case "giftcard":
        return `Gift Card Purchase`;
      default:
        return `${internetProvider} Internet Purchase`;
    }
  };

  const getSubText = () => {
    switch (type) {
      case "airtime":
        return `Glo Airtime for ${phone}`;
      case "data":
        return checkoutMessage;
      case "cable":
        return checkoutMessage;
      case "electricity":
        return "worth of electricity recharge";
      case "internet":
        return checkoutMessage;
    }
  };

  return (
    <div className="w-full max-2xs:mt-20 py-5 xs:py-10 h-full  flex items-center justify-center">
      <div className="w-[100%] sm:w-[85%] lg:w-[75%] xl:w-[65%] 2xl:w-[55%] h-full flex flex-col justify-center gap-8 rounded-lg sm:rounded-xl p-0 2xs:p-4 md:p-8">
        <div className="text-center flex flex-col items-center justify-center">
          <div
            className="flex items-center justify-center w-12 h-12 bg-bg-2600 rounded-full mb-4"
            style={{
              animation: "shadowBeat 1.5s ease-in-out infinite",
              boxShadow: "0 0 0 0 rgba(34, 197, 94, 0.7)", // Starting shadow
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>

            {/* Inline Keyframes */}
            <style>
              {`
      @keyframes shadowBeat {
        0%, 100% {
          box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
        }
        50% {
          box-shadow: 0 0 20px 10px rgba(34, 197, 94, 0.4);
        }
      }
    `}
            </style>
          </div>
          <p className="mt-2 text-xl font-bold text-text-1800">
            {getPurchaseMessage()}
          </p>
          <p className="text-xl text-text-1800 font-bold">Successful!</p>
        </div>

        <div className="flex text-text-200 dark:text-text-800   flex-col text-center">
          <p>
            You just purchase{" "}
            <span className="font-semibold dark:text-text-400">
              ₦ {amount?.toLocaleString()}
            </span>{" "}
          </p>
          <p>{getSubText()}</p>
          {type === "electricity" && electricityResCode && (
            <div className="flex items-center justify-center gap-2">
              <p>
                Recharge Code:{" "}
                <span className="text-text-1600">{electricityResCode}</span>
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(electricityResCode);
                  toast.success("Copied to clipboard", {
                    duration: 3000,
                  });
                }}
                className="transition-colors"
              >
                <LuCopy className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          {/* button section */}
          <CustomButton
            type="button"
            onClick={() => {
              setNetwork("");
              setStage("one");
            }}
            className="w-full 2xs:w-[90%] xs:w-[80%] sm:w-[70%] border-2 text-text-1500  dark:text-text-200 dark:font-bold border-primary text-base 2xs:text-lg max-2xs:px-6 py-3.5"
          >
            Done{" "}
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default BillStageThree;
