import { Link } from "react-router-dom";
import { Bookmark, Bell } from "lucide-react";
import { useUser } from "../Context/UserContext";
import Avatar from "./Avatar";

export default function MiniProfileCard() {
  const { user } = useUser();

  return (
    <div className="surface card overflow-hidden">
      <div className="bg-brand-gradient relative h-20">
        {user?.cover && <img src={user.cover} alt="" className="h-full w-full object-cover" />}
      </div>
      <div className="px-5 pb-5">
        <Link to="/profile" className="relative z-[1] -mt-9 block w-fit">
          <Avatar src={user?.photo} name={user?.name} size={68} ring />
        </Link>

        {user ? (
          <>
            <Link to="/profile" className="mt-3 block truncate font-display text-lg font-bold text-ink hover:underline">
              {user.name}
            </Link>
            <p className="truncate text-sm text-muted">@{user.username}</p>

            <dl className="mt-4 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-2xl bg-soft py-2.5">
                <dd className="text-base font-bold text-ink">{user.followersCount}</dd>
                <dt className="text-xs text-muted">Followers</dt>
              </div>
              <div className="rounded-2xl bg-soft py-2.5">
                <dd className="text-base font-bold text-ink">{user.followingCount}</dd>
                <dt className="text-xs text-muted">Following</dt>
              </div>
            </dl>
          </>
        ) : (
          <div className="mt-3 space-y-2">
            <div className="skeleton h-5 w-32 rounded-full" />
            <div className="skeleton h-4 w-24 rounded-full" />
          </div>
        )}

        <nav className="mt-4 space-y-1 border-t border-line pt-3 text-sm">
          <Link to="/bookmarks" className="flex items-center gap-3 rounded-xl px-3 py-2 text-muted transition hover-soft">
            <Bookmark className="h-4 w-4" /> Saved posts
          </Link>
          <Link to="/notifications" className="flex items-center gap-3 rounded-xl px-3 py-2 text-muted transition hover-soft">
            <Bell className="h-4 w-4" /> Notifications
          </Link>
        </nav>
      </div>
    </div>
  );
}
