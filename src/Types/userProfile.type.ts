

export interface UserProfile {
  _id: string;
  id: string;

  name: string;
  username: string;
  email: string;

  dateOfBirth: string;
  gender: "male" | "female";

  photo: string;
  cover: string;

  bookmarks: string[];
  followers: string[];
  following: string[];

  createdAt: string;

  followersCount: number;
  followingCount: number;
  bookmarksCount: number;
}

export interface UserData {
  user: UserProfile;
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: UserData;
}

