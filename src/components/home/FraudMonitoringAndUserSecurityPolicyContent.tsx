"use client";

import { textVariant } from "@/utils/motion";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const FraudMonitoringAndUserSecurityPolicyContent = () => {
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
            <div className="z-30 bg-bg-1600 dark:bg-bg-1700 w-full mx-auto flex flex-col justify-center items-center pb-10 pt-32 sm:pb-12 sm:pt-36 md:pb-14 md:pt-40">
              <motion.div
                variants={textVariant(0.1)}
                className="w-[95%] sm:w-[90%] lg:w-[85%] 2xl:w-[70%] text-center flex flex-col gap-2 sm:gap-3 lg:gap-6"
              >
                <h1 className="text-text-200 dark:text-text-900 text-3xl md:text-4xl xl:text-5xl font-bold">
                  Fraud Monitoring & User Security Policy
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
                  ValarPay prioritizes the security of all users, transactions,
                  and digital interactions across the platform. This Fraud
                  Monitoring & User Security Policy outlines the safeguards,
                  monitoring systems, user obligations, and preventive measures
                  implemented to protect users and ensure compliance with CBN,
                  NDIC, NDPR, and AML/CFT regulations.
                </p>
                <p>
                  By using ValarPay, you agree to follow all security guidelines
                  outlined in this Policy.
                </p>
              </div>

              {/* Section 1 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  1. Purpose of This Policy
                </h4>

                <p>This Policy establishes:</p>

                <ul className="list-disc list-inside flex flex-col gap-1">
                  <li>How ValarPay monitors transactions for fraud</li>
                  <li>Measures used to secure user data and accounts</li>
                  <li>Responsibilities of users to maintain security</li>
                  <li>Procedures for reporting suspicious activity</li>
                </ul>
              </div>

              {/* Section 2 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  2. Fraud Prevention Systems
                </h4>

                <p>
                  ValarPay utilizes advanced tools and internal controls to
                  detect fraudulent activities, including:
                </p>

                <ul className="list-disc list-inside flex flex-col gap-1">
                  <li>Real-time transaction monitoring</li>
                  <li>Behavioral and device analytics</li>
                  <li>Multi-layer authentication</li>
                  <li>AI-based fraud scoring</li>
                  <li>IP address and geolocation risk detection</li>
                  <li>Blacklist/whitelist system checks</li>
                  <li>Automated suspicious activity alerts</li>
                </ul>
              </div>

              {/* Section 3 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  3. Account & Identity Security
                </h4>

                <p>To secure your account and identity, ValarPay employs:</p>

                <ul className="list-disc list-inside flex flex-col gap-1">
                  <li>Strong password enforcement</li>
                  <li>Two-Factor Authentication (2FA) where applicable</li>
                  <li>End-to-end encryption of sensitive information</li>
                  <li>KYC verification using licensed partners</li>
                  <li>Device binding and login risk assessments</li>
                  <li>Biometric authentication (if enabled by user)</li>
                </ul>
              </div>

              {/* Section 4 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  4. AML/CFT Compliance
                </h4>

                <p>
                  ValarPay follows Anti-Money Laundering (AML) and
                  Counter-Financing of Terrorism (CFT) guidelines via its
                  licensed partner institutions. This includes:
                </p>

                <ul className="list-disc list-inside flex flex-col gap-1">
                  <li>KYC/identity verification</li>
                  <li>Flagging suspicious transactions</li>
                  <li>Transaction limits based on KYC tier</li>
                  <li>
                    Mandatory reporting to regulatory authorities (where
                    applicable)
                  </li>
                  <li>Periodic account reviews and audits</li>
                </ul>
              </div>

              {/* Section 5 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  5. User Responsibilities
                </h4>

                <p>To maintain account security, users must:</p>

                <ul className="list-disc list-inside flex flex-col gap-1">
                  <li>Keep login details confidential</li>
                  <li>Use strong passwords</li>
                  <li>Enable security features such as biometrics</li>
                  <li>Avoid sharing OTPs or verification codes</li>
                  <li>
                    Ensure device security and avoid using compromised networks
                  </li>
                  <li>Update ValarPay app regularly for security patches</li>
                </ul>

                <p>
                  ValarPay will never request your password, OTP, PIN, or
                  private keys.
                </p>
              </div>

              {/* Section 6 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  6. Suspicious Activity & Fraud Reporting
                </h4>

                <p>
                  Users should immediately report any fraudulent, unauthorized,
                  or suspicious activity on their account.
                </p>

                <p>To report suspicious activity:</p>

                <ul className="list-disc list-inside flex flex-col gap-1">
                  <li>
                    Email: <strong>support@valarpay.com</strong>
                  </li>
                  <li>
                    Phone: <strong>+2349029852374</strong>
                  </li>
                  <li>In-app report button (where applicable)</li>
                </ul>

                <p>
                  ValarPay may temporarily restrict or freeze an account during
                  investigation to prevent financial loss.
                </p>
              </div>

              {/* Section 7 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  7. Transaction Monitoring
                </h4>

                <p>All transactions on ValarPay are monitored for:</p>

                <ul className="list-disc list-inside flex flex-col gap-1">
                  <li>Unusual spending patterns</li>
                  <li>High-risk transactions</li>
                  <li>Device or location anomalies</li>
                  <li>Attempts to circumvent KYC or limits</li>
                  <li>Blocked or fraudulent beneficiaries</li>
                </ul>

                <p>
                  Transactions may be delayed, reversed, or rejected if flagged
                  by our fraud prevention systems.
                </p>
              </div>

              {/* Section 8 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  8. Data & Infrastructure Security
                </h4>

                <p>
                  ValarPay follows strict infrastructure-level security
                  measures:
                </p>

                <ul className="list-disc list-inside flex flex-col gap-1">
                  <li>Cloud security controls</li>
                  <li>Firewall and intrusion detection systems</li>
                  <li>Encrypted storage and anonymization</li>
                  <li>Regular security audits & penetration testing</li>
                  <li>PCI-DSS compliance for card data (via partners)</li>
                </ul>
              </div>

              {/* Section 9 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  9. Resolution of Fraud Cases
                </h4>

                <p>
                  Fraud incidents are handled in collaboration with our licensed
                  partner financial institutions.
                </p>

                <p>Fraud case resolutions may involve:</p>

                <ul className="list-disc list-inside flex flex-col gap-1">
                  <li>Account verification</li>
                  <li>Transaction reversal (where applicable)</li>
                  <li>Law enforcement referral (if necessary)</li>
                  <li>
                    Permanent account restriction (in confirmed fraud cases)
                  </li>
                </ul>

                <p>
                  Users will be informed of investigation outcomes in line with
                  regulatory timeframes.
                </p>
              </div>

              {/* Section 10 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">10. Contact Us</h4>

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

export default FraudMonitoringAndUserSecurityPolicyContent;
