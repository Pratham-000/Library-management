import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { apiClient, setAccessTokenProvider } from "../api/client";
import type { AuthUser } from "../types/auth";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const {
    isAuthenticated: auth0Authenticated,
    isLoading: auth0Loading,
    error: auth0Error,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently,
  } = useAuth0();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    setAccessTokenProvider(
      auth0Authenticated
        ? async () => (await getAccessTokenSilently()) ?? null
        : null,
    );

    return () => setAccessTokenProvider(null);
  }, [auth0Authenticated, getAccessTokenSilently]);

  useEffect(() => {
    let cancelled = false;

    async function hydrateUser() {
      if (!auth0Authenticated) {
        if (!cancelled) {
          setUser(null);
          setToken(null);
          setProfileLoading(false);
        }
        return;
      }

      setProfileLoading(true);

      try {
        const accessToken =
          (await getAccessTokenSilently()) ?? null;

        if (!accessToken) {
          throw new Error("No access token returned by Auth0");
        }

        const currentUser = await apiClient<AuthUser>("/auth/me", {
          method: "GET",
          auth: true,
          token: accessToken,
        });

        if (!cancelled) {
          setToken(accessToken);
          setUser(currentUser);
        }
      } catch (error) {
        if (!cancelled) {
          setUser(null);
          setToken(null);
          console.error("Unable to hydrate application user:", error);
        }
      } finally {
        if (!cancelled) {
          setProfileLoading(false);
        }
      }
    }

    void hydrateUser();

    return () => {
      cancelled = true;
    };
  }, [auth0Authenticated, getAccessTokenSilently]);

  async function login() {
    await loginWithRedirect({
      appState: {
        returnTo: window.location.pathname,
      },
      authorizationParams: {
        connection:
          import.meta.env.VITE_AUTH0_GOOGLE_CONNECTION ||
          "google-oauth2",
      },
    });
  }

  function logout() {
    setUser(null);
    setToken(null);

    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: auth0Authenticated && Boolean(user),
      isLoading: auth0Loading || profileLoading,
      login,
      logout,
    }),
    [user, token, auth0Authenticated, auth0Loading, profileLoading],
  );

  if (auth0Error) {
    console.error("Auth0 error:", auth0Error);
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}