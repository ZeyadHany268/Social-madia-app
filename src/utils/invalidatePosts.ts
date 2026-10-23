import type { QueryClient } from "@tanstack/react-query";

// Refresh every place a post can appear: feed, single page, profiles, bookmarks, comments
export function invalidatePostQueries(queryClient: QueryClient, postId?: string) {
  queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
  queryClient.invalidateQueries({ queryKey: ["myPosts"] });
  queryClient.invalidateQueries({ queryKey: ["userPosts"] });
  queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
  if (postId) {
    queryClient.invalidateQueries({ queryKey: ["getSinglePost", postId] });
    queryClient.invalidateQueries({ queryKey: ["getpostcomments", postId] });
  }
}
