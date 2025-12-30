"use client";

import React from "react";
import { IoClose } from "react-icons/io5";
import CustomButton from "@/components/shared/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const DeleteAccountModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-md p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-white text-lg font-semibold">Delete Account</h3>
            <p className="text-white/60 text-sm mt-1">This action is permanent and cannot be undone.</p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <IoClose className="text-2xl" />
          </button>
        </div>

        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <p className="text-red-300 text-sm">
            Deleting your account will remove your profile and associated data from ValarPay.
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 rounded-lg bg-white/5 border border-white/10 text-white">
            Cancel
          </button>
          <CustomButton
            onClick={onClose}
            className="flex-1 py-3 bg-red-500 hover:bg-red-600"
          >
            Delete
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;




