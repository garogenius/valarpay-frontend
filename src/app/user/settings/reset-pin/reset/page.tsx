import ResetPinForm from "@/components/user/settings/reset-pin/ResetPinForm";
import SettingsBack from "@/components/user/settings/SettingsBack";

const ResetPinFormPage = () => {
  return (
    <div className="flex flex-col gap-2.5 xs:gap-4 py-4">
      <SettingsBack />
      <ResetPinForm />
    </div>
  );
};

export default ResetPinFormPage;
