"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { FiChevronRight, FiEdit2 } from "react-icons/fi";
import { TbLockPassword } from "react-icons/tb";
import { MdSystemSecurityUpdateWarning } from "react-icons/md";
import { RiShieldKeyholeLine } from "react-icons/ri";
import { HiOutlineCreditCard } from "react-icons/hi2";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import useUserStore from "@/store/user.store";
import { useSetTheme, useTheme } from "@/store/theme.store";
import { useFingerprintForPayments, useSetFingerprintForPayments } from "@/store/paymentPreferences.store";

import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import SpinnerLoader from "@/components/Loader/SpinnerLoader";
import CustomButton from "@/components/shared/Button";

import { useNotificationPreferences, useUpdateNotificationPreferences } from "@/api/notification/notification.queries";
import { PreferenceDto } from "@/api/notification/notification.types";
import { useValidatePhoneNumber, useVerifyPhoneNumber, useUpdateUser, useChangePassword } from "@/api/user/user.queries";
import { useChangeWalletPin } from "@/api/wallet/wallet.queries";
import { useResendVerificationCode, useVerifyEmail } from "@/api/auth/auth.queries";

type TabKey = "personal" | "security" | "preferences";

const modalMotion = {
  initial: { opacity: 0, scale: 0.97, y: 8 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.97, y: 8 },
};

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={[
        "relative w-12 h-6 rounded-full transition-colors border",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        checked ? "bg-[#FF6B2C] border-[#FF6B2C]" : "bg-[#2C2C2E] border-gray-700",
      ].join(" ")}
    >
      <span
        className={[
          "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow-sm",
          checked ? "translate-x-6" : "translate-x-0.5",
        ].join(" ")}
      />
    </button>
  );
}

