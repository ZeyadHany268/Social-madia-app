import { useEffect, useState } from "react";
import { ImagePlus, Send, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImSpinner2 } from "react-icons/im";
import { createComment, createReply } from "../api/posts";
import { getErrorMessage } from "../api/client";
import { useUser } from "../Context/UserContext";
import { invalidatePostQueries } from "../utils/invalidatePosts";
import Avatar from "./Avatar";
import toast from "react-hot-toast";

type CommentFormValues = {
  content: string;
  image: FileList | null;
};

// Writes a comment on a post — or a reply when `parentId` is given.
export default function CreateComment({
  postId,
  parentId,
  onDone,
  autoFocus = false,
}: {
  postId: string;
  parentId?: string;
  onDone?: () => void;
  autoFocus?: boolean;
}) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { register, handleSubmit, reset, watch, setValue } = useForm<CommentFormValues>({
    defaultValues: { content: "", image: null },
  });

  const selectedImage = watch("image")?.[0];

  useEffect(() => {
    if (!selectedImage) {
      setImagePreview(null);
      return;
    }
    const imageUrl = URL.createObjectURL(selectedImage);
    setImagePreview(imageUrl);
    return () => URL.revokeObjectURL(imageUrl);
  }, [selectedImage]);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (formData: FormData) =>
      parentId ? createReply(postId, parentId, formData) : createComment(postId, formData),
    onSuccess: (res) => {
      toast.success(res.data.message);
      invalidatePostQueries(queryClient, postId);
      if (parentId) queryClient.invalidateQueries({ queryKey: ["replies", parentId] });
      reset();
      setImagePreview(null);
      onDone?.();
    },
  });

  function handleCommentSubmit(values: CommentFormValues) {
    const content = values.content.trim();
    const image = values.image?.[0];
    if (!content && !image) return;

    const formData = new FormData();
    if (content) formData.append("content", content);
    if (image) formData.append("image", image);
    mutate(formData);
  }

  const { ref: contentRef, ...contentField } = register("content");

  return (
    <form onSubmit={handleSubmit(handleCommentSubmit)} className={parentId ? "mt-2" : "px-4 pb-4 pt-1 sm:px-5"}>
      <div className="flex items-center gap-2.5">
        {!parentId && (
          <div className="hidden sm:block">
            <Avatar src={user?.photo} name={user?.name} size={36} />
          </div>
        )}

        <div className="flex min-h-[44px] flex-1 items-center gap-1 rounded-full border border-line bg-[var(--surface)] pl-4 pr-1.5 transition focus-within:border-[var(--brand)] focus-within:shadow-[0_0_0_4px_var(--brand-soft)]">
          <textarea
            {...contentField}
            ref={contentRef}
            autoFocus={autoFocus}
            placeholder={parentId ? "Write a reply..." : "Write a comment..."}
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(handleCommentSubmit)();
              }
            }}
            className="max-h-24 min-h-[24px] flex-1 resize-none bg-transparent py-2.5 text-sm text-ink outline-none placeholder:text-muted"
          />

          <label title="Add image" className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full text-muted transition hover:bg-[var(--surface-2)] hover:text-brand">
            <ImagePlus className="h-[18px] w-[18px]" />
            <input type="file" accept="image/*" className="hidden" {...register("image")} />
          </label>

          <button
            type="submit"
            disabled={isPending}
            aria-label={parentId ? "Send reply" : "Send comment"}
            className="bg-brand-gradient grid h-9 w-9 shrink-0 place-items-center rounded-full text-white transition active:scale-95 disabled:opacity-50"
          >
            {isPending ? <ImSpinner2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {imagePreview && (
        <div className="mt-3 flex items-start pl-0 sm:pl-[46px]">
          <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-line bg-soft shadow-sm">
            <img src={imagePreview} alt="Comment image preview" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => setValue("image", null, { shouldDirty: true })}
              aria-label="Remove selected image"
              className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/70 text-white transition hover:bg-[var(--like)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {isError && (
        <p role="alert" className="mt-2 pl-0 text-xs text-[var(--like)] sm:pl-[46px]">
          {getErrorMessage(error)}
        </p>
      )}
    </form>
  );
}
