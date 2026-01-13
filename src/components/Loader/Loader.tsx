import { useTheme } from "@/store/theme.store";
import classNames from "classnames";

const Loader = () => {
  const theme = useTheme();

  return (
    <div
      className={classNames(
        "z-[9999] fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center"
      )}
    >
      <img
        src="/images/valarpay_5.gif"
        alt="Loading..."
        className="w-28 h-28 object-contain"
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Loader;
