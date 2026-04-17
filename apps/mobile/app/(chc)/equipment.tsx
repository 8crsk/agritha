import { View, Text, StyleSheet } from 'react-native'
import { Colors, Typography } from '../../constants/colors'

export default function CHCEquipment() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🚜 My Equipment</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.placeholder}>Equipment management coming soon</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  header: { backgroundColor: Colors.green[800], paddingTop: 52, paddingBottom: 20, paddingHorizontal: 16 },
  headerTitle: { fontSize: Typography['2xl'], fontWeight: '700', color: '#fff' },
  body: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholder: { fontSize: Typography.lg, color: Colors.gray[500] },
})
