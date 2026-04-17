import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Colors, Typography } from '../../constants/colors'
import { useAuthStore } from '../../store/auth'

export default function CHCProfile() {
  const { phone, signOut } = useAuthStore()
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>👤 CHC Profile</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.phone}>📱 {phone}</Text>
        <TouchableOpacity style={styles.signOutBtn} onPress={signOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  header: { backgroundColor: Colors.green[800], paddingTop: 52, paddingBottom: 20, paddingHorizontal: 16 },
  headerTitle: { fontSize: Typography['2xl'], fontWeight: '700', color: '#fff' },
  body: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 24 },
  phone: { fontSize: Typography.lg, color: Colors.gray[700] },
  signOutBtn: { backgroundColor: Colors.error, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
  signOutText: { color: '#fff', fontSize: Typography.base, fontWeight: '600' },
})
