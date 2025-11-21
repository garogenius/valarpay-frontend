"use client";

import { textVariant } from "@/utils/motion";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const TermsOfUseContent = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.1 });

  return (
    <div className="w-full relative z-0 bg-white dark:bg-dark-primary overflow-hidden flex flex-col">
      <div className="relative w-full flex justify-center">
        <motion.div
          ref={ref}
          animate={isInView ? "show" : "hidden"}
          initial="hidden"
          className="relative w-full flex flex-col justify-center h-full gap-8 2xs:gap-10 sm:gap-12 pb-20 sm:pb-28 md:pb-32 "
        >
          {/* ================= HEADER SECTION ================= */}
          <div className="relative ">
            <div className="absolute inset-0" aria-hidden>
              <div
                className="w-full h-full"
                style={{
                  background:
                    "repeating-radial-gradient(circle at 50% -20%, rgba(26, 115, 232, 0.05), rgba(26, 115, 232, 0.05) 14px, transparent 14px, transparent 34px)",
                }}
              />
              <svg
                className="absolute bottom-0 left-0 right-0 w-full h-10 sm:h-12 md:h-14 text-white dark:text-dark-primary"
                viewBox="0 0 1440 80"
                preserveAspectRatio="none"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0,50 C240,80 480,0 720,20 C960,40 1200,80 1440,30 L1440,80 L0,80 Z" />
              </svg>
            </div>

            <div className="z-30 w-full relative inset-0 mx-auto flex flex-col justify-center items-center pb-10 pt-32 sm:pb-12 sm:pt-36 md:pb-14 md:pt-40">
              <motion.div
                variants={textVariant(0.1)}
                className="w-[95%] 2xs:w-[90%] lg:w-[85%] 2xl:w-[70%] flex flex-col gap-3 xs:gap-1 text-center py-4"
              >
                <h1 className="text-dark-primary dark:text-text-400 text-2xl xs:text-3xl md:text-4xl xl:text-5xl font-medium xs:leading-[2.4rem] md:leading-[2.8rem] xl:leading-[3.8rem]">
                  Terms of Use
                </h1>

                <p className="text-sm xs:text-base sm:text-xl text-dark-primary dark:text-text-700 font-medium">
                  Last Updated: 11th November 2024
                </p>
              </motion.div>
            </div>
          </div>

          {/* ================= CONTENT ================= */}
          <div className="flex flex-col items-center gap-12">
            <div className="w-[90%] lg:w-[88%] flex flex-col gap-10 text-base xs:text-lg text-text-200 dark:text-text-900">
              {/* ================= 1. Acceptance of Terms ================= */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  1. Acceptance of Terms
                </h4>
                <p>
                  By accessing or using the ValarPay mobile application,
                  website, virtual account services, transfers, withdrawals,
                  bill payments, airtime and data purchases, utilities, gift
                  cards, and all related fintech features (the “Service”), you
                  agree to be bound by these Terms of Use (“Terms”) and our
                  Privacy Policy.
                </p>
                <p>
                  If you do not agree with these Terms, you must discontinue use
                  of the Service immediately.
                </p>
              </div>

              {/* ================= 2. About ValarPay ================= */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  2. About ValarPay (Important Notice)
                </h4>
                <p>
                  ValarPay is a digital financial technology platform owned and
                  operated by <strong>VALAR GLOBAL SERVICES LIMITED</strong>, a
                  company incorporated in Nigeria.
                </p>
                <p>
                  <strong>ValarPay is not a bank</strong> and does not hold a
                  Central Bank of Nigeria (CBN) banking license. All banking,
                  payment processing, virtual accounts, settlement, and
                  regulated services made available through the ValarPay app are
                  powered by licensed microfinance banks, payment providers,
                  switches, and other regulated financial institutions (“Partner
                  Institutions”).
                </p>
                <p>
                  Your funds are held with these licensed institutions, and
                  ValarPay acts solely as a technology provider facilitating
                  access to their regulated services.
                </p>
              </div>

              {/* ================= 3. Modifications ================= */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">3. Modifications</h4>
                <p>
                  We may update or modify these Terms at any time. Changes
                  become effective once published on the app or website.
                  Continued use of the Service signifies your acceptance of the
                  updated Terms.
                </p>
              </div>

              {/* ================= 4. Eligibility ================= */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">4. Eligibility</h4>
                <p>You must be at least 18 years old to use the Service.</p>
                <p>
                  By using the Service, you represent that all information you
                  provide is accurate and that you are legally capable of
                  entering into binding agreements.
                </p>
              </div>

              {/* ================= 5. Account Registration ================= */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  5. Account Registration
                </h4>
                <p>
                  To access certain features, you must create a ValarPay account
                  and complete identity verification (KYC) as required by
                  Nigerian regulations.
                </p>
                <p>
                  You are responsible for maintaining the security of your login
                  credentials and all activities carried out under your account.
                </p>
              </div>

              {/* ================= 6. Use of Service ================= */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  6. Use of the Service
                </h4>
                <p>
                  You agree not to misuse the Service. Prohibited activities
                  include:
                </p>
                <ul className="list-disc list-inside flex flex-col gap-1">
                  <li>Submitting false or misleading information</li>
                  <li>Fraud, money laundering, or illegal transactions</li>
                  <li>Harassment or abuse of other users</li>
                  <li>
                    Attempting to hack, reverse-engineer, or disrupt the Service
                  </li>
                  <li>Unauthorized access to accounts or systems</li>
                </ul>
              </div>

              {/* ================= 7. Intellectual Property ================= */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  7. Intellectual Property
                </h4>
                <p>
                  All content, design, trademarks, and software within the
                  Service are the property of{" "}
                  <strong>VALAR GLOBAL SERVICES LIMITED</strong>.
                </p>
                <p>
                  You may not copy, reproduce, or distribute any part of the
                  Service without our express written permission.
                </p>
              </div>

              {/* ================= 8. User Generated Content ================= */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  8. User-Generated Content
                </h4>
                <p>
                  By submitting any content (reviews, comments, uploads), you
                  grant us a global, royalty-free license to use and display
                  such content. You agree not to upload illegal, harmful, or
                  infringing material.
                </p>
              </div>

              {/* ================= 9. Disclaimers ================= */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">9. Disclaimers</h4>
                <p>
                  The Service is provided “as is” and “as available.” We do not
                  guarantee uninterrupted, error-free service.
                </p>
                <p>
                  ValarPay does not control the uptime or performance of banks,
                  payment channels, card providers, billers, telecom operators,
                  or third-party platforms connected to the Service.
                </p>
              </div>

              {/* ================= 10. Limitation of Liability ================= */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  10. Limitation of Liability
                </h4>
                <p>
                  To the maximum extent permitted by law, VALAR GLOBAL SERVICES
                  LIMITED shall not be liable for any indirect, incidental,
                  consequential, or punitive damages arising from your use of
                  the Service.
                </p>
              </div>

              {/* ================= 11. Termination ================= */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">11. Termination</h4>
                <p>
                  We may suspend or terminate your account without prior notice
                  if you violate these Terms or if required by law or regulatory
                  partners.
                </p>
                <p>
                  You may close your account by contacting support, provided all
                  outstanding obligations are settled.
                </p>
              </div>

              {/* ================= 12. Governing Law ================= */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">12. Governing Law</h4>
                <p>
                  These Terms are governed by the laws of the Federal Republic
                  of Nigeria. Any disputes shall be resolved in Nigerian courts
                  of competent jurisdiction.
                </p>
              </div>

              {/* ================= 13. Contact ================= */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  13. Contact Information
                </h4>
                <p>If you have any questions or concerns, please contact:</p>

                <p>
                  Email: <strong>support@valarpay.com</strong>
                </p>
                <p>
                  Phone: <strong>02013309609</strong>
                </p>
                <p>
                  Address:{" "}
                  <strong>
                    23, OGAGIFO STREET, OFF DBS ROAD, BEFORE GQ SUITES, ASABA,
                    DELTA STATE, NIGERIA.
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfUseContent;
