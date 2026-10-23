import { useEffect, useRef, useState } from "react";
import { ImagePlus, X, Globe, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useUser } from "../Context/UserContext";
import Avatar from "./Avatar";
import { createPost } from "../api/posts";
import { getErrorMessage } from "../api/client";
import { invalidatePostQueries } from "../utils/invalidatePosts";
import toast from "react-hot-toast";

type PostFormValues = {
  body: string;
  image: FileList | null;
};

export default function CreatePost() {
  const { user } = useUser();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, reset, watch, setValue } =
    useForm<PostFormValues>({
      defaultValues: { body: "", image: null },
    });

  const content = watch("body") || "";
  const selectedImage = watch("image")?.[0] ?? null;

  // Create image preview
  useEffect(() => {
    if (!selectedImage) {
      setImagePreview(null);
      return;
    }
    const imageUrl = URL.createObjectURL(selectedImage);
    setImagePreview(imageUrl);
    return () => URL.revokeObjectURL(imageUrl);
  }, [selectedImage]);

  const imageField = register("image");

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file && !file.type.startsWith("image/")) {
      setValue("image", null);
      event.target.value = "";
      return;
    }
    imageField.onChange(event);
  }

  function removeImage() {
    setValue("image", null, { shouldDirty: true });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createPost,
    onSuccess: (res) => {
      toast.success(res.data.message);

      invalidatePostQueries(queryClient);
      reset();
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
  });

  function handlePostSubmit(values: PostFormValues) {
    const postContent = values.body.trim();
    const image = values.image?.[0];
    if (!postContent && !image) return;

    const formData = new FormData();
    if (postContent) formData.append("body", postContent);
    if (image) formData.append("image", image);
    mutate(formData);
  }

  return (
    <div className="surface card w-full p-4 sm:p-5">
      {/* User Info (from UserContext) */}
      <div className="mb-3 flex items-center gap-3">
        <Avatar src={user?.photo} name={user?.name} size={44} ring={!!user} />
        <div className="min-w-0">
          {user ? (
            <h3 className="truncate font-semibold text-ink">{user.name}</h3>
          ) : (
            <div className="skeleton h-4 w-28 rounded-full" />
          )}
          <div className="mt-0.5 flex items-center gap-1 text-xs text-muted">
            <Globe size={13} />
            <span>Public</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(handlePostSubmit)}>
        <textarea
          {...register("body")}
          placeholder={
            user
              ? `What's on your mind, ${user.name.split(" ")[0]}?`
              : "What's on your mind?"
          }
          rows={3}
          className="input resize-none !rounded-2xl !p-4"
        />

        {/* Image Preview */}
        {imagePreview && (
          <div className="relative mt-4 overflow-hidden rounded-2xl border border-line bg-soft">
            <img
              src={imagePreview}
              alt="Post preview"
              className="max-h-72 w-full object-contain"
            />
            <button
              type="button"
              onClick={removeImage}
              aria-label="Remove image"
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Hidden Image Input */}
        <input
          {...imageField}
          ref={(element) => {
            imageField.ref(element);
            fileInputRef.current = element;
          }}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        {/* Actions */}
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isPending}
            className="btn-ghost"
          >
            <ImagePlus size={18} />
            <span>{selectedImage ? "Change photo" : "Add photo"}</span>
          </button>

          <button
            type="submit"
            disabled={isPending || (!content.trim() && !selectedImage)}
            className="btn-primary px-7"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Post"
            )}
          </button>
        </div>

        {isError && (
          <p className="mt-3 text-sm text-[var(--like)]" role="alert">
            {getErrorMessage(error)}
          </p>
        )}
      </form>
    </div>
  );
}
