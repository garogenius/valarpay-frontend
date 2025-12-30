"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DatePicker from "react-datepicker";

import useUserStore from "@/store/user.store";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { handleNumericKeyDown, handleNumericPaste } from "@/utils/utilityFunctions";
import CustomButton from "@/components/shared/Button";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";

import ChangeEmailModal from "@/components/modals/settings/ChangeEmailModal";
import VerifyEmailModal from "@/components/modals/settings/VerifyEmailModal";
import ChangePhoneInfoModal from "@/components/modals/settings/ChangePhoneInfoModal";
import ChangePhoneEnterModal from "@/components/modals/settings/ChangePhoneEnterModal";
import VerifyPhoneModal from "@/components/modals/settings/VerifyPhoneModal";
import UpdateUsernameModal from "@/components/modals/settings/UpdateUsernameModal";
import UpdateAddressModal from "@/components/modals/settings/UpdateAddressModal";
import ChangeTransactionPinModal from "@/components/modals/settings/ChangeTransactionPinModal";
import ChangePasswordModal from "@/components/modals/settings/ChangePasswordModal";
import ChangePasscodeModal from "@/components/modals/settings/ChangePasscodeModal";
import SetSecurityQuestionsModal from "@/components/modals/settings/SetSecurityQuestionsModal";
import LinkedAccountsModal from "@/components/modals/settings/LinkedAccountsModal";
import DeleteAccountModal from "@/components/modals/settings/DeleteAccountModal";
import VerifyWalletPinModal from "@/components/modals/settings/VerifyWalletPinModal";

import PersonalTab from "@/components/user/settings/tabs/PersonalTab";
import SecurityPrivacyTab from "@/components/user/settings/tabs/SecurityPrivacyTab";
import PreferencesTab from "@/components/user/settings/tabs/PreferencesTab";

import { useUpdateUser } from "@/api/user/user.queries";
import { CURRENCY } from "@/constants/types";
import usePaymentSettingsStore from "@/store/paymentSettings.store";
import { isFingerprintPaymentAvailable } from "@/services/fingerprintPayment.service";

const schema = yup.object().shape({
  email: yup.string().email("Email format is not valid").required("Email is required"),
  username: yup.string().required("Username is required"),
  fullname: yup.string().required("Full Name is required"),
  businessName: yup.string().optional(),
  phoneNumber: yup.string().optional(),
  dateOfBirth: yup.string().required("Date of birth is required"),
  referralCode: yup.string().optional(),
  accountTier: yup.string().optional(),
  accountNumber: yup.string().optional(),
});

type UserFormData = yup.InferType<typeof schema>;

