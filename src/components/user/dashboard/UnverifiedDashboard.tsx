"use client";
import Image from "next/image";
import icons from "../../../../public/icons";
import CustomButton from "@/components/shared/Button";
import { useState } from "react";
import useUserStore from "@/store/user.store";
import { TIER_LEVEL } from "@/constants/types";
import AccountVerificationModal from "@/components/modals/AccountVerificationModal";

const UnverifiedDashboard = ({
  setVerified,
}: {
  setVerified: (status: boolean) => void;
}) => {
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const handleVerificationSuccess = () => {
    setVerified(true);
  };

  return (
    <>
      <div className="bg-white dark:bg-bg-1100 rounded-xl h-full w-full flex flex-col px-4">
        <div className="py-40 flex flex-col justify-center items-center gap-6 sm:gap-8">
          <div className="p-5 rounded-full bg-bg-2300">
            <Image
              src={icons.userIcons.plusIcon}
              alt="add-icon"
              className="w-8 sm:w-10"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl text-text-200 dark:text-text-1400">
            No Data Yet
          </h2>

          <CustomButton
            type="button"
            onClick={() => {
              setShowVerificationModal(true);
            }}
            className="w-fit border-2 border-primary text-black font-semibold text-base 2xs:text-lg px-8 sm:px-12 xl:px-20 py-3.5 xs:py-4"
          >
            Complete your Profile
          </CustomButton>
        </div>
      </div>

      {/* Account Verification Modal */}
      <AccountVerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onSuccess={handleVerificationSuccess}
      />
    </>
  );
};

export default UnverifiedDashboard;
