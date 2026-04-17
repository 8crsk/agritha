# Agritha — Product Requirements Document

## Problem Statement

Farmers in Tamil Nadu (and across India) need access to agricultural machinery (tractors, harvesters, sprayers) but cannot afford to own them. Custom Hiring Centers (CHCs) own this machinery but struggle to find consistent bookings and manage their operations.

**Agritha** bridges this gap: a mobile marketplace where farmers discover and book CHC machinery, and CHC operators manage their listings and bookings — all in one app.

---

## User Personas

### Persona 1 — Ravi (Farmer)
- Age: 38, small-scale farmer in Thanjavur, Tamil Nadu
- Owns 2 acres of paddy fields
- Uses a basic Android phone (4G connectivity, sometimes 2G)
- Speaks Tamil, limited English
- Pain: Has to call 5 people to find a tractor; doesn't know the fair price; unsure if the machine will actually show up

### Persona 2 — Kumar (CHC Operator)
- Age: 45, owns 3 tractors and 1 harvester in Tiruchy district
- Runs a small business; manages bookings via WhatsApp and phone calls
- Speaks Tamil and some English
- Pain: Idle machinery during off-peak periods; no-shows from farmers; hard to track payments and schedules

---

## User Stories

### Farmer
- As a farmer, I want to see CHCs near me on a map so I can find the closest available machinery
- As a farmer, I want to book a tractor for a specific date and time without calling anyone
- As a farmer, I want to pay via UPI or choose to pay cash on the day
- As a farmer, I want to chat with the CHC operator if I have questions about the equipment
- As a farmer, I want to rate the CHC after my booking so others can make informed decisions
- As a farmer, I want the app to work even when my internet is slow or unavailable
- As a farmer, I want to use the app in Tamil

### CHC Operator
- As a CHC operator, I want to list my equipment with photos, price, and availability
- As a CHC operator, I want to receive instant booking confirmations
- As a CHC operator, I want to see all my upcoming bookings in a calendar view
- As a CHC operator, I want to chat with farmers before their booking
- As a CHC operator, I want to mark a booking as completed after the service
- As a CHC operator, I want to see my earnings history

---

## Feature List

### P0 — Must have at launch
| Feature | Description |
|---|---|
| Phone OTP Auth | Sign up / login via mobile number |
| Role Selection | Farmer or CHC Operator at onboarding |
| Profile Setup | Name, location, photo |
| Equipment Listing | CHC creates listings with type, price, photos, availability |
| Map Discovery | Farmers see nearby CHCs on OpenStreetMap |
| Instant Booking | Farmer picks equipment + date/time, booking auto-confirmed |
| Payment | UPI via Razorpay OR Cash option |
| Push Notifications | Booking confirmation, reminders |
| Basic Chat | Farmer ↔ CHC realtime messaging |
| Ratings & Reviews | After booking completion |
| Offline Support | Cached data accessible without internet |

### P1 — Nice to have (post-MVP)
| Feature | Description |
|---|---|
| Tamil + Hindi i18n | Full language support |
| SMS Notifications | For users without push notifications |
| Booking Calendar | CHC sees schedule in calendar view |
| Earnings Dashboard | CHC revenue analytics |
| CHC Verification Badge | Admin-verified CHC profiles |
| Dispute Resolution | In-app dispute reporting |

### P2 — Future
- Loan/credit integration for farmers
- Government scheme listings
- Crop advisory integration
- Pan-India expansion

---

## Success Metrics (MVP)

| Metric | Target (3 months post-launch) |
|---|---|
| Registered Farmers | 500 |
| Registered CHCs | 50 |
| Bookings completed | 200/month |
| App crash rate | < 1% |
| OTP success rate | > 95% |

---

## Constraints

- Must work on low-end Android devices (2GB RAM, Android 10+)
- Must work on 2G/3G connections (or offline)
- UI must be simple enough for low-literacy users
- All costs must be minimal during MVP phase
- No credit card required for testing (Razorpay test mode, Supabase test OTP)
