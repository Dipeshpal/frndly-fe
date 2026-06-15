# Frndly — Mobile App

"Your personal cross-device clipboard and secret vault."

Expo (React Native) app for iOS, Android, and Web.

## Stack

- **Expo SDK 56** + **TypeScript**
- **Expo Router** (file-based routing, NativeTabs)
- **Zustand** state management
- **TanStack Query v5** data fetching
- **React Hook Form** + **Zod** validation
- **Axios** HTTP client with JWT interceptor
- **expo-secure-store** token storage
- **expo-clipboard** clipboard access
- Design system from `DESIGN.md` (Clay-inspired: cream canvas, brand colors)

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [Expo Go](https://expo.dev/go) on your phone, or an iOS/Android emulator
- Backend running at `http://localhost:8004` (see [`frndly-be`](../frndly-be/README.md))

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

`.env` contents:

```env
EXPO_PUBLIC_API_URL=http://localhost:8004
```

> For a physical device on the same WiFi, use your machine's local IP instead of `localhost`:
> `EXPO_PUBLIC_API_URL=http://192.168.x.x:8004`

### 3. Start the app

```bash
npx expo start
```

Then:

| Platform | Action |
|----------|--------|
| iOS device | Scan QR code with Camera app |
| Android device | Scan QR code with Expo Go |
| iOS Simulator | Press `i` in terminal |
| Android Emulator | Press `a` in terminal |
| Web browser | Press `w` in terminal |

---

## Screens

| Screen | Route | Description |
|--------|-------|-------------|
| Login | `/(auth)/login` | Email + password sign-in |
| Signup | `/(auth)/signup` | Account creation with validation |
| Dashboard | `/(tabs)/(dashboard)` | Overview cards + activity feed |
| Clipboard | `/(tabs)/(clipboard)` | Sync clipboard across devices |
| Vault | `/(tabs)/(vault)` | Encrypted secret storage |
| Add Secret | `/(tabs)/(vault)/add` | Form sheet to add new secret |
| Edit Secret | `/(tabs)/(vault)/[id]` | Edit secret metadata |
| Settings | `/(tabs)/(settings)` | Profile, preferences, logout |

---

## Project Structure

```
src/
├── app/                    # Expo Router routes
│   ├── _layout.tsx         # Root layout (QueryClient + auth init)
│   ├── index.tsx           # Auth redirect dispatcher
│   ├── (auth)/             # Login + Signup screens
│   └── (tabs)/             # Tab screens (Dashboard, Clipboard, Vault, Settings)
│       ├── (dashboard)/
│       ├── (clipboard)/
│       ├── (vault)/        # Includes add.tsx and [id].tsx form sheets
│       └── (settings)/
│
├── api/                    # Axios client + per-resource API modules
│   ├── client.ts           # Axios instance, JWT interceptor, error extractor
│   ├── auth.ts
│   ├── clipboard.ts
│   ├── vault.ts
│   └── user.ts
│
├── components/
│   ├── ui/                 # Button, Card, Badge, Avatar, SearchBar, SectionHeader
│   ├── forms/              # FormField, PasswordInput
│   └── feedback/           # EmptyState, LoadingState, ErrorState
│
├── features/               # Feature-scoped components + hooks
│   ├── auth/
│   ├── dashboard/
│   ├── clipboard/
│   ├── vault/
│   └── settings/
│
├── store/                  # Zustand stores (auth, settings)
├── theme/                  # Design tokens (colors, spacing, typography, shadows)
├── types/                  # TypeScript interfaces
└── utils/                  # secure-storage wrapper, format helpers, query keys
```

---

## Theme System

All design tokens live in `src/theme/`:

| File | Contents |
|------|----------|
| `colors.ts` | Light + dark palette from DESIGN.md |
| `spacing.ts` | Spacing scale + border radius tokens |
| `typography.ts` | Font size/weight/lineHeight presets |
| `shadows.ts` | `boxShadow` strings (CSS shadow prop) |

Use via `useTheme()` hook:

```tsx
import { useTheme } from '@/hooks/use-theme';

const { colors, isDark } = useTheme();
<View style={{ backgroundColor: colors.canvas }} />
```

---

## Auth Flow

1. App starts → `src/app/index.tsx` checks auth state
2. No token → redirect to `/(auth)/login`
3. Login → JWT stored in `expo-secure-store` (iOS/Android) or `localStorage` (web)
4. Token present → `authApi.me()` verifies → redirect to `/(tabs)/(dashboard)`
5. 401 response → token cleared → back to login

---

## Adding a New Screen

1. Create file in `src/app/` (e.g. `src/app/(tabs)/(vault)/detail.tsx`)
2. Add `Stack.Screen` entry in the parent `_layout.tsx`
3. Update `.expo/types/router.d.ts` with the new path (auto-regenerated on `expo start`)
4. Add API module in `src/api/` if needed
5. Add React Query hook in `src/features/<name>/hooks/`
