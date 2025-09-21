"use client";
import { motion } from "framer-motion";
import { textVariant } from "@/utils/motion";
import Image from "next/image";
import images from "../../../../public/images";

const TopHero = () => {
  return (
    <section className="relative w-full flex justify-center overflow-hidden">
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

      {/* Content */}
      <motion.div
        variants={textVariant(0.1)}
        initial="hidden"
        animate="show"
        className="relative w-[90%] lg:w-[88%] max-w-6xl py-16 sm:py-20 md:py-28 text-center"
      >
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-4">
          FAQs
        </div>
        <h1 className="text-dark-primary dark:text-text-400 font-bold text-3xl sm:text-4xl md:text-5xl leading-tight">
          Here are some of the <span className="text-secondary">answers</span> to your <span className="text-secondary">questions</span> and doubts
        </h1>
      </motion.div>
    </section>
  );
};

export default TopHero;

