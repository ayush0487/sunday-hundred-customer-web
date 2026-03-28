
export const ENDPOINTS = {
  // Auth
  SIGNUP: "/users/signup",
  LOGIN: "/users/login",

  // Business
  FEATURED_BUSINESSES: "/business/getAllFeatureBusiness",
  BUSINESS_BY_ID: (id: string | number) => `/business/getBusinessById/${id}`,

  // Reviews
  REVIEWS: (businessId: string | number) => `/reviews/${businessId}`,

  // Categories
  CATEGORIES: "/categories/",

  // Cities
  CITIES: "/cities/",
} as const;
