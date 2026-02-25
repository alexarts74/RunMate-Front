import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { useThemeColors, radii, isAndroid } from '@/constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  variant?: 'light' | 'medium' | 'heavy';
  style?: StyleProp<ViewStyle>;
  noPadding?: boolean;
}

export default function GlassCard({
  children,
  variant = 'light',
  style,
  noPadding = false,
}: GlassCardProps) {
  const { colors, shadows, isDark } = useThemeColors();

  const blurIntensity = variant === 'heavy' ? 60 : variant === 'medium' ? 40 : 20;

  const glassBackground =
    variant === 'heavy'
      ? colors.glass.heavy
      : variant === 'medium'
      ? colors.glass.medium
      : colors.glass.light;

  const shadow = variant === 'heavy' ? shadows.lg : variant === 'medium' ? shadows.md : shadows.sm;

  if (isAndroid) {
    return (
      <View
        style={[
          styles.container,
          shadow,
          {
            backgroundColor: glassBackground,
            borderColor: colors.glass.border,
          },
          !noPadding && styles.padding,
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <View style={[styles.container, shadow, style]}>
      <BlurView
        intensity={blurIntensity}
        tint={isDark ? 'dark' : 'light'}
        style={[
          styles.blurContainer,
          !noPadding && styles.padding,
        ]}
      >
        <View
          style={[
            styles.overlay,
            {
              backgroundColor: glassBackground,
              borderColor: colors.glass.border,
            },
          ]}
        />
        <View style={styles.content}>{children}</View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  blurContainer: {
    overflow: 'hidden',
    borderRadius: radii.lg,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radii.lg,
    borderWidth: 1,
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
  padding: {
    padding: 16,
  },
});
