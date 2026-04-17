import { useState, useEffect, useRef } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, ActivityIndicator, Dimensions, Platform,
} from 'react-native'
import { router } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { Colors, Typography, Spacing, Radius } from '../../constants/colors'
import { MapView, Marker, UrlTile } from 'react-native-maps'

const { height } = Dimensions.get('window')

// Fetch nearby CHCs from Supabase
async function fetchNearbyCHCs() {
  const { data, error } = await supabase
    .from('chc_profiles')
    .select(`
      id, name, description, address, district, rating, total_reviews, avatar_url,
      equipment (id, type, name, price_per_day, available)
    `)
    .limit(20)

  if (error) throw error
  return data ?? []
}

const EQUIPMENT_ICONS: Record<string, string> = {
  tractor: '🚜',
  harvester: '🌾',
  transport: '🚛',
  other: '⚙️',
}

export default function FarmerHome() {
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const { data: chcs = [], isLoading } = useQuery({
    queryKey: ['chcs'],
    queryFn: fetchNearbyCHCs,
  })

  const filtered = chcs.filter(c => {
    const matchSearch = search === '' || c.name.toLowerCase().includes(search.toLowerCase())
    const matchType = !selectedType || c.equipment?.some((e: any) => e.type === selectedType)
    return matchSearch && matchType
  })

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>வணக்கம் 👋</Text>
          <Text style={styles.headerTitle}>அருகில் உள்ள CHC கள்</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/(farmer)/profile')}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="CHC தேடுங்கள்... Search CHCs"
          placeholderTextColor={Colors.gray[300]}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersContent}
      >
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.value}
            style={[styles.chip, selectedType === f.value && styles.chipActive]}
            onPress={() => setSelectedType(selectedType === f.value ? null : f.value)}
          >
            <Text style={styles.chipText}>{f.icon} {f.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* OSM Map */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 10.7905,
            longitude: 78.7047,
            latitudeDelta: 1.5,
            longitudeDelta: 1.5,
          }}
        >
          <UrlTile
            urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            maximumZ={19}
            flipY={false}
          />
          {/* Demo CHC pins */}
          {DEMO_PINS.map((pin, i) => (
            <Marker
              key={i}
              coordinate={{ latitude: pin.lat, longitude: pin.lng }}
              title={pin.name}
              description={pin.equipment}
              onCalloutPress={() => router.push(`/chc/${pin.id}`)}
            >
              <View style={styles.pin}>
                <Text style={styles.pinIcon}>🚜</Text>
              </View>
            </Marker>
          ))}
        </MapView>
        <View style={styles.mapBadge}>
          <Text style={styles.mapBadgeText}>🟢 {filtered.length} CHCs near you</Text>
        </View>
      </View>

      {/* CHC Cards */}
      <ScrollView style={styles.cardsScroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>
          {selectedType ? `${FILTERS.find(f => f.value === selectedType)?.label} CHCs` : 'அனைத்து CHC கள்'}
        </Text>

        {isLoading && (
          <ActivityIndicator size="large" color={Colors.green[800]} style={{ marginTop: 32 }} />
        )}

        {filtered.length === 0 && !isLoading && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>No CHCs found. Try a different filter.</Text>
          </View>
        )}

        {filtered.map((chc: any) => (
          <TouchableOpacity
            key={chc.id}
            style={styles.chcCard}
            onPress={() => router.push(`/chc/${chc.id}`)}
            activeOpacity={0.85}
          >
            <View style={styles.chcCardLeft}>
              <View style={styles.chcIconBox}>
                <Text style={{ fontSize: 28 }}>
                  {EQUIPMENT_ICONS[chc.equipment?.[0]?.type ?? 'tractor']}
                </Text>
              </View>
            </View>
            <View style={styles.chcCardCenter}>
              <Text style={styles.chcName}>{chc.name}</Text>
              <Text style={styles.chcDistrict}>📍 {chc.district ?? 'Tamil Nadu'}</Text>
              <View style={styles.equipmentRow}>
                {chc.equipment?.slice(0, 2).map((e: any) => (
                  <View key={e.id} style={styles.equipBadge}>
                    <Text style={styles.equipBadgeText}>
                      {EQUIPMENT_ICONS[e.type]} {e.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.chcCardRight}>
              <Text style={styles.rating}>⭐ {chc.rating ?? '4.5'}</Text>
              <Text style={styles.price}>
                ₹{chc.equipment?.[0]?.price_per_day?.toLocaleString() ?? '2,500'}
              </Text>
              <Text style={styles.priceLabel}>/day</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  )
}

const FILTERS = [
  { value: 'tractor', label: 'Tractor', icon: '🚜' },
  { value: 'harvester', label: 'Harvester', icon: '🌾' },
  { value: 'transport', label: 'Transport', icon: '🚛' },
  { value: 'other', label: 'Other', icon: '⚙️' },
]

// Demo map pins for Tamil Nadu (will be replaced with real data)
const DEMO_PINS = [
  { id: '1', lat: 10.7905, lng: 78.7047, name: 'Kumar Agri Services', equipment: 'Tractor' },
  { id: '2', lat: 11.0168, lng: 76.9558, name: 'Rajan CHC', equipment: 'Harvester' },
  { id: '3', lat: 9.9252, lng: 78.1198, name: 'Madurai Farm Tools', equipment: 'Tractor' },
  { id: '4', lat: 13.0827, lng: 80.2707, name: 'Chennai AgriTech', equipment: 'Transport' },
  { id: '5', lat: 11.6643, lng: 78.1460, name: 'Salem CHC Centre', equipment: 'Harvester' },
]

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  header: {
    backgroundColor: Colors.green[800],
    paddingTop: 52,
    paddingBottom: 16,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: { fontSize: Typography.sm, color: Colors.green[100] },
  headerTitle: { fontSize: Typography['2xl'], fontWeight: Typography.bold, color: Colors.white },
  avatar: {
    width: 44, height: 44,
    borderRadius: 22,
    backgroundColor: Colors.green[700],
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 22 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    margin: Spacing.lg,
    marginBottom: Spacing.sm,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.gray[100],
    elevation: 2,
  },
  searchIcon: { fontSize: 18, marginRight: Spacing.sm },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: Typography.base,
    color: Colors.black,
  },
  filtersScroll: { maxHeight: 52 },
  filtersContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.gray[300],
  },
  chipActive: {
    backgroundColor: Colors.green[800],
    borderColor: Colors.green[800],
  },
  chipText: { fontSize: Typography.sm, fontWeight: Typography.medium, color: Colors.black },
  mapContainer: {
    height: height * 0.25,
    margin: Spacing.lg,
    marginTop: Spacing.sm,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    elevation: 4,
  },
  map: { flex: 1 },
  mapBadge: {
    position: 'absolute',
    top: 10, left: 10,
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    elevation: 2,
  },
  mapBadgeText: { fontSize: Typography.xs, fontWeight: Typography.semibold },
  pin: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 4,
    borderWidth: 2,
    borderColor: Colors.green[800],
    elevation: 4,
  },
  pinIcon: { fontSize: 20 },
  cardsScroll: { flex: 1, paddingHorizontal: Spacing.lg },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.black,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  emptyState: { alignItems: 'center', paddingTop: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: Typography.base, color: Colors.gray[500] },
  chcCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    gap: Spacing.md,
  },
  chcCardLeft: { justifyContent: 'flex-start' },
  chcIconBox: {
    width: 56, height: 56,
    borderRadius: Radius.md,
    backgroundColor: Colors.green[100],
    justifyContent: 'center', alignItems: 'center',
  },
  chcCardCenter: { flex: 1 },
  chcName: { fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.black, marginBottom: 2 },
  chcDistrict: { fontSize: Typography.xs, color: Colors.gray[500], marginBottom: 6 },
  equipmentRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  equipBadge: {
    backgroundColor: Colors.green[100],
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: Radius.full,
  },
  equipBadgeText: { fontSize: 10, color: Colors.green[800], fontWeight: Typography.medium },
  chcCardRight: { alignItems: 'flex-end', justifyContent: 'space-between' },
  rating: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Colors.black },
  price: { fontSize: Typography.xl, fontWeight: Typography.extrabold, color: Colors.green[800] },
  priceLabel: { fontSize: Typography.xs, color: Colors.gray[500] },
})
