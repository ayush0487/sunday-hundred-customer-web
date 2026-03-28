# Sunday Hundred - API Architecture Documentation

## Overview

This project uses a **3-layer API architecture** to connect the Next.js frontend with the backend server. Every API call flows through these layers in order:

```
Page/Component  -->  Hook  -->  Service  -->  Axios Instance  -->  Backend Server
     (UI)        (React Query)  (functions)   (HTTP client)        (Railway)
```

---

## Folder Structure

```
src/
├── api/                          # Layer 1: HTTP Client Setup
│   ├── axios.ts                  # Client-side axios instance (runs in browser)
│   ├── server.ts                 # Server-side axios instance (runs in getServerSideProps)
│   └── endpoints.ts              # All API endpoint URLs in one place
│
├── services/                     # Layer 2: API Call Functions
│   ├── auth.service.ts           # Login, Signup
│   ├── business.service.ts       # Featured businesses, Business by ID
│   ├── review.service.ts         # Reviews by business
│   ├── category.service.ts       # All categories
│   └── city.service.ts           # All cities
│
├── hooks/                        # Layer 3: React Hooks (used in components)
│   ├── useAuth.ts                # useLogin(), useSignup()
│   ├── useBusiness.ts            # useFeaturedBusinesses(), useBusinessById()
│   ├── useReviews.ts             # useReviews()
│   ├── useCategories.ts          # useCategories()
│   ├── useCities.ts              # useCities()
│   └── useGeolocation.ts         # useGeolocation() — user's lat/long
│
└── types/
    └── api.types.ts              # All TypeScript interfaces for API data
```

---

## Layer 1: Axios Instances (`src/api/`)

### `axios.ts` — Client-Side (Browser)

- Used by **hooks** and **services** for client-side API calls
- Automatically attaches JWT token from `localStorage` to every request
- Handles errors and returns clean error messages
- Base URL: configured for the backend server

```
Browser Request Flow:
User clicks something → Hook calls Service → Service uses this axios → Request goes to backend
                                                    ↓
                                          Token auto-attached from localStorage
```

### `server.ts` — Server-Side (Node.js)

- Used inside `getServerSideProps()` for SSR (Server-Side Rendering)
- Does NOT have token/localStorage (because it runs on server, not browser)
- Purpose: Fetch data on server so HTML is pre-rendered with content (for SEO)

```
SSR Request Flow:
Google bot visits page → Next.js server runs getServerSideProps → serverApi calls backend →
Full HTML with data sent to browser (Google can read it = good SEO)
```

### `endpoints.ts` — URL Builder

All API endpoint paths defined in one place. If backend changes a URL, update only here.

```typescript
ENDPOINTS.SIGNUP                    → "/users/signup"
ENDPOINTS.LOGIN                     → "/users/login"
ENDPOINTS.FEATURED_BUSINESSES       → "/business/getAllFeatureBusiness"
ENDPOINTS.BUSINESS_BY_ID(id)        → "/business/getBusinessById/5"
ENDPOINTS.REVIEWS(businessId)       → "/reviews/5"
ENDPOINTS.CATEGORIES                → "/categories/"
ENDPOINTS.CITIES                    → "/cities/"
```

---

## Layer 2: Services (`src/services/`)

Services are **plain functions** that call the axios instance with the correct endpoint. They don't know about React — they just make HTTP requests.

| Service File | Functions | HTTP Method | Endpoint |
|---|---|---|---|
| `auth.service.ts` | `signup(payload)` | POST | `/users/signup` |
| `auth.service.ts` | `login(payload)` | POST | `/users/login` |
| `business.service.ts` | `getFeatured(params)` | GET | `/business/getAllFeatureBusiness` |
| `business.service.ts` | `getById(id, params)` | GET | `/business/getBusinessById/:id` |
| `review.service.ts` | `getByBusiness(id, params)` | GET | `/reviews/:business_id` |
| `category.service.ts` | `getAll()` | GET | `/categories/` |
| `city.service.ts` | `getAll()` | GET | `/cities/` |

### Example — How a service works:

```typescript
// business.service.ts
export const businessService = {
  getFeatured(params) {
    // This calls: GET {BASE_URL}/business/getAllFeatureBusiness?page=1&limit=6
    return api.get(ENDPOINTS.FEATURED_BUSINESSES, { params });
  },
};
```

---

## Layer 3: React Hooks (`src/hooks/`)

Hooks are what **components actually use**. They wrap services with **TanStack React Query** which provides:
- Automatic caching
- Loading/error states
- Background refetching
- SSR initial data support

| Hook | Returns | Used In |
|---|---|---|
| `useLogin()` | `{ mutate, isPending, error }` | `/login` page |
| `useSignup()` | `{ mutate, isPending, error }` | `/signup` page |
| `useFeaturedBusinesses(params, initialData?)` | `{ data, isLoading }` | Homepage, Categories page |
| `useBusinessById(id, params, initialData?)` | `{ data, isLoading }` | Business detail page |
| `useReviews(businessId, params, initialData?)` | `{ data, isLoading }` | Business detail page |
| `useCategories(initialData?)` | `{ data, isLoading }` | Homepage, Categories page |
| `useCities(initialData?)` | `{ data, isLoading }` | (available for future use) |
| `useGeolocation()` | `{ location, loading, error }` | Homepage, Categories, Business Detail |

