# Voyageur — AI Travel Planner Frontend

React + TypeScript frontend for the Voyageur travel planning app. Lets users generate AI-powered day-by-day itineraries, manage budgets, explore hotel and activity options, and interact with an AI assistant for trip optimization.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18, TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS v4 |
| Client State | Zustand (auth, UI theme) |
| Server Cache | TanStack React Query v5 |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios (with request/response interceptors) |
| Animations | Framer Motion |
| Charts | Recharts |
| Routing | React Router v6 |

---

## Prerequisites

- Node.js 20+
- pnpm 8+ (`npm install -g pnpm`)
- The [backend server](../../server/ai-travel-backend/README.md) running at `http://localhost:5000`

---

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure the API base URL

Open `src/constants/index.ts` and verify `API_BASE_URL` points to your running backend:

```ts
export const API_BASE_URL = "http://localhost:5000/api/v1"
```

For production, change this to your deployed backend URL (or use a `.env` variable).

### 3. Start the development server

```bash
pnpm dev
```

App runs at `http://localhost:5173`.

---

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start Vite dev server with HMR |
| `pnpm build` | Type-check and compile to `dist/` |
| `pnpm preview` | Preview the production build locally |
| `pnpm lint` | Run ESLint |

---

## Project Structure

```
src/
├── main.tsx                    # React entry point
├── app/
│   └── App.tsx                 # Root: QueryClientProvider → RouterProvider → Toaster
├── api/                        # One file per backend module
│   ├── axios.ts                # Axios instance + interceptors (auth, 401 refresh)
│   ├── auth.ts                 # login(), register(), refresh(), logout()
│   ├── trips.ts                # getTrips(), getTrip(), generateItinerary(), …
│   ├── budget.ts
│   ├── users.ts
│   ├── hotels.ts
│   ├── activities.ts
│   ├── weather.ts
│   ├── assistant.ts            # optimizeTrip(), checkConflicts(), scoreTrip()
│   └── analytics.ts
├── components/
│   └── common/                 # EmptyState, LoadingSpinner, Logo, ThemeToggle
├── constants/
│   └── index.ts                # API_BASE_URL, activity categories, travel styles, budget tiers
├── hooks/                      # React Query wrappers (useTrips, useAuth, useBudget, …)
├── layouts/
│   ├── RootLayout.tsx          # Authenticated shell with nav + sidebar
│   ├── AuthLayout.tsx          # Centered card layout (login / register)
│   └── PublicLayout.tsx        # Landing page layout
├── pages/
│   ├── Landing.tsx             # Marketing splash page
│   ├── Login.tsx               # Login form (React Hook Form + Zod)
│   ├── Register.tsx            # Registration form
│   ├── Dashboard.tsx           # Summary cards, upcoming trips
│   ├── TripCreate.tsx          # 4-step creation wizard
│   ├── TripDetails.tsx         # Full itinerary view + inline editing
│   ├── Trips.tsx               # Trip list with filters
│   ├── Profile.tsx             # User profile + preference editor
│   ├── Budget.tsx              # Budget dashboard with charts
│   ├── Assistant.tsx           # AI assistant — optimize, score, conflicts, alternatives
│   └── Analytics.tsx           # Trip analytics charts
├── routes/
│   ├── index.tsx               # createBrowserRouter() config
│   └── ProtectedRoute.tsx      # Redirects to /login if unauthenticated
├── store/
│   ├── authStore.ts            # Zustand: user, tokens, isAuthenticated (persisted)
│   ├── uiStore.ts              # Zustand: theme light/dark/system
│   └── assistantStore.ts       # Zustand: AI assistant panel state
├── types/
│   └── index.ts                # TypeScript interfaces mirroring backend models
└── utils/
    ├── formatters.ts           # formatCurrency(), formatDateRange(), etc.
    └── validators.ts           # Zod schemas for form validation
```

---

## Routing

