import { useEffect } from 'react'
import { Redirect } from 'expo-router'
import { View, ActivityIndicator } from 'react-native'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/auth'
import { Colors } from '../constants/colors'

export default function Index() {
  const { userId, role, setUser } = useAuthStore()

  useEffect(() => {
    // Check existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('role, phone')
          .eq('id', session.user.id)
          .single()

        if (userData) {
          setUser(session.user.id, userData.role, userData.phone ?? '')
        }
      }
    })
  }, [])

  // Not logged in → show welcome screen (with map hook)
  if (!userId) return <Redirect href="/(auth)/welcome" />

  // Logged in but no role somehow → role select
  if (!role) return <Redirect href="/(auth)/role" />

  // Route based on role
  if (role === 'farmer') return <Redirect href="/(farmer)/home" />
  if (role === 'chc') return <Redirect href="/(chc)/dashboard" />

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.cream }}>
      <ActivityIndicator size="large" color={Colors.green[800]} />
    </View>
  )
}
