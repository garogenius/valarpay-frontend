"use client";
import { SectionWrapper } from "@/utils/hoc";
import { textVariant, zoomIn } from "@/utils/motion";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import images from "../../../../public/images";
import { FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import CustomButton from "@/components/shared/Button";

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.25 });

  return (
    <div className="w-full flex justify-center">
      <motion.div
        ref={ref}
        animate={isInView ? "show" : "hidden"}
        initial="hidden"
        className="w-[85%] mx-auto lg:w-[82%] flex flex-col items-center h-full py-12 sm:py-16 lg:py-20"
      >
        <div className="w-full h-full grid grid-cols-1 lg:grid-cols-[6fr_5fr] gap-6 lg:gap-10">
          {/* Left Section */}
          <div className="w-full p-6 sm:p-8 rounded-2xl bg-[#C2CFD5] dark:bg-[#041943]/60 backdrop-blur-md border border-white/10 shadow-xl">
            <motion.div
              variants={textVariant(0.1)}
              className="flex flex-col gap-5 sm:gap-6"
            >
              <h1 className="text-2xl xs:text-3xl lg:text-4xl font-bold text-[#0B1A33] dark:text-white">
                We are glad to help you
              </h1>

              <p className="text-sm xs:text-base text-[#1B2C4F]/90 dark:text-text-400 max-w-prose">
                If you have any additional questions or need further assistance, please do not hesitate to contact our customer support team. We are here to help you have a seamless and satisfying experience with ValarPay.
              </p>

              <div className="flex flex-col gap-3 sm:gap-4 text-[#0B1A33] dark:text-text-400">
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#2D7FF9]/15 text-[#2D7FF9]">
                    <FaPhone />
                  </span>
                  <a href="tel:02013309609" className="text-sm sm:text-base hover:underline">
                    02013309609
                  </a>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#FF8C1E]/15 text-[#FF8C1E]">
                    <MdEmail className="text-lg" />
                  </span>
                  <a href="mailto:support@valarpay.com" className="text-sm sm:text-base hover:underline break-all">
                    support@valarpay.com
                  </a>
                </div>
              </div>

              <motion.div variants={zoomIn(0.2, 0.5)}>
                <CustomButton className="bg-[#F26E21] text-white hover:bg-[#F26E21]/90 text-sm sm:text-base px-5 sm:px-6 py-2.5 rounded-lg shadow-md w-full sm:w-auto">
                  Chat Support
                </CustomButton>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Section */}
          <div className="w-full h-full relative">
            <Image
              alt="Customer support representative"
              src={images.landingPage.contactBg}
              className="w-full h-full object-cover rounded-2xl shadow-xl"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
