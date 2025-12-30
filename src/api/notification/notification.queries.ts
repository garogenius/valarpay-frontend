import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createNotification,
  deleteNotificationDevice,
  getNotificationDevices,
  getNotificationPreferences,
  getNotifications,
  getUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
  registerNotificationDevice,
  updateNotificationDevice,
  updateNotificationPreferences,
} from "./notification.apis";

export const useGetNotifications = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  const notifications = data?.data?.data ?? [];
  return { notifications, isPending, isError };
};

export const useGetUnreadCount = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["notifications-unread-count"],
    queryFn: getUnreadCount,
    refetchInterval: 30000,
  });
  // backend may return {count:number} or number
  const raw = data?.data?.data;
  const count = typeof raw === "number" ? raw : raw?.count ?? 0;
  return { count, isPending, isError };
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
    },
  });
};

export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
    },
  });
};

export const useNotificationPreferences = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["notification-preferences"],
    queryFn: getNotificationPreferences,
  });
  const preferences = data?.data?.data;
  return { preferences, isPending, isError };
};

export const useUpdateNotificationPreferences = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateNotificationPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-preferences"] });
    },
  });
};

export const useRegisterNotificationDevice = () => {
  return useMutation({ mutationFn: registerNotificationDevice });
};

export const useGetNotificationDevices = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["notification-devices"],
    queryFn: getNotificationDevices,
  });
  const devices = data?.data?.data ?? [];
  return { devices, isPending, isError };
};

export const useUpdateNotificationDevice = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, any> }) =>
      updateNotificationDevice(id, payload),
  });
};

export const useDeleteNotificationDevice = () => {
  return useMutation({ mutationFn: (id: string) => deleteNotificationDevice(id) });
};