### `initialData` parameter — SSR + Client Hybrid

Hooks accept `initialData` which comes from `getServerSideProps`. This means:

1. **Server fetches data** → sends full HTML (SEO friendly)
2. **Browser receives HTML** → already has content (fast first paint)
3. **React Query uses initialData** → no extra API call on first load
4. **After staleTime (60s)** → React Query refetches in background for fresh data

```typescript
// In a page component:
const { data } = useFeaturedBusinesses(
  { page: 1, limit: 6 },     // params
  ssrData                      // initialData from getServerSideProps
);
```

---

## Geolocation Flow

User ka lat/long har business API call mein bheja jaata hai. Iske bina `distance_km` nahi milega aur `nearby` sort kaam nahi karega.

```
Page loads → useGeolocation() runs
                ↓
    Browser asks "Allow location?"
                ↓
    ┌─── User allows ──────────────────────┐
    │   lat/long saved in state             │
    │   + cached in localStorage (10 min)   │
    │           ↓                           │
    │   useFeaturedBusinesses({             │
    │     lat: 28.61, long: 77.20, ...     │
    │   })                                  │
    │   → Backend returns distance_km       │
    │   → "Nearby" sort works              │
    └───────────────────────────────────────┘
    ┌─── User denies ──────────────────────┐
    │   location = null                     │
    │   API called without lat/long         │
    │   → No distance_km in response       │
    │   → "Nearby" sort won't work         │
    │   → Everything else works fine        │
    └───────────────────────────────────────┘
```

### Where lat/long is sent:

| Page | API Call | lat/long |
|---|---|---|
| Homepage (`/`) | `getAllFeatureBusiness` | Yes — shows nearest businesses first |
| Categories (`/categories`) | `getAllFeatureBusiness` | Yes — enables distance filter + nearby sort |
| Business Detail (`/business/[id]`) | `getBusinessById` | Yes — shows "2.3 km away" |

### SSR vs Client lat/long:

- **SSR (getServerSideProps)**: Cannot access browser geolocation. Data fetched **without** lat/long.
- **Client (after hydration)**: `useGeolocation()` gets lat/long → React Query **refetches** with lat/long → UI updates with distances.

This means: Google sees business data without distances (still SEO friendly), but real users see distances after a quick refetch.

---

## Page-wise Integration Map

### Homepage (`/`)

```
getServerSideProps
  ├── serverApi.get("/business/getAllFeatureBusiness")  → ssrBusinesses
  └── serverApi.get("/categories/")                     → ssrCategories
            ↓
Page Component
  ├── useFeaturedBusinesses(params, ssrBusinesses)  → FeaturedBusinesses component
  └── useCategories(ssrCategories)                   → Categories component
```

**SEO**: Server renders full business cards + category grid in HTML. Google sees everything.

---

### Categories Page (`/categories`)

```
getServerSideProps
  ├── serverApi.get("/business/getAllFeatureBusiness")  → ssrBusinesses
  └── serverApi.get("/categories/")                     → ssrCategories
            ↓
Page Component
  ├── useCategories(ssrCategories)                          → category pills
  ├── useFeaturedBusinesses(params, ssrBusinesses)          → business grid
  └── When user changes filter → new client-side API call   → updated grid (no reload)
```

**SEO**: Default business list rendered on server. Filter changes happen client-side.

---

### Business Detail (`/business/[id]`)

```
getServerSideProps (receives id from URL)
  ├── serverApi.get("/business/getBusinessById/{id}")  → ssrBusiness
  └── serverApi.get("/reviews/{id}")                    → ssrReviews
            ↓
Page Component
  ├── useBusinessById(id, params, ssrBusiness)    → name, rating, description, services
  └── useReviews(id, params, ssrReviews)          → reviews list
```

**SEO**: Business name, description, rating, services, reviews — all in server HTML.
Google sees: "Starter Salon — Rated 4.5/5 — Haircut ₹200 — 23 reviews"

---

### Login (`/login`) — No SSR needed

```
Page Component
  └── useLogin()  →  mutate({ email, password })
                          ↓ on success
                  localStorage.setItem("token", ...)
                  localStorage.setItem("user", ...)
                  redirect to /profile
```

---

### Signup (`/signup`) — No SSR needed

```
Page Component
  └── useSignup()  →  mutate({ name, email, phone, password })
                           ↓ on success
                   localStorage.setItem("token", ...)
                   localStorage.setItem("user", ...)
                   redirect to /profile
```

---

## Authentication Flow

