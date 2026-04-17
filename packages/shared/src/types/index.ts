// ============================================================
// Agritha — Shared TypeScript Types
// Used by both apps/mobile and apps/admin
// ============================================================

export type UserRole = 'farmer' | 'chc'

export type Language = 'en' | 'ta' | 'hi'

export type EquipmentType = 'tractor' | 'harvester' | 'transport' | 'other'

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'

export type PaymentType = 'upi' | 'cash'

export type PaymentStatus = 'pending' | 'paid' | 'failed'

// ─────────────────────────────────────────────
// Database Row Types
// ─────────────────────────────────────────────

export interface User {
  id: string
  phone: string | null
  role: UserRole
  created_at: string
}

export interface FarmerProfile {
  id: string
  user_id: string
  name: string
  village: string | null
  district: string | null
  state: string
  language_pref: Language
  avatar_url: string | null
  created_at: string
}

export interface CHCProfile {
  id: string
  user_id: string
  name: string
  description: string | null
  location: { lat: number; lng: number } | null
  address: string | null
  district: string | null
  state: string
  phone: string | null
  avatar_url: string | null
  verified: boolean
  rating: number
  total_reviews: number
  created_at: string
}

export interface Equipment {
  id: string
  chc_id: string
  type: EquipmentType
  name: string
  description: string | null
  price_per_hour: number | null
  price_per_day: number | null
  images: string[]
  available: boolean
  created_at: string
}

export interface Booking {
  id: string
  farmer_id: string
  chc_id: string
  equipment_id: string
  start_time: string
  end_time: string
  status: BookingStatus
  payment_type: PaymentType
  payment_status: PaymentStatus
  total_amount: number
  notes: string | null
  created_at: string
}

export interface Payment {
  id: string
  booking_id: string
  razorpay_order_id: string | null
  razorpay_payment_id: string | null
  amount: number
  status: 'created' | 'paid' | 'failed' | 'refunded'
  created_at: string
}

export interface Review {
  id: string
  booking_id: string
  reviewer_id: string
  reviewee_id: string
  rating: number
  comment: string | null
  created_at: string
}

export interface Conversation {
  id: string
  farmer_id: string
  chc_id: string
  booking_id: string | null
  created_at: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  read_at: string | null
  created_at: string
}

// ─────────────────────────────────────────────
// Joined / Enriched Types (for UI)
// ─────────────────────────────────────────────

export interface BookingWithDetails extends Booking {
  farmer: FarmerProfile
  chc: CHCProfile
  equipment: Equipment
}

export interface CHCWithEquipment extends CHCProfile {
  equipment: Equipment[]
  distance_km?: number
}
