import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { palette } from '@/constants/theme';

interface PulseLoaderProps {
  color?: string;
  size?: number;
}

export default function PulseLoader({
  color = palette.primary.DEFAULT,
  size = 8,
}: PulseLoaderProps) {
  const dot1 = useSharedValue(0.3);
  const dot2 = useSharedValue(0.3);
  const dot3 = useSharedValue(0.3);

  useEffect(() => {
    const duration = 400;
    const animate = (sv: Animated.SharedValue<number>, delay: number) => {
      sv.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1, { duration }),
            withTiming(0.3, { duration })
          ),
          -1,
          false
        )
      );
    };
    animate(dot1, 0);
    animate(dot2, 150);
    animate(dot3, 300);
  }, []);

  const style1 = useAnimatedStyle(() => ({
    opacity: dot1.value,
    transform: [{ scale: 0.7 + dot1.value * 0.3 }],
  }));
  const style2 = useAnimatedStyle(() => ({
    opacity: dot2.value,
    transform: [{ scale: 0.7 + dot2.value * 0.3 }],
  }));
  const style3 = useAnimatedStyle(() => ({
    opacity: dot3.value,
    transform: [{ scale: 0.7 + dot3.value * 0.3 }],
  }));

  const dotStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: color,
    marginHorizontal: size * 0.4,
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[dotStyle, style1]} />
      <Animated.View style={[dotStyle, style2]} />
      <Animated.View style={[dotStyle, style3]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
