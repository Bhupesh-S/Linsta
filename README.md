## Frontend Skeleton (Expo + React Navigation)

- Expo TypeScript app scaffolded for Android-first development.
- Navigation uses React Navigation with tab + stack structure and mock auth gating.
- Theme system supports light/dark palettes via Context with centralized tokens.
- Base UI components (`Button`, `Card`, `Input`, `ScreenWrapper`) avoid hardcoded colors and keep accessibility defaults.

### Navigation map
- Root: switches between `AuthNavigator` and `AppNavigator` based on mock auth state.
- Auth stack: `Login`, `Onboarding`.
- App stack: `Tabs` (Home, Events, Network, Messages, Profile) + `EventDetail`, `CreateEvent`, `UserProfile`, `ChatScreen`, `Settings`.
- Route names are stable; drop new screens into `src/screens/**` without renaming existing routes.

### Theme & accessibility
- Tokens live in `src/theme/*`; consume via `useTheme`.
- Dark mode toggle exposed on `Settings` (uses Context, no device API).
- Font scaling enabled by default; buttons carry accessibility labels and touch targets ≥48px.

### Dev notes
- Entry: `App.tsx` wraps `ThemeProvider`, `AuthProvider`, `SafeAreaProvider`, then `RootNavigator`.
- Mock auth helpers: `useAuth().login/logout/completeOnboarding`.
- No backend or business logic included; all screens render placeholder text only.
- Run the app: `npm run android` (emulator) or `npm start`.

