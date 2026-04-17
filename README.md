# Agritha

> Connecting farmers and Custom Hiring Centers (CHCs) across India.

A mobile-first marketplace where farmers discover and book agricultural machinery, and CHC operators manage their listings and bookings.

---

## Apps

| App | Location | Stack | Purpose |
|---|---|---|---|
| Mobile | `apps/mobile` | Expo (React Native) | Farmer + CHC app |
| Admin | `apps/admin` | Next.js 14 | Admin dashboard |

## Tech Stack

- **Mobile:** Expo + Expo Router + NativeWind + TanStack Query + Supabase
- **Backend:** Supabase (PostgreSQL + PostGIS + Auth + Realtime + Storage)
- **Payments:** Razorpay (UPI) + Cash
- **Maps:** OpenStreetMap (free, no API key)
- **Admin:** Next.js + Tailwind + Supabase

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/agritha.git
cd agritha
pnpm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
# Fill in your Supabase URL, anon key, Razorpay test keys
```

### 3. Run the database schema

Copy `supabase/migrations/001_initial_schema.sql` and run it in your Supabase SQL Editor.

### 4. Run the mobile app

```bash
pnpm mobile
# Then press 'a' for Android or scan QR code with Expo Go
```

### 5. Run the admin dashboard

```bash
pnpm admin
# Opens at http://localhost:3000
```

## Project Structure

```
agritha/
├── apps/
│   ├── mobile/          # Expo React Native app
│   └── admin/           # Next.js admin dashboard
├── packages/
│   └── shared/          # Shared TypeScript types + constants
├── supabase/
│   ├── migrations/      # SQL schema files
│   └── seed.sql         # Dev seed data
├── docs/                # Documentation
│   ├── PRD.md           # Product requirements
│   ├── DATABASE_SCHEMA.md
│   ├── USER_FLOWS.md
│   └── TECH_STACK.md
└── .env.example         # Environment variables template
```

## Documentation

- [Product Requirements (PRD)](docs/PRD.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [User Flows](docs/USER_FLOWS.md)
- [Tech Stack Decisions](docs/TECH_STACK.md)

## Development Notes

- Phone OTP auth uses Supabase test mode in dev — use code `123456`
- Razorpay test UPI: `success@razorpay`
- Maps use OpenStreetMap — no API key needed
