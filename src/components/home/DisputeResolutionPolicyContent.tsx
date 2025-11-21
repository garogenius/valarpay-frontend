"use client";

import { textVariant } from "@/utils/motion";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const DisputeResolutionPolicyContent = () => {
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
                  Dispute Resolution & Complaint Handling Policy
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
                  This Dispute Resolution & Complaint Handling Policy outlines
                  the procedures available to users of the ValarPay platform for
                  reporting issues, resolving disputes, and seeking assistance.
                  VALAR GLOBAL SERVICES LIMITED is committed to ensuring
                  transparent, fair, and timely resolution of complaints in
                  accordance with the Central Bank of Nigeria (CBN) Consumer
                  Protection Framework and applicable regulatory guidelines.
                </p>
              </div>

              {/* Section 1 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  1. Purpose of This Policy
                </h4>

                <p>
                  The purpose of this Policy is to provide a clear and
                  accessible framework for:
                </p>

                <ul className="list-disc list-inside flex flex-col gap-1">
                  <li>Submitting complaints and dispute reports</li>
                  <li>Tracking the status of complaints</li>
                  <li>Ensuring timely and fair resolution</li>
                  <li>Escalating unresolved issues to relevant authorities</li>
                </ul>
              </div>

              {/* Section 2 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">2. Scope</h4>
                <p>
                  This Policy applies to all users of the ValarPay mobile app,
                  website, and related financial services delivered through our
                  licensed partner institutions.
                </p>
              </div>

              {/* Section 3 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  3. Types of Complaints Accepted
                </h4>

                <p>You may submit a complaint regarding:</p>

                <ul className="list-disc list-inside flex flex-col gap-1">
                  <li>Failed or pending transactions</li>
                  <li>Incorrect debit or unauthorized charges</li>
                  <li>Issues with virtual accounts or wallet funding</li>
                  <li>Transfer delays or settlement issues</li>
                  <li>Service interruptions or technical errors</li>
                  <li>KYC verification challenges</li>
                  <li>Account access or security concerns</li>
                  <li>Customer service dissatisfaction</li>
                </ul>
              </div>

              {/* Section 4 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  4. How to Submit a Complaint
                </h4>

                <p>
                  You can contact ValarPay using any of the following channels:
                </p>

                <ul className="list-disc list-inside flex flex-col gap-1">
                  <li>
                    Email: <strong>support@valarpay.com</strong>
                  </li>
                  <li>
                    Phone: <strong>+2349029852374</strong>
                  </li>
                  <li>In-app support chat</li>
                  <li>Website support portal</li>
                </ul>

                <p>Please provide the following information:</p>

                <ul className="list-disc list-inside flex flex-col gap-1">
                  <li>Your full name and registered account details</li>
                  <li>Transaction ID (if applicable)</li>
                  <li>Description of the issue</li>
                  <li>Supporting evidence (screenshots, receipt ID, etc.)</li>
                </ul>
              </div>

              {/* Section 5 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  5. Response Timelines
                </h4>

                <p>
                  Our complaint handling timelines follow CBN Consumer
                  Protection regulations:
                </p>

                <ul className="list-disc list-inside flex flex-col gap-1">
                  <li>
                    <strong>Acknowledgement:</strong> Within 24 hours
                  </li>
                  <li>
                    <strong>Resolution of electronic transfers:</strong> Within
                    72 hours
                  </li>
                  <li>
                    <strong>Card disputes:</strong> 3–7 business days
                  </li>
                  <li>
                    <strong>Complex financial disputes:</strong> Up to 14
                    working days
                  </li>
                </ul>

                <p>
                  If a resolution requires input from our licensed partner bank,
                  timelines may depend on their response and regulatory
                  obligations.
                </p>
              </div>

              {/* Section 6 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  6. Escalation Process
                </h4>

                <p>
                  If your complaint is not resolved to your satisfaction, you
                  may escalate it:
                </p>

                <ul className="list-disc list-inside flex flex-col gap-1">
                  <li>Request for further review internally</li>
                  <li>
                    Escalation to our partner financial institution responsible
                    for the service
                  </li>
                  <li>
                    Escalate to the Central Bank of Nigeria (CBN) CENRAL
                    Consumer Protection Department
                  </li>
                </ul>

                <p>You may contact CBN using:</p>

                <p>
                  📧 <strong>cpd@cbn.gov.ng</strong>
                  <br />
                  🌐 <strong>https://www.cbn.gov.ng</strong>
                </p>
              </div>

              {/* Section 7 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  7. Fraud & Unauthorized Transactions
                </h4>

                <p>
                  For fraud-related issues, unauthorized debits, or suspicious
                  account activity, ValarPay may temporarily restrict the
                  account to safeguard user funds during investigation.
                </p>

                <p>Investigations may require collaboration with:</p>

                <ul className="list-disc list-inside flex flex-col gap-1">
                  <li>Partner banks</li>
                  <li>Payment processors</li>
                  <li>Law enforcement agencies (if necessary)</li>
                </ul>
              </div>

              {/* Section 8 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  8. User Responsibilities
                </h4>

                <p>Please ensure that:</p>

                <ul className="list-disc list-inside flex flex-col gap-1">
                  <li>You provide accurate and complete information</li>
                  <li>You do not delay in reporting an issue</li>
                  <li>You maintain secure access to your ValarPay account</li>
                </ul>
              </div>

              {/* Section 9 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  9. Contact Information
                </h4>

                <p>If you need help regarding a dispute or complaint:</p>

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

export default DisputeResolutionPolicyContent;
