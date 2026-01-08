"use client";

import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import CustomButton from "@/components/shared/Button";
import { useChangePassword } from "@/api/user/user.queries";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    ErrorToast({
      title: "Password Change Failed",
      descriptions: Array.isArray(errorMessage) ? errorMessage : [errorMessage || "Failed to change password"],
    });
  };

  const onSuccess = () => {
    SuccessToast({
      title: "Password Changed",
      description: "Your password has been changed successfully",
    });
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  const { mutate: changePassword, isPending } = useChangePassword(onError, onSuccess);

  const handleSubmit = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      ErrorToast({
        title: "Validation Error",
        descriptions: ["Please fill in all fields"],
      });
      return;
    }

    if (newPassword.length < 8) {
      ErrorToast({
        title: "Validation Error",
        descriptions: ["Password must be at least 8 characters long"],
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      ErrorToast({
        title: "Validation Error",
        descriptions: ["Passwords do not match"],
      });
      return;
    }

    changePassword({
      oldPassword,
      newPassword,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-md p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-white text-lg font-semibold">Change Password</h3>
            <p className="text-white/60 text-sm mt-1">Set a new secure password</p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <IoClose className="text-2xl" />
          </button>
        </div>

        <div className="space-y-3">
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Current Password"
            className="w-full bg-[#1C1C1E] border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#f76301]"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            className="w-full bg-[#1C1C1E] border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#f76301]"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm New Password"
            className="w-full bg-[#1C1C1E] border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#f76301]"
          />
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 rounded-lg bg-white/5 border border-white/10 text-white">
            Cancel
          </button>
          <CustomButton
            onClick={handleSubmit}
            disabled={!oldPassword || !newPassword || newPassword !== confirmPassword || newPassword.length < 8 || isPending}
            isLoading={isPending}
            className="flex-1 py-3 bg-[#f76301] hover:bg-[#f76301]/90 text-black disabled:opacity-50"
          >
            Update
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
