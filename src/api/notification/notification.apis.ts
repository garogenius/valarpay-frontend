import { request } from "@/utils/axios-utils";
import {
  CreateNotificationDto,
  PreferenceDto,
} from "./notification.types";

export const createNotification = (data: CreateNotificationDto) => {
  return request({ url: "/notification", method: "post", data });
};

export const getNotifications = () => {
  return request({ url: "/notification" });
};

export const getUnreadCount = () => {
  return request({ url: "/notification/unread-count" });
};

export const markNotificationRead = (id: string) => {
  return request({ url: `/notification/${id}/read`, method: "put" });
};

export const markAllNotificationsRead = () => {
  return request({ url: "/notification/read-all", method: "put" });
};

export const getNotificationPreferences = () => {
  return request({ url: "/notification/preferences" });
};

export const updateNotificationPreferences = (data: PreferenceDto) => {
  return request({ url: "/notification/preferences", method: "put", data });
};

export const registerNotificationDevice = (data: Record<string, any>) => {
  return request({ url: "/notification/devices", method: "post", data });
};

export const getNotificationDevices = () => {
  return request({ url: "/notification/devices" });
};

export const updateNotificationDevice = (id: string, data: Record<string, any>) => {
  return request({ url: `/notification/devices/${id}`, method: "put", data });
};

export const deleteNotificationDevice = (id: string) => {
  return request({ url: `/notification/devices/${id}`, method: "delete" });
};
