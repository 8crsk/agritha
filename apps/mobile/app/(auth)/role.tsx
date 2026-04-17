import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { Colors, Typography, Spacing, Radius } from '../../constants/colors'
import { useAuthStore } from '../../store/auth'

export default function RoleScreen() {
  const { setRole } = useAuthStore()

  const handleSelect = (role: 'farmer' | 'chc') => {
    setRole(role)
    if (role === 'farmer') router.replace('/(farmer)/home')
    else router.replace('/(chc)/dashboard')
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>🚜 Agritha</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>நீங்கள் யார்?{'\n'}Who are you?</Text>
        <Text style={styles.subtitle}>Select your role to get started</Text>

        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => handleSelect('farmer')}
          activeOpacity={0.85}
        >
          <Text style={styles.roleEmoji}>👨‍🌾</Text>
          <View style={styles.roleInfo}>
            <Text style={styles.roleName}>விவசாயி — Farmer</Text>
            <Text style={styles.roleDesc}>Book tractors, harvesters & more near you</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleCard, styles.roleCardCHC]}
          onPress={() => handleSelect('chc')}
          activeOpacity={0.85}
        >
          <Text style={styles.roleEmoji}>🏭</Text>
          <View style={styles.roleInfo}>
            <Text style={styles.roleName}>CHC Operator</Text>
            <Text style={styles.roleDesc}>List your machinery and get more bookings</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  header: {
    backgroundColor: Colors.green[800],
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: Spacing.lg,
  },
  logoText: { fontSize: Typography.xl, fontWeight: Typography.bold, color: Colors.white },
  body: {
    flex: 1,
    padding: Spacing['3xl'],
    paddingTop: Spacing['5xl'],
  },
  title: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.extrabold,
    color: Colors.green[800],
    marginBottom: Spacing.sm,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: Typography.base,
    color: Colors.gray[500],
    marginBottom: Spacing['4xl'],
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing['2xl'],
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.green[800],
    shadowColor: Colors.green[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    gap: Spacing.md,
  },
  roleCardCHC: {
    borderColor: Colors.yellow[500],
  },
  roleEmoji: { fontSize: 48 },
  roleInfo: { flex: 1 },
  roleName: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.black,
    marginBottom: 4,
  },
  roleDesc: {
    fontSize: Typography.sm,
    color: Colors.gray[500],
    lineHeight: 20,
  },
  arrow: {
    fontSize: Typography['2xl'],
    color: Colors.green[800],
    fontWeight: Typography.bold,
  },
})
