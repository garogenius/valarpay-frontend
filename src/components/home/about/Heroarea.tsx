"use client";
import { motion, useInView } from "framer-motion";
import { SectionWrapper } from "@/utils/hoc";
import { textVariant, fadeIn } from "@/utils/motion";
import { useRef } from "react";

const Heroarea = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.25 });

  return (
    <div className="relative w-full flex justify-center">
      <motion.div
        ref={ref}
        animate={isInView ? "show" : "hidden"}
        initial="hidden"
        className="w-full flex flex-col"
      >
        {/* Services-style Title Section */}
        <div className="w-full flex flex-col items-center bg-[#F2F2F2] dark:bg-dark-primary py-10 md:py-16">
          <div className="w-[90%] md:w-[80%] lg:w-[70%] flex flex-col items-center text-center">
            <motion.span
              variants={fadeIn("up", "spring", 0.05, 0.5)}
              className="text-xs md:text-sm tracking-[0.2em] text-secondary font-semibold"
            >
              ABOUT
            </motion.span>
            <motion.h2
              variants={textVariant(0.1)}
              className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-text-200 dark:text-text-400"
            >
              About ValarPay
            </motion.h2>
            <motion.p
              variants={fadeIn("up", "spring", 0.15, 0.5)}
              className="mt-1.5 text-text-1000 dark:text-text-400/80 text-sm md:text-base max-w-2xl"
            >
              Learn who we are, our mission, vision and the story behind ValarPay.
            </motion.p>
          </div>
        </div>
        <div className="w-[90%] lg:w-[88%] mx-auto flex flex-col justify-center h-full pb-16 pt-10 sm:pb-20 sm:pt-12 md:pb-28 md:pt-16">
          {/* Top section: Left title, Right content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-start">
            {/* Left - Title */}
            <motion.div
              variants={textVariant(0.1)}
              className="text-dark-primary dark:text-text-400 flex flex-col gap-3"
            >
              <p className="text-sm xs:text-base lg:text-lg leading-relaxed">
             NATTY GROUP UK LIMITED. is a registered Fin Tech company
                in Nigeria, committed to revolutionizing local and global
                financial services by providing innovative, secure, and
                user-friendly solutions that cater to the diverse needs of our
                customers. Founded with the vision of enhancing financial
                inclusion and empowering individuals and businesses, Valarpay is
                designed to offer a seamless and comprehensive financial
                experience.
              </p>
              <p className="text-sm xs:text-base lg:text-lg leading-relaxed">
                We focus on simplifying everyday money management for people and
                businesses by enabling fast payments, reliable transfers, bill
                settlement, and access to card and wallet services. Our
                platforms are built on modern infrastructure with strong
                security, compliance, and customer support at the core—so
                users can transact with confidence across channels and devices.
              </p>
              {/* <p className="text-sm xs:text-base lg:text-lg leading-relaxed">
                Beyond payments, we enable growth with tools that support daily
                operations—from collections to payouts—so individuals and
                businesses can manage finances seamlessly and scale with ease.
              </p> */}
               <h1 className="text-2xl text-secondary xs:text-3xl lg:text-4xl font-bold leading-tight">
                The Story{" "}
              </h1>

              <p className="text-sm xs:text-base lg:text-lg leading-[1.6rem] xs:leading-[1.8rem]">
                At NATTY GROUP UK LIMITED, the Story is passionate and
                determined, driven by the desire to bring high-quality and standard
                financial services to individuals locally and globally. As VGSL
                flourished in Onitsha, its influence expanded beyond. Branches
                sprouted in Asaba, Delta State, and the legacy continued to thrive
                in  Asaba Delta State, all of the country and worldwide.
                <br />
                As we continue to expand, we remain unwavering in upholding
                our commitment to high-quality standards, delivering financial
                service that positively impact digital lives and desires in
                individuals on their journey toward
              </p>
              {/* Mission under About */}
              <motion.div
                variants={textVariant(0.1)}
                className="z-10 full 2xs:w-[95%] text-text-900 flex flex-col"
              >
               
              </motion.div>
            </motion.div>

            {/* Right - Paragraphs */}
            <motion.div
              variants={textVariant(0.15)}
              className="text-dark-primary dark:text-text-400 flex flex-col gap-4"
            >
            
            <h1 className="text-2xl text-secondary xs:text-3xl lg:text-4xl font-bold leading-tight">
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

                <h1 className="text-2xl text-secondary xs:text-3xl lg:text-4xl font-bold leading-tight">
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
        </div>
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Heroarea, "heroarea");
