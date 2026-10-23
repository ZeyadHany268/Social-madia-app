import { api } from "./client";
import type { UserProfileResponse } from "../Types/userProfile.type";

export const getMyProfile = () => api.get<UserProfileResponse>("/users/profile-data");
export const getUserProfile = (id: string) => api.get(`/users/${id}/profile`);
export const toggleFollow = (id: string) => api.put(`/users/${id}/follow`);
export const getSuggestions = (limit = 6) => api.get(`/users/suggestions?limit=${limit}`);
export const getBookmarks = () => api.get("/users/bookmarks");
export const uploadPhoto = (formData: FormData) => api.put("/users/upload-photo", formData);
export const changePassword = (body: { password: string; newPassword: string }) =>
  api.patch("/users/change-password", body);
