import RecentTransactions from "./RecentTransactions";
import StatsContent from "./stats/StatsContent";

const VerifiedDashboard = () => {
  return (
    <div className="w-full flex flex-col md:gap-10 gap-8">
      <StatsContent />
      <RecentTransactions />
    </div>
  );
};

export default VerifiedDashboard;
