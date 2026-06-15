# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project
Expo SDK 56 React Native app (frndly-fe). Backend: `frndly-be` at port 8004 (dev) or `EXPO_PUBLIC_API_URL` (prod).

## Commands
- Start: `npm start` (Expo Go via QR)
- Lint: `npm run lint` (`expo lint`)
- No test runner configured
- Android/iOS/Web: `npm run android|ios|web`
- Reset to scaffold: `npm run reset-project` (destructive — removes current app code)

## Path Aliases
`@/*` → `./src/*`. Always use aliases, never relative imports.

## Critical SDK 56 Rules
- Use `process.env.EXPO_OS` NOT `Platform.OS`
- Use `useWindowDimensions()` NOT `Dimensions.get()`
- React Compiler enabled (`experiments.reactCompiler: true` in app.json) — don't add manual memoization (`useMemo`/`useCallback`)
- Never use removed RN core modules: Picker, WebView, SafeAreaView, AsyncStorage
- Try Expo Go first; only `npx expo run:ios|android` when custom native code is needed

## File Conventions
- kebab-case filenames (e.g., `comment-card.tsx`)
- Routes in `src/app/` only; components/hooks/utils go in their own dirs
- Always ensure a route matches "/" (may be inside a group)

## Styling
- `StyleSheet.create()` or inline styles — no Tailwind/CSS classes
- CSS `boxShadow` prop, NOT legacy RN shadow/elevation props
- Flex gap over margin/padding
- `{ borderCurve: 'continuous' }` for rounded corners (unless capsule shape)
- Theme tokens via `useTheme()` from `@/hooks/use-theme`
- Root components always wrapped in ScrollView

## State & Data
- Auth state: Zustand (`@/store/auth-store`)
- Server state: React Query v5 (`@tanstack/react-query`)
- Token storage: `expo-secure-store` via `@/utils/secure-storage`

## Skills
Reference `.agents/skills/` for detailed guidance:
- `building-native-ui` — UI, navigation, animations, native tabs
- `expo-ui` — Native components (SwiftUI/Jetpack Compose drop-ins)
- `expo-deployment` — EAS Build, app store submission
- `expo-dev-client` — Custom native builds
