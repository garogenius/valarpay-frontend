import ProfileContent from "@/components/user/settings/ProfileContent";
import SettingsBack from "@/components/user/settings/SettingsBack";

const ProfilePage = () => {
  return (
    <div className="flex flex-col gap-2.5 xs:gap-4 py-4">
      <SettingsBack />
      <ProfileContent />
    </div>
  );
};

export default ProfilePage;
