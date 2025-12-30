"use client";
import useUserStore from "@/store/user.store";
import UnverifiedDashboard from "./UnverifiedDashboard";
import { TIER_LEVEL } from "@/constants/types";
import VerifiedDashboard from "./VerifiedDashboard";
import { useEffect, useState } from "react";
import QuickAccess from "./QuickAccess";
import AccountNumberCard from "../AccountNumberCard";
import StatsCardsRow from "./StatsCardsRow";
import BvnVerificationModal from "@/components/modals/BvnVerificationModal";

const DashboardContent = () => {
  const { user } = useUserStore();
  const isBvnVerified =
    user?.tierLevel !== TIER_LEVEL.notSet && user?.isBvnVerified;
  const isPinCreated = user?.isWalletPinSet;

  const isVerified = isBvnVerified && isPinCreated;

  const [verificationStatus, setVerificationStatus] = useState(isVerified);
  const [showBvnModal, setShowBvnModal] = useState(false);

  useEffect(() => {
    setVerificationStatus(isVerified);
  }, [isVerified]);

  const handleBvnSuccess = () => {
    // User data will be refreshed via query invalidation in the mutation
    // The verification status will update when user data changes
  };

  return (
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

      {/* BVN Verification Modal */}
      <BvnVerificationModal
        isOpen={showBvnModal}
        onClose={() => setShowBvnModal(false)}
        onSuccess={handleBvnSuccess}
      />
    </div>
  );
};

export default DashboardContent;
