export const defaultUserProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "123-456-7890",
  photoUrl: null,
};

export type UserProfile = typeof defaultUserProfile;

export function getUserProfile(): UserProfile {
  return defaultUserProfile;
}

export function saveUserProfile(profile: UserProfile) {
  // This is a mock implementation.
  // In a real application, you would save this to a database.
  console.log("Saving user profile:", profile);
}