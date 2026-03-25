export type UserProfile = {
  name: string;
  phone: string;
  email: string;
  photoUrl: string | null;
};

const STORAGE_KEY = "servx-user-profile";

export const defaultUserProfile: UserProfile = {
  name: "Arjun Patel",
  phone: "+91 98765 43210",
  email: "arjun.patel@email.com",
  photoUrl: null,
};

export function getUserProfile(): UserProfile {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return defaultUserProfile;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<UserProfile>;

    return {
      ...defaultUserProfile,
      ...parsed,
      photoUrl: typeof parsed.photoUrl === "string" ? parsed.photoUrl : null,
    };
  } catch {
    return defaultUserProfile;
  }
}

export function saveUserProfile(profile: UserProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}