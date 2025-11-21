"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import images from "../../../public/images";
import useNavigate from "@/hooks/useNavigate";
import icons from "../../../public/icons";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-white dark:bg-dark-primary text-text-400 w-full flex flex-col justify-center">
      <motion.div className=" w-[90%] mx-auto py-8 xl:py-10">
        <div className="w-full flex max-xs:justify-center">
          <div className="flex items-center gap-2">
            <Image
              onClick={() => navigate("/")}
              src={images.logo}
              alt="logo"
              className="w-8 h-auto"
            />
            <span className="text-xl font-semibold text-primary">VALARPAY</span>
          </div>
        </div>

        <div className="flex max-xl:flex-col items-start gap-8 xs:gap-12 sm:gap-16 xl:gap-12 2xl:gap-20">
          <div className="relative w-full xl:w-[40%] flex flex-col items-start ">
            <p className="max-xs:text-center text-sm 2xs:text-base text-dark-primary dark:text-[#FAFAFA] leading-5 2xs:leading-6 xs:leading-7">
              ValarPay is more than just a financial service provider; we are a
              community dedicated to improving financial well-being. Join
              thousands of satisfied users who trust ValarPay for their
              financial needs. Download the ValarPay app today and experience
              the future of finance in Nigeria.
            </p>
            <div
              className="absolute -top-40 left-[25rem] -inset-32 opacity-60 dark:opacity-40"
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
          </div>
          <div className="z-10 w-full xl:w-[60%] max-sm:gap-y-8 max-md:gap-y-10 grid grid-cols-2 md:grid-cols-3 justify-between text-sm 2xs:text-base">
            <div className="flex flex-col text-dark-primary dark:text-[#FAFAFA] ">
              <h3 className="text-primary text-base xs:text-lg font-semibold mb-2 xs:mb-3">
                Company
              </h3>
              <div className="flex flex-col gap-1.5 xs:gap-2 ">
                <Link
                  href="/about"
                  className="transition-all duration-300 cursor-pointer hover:pl-2"
                >
                  About Us
                </Link>
                <Link
                  href="/coming-soon"
                  className="transition-all duration-300 cursor-pointer hover:pl-2"
                >
                  Join Our Team
                </Link>
                <Link
                  href="/coming-soon"
                  className="transition-all duration-300 cursor-pointer hover:pl-2"
                >
                  Blog
                </Link>
                <Link
                  href="/contact-us"
                  className="transition-all duration-300 cursor-pointer hover:pl-2"
                >
                  Contact Us
                </Link>
                <Link
                  href="/account-deletion"
                  className="transition-all duration-300 cursor-pointer hover:pl-2"
                >
                  Account Deletion
                </Link>
              </div>
            </div>

            <div className="flex flex-col max-md:ml-6 text-dark-primary dark:text-[#FAFAFA] ">
              <h3 className="text-primary text-base xs:text-lg font-semibold mb-2 xs:mb-3">
                Resources
              </h3>
              <div className="flex flex-col gap-1.5 xs:gap-2 ">
                <Link
                  href="/termsOfUse"
                  className="transition-all duration-300 cursor-pointer hover:pl-2"
                >
                  Terms of Use{" "}
                </Link>
                <Link
                  href="/terms&condition"
                  className="transition-all duration-300 cursor-pointer hover:pl-2"
                >
                  Terms & Condition{" "}
                </Link>
                <Link
                  href="/privacyPolicy"
                  className="transition-all duration-300 cursor-pointer hover:pl-2"
                >
                  Privacy Policy{" "}
                </Link>
                <Link
                  href="/dataprotectionpolicy"
                  className="transition-all duration-300 cursor-pointer hover:pl-2"
                >
                  Data Protection Policy
                </Link>
                <Link
                  href="/cookiepolicy"
                  className="transition-all duration-300 cursor-pointer hover:pl-2"
                >
                  Cookies Policy
                </Link>
                <Link
                  href="/disputeresolutionpolicy"
                  className="transition-all duration-300 cursor-pointer hover:pl-2"
                >
                  Dispute & Complaint Handling
                </Link>
                <Link
                  href="/fraudmonitoringandusersecuritypolicy"
                  className="transition-all duration-300 cursor-pointer hover:pl-2"
                >
                  Fraud Monitoring & User Security
                </Link>
                <Link
                  href="/refundPolicy"
                  className="transition-all duration-300 cursor-pointer hover:pl-2"
                >
                  Refund Policy{" "}
                </Link>
              </div>
            </div>

            <div className="flex flex-col text-dark-primary dark:text-[#FAFAFA] ">
              <h3 className="text-primary text-base xs:text-lg font-semibold mb-2 xs:mb-3">
                Info
              </h3>
              <div className="flex flex-col gap-1.5 xs:gap-2 ">
                <a className="">
                  Head office: 23, OGAGIFO STREET OFF DBS ROAD BEFORE GQ SUITES
                  , ASABA, DELTA STATE
                </a>

                <p
                  onClick={() => {
                    window.open("https://wa.me/2348134146906", "_blank");
                  }}
                  className="cursor-pointer"
                >
                  02013309609
                </p>
                <p
                  onClick={() => {
                    window.open("mailto:support@valarpay.com", "_blank");
                  }}
                  className="cursor-pointer"
                >
                  support@valarpay.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="sm:border-t border-border-100  w-full flex justify-center text-dark-primary dark:text-[#FAFAFA] ">
        <div className="w-[90%] flex flex-col md:flex-row justify-between items-center gap-2.5 py-6 sm:py-5">
          <p className="text-sm xs:text-base ">
            © {new Date().getFullYear()} ValarPay All rights reserved
          </p>
          <div className="flex space-x-4 sm:space-x-6 mt-2.5 xs:mt-4 md:mt-0">
            <Link
              href="/coming-soon"
              // target="_blank"
              // rel="noopener noreferrer"
              className=""
            >
              <Image src={icons.socialIcons.facebookIcon} alt="facebook" />
            </Link>
            <Link
              href="/coming-soon"
              // href="https://www.instagram.com/valarpays?igsh=MWYxdW9iY2M1bzVmbg=="

              className=" "
            >
              <Image src={icons.socialIcons.instagramIcon} alt="instagram" />
            </Link>
            <Link
              href="/coming-soon"
              // href="https://www.tiktok.com/@valarpayglobal?_t=ZM-8tjAVR0cYQ1&_r=1"
              // target="_blank"
              // rel="noopener noreferrer"
              className=" "
            >
              <Image src={icons.socialIcons.tiktokIcon} alt="tiktok" />
            </Link>
            <Link
              href="/coming-soon"
              // href="https://youtube.com/@valarpayglobal?si=9LyF8iMK1pwnGX8P"
              // target="_blank"
              // rel="noopener noreferrer"
              className=" "
            >
              <Image src={icons.socialIcons.youtubeIcon} alt="youtube" />
            </Link>

            <Link
              href="/coming-soon"
              // href="https://www.snapchat.com/add/valarpayglobal"
              // target="_blank"
              // rel="noopener noreferrer"
              className=" "
            >
              <Image src={icons.socialIcons.snapchatIcon} alt="snapchat" />
            </Link>

            <Link
              href="/coming-soon"
              // href="https://twitter.com/Valarpays"
              // target="_blank"
              // rel="noopener noreferrer"
              className=" "
            >
              <Image src={icons.socialIcons.twitterIcon} alt="twitter" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
