"use client";

import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import CustomButton from "@/components/shared/Button";
import { useChangePin } from "@/api/user/user.queries";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";

interface ChangePinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePinModal: React.FC<ChangePinModalProps> = ({ isOpen, onClose }) => {
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const onError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    ErrorToast({
      title: "PIN Change Failed",
      descriptions: Array.isArray(errorMessage) ? errorMessage : [errorMessage || "Failed to change PIN"],
    });
  };

  const onSuccess = () => {
    SuccessToast({
      title: "PIN Changed",
      description: "Your transaction PIN has been changed successfully",
    });
    setCurrentPin("");
    setNewPin("");
    setConfirmPin("");
    onClose();
  };

  const { mutate: changePin, isPending } = useChangePin(onError, onSuccess);

  const handleSubmit = () => {
    if (!currentPin || currentPin.length !== 4) {
      ErrorToast({
        title: "Validation Error",
        descriptions: ["Please enter your current 4-digit PIN"],
      });
      return;
    }

    if (!newPin || newPin.length !== 4) {
      ErrorToast({
        title: "Validation Error",
        descriptions: ["Please enter a new 4-digit PIN"],
      });
      return;
    }

    if (newPin !== confirmPin) {
      ErrorToast({
        title: "Validation Error",
        descriptions: ["PINs do not match"],
      });
      return;
    }

    if (currentPin === newPin) {
      ErrorToast({
        title: "Validation Error",
        descriptions: ["New PIN must be different from current PIN"],
      });
      return;
    }

    changePin({
      oldPin: currentPin,
      newPin: newPin,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-[#0A0A0A] rounded-2xl w-full max-w-md mx-4 p-6 shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-white text-lg font-semibold">Change Transaction PIN</h3>
            <p className="text-gray-400 text-sm mt-1">Secure your payments by updating your transaction PIN</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <IoClose className="text-2xl" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-gray-400 text-xs mb-2 block">Current PIN</label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="Enter current PIN"
              value={currentPin}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                setCurrentPin(val);
              }}
              className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#f76301]"
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-2 block">New PIN</label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="Enter new PIN"
              value={newPin}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                setNewPin(val);
              }}
              className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#f76301]"
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-2 block">Confirm New PIN</label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="Confirm new PIN"
              value={confirmPin}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                setConfirmPin(val);
              }}
              className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#f76301]"
            />
          </div>
        </div>

        <CustomButton 
          onClick={handleSubmit} 
          disabled={currentPin.length !== 4 || newPin.length !== 4 || newPin !== confirmPin || isPending}
          isLoading={isPending}
          className="w-full py-3 bg-[#f76301] hover:bg-[#f76301]/90 text-black"
        >
          Update PIN
        </CustomButton>
      </div>
    </div>
  );
};

export default ChangePinModal;
