import VerifyAccountForm from "@/components/user/settings/reset-pin/VerifyAccountForm";
import SettingsBack from "@/components/user/settings/SettingsBack";

const ResetPinPage = () => {
  return (
    <div className="flex flex-col gap-2.5 xs:gap-4 py-4">
      <SettingsBack />
      <VerifyAccountForm />
    </div>
  );
};

export default ResetPinPage;
