
export const ENDPOINTS = {
  // Auth
  SIGNUP_REQUEST_OTP: "/users/signup/request-otp",
  SIGNUP: "/users/signup",
  LOGIN: "/users/login",

  // Business
  FEATURED_BUSINESSES: "/business/getAllFeatureBusiness",
  BUSINESS_BY_ID: (id: string | number) => `/business/getBusinessById/${id}`,

  // Offers
  OFFERS_BY_BUSINESS: (businessId: string | number) => `/offers/business/${businessId}`,
  OFFERS_RANDOM: "/offers/random",

  // Reviews
  REVIEWS: (businessId: string | number) => `/reviews/${businessId}`,
  REVIEWS_BY_USER: (userId: string | number) => `/reviews/user/${userId}`,
  CREATE_REVIEW: "/reviews/create",

  // Categories
  CATEGORIES: "/categories/",

  // Cities
  CITIES: "/cities/",
} as const;
