# Agritha — Tech Stack

## Mobile App (apps/mobile)

| Layer | Library | Version | Purpose |
|---|---|---|---|
| Framework | Expo (React Native) | SDK 52 | Cross-platform iOS + Android |
| Navigation | Expo Router | v3 | File-based routing |
| Styling | NativeWind | v4 | Tailwind CSS for React Native |
| State | Zustand | latest | Lightweight global state |
| Data Fetching | TanStack Query | v5 | Server state, offline caching |
| Local Storage | MMKV | latest | Fast persistent storage (offline) |
| Database Client | @supabase/supabase-js | v2 | Supabase SDK |
| Maps | react-native-maps | latest | Map component |
| Map Tiles | OpenStreetMap | - | Free tile provider, no API key |
| Location | expo-location | latest | GPS coordinates |
| Push Notifications | expo-notifications | latest | Booking alerts |
| Image | expo-image | latest | Optimised image loading |
| i18n | i18next + react-i18next | latest | EN / Tamil / Hindi |
| Payments | react-native-razorpay | latest | Razorpay UPI integration |

## Backend (Supabase)

| Layer | Tool | Purpose |
|---|---|---|
| Database | PostgreSQL 15 | Main data store |
| ORM | Supabase client (auto-generated types) | Type-safe queries |
| Auth | Supabase Auth — Phone OTP | SMS-less test OTP in dev |
| Realtime | Supabase Realtime | Live chat |
| Storage | Supabase Storage | Images, documents |
| Edge Functions | Deno (Supabase) | Payment webhooks, business logic |
| Geospatial | PostGIS extension | Nearby CHC queries |

## Admin Dashboard (apps/admin)

| Layer | Library | Purpose |
|---|---|---|
| Framework | Next.js 14 (App Router) | Web admin panel |
| Styling | Tailwind CSS | |
| UI Components | shadcn/ui | |
| Database Client | @supabase/supabase-js | |
| Charts | Recharts | Analytics |
| Auth | Supabase Auth (email) | Admin login |

## Infrastructure

| Tool | Purpose |
|---|---|
| GitHub | Version control |
| EAS Build | iOS + Android binary builds |
| EAS Update | OTA updates (skip app store review) |
| GitHub Actions | CI — lint + typecheck on every push |

## Maps Decision

**OpenStreetMap** is used instead of Google Maps or Mapbox because:
- Completely free, no API key required
- No credit card required
- Sufficient for MVP — shows pins, navigation, nearby search
- Can be upgraded to Mapbox later if advanced features needed

## SMS / Auth Decision

**Supabase test OTP** (fixed code `123456`) is used during development.
- For production: integrate MSG91 or Twilio via Supabase Auth custom SMS provider
- Supabase docs: Settings → Auth → SMS Provider

## Payment Decision

**Razorpay test mode** during development.
- No credit card / KYC needed for test mode
- Test UPI ID: `success@razorpay`
- KYC required only when going live with real money

## Why This Stack?

- **Expo**: Fastest way to build React Native apps solo. Managed workflow handles native config.
- **Supabase**: Replaces backend + auth + realtime + storage. Free tier handles MVP scale.
- **TanStack Query + MMKV**: Best combination for offline-first apps — automatic caching, background sync, persistence.
- **OpenStreetMap**: Saves credit card requirement during MVP phase.
- **pnpm workspaces**: Monorepo keeps mobile + admin + shared types in one repo, one git history.
