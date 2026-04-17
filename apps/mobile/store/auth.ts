import { create } from 'zustand'
import { supabase } from '../lib/supabase'

type UserRole = 'farmer' | 'chc' | null

interface AuthState {
  userId: string | null
  role: UserRole
  phone: string | null
  isLoading: boolean
  setUser: (userId: string, role: UserRole, phone: string) => void
  setRole: (role: UserRole) => void
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  role: null,
  phone: null,
  isLoading: false,

  setUser: (userId, role, phone) => set({ userId, role, phone }),

  setRole: (role) => set({ role }),

  signOut: async () => {
    await supabase.auth.signOut()
    set({ userId: null, role: null, phone: null })
  },
}))
