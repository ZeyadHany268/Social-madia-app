import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Modal from "./Modal";
import Avatar from "./Avatar";
import FollowButton from "./FollowButton";
import { getPostLikes } from "../api/posts";
import { listFrom } from "../api/parse";
import { getErrorMessage } from "../api/client";
import type { User } from "../Types/User.type";

export default function LikesModal({ postId, onClose }: { postId: string; onClose: () => void }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["postLikes", postId],
    queryFn: () => getPostLikes(postId),
    select: (res) => listFrom<any>(res, ["likes", "users"]).map((item) => (item?.user ?? item) as User),
  });

  return (
    <Modal title="Liked by" onClose={onClose}>
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-12 rounded-2xl" />
          ))}
        </div>
      )}
      {isError && <p className="text-sm text-[var(--like)]">{getErrorMessage(error)}</p>}
      {data && data.length === 0 && <p className="py-6 text-center text-sm text-muted">No likes yet.</p>}
      <ul className="divide-y divide-[var(--line)]">
        {data?.map((u) => (
          <li key={u._id} className="flex items-center justify-between gap-3 py-3">
            <Link to={`/users/${u._id}`} onClick={onClose} className="flex min-w-0 items-center gap-3">
              <Avatar src={u.photo} name={u.name} size={40} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{u.name}</p>
                <p className="truncate text-xs text-muted">@{u.username}</p>
              </div>
            </Link>
            <FollowButton userId={u._id} />
          </li>
        ))}
      </ul>
    </Modal>
  );
}
