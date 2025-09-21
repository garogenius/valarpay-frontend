import { request } from "@/utils/axios-utils";
import { IContactUs } from "./contact-us.types";

export const contactUsRequest = async (formdata: IContactUs) => {
  return request({
    url: "/contact-us",
    method: "post",
    data: formdata,
  });
};
