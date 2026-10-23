import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark, Repeat2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import UserHeader from "./UserHeader";
import Comment from "./Comment";
import CreateComment from "./CreateComment";
import EditPostModal from "./EditPostModal";
import DeletePostDialog from "./DeletePostDialog";
import ShareModal from "./ShareModal";
import LikesModal from "./LikesModal";
import SharedPostPreview from "./SharedPostPreview";
import ErrorState from "./ErrorState";
import { useUser } from "../Context/UserContext";
import { getPostComments, toggleBookmarkPost, toggleLikePost } from "../api/posts";
import { getErrorMessage } from "../api/client";
import { hasId, listFrom } from "../api/parse";
import { invalidatePostQueries } from "../utils/invalidatePosts";
import type { PostCardProps } from "../Types/Post.type";
import type { CommentData } from "../Types/Comment.type";
import type { User } from "../Types/User.type";

const pop = { type: "spring", stiffness: 500, damping: 14 } as const;

export default function PostCard({ post, isSinglePost = false }: PostCardProps) {
  const { user: me } = useUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [likesOpen, setLikesOpen] = useState(false);

  // Only the owner of the post can edit / delete it
  const isOwner = !!me && post.user?._id === me._id;

  // ----- Like / Bookmark (optimistic: server value + local override) -----
  const serverLiked = hasId(post.likes, me?._id);
  const [likedOverride, setLikedOverride] = useState<boolean | null>(null);
  const liked = likedOverride ?? serverLiked;
  const likesCount = Math.max(0, post.likesCount + (liked === serverLiked ? 0 : liked ? 1 : -1));

  const [bookmarkOverride, setBookmarkOverride] = useState<boolean | null>(null);
  const bookmarked = bookmarkOverride ?? post.bookmarked;

  const likeMutation = useMutation({
    mutationFn: () => toggleLikePost(post._id),
    onMutate: () => setLikedOverride(!liked),
    onError: () => setLikedOverride(null),
    onSuccess: () => invalidatePostQueries(queryClient, post._id),
  });

  const bookmarkMutation = useMutation({
    mutationFn: () => toggleBookmarkPost(post._id),
    onMutate: () => setBookmarkOverride(!bookmarked),
    onError: () => setBookmarkOverride(null),
    onSuccess: () => {
      invalidatePostQueries(queryClient, post._id);
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });

  // ----- Comments (full list only on the single post page) -----
  const {
    data: comments = [],
    isError: commentsError,
    isLoading: commentsLoading,
    error: commentsErr,
    refetch: refetchComments,
  } = useQuery({
    queryKey: ["getpostcomments", post._id],
    queryFn: () => getPostComments(post._id),
    enabled: isSinglePost,
    select: (res) => listFrom<CommentData>(res, ["comments"]),
  });

  return (
    <article className="surface card overflow-hidden transition-shadow hover:shadow-[var(--shadow-pop)]">
      <UserHeader
        user={post.user as User}
        createdAt={post.createdAt}
        onEdit={isOwner ? () => setEditOpen(true) : undefined}
        onDelete={isOwner ? () => setDeleteOpen(true) : undefined}
      />

      {post.isShare && (
        <p className="mt-3 flex items-center gap-1.5 px-5 text-xs font-medium text-muted">
          <Repeat2 className="h-3.5 w-3.5" /> Shared a post
        </p>
      )}

      {post.body && (
        <div className="px-5 pt-3">
          <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed text-ink">{post.body}</p>
        </div>
      )}

      {post.isShare && post.sharedPost !== undefined && (
        <div className="mt-3 px-5">
          <SharedPostPreview post={post.sharedPost as never} />
        </div>
      )}

      {post.image && (
        <div className="mt-3 px-5">
          <div className="overflow-hidden rounded-2xl border border-line">
            <img src={post.image} alt="Post content" className="max-h-[460px] w-full object-cover" loading="lazy" />
          </div>
        </div>
      )}

      {/* Stats */}
      {(likesCount > 0 || post.commentsCount > 0 || post.sharesCount > 0) && (
        <div className="mt-3 flex items-center gap-4 px-5 text-[13px] text-muted">
          {likesCount > 0 && (
            <button type="button" onClick={() => setLikesOpen(true)} className="hover:underline">
              <span className="font-semibold text-ink">{likesCount}</span> {likesCount === 1 ? "like" : "likes"}
            </button>
          )}
          {post.commentsCount > 0 && (
            <Link to={`/getsinglePost/${post._id}`} className="hover:underline">
              <span className="font-semibold text-ink">{post.commentsCount}</span>{" "}
              {post.commentsCount === 1 ? "comment" : "comments"}
            </Link>
          )}
          {post.sharesCount > 0 && (
            <span>
              <span className="font-semibold text-ink">{post.sharesCount}</span> {post.sharesCount === 1 ? "share" : "shares"}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mx-3 mt-3 flex items-center justify-between border-t border-line py-2">
        <div className="flex items-center">
          <button
            onClick={() => !likeMutation.isPending && likeMutation.mutate()}
            aria-pressed={liked}
            className="action"
            style={liked ? { color: "var(--like)" } : undefined}
          >
            <motion.span key={String(liked)} initial={{ scale: liked ? 0.5 : 1 }} animate={{ scale: 1 }} transition={pop} className="grid">
              <Heart className="h-[18px] w-[18px]" fill={liked ? "currentColor" : "none"} />
            </motion.span>
            <span>Like</span>
          </button>

          <Link to={`/getsinglePost/${post._id}`} className="action">
            <MessageCircle className="h-[18px] w-[18px]" />
            <span>Comment</span>
          </Link>

          <button type="button" className="action" onClick={() => setShareOpen(true)}>
            <Share2 className="h-[18px] w-[18px]" />
            <span>Share</span>
          </button>
        </div>

        <button
          onClick={() => !bookmarkMutation.isPending && bookmarkMutation.mutate()}
          aria-pressed={bookmarked}
          aria-label={bookmarked ? "Remove bookmark" : "Save post"}
          className="action !px-2.5"
          style={bookmarked ? { color: "var(--brand)" } : undefined}
        >
          <motion.span key={String(bookmarked)} initial={{ scale: bookmarked ? 0.6 : 1 }} animate={{ scale: 1 }} transition={pop} className="grid">
            <Bookmark className="h-[18px] w-[18px]" fill={bookmarked ? "currentColor" : "none"} />
          </motion.span>
        </button>
      </div>

      <CreateComment postId={post._id} />

      {/* Comments */}
      {post.commentsCount > 0 && (
        <div className="border-t border-line px-5 pb-4 pt-3">
          {!isSinglePost && post.topComment && <Comment comment={post.topComment} />}
          {!isSinglePost && post.commentsCount > 1 && (
            <Link to={`/getsinglePost/${post._id}`} className="mt-1 inline-block text-xs font-semibold text-brand hover:underline">
              View all {post.commentsCount} comments
            </Link>
          )}

          {isSinglePost && commentsLoading && (
            <div className="space-y-3 py-2">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="skeleton h-9 w-9 rounded-full" />
                  <div className="skeleton h-14 flex-1 rounded-2xl" />
                </div>
              ))}
            </div>
          )}
          {isSinglePost && commentsError && <ErrorState message={getErrorMessage(commentsErr)} onRetry={() => refetchComments()} />}
          {isSinglePost && comments.map((comment) => <Comment key={comment._id} comment={comment} />)}
        </div>
      )}

      {editOpen && <EditPostModal post={post} onClose={() => setEditOpen(false)} />}
      {deleteOpen && (
        <DeletePostDialog postId={post._id} onClose={() => setDeleteOpen(false)} onDeleted={() => isSinglePost && navigate("/")} />
      )}
      {shareOpen && <ShareModal post={post} onClose={() => setShareOpen(false)} />}
      {likesOpen && <LikesModal postId={post._id} onClose={() => setLikesOpen(false)} />}
    </article>
  );
}
