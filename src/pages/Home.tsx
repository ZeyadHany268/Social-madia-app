import { useState } from "react";
import { motion } from "framer-motion";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2, Users } from "lucide-react";
import PostCard from "./../Conpunant/PostCard";
import ErrorState from "./../Conpunant/ErrorState";
import LoadingPosts from "./../Conpunant/LoadingPosts";
import EmptyPosts from "./../Conpunant/EmptyPosts";
import CreatePost from "../Conpunant/CreatePost";
import MiniProfileCard from "../Conpunant/MiniProfileCard";
import SuggestionsCard from "../Conpunant/SuggestionsCard";
import { getFeed, POSTS_PAGE_SIZE, type FeedTab } from "../api/posts";
import { getErrorMessage } from "../api/client";
import { listFrom } from "../api/parse";
import type { PostData } from "../Types/Post.type";

const tabs: { id: FeedTab; label: string }[] = [
  { id: "all", label: "Everyone" },
  { id: "following", label: "Following" },
];

export default function Home() {
  const [tab, setTab] = useState<FeedTab>("all");

  const { data, isError, isLoading, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["getAllPosts", tab],
      queryFn: ({ pageParam }) => getFeed(tab, pageParam),
      initialPageParam: 1,
      getNextPageParam: (last, all) => {
        const lastPosts = listFrom<PostData>(last, ["posts"]);
        if (lastPosts.length < POSTS_PAGE_SIZE) return undefined;
        const seen = new Set(all.slice(0, -1).flatMap((p) => listFrom<PostData>(p, ["posts"]).map((x) => x._id)));
        if (lastPosts.every((p) => seen.has(p._id))) return undefined; // backend ignored the page param
        return all.length + 1;
      },
      select: (d) => {
        const seen = new Set<string>();
        return d.pages
          .flatMap((p) => listFrom<PostData>(p, ["posts"]))
          .filter((p) => (seen.has(p._id) ? false : (seen.add(p._id), true)));
      },
    });

  const posts = data ?? [];

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)_300px]">
      {/* Left rail */}
      <aside className="hidden lg:block">
        <div className="sticky top-28">
          <MiniProfileCard />
        </div>
      </aside>

      {/* Feed */}
      <div className="mx-auto w-full max-w-xl space-y-4 lg:max-w-none">
        <CreatePost />

        <div className="flex items-center justify-between pt-1">
          <h1 className="font-display text-xl font-bold text-ink">Feed</h1>
          <div className="tabs" role="tablist" aria-label="Feed filter">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                className="tab"
                onClick={() => setTab(t.id)}
              >
                {tab === t.id && (
                  <motion.span
                    layoutId="feed-tab"
                    className="absolute inset-0 rounded-full bg-[var(--surface)] shadow-sm"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {isLoading && <LoadingPosts />}

        {isError && <ErrorState title="Couldn't load the feed" message={getErrorMessage(error)} onRetry={() => refetch()} />}

        {!isLoading && !isError && posts.length === 0 && (
          <EmptyPosts
            icon={<Users className="h-6 w-6" />}
            title={tab === "following" ? "Your following feed is empty" : "No posts yet"}
            text={
              tab === "following"
                ? "Follow a few people and their posts will land here."
                : "Be the first to share something."
            }
          />
        )}

        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}

        {hasNextPage && (
          <div className="flex justify-center pt-2">
            <button type="button" className="btn-ghost" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
              {isFetchingNextPage ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                </>
              ) : (
                "Show more posts"
              )}
            </button>
          </div>
        )}
      </div>

      {/* Right rail */}
      <aside className="hidden lg:block">
        <div className="sticky top-28">
          <SuggestionsCard />
        </div>
      </aside>
    </div>
  );
}
