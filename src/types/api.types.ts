// ── Common ──────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: string[];
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedData<T> {
  pagination: Pagination;
}

// ── Auth ────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  role: string;
  is_active: boolean;
  created_at?: string;
}

export interface AuthData {
  user: User;
  token: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// ── Business ────────────────────────────────────────────
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

export interface Business {
  id: string;
  name: string;
  description: string;
  rating: number;
  total_reviews: number;
  is_active: boolean;
  category_id: string;
  lat: number;
  long: number;
  category_name: string;
  city_name?: string;
  distance_km?: number;
  created_at: string;
  services?: Service[];
}

export interface FeaturedBusinessParams {
  page?: number;
  limit?: number;
  lat?: number;
  long?: number;
  category_id?: string | number;
  sort?: "top_rated" | "nearby" | "popular";
  min_rating?: number;
  max_distance?: number;
}

export interface FeaturedBusinessData {
  businesses: Business[];
  pagination: Pagination;
}

export interface BusinessDetailParams {
  lat?: number;
  long?: number;
}

// ── Review ──────────────────────────────────────────────
export interface Review {
  id: string;
  user_id: string;
  business_id: string;
  rating: number;
  comment: string;
  reply?: string | null;
  replied_at?: string | null;
  reviewer_name?: string;
  reviewer_avatar?: string | null;
  user_name?: string;
  user_avatar?: string | null;
  created_at: string;
}

export interface ReviewParams {
  page?: number;
  limit?: number;
}

export interface ReviewData {
  reviews: Review[];
  pagination: Pagination;
}

// ── Category ────────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

// ── City ────────────────────────────────────────────────
export interface City {
  id: string;
  name: string;
  slug: string;
  state: string;
  country: string;
  launched_at: string;
}
