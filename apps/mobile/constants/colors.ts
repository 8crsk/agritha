// ─────────────────────────────────────────────
// Agritha Design System — Colors
// Dark green + Cream + Sunshine Yellow
// ─────────────────────────────────────────────

export const Colors = {
  // Primary
  green: {
    900: '#0D2B18',
    800: '#1F4D2E',  // Primary — deep paddy green
    700: '#2D6A40',
    600: '#3A8752',
    500: '#4CAF70',
    100: '#E8F5ED',
    50:  '#F0FAF3',
  },

  // Accent
  yellow: {
    500: '#F5C518',  // Sunshine yellow — harvest, prosperity
    400: '#F7D044',
    100: '#FEF9E7',
  },

  // Neutrals
  cream: '#FAF6EF',    // Background — warm, earthy
  white: '#FFFFFF',
  black: '#1A1A1A',    // Text — near black

  gray: {
    900: '#1A1A1A',
    700: '#4A4A4A',
    500: '#7A7A7A',
    300: '#CCCCCC',
    100: '#F5F5F5',
  },

  // Semantic
  success: '#2D6A40',
  error:   '#D32F2F',
  warning: '#F5C518',
  info:    '#1565C0',

  // Transparent overlays
  overlay: 'rgba(0,0,0,0.4)',
} as const

export const Typography = {
  // Font sizes — large for small screens in sunlight
  xs:   12,
  sm:   14,
  base: 16,
  lg:   18,
  xl:   20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,

  // Font weights
  normal:    '400' as const,
  medium:    '500' as const,
  semibold:  '600' as const,
  bold:      '700' as const,
  extrabold: '800' as const,
} as const

export const Spacing = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const

export const Radius = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   24,
  full: 9999,
} as const
