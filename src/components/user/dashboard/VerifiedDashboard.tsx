import RecentTransactions from "./RecentTransactions";
import AnalyticsPanel from "./AnalyticsPanel";

const VerifiedDashboard = () => {
  return (
    <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
      <RecentTransactions />
      <AnalyticsPanel />
    </div>
  );
};

export default VerifiedDashboard;
