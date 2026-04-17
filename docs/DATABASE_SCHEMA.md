# Agritha — Database Schema

All tables live in Supabase (PostgreSQL). PostGIS extension is enabled for geospatial queries.

---

## Tables

### `users`
Managed by Supabase Auth. Extended by profile tables below.

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key (from Supabase Auth) |
| phone | text | User's phone number |
| role | text | `farmer` or `chc` |
| created_at | timestamptz | Auto |

---

### `farmer_profiles`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → users.id |
| name | text | Full name |
| village | text | Village name |
| district | text | District |
| state | text | Default: Tamil Nadu |
| language_pref | text | `en`, `ta`, `hi` |
| avatar_url | text | Supabase Storage URL |
| created_at | timestamptz | Auto |

---

### `chc_profiles`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → users.id |
| name | text | CHC business name |
| description | text | Short description |
| location | geography(POINT) | PostGIS — lat/lng |
| address | text | Human-readable address |
| district | text | |
| state | text | |
| phone | text | Contact number |
| avatar_url | text | |
| verified | boolean | Default false; admin sets true |
| rating | numeric(2,1) | Computed average |
| total_reviews | integer | |
| created_at | timestamptz | |

---

### `equipment`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| chc_id | uuid | FK → chc_profiles.id |
| type | text | `tractor`, `harvester`, `transport`, `other` |
| name | text | e.g. "Mahindra 475 DI Tractor" |
| description | text | |
| price_per_hour | numeric | INR |
| price_per_day | numeric | INR |
| images | text[] | Array of Supabase Storage URLs |
| available | boolean | Default true |
| created_at | timestamptz | |

---

### `bookings`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| farmer_id | uuid | FK → farmer_profiles.id |
| chc_id | uuid | FK → chc_profiles.id |
| equipment_id | uuid | FK → equipment.id |
| start_time | timestamptz | Booking start |
| end_time | timestamptz | Booking end |
| status | text | `pending`, `confirmed`, `in_progress`, `completed`, `cancelled` |
| payment_type | text | `upi` or `cash` |
| payment_status | text | `pending`, `paid`, `failed` |
| total_amount | numeric | INR |
| notes | text | Farmer notes (optional) |
| created_at | timestamptz | |

---

### `payments`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| booking_id | uuid | FK → bookings.id |
| razorpay_order_id | text | From Razorpay |
| razorpay_payment_id | text | After payment completion |
| amount | numeric | INR (in paise for Razorpay) |
| status | text | `created`, `paid`, `failed`, `refunded` |
| created_at | timestamptz | |

---

### `reviews`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| booking_id | uuid | FK → bookings.id (unique) |
| reviewer_id | uuid | FK → users.id |
| reviewee_id | uuid | FK → users.id |
| rating | integer | 1–5 |
| comment | text | |
| created_at | timestamptz | |

---

### `conversations`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| farmer_id | uuid | FK → farmer_profiles.id |
| chc_id | uuid | FK → chc_profiles.id |
| booking_id | uuid | FK → bookings.id (optional) |
| created_at | timestamptz | |

---

### `messages`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| conversation_id | uuid | FK → conversations.id |
| sender_id | uuid | FK → users.id |
| content | text | Message text |
| read_at | timestamptz | Null = unread |
| created_at | timestamptz | |

---

## Key Indexes

```sql
-- Geospatial: find CHCs near a location
CREATE INDEX chc_profiles_location_idx ON chc_profiles USING GIST (location);

-- Booking lookups
CREATE INDEX bookings_farmer_id_idx ON bookings (farmer_id);
CREATE INDEX bookings_chc_id_idx ON bookings (chc_id);
CREATE INDEX bookings_equipment_id_idx ON bookings (equipment_id);

-- Message ordering
CREATE INDEX messages_conversation_id_created_idx ON messages (conversation_id, created_at);
```

---

## Row Level Security (RLS) Summary

| Table | Policy |
|---|---|
| farmer_profiles | User can only read/write their own profile |
| chc_profiles | All authenticated users can read; CHC can only write their own |
| equipment | All authenticated users can read; CHC can only write their own |
| bookings | Farmer sees their own; CHC sees bookings for their equipment |
| payments | Only booking participants can read |
| reviews | All can read; reviewer can only write once per booking |
| messages | Only conversation participants can read/write |
