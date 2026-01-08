"use client";

import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import CustomButton from "@/components/shared/Button";
import { useCreatePasscode, useChangePasscode } from "@/api/user/user.queries";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import useUserStore from "@/store/user.store";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasscodeModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { user } = useUserStore();
  const hasPasscode = !!user?.passcode; // Check if user already has a passcode
  
  const [oldPasscode, setOldPasscode] = useState("");
  const [passcode, setPasscode] = useState("");
  const [confirm, setConfirm] = useState("");

  const onError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    ErrorToast({
      title: hasPasscode ? "Passcode Change Failed" : "Passcode Creation Failed",
      descriptions: Array.isArray(errorMessage) ? errorMessage : [errorMessage || "Failed to update passcode"],
    });
  };

  const onSuccess = () => {
    SuccessToast({
      title: hasPasscode ? "Passcode Changed" : "Passcode Created",
      description: hasPasscode ? "Your passcode has been changed successfully" : "Your passcode has been created successfully",
    });
    setOldPasscode("");
    setPasscode("");
    setConfirm("");
    onClose();
  };

  const { mutate: createPasscode, isPending: creating } = useCreatePasscode(onError, onSuccess);
  const { mutate: changePasscode, isPending: changing } = useChangePasscode(onError, onSuccess);

  const isPending = creating || changing;

  const handleSubmit = () => {
    if (!passcode || passcode.length !== 6) {
      ErrorToast({
        title: "Validation Error",
        descriptions: ["Passcode must be exactly 6 digits"],
      });
      return;
    }

    if (passcode !== confirm) {
      ErrorToast({
        title: "Validation Error",
        descriptions: ["Passcodes do not match"],
      });
      return;
    }

    if (hasPasscode) {
      if (!oldPasscode) {
        ErrorToast({
          title: "Validation Error",
          descriptions: ["Please enter your current passcode"],
        });
        return;
      }
      changePasscode({
        oldPasscode,
        newPasscode: passcode,
      });
    } else {
      createPasscode({
        passcode,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-md p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-white text-lg font-semibold">
              {hasPasscode ? "Change Login Passcode" : "Create Login Passcode"}
            </h3>
            <p className="text-white/60 text-sm mt-1">Update your 6-digit login passcode</p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <IoClose className="text-2xl" />
          </button>
        </div>

        <div className="space-y-3">
          {hasPasscode && (
            <input
              type="text"
              inputMode="numeric"
              value={oldPasscode}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                setOldPasscode(val);
              }}
              placeholder="Current passcode"
              maxLength={6}
              className="w-full bg-[#1C1C1E] border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#f76301]"
            />
          )}
          <input
            type="text"
            inputMode="numeric"
            value={passcode}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 6);
              setPasscode(val);
            }}
            placeholder="New passcode"
            maxLength={6}
            className="w-full bg-[#1C1C1E] border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#f76301]"
          />
          <input
            type="text"
            inputMode="numeric"
            value={confirm}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 6);
              setConfirm(val);
            }}
            placeholder="Confirm passcode"
            maxLength={6}
            className="w-full bg-[#1C1C1E] border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#f76301]"
          />
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 rounded-lg bg-white/5 border border-white/10 text-white">
            Cancel
          </button>
          <CustomButton
            onClick={handleSubmit}
            disabled={passcode.length !== 6 || passcode !== confirm || (hasPasscode && oldPasscode.length !== 6) || isPending}
            isLoading={isPending}
            className="flex-1 py-3 bg-[#f76301] hover:bg-[#f76301]/90 text-black disabled:opacity-50"
          >
            {hasPasscode ? "Update" : "Create"}
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default ChangePasscodeModal;
