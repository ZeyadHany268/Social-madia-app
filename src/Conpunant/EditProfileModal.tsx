import { useContext, useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Camera, Check, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import Modal from "./Modal";
import Avatar from "./Avatar";
import { useUser } from "../Context/UserContext";
import { TokenContext } from "../Context/TokenContext";
import { changePassword, uploadPhoto } from "../api/users";
import { getErrorMessage } from "../api/client";
import { payload } from "../api/parse";
import toast from "react-hot-toast";

export default function EditProfileModal({ onClose }: { onClose: () => void }) {
  const { user } = useUser();
  const { setToken } = useContext(TokenContext);
  const queryClient = useQueryClient();

  /* ---------- Photo ---------- */
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const photoMutation = useMutation({
    mutationFn: () => {
      const formData = new FormData();
      formData.append("photo", file as File);
      return uploadPhoto(formData);
    },
    onSuccess: async (res) => {
      toast.success(res.data.message);
      await queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
      setFile(null);
    },
  });

  /* ---------- Password ---------- */
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);

  const mismatch = confirm.length > 0 && next !== confirm;
  const tooShort = next.length > 0 && next.length < 8;
  const canChange = current && next.length >= 8 && next === confirm;

  const passwordMutation = useMutation({
    mutationFn: () => changePassword({ password: current, newPassword: next }),
    onSuccess: (res) => {
      // The API returns a refreshed token — keep the user signed in
      const token = payload(res)?.token;
      if (token) {
        localStorage.setItem("token", token);
        setToken(token);
      }
      setCurrent("");
      setNext("");
      setConfirm("");
    },
  });

  return (
    <Modal title="Edit profile" description="Update your photo and password" onClose={onClose} busy={photoMutation.isPending || passwordMutation.isPending}>
      {/* Photo */}
      <section aria-label="Profile photo">
        <h3 className="text-sm font-semibold text-ink">Profile photo</h3>
        <div className="mt-3 flex items-center gap-4 rounded-2xl bg-soft p-4">
          <Avatar src={preview ?? user?.photo} name={user?.name} size={64} ring />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">{user?.name}</p>
            <p className="truncate text-xs text-muted">{file ? file.name : "JPG or PNG"}</p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <button type="button" className="btn-ghost" onClick={() => fileRef.current?.click()}>
            <Camera size={16} /> Choose
          </button>
        </div>

        {photoMutation.isError && (
          <p role="alert" className="mt-2 text-sm text-[var(--like)]">
            {getErrorMessage(photoMutation.error)}
          </p>
        )}
        {photoMutation.isSuccess && !file && (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-[var(--ok)]">
            <Check size={15} /> Photo updated
          </p>
        )}
        {file && (
          <button type="button" className="btn-primary mt-3" disabled={photoMutation.isPending} onClick={() => photoMutation.mutate()}>
            {photoMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
              </>
            ) : (
              "Save photo"
            )}
          </button>
        )}
      </section>

      {/* Password */}
      <section aria-label="Change password" className="mt-6 border-t border-line pt-5">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
          <KeyRound size={16} className="text-muted" /> Change password
        </h3>
        <form
          className="mt-3 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (canChange) passwordMutation.mutate();
          }}
        >
          <input type={show ? "text" : "password"} autoComplete="current-password" placeholder="Current password" value={current} onChange={(e) => setCurrent(e.target.value)} className="input" />
          <div className="relative">
            <input type={show ? "text" : "password"} autoComplete="new-password" placeholder="New password (8+ characters)" value={next} onChange={(e) => setNext(e.target.value)} className="input !pr-11" />
            <button type="button" aria-label={show ? "Hide passwords" : "Show passwords"} onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink">
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {tooShort && <p className="text-xs text-[var(--like)]">Use at least 8 characters.</p>}
          <input type={show ? "text" : "password"} autoComplete="new-password" placeholder="Confirm new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="input" />
          {mismatch && <p className="text-xs text-[var(--like)]">Passwords don't match.</p>}

          {passwordMutation.isError && (
            <p role="alert" className="text-sm text-[var(--like)]">
              {getErrorMessage(passwordMutation.error)}
            </p>
          )}
          {passwordMutation.isSuccess && (
            <p className="flex items-center gap-1.5 text-sm text-[var(--ok)]">
              <Check size={15} /> Password changed
            </p>
          )}

          <button type="submit" className="btn-primary" disabled={!canChange || passwordMutation.isPending}>
            {passwordMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Updating...
              </>
            ) : (
              "Update password"
            )}
          </button>
        </form>
      </section>
    </Modal>
  );
}
