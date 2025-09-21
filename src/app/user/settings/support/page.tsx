import SettingsBack from "@/components/user/settings/SettingsBack";
import SupportContent from "@/components/user/settings/SupportContent";

const SupportPage = () => {
  return (
    <div className="flex flex-col gap-2.5 xs:gap-4 py-4">
      <SettingsBack />
      <SupportContent />
    </div>
  );
};

export default SupportPage;
