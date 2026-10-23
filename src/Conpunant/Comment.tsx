import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, MessageCircle, Loader2 } from "lucide-react";
import type { CommentData } from "../Types/Comment.type";
import { formatDate } from "../utils/formatDate";
import { useUser } from "../Context/UserContext";
import { deleteComment, getReplies, toggleLikeComment, updateComment } from "../api/posts";
import { getErrorMessage } from "../api/client";
import { hasId, listFrom } from "../api/parse";
import { invalidatePostQueries } from "../utils/invalidatePosts";
import Avatar from "./Avatar";
import ConfirmDialog from "./ConfirmDialog";
import CreateComment from "./CreateComment";

export default function Comment({ comment, isReply = false }: { comment: CommentData; isReply?: boolean }) {
  const { user: me } = useUser();
  const queryClient = useQueryClient();
  const postId = typeof comment.post === "string" ? comment.post : (comment.post as { _id: string })?._id;
  const creator = comment.commentCreator;
  const isOwner = !!me && creator?._id === me._id;

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content ?? "");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replying, setReplying] = useState(false);

  // ----- Like (optimistic) -----
  const serverLiked = hasId(comment.likes, me?._id);
  const [likedOverride, setLikedOverride] = useState<boolean | null>(null);
  const liked = likedOverride ?? serverLiked;
  const baseCount = comment.likes?.length ?? 0;
  const likesCount = Math.max(0, baseCount + (liked === serverLiked ? 0 : liked ? 1 : -1));

  const afterChange = () => {
    invalidatePostQueries(queryClient, postId);
    if (comment.parentComment) {
      queryClient.invalidateQueries({ queryKey: ["replies", String(comment.parentComment?._id ?? comment.parentComment)] });
    }
  };

  const likeMutation = useMutation({
    mutationFn: () => toggleLikeComment(postId, comment._id),
    onMutate: () => setLikedOverride(!liked),
    onError: () => setLikedOverride(null),
    onSuccess: afterChange,
  });

  const editMutation = useMutation({
    mutationFn: () => {
      const formData = new FormData();
      formData.append("content", draft.trim());
      return updateComment(postId, comment._id, formData);
    },
    onSuccess: () => {
      afterChange();
      setEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteComment(postId, comment._id),
    onSuccess: () => {
      afterChange();
      setDeleteOpen(false);
    },
  });

  // ----- Replies (loaded on demand) -----
  const {
    data: replies = [],
    isLoading: repliesLoading,
    isError: repliesError,
    error: repliesErr,
  } = useQuery({
    queryKey: ["replies", comment._id],
    queryFn: () => getReplies(postId, comment._id),
    enabled: showReplies && !isReply,
    select: (res) => listFrom<CommentData>(res, ["replies", "comments"]),
  });

  if (!creator) return null;

  const profileLink = isOwner ? "/profile" : `/users/${creator._id}`;
  const canSave = draft.trim().length > 0 && draft.trim() !== (comment.content ?? "").trim();

  return (
    <div className="flex gap-3 py-2">
      <Link to={profileLink} className="shrink-0">
        <Avatar src={creator.photo} name={creator.name} size={isReply ? 28 : 36} />
      </Link>

      <div className="min-w-0 flex-1">
        {editing ? (
          <div>
            <textarea
              autoFocus
              rows={2}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="input resize-none !rounded-2xl !py-2.5"
            />
            {editMutation.isError && (
              <p role="alert" className="mt-1 text-xs text-[var(--like)]">
                {getErrorMessage(editMutation.error)}
              </p>
            )}
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                className="btn-primary !h-8 !px-4 !text-xs"
                disabled={!canSave || editMutation.isPending}
                onClick={() => editMutation.mutate()}
              >
                {editMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save"}
              </button>
              <button
                type="button"
                className="btn-ghost !h-8 !px-4 !text-xs"
                onClick={() => {
                  setEditing(false);
                  setDraft(comment.content ?? "");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="inline-block max-w-full rounded-2xl rounded-tl-md bg-soft px-4 py-2.5">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <Link to={profileLink} className="text-sm font-semibold text-ink hover:underline">
                {creator.name}
              </Link>
              <span className="text-xs text-muted">{formatDate(comment.createdAt)}</span>
            </div>
            {comment.content && (
              <p className="mt-0.5 whitespace-pre-wrap break-words text-[14px] leading-relaxed text-ink">{comment.content}</p>
            )}
          </div>
        )}

        {comment.image && !editing && (
          <div className="mt-2 max-w-sm overflow-hidden rounded-2xl border border-line">
            <img src={comment.image} alt="Comment" className="max-h-[280px] w-auto max-w-full object-cover" loading="lazy" />
          </div>
        )}

        {!editing && (
          <div className="mt-0.5 flex flex-wrap items-center gap-0.5 pl-1">
            <button
              type="button"
              onClick={() => !likeMutation.isPending && likeMutation.mutate()}
              aria-pressed={liked}
              className="action !h-7 !px-2 !text-xs"
              style={liked ? { color: "var(--like)" } : undefined}
            >
              <Heart className="h-3.5 w-3.5" fill={liked ? "currentColor" : "none"} />
              <span>{likesCount > 0 ? likesCount : "Like"}</span>
            </button>

            {!isReply && (
              <button type="button" className="action !h-7 !px-2 !text-xs" onClick={() => { setReplying(true); setShowReplies(true); }}>
                <MessageCircle className="h-3.5 w-3.5" />
                <span>Reply</span>
              </button>
            )}

            {isOwner && (
              <>
                <button type="button" className="action !h-7 !px-2 !text-xs" onClick={() => setEditing(true)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="action !h-7 !px-2 !text-xs hover:!text-[var(--like)]"
                  onClick={() => setDeleteOpen(true)}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        )}

        {/* Replies */}
        {!isReply && !editing && (comment.repliesCount ?? 1) > 0 && (
          <button
            type="button"
            onClick={() => setShowReplies((s) => !s)}
            className="mt-1 pl-1 text-xs font-semibold text-brand hover:underline"
          >
            {showReplies ? "Hide replies" : comment.repliesCount ? `View ${comment.repliesCount} ${comment.repliesCount === 1 ? "reply" : "replies"}` : "View replies"}
          </button>
        )}

        {showReplies && !isReply && (
          <div className="mt-1 border-l-2 border-line pl-3">
            {repliesLoading && <div className="skeleton my-2 h-10 rounded-2xl" />}
            {repliesError && <p className="py-1 text-xs text-[var(--like)]">{getErrorMessage(repliesErr)}</p>}
            {!repliesLoading && !repliesError && replies.length === 0 && <p className="py-1 text-xs text-muted">No replies yet.</p>}
            {replies.map((reply) => (
              <Comment key={reply._id} comment={{ ...reply, post: reply.post ?? postId, parentComment: comment._id }} isReply />
            ))}
            {replying && <CreateComment postId={postId} parentId={comment._id} autoFocus onDone={() => setReplying(false)} />}
          </div>
        )}
      </div>

      {deleteOpen && (
        <ConfirmDialog
          title="Delete this comment?"
          description="This can't be undone."
          isPending={deleteMutation.isPending}
          error={deleteMutation.isError ? getErrorMessage(deleteMutation.error) : null}
          onConfirm={() => deleteMutation.mutate()}
          onClose={() => setDeleteOpen(false)}
        />
      )}
    </div>
  );
}
