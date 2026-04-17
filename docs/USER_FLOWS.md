# Agritha — User Flows

---

## Flow 1: Farmer Onboarding

```
App Open
  └─→ Welcome / Splash Screen
        └─→ "I'm a Farmer" | "I'm a CHC"
              └─→ [Farmer selected]
                    └─→ Enter Phone Number
                          └─→ OTP Verification (SMS or test code 123456)
                                └─→ Profile Setup
                                      → Name
                                      → Village + District
                                      → Language preference (EN/TA/HI)
                                      → Profile photo (optional)
                                            └─→ HOME SCREEN (Map view)
```

---

## Flow 2: CHC Onboarding

```
App Open
  └─→ "I'm a CHC"
        └─→ Enter Phone Number → OTP
              └─→ CHC Profile Setup
                    → Business name
                    → Description
                    → Location (GPS auto-detect or manual pin on map)
                    → Phone number
                    → Profile photo
                          └─→ Add First Equipment (prompted)
                                → Type (Tractor / Harvester / Transport / Other)
                                → Name + Description
                                → Price per hour / per day
                                → Photos (up to 5)
                                      └─→ CHC DASHBOARD
```

---

## Flow 3: Farmer Books Equipment

```
Farmer Home (Map)
  └─→ Sees CHC pins on map
        └─→ Taps a CHC pin
              └─→ CHC Profile Page
                    → Name, rating, verified badge
                    → Equipment list
                          └─→ Taps equipment card
                                └─→ Equipment Detail Page
                                      → Photos, description, price
                                      → "Book Now" button
                                            └─→ Booking Screen
                                                  → Pick start date + time
                                                  → Pick end date + time
                                                  → Total price shown
                                                  → Payment type: UPI or Cash
                                                        └─→ [UPI selected]
                                                              → Razorpay payment sheet opens
                                                              → Payment succeeds
                                                              → Booking confirmed ✓
                                                        └─→ [Cash selected]
                                                              → Booking confirmed ✓
                                                              → Reminder: pay on day of service
                                                                    └─→ Booking Detail Page
                                                                          → Status: Confirmed
                                                                          → CHC contact
                                                                          → "Chat with CHC" button
```

---

## Flow 4: CHC Manages Booking

```
CHC Dashboard
  └─→ New booking notification (push)
        └─→ Bookings Tab
              └─→ Booking card: Farmer name, equipment, date, amount
                    └─→ Booking Detail Page
                          → Farmer profile
                          → Equipment requested
                          → Date/time
                          → Payment status
                          → "Mark as In Progress" (day of service)
                          → "Mark as Completed" (after service)
                                └─→ Review prompt sent to farmer
```

---

## Flow 5: Chat

```
Booking Confirmation Page
  └─→ "Chat with CHC" button
        └─→ Chat Screen
              → Realtime messages (Supabase Realtime)
              → Message input
              → Send button
              → Read receipts (read_at timestamp)
```

---

## Flow 6: Review After Booking

```
Booking status → "Completed"
  └─→ Push notification: "How was your experience?"
        └─→ Review Screen
              → Star rating (1–5)
              → Optional comment
              → Submit
                    └─→ CHC rating updated
                          └─→ Thank you screen
```

---

## Flow 7: Offline Behaviour

```
No internet connection
  └─→ App loads from cached data (TanStack Query + MMKV)
        → Farmer can still see previously loaded CHC list + map
        → Cannot make new bookings (requires connectivity)
        → Cannot send messages (queued for when online)
        → Banner shown: "You're offline — some features unavailable"
              └─→ Internet restored
                    → Data auto-refreshes in background
                    → Queued actions execute
```
