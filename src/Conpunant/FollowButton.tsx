import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, UserPlus } from "lucide-react";
import { useUser } from "../Context/UserContext";
import { toggleFollow } from "../api/users";
import { hasId } from "../api/parse";

export default function FollowButton({ userId }: { userId: string }) {
  const { user: me } = useUser();
  const queryClient = useQueryClient();
  const [override, setOverride] = useState<boolean | null>(null);

  const serverFollowing = hasId(me?.following, userId);
  const following = override ?? serverFollowing;

  const { mutate, isPending } = useMutation({
    mutationFn: () => toggleFollow(userId),
    onMutate: () => setOverride(!following),
    onError: () => setOverride(null),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      setOverride(null);
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
      queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
    },
  });

  if (!me || me._id === userId) return null;

  return (
    <button
      type="button"
      className="btn-follow"
      data-following={following}
      disabled={isPending}
      onClick={() => mutate()}
    >
      {following ? (
        <>
          <Check size={14} /> Following
        </>
      ) : (
        <>
          <UserPlus size={14} /> Follow
        </>
      )}
    </button>
  );
}
