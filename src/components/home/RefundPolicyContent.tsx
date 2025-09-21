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
          <div className="relative ">
            <div className="z-30 bg-[#FDE0CC] dark:bg-[#322127] w-full relative inset-0 mx-auto flex flex-col justify-center items-center pb-10 pt-32 sm:pb-12 sm:pt-36 md:pb-14 md:pt-40">
              <motion.div
                variants={textVariant(0.1)}
                className="w-[95%] 2xs:w-[90%] lg:w-[85%] 2xl:w-[70%] flex flex-col gap-2 xs:gap-3 sm:gap-4 lg:gap-6 text-center py-4"
              >
                <h1 className="text-text-200 dark:text-white text-2xl xs:text-3xl md:text-4xl xl:text-5xl font-bold xs:leading-[2.4rem] md:leading-[2.8rem] xl:leading-[3.8rem]">
                  NATTY GROUP UK LIMITED{" "}
                </h1>
                <p className="text-text-200 dark:text-white text-2xl lg:text-3xl xl:text-4xl font-medium ">
                  Refund Policy{" "}
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

          <div className=" flex flex-col items-center gap-12">
            <div className="w-[90%] lg:w-[88%] flex flex-col gap-10 text-base xs:text-lg text-text-200 dark:text-text-900">
              <div className="flex flex-col gap-4">
                <h4 className="">
                  At NATTY GROUP UK LIMITED
                </h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    We are committed to providing transparent and reliable
                    financial services. This Refund Policy outlines the
                    conditions under which refunds may be issued to ensure
                    clarity for our customers.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  1. Eligibility for Refunds{" "}
                </h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    Refunds will only be processed under the following
                    circumstances:
                  </p>
                  <p className="">
                    Unauthorized Transactions: If you identify a transaction on
                    your account that you did not authorize, please report it to
                    us immediately. Upon verification, a refund will be
                    processed as per regulatory guidelines.
                    <br />
                    Service Errors: If there is a technical or operational error
                    on our part that results in an incorrect charge, we will
                    investigate and issue a refund if deemed appropriate.
                    Cancellation of Subscription Services: If you cancel a
                    subscription within the allowed grace period (as specified
                    in the subscription terms), a prorated or full refund may be
                    issued depending on the policy.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  2. Refund Request Process{" "}
                </h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    To request a refund, Contact our Support Team at
                    Support@Valarpay.com or Call+2349029852374 within 24hour day
                    of the transaction.
                    <br />
                    Provide the following details:
                    <br />
                    Full name and registered account details.
                    <br />
                    Transaction ID and date.
                    <br />
                    Reason for the refund request.
                    <br />
                    We will acknowledge your request within 24hour and may
                    require additional documentation or evidence for
                    verification.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">3. Non-Refundable </h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    Transactions of certain amounts are non-refundable,
                    including:
                  </p>

                  <p className="">
                    Transactions where the service or product has already been
                    delivered as agreed. Situations where a refund request is
                    made beyond the stipulated timeline. Fees or charges
                    explicitly stated as non-refundable in the terms of service.{" "}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">4. Processing Time </h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    Approved refunds will be processed within 24hours  Depending
                    on your payment method, it may take additional time for the
                    refund to appear in your account.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">5. Fraud Prevention </h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    Refunds will only be processed after thorough verification
                    to prevent fraudulent claims. If any suspicious activity is
                    detected, we reserve the right to deny the refund request
                    and take further action if necessary.{" "}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  6. Amendments to This Policy{" "}
                </h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    We may update this Refund Policy periodically. Any changes
                    will be communicated to users via [email/website/app
                    notification]. Please review this policy regularly for
                    updates.
                  </p>
                  <p className="">
                    For further assistance, please reach out to our support
                    team: Support@Valarpay.com or Call: +2349029852374
                    <br />
                    Head office: 23, OGAGIFO STREET OFF DBS ROAD BEFORE GQ SUITES , ASABA, DELTA STATE
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RefundPolicyContent;
