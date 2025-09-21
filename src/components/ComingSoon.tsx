"use client";
import { FiClock } from "react-icons/fi";
import CustomButton from "./shared/Button";
import { useRouter } from "next/navigation";

const ComingSoon = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-600 dark:bg-bg-1100 text-text-200 dark:text-text-400 p-4">
      <div className="w-full text-center max-w-2xl mx-auto flex flex-col justify-center items-center">
        {/* Logo/Icon */}
        <FiClock className="text-6xl lg:text-7xl mx-auto mb-4 sm:mb-6 animate-pulse" />

        {/* Main Heading */}
        <h1 className="text-3xl 2xs:text-4xl xs:text-5xl font-bold  tracking-tight">
          Coming Soon
        </h1>

        <div className="w-full flex justify-center">
          {" "}
          <CustomButton
            onClick={() => {
              router.back();
            }}
            className="py-3.5 px-10 w-[70%] sm:w-[50%] mt-4 xs:mt-6 sm:mt-8 text-white"
          >
            Go Back
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
