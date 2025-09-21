"use client";
import { SectionWrapper } from "@/utils/hoc";
import { textVariant, zoomIn } from "@/utils/motion";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import images from "../../../public/images";

const AppCta = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.25 });
  return (
    <div className="w-full  overflow-hidden flex justify-center bg-white dark:bg-dark-primary">
      <motion.div
        ref={ref}
        animate={isInView ? "show" : "hidden"}
        initial="hidden"
        className="w-full mt-36 xl:mt-48 2xl:mt-60 bg-[#F2F2F2] dark:bg-tertiary rounded-t-[4rem] 2xs:rounded-t-[5rem] xl:rounded-t-[6rem]  flex flex-col items-center h-full lg:py-12"
      >
        <div className="flex max-lg:flex-col items-center w-[90%] lg:w-[88%]">
          <div className="max-xs:-top-[6rem] max-sm:-top-[8rem] max-lg:-top-[10rem] relative w-full lg:w-[50%] flex max-lg:justify-center max-lg:items-center">
            <Image
              alt="bg"
              className="max-lg:hidden absolute -top-[18rem] xl:-top-[20rem] 2xl:-top-[30rem]"
              src={images.landingPage.appCtaBg}
            />

            <Image
              alt="bg"
              className="lg:hidden"
              src={images.landingPage.appCtaBg}
            />
          </div>
          <div className="relative max-xs:-top-[6rem] max-md:-top-[8rem] max-lg:-top-[10rem] w-full lg:w-[50%] flex flex-col  gap-12 lg:gap-8 xl:gap-10 ">
            <motion.div
              variants={textVariant(0.1)}
              className="w-full xs:w-[90%] md:w-[80%] text-text-200 dark:text-text-400 flex flex-col max-lg:self-center max-lg:text-center max-lg:justify-center max-lg:items-center gap-4 xs:gap-2.5"
            >
              <h1 className="text-2xl xs:text-3xl xl:text-4xl font-semibold">
                Try ValarPay On Your Mobile Phone for Free{" "}
              </h1>

              <div className="flex items-center gap-3">
                <Image
                  alt="app-store"
                  className="w-32"
                  src={images.landingPage.appStoreCta}
                />
                <Image
                  alt="app-store"
                  className="w-32"
                  src={images.landingPage.playStoreCta}
                />
              </div>
            </motion.div>

            <div className="flex items-center gap-4">
              <motion.div
                variants={zoomIn(0.2, 0.5)}
                className="p-2 bg-white rounded-lg"
              >
                <Image
                  alt="bar-code"
                  className="w-16 md:w-20 xl:w-24 2xl:w-32"
                  src={images.landingPage.barCode}
                />
              </motion.div>
              <p className="w-[55%] xs:w-[45%] sm:w-[35%] lg:w-[40%] leading-[1.5rem] xs:leading-[1.7rem] xl:leading-[2rem] text-base sm:text-xl font-semibold text-text-200 dark:text-text-400">
                Scan QR code to download Valarpay App
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SectionWrapper(AppCta, "appCta");