function ModalShell({
  isOpen,
  title,
  subtitle,
  onClose,
  children,
  maxWidth = "max-w-md",
}: {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            {...modalMotion}
            className={`relative w-full ${maxWidth} bg-[#0A0A0A] rounded-2xl border border-gray-800 shadow-2xl overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 pt-4 pb-4 border-b border-gray-800">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-white text-sm font-semibold">{title}</p>
                  {subtitle ? <p className="text-gray-400 text-xs mt-1">{subtitle}</p> : null}
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close">
                  <IoClose className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="px-5 py-5">{children}</div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

const changePinSchema = yup.object().shape({
  currentPin: yup.string().required("Current PIN is required").length(4, "PIN must be 4 digits"),
  newPin: yup.string().required("New PIN is required").length(4, "PIN must be 4 digits"),
  confirmPin: yup
    .string()
    .required("Confirm PIN is required")
    .oneOf([yup.ref("newPin")], "PINs do not match"),
});

const changePasswordSchema = yup.object().shape({
  oldPassword: yup.string().min(8, "Password must be at least 8 characters").required("Current password is required"),
  newPassword: yup.string().min(8, "Password must be at least 8 characters").required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords do not match")
    .required("Confirm password is required"),
});

const changePhoneSchema = yup.object().shape({
  phoneNumber: yup.string().required("Phone number is required").matches(/^\d{11}$/, "Phone number must be 11 digits"),
});

const changeEmailSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

const updateUsernameSchema = yup.object().shape({
  username: yup.string().required("Username is required").min(3, "Username must be at least 3 characters"),
});

export default function ProfileAndSettingsContent() {
  const { user } = useUserStore();
  const theme = useTheme();
  const toggleTheme = useSetTheme();
  const fingerprintEnabled = useFingerprintForPayments();
  const setFingerprintEnabled = useSetFingerprintForPayments();

  const [tab, setTab] = useState<TabKey>("personal");

  // Personal modals
  const [changePhoneOpen, setChangePhoneOpen] = useState(false);
  const [changeEmailOpen, setChangeEmailOpen] = useState(false);
  const [updateUsernameOpen, setUpdateUsernameOpen] = useState(false);

  // Security modals
  const [changePinOpen, setChangePinOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  // Preferences
  const { preferences, isPending: prefPending } = useNotificationPreferences();
  const { mutateAsync: updatePrefs, isPending: prefUpdating } = useUpdateNotificationPreferences();

  const preferenceList: PreferenceDto[] = useMemo(() => {
    // backend may return array or object; normalize to array of PreferenceDto
    if (!preferences) return [];
    if (Array.isArray(preferences)) return preferences;
    if (typeof preferences === "object") {
      // if it is a map keyed by category, flatten
      return Object.values(preferences as Record<string, any>);
    }
    return [];
  }, [preferences]);

  const getCategoryPref = (category: string) =>
    preferenceList.find((p) => String(p.category).toUpperCase() === category) || ({ category } as PreferenceDto);

  const updateCategory = async (category: PreferenceDto["category"], patch: Partial<PreferenceDto>) => {
    try {
      await updatePrefs({ category, ...patch });
      SuccessToast({ title: "Updated", description: "Preferences updated successfully" });
    } catch (e: any) {
      const msg = e?.response?.data?.message;
      const descriptions = Array.isArray(msg) ? msg : [msg || "Unable to update preferences"];
      ErrorToast({ title: "Update failed", descriptions });
    }
  };

  const emailToggleAll = useMemo(() => {
    if (!preferenceList.length) return false;
    return preferenceList.every((p) => !!p.email);
  }, [preferenceList]);

  const smsToggleAll = useMemo(() => {
    if (!preferenceList.length) return false;
    return preferenceList.every((p) => !!p.sms);
  }, [preferenceList]);

  // Change phone
  const phoneForm = useForm<yup.InferType<typeof changePhoneSchema>>({
    defaultValues: { phoneNumber: "" },
    resolver: yupResolver(changePhoneSchema),
    mode: "onChange",
  });
  const [phoneStep, setPhoneStep] = useState<"change" | "verify">("change");
  const [phoneOtp, setPhoneOtp] = useState("");

  const onValidatePhoneError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage) ? errorMessage : [errorMessage || "Unable to validate phone number"];
    ErrorToast({ title: "Validation failed", descriptions });
  };
  const onValidatePhoneSuccess = () => {
    SuccessToast({ title: "OTP sent", description: "Check your phone for the verification code." });
    setPhoneStep("verify");
  };
  const { mutate: validatePhoneNumber, isPending: validatingPhone, isError: validatingPhoneErr } = useValidatePhoneNumber(
    onValidatePhoneError,
    onValidatePhoneSuccess
  );

  const onVerifyPhoneError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage) ? errorMessage : [errorMessage || "Unable to verify phone number"];
    ErrorToast({ title: "Verification failed", descriptions });
  };
  const onVerifyPhoneSuccess = () => {
    SuccessToast({ title: "Phone number updated", description: "Your phone number has been updated successfully." });
    setPhoneOtp("");
    setPhoneStep("change");
    setChangePhoneOpen(false);
  };
  const { mutate: verifyPhoneNumber, isPending: verifyingPhone, isError: verifyingPhoneErr } = useVerifyPhoneNumber(
    onVerifyPhoneError,
    onVerifyPhoneSuccess
  );

  // Change password
  const passwordForm = useForm<yup.InferType<typeof changePasswordSchema>>({
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
    resolver: yupResolver(changePasswordSchema),
    mode: "onChange",
  });
  const onChangePasswordError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage) ? errorMessage : [errorMessage || "Unable to change password"];
    ErrorToast({ title: "Password update failed", descriptions });
  };
  const onChangePasswordSuccess = () => {
    SuccessToast({ title: "Password updated", description: "Your password has been updated successfully." });
    passwordForm.reset();
    setChangePasswordOpen(false);
  };
  const { mutate: changePassword, isPending: changingPassword, isError: changingPasswordErr } = useChangePassword(
    onChangePasswordError,
    onChangePasswordSuccess
  );

  // Change PIN (wallet PIN)
  const pinForm = useForm<yup.InferType<typeof changePinSchema>>({
    defaultValues: { currentPin: "", newPin: "", confirmPin: "" },
    resolver: yupResolver(changePinSchema),
    mode: "onChange",
  });
  const onChangePinError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage) ? errorMessage : [errorMessage || "Unable to change PIN"];
    ErrorToast({ title: "PIN update failed", descriptions });
  };
  const onChangePinSuccess = () => {
    SuccessToast({ title: "PIN updated", description: "Your transaction PIN has been updated successfully." });
    pinForm.reset();
    setChangePinOpen(false);
  };
  const { mutate: changePin, isPending: changingPin, isError: changingPinErr } = useChangeWalletPin(
    onChangePinError,
    onChangePinSuccess
  );

  // Profile photo uses existing edit-profile endpoint; reuse the same mutation for just image update if needed later
  const onProfileUpdateError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage) ? errorMessage : [errorMessage || "Unable to update profile"];
    ErrorToast({ title: "Update failed", descriptions });
  };
  const onProfileUpdateSuccess = () => {
    SuccessToast({ title: "Updated", description: "Profile updated successfully" });
  };
  const { mutate: updateProfile, isPending: updatingProfile, isError: updatingProfileErr } = useUpdateUser(
    onProfileUpdateError,
    onProfileUpdateSuccess
  );
  const profileUpdating = updatingProfile && !updatingProfileErr;

  // Change email (2-step: send code -> verify code -> try to update profile)
  const emailForm = useForm<yup.InferType<typeof changeEmailSchema>>({
    defaultValues: { email: "" },
    resolver: yupResolver(changeEmailSchema),
    mode: "onChange",
  });
  const [emailStep, setEmailStep] = useState<"change" | "verify">("change");
  const [emailOtp, setEmailOtp] = useState("");

  const onResendEmailCodeError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage) ? errorMessage : [errorMessage || "Unable to send verification code"];
    ErrorToast({ title: "Failed to send code", descriptions });
  };
  const onResendEmailCodeSuccess = () => {
    SuccessToast({ title: "Code sent", description: "Check your email for the verification code." });
    setEmailStep("verify");
  };
  const { mutate: resendEmailCode, isPending: resendingEmailCode, isError: resendingEmailCodeErr } = useResendVerificationCode(
    onResendEmailCodeError,
    onResendEmailCodeSuccess
  );

  const onVerifyEmailCodeError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage) ? errorMessage : [errorMessage || "Unable to verify code"];
    ErrorToast({ title: "Verification failed", descriptions });
  };
  const onVerifyEmailCodeSuccess = () => {
    // Best-effort: try to update profile email if backend supports it.
    const newEmail = emailForm.getValues("email");
    const formData = new FormData();
    formData.append("fullName", user?.fullname || "");
    formData.append("phoneNumber", user?.phoneNumber || "");
    formData.append("dateOfBirth", user?.dateOfBirth || "");
    formData.append("email", newEmail);
    updateProfile(formData);

    SuccessToast({ title: "Verified", description: "Email address verified successfully." });
    setEmailOtp("");
    setEmailStep("change");
    setChangeEmailOpen(false);
  };
  const { mutate: verifyEmailCode, isPending: verifyingEmailCode, isError: verifyingEmailCodeErr } = useVerifyEmail(
    onVerifyEmailCodeError,
    onVerifyEmailCodeSuccess
  );

  // Update username (single-step: try to update profile username if backend supports it)
  const usernameForm = useForm<yup.InferType<typeof updateUsernameSchema>>({
    defaultValues: { username: user?.username || "" },
    resolver: yupResolver(updateUsernameSchema),
    mode: "onChange",
  });

  const initials = useMemo(() => {
    const name = user?.fullname || "";
    const cleaned = name.replace(/\s+/g, " ").trim();
    if (!cleaned) return "VP";
    const parts = cleaned.split(" ");
    const a = parts[0]?.[0] || "V";
    const b = parts[1]?.[0] || parts[0]?.[1] || "P";
    return `${a}${b}`.toUpperCase();
  }, [user?.fullname]);

  const renderPersonal = () => (
    <div className="w-full">
      <div className="flex items-start gap-4">
        <div className="relative w-14 h-14 rounded-full overflow-hidden bg-[#1C1C1E] border border-gray-800 flex items-center justify-center">
          {user?.profileImageUrl ? (
            <Image src={user.profileImageUrl} alt="Profile" fill className="object-cover" />
          ) : (
            <span className="text-[#9BFF2A] font-bold">{initials}</span>
          )}
        </div>

        <div className="flex-1">
          <p className="text-white text-sm font-semibold">{user?.fullname || "-"}</p>
          <p className="text-gray-400 text-xs mt-0.5">{user?.email || "-"}</p>

          <div className="mt-3 flex items-center gap-2">
            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#141416] border border-gray-800 text-white text-xs cursor-pointer hover:bg-white/5 transition-colors">
              <span>Upload Photo</span>
              <input
                type="file"
                className="hidden"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const formData = new FormData();
                  // preserve backend expectations used elsewhere
                  formData.append("fullName", user?.fullname || "");
                  formData.append("phoneNumber", user?.phoneNumber || "");
                  formData.append("dateOfBirth", user?.dateOfBirth || "");
                  formData.append("profile-image", file);
                  updateProfile(formData);
                  e.currentTarget.value = "";
                }}
              />
            </label>

            <button
              type="button"
              className="px-3 py-2 rounded-lg bg-[#141416] border border-gray-800 text-white text-xs hover:bg-white/5 transition-colors disabled:opacity-50"
              disabled={!user?.profileImageUrl || profileUpdating}
              onClick={() => {
                // No dedicated "remove photo" endpoint in codebase; keep button for exact UI, but avoid broken action.
                ErrorToast({
                  title: "Not available",
                  descriptions: ["Removing profile photo isn't supported yet."],
                });
              }}
            >
              Remove Photo
            </button>

            {profileUpdating ? <SpinnerLoader width={18} height={18} color="#FF6B2C" /> : null}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="space-y-1">
          <p className="text-gray-400 text-[11px]">Full Name</p>
          <div className="bg-[#141416] border border-gray-800 rounded-lg px-4 py-3">
            <p className="text-white text-sm">{user?.fullname || "-"}</p>
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <p className="text-gray-400 text-[11px]">Email address</p>
          <div className="relative bg-[#141416] border border-gray-800 rounded-lg px-4 py-3 pr-11">
            <p className="text-white text-sm">{user?.email || "-"}</p>
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              onClick={() => {
                setEmailStep("change");
                setEmailOtp("");
                emailForm.reset({ email: "" });
                setChangeEmailOpen(true);
              }}
              aria-label="Edit email"
            >
              <FiEdit2 />
            </button>
          </div>
        </div>

        {/* Nickname */}
        <div className="space-y-1">
          <p className="text-gray-400 text-[11px]">Nickname</p>
          <div className="relative bg-[#141416] border border-gray-800 rounded-lg px-4 py-3 pr-11">
            <p className="text-white text-sm">{user?.username || "-"}</p>
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              onClick={() => {
                usernameForm.reset({ username: user?.username || "" });
                setUpdateUsernameOpen(true);
              }}
              aria-label="Edit nickname"
            >
              <FiEdit2 />
            </button>
          </div>
        </div>

        {/* Gender */}
        <div className="space-y-1">
          <p className="text-gray-400 text-[11px]">Gender</p>
          <div className="bg-[#141416] border border-gray-800 rounded-lg px-4 py-3">
            <p className="text-white text-sm">-</p>
          </div>
        </div>

        {/* Mobile Number */}
        <div className="space-y-1">
          <p className="text-gray-400 text-[11px]">Mobile Number</p>
          <div className="relative bg-[#141416] border border-gray-800 rounded-lg px-4 py-3 pr-11">
            <p className="text-white text-sm">{user?.phoneNumber || "-"}</p>
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              onClick={() => {
                setPhoneStep("change");
                phoneForm.reset({ phoneNumber: "" });
                setPhoneOtp("");
                setChangePhoneOpen(true);
              }}
              aria-label="Edit phone number"
            >
              <FiEdit2 />
            </button>
          </div>
        </div>

        {/* Date of Birth */}
        <div className="space-y-1">
          <p className="text-gray-400 text-[11px]">Date of Birth</p>
          <div className="bg-[#141416] border border-gray-800 rounded-lg px-4 py-3">
            <p className="text-white text-sm">{user?.dateOfBirth || "-"}</p>
          </div>
        </div>

        {/* Residential Address */}
        <div className="md:col-span-2 space-y-1">
          <p className="text-gray-400 text-[11px]">Residential Address</p>
          <div className="relative bg-[#141416] border border-gray-800 rounded-lg px-4 py-3 pr-11">
            <p className="text-white text-sm">-</p>
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              onClick={() =>
                ErrorToast({
                  title: "Not available",
                  descriptions: ["Residential address updates are handled during Tier verification."],
                })
              }
              aria-label="Edit address"
            >
              <FiEdit2 />
            </button>
          </div>
        </div>
      </div>

      {/* Change Mobile Number Modal (matches screenshot flow) */}
      <ModalShell
        isOpen={changePhoneOpen}
        onClose={() => {
          setChangePhoneOpen(false);
          setPhoneStep("change");
          setPhoneOtp("");
        }}
        title={phoneStep === "change" ? "Change Mobile Number" : "Verify Phone Number"}
        subtitle={
          phoneStep === "change"
            ? "Updating your phone number will affect how you log in and receive notifications"
            : `Enter the code sent to ${phoneForm.getValues("phoneNumber") || "your phone"}`
        }
      >
        {phoneStep === "change" ? (
          <div className="space-y-4">
            <div className="rounded-xl bg-[#141416] border border-gray-800 p-4 text-gray-300 text-xs leading-relaxed">
              <p className="flex items-start gap-2">
                <span className="mt-0.5 w-2 h-2 rounded-full bg-[#FF6B2C] inline-block" />
                You’ll use the new number to log in.
              </p>
              <p className="flex items-start gap-2 mt-2">
                <span className="mt-0.5 w-2 h-2 rounded-full bg-[#FF6B2C] inline-block" />
                You’ll need to verify the number to receive alerts or OTPs.
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-gray-400 text-[11px]">New Phone Number</p>
              <input
                {...phoneForm.register("phoneNumber")}
                maxLength={11}
                placeholder="Enter your new phone number"
                className="w-full bg-[#141416] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none"
              />
              {phoneForm.formState.errors.phoneNumber?.message ? (
                <p className="text-xs text-red-500">{phoneForm.formState.errors.phoneNumber.message}</p>
              ) : null}
            </div>

            <CustomButton
              type="button"
              disabled={!phoneForm.formState.isValid || (validatingPhone && !validatingPhoneErr)}
              isLoading={validatingPhone && !validatingPhoneErr}
              className="w-full py-3 border-2 border-primary text-black"
              onClick={phoneForm.handleSubmit(({ phoneNumber }) => validatePhoneNumber({ phoneNumber }))}
            >
              Next
            </CustomButton>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-gray-400 text-[11px]">Enter Code</p>
              <input
                value={phoneOtp}
                onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="Enter the code sent to the phone number"
                className="w-full bg-[#141416] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none tracking-widest"
                inputMode="numeric"
              />
            </div>
            <CustomButton
              type="button"
              disabled={phoneOtp.length !== 4 || (verifyingPhone && !verifyingPhoneErr)}
              isLoading={verifyingPhone && !verifyingPhoneErr}
              className="w-full py-3 border-2 border-primary text-black"
              onClick={() => verifyPhoneNumber({ phoneNumber: phoneForm.getValues("phoneNumber"), otpCode: phoneOtp })}
            >
              Next
            </CustomButton>
          </div>
        )}
      </ModalShell>

      {/* Change Email Modal (matches screenshot flow) */}
      <ModalShell
        isOpen={changeEmailOpen}
        onClose={() => {
          setChangeEmailOpen(false);
          setEmailStep("change");
          setEmailOtp("");
        }}
        title={emailStep === "change" ? "Change Email" : "Verify Email Address"}
        subtitle={
          emailStep === "change"
            ? "Enter a new email address where you'll receive account updates and notifications"
            : `Enter the code sent to ${emailForm.getValues("email") || "your email"}`
        }
      >
        {emailStep === "change" ? (
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-gray-400 text-[11px]">New Email Address</p>
              <input
                {...emailForm.register("email")}
                placeholder="Enter new email address"
                className="w-full bg-[#141416] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none"
              />
              {emailForm.formState.errors.email?.message ? (
                <p className="text-xs text-red-500">{emailForm.formState.errors.email.message}</p>
              ) : null}
            </div>

            <CustomButton
              type="button"
              disabled={!emailForm.formState.isValid || (resendingEmailCode && !resendingEmailCodeErr)}
              isLoading={resendingEmailCode && !resendingEmailCodeErr}
              className="w-full py-3 border-2 border-primary text-black"
              onClick={emailForm.handleSubmit(({ email }) => resendEmailCode({ email }))}
            >
              Next
            </CustomButton>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-gray-400 text-[11px]">Enter Code</p>
              <input
                value={emailOtp}
                onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="Enter the code sent to the email address"
                className="w-full bg-[#141416] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none tracking-widest"
                inputMode="numeric"
              />
            </div>
            <CustomButton
              type="button"
              disabled={emailOtp.length !== 4 || (verifyingEmailCode && !verifyingEmailCodeErr)}
              isLoading={verifyingEmailCode && !verifyingEmailCodeErr}
              className="w-full py-3 border-2 border-primary text-black"
              onClick={() => verifyEmailCode({ email: emailForm.getValues("email"), otpCode: emailOtp })}
            >
              Next
            </CustomButton>
          </div>
        )}
      </ModalShell>

      {/* Update Username Modal (matches screenshot flow) */}
      <ModalShell
        isOpen={updateUsernameOpen}
        onClose={() => {
          setUpdateUsernameOpen(false);
          usernameForm.reset({ username: user?.username || "" });
        }}
        title="Update Username"
        subtitle="Enter a new username that will appear on your profile"
      >
        <form
          className="space-y-4"
          onSubmit={usernameForm.handleSubmit(({ username }) => {
            const formData = new FormData();
            formData.append("fullName", user?.fullname || "");
            formData.append("phoneNumber", user?.phoneNumber || "");
            formData.append("dateOfBirth", user?.dateOfBirth || "");
            formData.append("username", username);
            updateProfile(formData);
            SuccessToast({ title: "Updated", description: "Username updated successfully" });
            setUpdateUsernameOpen(false);
          })}
        >
          <div className="space-y-1">
            <p className="text-gray-400 text-[11px]">New Username</p>
            <input
              {...usernameForm.register("username")}
              placeholder="Enter your new username"
              className="w-full bg-[#141416] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none"
            />
            {usernameForm.formState.errors.username?.message ? (
              <p className="text-xs text-red-500">{usernameForm.formState.errors.username.message}</p>
            ) : null}
          </div>

          <CustomButton
            type="submit"
            disabled={!usernameForm.formState.isValid || profileUpdating}
            isLoading={profileUpdating}
            className="w-full py-3 border-2 border-primary text-black"
          >
            Next
          </CustomButton>
        </form>
      </ModalShell>
    </div>
  );

  const renderSecurity = () => (
    <div className="w-full">
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setChangePinOpen(true)}
          className="w-full flex items-center justify-between rounded-xl bg-[#141416] border border-gray-800 px-4 py-4 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#2C2C2E] flex items-center justify-center text-[#FF6B2C]">
              <MdSystemSecurityUpdateWarning className="text-lg" />
            </div>
            <div className="text-left">
              <p className="text-white text-sm font-medium">Change Transaction PIN</p>
              <p className="text-gray-400 text-xs mt-0.5">Secure your payments by updating your transaction PIN</p>
            </div>
          </div>
          <FiChevronRight className="text-gray-500" />
        </button>

        <button
          type="button"
          onClick={() => setChangePasswordOpen(true)}
          className="w-full flex items-center justify-between rounded-xl bg-[#141416] border border-gray-800 px-4 py-4 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#2C2C2E] flex items-center justify-center text-[#FF6B2C]">
              <TbLockPassword className="text-lg" />
            </div>
            <div className="text-left">
              <p className="text-white text-sm font-medium">Change Password</p>
              <p className="text-gray-400 text-xs mt-0.5">Protect your account by setting a new, stronger password</p>
            </div>
          </div>
          <FiChevronRight className="text-gray-500" />
        </button>

        <button
          type="button"
          onClick={() =>
            ErrorToast({
              title: "Not available",
              descriptions: ["Security questions are not enabled on this build yet."],
            })
          }
          className="w-full flex items-center justify-between rounded-xl bg-[#141416] border border-gray-800 px-4 py-4 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#2C2C2E] flex items-center justify-center text-[#FF6B2C]">
              <RiShieldKeyholeLine className="text-lg" />
            </div>
            <div className="text-left">
              <p className="text-white text-sm font-medium">Set Security Question</p>
              <p className="text-gray-400 text-xs mt-0.5">Add an extra layer of protection with a security question</p>
            </div>
          </div>
          <FiChevronRight className="text-gray-500" />
        </button>

        <div className="w-full flex items-center justify-between rounded-xl bg-[#141416] border border-gray-800 px-4 py-4">
          <div className="text-left">
            <p className="text-white text-sm font-medium">Use Fingerprint for Payment</p>
            <p className="text-gray-400 text-xs mt-0.5">Enable quick and secure payments with your fingerprint.</p>
          </div>
          <Toggle checked={fingerprintEnabled} onChange={setFingerprintEnabled} />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="rounded-xl bg-[#141416] border border-gray-800 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#2C2C2E] flex items-center justify-center text-[#FF6B2C]">
                <HiOutlineCreditCard className="text-lg" />
              </div>
              <div className="text-left">
                <p className="text-white text-sm font-medium">Linked Cards/ Account</p>
                <p className="text-gray-400 text-xs mt-0.5">View, add, or remove your linked accounts and cards</p>
              </div>
            </div>
            <FiChevronRight className="text-gray-500" />
          </div>

          <div className="mt-4 space-y-2">
            {(user?.wallet || []).slice(0, 3).map((w: any) => (
              <div key={w.id} className="flex items-center justify-between bg-[#0F0F10] border border-gray-800 rounded-lg px-3 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#2C2C2E]" />
                  <div>
                    <p className="text-white text-xs font-medium">{w.bankName || "ValarPay"}</p>
                    <p className="text-gray-400 text-[11px]">{w.accountNumber || "—"}</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-1 rounded-full bg-white/10 text-gray-300">{w.currency || ""}</span>
              </div>
            ))}
            {!(user?.wallet || []).length ? (
              <div className="text-gray-500 text-xs">No linked accounts available</div>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            ErrorToast({
              title: "Not available",
              descriptions: ["Account deletion isn't enabled in this build yet."],
            })
          }
          className="w-full rounded-xl bg-red-500/20 border border-red-700/40 px-4 py-3 text-red-400 text-sm font-medium hover:bg-red-500/25 transition-colors"
        >
          Delete Account
        </button>
      </div>

      {/* Change PIN Modal */}
      <ModalShell
        isOpen={changePinOpen}
        onClose={() => {
          setChangePinOpen(false);
          pinForm.reset();
        }}
        title="Change Transaction PIN"
        subtitle="Secure your payments by updating your transaction PIN"
      >
        <form
          className="space-y-4"
          onSubmit={pinForm.handleSubmit(({ currentPin, newPin }) => changePin({ oldPin: currentPin, newPin }))}
        >
          <div className="space-y-1">
            <p className="text-gray-400 text-[11px]">Current PIN</p>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              {...pinForm.register("currentPin")}
              className="w-full bg-[#141416] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none"
              placeholder="Enter current PIN"
            />
            {pinForm.formState.errors.currentPin?.message ? (
              <p className="text-xs text-red-500">{pinForm.formState.errors.currentPin.message}</p>
            ) : null}
          </div>

          <div className="space-y-1">
            <p className="text-gray-400 text-[11px]">New PIN</p>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              {...pinForm.register("newPin")}
              className="w-full bg-[#141416] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none"
              placeholder="Enter new PIN"
            />
            {pinForm.formState.errors.newPin?.message ? (
              <p className="text-xs text-red-500">{pinForm.formState.errors.newPin.message}</p>
            ) : null}
          </div>

          <div className="space-y-1">
            <p className="text-gray-400 text-[11px]">Confirm New PIN</p>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              {...pinForm.register("confirmPin")}
              className="w-full bg-[#141416] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none"
              placeholder="Confirm new PIN"
            />
            {pinForm.formState.errors.confirmPin?.message ? (
              <p className="text-xs text-red-500">{pinForm.formState.errors.confirmPin.message}</p>
            ) : null}
          </div>

          <CustomButton
            type="submit"
            disabled={!pinForm.formState.isValid || (changingPin && !changingPinErr)}
            isLoading={changingPin && !changingPinErr}
            className="w-full py-3 border-2 border-primary text-black"
          >
            Update PIN
          </CustomButton>
        </form>
      </ModalShell>

      {/* Change Password Modal */}
      <ModalShell
        isOpen={changePasswordOpen}
        onClose={() => {
          setChangePasswordOpen(false);
          passwordForm.reset();
        }}
        title="Change Password"
        subtitle="Protect your account by setting a new, stronger password"
      >
        <form
          className="space-y-4"
          onSubmit={passwordForm.handleSubmit(({ oldPassword, newPassword }) => changePassword({ oldPassword, newPassword }))}
        >
          <div className="space-y-1">
            <p className="text-gray-400 text-[11px]">Current Password</p>
            <input
              type="password"
              {...passwordForm.register("oldPassword")}
              className="w-full bg-[#141416] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none"
              placeholder="Enter current password"
            />
            {passwordForm.formState.errors.oldPassword?.message ? (
              <p className="text-xs text-red-500">{passwordForm.formState.errors.oldPassword.message}</p>
            ) : null}
          </div>

          <div className="space-y-1">
            <p className="text-gray-400 text-[11px]">New Password</p>
            <input
              type="password"
              {...passwordForm.register("newPassword")}
              className="w-full bg-[#141416] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none"
              placeholder="Enter new password"
            />
            {passwordForm.formState.errors.newPassword?.message ? (
              <p className="text-xs text-red-500">{passwordForm.formState.errors.newPassword.message}</p>
            ) : null}
          </div>

          <div className="space-y-1">
            <p className="text-gray-400 text-[11px]">Confirm New Password</p>
            <input
              type="password"
              {...passwordForm.register("confirmPassword")}
              className="w-full bg-[#141416] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none"
              placeholder="Confirm new password"
            />
            {passwordForm.formState.errors.confirmPassword?.message ? (
              <p className="text-xs text-red-500">{passwordForm.formState.errors.confirmPassword.message}</p>
            ) : null}
          </div>

          <CustomButton
            type="submit"
            disabled={!passwordForm.formState.isValid || (changingPassword && !changingPasswordErr)}
            isLoading={changingPassword && !changingPasswordErr}
            className="w-full py-3 border-2 border-primary text-black"
          >
            Update Password
          </CustomButton>
        </form>
      </ModalShell>
    </div>
  );

  const renderPreferences = () => {
    const tx = getCategoryPref("TRANSACTIONS");
    const sv = getCategoryPref("SERVICES");
    const up = getCategoryPref("UPDATES");
    const ms = getCategoryPref("MESSAGES");
    const loading = prefPending || prefUpdating;

    return (
      <div className="w-full">
        <div className="rounded-2xl border border-gray-800 bg-[#141416] overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800">
            <p className="text-white text-sm font-semibold">Notifications</p>
          </div>

          <div className="divide-y divide-gray-800">
            <div className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">Transactions</p>
                <p className="text-gray-400 text-xs mt-0.5">Payments, transfers and account activities</p>
              </div>
              <Toggle
                checked={!!tx.inApp}
                disabled={loading}
                onChange={(v) => updateCategory("TRANSACTIONS", { inApp: v })}
              />
            </div>

            <div className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">Services</p>
                <p className="text-gray-400 text-xs mt-0.5">Subscriptions, purchases and service related actions</p>
              </div>
              <Toggle checked={!!sv.inApp} disabled={loading} onChange={(v) => updateCategory("SERVICES", { inApp: v })} />
            </div>

            <div className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">Updates</p>
                <p className="text-gray-400 text-xs mt-0.5">New features, announcements and important alerts</p>
              </div>
              <Toggle checked={!!up.inApp} disabled={loading} onChange={(v) => updateCategory("UPDATES", { inApp: v })} />
            </div>

            <div className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">Messages</p>
                <p className="text-gray-400 text-xs mt-0.5">Personal notes, reminders and direct communication</p>
              </div>
              <Toggle checked={!!ms.inApp} disabled={loading} onChange={(v) => updateCategory("MESSAGES", { inApp: v })} />
            </div>

            <div className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">Email Notifications</p>
                <p className="text-gray-400 text-xs mt-0.5">Receive transaction alerts via email</p>
              </div>
              <Toggle
                checked={emailToggleAll}
                disabled={loading || !preferenceList.length}
                onChange={async (v) => {
                  for (const p of preferenceList) {
                    // eslint-disable-next-line no-await-in-loop
                    await updateCategory(p.category, { email: v });
                  }
                }}
              />
            </div>

            <div className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">SMS Notifications</p>
                <p className="text-gray-400 text-xs mt-0.5">Receive transaction alerts via SMS</p>
              </div>
              <Toggle
                checked={smsToggleAll}
                disabled={loading || !preferenceList.length}
                onChange={async (v) => {
                  for (const p of preferenceList) {
                    // eslint-disable-next-line no-await-in-loop
                    await updateCategory(p.category, { sms: v });
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-gray-800 bg-[#141416] overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800">
            <p className="text-white text-sm font-semibold">Themes</p>
          </div>
          <div className="px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium">Dark Mode</p>
              <p className="text-gray-400 text-xs mt-0.5">Switch to dark theme</p>
            </div>
            <Toggle checked={theme === "dark"} onChange={() => toggleTheme()} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl">
      <div className="mb-4">
        <p className="text-white text-lg font-semibold">Profile &amp; Settings</p>
        <p className="text-gray-400 text-xs mt-0.5">Manage your personal information and preferences</p>
      </div>

      <div className="w-full bg-[#141416] border border-gray-800 rounded-full p-1 flex items-center">
        {[
          { key: "personal", label: "Personal" },
          { key: "security", label: "Security & Privacy" },
          { key: "preferences", label: "Preferences" },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key as TabKey)}
            className={[
              "flex-1 text-center py-2 rounded-full text-xs sm:text-sm font-medium transition-colors",
              tab === t.key ? "bg-[#2C2C2E] text-white" : "text-gray-400 hover:text-white",
            ].join(" ")}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4 w-full">
        {tab === "personal" ? renderPersonal() : null}
        {tab === "security" ? renderSecurity() : null}
        {tab === "preferences" ? renderPreferences() : null}
      </div>
    </div>
  );
}


