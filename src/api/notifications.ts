import { api } from "./client";

export const getNotifications = (unreadOnly = false) =>
  api.get(`/notifications?unread=${unreadOnly}&page=1&limit=20`);
export const getUnreadCount = () => api.get("/notifications/unread-count");
export const markNotificationRead = (id: string) => api.patch(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => api.patch("/notifications/read-all");
