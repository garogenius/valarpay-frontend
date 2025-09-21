"use client";
import useUserStore from "@/store/user.store";
import BalanceCard from "../BalanceCard";
import UnverifiedDashboard from "./UnverifiedDashboard";
import { TIER_LEVEL } from "@/constants/types";
import VerifiedDashboard from "./VerifiedDashboard";
import { useEffect, useState } from "react";

const DashboardContent = () => {
  const { user } = useUserStore();
  const isBvnVerified =
    user?.tierLevel !== TIER_LEVEL.notSet && user?.isBvnVerified;
  const isPinCreated = user?.isWalletPinSet;

  const isVerified = isBvnVerified && isPinCreated;

  const [verificationStatus, setVerificationStatus] = useState(isVerified);

  useEffect(() => {
    setVerificationStatus(isVerified);
  }, [isVerified]);

  return (
    <div className="flex flex-col gap-4 pb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2">
        {user?.wallet &&
          user?.wallet?.map((wallet) => (
            <BalanceCard
              key={wallet.id}
              currency={wallet.currency.toLowerCase()}
              balance={wallet.balance}
            />
          ))}
      </div>
      {verificationStatus ? (
        <VerifiedDashboard />
      ) : (
        <UnverifiedDashboard setVerified={setVerificationStatus} />
      )}
    </div>
  );
};

export default DashboardContent;
