import { Platform } from 'react-native';
import { useColorScheme } from 'react-native';

// ─── Color Palette ─────────────────────────────────────────────

export const palette = {
  primary: {
    DEFAULT: '#7B9E87',
    light: '#A8C4B2',
    dark: '#5A7B65',
    subtle: 'rgba(123, 158, 135, 0.12)',
    muted: 'rgba(123, 158, 135, 0.25)',
  },
  success: '#7CB88A',
  error: '#D4736E',
  warning: '#E5B867',
  info: '#8AADCF',
} as const;

export const lightColors = {
  primary: palette.primary,
  background: '#F8FAF8',
  surface: '#EDF2EE',
  elevated: '#FFFFFF',
  text: {
    primary: '#1A2820',
    secondary: '#4D5E53',
    tertiary: '#8A9B90',
    inverse: '#FFFFFF',
  },
  glass: {
    light: 'rgba(255,255,255,0.65)',
    medium: 'rgba(255,255,255,0.45)',
    heavy: 'rgba(255,255,255,0.85)',
    border: 'rgba(255,255,255,0.3)',
  },
  success: palette.success,
  error: palette.error,
  warning: palette.warning,
  info: palette.info,
} as const;

export const darkColors = {
  primary: palette.primary,
  background: '#141A16',
  surface: '#1E2A22',
  elevated: '#243029',
  text: {
    primary: '#E8F0EA',
    secondary: '#A8B8AE',
    tertiary: '#6B7B70',
    inverse: '#1A2820',
  },
  glass: {
    light: 'rgba(30,42,34,0.65)',
    medium: 'rgba(30,42,34,0.75)',
    heavy: 'rgba(36,48,41,0.85)',
    border: 'rgba(123,158,135,0.15)',
  },
  success: palette.success,
  error: palette.error,
  warning: palette.warning,
  info: palette.info,
} as const;

export type ThemeColors = typeof lightColors;

// ─── Gradients ─────────────────────────────────────────────────

export const gradients = {
  light: {
    warmBackground: ['#F8FAF8', '#EDF2EE', '#F8FAF8'] as const,
    primaryButton: ['#7B9E87', '#6A8E76'] as const,
    glassCard: ['rgba(255,255,255,0.7)', 'rgba(255,255,255,0.5)'] as const,
    imageOverlay: ['transparent', 'rgba(26, 40, 32, 0.6)'] as const,
    introGradient: ['rgba(123,158,135,0.15)', 'rgba(237,242,238,0.3)', 'transparent'] as const,
  },
  dark: {
    warmBackground: ['#141A16', '#1E2A22', '#141A16'] as const,
    primaryButton: ['#7B9E87', '#5A7B65'] as const,
    glassCard: ['rgba(36,48,41,0.7)', 'rgba(30,42,34,0.5)'] as const,
    imageOverlay: ['transparent', 'rgba(10, 16, 12, 0.7)'] as const,
    introGradient: ['rgba(123,158,135,0.1)', 'rgba(30,42,34,0.3)', 'transparent'] as const,
  },
} as const;

// ─── Shadows ───────────────────────────────────────────────────

const lightShadows = {
  sm: {
    shadowColor: '#5A7B65',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: '#5A7B65',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#5A7B65',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  glow: {
    shadowColor: '#7B9E87',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  avatar: {
    shadowColor: '#5A7B65',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
} as const;

const darkShadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  glow: {
    shadowColor: '#7B9E87',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  avatar: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
} as const;

export type ThemeShadows = typeof lightShadows;

// ─── Blur ──────────────────────────────────────────────────────

export const blur = {
  light: 20,
  medium: 40,
  heavy: 60,
} as const;

// ─── Radii ─────────────────────────────────────────────────────

export const radii = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  '2xl': 28,
  '3xl': 32,
  full: 9999,
} as const;

// ─── Typography ────────────────────────────────────────────────

export const typography = {
  h1: {
    fontFamily: 'Nunito-ExtraBold',
    fontSize: 28,
    lineHeight: 36,
  },
  h2: {
    fontFamily: 'Nunito-Bold',
    fontSize: 22,
    lineHeight: 30,
  },
  h3: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    lineHeight: 26,
  },
  body: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: 'Nunito-Medium',
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontFamily: 'Nunito-Regular',
    fontSize: 13,
    lineHeight: 18,
  },
  label: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    lineHeight: 20,
  },
  display: {
    fontFamily: 'Fredoka',
    fontSize: 36,
    lineHeight: 44,
  },
} as const;

// ─── Spacing ───────────────────────────────────────────────────

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
} as const;

// ─── Hook ──────────────────────────────────────────────────────

export function useThemeColors() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return {
    colors: isDark ? darkColors : lightColors,
    gradients: isDark ? gradients.dark : gradients.light,
    shadows: isDark ? darkShadows : lightShadows,
    isDark,
  };
}

// ─── Android glass fallback ────────────────────────────────────

export const isAndroid = Platform.OS === 'android';
