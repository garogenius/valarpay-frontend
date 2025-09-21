import { getCurrencyIconByString } from "@/utils/utilityFunctions";
import Image from "next/image";
import { useTheme } from "@/store/theme.store";
import { FaCircleCheck, FaRegCircle } from "react-icons/fa6";
import useNavigate from "@/hooks/useNavigate";

const WalletCard = ({
  currency,
  balance,
  active,
  path,
  setCurrency,
}: {
  currency: string;
  balance: number;
  active: boolean;
  path: string;
  setCurrency: (currency: string) => void;
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const bgStyles = {
    backgroundImage: "url('/images/home/landingPage/providersBg.svg')",
    backgroundPosition: "center",
    backgroundColor: active
      ? "#C9A62A"
      : theme === "light"
      ? "#f9f9f9"
      : "#D9D9D9",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    zIndex: 10,
    height: "100%",
  };
  return (
    <div
      style={bgStyles}
      className={`w-full rounded-xl px-4 py-4 2xs:py-5 flex items-start justify-between h-fit gap-1 ${
        active ? "bg-primary" : "bg-bg-600 dark:bg-bg-1100"
      }`}
      onClick={() => {
        setCurrency(currency);
      }}
    >
      <Image
        src={getCurrencyIconByString(currency) || ""}
        alt="currency"
        className="w-12 h-12"
      />
      <div className="flex flex-col justify-center items-center text-center gap-4 text-black">
        <div className="flex flex-col justify-center items-center text-center gap-0.5 text-black">
          <p className="text-sm font-medium">
            <span className="uppercase">{currency}</span> Balance
          </p>
          <p className="text-2xl font-semibold">
            ₦ {balance?.toLocaleString() || 0.0}
          </p>
        </div>

        <div
          onClick={() => {
            navigate(path);
          }}
          className={`cursor-pointer flex items-center justify-center px-4 py-1.5 rounded-lg font-medium ${
            active ? "bg-black text-secondary" : "bg-secondary text-text-1500"
          }`}
        >
          + Add Fund
        </div>
      </div>

      <div
        className={`text-3xl ${
          active ? "border-primary" : "border-border-600 dark:border-border-100"
        } rounded-full flex items-center justify-center`}
      >
        {active ? <FaCircleCheck /> : <FaRegCircle />}
      </div>
    </div>
  );
};

export default WalletCard;
