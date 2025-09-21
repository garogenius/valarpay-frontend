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
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>

        {/* Inner ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-4 border-b-primary border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin-reverse"></div>

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Loader;
