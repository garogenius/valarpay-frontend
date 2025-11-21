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
                WELCOME TO VALARPAY
              </h1>
              <p className="text-text-1100 dark:text-secondary text-xl md:text-2xl lg:text-3xl xl:text-4xl max-sm:font-medium ">
                Terms and Conditions
              </p>
            </motion.div>

            <div className="absolute -inset-10 -bottom-40 opacity-40" />
          </div>

          <div className="w-full flex flex-col gap-12">
            <div className="flex flex-col gap-10 text-base xs:text-lg text-text-200 dark:text-text-900">
              {/* 1. Acceptance of Terms */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  1. Acceptance of Terms
                </h4>
                <div className="flex flex-col gap-4">
                  <p>
                    1.1 These Terms and Conditions (&quot;Terms&quot;) govern
                    your access to and use of the ValarPay mobile application,
                    website, and related services (collectively, the
                    &quot;Services&quot;) provided by VALAR GLOBAL SERVICES
                    LIMITED (&quot;ValarPay&quot;, &quot;we&quot;,
                    &quot;us&quot;, or &quot;our&quot;).
                  </p>
                  <p>
                    1.2 By downloading, installing, accessing, or using the
                    ValarPay app or any of our Services, you acknowledge that
                    you have read, understood, and agree to be bound by these
                    Terms.
                  </p>
                  <p>
                    1.3 If you do not agree to these Terms, you must not use the
                    ValarPay app or any of our Services.
                  </p>
                </div>
              </div>

              {/* 2. About ValarPay (Non-Bank Status) */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  2. About ValarPay and Our Role
                </h4>
                <div className="flex flex-col gap-4">
                  <p>
                    2.1 ValarPay is a financial technology (fintech) platform
                    owned and operated by VALAR GLOBAL SERVICES LIMITED, a
                    company incorporated in Nigeria. We provide a digital
                    platform that enables users to create and manage virtual
                    accounts, make transfers, withdrawals, airtime and data
                    purchases, pay electricity and other utility bills, purchase
                    gift cards, and access other value-added financial services.
                  </p>
                  <p>
                    2.2 ValarPay is{" "}
                    <span className="font-semibold">not a bank</span> and does
                    not itself hold a banking license issued by the Central Bank
                    of Nigeria (&quot;CBN&quot;). Banking and payment services
                    available through the ValarPay app are provided by licensed
                    microfinance banks, deposit-taking institutions, switching
                    companies, and other regulated financial institutions
                    (&quot;Partner Institutions&quot;).
                  </p>
                  <p>
                    2.3 Funds held in virtual accounts, wallets, or settlement
                    accounts made available through the ValarPay app are held
                    with our Partner Institutions in accordance with applicable
                    Nigerian laws and regulations. Your legal relationship in
                    respect of such funds is primarily with the relevant Partner
                    Institution, and ValarPay acts as a technology and service
                    provider facilitating access to such services.
                  </p>
                </div>
              </div>

              {/* 3. Eligibility */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">3. Eligibility</h4>
                <div className="flex flex-col gap-4">
                  <p>3.1 To use our Services, you must:</p>
                  <ul className="list-disc list-inside flex flex-col gap-2">
                    <li>
                      be at least 18 years old or the age of legal majority in
                      your jurisdiction; and
                    </li>
                    <li>
                      have the capacity to enter into a legally binding
                      agreement.
                    </li>
                  </ul>
                  <p>
                    3.2 By using the Services, you represent and warrant that
                    all information you provide to us is accurate, complete, and
                    up-to-date, and that you are not using the Services on
                    behalf of a person or entity that is prohibited from
                    receiving financial services under applicable laws,
                    including anti-money laundering and counter-terrorist
                    financing laws.
                  </p>
                </div>
              </div>

              {/* 4. Description of Services */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  4. Description of Services
                </h4>
                <div className="flex flex-col gap-4">
                  <p>4.1 Through the ValarPay app, users may be able to:</p>
                  <ul className="list-disc list-inside flex flex-col gap-2">
                    <li>
                      open and manage virtual accounts and/or wallets powered by
                      Partner Institutions;
                    </li>
                    <li>receive funds into such virtual accounts;</li>
                    <li>
                      make transfers to bank accounts, wallets, or other
                      supported channels;
                    </li>
                    <li>withdraw funds via supported methods;</li>
                    <li>
                      purchase airtime and mobile data from supported networks;
                    </li>
                    <li>
                      pay for utilities such as electricity and other billers;
                    </li>
                    <li>purchase and redeem supported gift cards; and</li>
                    <li>
                      access other present or future features we may introduce
                      from time to time.
                    </li>
                  </ul>
                  <p>
                    4.2 We may add, modify, suspend, or discontinue any feature
                    or service at any time, with or without notice, in order to
                    comply with regulatory requirements, improve security, or
                    for any other operational reason.
                  </p>
                </div>
              </div>

              {/* 5. Account Registration, KYC & Security */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  5. Account Registration, Verification and Security
                </h4>
                <div className="flex flex-col gap-4">
                  <p>
                    5.1 To access most features of the ValarPay app, you must
                    create an account and complete any required registration and
                    identity verification (KYC) processes. You agree to provide
                    accurate and truthful information and to update such
                    information when it changes.
                  </p>
                  <p>
                    5.2 We and/or our Partner Institutions may request
                    additional information or documents (including
                    government-issued identification, proof of address, BVN,
                    etc.) in order to comply with applicable laws and
                    regulations. We reserve the right to reject or limit any
                    account if KYC requirements are not satisfied.
                  </p>
                  <p>
                    5.3 You are responsible for maintaining the confidentiality
                    and security of your login credentials, PINs, passwords, and
                    any device used to access the app. Any instruction received
                    from your account or authenticated device will be treated as
                    having been authorized by you.
                  </p>
                  <p>
                    5.4 You agree to notify us immediately at{" "}
                    <a
                      href="mailto:support@valarpay.com"
                      className="text-primary underline"
                    >
                      support@valarpay.com
                    </a>{" "}
                    if you suspect any unauthorized access or security breach
                    relating to your account.
                  </p>
                </div>
              </div>

              {/* 6. User Conduct */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">6. User Conduct</h4>
                <div className="flex flex-col gap-4">
                  <p>
                    6.1 You agree to use the ValarPay app only for lawful
                    purposes and in accordance with these Terms and applicable
                    laws and regulations.
                  </p>
                  <p>6.2 You must not use the Services to:</p>
                  <ul className="list-disc list-inside flex flex-col gap-2">
                    <li>
                      engage in fraud, money laundering, terrorism financing, or
                      any other criminal activity;
                    </li>
                    <li>
                      violate sanctions, foreign exchange, or other regulatory
                      restrictions;
                    </li>
                    <li>
                      interfere with or compromise the security or integrity of
                      our systems;
                    </li>
                    <li>
                      attempt to gain unauthorized access to any account or
                      system; or
                    </li>
                    <li>
                      misrepresent your identity or the purpose of any
                      transaction.
                    </li>
                  </ul>
                </div>
              </div>

              {/* 7. Fees and Charges */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  7. Fees, Charges and Taxes
                </h4>
                <div className="flex flex-col gap-4">
                  <p>
                    7.1 Certain transactions or Services may attract fees,
                    charges, or commissions. Where applicable, these will be
                    disclosed in the app, on our website, or at the point of
                    transaction.
                  </p>
                  <p>
                    7.2 By initiating a transaction, you authorize ValarPay and
                    our Partner Institutions to deduct the applicable fees from
                    your account or transaction amount.
                  </p>
                  <p>
                    7.3 We may review and update our fees from time to time.
                    Changes to fees will be communicated through the app, our
                    website, or other appropriate channels.
                  </p>
                  <p>
                    7.4 You are responsible for any taxes, duties, or
                    governmental charges that may apply to your use of the
                    Services or to your transactions.
                  </p>
                </div>
              </div>

              {/* 8. Transactions and Limits */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  8. Transactions, Limits and Processing
                </h4>
                <div className="flex flex-col gap-4">
                  <p>
                    8.1 You are responsible for ensuring that all transaction
                    details (such as recipient account number, bank, amount, and
                    biller information) are correct before you authorize a
                    transaction. Transactions that have been successfully
                    processed may be irreversible.
                  </p>
                  <p>
                    8.2 Transaction limits (daily, monthly, per-transaction, or
                    cumulative) may apply and may be determined by us, our
                    Partner Institutions, or by law and regulation. We may
                    change these limits at any time for risk management,
                    security, or compliance reasons.
                  </p>
                  <p>
                    8.3 While we aim to process transactions promptly, actual
                    processing times may depend on third-party networks, Partner
                    Institutions, and other factors beyond our control. We are
                    not liable for delays or failures caused by such third
                    parties or by circumstances outside our reasonable control
                    (including network failures, system outages, or regulatory
                    restrictions).
                  </p>
                  <p>
                    8.4 In certain cases, transactions may be delayed, reversed,
                    blocked, or rejected for compliance, fraud prevention, or
                    risk management reasons. We and our Partner Institutions may
                    be legally required not to disclose the reasons in detail.
                  </p>
                </div>
              </div>

              {/* 9. Third-Party & Partner Institutions */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  9. Partner Institutions and Third-Party Services
                </h4>
                <div className="flex flex-col gap-4">
                  <p>
                    9.1 The ValarPay app integrates with APIs and systems
                    provided by Partner Institutions and other third-party
                    service providers (such as payment processors, billers,
                    telecom operators, and card providers).
                  </p>
                  <p>
                    9.2 Your use of certain Services may be subject to the terms
                    and conditions of these third parties. Where applicable, you
                    agree to comply with such third-party terms.
                  </p>
                  <p>
                    9.3 ValarPay does not control and is not responsible for the
                    acts or omissions of these third parties, but we will use
                    reasonable efforts to work with them to resolve issues that
                    directly affect your use of the Services.
                  </p>
                </div>
              </div>

              {/* 10. Privacy Policy */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">10. Privacy Policy</h4>
                <div className="flex flex-col gap-4">
                  <p>
                    10.1 Our{" "}
                    <Link className="text-primary" href="/privacyPolicy">
                      Privacy Policy
                    </Link>{" "}
                    explains how we collect, use, store, share, and protect your
                    personal information in connection with the ValarPay app. By
                    using the Services, you consent to our data practices as
                    described in the Privacy Policy.
                  </p>
                  <p>
                    10.2 We may share your information with Partner Institutions
                    and other third parties as necessary to provide the
                    Services, comply with legal obligations, and manage risk and
                    fraud, in line with applicable data protection laws.
                  </p>
                </div>
              </div>

              {/* 11. Intellectual Property */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  11. Intellectual Property
                </h4>
                <div className="flex flex-col gap-4">
                  <p>
                    11.1 All rights, title, and interest in and to the ValarPay
                    app, including but not limited to trademarks, logos,
                    designs, graphics, text, software, and other content, are
                    owned by or licensed to VALAR GLOBAL SERVICES LIMITED.
                  </p>
                  <p>
                    11.2 You are granted a limited, non-exclusive,
                    non-transferable, revocable license to use the app solely
                    for your personal, lawful use in accordance with these
                    Terms.
                  </p>
                  <p>
                    11.3 You may not reproduce, modify, distribute, create
                    derivative works from, reverse engineer, or attempt to
                    extract the source code of any part of the app or Services
                    except as expressly permitted by law or with our prior
                    written consent.
                  </p>
                </div>
              </div>

              {/* 12. Disclaimers */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">12. Disclaimers</h4>
                <div className="flex flex-col gap-4">
                  <p>
                    12.1 The ValarPay app and Services are provided on an
                    &quot;as is&quot; and &quot;as available&quot; basis without
                    warranties of any kind, whether express or implied,
                    including but not limited to warranties of merchantability,
                    fitness for a particular purpose, non-infringement, or
                    continuous availability.
                  </p>
                  <p>
                    12.2 We do not warrant that the Services will be
                    uninterrupted, secure, or error-free, or that any defects
                    will be corrected immediately.
                  </p>
                </div>
              </div>

              {/* 13. Limitation of Liability */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  13. Limitation of Liability
                </h4>
                <div className="flex flex-col gap-4">
                  <p>
                    13.1 To the maximum extent permitted by law, VALAR GLOBAL
                    SERVICES LIMITED, its directors, employees, agents, and
                    affiliates shall not be liable for any indirect, incidental,
                    special, consequential, or punitive damages, or for any loss
                    of profits, revenue, data, or goodwill arising out of or in
                    connection with your use of the Services.
                  </p>
                  <p>
                    13.2 To the extent any liability is established against us,
                    our total aggregate liability for any claim arising out of
                    or relating to the Services shall be limited to the total
                    fees (if any) paid by you to ValarPay in the six (6) months
                    immediately preceding the event giving rise to the claim.
                  </p>
                </div>
              </div>

              {/* 14. Indemnification */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">14. Indemnification</h4>
                <div className="flex flex-col gap-4">
                  <p>
                    14.1 You agree to indemnify, defend, and hold harmless VALAR
                    GLOBAL SERVICES LIMITED, its directors, employees, agents,
                    and affiliates from and against any and all claims, losses,
                    liabilities, damages, costs, and expenses (including
                    reasonable legal fees) arising out of or related to:
                  </p>
                  <ul className="list-disc list-inside flex flex-col gap-2">
                    <li>your breach of these Terms;</li>
                    <li>your misuse of the ValarPay app or Services; or</li>
                    <li>
                      your violation of any law, regulation, or third-party
                      rights.
                    </li>
                  </ul>
                </div>
              </div>

              {/* 15. Suspension and Termination */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  15. Suspension and Termination
                </h4>
                <div className="flex flex-col gap-4">
                  <p>
                    15.1 We may, at our sole discretion and without prior
                    notice, suspend, restrict, or terminate your access to the
                    ValarPay app or any part of the Services if:
                  </p>
                  <ul className="list-disc list-inside flex flex-col gap-2">
                    <li>
                      we reasonably suspect fraud, suspicious activity, or
                      misuse;
                    </li>
                    <li>you breach these Terms or any applicable law;</li>
                    <li>
                      we are required to do so by law, regulation, or a
                      regulatory authority; or
                    </li>
                    <li>
                      our agreements with Partner Institutions or third parties
                      require such action.
                    </li>
                  </ul>
                  <p>
                    15.2 You may close your ValarPay account at any time through
                    the app (where available) or by contacting us at{" "}
                    <a
                      href="mailto:support@valarpay.com"
                      className="text-primary underline"
                    >
                      support@valarpay.com
                    </a>
                    , subject to settling any outstanding obligations.
                  </p>
                </div>
              </div>

              {/* 16. Changes to Terms */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  16. Changes to These Terms
                </h4>
                <div className="flex flex-col gap-4">
                  <p>
                    16.1 We may update or modify these Terms from time to time
                    to reflect changes in our Services, legal or regulatory
                    requirements, or for other operational reasons.
                  </p>
                  <p>
                    16.2 Where required by law or where changes are material, we
                    will notify you through the app, by email, or by other
                    appropriate means. Your continued use of the Services after
                    such changes take effect constitutes your acceptance of the
                    updated Terms.
                  </p>
                </div>
              </div>

              {/* 17. Governing Law & Dispute Resolution */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">
                  17. Governing Law and Dispute Resolution
                </h4>
                <div className="flex flex-col gap-4">
                  <p>
                    17.1 These Terms and any disputes arising out of or relating
                    to them or your use of the Services shall be governed by and
                    construed in accordance with the laws of the Federal
                    Republic of Nigeria.
                  </p>
                  <p>
                    17.2 You agree that the courts of competent jurisdiction in
                    Nigeria shall have exclusive jurisdiction over any dispute
                    arising out of or in connection with these Terms or your use
                    of the Services.
                  </p>
                </div>
              </div>

              {/* 18. Notices */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">18. Notices</h4>
                <div className="flex flex-col gap-4">
                  <p>
                    18.1 We may provide notices or other communications to you
                    electronically, including via in-app notifications, SMS,
                    email, or by posting on our website. Such communications
                    shall be deemed received when sent or made available.
                  </p>
                  <p>
                    18.2 You agree to keep your contact details (email address,
                    phone number, and mailing address) up-to-date in the app so
                    that we can reach you when necessary.
                  </p>
                </div>
              </div>

              {/* 19. Contact Us */}
              <div className="flex flex-col gap-4">
                <h4 className="text-primary font-bold">19. Contact Us</h4>
                <div className="flex flex-col gap-4">
                  <p>
                    If you have any questions or concerns about these Terms or
                    the ValarPay Services, you may contact us at:
                  </p>
                  <p>
                    <span className="font-semibold">Company:</span> VALAR GLOBAL
                    SERVICES LIMITED
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    <a
                      href="mailto:support@valarpay.com"
                      className="text-primary underline"
                    >
                      support@valarpay.com
                    </a>
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span> +2349029852374
                  </p>
                  <p>
                    <span className="font-semibold">Head Office Address:</span>{" "}
                    23, OGAGIFO STREET, OFF DBS ROAD, BEFORE GQ SUITES, ASABA,
                    DELTA STATE, NIGERIA.
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
