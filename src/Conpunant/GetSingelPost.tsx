import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ErrorState from "./ErrorState";
import LoadingPosts from "./LoadingPosts";
import PostCard from "./PostCard";
import { getSinglePost } from "../api/posts";
import { getErrorMessage } from "../api/client";

export default function GetSinglePost() {
  const { id } = useParams();

  const { data, isError, isLoading, error, refetch } = useQuery({
    queryKey: ["getSinglePost", id],
    queryFn: () => getSinglePost(id!),
    enabled: !!id,
  });

  const post = data?.data?.data?.post;

  return (
    <div className="mx-auto max-w-xl space-y-4 px-4 py-6">
      {isLoading && <LoadingPosts />}
      {isError && <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />}
      {post && <PostCard key={post._id} post={post} isSinglePost />}
    </div>
  );
}
