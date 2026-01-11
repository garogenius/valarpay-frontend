"use client";

import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import CustomButton from "@/components/shared/Button";
import ErrorToast from "@/components/toast/ErrorToast";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  documentTypeLabel: string;
  onSubmit: (data: { file: File | null; documentUrl: string }) => void;
};

const MAX_SIZE_MB = 5;
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "pdf"] as const;

const KycDocumentUploadModal: React.FC<Props> = ({ isOpen, onClose, documentTypeLabel, onSubmit }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>("");

  const isPdf = useMemo(() => {
    const ext = selectedFile?.name?.split(".").pop()?.toLowerCase();
    return ext === "pdf";
  }, [selectedFile]);

  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);

  if (!isOpen) return null;

  const reset = () => {
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    setSelectedFile(null);
    setFileUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || !ALLOWED_EXTENSIONS.includes(extension as any)) {
      ErrorToast({
        title: "Invalid File Type",
        descriptions: ["Selected file is not a supported format (JPEG, JPG, PNG, or PDF)."],
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const fileSizeMB = file.size / 1024 / 1024;
    if (fileSizeMB > MAX_SIZE_MB) {
      ErrorToast({
        title: "File Too Large",
        descriptions: [`Selected file size exceeds the limit (${MAX_SIZE_MB}MB).`],
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (fileUrl) URL.revokeObjectURL(fileUrl);
    setSelectedFile(file);
    setFileUrl(URL.createObjectURL(file));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    if (!selectedFile || !fileUrl) {
      ErrorToast({ title: "No File Selected", descriptions: ["Please select a file to upload"] });
      return;
    }
    onSubmit({ file: selectedFile, documentUrl: fileUrl });
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => {
          reset();
          onClose();
        }}
        aria-hidden="true"
      />
      <div className="relative bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-md p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-white text-lg font-semibold">Upload {documentTypeLabel}</h3>
            <p className="text-white/60 text-sm mt-1">Supported: JPEG, JPG, PNG, PDF (max {MAX_SIZE_MB}MB)</p>
          </div>
          <button
            onClick={() => {
              reset();
              onClose();
            }}
            className="text-white/60 hover:text-white"
          >
            <IoClose className="text-2xl" />
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileSelected}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#FF6B2C]/15 text-[#FF6B2C] border border-[#FF6B2C]/30 hover:bg-[#FF6B2C]/25 transition-colors"
        >
          <span>{selectedFile ? selectedFile.name : "Choose File"}</span>
        </button>

        {selectedFile && (
          <div className="mt-4 rounded-xl border border-white/10 bg-[#1C1C1E] p-3">
            <p className="text-white/80 text-xs mb-2">Preview</p>
            {isPdf ? (
              <div className="text-white/70 text-sm break-words">{selectedFile.name}</div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={fileUrl} alt="Selected document preview" className="w-full max-h-60 object-contain rounded-lg" />
            )}
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={reset}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => {
              reset();
              onClose();
            }}
            className="flex-1 py-3 rounded-lg bg-white/5 border border-white/10 text-white"
          >
            Cancel
          </button>
          <CustomButton
            onClick={handleSubmit}
            disabled={!selectedFile}
            className="flex-1 py-3 bg-[#FF6B2C] hover:bg-[#FF7A3D] text-black disabled:opacity-50"
          >
            Upload
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default KycDocumentUploadModal;


