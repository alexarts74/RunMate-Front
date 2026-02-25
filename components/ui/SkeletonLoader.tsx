import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { useThemeColors, radii } from '@/constants/theme';

interface SkeletonLoaderProps {
  variant?: 'card' | 'text' | 'avatar' | 'list-item';
  width?: number | string;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

function ShimmerBlock({
  width,
  height,
  borderRadius = radii.sm,
  style,
}: {
  width?: number | string;
  height: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const { isDark } = useThemeColors();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1200 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = isDark
      ? interpolateColor(
          progress.value,
          [0, 0.5, 1],
          ['#1E2A22', '#2A3830', '#1E2A22']
        )
      : interpolateColor(
          progress.value,
          [0, 0.5, 1],
          ['#EDF2EE', '#D8E4DA', '#EDF2EE']
        );
    return { backgroundColor };
  });

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

export default function SkeletonLoader({
  variant = 'text',
  width,
  height,
  style,
}: SkeletonLoaderProps) {
  if (variant === 'avatar') {
    const size = height || 48;
    return (
      <ShimmerBlock
        width={size}
        height={size}
        borderRadius={size / 2}
        style={style}
      />
    );
  }

  if (variant === 'card') {
    return (
      <View style={[styles.card, style]}>
        <ShimmerBlock width="100%" height={160} borderRadius={radii.lg} />
        <View style={styles.cardContent}>
          <ShimmerBlock width="60%" height={18} />
          <ShimmerBlock width="80%" height={14} style={styles.mt8} />
          <ShimmerBlock width="40%" height={14} style={styles.mt8} />
        </View>
      </View>
    );
  }

  if (variant === 'list-item') {
    return (
      <View style={[styles.listItem, style]}>
        <ShimmerBlock width={48} height={48} borderRadius={24} />
        <View style={styles.listItemContent}>
          <ShimmerBlock width="60%" height={16} />
          <ShimmerBlock width="40%" height={12} style={styles.mt8} />
        </View>
      </View>
    );
  }

  // text variant
  return (
    <ShimmerBlock
      width={width || '100%'}
      height={height || 16}
      style={style}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  mt8: {
    marginTop: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  listItemContent: {
    flex: 1,
    marginLeft: 12,
  },
});
