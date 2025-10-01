"use client";
import { ServicesData } from "@/constants";
import SectionWrapper from "@/utils/hoc/SectionWrapper";
import { fadeIn, scaleVariants, staggerContainer, textVariant } from "@/utils/motion";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import images from "../../../../public/images";
import { useRef } from "react";

const Services = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.25 });

  return (
    <motion.div
      ref={ref}
      animate={isInView ? "show" : "hidden"}
      initial="hidden"
      className="w-full flex flex-col "
    >
      <div className="w-full flex flex-col items-center bg-[#F2F2F2] dark:bg-dark-primary py-10 md:py-16">
        <div className="w-[90%] md:w-[80%] lg:w-[70%] flex flex-col items-center text-center">
          <motion.span
            variants={fadeIn("up", "spring", 0.05, 0.5)}
            className="text-xs md:text-sm tracking-[0.2em] text-secondary font-semibold"
          >
            TOP FEATURES
          </motion.span>
          <motion.h2
            variants={textVariant(0.1)}
            className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-text-200 dark:text-text-400"
          >
            Financial Solutions
          </motion.h2>
          <motion.p
            variants={fadeIn("up", "spring", 0.15, 0.5)}
            className="mt-1.5 text-text-1000 dark:text-text-400/80 text-sm md:text-base max-w-2xl"
          >
            Pay all your bills at once with ValarPay without leaving your home.
            Whether you need to send money, pay bills, buy airtime, or manage
            your finances and savings, ValarPay is here to simplify your
            financial life.
          </motion.p>
        </div>
      </div>
      <div className="flex flex-col items-center pt-4 pb-10 sm:pt-6 lg:pt-8">
        <div className="w-[85%] xs:w-[82%] md:w-[78%] xl:w-[70%] grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8 items-start">
          {/* Left: Services grid (2 columns) */}
          <motion.div
            variants={staggerContainer(0.1, 0.2)}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 xl:gap-4"
          >
            {ServicesData.map((item, index) => (
              <motion.div
                variants={scaleVariants}
                whileInView={scaleVariants.whileInView as any}
                key={index}
                className={`flex items-center gap-2 2xs:gap-3 xl:gap-4 rounded-lg bg-dark-primary dark:bg-tertiary px-3 2xs:px-3.5 lg:px-4 py-4 2xs:py-5 lg:py-6 2xl:py-8 ${item.title === "Other Bills" ? "sm:col-span-2" : ""}`}
              >
                <div className="rounded-full flex justify-center items-center p-2 xs:p-2.5 bg-bg-1200 overflow-hidden">
                  <Image
                    alt="icon"
                    src={item.image}
                    className={` ${index === 0
                      ? "w-8 2xs:w-7 sm:w-6 md:w-10"
                      : index === 6
                        ? "w-12 2xs:w-11 xs:w-10 sm:w-9 md:w-12 lg:w-14"
                        : "w-12 2xs:w-12 xs:w-10 sm:w-9 md:w-14 lg:w-16"
                      }`}
                  />
                </div>
                <div className="flex flex-col gap-0.5 xl:gap-1 2xl:gap-2">
                  <h2 className="text-sm 2xs:text-base lg:text-lg text-text-700 dark:text-text-800 font-semibold">
                    {item.title}
                  </h2>
                  <p className="text-text-200 dark:text-text-800 text-xs xs:text-sm 2xl:text-base">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Right: Illustration image */}
          <motion.div
            variants={scaleVariants}
            whileInView={scaleVariants.whileInView as any}
            className="relative hidden lg:block w-full"
          >
            <Image
              alt="ValarPay App"
              src={images.landingPage.appCtaBg}
              className="w-full h-auto object-contain"
              priority
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default SectionWrapper(Services, "services");
