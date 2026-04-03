# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev              # Dev server at localhost:3000
yarn build            # Production build (output: /build)
yarn lint             # Run ESLint with auto-fix
yarn prettier         # Run Prettier formatting
yarn test:e2e         # Playwright E2E tests (headless)
yarn test:e2e:headed  # Playwright with visible browser
yarn test:e2e:ui      # Playwright interactive UI mode
yarn test:e2e:debug   # Playwright debug mode
yarn record           # Record new Playwright test scenarios
```

## Environment Variables

Copy `.env.example` to `.env`. Key variables:

```
VITE_APP_BASE_URL=http://localhost:8088/api   # API server (runs separately)
VITE_APP_API_MAP_KEY=                         # Google Maps API key
VITE_APP_ENV=development                      # development | production
VITE_USE_MOCK_SERVER=true                     # Enable MirageJS mock API (no backend needed)
VITE_BYPASS_AUTH=true                         # Skip auth in dev
VITE_RAZORPAY_KEY_ID=                        # Payment gateway key
```

## Architecture

### Directory Layout

```
src/
  api/apiClient/    # Single ApiClient class (axios singleton) — all HTTP calls go here
  components/       # Reusable UI components (GenTable, ImagePicker, etc.)
  pages/            # Route-level feature components
  redux/
    actions/        # Redux thunks — async API calls
    actionTypes/    # String constants per domain
    reducers/       # Domain reducers with initData/loading/error pattern
    store/          # Redux store config
  store/            # Recoil atoms (supplementary UI state)
  hooks/            # Custom hooks (useRbacPermissions, usePageSections)
  types/            # TypeScript type definitions
  helpers/          # AWS S3, image crop, visitor tracking utilities
  mockServer/       # MirageJS mock server for offline dev
  config/           # App version, pageSubSections config
  theme.jsx         # MUI theme configuration
  App.jsx           # React Router v6 route definitions
  index.tsx         # App entry: providers (Redux, Recoil, AuthContext, MUI)
```

### API Layer

All API calls go through the singleton `ApiClient` in `src/api/apiClient/apiClient.ts`. It:
- Uses axios with base URL from `VITE_APP_BASE_URL`
- Injects `x-user-id`, `x-visitor-id`, and token headers automatically
- Follows consistent naming: `getEntity(offset, limit, filters?)`, `createEntity(data)`, `updateEntity(id, data)`, `deleteEntity(id)`

To add a new entity, add methods to `ApiClient` and then create the corresponding Redux actions/reducers.

### State Management

Two layers:
- **Redux Toolkit** — server data (trees, sites, users, donations, etc.). Standard pattern: thunk action → ApiClient call → loading/success/error dispatches → reducer.
- **Recoil atoms** (`src/store/atoms.jsx`) — local UI state.

### Routing & Auth

Routes defined in `App.jsx` (React Router v6). Protected admin routes use `<RequireAuth>` wrapper. Auth state lives in `AuthContext` (React Context) with token stored in localStorage. RBAC permissions also stored in localStorage after login; check them with the `useRbacPermissions` hook.

Public routes: `/`, `/search`, `/profile/:saplingId`, `/profile/user/:userId`, `/events/:linkId`, `/ww/:email`  
Protected: `/admin/*`

### Data Grid Pattern

Use `GenTable` (custom Ant Design wrapper in `src/components/`) for paginated data tables. It handles column preferences, resizing, and CSV export. MUI DataGrid is used in some newer admin tables.

### Image Uploads

Use `AlbumImageInput` component — it handles client-side compression (browser-image-compression) and uploads to AWS S3.

### Forms

Complex forms use `react-final-form`. Simpler forms use Ant Design form components directly.

## Code Style

- **Linting**: Airbnb ESLint config + TypeScript + Prettier. Enforced via Husky pre-commit hooks (lint-staged).
- **Formatting**: Tabs (width 2), single quotes in JS, double quotes in JSX, trailing commas everywhere, semicolons required, print width 80.
- No PropTypes required (TypeScript project).
- `no-console` is a warning, not an error — remove console logs before committing.

## Mock Server

MirageJS mock server (`src/mockServer/`) intercepts API requests when `VITE_USE_MOCK_SERVER=true`. Use this for frontend development without a running backend.

## Theme System

Multiple MUI themes are available (switchable in dev mode via a button). Theme config is in `theme.jsx`. See `THEME_SWITCHER_GUIDE.md` for details.
