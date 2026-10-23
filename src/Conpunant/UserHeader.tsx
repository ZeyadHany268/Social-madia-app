import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { User } from "../Types/User.type";
import { formatDate } from "../utils/formatDate";
import { useUser } from "../Context/UserContext";
import Avatar from "./Avatar";

export default function UserHeader({
  user,
  createdAt,
  onEdit,
  onDelete,
}: {
  user: User;
  createdAt: string;
  // Passing these shows the owner menu (only the post owner gets them)
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const { user: me } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const showMenu = !!(onEdit || onDelete);
  const profileLink = me?._id === user._id ? "/profile" : `/users/${user._id}`;

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <div className="flex items-start justify-between gap-3 px-5 pt-5">
      <Link to={profileLink} className="group flex min-w-0 items-center gap-3">
        <Avatar src={user.photo} name={user.name} size={44} />
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-semibold text-ink group-hover:underline">{user.name}</h3>
          <div className="flex items-center gap-1.5 text-[13px] text-muted">
            <span className="truncate">@{user.username}</span>
            <span>·</span>
            <time className="shrink-0">{formatDate(createdAt)}</time>
          </div>
        </div>
      </Link>

      {showMenu && (
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            aria-label="Post options"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="action !h-9 !w-9 !justify-center !px-0"
          >
            <MoreHorizontal className="h-[18px] w-[18px]" />
          </button>

          {menuOpen && (
            <div role="menu" className="surface absolute right-0 top-11 z-20 w-44 overflow-hidden rounded-2xl p-1.5 shadow-[var(--shadow-pop)]">
              {onEdit && (
                <button
                  role="menuitem"
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-ink transition hover:bg-[var(--surface-2)]"
                >
                  <Pencil className="h-4 w-4 text-muted" />
                  Edit post
                </button>
              )}
              {onDelete && (
                <button
                  role="menuitem"
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-[var(--like)] transition hover:bg-[var(--like)]/10"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete post
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
