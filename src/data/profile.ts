import { getCurrentUser, updateCurrentUser, updateCurrentUserEmail } from "@/lib/auth";

export const defaultUserProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "123-456-7890",
  photoUrl: null,
};

export type UserProfile = typeof defaultUserProfile;

export function getUserProfile(): UserProfile {
  const currentUser = getCurrentUser();
  console.log("Loaded user profile:", currentUser);
  if (!currentUser) {
    return defaultUserProfile;
  }

  return {
    name: currentUser.name || defaultUserProfile.name,
    email: currentUser.email || defaultUserProfile.email,
    phone: currentUser.phone || defaultUserProfile.phone,
    photoUrl: currentUser.photoUrl ?? null,
  };
}

export function saveUserProfile(profile: UserProfile) {
  const currentUser = getCurrentUser();

  if (currentUser && profile.email && profile.email.trim().toLowerCase() !== currentUser.email.toLowerCase()) {
    updateCurrentUserEmail(profile.email);
  }

  updateCurrentUser({
    name: profile.name,
    phone: profile.phone,
    photoUrl: profile.photoUrl ?? null,
  });
}