```
/                   → Landing page (public)
/login              → Login (AuthLayout)
/register           → Register (AuthLayout)

/dashboard          → Dashboard           (protected)
/trips              → Trip list           (protected)
/trips/create       → Create wizard       (protected)
/trips/:tripId      → Trip details        (protected)
/profile            → Profile editor      (protected)
/budget             → Budget dashboard    (protected)
/assistant          → AI assistant        (protected)
/analytics          → Analytics           (protected)
```

`ProtectedRoute` checks `isAuthenticated` from `authStore`. Unauthenticated users are redirected to `/login` with the original URL preserved in location state.

---

## State Management

### Zustand (persisted to `localStorage`)

```ts
// authStore.ts — auth state
{
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setAuth(user, accessToken, refreshToken): void
  setUser(user): void
  logout(): void
}

// uiStore.ts — UI preferences
{
  theme: "light" | "dark" | "system"
  setTheme(t): void
}
```

### React Query (in-memory server cache)

- All GET requests are cached with a 1–2 minute `staleTime`
- Mutations automatically invalidate related query caches
- Auto-retry: 2 times for queries, 1 time for mutations
- Configured in `App.tsx` via `QueryClientProvider`

---

## HTTP Client

`src/api/axios.ts` sets up an Axios instance with:

**Request Interceptor**
- Reads `accessToken` from `authStore`
- Attaches `Authorization: Bearer <token>` header to every request

**Response Interceptor (401 handling)**
- On 401: pause the failed request and attempt token refresh (`POST /auth/refresh`)
- If refresh succeeds: update tokens in store, retry all queued requests
- If refresh fails: clear auth state, redirect to `/login`
- Concurrent 401s are deduplicated — only one refresh call is made

---

## Key Pages

### TripCreate — 4-Step Wizard

1. **Destination & Dates** — city/country search + date range picker
2. **Preferences** — budget tier, travel style, dietary restrictions, activity interests
3. **Review** — confirm destination, duration, estimated budget
4. **Generating** — animated progress steps ("Analyzing destination...", "Crafting itinerary...", etc.)

On success, navigates to `/trips/:tripId`.

### TripDetails — Full Itinerary View

- Day-by-day accordion (first day expanded by default)
- Activity cards: title, time, cost, rating, booking links
- Inline edit: click edit → modal form → PATCH request
- "Regenerate Day" button: calls `PATCH /trips/:id/itinerary/day/:day/regenerate`
- Weather badge per day (temperature, icon, advisory)
- Hotel recommendations sidebar with booking options
- Budget progress bar
- Decision checkpoint modals for weather / schedule / budget conflicts

### Assistant — AI Assistant Panel

- **Score tab**: radar chart across 6 itinerary quality dimensions
- **Optimize tab**: before/after comparison of suggested activity order
- **Conflicts tab**: expandable conflict cards with resolution actions
- **Alternatives tab**: swappable activity suggestions with cost difference

---

## Authentication Flow

```
Register → POST /auth/register → setAuth(user, accessToken, refreshToken) → /dashboard
Login    → POST /auth/login    → setAuth(...)                              → /dashboard
Request  → Interceptor attaches Bearer token automatically
401      → Interceptor refreshes token silently, retries original request
Logout   → POST /auth/logout → authStore.logout() → /login
```

---

## Forms & Validation

All forms use React Hook Form with Zod schemas defined in `src/utils/validators.ts`:

- Login: email + password (min 6 chars)
- Register: fullName, email, password, confirmPassword
- Trip creation: destination, dates, budget, preferences
- Activity editing: title, description, time, cost

Zod errors surface directly in the form fields via `formState.errors`.

---

## Building for Production

```bash
pnpm build
```

Output goes to `dist/`. Set the correct `API_BASE_URL` in `src/constants/index.ts` before building.

To preview the build locally:

```bash
pnpm preview
```

---

## License

MIT
