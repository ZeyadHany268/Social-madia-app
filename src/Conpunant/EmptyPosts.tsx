import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

export default function EmptyPosts({
  title = "Nothing here yet",
  text = "When people share something, it will show up here.",
  icon,
  action,
}: {
  title?: string;
  text?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="surface card flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-brand-soft text-brand">
        {icon ?? <Inbox className="h-6 w-6" />}
      </div>
      <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{text}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
