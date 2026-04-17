// ============================================================
// Agritha — Shared Constants
// ============================================================

export const EQUIPMENT_TYPES = [
  { value: 'tractor', label: 'Tractor & Attachments', emoji: '🚜' },
  { value: 'harvester', label: 'Harvester / Combine', emoji: '🌾' },
  { value: 'transport', label: 'Transport / Other', emoji: '🚛' },
  { value: 'other', label: 'Other Equipment', emoji: '⚙️' },
] as const

export const BOOKING_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export const PAYMENT_TYPE_LABELS: Record<string, string> = {
  upi: 'UPI / Online',
  cash: 'Cash on Service',
}

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'hi', label: 'हिंदी' },
] as const

// Default map center: Tamil Nadu
export const DEFAULT_MAP_CENTER = {
  lat: 11.1271,
  lng: 78.6569,
}

export const DEFAULT_SEARCH_RADIUS_KM = 50

export const MAX_EQUIPMENT_IMAGES = 5

export const SUPABASE_STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  EQUIPMENT_IMAGES: 'equipment-images',
  DOCUMENTS: 'documents',
} as const
