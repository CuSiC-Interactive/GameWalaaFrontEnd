# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # Type-check with tsc then build for production
npm run lint      # Run ESLint across all .ts/.tsx files
npm run preview   # Serve the production build locally
```

There is no test suite configured in this project.

## Architecture

This is a React 19 + TypeScript single-page application built with Vite. It is the customer-facing frontend for **ArcadeWala** — a physical retro arcade service where customers scan a QR code at the arcade machine, browse a game catalog, and pay via Razorpay to receive a one-time code that unlocks the physical machine.

### Directory layout

```
src/
  App.tsx            # Root: BrowserRouter + Navbar + AppRoutes + Footer
  routes/AppRoutes.tsx  # All client-side routes (no admin routes wired here)
  External/          # Public-facing pages (Home, Catalog, About, Games, ContactUs, legal pages)
  Components/        # Shared UI components
  Admin/             # Admin dashboard (not yet routed in AppRoutes)
  Shared/            # Constants, TypeScript models
  Utils/             # Pure utility functions
```

### Key data flow — Catalog / payment

1. The page is reached via QR code that appends `?arcade_id=<id>` to the URL. The Catalog page reads this on mount, stores it in `sessionStorage`, and uses it for all API calls.
2. If `arcade_id` is absent from the URL and session storage, a `Modal` prompts the user to enter it manually.
3. Games are fetched from `GET {baseUrl}/api/v1/games?id={arcade_id}` and modelled by `gamesModel` in `src/Shared/Models.tsx`.
4. Each `GameTile` renders a retro cartridge-style card. Prices are either time-based (`ByTime`) or level-based (`ByLevel`); `normalizePrices()` in Catalog normalises both shapes into `{ value, Based }` before passing to the tile.
5. On "Play", the Razorpay script is lazy-loaded via `loadRazorpayScript()`, an order is created with `GET {baseUrl}/api/v1/payment/order/{arcade_id}/{price}`, and the Razorpay checkout opens. On success the handler POSTs to `{baseUrl}/api/v1/payment/order/details`.
6. Purchased game codes (konami codes) are stored in `localStorage` under `"konamiCodes"` and displayed via `KonamiCodeModal`, triggered by the `FloatingActionButton` (badge count = number of active codes). **Note:** the code path that actually fetches konami codes from the backend (`/api/v1/games/status`) is currently commented out; after payment, the code list is cleared instead.

### Constants (`src/Shared/Constants.tsx`)

All API base URL, endpoint paths, Google Analytics ID, and Razorpay config live here. The backend base URL is `https://arcadewala.fun`.

### Styling

Tailwind CSS v4 (via `@tailwindcss/vite`) is configured alongside per-component `.css` files co-located with each component. MUI (`@mui/material`) and Emotion are installed as dependencies but are not visibly used in the current codebase.

### Admin section

`src/Admin/` contains an `AdminDashboard` with a `SideBar` (add/update tabs) built with `react-hook-form`. It is **not linked from any route** in `AppRoutes.tsx` — it exists but is inaccessible in production.

### Google Analytics

`ReactGA.initialize()` is called once in `App.tsx`. `AppRoutes` fires a `pageView` hit on every `location` change via a `useEffect`.

### Contact form

Submissions go directly to Formspree (`https://formspree.io/f/xpwlvnlp`) — no backend involvement.
