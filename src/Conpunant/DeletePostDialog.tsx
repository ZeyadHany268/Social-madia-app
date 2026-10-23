import { useMutation, useQueryClient } from "@tanstack/react-query";
import ConfirmDialog from "./ConfirmDialog";
import { deletePost } from "../api/posts";
import { getErrorMessage } from "../api/client";
import { invalidatePostQueries } from "../utils/invalidatePosts";
import toast from "react-hot-toast";

export default function DeletePostDialog({
  postId,
  onClose,
  onDeleted,
}: {
  postId: string;
  onClose: () => void;
  onDeleted?: () => void;
}) {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: () => deletePost(postId),
    onSuccess: (res) => {
      toast.success(res.data.message);
      queryClient.removeQueries({ queryKey: ["getSinglePost", postId] });
      invalidatePostQueries(queryClient);
      onClose();
      onDeleted?.();
    },
  });

  return (
    <ConfirmDialog
      title="Delete this post?"
      description="It will be removed from your profile and everyone's feed. This can't be undone."
      isPending={isPending}
      error={isError ? getErrorMessage(error) : null}
      onConfirm={() => mutate()}
      onClose={onClose}
    />
  );
}
