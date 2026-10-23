import { Navigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ProfileView from "./ProfileView";
import ErrorState from "../Conpunant/ErrorState";
import { useUser } from "../Context/UserContext";
import { getUserProfile } from "../api/users";
import { getUserPosts } from "../api/posts";
import { listFrom, objectFrom } from "../api/parse";
import { getErrorMessage } from "../api/client";
import type { PostData } from "../Types/Post.type";
import type { UserProfile as UserProfileType } from "../Types/userProfile.type";

// Another person's profile (/users/:id)
export default function UserProfile() {
  const { id } = useParams();
  const { user: me } = useUser();

  const profile = useQuery({
    queryKey: ["userProfile", id],
    queryFn: () => getUserProfile(id!),
    enabled: !!id,
    select: (res) => objectFrom<UserProfileType>(res, ["user"]),
  });

  const posts = useQuery({
    queryKey: ["userPosts", id],
    queryFn: () => getUserPosts(id!),
    enabled: !!id,
    select: (res) => listFrom<PostData>(res, ["posts"]),
  });

  if (me && id === me._id) return <Navigate to="/profile" replace />;

  if (profile.isLoading) {
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

  if (profile.isError || !profile.data) {
    return (
      <div className="mx-auto max-w-xl px-4">
        <ErrorState title="Couldn't find this profile" message={getErrorMessage(profile.error, "The user may not exist.")} onRetry={() => profile.refetch()} />
      </div>
    );
  }

  return (
    <ProfileView
      user={profile.data}
      isMe={false}
      posts={posts.data ?? []}
      postsLoading={posts.isLoading}
      postsError={posts.isError}
      postsErrorObj={posts.error}
      refetchPosts={() => posts.refetch()}
    />
  );
}
