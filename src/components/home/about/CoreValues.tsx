"use client";
import { CoreValuesData } from "@/constants";
import SectionWrapper from "@/utils/hoc/SectionWrapper";
import { scaleVariants, staggerContainer, textVariant, fadeIn } from "@/utils/motion";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import images from "../../../../public/images";

const CoreValues = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.25 });

  return (
    <div className="relative w-full flex justify-center">
      <motion.div
        ref={ref}
        animate={isInView ? "show" : "hidden"}
        initial="hidden"
        className="w-full flex flex-col gap-0"
      >
        {/* Services-style Title Section */}
        <div className="w-full flex flex-col items-center bg-[#F2F2F2] dark:bg-dark-primary py-10 md:py-16">
          <div className="w-[90%] md:w-[80%] lg:w-[70%] flex flex-col items-center text-center">
            <motion.span
              variants={fadeIn("up", "spring", 0.05, 0.5)}
              className="text-xs md:text-sm tracking-[0.2em] text-secondary font-semibold"
            >
              OUR VALUES
            </motion.span>
            <motion.h2
              variants={textVariant(0.1)}
              className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-text-200 dark:text-text-400"
            >
              Our Core Values
            </motion.h2>
            <motion.p
              variants={fadeIn("up", "spring", 0.15, 0.5)}
              className="mt-1.5 text-text-1000 dark:text-text-400/80 text-sm md:text-base max-w-2xl"
            >
              The principles that guide how we build and serve every customer.
            </motion.p>
          </div>
        </div>
        <div className="w-[90%] lg:w-[88%] mx-auto flex flex-col gap-6 xs:gap-8 pb-8 xs:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-8 lg:gap-12 items-start py-3 2xs:py-5 md:py-6">
            {/* Left: Cards */}
            <div className="flex flex-col">
              <motion.div
                variants={staggerContainer(0.1, 0.2)}
                className="grid grid-cols-1 md:grid-cols-2 gap-3 xl:gap-4 place-items-start"
              >
                {CoreValuesData.map((item, index) => (
                  <motion.div
                    variants={scaleVariants}
                    whileInView={scaleVariants.whileInView as any}
                    key={index}
                    className="flex flex-col items-center text-center gap-2 2xs:gap-3 xl:gap-4 rounded-xl bg-bg-600 dark:bg-tertiary px-3 2xs:px-3.5 lg:px-5 py-4 2xs:py-5 lg:py-6 2xl:py-8 w-full max-w-[520px] md:max-w-[460px] xl:max-w-[420px]"
                  >
                    <div className="rounded-lg flex justify-center items-center p-2 bg-primary overflow-hidden">
                      <Image
                        alt="icon"
                        src={item.image}
                        width={48}
                        height={48}
                        className="w-[20px] h-[20px] object-contain"
                      />
                    </div>
                    <div className="flex flex-col items-center gap-0.5 xl:gap-1.5 2xl:gap-2.5">
                      <h2 className="text-base 2xs:text-lg 2xl:text-xl text-dark-primary dark:text-text-400 font-semibold">
                        {item.title}
                      </h2>
                      <p className="text-dark-primary dark:text-text-400 text-xs xs:text-sm 2xl:text-base">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Right: Illustration aligned with Core Values (reduced slightly more) */}
            <div className="w-full h-full flex justify-center lg:justify-end">
              <motion.div
                className="w-[88%] sm:w-[86%] md:w-[84%] lg:w-[90%] xl:w-[88%] max-w-[760px]"
                variants={fadeIn("left", "spring", 0.5, 0.75)}
              >
                <Image alt="planet" src={images.about.planet} className="w-full h-auto" />
              </motion.div>
            </div>
          </div>
        </div>
        <div
          className="absolute inset-60 -left-80 bottom-0 opacity-40"
          style={{
            // background: `
            //     radial-gradient(
            //       circle at center,
            //       rgba(212, 177, 57, 0.4) 0%,
            //       rgba(212, 177, 57, 0.2) 40%,
            //       rgba(212, 177, 57, 0.1) 60%,
            //       rgba(212, 177, 57, 0) 80%
            //     )
            //   `,
            // filter: "blur(60px)",
            // transform: "scale(1.1)",
          }}
        />
      </motion.div>
    </div>
  );
};

export default SectionWrapper(CoreValues, "coreValues");
