"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CustomButton from "@/components/shared/Button";
import useUserStore from "@/store/user.store";
import {
  handleNumericKeyDown,
  handleNumericPaste,
} from "@/utils/utilityFunctions";
import DatePicker from "react-datepicker";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { ChangeEvent, useEffect, useRef } from "react";
import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { BsCamera } from "react-icons/bs";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import { useUpdateUser } from "@/api/user/user.queries";
import { CURRENCY } from "@/constants/types";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Email format is not valid")
    .required("Email is required"),
  username: yup.string().required("Username is required"),
  fullname: yup.string().required("Full Name is required"),
  phoneNumber: yup.string().required(),
  dateOfBirth: yup.string().required("Date of birth is required"),
  referralCode: yup.string().required(),
  accountTier: yup.string().required(),
  accountNumber: yup.string().required(),
});

type UserFormData = yup.InferType<typeof schema>;

const ProfileContent = () => {
  const { user } = useUserStore();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imgUrl, setImgUrl] = useState(user?.profileImageUrl || "");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useOnClickOutside(datePickerRef as React.RefObject<HTMLElement>, () =>
    setShowDatePicker(false)
  );
  const accountNumber = user?.wallet?.find(
    (w) => w.currency === CURRENCY.NGN
  )?.accountNumber;
  const form = useForm<UserFormData>({
    defaultValues: {
      email: user?.email,
      username: user?.username,
      fullname: user?.fullname,
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

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const newDate = new Date(date);
      const day = newDate.getDate();
      const month = newDate.toLocaleString("en-US", { month: "short" });
      const year = newDate.getFullYear();
      setValue("dateOfBirth", `${day}-${month}-${year}`);
      setShowDatePicker(false);
    }
  };
  useEffect(() => {
    if (user?.profileImageUrl) {
      setImgUrl(user.profileImageUrl);
    }
  }, [user]);

  const onError = async (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage)
      ? errorMessage
      : [errorMessage];

    ErrorToast({
      title: "Error updating profile",
      descriptions,
    });
  };

  const onSuccess = () => {
    SuccessToast({
      title: "Update successful!",
      description: "Profile updated successfully",
    });
  };

  const {
    mutate: update,
    isPending: updatePending,
    isError: updateError,
  } = useUpdateUser(onError, onSuccess);

  const updateLoading = updatePending && !updateError;

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      const extension = file.name.split(".").pop()?.toLowerCase();

      if (
        extension &&
        (extension === "jpg" ||
          extension === "jpeg" ||
          extension === "png" ||
          extension === "webp")
      ) {
        const fileSize = file.size / 1024; // Convert to KB
        const maxSizeKB = 500; // Maximum size in KB

        if (fileSize <= maxSizeKB) {
          const imageUrl = URL.createObjectURL(file);
          setImgUrl(imageUrl);
          setSelectedFile(file); // Store the file for form submission
        } else {
          console.error("Selected file size exceeds the limit (500KB).");
          toast.error("Selected file size exceeds the limit (500KB).", {
            duration: 3000,
          });
        }
      } else {
        console.error(
          "Selected file is not a supported image format (JPEG, JPG, PNG, or WebP)."
        );
        toast.error(
          "Selected file is not a supported image format (JPEG, JPG, PNG, or WebP).",
          {
            duration: 3000,
          }
        );
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: UserFormData) => {
    const formData = new FormData();

    // Add only the required fields from IUpdateUser
    formData.append("fullName", data.fullname);
    formData.append("phoneNumber", data.phoneNumber || "");
    formData.append("dateOfBirth", data.dateOfBirth);

    // Add the profile image if one was selected
    if (selectedFile) {
      formData.append("profile-image", selectedFile);
    }

    // Call the update mutation with the FormData
    update(formData);
  };

  return (
    <div className="w-full h-full bg-white  dark:bg-bg-1100 py-4 md:py-8 px-1 2xs:px-5 lg:px-8 flex justify-center  rounded-xl sm:rounded-2xl">
      <div className="flex flex-col gap-6 xs:gap-10  w-full xl:w-[80%] 2xl:w-[70%] bg-transparent lg:bg-bg-400 dark:bg-transparent lg:dark:bg-black rounded-lg sm:rounded-xl p-0 2xs:p-4 md:p-8">
        <div className="flex self-center relative w-24 xs:w-28 xl:w-32 h-24 xs:h-28 xl:h-32 rounded-full bg-dark-primary 2xs:bg-bg-400 lg:bg-dark-primary dark:bg-bg-1100 2xs:dark:bg-black lg:dark:bg-bg-1100">
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt="profile"
              fill
              objectFit="cover"
              className="w-full h-full rounded-full"
            />
          ) : (
            <div className="uppercase w-full flex justify-center items-center text-text-200 dark:text-text-400 text-4xl sm:text-5xl">
              {" "}
              {user?.fullname.slice(0, 2)}
            </div>
          )}

          <div
            onClick={handleFileUpload}
            className="cursor-pointer absolute bottom-0 right-0 p-2 xs:p-2.5 rounded-full bg-secondary text-white text-lg xs:text-xl"
          >
            <BsCamera />
          </div>

          <input
            type="file"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileSelected}
          />
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-10 md:gap-12"
        >
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
              <label
                className="w-full text-sm font-medium  text-text-200 dark:text-text-800 mb-0 flex items-start "
                htmlFor={"fullname"}
              >
                Full Name{" "}
              </label>
              <div className="w-full flex gap-2 justify-center items-center bg-white dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                <input
                  className="disabled:opacity-60 w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-200 dark:placeholder:text-text-1000 placeholder:text-sm"
                  placeholder="Full name"
                  type="text"
                  {...register("fullname")}
                />
              </div>

              {errors?.fullname?.message ? (
                <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                  {errors?.fullname?.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
              <label
                className="w-full text-sm font-medium  text-text-200 dark:text-text-800 mb-0 flex items-start "
                htmlFor={"username"}
              >
                Username{" "}
              </label>
              <div className="w-full flex gap-2 justify-center items-center bg-white dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                <input
                  className="disabled:opacity-60 w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-200 dark:placeholder:text-text-1000 placeholder:text-sm"
                  placeholder="Username"
                  disabled
                  type="text"
                  {...register("username")}
                />
              </div>

              {errors?.username?.message ? (
                <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                  {errors?.username?.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
              <label
                className="w-full text-sm font-medium  text-text-200 dark:text-text-800 mb-0 flex items-start "
                htmlFor={"email"}
              >
                Email{" "}
              </label>
              <div className="w-full flex gap-2 justify-center items-center bg-white dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                <input
                  className="disabled:opacity-60 w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-200 dark:placeholder:text-text-1000 placeholder:text-sm"
                  placeholder="Email"
                  disabled
                  type="email"
                  {...register("email")}
                />
              </div>

              {errors?.email?.message ? (
                <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                  {errors?.email?.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
              <label
                className="w-full text-sm font-medium  text-text-200 dark:text-text-800 mb-0 flex items-start "
                htmlFor={"phoneNumber"}
              >
                Phone Number{" "}
              </label>
              <div className="w-full flex gap-2 justify-center items-center bg-white dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                <input
                  className="disabled:opacity-60 w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-200 dark:placeholder:text-text-1000 placeholder:text-sm"
                  placeholder="Phone Number"
                  type="text"
                  {...register("phoneNumber")}
                  onKeyDown={handleNumericKeyDown}
                  onPaste={handleNumericPaste}
                />
              </div>

              {errors?.phoneNumber?.message ? (
                <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                  {errors?.phoneNumber?.message}
                </p>
              ) : null}
            </div>

            <div className="w-full relative">
              <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
                <label
                  className="w-full text-sm font-medium  text-text-200 dark:text-text-800 mb-0 flex items-start "
                  htmlFor={"dateOfBirth"}
                >
                  Date of Birth
                </label>
                <div
                  onClick={() => {}}
                  className="cursor-pointer w-full flex gap-2 justify-center items-center bg-bg-2000 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3"
                >
                  {watchedDateOfBirth ? (
                    <div className="w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-700 dark:placeholder:text-text-1000 placeholder:text-sm">
                      {watchedDateOfBirth}
                    </div>
                  ) : (
                    <div className="w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-700 dark:placeholder:text-text-1000 placeholder:text-sm">
                      Select Date of Birth
                    </div>
                  )}
                </div>

                {errors.dateOfBirth?.message ? (
                  <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                    {errors.dateOfBirth?.message}
                  </p>
                ) : null}
              </div>

              {showDatePicker && (
                <div ref={datePickerRef} className="absolute z-10 mt-1">
                  <DatePicker
                    selected={
                      watchedDateOfBirth ? new Date(watchedDateOfBirth) : null
                    }
                    onChange={handleDateChange}
                    inline
                    calendarClassName="custom-calendar"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
              <label
                className="w-full text-sm font-medium  text-text-200 dark:text-text-800 mb-0 flex items-start "
                htmlFor={"referralCode"}
              >
                Referral Code{" "}
              </label>
              <div className="w-full flex gap-2 justify-center items-center bg-white dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                <input
                  className="disabled:opacity-60 w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-200 dark:placeholder:text-text-1000 placeholder:text-sm"
                  placeholder="Referral Code"
                  disabled
                  type="text"
                  {...register("referralCode")}
                />
              </div>

              {errors?.referralCode?.message ? (
                <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                  {errors?.referralCode?.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
              <label
                className="w-full text-sm font-medium  text-text-200 dark:text-text-800 mb-0 flex items-start "
                htmlFor={"accountTier"}
              >
                Account Type{" "}
              </label>
              <div className="w-full flex gap-2 justify-center items-center bg-white dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                <input
                  className="disabled:opacity-60 w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-200 dark:placeholder:text-text-1000 placeholder:text-sm"
                  placeholder="Account type"
                  disabled
                  type="text"
                  {...register("accountTier")}
                />
              </div>

              {errors?.accountTier?.message ? (
                <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                  {errors?.accountTier?.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
              <label
                className="w-full text-sm font-medium  text-text-200 dark:text-text-800 mb-0 flex items-start "
                htmlFor={"accountNumber"}
              >
                Account Number{" "}
              </label>
              <div className="w-full flex gap-2 justify-center items-center bg-white dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                <input
                  className="disabled:opacity-60 w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-200 dark:placeholder:text-text-1000 placeholder:text-sm"
                  placeholder="Account number"
                  disabled
                  type="text"
                  {...register("accountNumber")}
                />
              </div>

              {errors?.accountNumber?.message ? (
                <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                  {errors?.accountNumber?.message}
                </p>
              ) : null}
            </div>
          </div>
          <div className="w-full flex">
            {" "}
            <CustomButton
              type="submit"
              disabled={!isValid || updateLoading}
              isLoading={updateLoading}
              className="w-full  border-2 dark:text-black dark:font-bold border-primary text-white text-base 2xs:text-lg max-2xs:px-6 py-3"
            >
              Save{" "}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileContent;
