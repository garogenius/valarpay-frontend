"use client";

import { textVariant } from "@/utils/motion";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const NonBankDisclosureContent = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.1 });

  return (
    <div className="w-full relative z-0 bg-white dark:bg-dark-primary overflow-hidden flex flex-col">
      <div className="relative w-full flex justify-center">

        <motion.div
          ref={ref}
          animate={isInView ? "show" : "hidden"}
          initial="hidden"
          className="relative w-full flex flex-col justify-center h-full gap-8 pb-20 sm:pb-28 md:pb-32"
        >

          {/* ================= HEADER ================= */}
          <div className="relative">
            <div className="z-30 bg-bg-1600 dark:bg-bg-1700 w-full relative mx-auto flex flex-col justify-center items-center pb-10 pt-32 sm:pb-12 sm:pt-36 md:pb-14 md:pt-40">
              <motion.div
                variants={textVariant(0.1)}
                className="w-[95%] sm:w-[90%] lg:w-[85%] 2xl:w-[70%] text-center flex flex-col gap-2 sm:gap-3 lg:gap-6"
              >
                <h1 className="text-text-200 dark:text-text-900 text-3xl md:text-4xl xl:text-5xl font-bold">
                  Non-Bank Disclosure & Partner Institution Notice
                </h1>
                <p className="text-secondary text-lg sm:text-xl md:text-2xl font-medium">
                  VALAR GLOBAL SERVICES LIMITED
                </p>
                <p className="text-sm sm:text-base text-text-200 dark:text-text-900 font-medium">
                  Last Updated: 10th November 2024
                </p>
              </motion.div>
            </div>
          </div>

          {/* ================= CONTENT ================= */}
          <div className="flex flex-col items-center">
            <div className="w-[90%] lg:w-[88%] flex flex-col gap-10 text-base xs:text-lg text-text-200 dark:text-text-900">

              {/* Intro */}
              <div className="flex flex-col gap-4">
                <p>
                  ValarPay is a financial technology platform operated by 
                  <strong> VALAR GLOBAL SERVICES LIMITED</strong>. This Non-Bank Disclosure 
                  is issued to ensure full transparency regarding the nature of our 
                  services, our regulatory posture, and the role of our licensed 
                  financial partners.
                </p>
                <p>
                  This document is required for compliance with the Google Play Store, 
                  NDPR, CBN Consumer Protection Guidelines, and global fintech 
                  transparency standards.
                </p>
              </div>

              {/* Section 1 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">1. ValarPay Is Not a Bank</h4>
                <p>
                  ValarPay is <strong>NOT</strong> a bank, microfinance bank, or financial 
                  institution and does not independently hold or insure customer funds.
                </p>

                <p>
                  ValarPay provides technology, platform services, digital wallet 
                  interfaces, and transaction processing using APIs and licensed 
                  financial partners who are regulated by the Central Bank of Nigeria 
                  (CBN).
                </p>
              </div>

              {/* Section 2 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  2. Licensed Financial Partners
                </h4>
                <p>
                  All banking-related services on ValarPay—such as virtual accounts, 
                  deposits, transfers, withdrawals, and settlements—are provided through 
                  CBN-licensed partner institutions, including:
                </p>

                <ul className="list-disc list-inside flex flex-col gap-1">
                  <li>Licensed Microfinance Banks</li>
                  <li>Payment Service Providers (PSPs)</li>
                  <li>Switches and Card Processors</li>
                  <li>CBN-licensed Mobile Money Operators</li>
                </ul>

                <p>
                  These partners are responsible for account issuance, custody of funds, 
                  settlement, compliance, KYC/AML requirements, and all regulated banking 
                  operations.
                </p>
              </div>

              {/* Section 3 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  3. How Virtual Accounts and Wallets Work
                </h4>
                <p>
                  Virtual accounts, wallets, and bank account numbers displayed within 
                  ValarPay are created, managed, and maintained by our licensed partner 
                  financial institutions. ValarPay acts only as a digital interface and 
                  does not store or manage customer funds directly.
                </p>
              </div>

              {/* Section 4 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  4. Regulatory Compliance
                </h4>
                <p>
                  ValarPay complies with NDPR, CBN Consumer Protection Framework, PCI-DSS, 
                  AML/CFT laws, and all applicable fintech regulations through our 
                  regulated partners.
                </p>

                <p>Our partners are responsible for:</p>

                <ul className="list-disc list-inside flex flex-col gap-1">
                  <li>KYC verification & identity validation</li>
                  <li>Compliance with AML/CTF regulations</li>
                  <li>Fund custody & settlement</li>
                  <li>Transaction processing</li>
                  <li>Deposits & withdrawals</li>
                  <li>Fraud monitoring & regulatory reporting</li>
                </ul>
              </div>

              {/* Section 5 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  5. Risk Disclosure
                </h4>
                <p>
                  As a fintech platform, ValarPay provides access to services offered by 
                  regulated partners. While we implement robust security and monitoring 
                  measures, ValarPay is not responsible for:
                </p>

                <ul className="list-disc list-inside flex flex-col gap-1">
                  <li>Bank processing delays</li>
                  <li>Downtime from partner institutions</li>
                  <li>Failed settlement caused by third-party institutions</li>
                  <li>Regulatory actions affecting partner services</li>
                </ul>

                <p>
                  In such cases, ValarPay will coordinate with the affected institution to 
                  resolve issues promptly.
                </p>
              </div>

              {/* Section 6 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">6. Insurance Notice</h4>
                <p>
                  Funds held with our licensed microfinance bank partners may be insured 
                  up to the limits provided by the Nigeria Deposit Insurance Corporation 
                  (NDIC), depending on the partner bank’s insurance policy.
                </p>

                <p>
                  ValarPay itself does not provide deposit insurance.
                </p>
              </div>

              {/* Section 7 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  7. Responsibilities of ValarPay
                </h4>
                <p>
                  ValarPay is responsible for:
                </p>

                <ul className="list-disc list-inside flex flex-col gap-1">
                  <li>Providing a secure fintech platform</li>
                  <li>Maintaining app and system availability</li>
                  <li>Customer support and inquiry handling</li>
                  <li>Technical integration with partner banks</li>
                  <li>Data privacy and protection compliance</li>
                </ul>
              </div>

              {/* Section 8 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">8. Customer Support</h4>

                <p>
                  For transaction-related issues, ValarPay may be required to escalate 
                  matters to the responsible partner institution for resolution.
                </p>

                <p className="mt-2">Contact Us:</p>

                <p><strong>VALAR GLOBAL SERVICES LIMITED</strong></p>
                <p>23, OGAGIFO STREET, OFF DBS ROAD, BEFORE GQ SUITES, ASABA, DELTA STATE.</p>
                <p>Email: support@valarpay.com</p>
                <p>Phone: +2349029852374</p>
              </div>

            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default NonBankDisclosureContent;
