import { createContext, useContext, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { TokenContext } from "./TokenContext";
import { getMyProfile } from "../api/users";
import type { UserProfile } from "../Types/userProfile.type";

type UserContextType = {
  user: UserProfile | null;
  isLoading: boolean;
  isError: boolean;
  refetchUser: () => void;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: false,
  isError: false,
  refetchUser: () => {},
});

// Holds the logged-in user's data. Fetched once and shared across the app.
export function UserContextProvider({ children }: { children: ReactNode }) {
  const { token } = useContext(TokenContext);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["myProfile", token],
    queryFn: getMyProfile,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    select: (response) => response.data.data.user,
  });

  return (
    <UserContext.Provider
      value={{
        user: token ? (data ?? null) : null,
        isLoading: !!token && isLoading,
        isError,
        refetchUser: () => {
          refetch();
        },
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
  return useContext(UserContext);
}