```
1. User signs up / logs in
       ↓
2. Backend returns { user, token }
       ↓
3. Token saved in localStorage + httpOnly cookie (set by backend)
       ↓
4. Every subsequent request:
   - axios interceptor reads token from localStorage
   - Attaches header: Authorization: Bearer <token>
   - Backend validates token and responds
       ↓
5. Token is valid for 30 days
```

---

## API Response Format

Every API response follows this structure:

```json
// Success
{
  "success": true,
  "message": "Description of what happened",
  "data": { ... }
}

// Error
{
  "success": false,
  "message": "What went wrong",
  "errors": ["detail 1", "detail 2"]
}

// Paginated
{
  "success": true,
  "data": {
    "businesses": [...],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
}
```

---

## TypeScript Types (`src/types/api.types.ts`)

All API data shapes are defined here. Key types:

| Type | Used For |
|---|---|
| `User` | User profile data (id, name, email, phone, avatar, role) |
| `AuthData` | Login/signup response (user + token) |
| `Business` | Business listing (name, rating, total_reviews, category_name, distance_km, services) |
| `Service` | Business service (name, price, duration, description) |
| `Review` | User review (rating, comment, reviewer_name, created_at) |
| `Category` | Business category (name, description) |
| `City` | City (name, slug, state, country) |
| `FeaturedBusinessParams` | Query params for business listing (page, limit, sort, lat, long, etc.) |
| `Pagination` | Pagination info (total, page, limit, totalPages) |
| `ApiResponse<T>` | Wraps any response: `{ success, message, data: T }` |

---

## How to Add a New API

Example: Adding a "Create Review" API.

### Step 1: Add endpoint in `endpoints.ts`

```typescript
CREATE_REVIEW: "/reviews/",
```

### Step 2: Add types in `api.types.ts`

```typescript
export interface CreateReviewPayload {
  business_id: string;
  rating: number;
  comment: string;
}
```

### Step 3: Add service function in `review.service.ts`

```typescript
create(payload: CreateReviewPayload) {
  return api.post<ApiResponse<Review>>(ENDPOINTS.CREATE_REVIEW, payload);
},
```

### Step 4: Add hook in `useReviews.ts`

```typescript
export function useCreateReview() {
  return useMutation({
    mutationFn: (payload: CreateReviewPayload) =>
      reviewService.create(payload).then((res) => res.data.data),
  });
}
```

### Step 5: Use in component

```typescript
const { mutate: createReview, isPending } = useCreateReview();
createReview({ business_id: "123", rating: 5, comment: "Great!" });
```

---

## QueryClient Setup (`_app.tsx`)

React Query's `QueryClientProvider` wraps the entire app:

```
QueryClientProvider (caching layer)
  └── ThemeProvider (dark/light mode)
      └── Page Component
```

Default config:
- `staleTime: 60000` — data considered fresh for 60 seconds (no refetch)
- `retry: 1` — retry failed requests once

---

## Key Differences: Client vs Server Axios

| Feature | `axios.ts` (Client) | `server.ts` (Server) |
|---|---|---|
| Runs in | Browser | Node.js (getServerSideProps) |
| Token | Auto-attached from localStorage | No token (public data only) |
| Error interceptor | Yes | No |
| Used by | Hooks → Services | getServerSideProps directly |
| Purpose | User interactions | SEO pre-rendering |

---

## Environment Variable

Both axios instances use the same base URL. To change the backend URL:

Set `NEXT_PUBLIC_API_URL` in `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

Production (Vercel/Railway) mein apna production URL set karo.

If env variable is not set, it falls back to the hardcoded URL in the file.

---

## Summary Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER                               │
│                                                              │
│  Page Component                                              │
│    ├── useLogin()  ──────┐                                   │
│    ├── useFeaturedBusinesses() ──┐                           │
│    ├── useBusinessById() ────────┤                           │
│    ├── useReviews() ─────────────┤   React Query             │
│    └── useCategories() ──────────┘   (cache + loading)       │
│                    │                                         │
│              Service Layer                                   │
│         (auth/business/review/                               │
│          category/city.service)                               │
│                    │                                         │
│              axios.ts (client)                               │
│         [auto-attaches JWT token]                            │
│                    │                                         │
└────────────────────┼─────────────────────────────────────────┘
                     │ HTTPS
┌────────────────────┼─────────────────────────────────────────┐
│               NEXT.JS SERVER                                 │
│                    │                                         │
│         getServerSideProps()                                 │
│                    │                                         │
│              server.ts (SSR)                                 │
│          [no token, public data]                             │
│                    │                                         │
└────────────────────┼─────────────────────────────────────────┘
                     │ HTTPS
┌────────────────────┼─────────────────────────────────────────┐
│            BACKEND SERVER (Railway)                           │
│                                                              │
│    /api/v1/users/signup          POST                        │
│    /api/v1/users/login           POST                        │
│    /api/v1/business/getAllFeatureBusiness  GET                │
│    /api/v1/business/getBusinessById/:id   GET                │
│    /api/v1/reviews/:business_id           GET                │
│    /api/v1/categories/                    GET                │
│    /api/v1/cities/                        GET                │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```
