"use client";
import { motion, useInView } from "framer-motion";
import { SectionWrapper } from "@/utils/hoc";
import { fadeIn, textVariant, zoomIn } from "@/utils/motion";
import useNavigate from "@/hooks/useNavigate";
import Image from "next/image";
import images from "../../../../public/images";
import CustomButton from "@/components/shared/Button";
import { useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import { BsShieldLockFill } from "react-icons/bs";
import { BiTransfer } from "react-icons/bi";

const Heroarea = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.25 });

  return (
    <div
      className="relative w-full min-h-[75vh] overflow-x-hidden pt-9 mb-7 md:pt-12 bg-cover bg-center"
      style={{
        backgroundImage: 'url("/images/home/landingPage/glassBuilding.jpg")',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Multiple overlay layers for depth effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#011131]/70 to-[#011131]/50" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#011131]/40 via-transparent to-[#011131]/30" />
      <div className="absolute inset-0 bg-[#011131]/10 backdrop-blur-[1px]" />

      {/* Accent overlays */}
      <div className="absolute inset-0">
        <div className="w-full h-full">
          <div className="absolute top-0 w-full h-32 bg-[#00C566]/5 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#2D7FF9]/5 rounded-full blur-[120px]" />
        </div>
      </div>

      {/* Pro Badge */}
      <div className="absolute top-4 right-4 z-20">
        <div className="bg-[#2D7FF9] text-white px-4 py-1 rounded-lg font-semibold">
          Pro
        </div>
      </div>

      <motion.div
        ref={ref}
        animate={isInView ? "show" : "hidden"}
        initial="hidden"
        className="relative w-full md:w-[90%] lg:w-[88%] mx-auto pt-12 md:pt-14 pb-20 md:pb-32"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            variants={textVariant(0.1)}
            className="flex flex-col items-start gap-6 z-10 px-4 md:px-0 max-w-full"
          >
             {/* // space-y-4 backdrop-blur-xl bg-[#1B2C4F]/40 p-6 md:p-8 rounded-2xl border border-white/5 w-full */}
            <div className="">
              {/* Welcome Text */}
              <motion.div
                variants={fadeIn("up", "spring", 0.2, 0.5)}
                className="bg-[#1B2C4F]/80 backdrop-blur-sm px-4 py-2 rounded-full inline-block mb-4"
              >
                <span className="text-[#FF8C1E] text-lg md:text-xl font-medium">Welcome to ValarPay</span>
              </motion.div>

              <motion.h1
                variants={fadeIn("up", "spring", 0.3, 0.5)}
                className="text-[32px] text-[#FF8C1E] sm:text-4xl md:text-5xl lg:text-[52px] font-bold tracking-tight pb-2"
              >
                <span className="text-white">ValarPay</span>
                <span className="text-[#FF8C1E]"> Simple</span>
                <span className="text-white"> &</span>
                <span className="text-[#FF8C1E]"> Safe</span>
                <span className="text-white"> Banking</span>
              </motion.h1>

              <motion.p
                variants={fadeIn("up", "spring", 0.4, 0.5)}
                className="text-lg md:text-xl text-gray-300"
              >
                ValarPay Is An Innovative Banking Solutions For Future And Beyond
              </motion.p>
            </div>

            {/* Store Links Row */}
            <motion.div
              variants={fadeIn("up", "spring", 0.5, 0.5)}
              className="flex flex-row items-center justify-start gap-3 md:gap-4 w-full overflow-x-auto pb-2"
            >
              <a
                href="https://apps.apple.com/app/valarpay"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
              >
                <Image
                  src={images.landingPage.appStoreCta}
                  alt="App Store"
                  width={140}
                  height={42}
                  className="w-auto h-[42px] md:h-[48px]"
                />
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.valarpay"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
              >
                <Image
                  src={images.landingPage.playStoreCta}
                  alt="Google Play"
                  width={140}
                  height={42}
                  className="w-auto h-[42px] md:h-[48px]"
                />
              </a>
            </motion.div>

            {/* CTA Buttons Row */}
            <motion.div
              variants={fadeIn("up", "spring", 0.6, 0.5)}
              className="flex flex-row items-center justify-start gap-3 md:gap-4 w-full"
            >
              <CustomButton
                onClick={() => navigate("/account-type")}
                className="whitespace-nowrap px-6 md:px-8 py-2.5 md:py-3 bg-[#FF8C1E] text-white hover:bg-[#FF8C1E]/90 transition-colors rounded-lg text-base md:text-lg font-medium"
              >
                Get Started
              </CustomButton>
              <CustomButton
                onClick={() => navigate("/login")}
                className="whitespace-nowrap bg-transparent px-6 md:px-8 py-2.5 md:py-3 border-2 border-[#FF8C1E] text-[#FF8C1E] hover:bg-[#FF8C1E]/10 transition-colors rounded-lg text-base md:text-lg font-medium"
              >
                Login
              </CustomButton>
            </motion.div>
          </motion.div>

          {/* Right Content - hidden on mobile */}
          <motion.div
            variants={fadeIn("left", "spring", 0.5, 0.75)}
            className="relative z-10 hidden md:flex justify-center items-center"
          >
            {/* Stats Card - Top */}
            <motion.div
              variants={zoomIn(0.1, 0.5)}
              className="absolute -top-4 right-8 bg-[#1B2C4F] p-3 rounded-lg shadow-lg z-20"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-6 h-6 flex items-center justify-center">
                      <FaUserCircle className="w-full h-full text-[#2D7FF9]" />
                    </div>
                  ))}
                </div>
                <div className="text-white">
                  <h3 className="text-base font-semibold text-[#FF8C1E]">100,000+</h3>
                  <p className="text-xs text-gray-400">Happy Customers</p>
                </div>
              </div>
            </motion.div>

            {/* Main App Image */}
            <div className="relative w-[440px] md:w-[560px] lg:w-[640px] mt-6 md:mt-20 lg:mt-25">
              {/* Bottom Circle Accent (temporarily disabled) */}
              {/**
               * <div
               *   aria-hidden
               *   className="pointer-events-none absolute mt-40 -bottom-20 md:-bottom-28 left-1/2 -translate-x-[15%] md:-translate-x-[10%] w-48 h-32 md:w-56 md:h-40 rounded-full bg-[#041538] shadow-[0_8px_24px_rgba(4,21,56,0.55)] z-20"
               * />
               */}
              <Image
                alt="ValarPay Mobile App"
                src={images.landingPage.heroImage}
                // rounded-xl shadow-2xl
                className="relative z-10 w-full h-auto rounded-xl shadow-2xl drop-shadow-[0_24px_40px_rgba(0,0,0,0.45)]"
                priority
              />
            </div>

            {/* Security Card - Top */}
            <motion.div
              variants={zoomIn(0.2, 0.5)}
              className="absolute top-20 -right-2 bg-[#1B2C4F] p-3 rounded-lg shadow-lg z-20 max-w-[220px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2D7FF9]/10 flex items-center justify-center">
                  <BsShieldLockFill className="w-5 h-5 text-[#2D7FF9]" />
                </div>
                <div className="text-white">
                  <h3 className="text-sm font-semibold">Bank-Level Security</h3>
                  <p className="text-xs text-gray-400">Your Money is Safe</p>
                </div>
              </div>
            </motion.div>

            {/* Transfer Card - Bottom */}
            <motion.div
              variants={zoomIn(0.3, 0.5)}
              className="absolute -bottom-4 left-8 bg-[#1B2C4F] p-3 rounded-lg shadow-lg z-20 max-w-[250px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00C566]/10 flex items-center justify-center">
                  <BiTransfer className="w-5 h-5 text-[#00C566]" />
                </div>
                <div className="text-white">
                  <h3 className="text-sm font-semibold">Instant Transfers</h3>
                  <p className="text-xs text-gray-400">24/7 Local & Global Banking</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Heroarea, "heroarea");
