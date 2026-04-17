import { useState, useRef, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { Colors, Typography, Spacing, Radius } from '../../constants/colors'
import { useAuthStore } from '../../store/auth'

export default function OTPScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(30)
  const refs = useRef<(TextInput | null)[]>([])
  const { setUser } = useAuthStore()

  useEffect(() => {
    const interval = setInterval(() => {
      setResendTimer(t => (t > 0 ? t - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleChange = (val: string, idx: number) => {
    const newOtp = [...otp]
    newOtp[idx] = val
    setOtp(newOtp)
    if (val && idx < 5) refs.current[idx + 1]?.focus()
  }

  const handleBackspace = (val: string, idx: number) => {
    if (!val && idx > 0) refs.current[idx - 1]?.focus()
  }

  const handleVerify = async () => {
    const code = otp.join('')
    if (code.length < 6) return

    setLoading(true)
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/verify-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
          },
          body: JSON.stringify({ phone, otp: code }),
        }
      )

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      // Check if user already has a role
      router.replace('/(auth)/role')
    } catch (err: any) {
      Alert.alert('தவறான OTP', 'Invalid or expired code. Please try again.')
      setOtp(['', '', '', '', '', ''])
      refs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const fullCode = otp.join('')

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.logoText}>🚜 Agritha</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.smsIcon}>📱</Text>
        <Text style={styles.title}>OTP உள்ளிடுங்கள்</Text>
        <Text style={styles.subtitle}>
          Code sent to {phone}{'\n'}
          உங்கள் Tamil SMS சரிபார்க்கவும்
        </Text>

        {/* 6-box OTP input */}
        <View style={styles.otpRow}>
          {otp.map((digit, i) => (
            <TextInput
              key={i}
              ref={r => { refs.current[i] = r }}
              style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={v => handleChange(v, i)}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace') handleBackspace(digit, i)
              }}
              selectTextOnFocus
              autoFocus={i === 0}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.verifyBtn, (fullCode.length < 6 || loading) && styles.verifyBtnDisabled]}
          onPress={handleVerify}
          disabled={fullCode.length < 6 || loading}
          activeOpacity={0.85}
        >
          {loading
            ? <ActivityIndicator color={Colors.white} />
            : <Text style={styles.verifyBtnText}>சரிபார்க்கவும் — Verify</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity
          disabled={resendTimer > 0}
          onPress={() => { setResendTimer(30); router.back() }}
        >
          <Text style={[styles.resendText, resendTimer > 0 && styles.resendDisabled]}>
            {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
          </Text>
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
    alignItems: 'center',
  },
  smsIcon: { fontSize: 56, marginBottom: Spacing.lg },
  title: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.extrabold,
    color: Colors.green[800],
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.base,
    color: Colors.gray[500],
    lineHeight: 24,
    marginBottom: Spacing['4xl'],
    textAlign: 'center',
  },
  otpRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing['4xl'],
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderColor: Colors.gray[300],
    textAlign: 'center',
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: Colors.black,
    backgroundColor: Colors.white,
  },
  otpBoxFilled: {
    borderColor: Colors.green[800],
    backgroundColor: Colors.green[50],
  },
  verifyBtn: {
    backgroundColor: Colors.green[800],
    borderRadius: Radius.lg,
    paddingVertical: 18,
    alignItems: 'center',
    width: '100%',
    elevation: 4,
    marginBottom: Spacing.xl,
  },
  verifyBtnDisabled: { backgroundColor: Colors.gray[300], elevation: 0 },
  verifyBtnText: {
    color: Colors.white,
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
  },
  resendText: {
    fontSize: Typography.base,
    color: Colors.green[700],
    fontWeight: Typography.medium,
  },
  resendDisabled: { color: Colors.gray[300] },
})
