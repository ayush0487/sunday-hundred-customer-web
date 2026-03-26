export type StoredUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  photoUrl: string | null;
};

const USERS_KEY = "servx_users";
const SESSION_KEY = "servx_current_user_email";

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
  if (!hasWindow()) {
    return [];
  }

  const users = safeJsonParse<StoredUser[]>(window.localStorage.getItem(USERS_KEY));
  return Array.isArray(users) ? users : [];
}

export function saveUsers(users: StoredUser[]) {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUserEmail(): string | null {
  if (!hasWindow()) {
    return null;
  }

  const email = window.localStorage.getItem(SESSION_KEY);
  return email ? email : null;
}

export function setCurrentUserEmail(email: string | null) {
  if (!hasWindow()) {
    return;
  }

  if (!email) {
    window.localStorage.removeItem(SESSION_KEY);
    return;
  }

  window.localStorage.setItem(SESSION_KEY, email);
}

export function getCurrentUser(): StoredUser | null {
  const email = getCurrentUserEmail();
  if (!email) {
    return null;
  }

  const users = loadUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export function logout() {
  setCurrentUserEmail(null);
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
  if (!hasWindow()) {
    return { ok: false, error: "Registration is only available in the browser." };
  }

  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const phone = input.phone.trim();
  const password = input.password;

  if (!name || !email || !phone || !password) {
    return { ok: false, error: "Please fill all fields." };
  }

  const users = loadUsers();
  const exists = users.some((u) => u.email.toLowerCase() === email);
  if (exists) {
    return { ok: false, error: "An account with this email already exists." };
  }

  const newUser: StoredUser = {
    id: randomId(),
    name,
    email,
    phone,
    password,
    photoUrl: null,
  };

  saveUsers([newUser, ...users]);
  setCurrentUserEmail(email);

  return { ok: true };
}

export function login(input: {
  email: string;
  password: string;
}): { ok: true } | { ok: false; error: string } {
  if (!hasWindow()) {
    return { ok: false, error: "Login is only available in the browser." };
  }

  const email = input.email.trim().toLowerCase();
  const password = input.password;

  if (!email || !password) {
    return { ok: false, error: "Please enter your email and password." };
  }

  const users = loadUsers();
  const user = users.find((u) => u.email.toLowerCase() === email);

  if (!user || user.password !== password) {
    return { ok: false, error: "Invalid email or password." };
  }

  setCurrentUserEmail(user.email);
  return { ok: true };
}

export function updateCurrentUser(update: Partial<Omit<StoredUser, "id" | "email">>): { ok: true } | { ok: false; error: string } {
  if (!hasWindow()) {
    return { ok: false, error: "Update is only available in the browser." };
  }

  const email = getCurrentUserEmail();
  if (!email) {
    return { ok: false, error: "Not logged in." };
  }

  const users = loadUsers();
  const index = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());

  if (index === -1) {
    return { ok: false, error: "User not found." };
  }

  const existing = users[index];
  const next: StoredUser = {
    ...existing,
    ...update,
  };

  const nextUsers = [...users];
  nextUsers[index] = next;
  saveUsers(nextUsers);

  return { ok: true };
}

export function updateCurrentUserEmail(newEmailRaw: string): { ok: true } | { ok: false; error: string } {
  if (!hasWindow()) {
    return { ok: false, error: "Update is only available in the browser." };
  }

  const currentEmail = getCurrentUserEmail();
  if (!currentEmail) {
    return { ok: false, error: "Not logged in." };
  }

  const nextEmail = newEmailRaw.trim().toLowerCase();
  if (!nextEmail) {
    return { ok: false, error: "Email cannot be empty." };
  }

  if (!nextEmail.includes("@")) {
    return { ok: false, error: "Please enter a valid email." };
  }

  const users = loadUsers();
  const currentIndex = users.findIndex((u) => u.email.toLowerCase() === currentEmail.toLowerCase());
  if (currentIndex === -1) {
    return { ok: false, error: "User not found." };
  }

  const exists = users.some((u, i) => i !== currentIndex && u.email.toLowerCase() === nextEmail);
  if (exists) {
    return { ok: false, error: "An account with this email already exists." };
  }

  const nextUsers = [...users];
  nextUsers[currentIndex] = {
    ...nextUsers[currentIndex],
    email: nextEmail,
  };
  saveUsers(nextUsers);
  setCurrentUserEmail(nextEmail);

  return { ok: true };
}
