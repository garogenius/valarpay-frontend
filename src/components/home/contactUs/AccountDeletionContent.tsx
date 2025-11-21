"use client";

import { MdMail } from "react-icons/md";
import ContactUsForm from "./ContactUsForm";
import { useRef } from "react";
import { useInView } from "framer-motion";
import { motion } from "framer-motion";
import { zoomIn } from "@/utils/motion";
import { textVariant } from "@/utils/motion";
import { RiFacebookCircleLine } from "react-icons/ri";
import {
  FaInstagram,
  FaPhone,
  FaSnapchat,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import Image from "next/image";
import images from "../../../../public/images";
import AccountDeletionForm from "./AccountDeletionForm";

const AccountDeletionContent = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.25 });

  return (
    <div className="relative w-full flex justify-center overflow-hidden">
      {/* Background image with overlay and curved bottom edge */}
      <div className="absolute inset-0" aria-hidden>
        {/* Full-bleed background image */}
        <Image
          src={images.landingPage.glassBuilding}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Subtle overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg-400/60 via-bg-400/40 to-bg-400/60 dark:from-dark-primary/60 dark:via-dark-primary/40 dark:to-dark-primary/60" />
        {/* Curved bottom divider */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full h-10 sm:h-12 md:h-14 text-bg-400 dark:text-dark-primary"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0,50 C240,80 480,0 720,20 C960,40 1200,80 1440,30 L1440,80 L0,80 Z" />
        </svg>
      </div>
      <motion.div
        ref={ref}
        animate={isInView ? "show" : "hidden"}
        initial="hidden"
        className="w-[90%] lg:w-[88%] flex flex-col justify-center h-full py-10"
      >
        <div className="w-full inset-0 mx-auto flex max-lg:flex-col items-start gap-12 lg:gap-8 xl:gap-10 pt-28 lg:pt-40">
          <div className="relative w-full lg:w-[40%] xl:w-[50%] flex flex-col max-lg:items-center gap-6">
            <div
              className="absolute top-10 -inset-10 opacity-60 dark:opacity-40"
              // style={{
              //   background: `
              //     radial-gradient(
              //       circle at center,
              //       rgba(212, 177, 57, 0.4) 0%,
              //       rgba(212, 177, 57, 0.2) 40%,
              //       rgba(212, 177, 57, 0.1) 60%,
              //       rgba(212, 177, 57, 0) 80%
              //     )
              //   `,
              //   filter: "blur(60px)",
              //   transform: "scale(1.1)",
              // }}
            />
            <motion.div
              variants={textVariant(0.1)}
              className="z-30 w-full sm:w-[90%] md:w-[80%] lg:w-[90%] xl:w-[80%] text-text-200 dark:text-text-400 flex flex-col max-lg:items-center max-lg:text-center gap-2 xs:gap-3"
            >
              <h1 className="text-3xl 2xs:text-4xl xs:text-5xl xl:text-6xl 2xl:text-7xl font-bold leading-[2.4rem] 2xs:leading-[2.8rem] xs:leading-[3.5rem] xl:leading-[4rem] 2xl:leading-[5rem]">
                Account Deletion (ValarPay)
              </h1>
              <p className="text-base 2xs:text-lg xl:text-xl leading-[1.5rem] xl:leading-[2rem]">
                You may request to permanently delete your ValarPay account at
                any time. Once your deletion request is processed, you will no
                longer be able to log in, and all non-essential personal data
                associated with your account will be permanently removed from
                our systems.
              </p>
            </motion.div>
            <div className="flex flex-col max-lg:items-center gap-4 lg:gap-6">
              <p className="font-semibold text-lg text-text-200 dark:text-text-400">
                Social Handles
              </p>
              <motion.div
                className="z-20 flex items-center gap-2.5 2xs:gap-4 text-2xl text-secondary"
                variants={zoomIn(0.2, 0.5)}
              >
                <a
                  href="https://www.facebook.com/profile.php?id=100084829514458"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-bg-1200"
                >
                  <RiFacebookCircleLine />
                </a>
                <a
                  href="https://www.instagram.com/nattypays?igsh=MWYxdW9iY2M1bzVmbg=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-bg-1200"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://www.tiktok.com/@nattypayglobal?_t=ZM-8tjAVR0cYQ1&_r=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-bg-1200"
                >
                  <FaTiktok />
                </a>
                <a
                  href="https://youtube.com/@nattypayglobal?si=9LyF8iMK1pwnGX8P"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-bg-1200"
                >
                  <FaYoutube />
                </a>
                <a
                  href="https://www.snapchat.com/add/nattypayglobal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-bg-1200"
                >
                  <FaSnapchat />
                </a>
                <a
                  href="https://twitter.com/Nattypays"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-bg-1200"
                >
                  <FaXTwitter />
                </a>
              </motion.div>
              <div className="z-20 flex flex-col gap-2 text-text-200 dark:text-text-400">
                <div
                  onClick={() => {
                    window.open("https://wa.me/2349029852374", "_blank");
                  }}
                  className="cursor-pointer flex items-center gap-1 "
                >
                  <FaPhone className="text-xl text-text-1000" />
                  <p className="">02013309609</p>
                </div>
                <div
                  onClick={() => {
                    window.open("mailto:support@valarpay.com", "_blank");
                  }}
                  className="cursor-pointer flex items-center gap-2"
                >
                  <MdMail className="text-xl text-text-1000" />
                  <p className="">support@valarpay.com </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative w-full lg:w-[60%] xl:w-[50%] h-full flex max-lg:justify-center">
            <AccountDeletionForm />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AccountDeletionContent;
