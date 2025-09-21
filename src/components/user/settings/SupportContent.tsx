/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import { useReportScam } from "@/api/user/user.queries";
import CustomButton from "@/components/shared/Button";
import { FaPaperclip } from "react-icons/fa6";
import { useState } from "react";
import toast from "react-hot-toast";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
});

type FormData = yup.InferType<typeof schema>;

const SupportContent = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const form = useForm<FormData>({
    defaultValues: {
      title: "",
      description: "",
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const { register, handleSubmit, formState, reset } = form;
  const { errors, isValid } = formState;

  const onSuccess = () => {
    SuccessToast({
      title: "Message sent",
      description: "Your message has been successfully sent.",
    });
    reset();
    setFile(null);
  };

  const onError = (error: any) => {
    const errorMessage =
      (error as { response?: { data?: { message?: string | string[] } } })
        ?.response?.data?.message ?? "Something went wrong";

    ErrorToast({
      title: "Error sending message",
      descriptions: Array.isArray(errorMessage) ? errorMessage : [errorMessage],
    });
  };

  const {
    mutate: sendMessage,
    isPending: sendingPending,
    isError: sendingError,
  } = useReportScam(onError, onSuccess);

  const onSubmit = async (data: yup.InferType<typeof schema>) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);

    if (file) {
      formData.append("screenshot", file);
      sendMessage(formData);
    } else {
      toast.error("Add attachment", {
        duration: 3000,
      });
    }
  };

  return (
    <div className="w-full h-full 2xs:bg-bg-600 2xs:dark:bg-bg-1100 py-4 md:py-8 px-1 2xs:px-5 lg:px-8 flex justify-center rounded-xl sm:rounded-2xl">
      <div className="flex flex-col gap-6 xs:gap-10 w-full xl:w-[80%] 2xl:w-[70%] bg-transparent lg:bg-bg-400 dark:bg-transparent lg:dark:bg-black rounded-lg sm:rounded-xl p-0 2xs:p-4 md:p-8">
        <h2 className="text-xl xs:text-2xl text-text-200 dark:text-text-400">
          Report Scam
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-10 md:gap-12"
        >
          <div className="w-full grid grid-cols-1 gap-4 md:gap-6">
            {/* Title Input */}
            <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
              <label
                className="w-full text-sm font-medium text-text-200 dark:text-text-800 mb-0 flex items-start"
                htmlFor="title"
              >
                Title
              </label>
              <div className="w-full flex gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                <input
                  id="title"
                  className="disabled:opacity-60 w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-200 dark:placeholder:text-text-1000 placeholder:text-sm"
                  placeholder="Enter Title"
                  type="text"
                  {...register("title")}
                />
              </div>
              {errors.title && (
                <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description Input */}
            <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
              <label
                className="w-full text-sm font-medium text-text-200 dark:text-text-800 mb-0 flex items-start"
                htmlFor="description"
              >
                Description
              </label>
              <div className="w-full flex gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                <textarea
                  id="description"
                  className="resize-y disabled:opacity-60 w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-200 dark:placeholder:text-text-1000 placeholder:text-sm"
                  placeholder="Enter Description"
                  {...register("description")}
                />
              </div>
              {errors.description && (
                <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* File Upload */}
            <div className="p-4 border border-border-600 bg-bg-600 dark:bg-bg-1100 rounded-lg">
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex items-center text-primary"
              >
                <FaPaperclip className="mr-2" />
                <span>{file ? "Replace Attachment" : "Add Attachment"}</span>
              </label>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              {file && (
                <div className="mt-4 flex items-center justify-between p-2  bg-bg-400 dark:bg-black rounded-md">
                  <span className="text-sm text-text-200 dark:text-text-400">
                    {file.name.length > 20
                      ? file.name.slice(0, 10) + "..." + file.name.slice(-7)
                      : file.name}
                  </span>{" "}
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="w-full flex">
            <CustomButton
              type="submit"
              disabled={!isValid || (sendingPending && !sendingError)}
              isLoading={sendingPending}
              className="w-full border-2 dark:text-black dark:font-bold border-primary text-white text-base 2xs:text-lg max-2xs:px-6 py-3"
            >
              Report
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupportContent;
