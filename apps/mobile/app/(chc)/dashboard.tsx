import { View, Text, StyleSheet } from 'react-native'
import { Colors, Typography } from '../../constants/colors'

// TODO: Build with Stitch UI design
export default function CHCDashboard() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📊 CHC Dashboard</Text>
        <Text style={styles.subtitle}>Today's bookings & earnings</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.placeholder}>🏭 CHC Dashboard coming soon</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  header: {
    backgroundColor: Colors.green[800],
    paddingTop: 52, paddingBottom: 20, paddingHorizontal: 16,
  },
  headerTitle: { fontSize: Typography['2xl'], fontWeight: '700', color: '#fff' },
  subtitle: { fontSize: Typography.sm, color: Colors.green[100], marginTop: 4 },
  body: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholder: { fontSize: Typography.lg, color: Colors.gray[500] },
})
