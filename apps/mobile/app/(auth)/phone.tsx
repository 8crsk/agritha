import { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native'
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { supabase } from '../../lib/supabase'
import { Colors, Typography, Spacing, Radius } from '../../constants/colors'

export default function PhoneScreen() {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendOTP = async () => {
    const cleaned = phone.replace(/\s/g, '')
    if (cleaned.length < 10) {
      Alert.alert('தவறான எண்', 'Please enter a valid 10-digit phone number')
      return
    }

    const fullPhone = cleaned.startsWith('+91') ? cleaned : `+91${cleaned}`
    setLoading(true)

    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/send-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
          },
          body: JSON.stringify({ phone: fullPhone, language: 'ta' }),
        }
      )

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      router.push({ pathname: '/(auth)/otp', params: { phone: fullPhone } })
    } catch (err: any) {
      Alert.alert('பிழை', err.message ?? 'Failed to send OTP. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.logoText}>🚜 Agritha</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>உங்கள் தொலைபேசி எண்</Text>
        <Text style={styles.subtitle}>Enter your phone number{'\n'}உங்கள் எண்ணை உள்ளிடுங்கள்</Text>

        {/* Phone input */}
        <View style={styles.inputContainer}>
          <View style={styles.countryCode}>
            <Text style={styles.flag}>🇮🇳</Text>
            <Text style={styles.code}>+91</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="98765 43210"
            placeholderTextColor={Colors.gray[300]}
            keyboardType="phone-pad"
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
            autoFocus
          />
        </View>

        <Text style={styles.hint}>
          📱 OTP will be sent via SMS in Tamil
        </Text>

        <TouchableOpacity
          style={[styles.sendBtn, (phone.length < 10 || loading) && styles.sendBtnDisabled]}
          onPress={handleSendOTP}
          disabled={phone.length < 10 || loading}
          activeOpacity={0.85}
        >
          {loading
            ? <ActivityIndicator color={Colors.white} />
            : <Text style={styles.sendBtnText}>OTP அனுப்பு — Send OTP</Text>
          }
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  backBtn: { padding: 4 },
  backArrow: { fontSize: 24, color: Colors.white },
  logoText: { fontSize: Typography.xl, fontWeight: Typography.bold, color: Colors.white },
  body: {
    flex: 1,
    padding: Spacing['3xl'],
    paddingTop: Spacing['4xl'],
  },
  title: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.extrabold,
    color: Colors.green[800],
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.base,
    color: Colors.gray[500],
    lineHeight: 24,
    marginBottom: Spacing['3xl'],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.green[800],
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 18,
    backgroundColor: Colors.green[100],
    borderRightWidth: 2,
    borderRightColor: Colors.green[800],
  },
  flag: { fontSize: 20 },
  code: { fontSize: Typography.lg, fontWeight: Typography.semibold, color: Colors.green[800] },
  input: {
    flex: 1,
    fontSize: Typography.xl,
    fontWeight: Typography.semibold,
    color: Colors.black,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 18,
    letterSpacing: 2,
  },
  hint: {
    fontSize: Typography.sm,
    color: Colors.gray[500],
    marginBottom: Spacing['4xl'],
  },
  sendBtn: {
    backgroundColor: Colors.green[800],
    borderRadius: Radius.lg,
    paddingVertical: 18,
    alignItems: 'center',
    elevation: 4,
  },
  sendBtnDisabled: { backgroundColor: Colors.gray[300], elevation: 0 },
  sendBtnText: {
    color: Colors.white,
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
  },
})
