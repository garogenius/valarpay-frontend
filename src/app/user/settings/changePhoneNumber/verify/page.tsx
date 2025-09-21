import VerifyPhoneNumberContent from "@/components/user/settings/change-phoneNumber/VerifyPhoneNumberContent";
import SettingsBack from "@/components/user/settings/SettingsBack";

const VerifyPhoneNumberPage = () => {
  return (
    <div className="flex flex-col gap-2.5 xs:gap-4 py-4">
      <SettingsBack />
      <VerifyPhoneNumberContent />
    </div>
  );
};

export default VerifyPhoneNumberPage;
