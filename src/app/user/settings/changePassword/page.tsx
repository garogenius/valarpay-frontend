import ChangePasswordContent from "@/components/user/settings/ChangePasswordContent";
import SettingsBack from "@/components/user/settings/SettingsBack";

const ChangePasswordPage = () => {
  return (
    <div className="flex flex-col gap-2.5 xs:gap-4 py-4">
      <SettingsBack />
      <ChangePasswordContent />
    </div>
  );
};

export default ChangePasswordPage;
