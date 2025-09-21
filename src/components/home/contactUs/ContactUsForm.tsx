/* eslint-disable @typescript-eslint/no-explicit-any */

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  handleNumericKeyDown,
  handleNumericPaste,
} from "@/utils/utilityFunctions";
import { motion } from "framer-motion";
import CustomButton from "@/components/shared/Button";
import { zoomIn } from "@/utils/motion";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import { useContactUs } from "@/api/contact-us/contact-us.queries";
import { FiUpload } from "react-icons/fi";

const contactSchema = yup.object().shape({
  fullname: yup.string().required("Full Name is required"),
  phone: yup.string().optional(),
  email: yup.string().email("Invalid email").required("Email is required"),
  title: yup.string().required("Title is your required"),
  message: yup.string().required("Message is required"),
  file: yup.mixed().optional(),
});

interface ContactFormData {
  fullname: string;
  phone?: string;
  email: string;
  title: string;
  message: string;
  file?: FileList;
}

const ContactUsForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ContactFormData>({
    defaultValues: {
      fullname: "",
      phone: "",
      email: "",
      title: "",
      message: "",
    },
    resolver: yupResolver(contactSchema) as any,
  });

  const onError = async (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage)
      ? errorMessage
      : [errorMessage];

    ErrorToast({
      title: "Error Sending Message",
      descriptions,
    });
  };

  const onSuccess = () => {
    SuccessToast({
      title: "Message Sent!",
      description:
        "Message received successfully! 🎉. We will get back to you shortly.",
    });
    reset();
  };

  const {
    mutate: contactUs,
    isPending: contactUsPending,
    isError: contactUsError,
  } = useContactUs(onError, onSuccess);

  const contactUsLoading = contactUsPending && !contactUsError;

  const onSubmit = async (data: ContactFormData) => {
    const formData = new FormData();
    formData.append('fullname', data.fullname);
    formData.append('email', data.email);
    if (data.phone) formData.append('phone', data.phone);
    formData.append('title', data.title);
    formData.append('message', data.message);
    if (data.file && data.file.length > 0) {
      formData.append('file', data.file[0]);
    }

    contactUs(formData as any);
  };

  return (
    <form
      className="w-full flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1">
        <div className="w-full flex flex-col gap-1.5 ">
          <div className="flex flex-col gap-1">
            <input
              type="text"
              {...register("fullname")}
              placeholder="Full Name*"
              className="outline-none text-base text-black dark:text-white bg-bg-400 dark:bg-tertiary  placeholder:text-placeholder-light  rounded-md py-4 px-4"
            />
            {errors.fullname?.message && (
              <p className="text-red-500 text-sm">{errors.fullname.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 ">
        <div className="w-full flex flex-col gap-1.5 ">
          <div className="flex flex-col gap-1">
            <input
              {...register("email")}
              type="email"
              placeholder="Email Address*"
              className="outline-none text-base text-black dark:text-white bg-bg-400 dark:bg-tertiary  placeholder:text-placeholder-light rounded-md py-4 px-4"
            />
            {errors.email?.message && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 ">
        <div className="w-full flex flex-col gap-1.5 ">
          <div className="flex flex-col gap-1">
            <input
              {...register("phone")}
              placeholder="Phone Number (Optional)"
              className="outline-none text-base text-black dark:text-white bg-bg-400 dark:bg-tertiary  placeholder:text-placeholder-light rounded-md py-4 px-4"
              type="text"
              onKeyDown={handleNumericKeyDown}
              onPaste={handleNumericPaste}
            />
            {errors.phone?.message && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1">
        <div className="w-full flex flex-col gap-1.5 ">
          <div className="flex flex-col gap-1">
            <input
              type="text"
              {...register("title")}
              placeholder="Title of your message*"
              className="outline-none text-base text-black dark:text-white bg-bg-400 dark:bg-tertiary  placeholder:text-placeholder-light  rounded-md py-4 px-4"
            />
            {errors.title?.message && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 ">
        <div className="w-full flex flex-col gap-1.5 ">
          <div className="flex flex-col gap-1">
            <textarea
              {...register("message")}
              placeholder="type message here...."
              rows={6}
              className="resize-y outline-none text-base text-black dark:text-white bg-bg-400 dark:bg-tertiary  placeholder:text-placeholder-light  rounded-md py-4 px-4"
            />
            {errors.message?.message && (
              <p className="text-red-500 text-sm">{errors.message.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1">
        <div className="w-full flex flex-col gap-1.5">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="file-upload"
              className="flex items-center justify-center cursor-pointer w-full bg-bg-400 dark:bg-tertiary text-black dark:text-white rounded-md py-4 px-4"
            >
              <div className="flex items-center gap-3">
                <FiUpload className="text-xl text-placeholder-light" />
                <span className="text-placeholder-light">Upload file (Optional)</span>
              </div>
              <input
                id="file-upload"
                type="file"
                {...register("file")}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.rtf,.jpg,.jpeg,.png"
              />
            </label>
            {errors.file?.message && (
              <p className="text-red-500 text-sm">{errors.file.message}</p>
            )}
          </div>
        </div>
      </div>

      <motion.div className="mt-4 w-full" variants={zoomIn(0.2, 0.5)}>
        <CustomButton
          type="submit"
          disabled={!isValid || contactUsLoading}
          isLoading={contactUsLoading}
          className="w-full font-semibold py-3.5 border-2 border-primary text-text-300 text-base 2xs:text-lg max-2xs:px-6 rounded-md"
        >
          Send Message{" "}
        </CustomButton>
      </motion.div>
    </form>
  );
};

export default ContactUsForm;
