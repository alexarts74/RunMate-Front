import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '@/constants/theme';

interface WarmBackgroundProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  showCircles?: boolean;
}

export default function WarmBackground({
  children,
  style,
  showCircles = false,
}: WarmBackgroundProps) {
  const { gradients, colors } = useThemeColors();

  const circleColor = 'rgba(123,158,135,0.08)';

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={gradients.warmBackground as unknown as [string, string, ...string[]]}
        style={StyleSheet.absoluteFillObject}
      />
      {showCircles && (
        <>
          <View
            style={[
              styles.circle,
              styles.circleTopRight,
              { backgroundColor: circleColor },
            ]}
          />
          <View
            style={[
              styles.circle,
              styles.circleBottomLeft,
              { backgroundColor: circleColor },
            ]}
          />
          <View
            style={[
              styles.circle,
              styles.circleCenter,
              { backgroundColor: circleColor },
            ]}
          />
        </>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  circle: {
    position: 'absolute',
    borderRadius: 9999,
  },
  circleTopRight: {
    width: 300,
    height: 300,
    top: -80,
    right: -80,
  },
  circleBottomLeft: {
    width: 250,
    height: 250,
    bottom: -60,
    left: -60,
  },
  circleCenter: {
    width: 200,
    height: 200,
    top: '40%',
    right: -40,
  },
});
