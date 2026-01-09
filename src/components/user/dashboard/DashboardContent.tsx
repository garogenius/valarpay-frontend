"use client";
import useUserStore from "@/store/user.store";
import UnverifiedDashboard from "./UnverifiedDashboard";
import { TIER_LEVEL } from "@/constants/types";
import VerifiedDashboard from "./VerifiedDashboard";
import { useEffect, useState } from "react";
import QuickAccess from "./QuickAccess";
import AccountNumberCard from "../AccountNumberCard";
import StatsCardsRow from "./StatsCardsRow";
import AccountVerificationModal from "@/components/modals/AccountVerificationModal";

const DashboardContent = () => {
  const { user } = useUserStore();
  const hasNgnWallet = !!user?.wallet?.find((w: any) => w.currency === "NGN");
  const isBvnVerified =
    hasNgnWallet || (user?.tierLevel !== TIER_LEVEL.notSet && user?.isBvnVerified);
  const isPinCreated = user?.isWalletPinSet;

  // User must verify BVN
  const isIdentityVerified = isBvnVerified;
  const isVerified = isIdentityVerified && isPinCreated;

  const [verificationStatus, setVerificationStatus] = useState(isVerified);
  const [showVerificationModal, setShowVerificationModal] = useState(!isIdentityVerified);

  useEffect(() => {
    setVerificationStatus(isVerified);
    // Show modal if user hasn't verified BVN
    // Only show if not verified, don't hide if already showing (to prevent flicker)
    if (!isIdentityVerified && !showVerificationModal) {
      setShowVerificationModal(true);
    } else if (isIdentityVerified && showVerificationModal) {
      // Close modal when verification is complete
      setShowVerificationModal(false);
    }
  }, [isVerified, isIdentityVerified, showVerificationModal]);

  const handleVerificationSuccess = () => {
    // User data will be refreshed via query invalidation in the mutation
    // The verification status will update when user data changes
    // Modal will close automatically when isIdentityVerified becomes true
  };

  // Block dashboard access until verification is complete
  if (!isIdentityVerified) {
    return (
      <>
        {/* Show minimal UI while verification is required */}
        <div className="flex flex-col gap-4 sm:gap-6 pb-10">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl sm:text-2xl font-semibold text-white">
              Welcome Back, {user?.username || 'User'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">Please verify your identity to continue</p>
          </div>
        </div>

        {/* Account Verification Modal - Non-dismissible until verified */}
        <AccountVerificationModal
          isOpen={true}
          onClose={() => {
            // Prevent closing until verification is complete
            // Do nothing - modal cannot be closed
          }}
          onSuccess={handleVerificationSuccess}
          isRequired={true}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:gap-6 pb-10">
        {/* Welcome Section */}
        <div className="flex flex-col gap-1">
          <h1 className="text-xl sm:text-2xl font-semibold text-white">
            Welcome Back, {user?.username || 'User'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">Here's what's happening with your finances today</p>
        </div>

        <StatsCardsRow />
        {/* <AccountNumberCard /> */}
        <QuickAccess />
        {verificationStatus ? (
          <VerifiedDashboard />
        ) : (
          <UnverifiedDashboard setVerified={setVerificationStatus} />
        )}
      </div>

      {/* Account Verification Modal - Only show if PIN not created yet */}
      {!isPinCreated && (
        <AccountVerificationModal
          isOpen={showVerificationModal}
          onClose={() => {
            // Only allow closing if PIN is created
            if (isPinCreated) {
              setShowVerificationModal(false);
            }
          }}
          onSuccess={handleVerificationSuccess}
          isRequired={!isPinCreated}
        />
      )}
    </>
  );
};

export default DashboardContent;
