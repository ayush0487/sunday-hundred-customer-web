import type { AuthData, User } from "@/types/api.types";

export type StoredUser = User & {
  photoUrl: string | null;
};

const TOKEN_KEY = "token";
const USER_KEY = "user";

function hasWindow() {
  return typeof window !== "undefined";
}

function safeJsonParse<T>(value: string | null): T | null {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function loadUsers(): StoredUser[] {
  return [];
}

export function saveUsers(users: StoredUser[]) {
  void users;
}

function normalizeStoredUser(user: User): StoredUser {
  return {
    ...user,
    photoUrl: user.avatar ?? null,
  };
}

function readStoredUser(): StoredUser | null {
  if (!hasWindow()) {
    return null;
  }

  const parsed = safeJsonParse<User>(window.localStorage.getItem(USER_KEY));
  if (!parsed) {
    return null;
  }

  return normalizeStoredUser(parsed);
}

function decodeTokenUser(token: string): Partial<StoredUser> | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) {
      return null;
    }

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4), "=");
    const decoded = JSON.parse(atob(paddedPayload));
    return {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      phone: decoded.phone,
      role: decoded.role,
      avatar: decoded.avatar ?? null,
      photoUrl: decoded.avatar ?? null,
    };
  } catch {
    return null;
  }
}

function persistUser(user: StoredUser) {
  if (!hasWindow()) {
    return;
  }

  const { photoUrl, ...rest } = user;
  window.localStorage.setItem(
    USER_KEY,
    JSON.stringify({
      ...rest,
      avatar: photoUrl,
    })
  );
}

export function setAuthSession(authData: AuthData) {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.setItem(TOKEN_KEY, authData.token);
  persistUser(normalizeStoredUser(authData.user));
}

export function getAuthToken(): string | null {
  if (!hasWindow()) {
    return null;
  }

  return window.localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getAuthToken());
}

export function getCurrentUserEmail(): string | null {
  return getCurrentUser()?.email ?? null;
}

export function setCurrentUserEmail(email: string | null) {
  void email;
}

export function getCurrentUser(): StoredUser | null {
  const localUser = readStoredUser();
  if (localUser) {
    return localUser;
  }

  const token = getAuthToken();
  if (!token) {
    return null;
  }

  const decodedUser = decodeTokenUser(token);
  if (!decodedUser || !decodedUser.email) {
    return null;
  }

  const fallbackUser: StoredUser = {
    id: decodedUser.id ?? "",
    name: decodedUser.name ?? "",
    email: decodedUser.email,
    phone: decodedUser.phone ?? "",
    avatar: decodedUser.avatar ?? null,
    role: decodedUser.role ?? "customer",
    is_active: true,
    photoUrl: decodedUser.photoUrl ?? null,
    created_at: undefined,
  };

  persistUser(fallbackUser);
  return fallbackUser;
}

export function logout() {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.localStorage.removeItem("servx_current_user_email");
}

function randomId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function registerUser(input: {
  name: string;
  email: string;
  phone: string;
  password: string;
}): { ok: true } | { ok: false; error: string } {
  void input;
  return { ok: false, error: "Use API signup flow." };
}

export function login(input: {
  email: string;
  password: string;
}): { ok: true } | { ok: false; error: string } {
  void input;
  return { ok: false, error: "Use API login flow." };
}

export function updateCurrentUser(update: Partial<Omit<StoredUser, "id" | "email">>): { ok: true } | { ok: false; error: string } {
  const existingUser = getCurrentUser();
  if (!existingUser) {
    return { ok: false, error: "Not logged in." };
  }

  const next: StoredUser = {
    ...existingUser,
    ...update,
  };

  persistUser(next);

  return { ok: true };
}

export function updateCurrentUserEmail(newEmailRaw: string): { ok: true } | { ok: false; error: string } {
  const existingUser = getCurrentUser();
  if (!existingUser) {
    return { ok: false, error: "Not logged in." };
  }

  const nextEmail = newEmailRaw.trim().toLowerCase();
  if (!nextEmail) {
    return { ok: false, error: "Email cannot be empty." };
  }

  if (!nextEmail.includes("@")) {
    return { ok: false, error: "Please enter a valid email." };
  }

  persistUser({
    ...existingUser,
    email: nextEmail,
  });

  return { ok: true };
}
