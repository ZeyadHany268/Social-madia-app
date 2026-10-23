import { useQuery } from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import PostCard from "../Conpunant/PostCard";
import EmptyPosts from "../Conpunant/EmptyPosts";
import ErrorState from "../Conpunant/ErrorState";
import LoadingPosts from "../Conpunant/LoadingPosts";
import { getBookmarks } from "../api/users";
import { listFrom } from "../api/parse";
import { getErrorMessage } from "../api/client";
import type { PostData } from "../Types/Post.type";

export default function Bookmarks() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: getBookmarks,
    select: (res) => listFrom<PostData>(res, ["bookmarks", "posts"]).map((p) => ({ ...p, bookmarked: true })),
  });

  return (
    <div className="mx-auto max-w-xl space-y-4 px-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Saved posts</h1>
        <p className="mt-1 text-sm text-muted">Everything you've bookmarked, in one place.</p>
      </div>

      {isLoading && <LoadingPosts count={2} />}
      {isError && <ErrorState title="Couldn't load saved posts" message={getErrorMessage(error)} onRetry={() => refetch()} />}
      {data && data.length === 0 && (
        <EmptyPosts
          icon={<Bookmark className="h-6 w-6" />}
          title="Nothing saved yet"
          text="Tap the bookmark on any post to keep it here."
        />
      )}
      {data?.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}
