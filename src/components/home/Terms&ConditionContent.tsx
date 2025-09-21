"use client";

import { textVariant } from "@/utils/motion";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

const TermsAndConditionContent = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.1 });

  return (
    <div className="w-full relative z-0 bg-bg-400 dark:bg-dark-primary overflow-hidden flex flex-col">
      <div className="relative w-full flex justify-center">
        <motion.div
          ref={ref}
          animate={isInView ? "show" : "hidden"}
          initial="hidden"
          className="w-[90%] lg:w-[88%] flex flex-col justify-center h-full gap-10 xs:gap-12 pb-20 pt-28 sm:pb-28 sm:pt-32 md:pb-32 md:pt-48"
        >
          <div className="relative inset-0 mx-auto flex flex-col justify-center items-center">
            <motion.div
              variants={textVariant(0.1)}
              className="z-10 w-full xs:w-[90%] lg:w-[85%] 2xl:w-[70%] text-text-200 dark:text-text-400 flex flex-col gap-2 xs:gap-3 sm:gap-4 lg:gap-6 xl:gap-8 text-center py-4"
            >
              <h1 className="text-2xl xs:text-3xl md:text-4xl xl:text-5xl font-bold xs:leading-[2.4rem] md:leading-[2.8rem] xl:leading-[3.8rem]">
                WELCOME TO NATTY GROUP UK LIMITED
              </h1>
              <p className="text-text-1100 dark:text-secondary text-xl md:text-2xl lg:text-3xl xl:text-4xl max-sm:font-medium ">
                Terms and conditions
              </p>
            </motion.div>

            <div
              className="absolute -inset-10 -bottom-40 opacity-40"
            // style={{
            //   background: `
            //   radial-gradient(
            //     circle at center,
            //     rgba(212, 177, 57, 0.4) 0%,
            //     rgba(212, 177, 57, 0.2) 40%,
            //     rgba(212, 177, 57, 0.1) 60%,
            //     rgba(212, 177, 57, 0) 80%
            //   )
            // `,
            //   filter: "blur(60px)",
            //   transform: "scale(1.1)",
            // }}
            />
          </div>

          <div className="w-full flex flex-col gap-12">
            <div className="flex flex-col gap-10 text-base xs:text-lg text-text-200 dark:text-text-900">
              <div className="flex flex-col gap-4">
                <h4 className="">
                  By using our website, mobile app, and services, you agree to
                  comply with and be bound by the following Terms and
                  Conditions. Please read them carefully.
                </h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    1.1 By accessing and using our services, you confirm that
                    you have read, understood, and agree to abide by these
                    terms.
                  </p>
                  <p>
                    1.2 If you do not agree to these Terms and Conditions,
                    please do not use our services.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">2. Eligibility</h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    2.1 To use our services, you must be at least 18 years old
                    or the age of legal majority in your jurisdiction.
                  </p>
                  <p className="">
                    2.2 You confirm that any information you provide to us is
                    accurate and current.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  3. Description of Service
                </h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    3.1  describe of services & Features offered by NATTY GROUP UK LIMITED (VALARPAY)   digital personal &
                    Business account ,,Bill Payments,NGN card,,USD card,,
                    Saving,, investment ,, international transactions E.T.C
                  </p>
                  <p className="">
                    3.2 We reserve the right to modify, update, or discontinue
                    any part of our services without prior notice.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  4. Description of S4. Account Registration and Security
                  Service
                </h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    4.1 Users must register an account to access certain
                    features. You are responsible for maintaining the
                    confidentiality of your account credentials.
                  </p>
                  <p className="">
                    4.2 You agree to notify us immediately of any unauthorized
                    use of your account or any other breach of security.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">5. User Conduct</h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    5.1 You agree not to use our services for any unlawful
                    purpose or in violation of these Terms.
                  </p>
                  <p className="">
                    5.2 You must not engage in activities that harm our systems,
                    such as attempting unauthorized access or distributing
                    viruses.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">6. Fees and Payments</h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    6.1 Our services may include fees. You agree to pay all fees
                    and charges associated with your account.
                  </p>
                  <p className="">
                    6.2 We may update fees at our discretion, with prior notice
                    to users.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  7. Transaction Processing
                </h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    7.1 Describe how financial transactions are processed,
                    anytime and no delay on transactions
                  </p>
                  <p className="">
                    7.2 We are not liable for any transaction errors or delays
                    caused by third-party financial institutions.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">8. Privacy Policy </h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    8.1 Our Privacy Policy explains how we collect, use, and
                    protect your information. By using our services, you consent
                    to our Privacy Policy.
                  </p>
                  <p className="">
                    8.2{" "}
                    <Link className="text-primary" href="/privacyPolicy">
                      Link to privacy policy
                    </Link>
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  9. Intellectual Property
                </h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    9.1 All content, trademarks,Logo ,, designer and services
                    provided are owned by or licensed to VALAR GLOBAL SERVICES LIMITED
                    (VALARPAY){" "}
                  </p>
                  <p className="">
                    9.2 You may not reproduce, distribute, or create derivative
                    works from our intellectual property without our permission
                    by Cook Island Trust
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  10. Limitation of Liability{" "}
                </h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    10.1 VALAR GLOBAL SERVICES LIMITED (VALARPAY)  is not
                    liable for any indirect, incidental, or consequential
                    damages arising from your use of our services.
                  </p>
                  <p className="">
                    10.2 Our liability for any claim related to the use of our
                    services is limited to the fees paid by the user in the six
                    months preceding the incident.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">11. Indemnification </h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    11.1 You agree to indemnify and hold harmless VALARPAY
                    GLOBAL SERVICES LIMITED (VALARPAY)  from any claims,
                    damages, losses, or expenses arising from your use of our
                    services.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">12. Termination</h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    12.1 We may suspend or terminate your access to our services
                    at any time if you violate these Terms.
                  </p>

                  <p className="">
                    12.2 You may terminate your account by following the
                    instructions in your account settings.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">13. Changes to Terms</h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    13.1 We may modify these Terms and Conditions at any time.
                    We will notify users of significant changes by email or
                    through our platform.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">14. Governing Law</h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    14.1 These Terms and Conditions are governed by the laws of
                    Cook Island Trust Any disputes will be resolved exclusively
                    in the courts of Cook Island Trust{" "}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">15.Alteration</h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    No alteration, variation or agreed cancellation of this
                    agreement, and this product, shall be of any effect unless
                    directed so by us.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">16.Binding</h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    Any decision, exercise of discretion, judgement or opinion
                    or approval of any matter mentioned in this Agreement or
                    arising from it shall be binding on the parties only if in
                    writing unless otherwise expressly provided in this
                    Agreement.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">17.Notice</h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    Any notice pursuant to this Agreement shall be given by fax,
                    electronic mail or letter and the onus of confirmation of
                    receipt of such notices shall be on the sender
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">18. Contact Us</h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    If you have any questions regarding these Terms and
                    Conditions, please contact us at: Email:
                    support@valarpay.com
                  </p>

                  <p className="">
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

export default TermsAndConditionContent;
