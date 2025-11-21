"use client";

import { textVariant } from "@/utils/motion";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const CookiePolicyContent = () => {
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
                  Cookies Policy
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
                  This Cookies Policy explains how VALAR GLOBAL SERVICES LIMITED
                  (“ValarPay”) uses cookies and similar tracking technologies on
                  our website, mobile application, and digital platforms.
                </p>
              </div>

              {/* Section 1 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">1. What Are Cookies?</h4>
                <p>
                  Cookies are small text files stored on your device that help
                  us enhance security, improve performance, analyse usage, and
                  remember your preferences.
                </p>
              </div>

              {/* Section 2 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  2. Types of Cookies We Use
                </h4>

                <ul className="list-disc list-inside flex flex-col gap-1">
                  <li>
                    <strong>Essential Cookies:</strong> Required for login,
                    session management, security, and transaction functions.
                  </li>
                  <li>
                    <strong>Performance & Analytics Cookies:</strong> Help us
                    analyse crash logs, navigation patterns, and user
                    engagement.
                  </li>
                  <li>
                    <strong>Functional Cookies:</strong> Remember your
                    preferences, settings, and personalization options.
                  </li>
                  <li>
                    <strong>Security Cookies:</strong> Detect fraud, unusual
                    login attempts, and protect account integrity.
                  </li>
                  <li>
                    <strong>Advertising Cookies (If Enabled):</strong> Used to
                    deliver relevant promotions from ValarPay.
                    <br />
                    *Note: ValarPay does not show third-party ads inside the
                    app.*
                  </li>
                </ul>
              </div>

              {/* Section 3 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  3. Why We Use Cookies
                </h4>
                <ul className="list-disc list-inside flex flex-col gap-1">
                  <li>To keep your session active</li>
                  <li>To analyse and improve app performance</li>
                  <li>To personalise your experience</li>
                  <li>To enhance security and detect fraud</li>
                  <li>To remember device and usage preferences</li>
                </ul>
              </div>

              {/* Section 4 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  4. Third-Party Cookies
                </h4>
                <p>
                  Some cookies may be placed by trusted partners such as
                  analytics providers, cloud hosting services, KYC verification
                  platforms, and payment processors. All third parties operating
                  on our behalf are required to comply with NDPR and applicable
                  data privacy laws.
                </p>
              </div>

              {/* Section 5 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">5. Managing Cookies</h4>
                <p>You can manage cookies via:</p>
                <ul className="list-disc list-inside flex flex-col gap-1">
                  <li>Your browser settings</li>
                  <li>Device privacy controls</li>
                  <li>Clearing cached data</li>
                  <li>Disabling specific categories of cookies</li>
                </ul>

                <p className="mt-2">
                  Disabling essential cookies may limit your ability to use some
                  features of the ValarPay platform.
                </p>
              </div>

              {/* Section 6 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  6. Changes to This Policy
                </h4>
                <p>
                  We may update this Cookies Policy occasionally. Changes will
                  be posted on the ValarPay website or app, and the “Last
                  Updated” date will be refreshed accordingly.
                </p>
              </div>

              {/* Section 7 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">7. Contact Us</h4>
                <p>
                  <strong>VALAR GLOBAL SERVICES LIMITED</strong>
                </p>
                <p>
                  Address: 23, OGAGIFO STREET, OFF DBS ROAD, BEFORE GQ SUITES,
                  ASABA, DELTA STATE.
                </p>
                <p>Email: support@valarpay.com</p>
                <p>Phone: 02013309609</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CookiePolicyContent;
