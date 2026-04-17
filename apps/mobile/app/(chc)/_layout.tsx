import { Tabs } from 'expo-router'
import { Text } from 'react-native'
import { Colors, Typography } from '../../constants/colors'

export default function CHCLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: Colors.yellow[500],
      tabBarInactiveTintColor: Colors.gray[300],
      tabBarStyle: { backgroundColor: Colors.green[800], borderTopColor: Colors.green[700], height: 64, paddingBottom: 8 },
      tabBarLabelStyle: { fontSize: Typography.xs, fontWeight: Typography.semibold, color: Colors.white },
    }}>
      <Tabs.Screen name="dashboard" options={{ title: 'Dashboard', tabBarIcon: ({ focused }) => <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>📊</Text> }} />
      <Tabs.Screen name="equipment" options={{ title: 'Equipment', tabBarIcon: ({ focused }) => <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>🚜</Text> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ focused }) => <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>👤</Text> }} />
    </Tabs>
  )
}
