import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearAuth,
  getStoredUser,
  getToken,
  saveAuth,
} from "../lib/storage";
import type { AuthUser } from "../types/auth";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  const [token, setToken] = useState<string | null>(() => getToken());

  function login(newToken: string, newUser: AuthUser) {
    saveAuth(newToken, newUser);
    setToken(newToken);
    setUser(newUser);
  }

  function logout() {
    clearAuth();
    setToken(null);
    setUser(null);
  }

  useEffect(() => {
    function handleUnauthorized() {
      logout();
    }

    window.addEventListener(
      "online-library:unauthorized",
      handleUnauthorized,
    );

    return () => {
      window.removeEventListener(
        "online-library:unauthorized",
        handleUnauthorized,
      );
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
    }),
    [token, user],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}