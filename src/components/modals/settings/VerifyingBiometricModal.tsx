"use client";

import CustomButton from "@/components/shared/Button";

interface VerifyingBiometricModalProps {
  isOpen: boolean;
  onCancel: () => void;
  biometricType: "fingerprint" | "face";
}

const VerifyingBiometricModal: React.FC<VerifyingBiometricModalProps> = ({
  isOpen,
  onCancel,
  biometricType,
}) => {
  if (!isOpen) return null;

  return (
    <div className="z-[999999] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 flex justify-center items-center w-full md:inset-0 h-[100dvh]">
      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
        <div className="absolute inset-0 bg-black/80 dark:bg-black/60" onClick={onCancel} />
      </div>
      <div className="relative mx-4 bg-bg-600 dark:bg-bg-1100 border border-border-800 dark:border-border-700 w-full max-w-md rounded-2xl overflow-visible">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Verifying {biometricType === "fingerprint" ? "Fingerprint" : "FaceID"}
          </h2>
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 mb-4 flex items-center justify-center">
              {biometricType === "fingerprint" ? (
                <svg
                  className="w-full h-full text-white/70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 103 0m-3-6V9m0 0a1.5 1.5 0 103 0m-3-3a1.5 1.5 0 103 0m0 3v6m0-6a1.5 1.5 0 103 0m0 0v3m0-3a1.5 1.5 0 103 0"
                  />
                </svg>
              ) : (
                <svg
                  className="w-full h-full text-white/70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </div>
            <p className="text-white/70 text-sm text-center">
              Scan your {biometricType === "fingerprint" ? "fingerprint" : "face"}
            </p>
          </div>
          <CustomButton
            onClick={onCancel}
            className="w-full bg-[#f76301] hover:bg-[#e55a00] text-black font-medium py-3 rounded-lg"
          >
            Cancel
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default VerifyingBiometricModal;


