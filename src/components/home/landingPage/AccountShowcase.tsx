"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionWrapper from "@/utils/hoc/SectionWrapper";
import { fadeIn, textVariant, zoomIn } from "@/utils/motion";
import { BsCheckCircleFill } from "react-icons/bs";
import { FaRegCreditCard } from "react-icons/fa6";
import { PiQrCodeBold } from "react-icons/pi";
// (no extra icons required for the added items)

const Chip = ({ label, active = false }: { label: string; active?: boolean }) => (
  <div
    className={`flex items-center justify-between w-full rounded-xl px-3 py-3 text-sm md:text-base shadow-sm border ${
      active
        ? "bg-secondary text-white border-transparent"
        : "bg-white text-text-200 border-border-400"
    }`}
  >
    <div className="flex items-center gap-2">
      <BsCheckCircleFill className={`${active ? "text-white" : "text-secondary"}`} />
      <span>{label}</span>
    </div>
    <span className={`text-lg ${active ? "opacity-90" : "text-text-800"}`}>•••</span>
  </div>
);

const StatRow = ({ label }: { label: string }) => (
  <div className="flex items-center gap-3 bg-white rounded-xl px-3 py-2 border border-border-400">
    <div className="w-3 h-3 rounded-full bg-secondary" />
    <p className="text-text-200 text-sm md:text-base">{label}</p>
  </div>
);

const AccountShowcase = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.25 });

  return (
    <motion.div
      ref={ref}
      animate={isInView ? "show" : "hidden"}
      initial="hidden"
      className="w-full flex flex-col items-center py-14 md:py-20 bg-bg-400 dark:bg-dark-primary"
    >
      {/* Header */}
      <div className="w-[90%] md:w-[80%] lg:w-[70%] flex flex-col items-center text-center">
        <motion.span
          variants={fadeIn("up", "spring", 0.05, 0.5)}
          className="text-xs md:text-sm tracking-[0.2em] text-secondary font-semibold"
        >
          BUILT FOR GROWTH
        </motion.span>
        <motion.h2
          variants={textVariant(0.1)}
          className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-text-200 dark:text-text-400"
        >
          Banking designed for personal and business growth
        </motion.h2>
        <motion.p
          variants={fadeIn("up", "spring", 0.15, 0.5)}
          className="mt-2 text-text-1000 dark:text-text-400/80 text-sm md:text-base max-w-2xl"
        >
          Providing financial solutions that empower both business and individuals to thrive and achieve remarkable growth milestones.
        </motion.p>
      </div>

      {/* Cards */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-5 w-[90%] md:w-[86%] xl:w-[75%]">
        {/* Personal Account */}
        <motion.div
          variants={zoomIn(0.1, 0.5)}
          className="rounded-2xl bg-[#E6EAEC] dark:bg-[#041943]/60 p-4 md:p-5 border border-white/40 shadow-sm"
        >
          <h3 className="text-lg md:text-xl font-semibold text-text-200 dark:text-white">Personal account</h3>
          <p className="text-sm text-text-1000 dark:text-text-400 mt-1">
            Open a personal account with ValarPay to manage your
          </p>

          <div className="mt-4 flex flex-col gap-3">
            <Chip label="Bill payments" active />
            <Chip label="Personal Savings" />
            <div className="flex items-center gap-2 w-full rounded-xl px-3 py-3 text-sm md:text-base shadow-sm border bg-white text-text-200 border-border-400">
              <PiQrCodeBold className="text-xl" />
              <span>QRCode Payments</span>
              <span className="ml-auto text-xl">⌁</span>
            </div>
            {/* Added items */}
            <Chip label="Savings & Investments" />
            <Chip label="Instant Virtual Cards" />
            <Chip label="Healthcare & Insurance" />
          </div>
        </motion.div>

        {/* Business Account */}
        <motion.div
          variants={zoomIn(0.15, 0.5)}
          className="rounded-2xl bg-[#E6EAEC] dark:bg-[#041943]/60 p-4 md:p-5 border border-white/40 shadow-sm"
        >
          <h3 className="text-lg md:text-xl font-semibold text-text-200 dark:text-white">Business account</h3>
          <p className="text-sm text-text-1000 dark:text-text-400 mt-1">
            Take your business to the next level with a business account from ValarPay.
          </p>

          <div className="mt-4 bg-white rounded-2xl p-4 border border-border-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-text-1000">Total Expenses</p>
                <p className="text-lg md:text-xl font-semibold">₦82,000.40</p>
              </div>
              <div className="relative w-14 h-14">
                <svg viewBox="0 0 36 36" className="w-14 h-14">
                  <path
                    className="text-bg-1500"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#00C566]"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="transparent"
                    strokeDasharray="85, 100"
                    d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">85%</span>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <StatRow label="Invoices" />
              <StatRow label="Payment links" />
              {/* Added items */}
              <StatRow label="Savings & Investments" />
              <StatRow label="Instant Virtual Cards" />
              <StatRow label="Healthcare & Insurance" />
            </div>
          </div>
        </motion.div>

        {/* Loan */}
        <motion.div
          variants={zoomIn(0.2, 0.5)}
          className="rounded-2xl bg-[#E6EAEC] dark:bg-[#041943]/60 p-4 md:p-5 border border-white/40 shadow-sm"
        >
          <h3 className="text-lg md:text-xl font-semibold text-text-200 dark:text-white">Loan</h3>
          <p className="text-sm text-text-1000 dark:text-text-400 mt-1">
            ValarPay offers a range of loan options to help you achieve your goals. Whether you need a
          </p>

          <div className="mt-4 bg-white rounded-2xl p-4 border border-border-400">
            <label className="block text-xs text-text-1000 mb-2">Select Loan Amount</label>
            <div className="rounded-xl border border-border-400 px-4 py-3 text-xl font-semibold text-text-200">₦2,000,000</div>
            <button className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-secondary text-white py-2.5 text-sm">
              <FaRegCreditCard /> Apply Now
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SectionWrapper(AccountShowcase, "account-showcase");
