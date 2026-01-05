/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useMemo, useState } from "react";
import ReportScamModal from "@/components/modals/ReportScamModal";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { MdEmail, MdPhone, MdReportProblem } from "react-icons/md";
import Link from "next/link";

import ErrorToast from "@/components/toast/ErrorToast";

const SUPPORT_EMAIL = "support@valarpay.com";
const SUPPORT_PHONE_DISPLAY = "+234-800-VALARPAY";
// We have one numeric phone in the codebase (used on receipt).
const SUPPORT_PHONE_TEL = "+2348134146906";

type FaqItem = { q: string; a: string };

const FAQS: FaqItem[] = [
  {
    q: "How do I reset my password?",
    a: 'Go to Settings > Security > Change Password, or tap "Forgot Password" on the login screen and follow the instructions sent to your email or phone.',
  },
  {
    q: "What should I do if a transaction fails but I'm debited?",
    a: "Most reversals happen automatically within a few minutes. If it doesn’t reverse, contact support with the transaction reference and screenshot.",
  },
  {
    q: "Can I have more than one account on ValarPay?",
    a: "No, each user can only have one verified account tied to their BVN and ID for security reasons.",
  },
  {
    q: "Can I schedule payments ahead of time?",
    a: "Yes, under Schedule Payments, you can set automatic airtime, bills, or transfers at specific dates or intervals.",
  },
  {
    q: "What if my transfer is delayed?",
    a: "Transfers may be delayed due to bank downtime or network issues. If it remains pending for too long, contact support with the reference.",
  },
  {
    q: "How long does it take for support to respond?",
    a: "Email responses take 24–48 hours, while live chat and phone support are usually instant during business hours.",
  },
];

const SupportContent = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [reportOpen, setReportOpen] = useState(false);

  const cardClass =
    "rounded-2xl bg-[#0F0F10] border border-gray-800 p-5 hover:bg-white/5 transition-colors text-left w-full";

  const quickLinks = useMemo(
    () => [
      { title: "Terms & Conditions", subtitle: "Understand the rules that guide your use of ValarPay", href: "/terms&condition" },
      { title: "Privacy Policy", subtitle: "See how we protect and manage your personal information", href: "/privacyPolicy" },
      { title: "About ValarPay", subtitle: "Learn more about who we are and what we do", href: "/about" },
    ],
    []
  );

  return (
    <div className="w-full max-w-6xl">
      {/* Header */}
      <div className="flex flex-row items-center gap-2 sm:gap-3 justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-white text-base sm:text-lg font-semibold truncate">Support Center</p>
          <p className="text-gray-400 text-[10px] sm:text-xs mt-0.5 sm:mt-1 line-clamp-1">Get help, report issues, and find answers</p>
        </div>
        <button
          type="button"
          className="flex-shrink-0 inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg bg-[#FF6B2C] text-black font-semibold text-[10px] sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2.5 hover:bg-[#FF7A3D] transition-colors whitespace-nowrap"
          onClick={() => window.open(`mailto:${SUPPORT_EMAIL}?subject=Support%20Live%20Chat%20Request`, "_blank")}
        >
          <span className="hidden xs:inline">Start Live Chat</span>
          <span className="xs:hidden">Chat</span>
        </button>
      </div>

      {/* Cards */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        <button
          type="button"
          className={cardClass}
          onClick={() => window.open(`mailto:${SUPPORT_EMAIL}`, "_blank")}
        >
          <div className="w-10 h-10 rounded-full bg-[#1C1C1E] flex items-center justify-center text-[#FF6B2C] mb-3">
            <MdEmail className="text-xl" />
          </div>
          <p className="text-white text-sm font-semibold">Email Support</p>
          <p className="text-gray-400 text-xs mt-1">Reach our support team anytime via email for quick help and inquiries</p>
        </button>

        <button
          type="button"
          className={cardClass}
          onClick={() => window.open(`tel:${SUPPORT_PHONE_TEL}`, "_self")}
        >
          <div className="w-10 h-10 rounded-full bg-[#1C1C1E] flex items-center justify-center text-[#FF6B2C] mb-3">
            <MdPhone className="text-xl" />
          </div>
          <p className="text-white text-sm font-semibold">Phone Support</p>
          <p className="text-gray-400 text-xs mt-1">
            Speak directly with our support team for faster assistance
          </p>
          <p className="text-gray-500 text-[11px] mt-2">{SUPPORT_PHONE_DISPLAY}</p>
        </button>

        <button type="button" className={cardClass} onClick={() => setReportOpen(true)}>
          <div className="w-10 h-10 rounded-full bg-[#1C1C1E] flex items-center justify-center text-[#FF6B2C] mb-3">
            <MdReportProblem className="text-xl" />
          </div>
          <p className="text-white text-sm font-semibold">Report Scam</p>
          <p className="text-gray-400 text-xs mt-1">Report any suspicious activity or fraudulent transaction</p>
        </button>
      </div>

      {/* FAQs */}
      <div className="mt-6 rounded-2xl border border-gray-800 bg-[#0A0A0A] overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800">
          <p className="text-white text-sm font-semibold">Frequently Asked Questions</p>
        </div>
        <div className="divide-y divide-gray-800">
          {FAQS.map((item, idx) => {
            const open = activeFaq === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveFaq((v) => (v === idx ? null : idx))}
                className="w-full text-left px-5 py-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-white text-sm font-medium">{item.q}</p>
                  <FiChevronDown className={`text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} />
                </div>
                {open ? <p className="text-gray-400 text-xs mt-2 leading-relaxed">{item.a}</p> : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-6 rounded-2xl border border-gray-800 bg-[#0A0A0A] overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800">
          <p className="text-white text-sm font-semibold">Quick Links</p>
        </div>
        <div className="divide-y divide-gray-800">
          {quickLinks.map((l) => (
            <Link key={l.href} href={l.href} className="block px-5 py-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-white text-sm font-medium">{l.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{l.subtitle}</p>
                </div>
                <FiChevronRight className="text-gray-500" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <ReportScamModal isOpen={reportOpen} onClose={() => setReportOpen(false)} />
    </div>
  );
};

export default SupportContent;
