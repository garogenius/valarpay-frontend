"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { FaPaperclip } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";

import CustomButton from "@/components/shared/Button";
import SpinnerLoader from "@/components/Loader/SpinnerLoader";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import { useReportScam } from "@/api/user/user.queries";

const reportSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
});
type ReportFormData = yup.InferType<typeof reportSchema>;

interface ReportScamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReportScamModal: React.FC<ReportScamModalProps> = ({ isOpen, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const form = useForm<ReportFormData>({
    defaultValues: { title: "", description: "" },
    resolver: yupResolver(reportSchema),
    mode: "onChange",
  });
  const { register, handleSubmit, formState, reset } = form;
  const { errors, isValid } = formState;

  const onSuccess = () => {
    SuccessToast({
      title: "Report sent",
      description: "Your report has been successfully sent.",
    });
    reset();
    setFile(null);
    onClose();
  };

  const onError = (error: any) => {
    const errorMessage =
      (error as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message ??
      "Something went wrong";
    ErrorToast({
      title: "Error sending report",
      descriptions: Array.isArray(errorMessage) ? errorMessage : [errorMessage],
    });
  };

  const { mutate: reportScam, isPending: reportingPending, isError: reportingError } = useReportScam(onError, onSuccess);
  const reporting = reportingPending && !reportingError;

  const onSubmitReport = async (data: ReportFormData) => {
    const payload = new FormData();
    payload.append("title", data.title);
    payload.append("description", data.description);
    if (!file) {
      toast.error("Add attachment", { duration: 3000 });
      return;
    }
    payload.append("screenshot", file);
    reportScam(payload);
  };

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
                  <p className="text-white text-sm font-semibold">Report Scam</p>
                  <p className="text-gray-400 text-xs mt-1">Report any suspicious activity or fraudulent transaction</p>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close">
                  <IoClose className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="px-5 py-5">
              <form onSubmit={handleSubmit(onSubmitReport)} className="space-y-4">
                <div className="space-y-1">
                  <p className="text-gray-400 text-[11px]">Title</p>
                  <input
                    className="w-full bg-[#141416] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none"
                    placeholder="Enter Title"
                    type="text"
                    {...register("title")}
                  />
                  {errors.title?.message ? <p className="text-xs text-red-500">{errors.title.message}</p> : null}
                </div>

                <div className="space-y-1">
                  <p className="text-gray-400 text-[11px]">Description</p>
                  <textarea
                    className="min-h-[90px] w-full bg-[#141416] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none resize-none"
                    placeholder="Enter Description"
                    {...register("description")}
                  />
                  {errors.description?.message ? <p className="text-xs text-red-500">{errors.description.message}</p> : null}
                </div>

                <div className="rounded-lg border border-gray-800 bg-[#141416] p-4">
                  <label htmlFor="report-scam-file" className="cursor-pointer flex items-center text-[#FF6B2C] text-sm">
                    <FaPaperclip className="mr-2" />
                    <span>{file ? "Replace Attachment" : "Add Attachment"}</span>
                  </label>
                  <input
                    id="report-scam-file"
                    type="file"
                    className="hidden"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  {file ? (
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-gray-300">
                        {file.name.length > 22 ? `${file.name.slice(0, 12)}...${file.name.slice(-7)}` : file.name}
                      </span>
                      <button type="button" onClick={() => setFile(null)} className="text-xs text-red-400 hover:text-red-300">
                        Remove
                      </button>
                    </div>
                  ) : null}
                </div>

                <CustomButton type="submit" disabled={!isValid || reporting} isLoading={reporting} className="w-full py-3 border-2 border-primary text-black">
                  {reporting ? "Reporting..." : "Report"}
                </CustomButton>
                {reporting ? (
                  <div className="flex items-center justify-center pt-1">
                    <SpinnerLoader width={18} height={18} color="#FF6B2C" />
                  </div>
                ) : null}
              </form>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
};

export default ReportScamModal;


