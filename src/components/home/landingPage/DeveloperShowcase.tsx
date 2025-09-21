"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionWrapper from "@/utils/hoc/SectionWrapper";
import { fadeIn, textVariant, zoomIn } from "@/utils/motion";
import Link from "next/link";
import { BsCheckCircleFill } from "react-icons/bs";

const Bullet = ({ text }: { text: string }) => (
  <div className="flex items-start gap-3">
    <BsCheckCircleFill className="mt-0.5 text-text-1600" />
    <p className="text-sm md:text-base text-text-900/90 dark:text-text-400/90">{text}</p>
  </div>
);

const codeSample = `// Create a payment link
const link = await valar.payments.createLink({
  amount: 200000,
  currency: "NGN",
  description: "Pro plan",
  customer: { email: "jane@company.com" },
});

// Verify a transfer
await valar.transfers.verify({ reference: link.reference });`;

const DeveloperShowcase = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.25 });

  return (
    <motion.div
      ref={ref}
      animate={isInView ? "show" : "hidden"}
      initial="hidden"
      className="w-full flex justify-center py-16 md:py-24 bg-dark-primary"
    >
      <div className="w-[90%] md:w-[86%] xl:w-[75%] grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 items-stretch">
        {/* Left content */}
        <motion.div variants={fadeIn("right", "spring", 0.05, 0.6)} className="flex flex-col gap-4">
          <span className="text-xs md:text-sm tracking-[0.2em] text-secondary font-semibold">
            DESIGNED FOR DEVELOPERS
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
            Build faster with modern, well-documented APIs
          </h2>
          <p className="text-sm md:text-base text-text-900/90 dark:text-text-400/90 max-w-prose">
            Ship payments, payouts, and financial operations in days—not months. Our unified
            APIs, SDKs and webhooks are crafted to be predictable and easy to reason about.
          </p>

          <div className="mt-2 flex flex-col gap-2.5">
            <Bullet text="Collect one‑time and recurring payments from your app or site" />
            <Bullet text="Access real-time webhooks for every lifecycle event" />
            <Bullet text="Query transactions, settlements and disputes in one place" />
            <Bullet text="Power transfers, bill payments and virtual accounts from the same API" />
          </div>

          <div className="mt-5">
            <Link
              href="/developer/api-documentation"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-secondary text-white hover:opacity-95"
            >
              Read our documentations
              <span aria-hidden>→</span>
            </Link>
          </div>
        </motion.div>

        {/* Right code/card */}
        <motion.div
          variants={zoomIn(0.1, 0.6)}
          className="relative rounded-2xl p-5 md:p-6 bg-[#0E2E23] border border-[#22c55e]/30 shadow-[0_0_0_1px_rgba(34,197,94,0.15)]"
        >
          <div className="absolute inset-0 rounded-2xl pointer-events-none ring-1 ring-inset ring-[#22c55e]/20" />
          <pre className="whitespace-pre-wrap text-sm md:text-[15px] leading-relaxed text-[#c8f3d6] font-mono">
{codeSample}
          </pre>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-[#22c55e]/30 bg-[#0f3a2a] px-4 py-3">
              <p className="text-xs text-[#86efac]">Webhooks</p>
              <p className="text-sm text-white">Retries on failures automatically.</p>
            </div>
            <div className="rounded-xl border border-[#22c55e]/30 bg-[#0f3a2a] px-4 py-3">
              <p className="text-xs text-[#86efac]">SDKs</p>
              <p className="text-sm text-white">Type-safe clients for JS/TS.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SectionWrapper(DeveloperShowcase, "developer-showcase");
