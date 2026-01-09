"use client";

import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import CustomButton from "@/components/shared/Button";
import { useChangePin } from "@/api/user/user.queries";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ChangeTransactionPinModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentPin("");
      setNewPin("");
      setConfirmPin("");
    }
  }, [isOpen]);

  const onError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const errorText = Array.isArray(errorMessage) 
      ? errorMessage.join(" ") 
      : errorMessage || "Failed to change PIN";
    
    ErrorToast({
      title: "PIN Change Failed",
      descriptions: Array.isArray(errorMessage) ? errorMessage : [errorText],
    });
  };

  const onSuccess = (data: any) => {
    SuccessToast({
      title: "PIN Changed Successfully",
      description: "Your transaction PIN has been updated successfully. You can now use your new PIN for transactions.",
    });
    
    // Clear form fields
    setCurrentPin("");
    setNewPin("");
    setConfirmPin("");
    
    // Close modal after a short delay to ensure toast is visible
    setTimeout(() => {
      onClose();
    }, 1500);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60" 
        onClick={isPending ? undefined : onClose} 
        aria-hidden="true" 
      />
      <div className="relative bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-md p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-white text-lg font-semibold">Change Transaction PIN</h3>
            <p className="text-white/60 text-sm mt-1">Update your 4-digit transaction PIN</p>
          </div>
          <button 
            onClick={isPending ? undefined : onClose} 
            disabled={isPending}
            className="text-white/60 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IoClose className="text-2xl" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-white/60 text-xs mb-1 block">Current PIN</label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={currentPin}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                setCurrentPin(val);
              }}
              placeholder="Enter current PIN"
              disabled={isPending}
              className="w-full bg-[#1C1C1E] border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#FF6B2C] disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="text-white/60 text-xs mb-1 block">New PIN</label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={newPin}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                setNewPin(val);
              }}
              placeholder="Enter new PIN"
              disabled={isPending}
              className="w-full bg-[#1C1C1E] border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#FF6B2C] disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="text-white/60 text-xs mb-1 block">Confirm New PIN</label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={confirmPin}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                setConfirmPin(val);
              }}
              placeholder="Confirm new PIN"
              disabled={isPending}
              className="w-full bg-[#1C1C1E] border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#FF6B2C] disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button 
            onClick={isPending ? undefined : onClose} 
            disabled={isPending}
            className="flex-1 py-3 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <CustomButton
            onClick={handleSubmit}
            disabled={currentPin.length !== 4 || newPin.length !== 4 || newPin !== confirmPin || isPending}
            isLoading={isPending}
            className="flex-1 py-3 bg-[#FF6B2C] hover:bg-[#FF7A3D] text-black disabled:opacity-50"
          >
            {isPending ? "Updating..." : "Update"}
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default ChangeTransactionPinModal;




