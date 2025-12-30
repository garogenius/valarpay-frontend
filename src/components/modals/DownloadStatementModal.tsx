"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ErrorToast from "@/components/toast/ErrorToast";

interface DownloadStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DownloadStatementModal: React.FC<DownloadStatementModalProps> = ({ isOpen, onClose }) => {
  const [statementStart, setStatementStart] = useState<Date | null>(null);
  const [statementEnd, setStatementEnd] = useState<Date | null>(null);
  const [statementEmail, setStatementEmail] = useState<string>("");

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            className="relative w-full max-w-md bg-[#0A0A0A] rounded-2xl border border-gray-800 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 pt-4 pb-4 border-b border-gray-800">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-white text-sm font-semibold">Download Statement</p>
                  <p className="text-gray-400 text-xs mt-1">Access and download your account statement</p>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close">
                  <IoClose className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="px-5 py-5 space-y-4">
              <div className="space-y-1">
                <p className="text-gray-400 text-[11px]">Start Date</p>
                <DatePicker
                  selected={statementStart}
                  onChange={(d) => setStatementStart(d)}
                  placeholderText="Enter Start Date"
                  className="w-full bg-[#141416] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none"
                  calendarClassName="!bg-[#0A0A0A] !border !border-gray-800"
                  popperClassName="z-[80]"
                />
              </div>

              <div className="space-y-1">
                <p className="text-gray-400 text-[11px]">End Date</p>
                <DatePicker
                  selected={statementEnd}
                  onChange={(d) => setStatementEnd(d)}
                  placeholderText="Enter Start Date"
                  className="w-full bg-[#141416] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none"
                  calendarClassName="!bg-[#0A0A0A] !border !border-gray-800"
                  popperClassName="z-[80]"
                />
              </div>

              <div className="space-y-1">
                <p className="text-gray-400 text-[11px]">Email address</p>
                <input
                  value={statementEmail}
                  onChange={(e) => setStatementEmail(e.target.value)}
                  placeholder="Enter where you want to receive it"
                  className="w-full bg-[#141416] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none"
                  type="email"
                />
              </div>

              <button
                type="button"
                className="w-full rounded-full bg-[#FF6B2C] text-black text-sm font-semibold py-3 hover:bg-[#FF7A3D] transition-colors"
                onClick={() =>
                  ErrorToast({
                    title: "Not available",
                    descriptions: ["Statement download is not wired yet."],
                  })
                }
              >
                Download
              </button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
};

export default DownloadStatementModal;

















