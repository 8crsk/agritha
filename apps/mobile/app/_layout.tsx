import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { QueryClientProvider } from '@tanstack/react-query'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { queryClient } from '../lib/queryClient'

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" backgroundColor="#1F4D2E" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(farmer)" />
          <Stack.Screen name="(chc)" />
          <Stack.Screen
            name="chc/[id]"
            options={{ headerShown: true, headerTitle: '', headerBackTitle: 'Back', headerTintColor: '#1F4D2E' }}
          />
          <Stack.Screen
            name="booking/[id]"
            options={{ headerShown: true, headerTitle: 'Booking Details', headerTintColor: '#1F4D2E' }}
          />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  )
}
