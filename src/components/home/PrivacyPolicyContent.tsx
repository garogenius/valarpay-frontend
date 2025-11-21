"use client";

import { textVariant } from "@/utils/motion";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const PrivacyPolicyContent = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.1 });

  return (
    <div className="w-full relative z-0 bg-bg-400 dark:bg-dark-primary overflow-hidden flex flex-col">
      <div className="relative w-full flex justify-center">
        <motion.div
          ref={ref}
          animate={isInView ? "show" : "hidden"}
          initial="hidden"
          className="relative w-full flex flex-col justify-center h-full gap-8 2xs:gap-10 sm:gap-12 pb-20 sm:pb-28 md:pb-32 "
        >
          {/* ================= HEADER ================= */}
          <div className="relative ">
            <div className="z-30 bg-bg-1600 dark:bg-bg-1700 w-full relative inset-0 mx-auto flex flex-col justify-center items-center pb-10 pt-32 sm:pb-12 sm:pt-36 md:pb-14 md:pt-40">
              <motion.div
                variants={textVariant(0.1)}
                className="w-[95%] 2xs:w-[90%] lg:w-[85%] 2xl:w-[70%] flex flex-col gap-2 xs:gap-3 sm:gap-4 lg:gap-6 text-center py-4"
              >
                <h1 className="text-text-200 dark:text-text-900 text-2xl xs:text-3xl md:text-4xl xl:text-5xl font-bold xs:leading-[2.4rem] md:leading-[2.8rem] xl:leading-[3.8rem]">
                  VALAR GLOBAL SERVICES LIMITED
                </h1>
                <p className="text-secondary text-2xl lg:text-3xl xl:text-4xl font-medium">
                  Privacy Policy
                </p>
                <p className="text-sm xs:text-base sm:text-xl text-text-200 dark:text-text-900 font-medium">
                  Last Updated: 10th November 2024
                </p>
              </motion.div>
            </div>
          </div>

          {/* ================= CONTENT ================= */}
          <div className=" flex flex-col items-center gap-12">
            <div className="w-[90%] lg:w-[88%] flex flex-col gap-10 text-base xs:text-lg text-text-200 dark:text-text-900">
              {/* ================= Intro ================= */}
              <div className="flex flex-col gap-4">
                <h4>
                  VALAR GLOBAL SERVICES LIMITED (“ValarPay”, “we”, “our”, or
                  “us”) is committed to protecting your personal information and
                  respecting your privacy. This Privacy Policy explains how we
                  collect, use, store, share, and safeguard your information
                  when you use the ValarPay mobile application, website, and
                  related financial technology services.
                </h4>
                <p>
                  By accessing our platform or using our services, you consent
                  to the practices described in this Privacy Policy.
                </p>
              </div>

              {/* ================= 1. Information We Collect ================= */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  1. Information We Collect
                </h4>

                <p>
                  We may collect various categories of information to provide
                  you with secure and compliant financial services. Personal
                  data includes any information relating to an identified or
                  identifiable individual. This may include:
                </p>

                <ul className="list-disc list-inside flex flex-col gap-1">
                  <li>Name and contact details</li>
                  <li>
                    Identification numbers (NIN, BVN, Passport, Driver’s
                    License)
                  </li>
                  <li>Address, email, phone number, and location data</li>
                  <li>
                    Bank details, transaction history, and virtual account data
                  </li>
                  <li>
                    Facial recognition or biometric verification data (where
                    applicable)
                  </li>
                  <li>
                    Device information, browser type, IP address, and operating
                    system
                  </li>
                  <li>Photos, documents, and KYC verification files</li>
                </ul>
              </div>

              {/* ================= 1.1 Personal Data ================= */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  1.1 Personal Information
                </h4>
                <p>
                  We collect personal data that you voluntarily provide during
                  account creation, KYC verification, contact with support, or
                  when performing transactions such as transfers, withdrawals,
                  bill payments, airtime purchases, or card creation.
                </p>
              </div>

              {/* ================= 1.2 Usage Data ================= */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">1.2 Usage Data</h4>
                <p>
                  We automatically collect usage data such as IP address, device
                  identifiers, pages visited, referring URLs, crash reports, and
                  in-app behavior to improve performance, security, and
                  analytics.
                </p>
              </div>

              {/* ================= 1.3 Cookies ================= */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  1.3 Cookies and Tracking Technologies
                </h4>
                <p>
                  Cookies and similar tracking tools help us personalize your
                  experience, enhance security, and analyze user activity on our
                  platform.
                </p>
              </div>

              {/* ================= 2. How We Use Data ================= */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  2. How We Use Your Information
                </h4>
                <p>
                  We may use the information we collect for the following
                  purposes:
                </p>

                <ul className="list-disc list-inside flex flex-col gap-1">
                  <li>To create and manage your ValarPay account</li>
                  <li>
                    To verify your identity and comply with KYC/AML regulations
                  </li>
                  <li>
                    To process transfers, withdrawals, bill payments, and
                    transactions
                  </li>
                  <li>
                    To communicate updates, alerts, and customer support
                    messages
                  </li>
                  <li>
                    To improve service performance, security, and analytics
                  </li>
                  <li>
                    To detect and prevent fraud, financial crime, and
                    unauthorized activity
                  </li>
                  <li>To comply with legal and regulatory requirements</li>
                </ul>
              </div>

              {/* ================= 3. Sharing Your Information ================= */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  3. Sharing Your Information
                </h4>

                <p>We may share your information with the following parties:</p>

                <ul className="list-disc list-inside flex flex-col gap-2">
                  <li>
                    <strong>Partner Institutions:</strong> Licensed microfinance
                    banks, payment providers, and billers who power ValarPay’s
                    regulated services.
                  </li>

                  <li>
                    <strong>Service Providers:</strong> KYC verification
                    vendors, analytics tools, cloud hosting platforms, fraud
                    prevention systems, and customer support providers.
                  </li>

                  <li>
                    <strong>Regulatory Authorities:</strong> When required by
                    law, for compliance, national security, or lawful
                    investigations.
                  </li>

                  <li>
                    <strong>Business Transfers:</strong> If ValarPay undergoes a
                    merger, acquisition, or restructuring, your information may
                    be transferred.
                  </li>
                </ul>
              </div>

              {/* ================= 4. Data Security ================= */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">4. Data Security</h4>
                <p>
                  We implement industry-standard security measures to protect
                  your data, including encryption, secure servers, access
                  controls, authentication systems, and fraud monitoring tools.
                </p>
                <p>
                  However, no transmission method over the internet or mobile
                  networks is 100% secure; therefore, we cannot guarantee
                  absolute security.
                </p>
              </div>

              {/* ================= 5. Your Rights ================= */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  5. Your Rights and Choices
                </h4>

                <p>
                  You may have rights under applicable data protection laws,
                  including:
                </p>

                <ul className="list-disc list-inside flex flex-col gap-1">
                  <li>Right to access and update your personal data</li>
                  <li>Right to correct inaccurate information</li>
                  <li>Right to delete your data where legally permissible</li>
                  <li>Right to restrict or object to certain processing</li>
                  <li>
                    Right to withdraw consent (where processing is based on
                    consent)
                  </li>
                </ul>

                <p>
                  To exercise any rights, contact us at{" "}
                  <strong>support@valarpay.com</strong> or call{" "}
                  <strong>+2349029852374</strong>.
                </p>
              </div>

              {/* ================= 6. Third-Party Links ================= */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">6. Third-Party Links</h4>
                <p>
                  Our app or website may contain links to third-party platforms.
                  This Privacy Policy does not apply to external services, and
                  we recommend reviewing their privacy policies.
                </p>
              </div>

              {/* ================= 7. Policy Changes ================= */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  7. Changes to This Privacy Policy
                </h4>
                <p>
                  We may update this Privacy Policy occasionally. When changes
                  occur, we will update the “Last Updated” date and may notify
                  you through the app or email, where required.
                </p>
              </div>

              {/* ================= 8. Data Retention ================= */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  8. Retention of Your Data
                </h4>
                <p>
                  We retain personal data only for as long as necessary to
                  provide our services, comply with legal obligations, resolve
                  disputes, enforce agreements, or meet regulatory standards
                  such as CBN and Payment Card Industry Data Security Standard
                  (PCI-DSS).
                </p>
              </div>

              {/* ================= 9. Contact Us ================= */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">9. Contact Us</h4>

                <p>
                  If you have questions about this Privacy Policy, contact us
                  at:
                </p>

                <p>
                  <strong>VALAR GLOBAL SERVICES LIMITED</strong>
                </p>
                <p>
                  Address: 23, OGAGIFO STREET, OFF DBS ROAD, BEFORE GQ SUITES,
                  ASABA, DELTA STATE, NIGERIA.
                </p>
                <p>
                  Email: <strong>support@valarpay.com</strong>
                </p>
                <p>
                  Phone: <strong>+2349029852374</strong>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicyContent;
