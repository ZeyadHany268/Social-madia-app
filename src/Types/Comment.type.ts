import type { User } from "./User.type";

export interface CommentData {
  _id: string;
  content: string;
  commentCreator: User;
  image?: string | null;
  post: string;
  parentComment: any;
  likes: Array<string | { _id: string }>;
  repliesCount?: number;
  createdAt: string;
}
