import TierContent from "@/components/user/settings/tiers/TierContent";
import SettingsBack from "@/components/user/settings/SettingsBack";

const TierPage = () => {
  return (
    <div className="flex flex-col gap-2.5 xs:gap-4 py-4">
      <SettingsBack />
      <TierContent />
    </div>
  );
};

export default TierPage;
