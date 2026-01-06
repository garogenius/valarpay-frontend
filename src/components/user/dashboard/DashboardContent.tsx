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
  const isNinVerified = user?.isNinVerified || false;
  const isPinCreated = user?.isWalletPinSet;

  // User must verify either BVN or NIN
  const isIdentityVerified = isBvnVerified || isNinVerified;
  const isVerified = isIdentityVerified && isPinCreated;

  const [verificationStatus, setVerificationStatus] = useState(isVerified);
  const [showVerificationModal, setShowVerificationModal] = useState(!isIdentityVerified);

  useEffect(() => {
    setVerificationStatus(isVerified);
    // Show modal if user hasn't verified BVN or NIN
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

  return (
    <>
      <div className="flex flex-col gap-4 sm:gap-6 pb-10">
        {/* Welcome Section */}
        <div className="flex flex-col gap-1">
          <h1 className="text-xl sm:text-2xl font-semibold text-white">
            Welcome Back, {user?.fullname?.split(' ')[0] || 'User'}
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

      {/* Account Verification Modal - Non-dismissible if not verified */}
      <AccountVerificationModal
        isOpen={showVerificationModal}
        onClose={() => {
          // Only allow closing if verification is complete
          if (isIdentityVerified) {
            setShowVerificationModal(false);
          }
        }}
        onSuccess={handleVerificationSuccess}
        isRequired={!isIdentityVerified}
      />
    </>
  );
};

export default DashboardContent;
