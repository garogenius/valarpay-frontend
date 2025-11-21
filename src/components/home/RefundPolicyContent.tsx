"use client";

import { textVariant } from "@/utils/motion";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const RefundPolicyContent = () => {
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
          {/* ================= HEADER ================= */}
          <div className="relative ">
            <div className="z-30 bg-[#FDE0CC] dark:bg-[#322127] w-full relative inset-0 mx-auto flex flex-col justify-center items-center pb-10 pt-32 sm:pb-12 sm:pt-36 md:pb-14 md:pt-40">
              <motion.div
                variants={textVariant(0.1)}
                className="w-[95%] 2xs:w-[90%] lg:w-[85%] 2xl:w-[70%] flex flex-col gap-2 xs:gap-3 sm:gap-4 lg:gap-6 text-center py-4"
              >
                <h1 className="text-text-200 dark:text-white text-2xl xs:text-3xl md:text-4xl xl:text-5xl font-bold xs:leading-[2.4rem] md:leading-[2.8rem] xl:leading-[3.8rem]">
                  VALAR GLOBAL SERVICES LIMITED
                </h1>
                <p className="text-text-200 dark:text-white text-2xl lg:text-3xl xl:text-4xl font-medium ">
                  Refund Policy
                </p>
                <p className="text-sm xs:text-base sm:text-xl text-text-200 dark:text-white font-medium">
                  Last Updated: 10th November 2024
                </p>
              </motion.div>
            </div>

            <div
              className="absolute -inset-20 -bottom-40 opacity-40"
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

          {/* ================= CONTENT ================= */}
          <div className="flex flex-col items-center gap-12">
            <div className="w-[90%] lg:w-[88%] flex flex-col gap-10 text-base xs:text-lg text-text-200 dark:text-text-900">
              {/* ================= INTRO ================= */}
              <div className="flex flex-col gap-4">
                <h4>
                  At VALAR GLOBAL SERVICES LIMITED (“ValarPay”), we are
                  committed to providing transparent, secure, and reliable
                  financial technology services. This Refund Policy outlines how
                  refund requests are handled for transactions carried out
                  through the ValarPay platform.
                </h4>

                <p>
                  Please read this policy carefully to understand the conditions
                  under which refunds may be approved, processed, or declined.
                </p>
              </div>

              {/* ================= 1. ELIGIBILITY ================= */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  1. Eligibility for Refunds
                </h4>
                <p>The following situations may qualify for a refund:</p>

                <ul className="list-disc list-inside flex flex-col gap-1">
                  <li>
                    <strong>Unauthorized Transactions:</strong> If you detect a
                    transaction that you did not authorize, report it to us
                    immediately. Upon investigation and confirmation, a refund
                    or reversal will be processed based on regulatory
                    guidelines.
                  </li>

                  <li>
                    <strong>Failed or Reversed Transactions:</strong> If your
                    account was debited but the transaction failed or the
                    beneficiary did not receive value, a refund will be
                    initiated automatically or upon confirmation from our
                    partner financial institutions.
                  </li>

                  <li>
                    <strong>Duplicate Transactions:</strong> If you are charged
                    more than once for the same transaction, the excess charge
                    will be refunded once verified.
                  </li>

                  <li>
                    <strong>Service Errors:</strong> If an error occurs due to
                    system, processing, or operational failure on ValarPay or
                    our partners’ part, a refund will be issued after
                    verification.
                  </li>

                  <li>
                    <strong>Subscription Cancellations:</strong> Refunds for
                    subscription services (where applicable) may be prorated or
                    fully refunded based on the terms of the subscription.
                  </li>
                </ul>
              </div>

              {/* ================= 2. REQUEST PROCESS ================= */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  2. Refund Request Process
                </h4>

                <p>
                  Refund requests should be submitted within{" "}
                  <strong>24 hours</strong> of the transaction or immediately
                  after the issue is discovered.
                </p>

                <p>Please provide:</p>

                <ul className="list-disc list-inside flex flex-col gap-1">
                  <li>
                    Your full name and registered ValarPay account details
                  </li>
                  <li>Transaction ID, amount, and date</li>
                  <li>A clear explanation of the issue</li>
                  <li>Supporting evidence (if required)</li>
                </ul>

                <p>
                  Contact Support: <strong>support@valarpay.com</strong> or{" "}
                  <strong>02013309609</strong>.
                </p>

                <p>
                  Our support team will acknowledge receipt of your request
                  within
                  <strong> 24 hours</strong> and may request additional
                  documentation during verification.
                </p>
              </div>

              {/* ================= 3. NON-REFUNDABLE ================= */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  3. Non-Refundable Transactions
                </h4>

                <p>The following situations are not eligible for refunds:</p>

                <ul className="list-disc list-inside flex flex-col gap-1">
                  <li>
                    Transactions where value has already been delivered to the
                    beneficiary
                  </li>
                  <li>
                    Airtime, data, electricity tokens, gift cards, or bill
                    payments already processed
                  </li>
                  <li>
                    Refund requests made after the allowable dispute window
                  </li>
                  <li>Fees or charges clearly stated as non-refundable</li>
                  <li>
                    Situations where the issue is caused by the customer (e.g.,
                    wrong account number entry)
                  </li>
                </ul>
              </div>

              {/* ================= 4. PROCESSING TIME ================= */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">4. Processing Time</h4>

                <p>
                  Approved refunds will be processed within{" "}
                  <strong>24 hours</strong> by ValarPay. However, depending on
                  the payment channel, bank, biller, or partner institution:
                </p>

                <ul className="list-disc list-inside flex flex-col gap-1">
                  <li>Refunds to bank accounts may take 1–3 business days</li>
                  <li>
                    Refunds to virtual accounts may reflect instantly or within
                    24 hours
                  </li>
                  <li>
                    Card refunds may take 3–7 business days depending on card
                    issuer policies
                  </li>
                </ul>
              </div>

              {/* ================= 5. FRAUD PREVENTION ================= */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  5. Fraud Prevention & Verification
                </h4>

                <p>
                  To protect users and the platform, all refund requests undergo
                  strict security and fraud checks. ValarPay reserves the right
                  to:
                </p>

                <ul className="list-disc list-inside flex flex-col gap-1">
                  <li>Deny refund requests that appear fraudulent</li>
                  <li>Block or restrict accounts pending investigation</li>
                  <li>
                    Report confirmed fraud cases to regulatory and law
                    enforcement authorities
                  </li>
                </ul>
              </div>

              {/* ================= 6. AMENDMENTS ================= */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  6. Amendments to This Policy
                </h4>

                <p>
                  We may update this Refund Policy anytime to reflect changes in
                  regulatory requirements, partner institution policies, or
                  operational needs. Updates will be communicated via the app,
                  website, or email where applicable.
                </p>

                <p>
                  For further assistance, contact:
                  <br />
                  <strong>support@valarpay.com</strong> |{" "}
                  <strong>02013309609</strong>
                  <br />
                  Address: 23, OGAGIFO STREET, OFF DBS ROAD, BEFORE GQ SUITES,
                  ASABA, DELTA STATE.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RefundPolicyContent;
