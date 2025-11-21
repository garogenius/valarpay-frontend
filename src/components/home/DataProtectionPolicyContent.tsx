"use client";

import { textVariant } from "@/utils/motion";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const DataProtectionPolicyContent = () => {
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
                className="w-[95%] sm:w-[90%] lg:w-[85%] 2xl:w-[70%] flex flex-col text-center gap-2 sm:gap-3 lg:gap-6"
              >
                <h1 className="text-text-200 dark:text-text-900 text-3xl md:text-4xl xl:text-5xl font-bold">
                  Data Protection Policy
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
                  VALAR GLOBAL SERVICES LIMITED (“ValarPay”) is committed to
                  safeguarding your personal data and ensuring compliance with
                  the Nigeria Data Protection Regulation (NDPR), Central Bank of
                  Nigeria (CBN) guidelines, and all applicable data protection
                  laws. This Data Protection Policy outlines how we collect,
                  process, store, protect, and share your personal information.
                </p>
              </div>

              {/* Section 1 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  1. Purpose of This Policy
                </h4>
                <p>
                  This Policy ensures that all personal data handled by ValarPay
                  is processed lawfully, securely, and transparently in
                  accordance with regulatory requirements and international best
                  practices.
                </p>
              </div>

              {/* Section 2 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">2. Scope</h4>
                <p>
                  This Policy applies to all users of the ValarPay mobile app,
                  website, employees, partners, contractors, and third-party
                  service providers who process personal data on behalf of
                  ValarPay.
                </p>
              </div>

              {/* Section 3 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  3. Lawful Basis for Processing
                </h4>
                <p>We process personal data under these legal bases:</p>
                <ul className="list-disc list-inside">
                  <li>Consent</li>
                  <li>Legal obligation (CBN, NDIC, AML/CFT)</li>
                  <li>Contractual necessity</li>
                  <li>Legitimate interest</li>
                  <li>Vital interest</li>
                </ul>
              </div>

              {/* Section 4 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  4. Data Protection Principles
                </h4>
                <p>ValarPay adheres to NDPR principles of:</p>
                <ul className="list-disc list-inside">
                  <li>Lawfulness, fairness, and transparency</li>
                  <li>Purpose limitation</li>
                  <li>Data minimization</li>
                  <li>Accuracy</li>
                  <li>Storage limitation</li>
                  <li>Integrity and confidentiality</li>
                </ul>
              </div>

              {/* Section 5 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  5. Categories of Personal Data
                </h4>
                <p>We process the following types of personal data:</p>
                <ul className="list-disc list-inside">
                  <li>Identification data (BVN, NIN, Passport, etc.)</li>
                  <li>Contact information</li>
                  <li>Financial/transaction data</li>
                  <li>Biometric verification data</li>
                  <li>Device and usage data</li>
                  <li>KYC documents</li>
                </ul>
              </div>

              {/* Section 6 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  6. Data Storage & Retention
                </h4>
                <p>
                  Personal data is retained only for as long as necessary to
                  deliver services or comply with legal and regulatory
                  requirements. Sensitive financial records may be retained for
                  5–7 years per CBN/AML regulations.
                </p>
              </div>

              {/* Section 7 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">7. Data Sharing</h4>
                <p>We share data only with:</p>
                <ul className="list-disc list-inside">
                  <li>Licensed partner banks/payment providers</li>
                  <li>KYC/identity verification vendors</li>
                  <li>Regulators (CBN, NDIC, EFCC, NFIU)</li>
                  <li>Security and fraud monitoring partners</li>
                </ul>
                <p>
                  <strong>Your data is never sold.</strong>
                </p>
              </div>

              {/* Section 8 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">8. Your Rights</h4>
                <p>You may request to:</p>
                <ul className="list-disc list-inside">
                  <li>Access your data</li>
                  <li>Update/correct data</li>
                  <li>Request deletion (where legally permissible)</li>
                  <li>Restrict processing</li>
                  <li>Withdraw consent</li>
                </ul>

                <p>
                  Contact: <strong>support@valarpay.com</strong> •
                  +2349029852374
                </p>
              </div>

              {/* Section 9 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">9. Security Measures</h4>
                <p>
                  We employ advanced security controls including encryption,
                  authentication, fraud monitoring, PCI-DSS compliance, and
                  periodic security audits to protect your data.
                </p>
              </div>

              {/* Section 10 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  10. Data Breach Notification
                </h4>
                <p>
                  In case of a data breach, ValarPay will notify affected users
                  and regulatory authorities in accordance with NDPR and
                  applicable laws.
                </p>
              </div>

              {/* Section 11 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">11. Contact Us</h4>
                <p>
                  <strong>VALAR GLOBAL SERVICES LIMITED</strong>
                </p>
                <p>
                  23, OGAGIFO STREET, OFF DBS ROAD, BEFORE GQ SUITES, ASABA,
                  DELTA STATE.
                </p>
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

export default DataProtectionPolicyContent;
