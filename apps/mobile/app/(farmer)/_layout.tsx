import { Tabs } from 'expo-router'
import { Colors, Typography } from '../../constants/colors'
import { Text } from 'react-native'

export default function FarmerLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.green[800],
        tabBarInactiveTintColor: Colors.gray[300],
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.gray[100],
          height: 64,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: Typography.xs,
          fontWeight: Typography.semibold,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'கண்டுபிடி',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>🗺️</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'பதிவுகள்',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>📋</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'சுயவிவரம்',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>👤</Text>
          ),
        }}
      />
    </Tabs>
  )
}
