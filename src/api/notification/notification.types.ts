export type NotificationCategory = "TRANSACTIONS" | "SERVICES" | "UPDATES" | "MESSAGES" | string;
export type NotificationChannel = "IN_APP" | "EMAIL" | "SMS" | "PUSH" | string;

export interface NotificationItem {
  id: string;
  userId: string;
  category: NotificationCategory;
  channel: NotificationChannel;
  status: string;
  title: string;
  message: string;
  metadata?: Record<string, any> | null;
  readAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationListResponse {
  message: string;
  statusCode: number;
  data: NotificationItem[];
}

export interface UnreadCountResponse {
  message: string;
  statusCode: number;
  data: { count: number } | number;
}

export interface CreateNotificationDto {
  category: NotificationCategory;
  channel: NotificationChannel;
  title: string;
  message: string;
  metadata?: Record<string, any>;
}

export interface PreferenceDto {
  category: NotificationCategory;
  email?: boolean;
  sms?: boolean;
  push?: boolean;
  inApp?: boolean;
}
