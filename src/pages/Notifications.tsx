/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck, Heart, MessageCircle, Repeat2, UserPlus, AtSign } from "lucide-react";
import Avatar from "../Conpunant/Avatar";
import EmptyPosts from "../Conpunant/EmptyPosts";
import ErrorState from "../Conpunant/ErrorState";
import { getNotifications, markAllNotificationsRead, markNotificationRead } from "../api/notifications";
import { idOf, listFrom } from "../api/parse";
import { getErrorMessage } from "../api/client";
import { formatDate } from "../utils/formatDate";

// The API doesn't document the notification shape, so read it defensively.
function describe(n: any) {
  const actor = n.sender ?? n.actor ?? n.from ?? n.user ?? n.fromUser ?? null;
  const type = String(n.type ?? n.action ?? "").toLowerCase();
  const name = actor?.name ?? "Someone";

  const map: Record<string, { text: string; icon: typeof Heart; tone: string }> = {
    like: { text: "liked your post", icon: Heart, tone: "text-[var(--like)] bg-[var(--like)]/10" },
    comment: { text: "commented on your post", icon: MessageCircle, tone: "text-brand bg-brand-soft" },
    reply: { text: "replied to your comment", icon: MessageCircle, tone: "text-brand bg-brand-soft" },
    follow: { text: "started following you", icon: UserPlus, tone: "text-[var(--ok)] bg-[var(--ok)]/10" },
    share: { text: "shared your post", icon: Repeat2, tone: "text-brand bg-brand-soft" },
    mention: { text: "mentioned you", icon: AtSign, tone: "text-brand bg-brand-soft" },
  };
  const key = Object.keys(map).find((k) => type.includes(k));
  const meta = key ? map[key] : { text: "", icon: Bell, tone: "text-brand bg-brand-soft" };

  const message: string | undefined = n.message ?? n.text ?? n.content ?? n.body;
  return {
    actor,
    name,
    Icon: meta.icon,
    tone: meta.tone,
    // Prefer our own wording when we know the type; otherwise show the server's message as-is
    text: meta.text ? `${meta.text}` : (message ?? "sent you a notification"),
    showName: !!meta.text || !message?.includes(name),
    postId: idOf(n.post ?? n.postId ?? n.entityId ?? n.target),
    read: Boolean(n.isRead ?? n.read ?? n.seen),
  };
}

export default function Notifications() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(false),
    select: (res) => listFrom<any>(res, ["notifications"]),
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({ queryKey: ["unreadCount"] });
  };

  const readOne = useMutation({ mutationFn: markNotificationRead, onSuccess: refresh });
  const readAll = useMutation({ mutationFn: markAllNotificationsRead, onSuccess: refresh });

  const unread = (data ?? []).filter((n) => !describe(n).read).length;

  return (
    <div className="mx-auto max-w-xl space-y-4 px-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Notifications</h1>
          <p className="mt-1 text-sm text-muted">{unread > 0 ? `${unread} unread` : "You're all caught up."}</p>
        </div>
        <button type="button" className="btn-ghost" disabled={unread === 0 || readAll.isPending} onClick={() => readAll.mutate()}>
          <CheckCheck size={16} /> Mark all read
        </button>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-[74px] rounded-3xl" />
          ))}
        </div>
      )}

      {isError && <ErrorState title="Couldn't load notifications" message={getErrorMessage(error)} onRetry={() => refetch()} />}

      {data && data.length === 0 && (
        <EmptyPosts icon={<Bell className="h-6 w-6" />} title="No notifications yet" text="Likes, comments and new followers will show up here." />
      )}

      <ul className="space-y-2">
        {data?.map((n) => {
          const d = describe(n);
          const open = () => {
            if (!d.read) readOne.mutate(n._id);
            if (d.postId) navigate(`/getsinglePost/${d.postId}`);
            else if (d.actor?._id) navigate(`/users/${d.actor._id}`);
          };
          return (
            <li key={n._id}>
              <button
                type="button"
                onClick={open}
                className={`surface flex w-full items-center gap-3 rounded-3xl p-3.5 text-left transition hover:shadow-[var(--shadow-pop)] ${
                  d.read ? "" : "!border-[var(--brand)]/40 bg-brand-soft/40"
                }`}
              >
                <span className="relative shrink-0">
                  <Avatar src={d.actor?.photo} name={d.name} size={46} />
                  <span className={`absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full border-2 border-[var(--surface)] ${d.tone}`}>
                    <d.Icon className="h-3 w-3" fill={d.Icon === Heart ? "currentColor" : "none"} />
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm text-ink">
                    {d.showName && (
                      <Link
                        to={d.actor?._id ? `/users/${d.actor._id}` : "#"}
                        onClick={(e) => e.stopPropagation()}
                        className="font-semibold hover:underline"
                      >
                        {d.name}
                      </Link>
                    )}{" "}
                    {d.text}
                  </span>
                  <time className="text-xs text-muted">{formatDate(n.createdAt)}</time>
                </span>
                {!d.read && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--brand)]" aria-label="Unread" />}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
