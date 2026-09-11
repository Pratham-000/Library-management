import type { AuthUser } from "../types/auth";

const TOKEN_KEY = "Online_Library_Token";
const USER_KEY = "online_library_user";

export function saveAuth(token:string,user:AuthUser) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken() : string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
    const rawUser = localStorage.getItem(USER_KEY);

    if (!rawUser) return null;

    try {
        return JSON.parse(rawUser) as AuthUser;
    } catch {
        clearAuth();
        return null;
    }
}

export function clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}