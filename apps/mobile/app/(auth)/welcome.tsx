import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native'
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Colors, Typography, Spacing, Radius } from '../../constants/colors'

const { width, height } = Dimensions.get('window')

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Background green header */}
      <View style={styles.header}>
        {/* Logo area */}
        <View style={styles.logoRow}>
          <Text style={styles.logoIcon}>🚜</Text>
          <Text style={styles.logoText}>Agritha</Text>
        </View>
        <Text style={styles.tagline}>உழவர்களுக்காக உருவாக்கப்பட்டது</Text>
        <Text style={styles.taglineEn}>Built for Farmers</Text>
      </View>

      {/* CHC preview cards — the hook (visible before login) */}
      <View style={styles.previewContainer}>
        <View style={styles.previewLabel}>
          <View style={styles.greenDot} />
          <Text style={styles.previewLabelText}>உங்கள் அருகில் உள்ள CHC கள்</Text>
        </View>

        {/* Mock CHC cards to show value before signup */}
        {MOCK_CHCS.map((chc, i) => (
          <View key={i} style={styles.chcCard}>
            <View style={styles.chcIconBox}>
              <Text style={styles.chcIcon}>{chc.icon}</Text>
            </View>
            <View style={styles.chcInfo}>
              <Text style={styles.chcName}>{chc.name}</Text>
              <Text style={styles.chcDetails}>{chc.equipment} · ₹{chc.price}/day</Text>
            </View>
            <View style={styles.chcDistance}>
              <Text style={styles.distanceText}>{chc.distance}</Text>
              <Text style={styles.distanceLabel}>km away</Text>
            </View>
          </View>
        ))}

        <Text style={styles.moreText}>+ 12 more CHCs nearby</Text>
      </View>

      {/* CTA buttons */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push('/(auth)/phone')}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>பதிவு செய்யுங்கள் — Book Now</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.push('/(auth)/phone')}
          activeOpacity={0.85}
        >
          <Text style={styles.secondaryBtnText}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const MOCK_CHCS = [
  { name: 'Kumar Agri Services', equipment: 'Mahindra Tractor', price: '2,500', distance: '2.4', icon: '🚜' },
  { name: 'Rajan CHC Centre', equipment: 'Harvester', price: '4,000', distance: '5.1', icon: '🌾' },
  { name: 'Selvi Farm Tools', equipment: 'Mini Tractor', price: '1,800', distance: '7.8', icon: '🚜' },
]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  header: {
    backgroundColor: Colors.green[800],
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: Spacing['3xl'],
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  logoIcon: {
    fontSize: 36,
  },
  logoText: {
    fontSize: Typography['4xl'],
    fontWeight: Typography.extrabold,
    color: Colors.white,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: Typography.base,
    color: Colors.green[100],
    fontWeight: Typography.medium,
  },
  taglineEn: {
    fontSize: Typography.sm,
    color: Colors.green[100],
    opacity: 0.8,
    marginTop: 2,
  },
  previewContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing['2xl'],
  },
  previewLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.md,
  },
  greenDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.green[600],
  },
  previewLabelText: {
    fontSize: Typography.sm,
    color: Colors.gray[700],
    fontWeight: Typography.medium,
  },
  chcCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  chcIconBox: {
    width: 48,
    height: 48,
    borderRadius: Radius.sm,
    backgroundColor: Colors.green[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  chcIcon: {
    fontSize: 24,
  },
  chcInfo: {
    flex: 1,
  },
  chcName: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.black,
    marginBottom: 2,
  },
  chcDetails: {
    fontSize: Typography.sm,
    color: Colors.gray[500],
  },
  chcDistance: {
    alignItems: 'flex-end',
  },
  distanceText: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.green[800],
  },
  distanceLabel: {
    fontSize: Typography.xs,
    color: Colors.gray[500],
  },
  moreText: {
    textAlign: 'center',
    color: Colors.green[700],
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    marginTop: Spacing.sm,
  },
  ctaContainer: {
    padding: Spacing.lg,
    paddingBottom: 40,
    gap: Spacing.sm,
  },
  primaryBtn: {
    backgroundColor: Colors.green[800],
    borderRadius: Radius.lg,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: Colors.green[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    color: Colors.white,
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
  },
  secondaryBtn: {
    borderRadius: Radius.lg,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: Colors.green[800],
    fontSize: Typography.base,
    fontWeight: Typography.medium,
  },
})
