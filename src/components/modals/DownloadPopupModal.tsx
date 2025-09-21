import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import { CgClose } from "react-icons/cg";
import images from "../../../public/images";
import { textVariant, zoomIn } from "@/utils/motion";

interface DownloadPopupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DownloadPopupModal: React.FC<DownloadPopupModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        aria-hidden="true"
        className="z-[999999] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-black/80 dark:bg-black/60"></div>
        </div>
        <div className="mx-2.5 2xs:mx-4 relative bg-bg-600 dark:bg-bg-1100 px-4 xs:px-8 md:px-16  w-full max-w-4xl max-h-[90%] rounded-2xl ">
          <div
            className="absolute  inset-20 opacity-60 dark:opacity-40"
            style={{
              background: `
                radial-gradient(
                  circle at center,
                  rgba(212, 177, 57, 0.4) 0%,
                  rgba(212, 177, 57, 0.2) 40%,
                  rgba(212, 177, 57, 0.1) 60%,
                  rgba(212, 177, 57, 0) 80%
                )
              `,
              filter: "blur(60px)",
              transform: "scale(1.1)",
            }}
          />
          <span
            onClick={onClose}
            className="absolute top-4 xs:top-6 right-4 xs:right-6 p-2 cursor-pointer bg-bg-1400 rounded-full"
          >
            <CgClose className="text-xl text-black" />
          </span>

          <div className="w-full flex items-center justify-between  gap-3 xs:gap-6  max-sm:py-12 max-lg:py-20">
            <div className="w-full lg:w-[50%] flex flex-col gap-8 xl:gap-10 ">
              <motion.div
                variants={textVariant(0.1)}
                className="w-full  text-text-200 dark:text-text-400 flex flex-col max-xs:items-center gap-4 "
              >
                <h1 className="max-xs:w-full max-sm:w-[80%] max-lg:w-[60%] max-xs:mt-4 text-2xl xs:text-3xl xl:text-4xl font-semibold max-xs:text-center">
                  Try Valarpay On Your Mobile Phone for Free{" "}
                </h1>

                <div className="w-full flex items-center max-xs:justify-center gap-3">
                  <Image
                    alt="app-store"
                    className="w-28 cursor-pointer"
                    src={images.landingPage.appStoreCta}
                  />
                  <Image
                    alt="play-store"
                    className="w-28 cursor-pointer"
                    src={images.landingPage.playStoreCta}
                  />
                </div>
              </motion.div>

              <div className="flex items-center gap-4 max-xs:flex-col max-xs:items-center max-xs:gap-2">
                <motion.div
                  variants={zoomIn(0.2, 0.5)}
                  className="p-2 bg-primary rounded-lg"
                >
                  <Image
                    alt="bar-code"
                    className="w-24 xs:w-16 md:w-20 xl:w-24 2xl:w-32"
                    src={images.landingPage.barCode}
                  />
                </motion.div>
                <p className="w-[60%] xs:w-[50%] sm:w-[40%] lg:w-[80%] text-base sm:text-xl font-semibold max-xs:text-center text-text-200 dark:text-text-400">
                  Scan QR code to download Valarpay App
                </p>
              </div>
            </div>
            <div className="max-lg:hidden  w-[50%] flex justify-">
              <Image
                alt="bg"
                className="w-[90%] xl:w-full"
                src={images.landingPage.heroImage}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DownloadPopupModal;
