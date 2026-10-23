import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Modal from "./Modal";
import SharedPostPreview from "./SharedPostPreview";
import { sharePost } from "../api/posts";
import { getErrorMessage } from "../api/client";
import { invalidatePostQueries } from "../utils/invalidatePosts";
import type { PostData } from "../Types/Post.type";
import toast from "react-hot-toast";

export default function ShareModal({ post, onClose }: { post: PostData; onClose: () => void }) {
  const [body, setBody] = useState("");
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: () => sharePost(post._id, body.trim()),
    onSuccess: (res) => {
      toast.success(res.data.message);
      invalidatePostQueries(queryClient, post._id);
      onClose();
    },
  });

  return (
    <Modal title="Share post" description="It will appear on your profile and in your followers' feeds." onClose={onClose} busy={isPending}>
      <textarea
        autoFocus
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder="Say something about this post (optional)"
        className="input resize-none"
      />
      <div className="mt-4">
        <SharedPostPreview post={post} />
      </div>

      {isError && (
        <p role="alert" className="mt-3 text-sm text-[var(--like)]">
          {getErrorMessage(error)}
        </p>
      )}

      <div className="mt-5 flex justify-end gap-2">
        <button type="button" onClick={onClose} disabled={isPending} className="btn-ghost">
          Cancel
        </button>
        <button type="button" onClick={() => mutate()} disabled={isPending} className="btn-primary">
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Sharing...
            </>
          ) : (
            "Share now"
          )}
        </button>
      </div>
    </Modal>
  );
}
