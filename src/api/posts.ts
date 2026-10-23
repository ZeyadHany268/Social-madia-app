import { api } from "./client";

export const POSTS_PAGE_SIZE = 10;

export type FeedTab = "all" | "following";

export const getFeed = (tab: FeedTab, page: number) =>
  tab === "following"
    ? api.get(`/posts/feed?only=following&page=${page}&limit=${POSTS_PAGE_SIZE}`)
    : api.get(`/posts?page=${page}&limit=${POSTS_PAGE_SIZE}`);

export const getSinglePost = (id: string) => api.get(`/posts/${id}`);
export const getUserPosts = (userId: string) => api.get(`/users/${userId}/posts`);

export const createPost = (formData: FormData) => api.post("/posts", formData);
export const updatePost = (id: string, formData: FormData) => api.put(`/posts/${id}`, formData);
export const deletePost = (id: string) => api.delete(`/posts/${id}`);

export const toggleLikePost = (id: string) => api.put(`/posts/${id}/like`);
export const toggleBookmarkPost = (id: string) => api.put(`/posts/${id}/bookmark`);
export const sharePost = (id: string, body: string) => api.post(`/posts/${id}/share`, { body });
export const getPostLikes = (id: string) => api.get(`/posts/${id}/likes?page=1&limit=20`);

/* Comments & replies */
export const getPostComments = (id: string) => api.get(`/posts/${id}/comments?page=1&limit=10`);
export const createComment = (postId: string, formData: FormData) =>
  api.post(`/posts/${postId}/comments`, formData);
export const updateComment = (postId: string, commentId: string, formData: FormData) =>
  api.put(`/posts/${postId}/comments/${commentId}`, formData);
export const deleteComment = (postId: string, commentId: string) =>
  api.delete(`/posts/${postId}/comments/${commentId}`);
export const toggleLikeComment = (postId: string, commentId: string) =>
  api.put(`/posts/${postId}/comments/${commentId}/like`);
export const getReplies = (postId: string, commentId: string) =>
  api.get(`/posts/${postId}/comments/${commentId}/replies?page=1&limit=10`);
export const createReply = (postId: string, commentId: string, formData: FormData) =>
  api.post(`/posts/${postId}/comments/${commentId}/replies`, formData);
