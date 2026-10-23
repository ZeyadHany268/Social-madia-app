import { useQuery } from "@tanstack/react-query";
import ProfileView from "./ProfileView";
import ErrorState from "../Conpunant/ErrorState";
import { useUser } from "../Context/UserContext";
import { getUserPosts } from "../api/posts";
import { listFrom } from "../api/parse";
import type { PostData } from "../Types/Post.type";

export default function Profile() {
  const { user, isLoading, isError, refetchUser } = useUser();

  const postsQuery = useQuery({
    queryKey: ["myPosts", user?._id],
    queryFn: () => getUserPosts(user!._id),
    enabled: !!user?._id,
    select: (res) => listFrom<PostData>(res, ["posts"]),
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="surface card overflow-hidden">
          <div className="skeleton h-44" />
          <div className="space-y-3 p-6">
            <div className="skeleton h-7 w-48 rounded-full" />
            <div className="skeleton h-4 w-32 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="mx-auto max-w-xl px-4">
        <ErrorState title="Couldn't load your profile" onRetry={refetchUser} />
      </div>
    );
  }

  return (
    <ProfileView
      user={user}
      isMe
      posts={postsQuery.data ?? []}
      postsLoading={postsQuery.isLoading}
      postsError={postsQuery.isError}
      postsErrorObj={postsQuery.error}
      refetchPosts={() => postsQuery.refetch()}
    />
  );
}
