import { View, Text, StyleSheet } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { Colors, Typography } from '../../constants/colors'

// TODO: Build with Stitch UI design
export default function CHCDetail() {
  const { id } = useLocalSearchParams()
  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.placeholder}>🏭 CHC Profile — ID: {id}</Text>
        <Text style={styles.sub}>Equipment listing + Book Now button coming soon</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  body: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 12 },
  placeholder: { fontSize: Typography.xl, fontWeight: '700', color: Colors.green[800], textAlign: 'center' },
  sub: { fontSize: Typography.base, color: Colors.gray[500], textAlign: 'center' },
})
