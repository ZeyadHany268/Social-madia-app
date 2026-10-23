import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Loader2, X } from "lucide-react";
import Modal from "./Modal";
import { updatePost } from "../api/posts";
import { getErrorMessage } from "../api/client";
import { invalidatePostQueries } from "../utils/invalidatePosts";
import type { PostData } from "../Types/Post.type";
import toast from "react-hot-toast";

type FormValues = { body: string; image: FileList | null };

export default function EditPostModal({
  post,
  onClose,
}: {
  post: PostData;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { register, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: { body: post.body ?? "", image: null },
  });

  const body = watch("body") ?? "";
  const newImage = watch("image")?.[0];
  const imageField = register("image");

  useEffect(() => {
    if (!newImage) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(newImage);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [newImage]);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (formData: FormData) => updatePost(post._id, formData),
    onSuccess: (res) => {
      toast.success(res.data.message);
      invalidatePostQueries(queryClient, post._id);
      onClose();
    },
  });

  const hasImage = !!(preview || post.image);
  const unchanged = body.trim() === (post.body ?? "").trim() && !newImage;
  const empty = !body.trim() && !hasImage;

  function onSubmit(values: FormValues) {
    const formData = new FormData();
    formData.append("body", values.body.trim());
    const file = values.image?.[0];
    if (file) formData.append("image", file);
    mutate(formData);
  }

  function clearNewImage() {
    setValue("image", null, { shouldDirty: true });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <Modal
      title="Edit post"
      description="Update what you shared"
      onClose={onClose}
      busy={isPending}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <textarea
          {...register("body")}
          rows={5}
          autoFocus
          placeholder="What's on your mind?"
          className="w-full resize-none rounded-xl border border-line bg-[var(--surface)] p-4 text-sm text-ink outline-none transition placeholder:text-muted focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--brand-soft)]"
        />

        {hasImage && (
          <div className="relative mt-4 overflow-hidden rounded-xl border border-line bg-soft">
            <img
              src={preview ?? post.image ?? ""}
              alt="Post"
              className="max-h-64 w-full object-contain"
            />
            {preview && (
              <button
                type="button"
                onClick={clearNewImage}
                aria-label="Discard new image"
                className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/70 text-white transition hover:bg-black"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}

        <input
          {...imageField}
          ref={(el) => {
            imageField.ref(el);
            fileInputRef.current = el;
          }}
          type="file"
          accept="image/*"
          className="hidden"
        />

        {isError && (
          <p role="alert" className="mt-3 text-sm text-[var(--like)]">
            {getErrorMessage(error)}
          </p>
        )}

        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isPending}
            className="btn-ghost"
          >
            <ImagePlus size={17} />
            {hasImage ? "Change photo" : "Add photo"}
          </button>

          <div className="flex items-center gap-2">
            <button type="button" onClick={onClose} disabled={isPending} className="btn-ghost">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || unchanged || empty}
              className="btn-primary px-6"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
