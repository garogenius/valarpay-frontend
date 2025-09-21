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
          <div className="relative ">
it to team & condition, 
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
                  Terms of Use{" "}
                </h1>

                <p className="text-sm xs:text-base sm:text-xl text-dark-primary dark:text-text-700 font-medium">
                  Last Updated: 11th November 2024
                </p>
              </motion.div>
            </div>
            <div
              className="absolute -inset-20 -bottom-40 opacity-40"
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

          <div className=" flex flex-col items-center gap-12">
            <div className="w-[90%] lg:w-[88%] flex flex-col gap-10 text-base xs:text-lg text-text-200 dark:text-text-900">
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  1. Acceptance of Terms
                </h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    By accessing or using personal account, Business account,
                    Bill Payments, creation of USD card, NGN card, International
                    transactions, investment, savings and other financial
                    services (the &ldquo;Service&rdquo;), you agree to comply
                    with and be bound by these Terms of Use (the
                    &ldquo;Terms&rdquo;) and our Privacy Policy. If you do not
                    agree with any part of these Terms, you must not use the
                    Service by Cook Island Trust.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">2. Modifications  </h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    We reserve the right to modify or update these Terms at any
                    time. Any changes will be effective immediately upon posting
                    to our site, and you agree to be bound by any modifications
                    by continuing to use the Service.{" "}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">3. Eligibility </h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    You must be at least 18 years old to use our Service. By
                    using the Service, you represent and warrant that you meet
                    this requirement.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  4. Account Registration
                </h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    You may need to create an account to access certain
                    features. You agree to provide accurate, complete
                    information and to keep your account details up to date. You
                    are responsible for maintaining the confidentiality of your
                    account and password. You are liable for any activities
                    under your account.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  5. Use of the Service{" "}
                </h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    You agree to use the Service only for lawful purposes and in
                    a way that does not infringe upon the rights of others.
                    Prohibited activities include, but are not limited
                    to:Uploading, sharing, or transmitting any illegal content
                    <br />
                    Engaging in harassment or discrimination
                    <br />
                    Impersonating others or misrepresenting your identity
                    <br />
                    Attempting to hack or gain unauthorized access to our
                    systems
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  6. Intellectual Property{" "}
                </h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    All content on the Service, including text, graphics, logos,
                    and software, is the property of NATTY GROUP UK LIMITED and is protected by intellectual property
                    laws. You may not use, copy, or distribute any content from
                    the Service without explicit permission from NATTY GROUP UK LIMITED 
                    (VALARPAY)
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  7. User-Generated Content{" "}
                </h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    By submitting content to the Service (e.g., posts, comments,
                    reviews), you grant us a worldwide, royalty-free, perpetual
                    license to use, display, reproduce, and distribute your
                    content. You agree not to submit any content that is
                    unlawful or infringes upon others’ rights.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">8. Disclaimers</h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    The Service is provided “as is” and “as available.” We make
                    no warranties, express or implied, about the accuracy or
                    reliability of the Service. We do not guarantee that the
                    Service will be error-free or uninterrupted.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  9. Limitation of Liability
                </h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    To the fullest extent permitted by law, NATTY GROUP UK LIMITED and its affiliates are not
                    liable for any indirect, incidental, or consequential
                    damages arising out of your use of the Service.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">10. Termination  </h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    We reserve
                    <br />
                    the right to suspend or terminate your account or access to
                    the Service at our discretion, without notice, if we
                    determine that you have violated these Terms.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">11. Governing Law </h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    These Terms are governed by the laws of Cook Island Trust
                    and any disputes will be resolved in the courts of Cook
                    Island Trust
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  12. Contact Information {" "}
                </h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    If you have any questions or concerns about these Terms,
                    please contact us at
                  </p>
                  <p>Email : support@valarpay.com</p>
                  <p>Call:+2349029852374</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfUseContent;
