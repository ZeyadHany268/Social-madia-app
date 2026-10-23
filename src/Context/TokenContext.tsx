import { createContext, useState } from "react";

type TokenContextType = {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
};

export const TokenContext = createContext<TokenContextType>({
  token: null,
  setToken: () => {},
});

export function TokenContextProvider({ children }: { children: React.ReactNode }) {
      const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));

  
  return (


    <TokenContext.Provider value={{ token, setToken }}>
      {children}
    </TokenContext.Provider>
  );
}
