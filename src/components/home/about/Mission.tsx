"use client";
import SectionWrapper from "@/utils/hoc/SectionWrapper";
import { fadeIn, textVariant } from "@/utils/motion";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import images from "../../../../public/images";

const Mission = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.25 });
  return (
    <div className="relative w-full flex justify-center dark:bg-dark-primary">
      <motion.div
        ref={ref}
        animate={isInView ? "show" : "hidden"}
        initial="hidden"
        className="w-[90%] lg:w-[88%] flex flex-col justify-center h-full py-10"
      >
        <div className="inset-0 mx-auto flex max-lg:flex-col-reverse lg:justify-between lg:items-center pt-8 lg:py-16 gap-10">
          <div className=" w-full lg:w-[60%] flex flex-col gap-6">
            <motion.div
              variants={textVariant(0.1)}
              className="z-10 full 2xs:w-[95%] text-text-900 flex flex-col"
            >
              <h1 className="text-2xl 2xs:text-3xl xs:text-4xl text-dark-primary dark:text-text-400 font-bold leading-[2.4rem] 2xs:leading-[2.8rem] xs:leading-[3.5rem] xl:leading-[4rem] 2xl:leading-[5rem]">
                Our Mission{" "}
              </h1>
              <p className="text-sm 2xs:text-base leading-[1.5rem] text-dark-primary dark:text-text-400">
                Our mission at Valarpay is to deliver cutting-edge global
                financial services that improve the lives of Nigerians by
                offering unparalleled convenience, robust security, and
                financial freedom. We strive to bridge the gap between
                traditional banking and modern financial needs, ensuring that
                every individual, regardless of their location or socio-economic
                status, has access to reliable financial tools.
              </p>
            </motion.div>

            <motion.div
              variants={textVariant(0.1)}
              className="z-10 full 2xs:w-[95%] text-text-900 flex flex-col"
            >
              <h1 className="text-2xl 2xs:text-3xl xs:text-4xl text-dark-primary dark:text-text-400 font-bold leading-[2.4rem] 2xs:leading-[2.8rem] xs:leading-[3.5rem] xl:leading-[4rem] 2xl:leading-[5rem]">
                The Vision{" "}
              </h1>
              <p className="text-sm 2xs:text-base leading-[1.5rem] text-dark-primary dark:text-text-400">
                We envision becoming the most trusted and widely used financial
                service provider across the globe. Our goal is to transform the
                financial landscape by continually innovating and expanding our
                services to meet the evolving needs of our customers. We aim to
                be a catalyst for economic growth and prosperity, helping
                individuals and businesses thrive in the digital age.
              </p>
            </motion.div>
          </div>
          <div className="w-full lg:w-[40%] h-full flex justify-center lg:justify-end">
            <motion.div
              className="max-2xs:w-[90%] max-md:w-[80%] max-lg:w-[60%]"
              variants={fadeIn("left", "spring", 0.5, 0.75)}
            >
              <Image alt="planet" src={images.about.planet} className=" " />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Mission, "mission");
