/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import SuccessToast from "@/components/toast/SuccessToast";
import ErrorToast from "@/components/toast/ErrorToast";
import useNavigate from "@/hooks/useNavigate";
import { useChangePassword } from "@/api/user/user.queries";
import CustomButton from "@/components/shared/Button";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { useState } from "react";
import { AiOutlineEye } from "react-icons/ai";

const changePasswordSchema = yup.object().shape({
  oldPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  newPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords do not match")
    .required("Confirm password is required"),
});

const ChangePasswordContent = () => {
  const navigate = useNavigate();

  const [openOld, setOpenOld] = useState(false);
  const [openNew, setOpenNew] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const form = useForm<yup.InferType<typeof changePasswordSchema>>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    resolver: yupResolver(changePasswordSchema),
    mode: "onChange",
  });

  const { register, handleSubmit, formState, reset } = form;
  const { errors, isValid } = formState;

  const onUpdatePasswordSuccess = () => {
    SuccessToast({
      title: "Password Updated",
      description: "Your password has been updated successfully",
    });
    reset();
    navigate("/user/settings", "replace");
  };

  const onUpdatePasswordError = (error: any) => {
    const errorMessage = error.response.data.message;
    const descriptions = Array.isArray(errorMessage)
      ? errorMessage
      : [errorMessage];

    ErrorToast({
      title: "Password updated failed",
      descriptions,
    });
  };

  const {
    mutate: updatePassword,
    isPending: updatePasswordPending,
    isError: updatePasswordError,
  } = useChangePassword(onUpdatePasswordError, onUpdatePasswordSuccess);

  const updateLoading = updatePasswordPending && !updatePasswordError;

  const onSubmit = async (data: yup.InferType<typeof changePasswordSchema>) => {
    updatePassword({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });
  };

  return (
    <div className="w-full h-full 2xs:bg-bg-600 2xs:dark:bg-bg-1100 py-4 md:py-8 px-1 2xs:px-5 lg:px-8 flex justify-center  rounded-xl sm:rounded-2xl">
      <div className="flex flex-col gap-6 xs:gap-10  w-full xl:w-[80%] 2xl:w-[70%] bg-transparent lg:bg-bg-400 dark:bg-transparent lg:dark:bg-black rounded-lg sm:rounded-xl p-0 2xs:p-4 md:p-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-10 md:gap-12"
        >
          <div className="w-full grid grid-cols-1 gap-4 md:gap-6">
            <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
              <label
                className="w-full text-sm font-medium  text-text-200 dark:text-text-800 mb-0 flex items-start "
                htmlFor={"fullname"}
              >
                Old Password{" "}
              </label>
              <div className="w-full flex gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                <input
                  className="disabled:opacity-60 w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-200 dark:placeholder:text-text-1000 placeholder:text-sm"
                  placeholder="Enter Old Password"
                  type={openOld ? "text" : "password"}
                  {...register("oldPassword")}
                />

                <button
                  type="button"
                  onClick={() => setOpenOld(!openOld)}
                  className="pl-2.5 "
                >
                  {openOld ? (
                    <AiOutlineEye cursor="pointer" />
                  ) : (
                    <AiOutlineEyeInvisible cursor="pointer" />
                  )}
                </button>
              </div>

              {errors?.oldPassword?.message ? (
                <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                  {errors?.oldPassword?.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
              <label
                className="w-full text-sm font-medium  text-text-200 dark:text-text-800 mb-0 flex items-start "
                htmlFor={"newPassword"}
              >
                New Password{" "}
              </label>
              <div className="w-full flex gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                <input
                  className="disabled:opacity-60 w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-200 dark:placeholder:text-text-1000 placeholder:text-sm"
                  placeholder="Enter New Password"
                  type={openNew ? "text" : "password"}
                  {...register("newPassword")}
                />

                <button
                  type="button"
                  onClick={() => setOpenNew(!openNew)}
                  className="pl-2.5 "
                >
                  {openNew ? (
                    <AiOutlineEye cursor="pointer" />
                  ) : (
                    <AiOutlineEyeInvisible cursor="pointer" />
                  )}
                </button>
              </div>

              {errors?.newPassword?.message ? (
                <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                  {errors?.newPassword?.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
              <label
                className="w-full text-sm font-medium  text-text-200 dark:text-text-800 mb-0 flex items-start "
                htmlFor={"email"}
              >
                Confirm Password{" "}
              </label>
              <div className="w-full flex gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                <input
                  className="disabled:opacity-60 w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-200 dark:placeholder:text-text-1000 placeholder:text-sm"
                  placeholder="Enter Confirm Password"
                  type={openConfirm ? "text" : "password"}
                  {...register("confirmPassword")}
                />

                <button
                  type="button"
                  onClick={() => setOpenConfirm(!openConfirm)}
                  className="pl-2.5 "
                >
                  {openConfirm ? (
                    <AiOutlineEye cursor="pointer" />
                  ) : (
                    <AiOutlineEyeInvisible cursor="pointer" />
                  )}
                </button>
              </div>

              {errors?.confirmPassword?.message ? (
                <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                  {errors?.confirmPassword?.message}
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
              Continue{" "}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordContent;