const ProfileSettingsContent = () => {
  const { user } = useUserStore();
  const [tab, setTab] = useState<"personal" | "security" | "preferences">("personal");

  // personal
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imgUrl, setImgUrl] = useState(user?.profileImageUrl || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [addressDisplay, setAddressDisplay] = useState<string>((user as any)?.address || "");

  // modals
  const [openChangeEmail, setOpenChangeEmail] = useState(false);
  const [openVerifyEmail, setOpenVerifyEmail] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string>("");

  const [openChangePhone, setOpenChangePhone] = useState(false);
  const [openEnterPhone, setOpenEnterPhone] = useState(false);
  const [openVerifyPhone, setOpenVerifyPhone] = useState(false);
  const [pendingPhone, setPendingPhone] = useState<string>("");

  const [openUpdateUsername, setOpenUpdateUsername] = useState(false);
  const [openUpdateAddress, setOpenUpdateAddress] = useState(false);

  const [openChangePin, setOpenChangePin] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [openChangePasscode, setOpenChangePasscode] = useState(false);
  const [openSetSecurity, setOpenSetSecurity] = useState(false);
  const [openLinked, setOpenLinked] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // fingerprint
  const [openVerifyPinForFingerprint, setOpenVerifyPinForFingerprint] = useState(false);
  const [pendingFingerprintEnable, setPendingFingerprintEnable] = useState(false);
  const { fingerprintPaymentEnabled, setFingerprintPaymentEnabled } = usePaymentSettingsStore();
  const [isFingerprintAvailable, setIsFingerprintAvailable] = useState(false);

  useEffect(() => {
    isFingerprintPaymentAvailable().then(setIsFingerprintAvailable);
  }, []);

  useOnClickOutside(datePickerRef as React.RefObject<HTMLElement>, () => setShowDatePicker(false));

  const accountNumber = user?.wallet?.find((w) => w.currency === CURRENCY.NGN)?.accountNumber;
  const isBusinessAccount = user?.accountType === "BUSINESS" || user?.isBusiness === true;

  const form = useForm<UserFormData>({
    defaultValues: {
      email: user?.email,
      username: user?.username,
      fullname: user?.fullname,
      businessName: user?.businessName || "",
      phoneNumber: user?.phoneNumber || "",
      dateOfBirth: user?.dateOfBirth || "",
      referralCode: user?.referralCode || "",
      accountTier: `Tier ${user?.tierLevel}` || "",
      accountNumber: accountNumber || "",
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const { register, handleSubmit, formState, watch, setValue } = form;
  const { errors, isValid } = formState;
  const watchedDateOfBirth = watch("dateOfBirth");

  useEffect(() => {
    if (user?.profileImageUrl) setImgUrl(user.profileImageUrl);
  }, [user?.profileImageUrl]);

  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    const newDate = new Date(date);
    const day = newDate.getDate();
    const month = newDate.toLocaleString("en-US", { month: "short" });
    const year = newDate.getFullYear();
    setValue("dateOfBirth", `${day}-${month}-${year}`);
    setShowDatePicker(false);
  };

  const onError = async (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage) ? errorMessage : [errorMessage];
    ErrorToast({ title: "Error updating profile", descriptions });
  };

  const onSuccess = () => {
    SuccessToast({ title: "Update successful!", description: "Profile updated successfully" });
  };

  const { mutate: update, isPending: updatePending, isError: updateError } = useUpdateUser(onError, onSuccess);
  const updateLoading = updatePending && !updateError;

  const handleFileUpload = () => fileInputRef.current?.click();

  const handleFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const extension = file.name.split(".").pop()?.toLowerCase();
      if (extension && ["jpg", "jpeg", "png", "webp"].includes(extension)) {
        const fileSizeKB = file.size / 1024;
        if (fileSizeKB <= 500) {
          const imageUrl = URL.createObjectURL(file);
          setImgUrl(imageUrl);
          setSelectedFile(file);
        } else {
          toast.error("Selected file size exceeds the limit (500KB).", { duration: 3000 });
        }
      } else {
        toast.error("Unsupported image format (JPEG, JPG, PNG, WebP).", { duration: 3000 });
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data: UserFormData) => {
    const formData = new FormData();
    formData.append("fullName", data.fullname);
    formData.append("phoneNumber", data.phoneNumber || "");
    if (isBusinessAccount && data.businessName) formData.append("businessName", data.businessName);
    if (selectedFile) formData.append("profile-image", selectedFile);
    update(formData);
  };

  const currentPhone = user?.phoneNumber || "";

  return (
    <>
      <div className="flex flex-col gap-6 pb-10 px-3 sm:px-0">
        <div className="flex flex-col gap-5">
          <div className="w-full">
            <h1 className="text-white text-xl sm:text-2xl font-semibold">Profile & Settings</h1>
            <p className="text-white/60 text-sm mt-1">Manage your personal information and preferences</p>
          </div>

          {/* Tabs (match Payments page sizing) */}
          <div className="w-full">
            <div className="flex items-center gap-2 p-1 rounded-full border border-gray-800 bg-[#1C1C1E] w-full overflow-hidden">
              {[
                { key: "personal", label: "Personal" },
                { key: "security", label: "Security & Privacy" },
                { key: "preferences", label: "Preferences" },
              ].map((t: any) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  type="button"
                  className={`flex-1 min-w-0 text-[10px] xs:text-[11px] sm:text-xs px-2.5 xs:px-3 sm:px-4 py-2 rounded-full whitespace-nowrap truncate leading-none transition-colors ${
                    tab === t.key ? "bg-[#2C2C2E] text-white" : "text-gray-300 hover:bg-[#1C1C1E]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {tab === "personal" ? (
            <PersonalTab
              userFullname={(isBusinessAccount && user?.businessName ? user.businessName : user?.fullname) || ""}
              userEmail={user?.email || ""}
              imgUrl={imgUrl}
              onUploadClick={handleFileUpload}
              onRemovePhoto={() => {
                setImgUrl("");
                setSelectedFile(null);
              }}
              fileInputRef={fileInputRef}
              onFileSelected={handleFileSelected}
              register={register}
              errors={errors}
              isValid={isValid}
              updateLoading={updateLoading}
              onSubmit={onSubmit}
              handleSubmit={handleSubmit}
              watchedDateOfBirth={watchedDateOfBirth}
              showDatePicker={showDatePicker}
              setShowDatePicker={setShowDatePicker}
              datePickerRef={datePickerRef}
              handleDateChange={handleDateChange}
              addressDisplay={addressDisplay}
              onOpenUpdateUsername={() => setOpenUpdateUsername(true)}
              onOpenChangeEmail={() => setOpenChangeEmail(true)}
              onOpenChangePhone={() => setOpenChangePhone(true)}
              onOpenUpdateAddress={() => setOpenUpdateAddress(true)}
            />
          ) : null}

          {tab === "security" ? (
            <SecurityPrivacyTab
              fingerprint={fingerprintPaymentEnabled}
              onToggleFingerprint={() => {
                if (!isFingerprintAvailable) {
                  ErrorToast({
                    title: "Not Available",
                    descriptions: ["Biometric authentication is not available on this device"],
                  });
                  return;
                }
                if (!fingerprintPaymentEnabled) {
                  setPendingFingerprintEnable(true);
                  setOpenVerifyPinForFingerprint(true);
                } else {
                  setFingerprintPaymentEnabled(false);
                  SuccessToast({
                    title: "Fingerprint Payment Disabled",
                    description: "You can still use your PIN for payments",
                  });
                }
              }}
              onOpenChangePin={() => setOpenChangePin(true)}
              onOpenChangePassword={() => setOpenChangePassword(true)}
              onOpenChangePasscode={() => setOpenChangePasscode(true)}
              onOpenSetSecurity={() => setOpenSetSecurity(true)}
              onOpenLinked={() => setOpenLinked(true)}
              onOpenDelete={() => setOpenDelete(true)}
            />
          ) : null}

          {tab === "preferences" ? <PreferencesTab /> : null}
        </div>
      </div>

      <ChangeEmailModal
        isOpen={openChangeEmail}
        onClose={() => setOpenChangeEmail(false)}
        onSubmit={(newEmail: string) => {
          setPendingEmail(newEmail);
          setOpenChangeEmail(false);
          setOpenVerifyEmail(true);
        }}
      />
      <VerifyEmailModal
        isOpen={openVerifyEmail}
        onClose={() => setOpenVerifyEmail(false)}
        email={pendingEmail || user?.email || "your email"}
        onSubmit={(code: string) => {
          if (!code) return;
          setValue("email", pendingEmail || user?.email || "");
          setOpenVerifyEmail(false);
          SuccessToast({ title: "Email verified", description: "Your email has been updated successfully." });
        }}
      />

      <ChangePhoneInfoModal
        isOpen={openChangePhone}
        onClose={() => setOpenChangePhone(false)}
        onNext={() => {
          setOpenChangePhone(false);
          setOpenEnterPhone(true);
        }}
      />
      <ChangePhoneEnterModal
        isOpen={openEnterPhone}
        onClose={() => setOpenEnterPhone(false)}
        currentPhone={currentPhone}
        onValidateSuccess={(newPhone: string) => {
          setPendingPhone(newPhone);
          setOpenEnterPhone(false);
          setOpenVerifyPhone(true);
        }}
      />
      <VerifyPhoneModal
        isOpen={openVerifyPhone}
        onClose={() => {
          setOpenVerifyPhone(false);
          setPendingPhone("");
        }}
        phone={pendingPhone || currentPhone}
      />

      <UpdateUsernameModal
        isOpen={openUpdateUsername}
        onClose={() => setOpenUpdateUsername(false)}
        onSubmit={(username: string) => {
          setValue("username", username);
          setOpenUpdateUsername(false);
          SuccessToast({ title: "Username updated" });
        }}
      />
      <UpdateAddressModal
        isOpen={openUpdateAddress}
        onClose={() => setOpenUpdateAddress(false)}
        onSubmit={(addr: string) => {
          setAddressDisplay(addr);
          setOpenUpdateAddress(false);
          SuccessToast({ title: "Address updated" });
        }}
      />

      <ChangeTransactionPinModal isOpen={openChangePin} onClose={() => setOpenChangePin(false)} />
      <ChangePasswordModal isOpen={openChangePassword} onClose={() => setOpenChangePassword(false)} />
      <ChangePasscodeModal isOpen={openChangePasscode} onClose={() => setOpenChangePasscode(false)} />
      <SetSecurityQuestionsModal isOpen={openSetSecurity} onClose={() => setOpenSetSecurity(false)} onSubmit={() => SuccessToast({ title: "Saved" })} />
      <LinkedAccountsModal isOpen={openLinked} onClose={() => setOpenLinked(false)} />
      <DeleteAccountModal isOpen={openDelete} onClose={() => setOpenDelete(false)} />
      <VerifyWalletPinModal
        isOpen={openVerifyPinForFingerprint}
        onClose={() => {
          setOpenVerifyPinForFingerprint(false);
          setPendingFingerprintEnable(false);
        }}
        onVerify={() => {
          if (pendingFingerprintEnable) {
            setFingerprintPaymentEnabled(true);
            SuccessToast({
              title: "Fingerprint Payment Enabled",
              description: "You can now use fingerprint or Face ID for payments",
            });
            setPendingFingerprintEnable(false);
          }
          setOpenVerifyPinForFingerprint(false);
        }}
      />
    </>
  );
};

export default ProfileSettingsContent;


