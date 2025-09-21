"use client";
import SectionWrapper from "@/utils/hoc/SectionWrapper";
import { scaleVariants, staggerContainer, textVariant } from "@/utils/motion";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import images from "../../../../public/images";
import { useTheme } from "@/store/theme.store";

const PartnersImages = [
  images.landingPage.partner1,
  images.landingPage.partner2,
  images.landingPage.partner3,
  images.landingPage.partner4,
  images.landingPage.partner5,
  images.landingPage.partner6,
  images.landingPage.partner7,
  images.landingPage.partner8,
  images.landingPage.partner9,
  images.landingPage.partner10,
  images.landingPage.partner11,
  images.landingPage.partner12,
  images.landingPage.partner13,
  images.landingPage.partner14,
  images.landingPage.partner15,
  images.landingPage.partner16,
  images.landingPage.partner17,
  images.landingPage.partner18,
];

const Providers = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.25 });
  const theme = useTheme();

  const bgStyles = {
    // backgroundImage: "url('/images/home/landingPage/providersBg.svg')", // Adjust the path as needed
    backgroundPosition: "center",
    backgroundColor: theme === "light" ? "#041943" : "#041943",
    backgroundRepeat: "no-repeat",
    zIndex: 10,
  };

  return (
    <div style={bgStyles} className="w-full flex justify-center">
      <motion.div
        ref={ref}
        animate={isInView ? "show" : "hidden"}
        initial="hidden"
        className="w-[90%] lg:w-[88%] flex flex-col gap-10 lg:gap-20 items-center h-full py-12 sm:py-16 lg:py-20"
      >
        <motion.div
          variants={textVariant(0.1)}
          className="w-full 2xs:w-[90%] xs:w-[80%] md:w-[70%] xl:w-[60%] flex flex-col gap-1.5 xs:gap-2.5 xl:gap-4 justify-center items-center text-center text-[#FAFAFA] dark:text-text-400"
        >
          <h1 className="text-2xl 2xs:text-3xl xs:text-4xl xl:text-5xl 2xl:text-6xl font-bold ">
            With Over <span className="text-primary">60</span> Service Provider{" "}
          </h1>
          <p className="text-sm xs:text-base lg:text-lg ">
            Valarpay is more than just a financial service provider; we are a
            community dedicated to improving financial well-being
          </p>
        </motion.div>
        <motion.div
          variants={staggerContainer(0.1, 0.2)}
          className="w-full xs:w-[90%] 2xl:w-[80%] h-full flex flex-wrap items-center justify-center gap-3"
        >
          {PartnersImages.map((item, index) => (
            <motion.div
              variants={scaleVariants}
              whileInView={scaleVariants.whileInView as any}
              key={index}
              className=" "
            >
              <Image
                key={index}
                src={item}
                alt="icons"
                className="w-16 2xs:w-20 xs:w-24 sm:w-28 lg:w-32 xl:w-36 2xl:w-40"
              />
            </motion.div>
          ))}
        </motion.div>{" "}
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Providers, "providers");
