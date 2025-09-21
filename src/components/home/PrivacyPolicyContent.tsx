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
          <div className="relative ">
            <div className="z-30 bg-bg-1600 dark:bg-bg-1700 w-full relative inset-0 mx-auto flex flex-col justify-center items-center pb-10 pt-32 sm:pb-12 sm:pt-36 md:pb-14 md:pt-40">
              <motion.div
                variants={textVariant(0.1)}
                className="w-[95%] 2xs:w-[90%] lg:w-[85%] 2xl:w-[70%] flex flex-col gap-2 xs:gap-3 sm:gap-4 lg:gap-6 text-center py-4"
              >
                <h1 className="text-text-200 dark:text-text-900 text-2xl xs:text-3xl md:text-4xl xl:text-5xl font-bold xs:leading-[2.4rem] md:leading-[2.8rem] xl:leading-[3.8rem]">
                 NATTY GROUP UK LIMITED {" "}
                </h1>
                <p className="text-secondary text-2xl lg:text-3xl xl:text-4xl font-medium ">
                  Privacy Policy{" "}
                </p>
                <p className="text-sm xs:text-base sm:text-xl text-text-200 dark:text-text-900 font-medium">
                  Last Updated: 10th November 2024
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
                <h4 className="">
                NATTY GROUP UK LIMITED we are committed
                  to protecting your privacy. This Privacy Policy explains how
                  we collect, use, disclose, and safeguard your information when
                  you visit our website or use our services.
                </h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    Please read this Privacy Policy carefully to understand our
                    views and practices regarding your personal data and how we
                    will treat it. By accessing or using our website and
                    services, you agree to the collection and use of information
                    in accordance with this policy.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  1. Information We Collect
                </h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    We may collect and process the following types of
                    information: Personal data/ information in this context
                    shall include all data such as: any means of information
                    relating to an identified or identifiable natural person who
                    can be identified by:
                  </p>
                  <p className="">
                    1,a name;
                    <br />
                    2,an identification number;
                    <br />
                    3,location data, an online identifier;
                    <br />
                    4,address, a photo, an email address;
                    <br />
                    5,facial recognition data;
                    <br />
                    6,bank details and any other sensitive personal information
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  1.1 Personal data Information:
                </h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    We collect personal information you voluntarily provide to
                    us, such as your name,,bank account,,facial recognition
                    data,,,bank verification number, national identification
                    number, international passport number, means of
                    identification, guarantors contact details, bank statements,
                    usernames, password, your preferences, interests, feedback
                    and survey responses, preference in receiving marketing
                    information from us and our third parties and your
                    communication preferences,  email address, phone number, and
                    other contact information when you create an account, sign
                    up for our newsletter, or contact us.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">1.2 Usage Data: </h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    We automatically collect information about your activity on
                    our website, such as IP address, browser type, operating
                    system, referring URLs, page views, and other usage
                    statistics.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  1.3 Cookies and Tracking Technologies:
                </h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    We use cookies, web beacons, and other tracking technologies
                    to collect information about your interactions with our
                    website to personalize your experience and for analytics
                    purposes.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  2. How We Use Your Information
                </h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    We use your information for various purposes, including to:
                  </p>
                  <p className="">
                    Provide, maintain, and improve our website and services.
                    <br />
                    Process and manage your account.
                    <br />
                    Communicate with you about updates, promotions, and other
                    information that may be of interest to you.
                    <br />
                    Analyze usage trends and track user engagement.
                    <br />
                    Comply with legal obligations and enforce our policies.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  3. Sharing Your Information
                </h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    We may share your information with third parties in the
                    following circumstances:
                  </p>
                  <p className="">
                    With Service Providers: We may share your information with
                    trusted service providers who perform functions on our
                    behalf, such as website hosting, data analysis, customer
                    service, etc.
                  </p>
                  <p className="">
                    With Legal Authorities: We may disclose your information to
                    comply with legal obligations or protect the rights,
                    property, or safety of our company, our users, or others.
                    For Business Transfers: If we undergo a merger, acquisition,
                    or sale of assets, your information may be transferred to
                    the acquiring entity.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">4. Data Security </h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    We take reasonable measures to protect your information from
                    unauthorized access, disclosure, or destruction. However, no
                    data transmission over the Internet is entirely secure, so
                    we cannot guarantee absolute security.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  5. Your Rights and Choices
                </h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    Depending on your location, you may have certain rights
                    regarding your personal data, such as the right to:
                  </p>
                  <p className="">
                    Access, update, or delete your information.
                    <br />
                    Object to or restrict processing of your information.
                    <br />
                    Withdraw consent where applicable.
                    <br />
                    To exercise any of these rights, please contact us at
                    support@valarpay.com
                    <br />
                    Call:+2349029852374
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  6. Third-Party Links{" "}
                </h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    Our website may contain links to third-party websites. This
                    Privacy Policy does not apply to those third parties, and we
                    encourage you to review their privacy policies.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  7. Changes to This Privacy Policy{" "}
                </h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    We may update this Privacy Policy from time to time. We will
                    notify you of any material changes by posting the new
                    Privacy Policy on our website and updating the &ldquo;Last
                    Updated&rdquo; 10th November 2024
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  8.Retention of your data{" "}
                </h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    We will not retain your personal data for longer than is
                    necessary for the purposes for which such personal data is
                    processed. This means that your personal data will only be
                    retained for as long as it is still required to provide you
                    with the Services or is necessary for legal reasons. When
                    calculating the appropriate retention period of your
                    personal data we consider the nature and sensitivity of the
                    personal data, the purposes for which we are processing such
                    personal data, and any applicable statutory/regulatory
                    retention periods. Using these criteria, we regularly review
                    the personal data that we hold and the purposes for which
                    such is held and processed. Our Payment Card Industry Data
                    Security Standard (“PCIDSS”) obligation means that we are
                    obliged to retain personal data since the end date of our
                    business relationship with you.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">9. Contact Us</h4>
                <div className="flex flex-col gap-4">
                  <p className="">
                    If you have any questions or concerns about , please contact
                    us at:
                  </p>

                  <p className="">
                   NATTY GROUP UK LIMITED 
                  </p>

                  <p className="">
                    Head office: 23, OGAGIFO STREET OFF DBS ROAD BEFORE GQ SUITES , ASABA, DELTA STATE

                  </p>

                  <p className="">Email:support@valarpay.com</p>

                  <p className="">Call:+2349029852374</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicyContent;
