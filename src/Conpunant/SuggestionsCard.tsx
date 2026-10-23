import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { getSuggestions } from "../api/users";
import { listFrom } from "../api/parse";
import { useUser } from "../Context/UserContext";
import FollowButton from "./FollowButton";
import Avatar from "./Avatar";
import type { User } from "../Types/User.type";

export default function SuggestionsCard() {
  const { user: me } = useUser();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["suggestions"],
    queryFn: () => getSuggestions(6),
    select: (res) => listFrom<User>(res, ["suggestions", "users"]),
  });

  const people = (data ?? []).filter((u) => u._id !== me?._id);
  if (isError || (!isLoading && people.length === 0)) return null;

  return (
    <section className="surface card p-5" aria-label="People you may know">
      <h2 className="flex items-center gap-2 font-display text-base font-bold text-ink">
        <Sparkles className="h-4 w-4 text-brand" /> People you may know
      </h2>

      <ul className="mt-4 space-y-4">
        {isLoading &&
          [1, 2, 3].map((i) => (
            <li key={i} className="flex items-center gap-3">
              <div className="skeleton h-10 w-10 rounded-full" />
              <div className="skeleton h-4 flex-1 rounded-full" />
            </li>
          ))}

        {people.map((u) => (
          <li key={u._id} className="flex items-center justify-between gap-3">
            <Link to={`/users/${u._id}`} className="flex min-w-0 items-center gap-3">
              <Avatar src={u.photo} name={u.name} size={40} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink hover:underline">{u.name}</p>
                <p className="truncate text-xs text-muted">@{u.username}</p>
              </div>
            </Link>
            <FollowButton userId={u._id} />
          </li>
        ))}
      </ul>
    </section>
  );
}
