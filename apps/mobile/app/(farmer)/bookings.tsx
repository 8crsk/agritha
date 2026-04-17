import { View, Text, StyleSheet } from 'react-native'
import { Colors, Typography } from '../../constants/colors'

// TODO: Build with Stitch UI design
export default function FarmerBookings() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>என் பதிவுகள் — My Bookings</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.placeholder}>📋 Bookings screen coming soon</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  header: {
    backgroundColor: Colors.green[800],
    paddingTop: 52, paddingBottom: 16, paddingHorizontal: 16,
  },
  headerTitle: { fontSize: Typography['2xl'], fontWeight: '700', color: '#fff' },
  body: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholder: { fontSize: Typography.lg, color: Colors.gray[500] },
})
