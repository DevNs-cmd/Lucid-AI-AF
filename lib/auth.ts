import type { AdminUser, Role } from "@/types";

const SESSION_KEY = "lucid_admin_session";

const DEMO_ACCOUNTS: Record<string, { password: string; user: AdminUser }> = {
  "admin@lucid.ai": {
    password: "arcane123",
    user: { id: "usr_1000", name: "High Warden", email: "admin@lucid.ai", role: "admin" },
  },
};

export function login(email: string, password: string): AdminUser | null {
  const account = DEMO_ACCOUNTS[email.toLowerCase()];
  if (!account || account.password !== password) return null;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(account.user));
    document.cookie = `${SESSION_KEY}=${account.user.role}; path=/; max-age=86400`;
  }
  return account.user;
}

export function logout(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(SESSION_KEY);
    document.cookie = `${SESSION_KEY}=; path=/; max-age=0`;
  }
}

export function getSession(): AdminUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

export function hasRole(user: AdminUser | null, role: Role): boolean {
  return !!user && user.role === role;
}

export function isAdmin(user: AdminUser | null): boolean {
  return hasRole(user, "admin");
}
