import type { User } from "./User.type";

export interface PostData {
  _id: string;
  body: string;
  image?: string | null;
  privacy: "public" | "private" | string;
  user: User;
  sharedPost?: PostData | null;
  likes: Array<string | { _id: string }>;
  createdAt: string;
  commentsCount: number;
  topComment?: any;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  id: string;
  bookmarked: boolean;
}

export interface PostCardProps {
  post: PostData;
  isSinglePost?: boolean;
}
