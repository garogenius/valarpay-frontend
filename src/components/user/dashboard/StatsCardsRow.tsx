"use client";

import useUserStore from "@/store/user.store";
import DashboardAccountCard from "./DashboardAccountCard";
import SavingsTypeCard from "./cards/SavingsTypeCard";
import FixedDepositCard from "./cards/FixedDepositCard";
import InvestmentStatCard from "./cards/InvestmentStatCard";

const StatsCardsRow = () => {
  const { user } = useUserStore();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      <DashboardAccountCard wallets={user?.wallet || []} />
      <SavingsTypeCard />
      <FixedDepositCard />
      <InvestmentStatCard />
    </div>
  );
};

export default StatsCardsRow;
