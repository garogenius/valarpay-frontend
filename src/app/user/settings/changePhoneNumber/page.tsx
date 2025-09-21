import ValidatePhoneNumberContent from "@/components/user/settings/change-phoneNumber/ValidatePhoneNumberContent";
import SettingsBack from "@/components/user/settings/SettingsBack";

const ChangePhoneNumberPage = () => {
  return (
    <div className="flex flex-col gap-2.5 xs:gap-4 py-4">
      <SettingsBack />
      <ValidatePhoneNumberContent />
    </div>
  );
};

export default ChangePhoneNumberPage;
