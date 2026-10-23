import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import { formatDate } from "../utils/formatDate";
import type { PostData } from "../Types/Post.type";

// Compact, read-only version of a post (used for shares)
export default function SharedPostPreview({ post }: { post: PostData }) {
  if (!post?.user) {
    return (
      <div className="rounded-2xl border border-line bg-soft p-4 text-sm text-muted">
        This post is no longer available.
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-[var(--surface)]">
      <div className="flex items-center gap-2.5 px-4 pt-3">
        <Avatar src={post.user.photo} name={post.user.name} size={32} />
        <Link to={`/users/${post.user._id}`} className="min-w-0 truncate text-sm font-semibold text-ink hover:underline">
          {post.user.name}
        </Link>
        <span className="text-xs text-muted">{formatDate(post.createdAt)}</span>
      </div>
      {post.body && <p className="whitespace-pre-wrap break-words px-4 pb-3 pt-2 text-sm leading-relaxed text-ink">{post.body}</p>}
      {post.image && <img src={post.image} alt="" className="max-h-72 w-full object-cover" loading="lazy" />}
      {!post.body && !post.image && <div className="pb-3" />}
    </div>
  );
}
