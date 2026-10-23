import { useState } from "react";
import { CalendarDays, Bookmark, FileText, Mail, Cake, VenusAndMars, Pencil, UserRound, Users } from "lucide-react";
import Avatar from "../Conpunant/Avatar";
import FollowButton from "../Conpunant/FollowButton";
import PostCard from "../Conpunant/PostCard";
import EmptyPosts from "../Conpunant/EmptyPosts";
import ErrorState from "../Conpunant/ErrorState";
import LoadingPosts from "../Conpunant/LoadingPosts";
import EditProfileModal from "../Conpunant/EditProfileModal";
import { getErrorMessage } from "../api/client";
import type { PostData } from "../Types/Post.type";
import type { UserProfile } from "../Types/userProfile.type";

function formatDate(date?: string) {
  if (!date) return "Not provided";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "Not provided";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

type Props = {
  user: UserProfile;
  isMe: boolean;
  posts: PostData[];
  postsLoading: boolean;
  postsError: boolean;
  postsErrorObj?: unknown;
  refetchPosts: () => void;
};

export default function ProfileView({ user, isMe, posts, postsLoading, postsError, postsErrorObj, refetchPosts }: Props) {
  const [editOpen, setEditOpen] = useState(false);

  const followers = user.followersCount ?? user.followers?.length ?? 0;
  const following = user.followingCount ?? user.following?.length ?? 0;
  const bookmarks = user.bookmarksCount ?? user.bookmarks?.length ?? 0;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      {/* Header */}
      <section className="surface card overflow-hidden">
        <div className="bg-brand-gradient relative h-40 sm:h-52">
          {user.cover ? (
            <img src={user.cover} alt="Profile cover" className="h-full w-full object-cover" />
          ) : (
            <>
              <div className="absolute -right-10 -top-24 h-64 w-64 rounded-full border-[28px] border-white/10" />
              <div className="absolute -bottom-28 left-1/4 h-60 w-60 rounded-full bg-white/10 blur-2xl" />
            </>
          )}
        </div>

        <div className="px-5 pb-6 sm:px-8">
          <div className="relative z-[1] -mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-start">
            <Avatar src={user.photo} name={user.name} size={104} ring className="!border-4" />

            <div className="min-w-0 flex-1 sm:pt-[60px]">
              <h1 className="break-words font-display text-2xl font-bold text-ink sm:text-3xl">{user.name}</h1>
              <p className="mt-0.5 text-sm text-muted">@{user.username}</p>
            </div>

            <div className="sm:pt-[62px]">
              {isMe ? (
                <button type="button" onClick={() => setEditOpen(true)} className="btn-ghost w-full sm:w-auto">
                  <Pencil size={16} /> Edit profile
                </button>
              ) : (
                <FollowButton userId={user._id} />
              )}
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat icon={<FileText size={17} />} label="Posts" value={posts.length} />
            <Stat icon={<Users size={17} />} label="Followers" value={followers} />
            <Stat icon={<UserRound size={17} />} label="Following" value={following} />
            {isMe ? (
              <Stat icon={<Bookmark size={17} />} label="Saved" value={bookmarks} />
            ) : (
              <Stat icon={<CalendarDays size={17} />} label="Joined" value={formatDate(user.createdAt)} small />
            )}
          </dl>
        </div>
      </section>

      <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* Details */}
        <aside className="surface card overflow-hidden">
          <div className="border-b border-line px-5 py-4">
            <h2 className="font-display font-bold text-ink">About</h2>
          </div>
          <div className="divide-y divide-[var(--line)] px-4">
            {isMe && <Detail icon={<Mail size={17} />} label="Email" value={user.email} />}
            <Detail icon={<Cake size={17} />} label="Birthday" value={formatDate(user.dateOfBirth)} />
            <Detail
              icon={<VenusAndMars size={17} />}
              label="Gender"
              value={user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : "Not provided"}
            />
            <Detail icon={<CalendarDays size={17} />} label="Joined" value={formatDate(user.createdAt)} />
          </div>
        </aside>

        {/* Posts */}
        <section className="min-w-0 space-y-4">
          <h2 className="font-display text-xl font-bold text-ink">{isMe ? "My posts" : `Posts by ${user.name.split(" ")[0]}`}</h2>

          {postsLoading && <LoadingPosts count={2} />}
          {postsError && <ErrorState title="Couldn't load posts" message={getErrorMessage(postsErrorObj)} onRetry={refetchPosts} />}
          {!postsLoading && !postsError && posts.length === 0 && (
            <EmptyPosts
              icon={<FileText className="h-6 w-6" />}
              title="No posts yet"
              text={isMe ? "Posts you share will appear here." : `${user.name.split(" ")[0]} hasn't posted anything yet.`}
            />
          )}
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </section>
      </div>

      {editOpen && <EditProfileModal onClose={() => setEditOpen(false)} />}
    </div>
  );
}

function Stat({ icon, label, value, small }: { icon: React.ReactNode; label: string; value: number | string; small?: boolean }) {
  return (
    <div className="rounded-2xl border border-line p-3.5">
      <div className="mb-2.5 grid h-9 w-9 place-items-center rounded-full bg-brand-soft text-brand">{icon}</div>
      <dd className={`${small ? "text-base" : "text-xl"} font-bold text-ink`}>{value}</dd>
      <dt className="mt-0.5 text-xs font-medium text-muted">{label}</dt>
    </div>
  );
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-start gap-3 py-3.5">
      <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-soft text-muted">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted">{label}</p>
        <p className="mt-0.5 break-words text-sm font-semibold text-ink">{value || "Not provided"}</p>
      </div>
    </div>
  );
}
