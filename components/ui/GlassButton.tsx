import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TextStyle,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useThemeColors, radii, typography } from '@/constants/theme';
import PulseLoader from './PulseLoader';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  size?: 'sm' | 'md' | 'lg';
}

export default function GlassButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  size = 'md',
}: GlassButtonProps) {
  const { colors, gradients, shadows } = useThemeColors();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const heightMap = { sm: 40, md: 50, lg: 56 };
  const fontSizeMap = { sm: 14, md: 16, lg: 18 };
  const paddingMap = { sm: 16, md: 24, lg: 32 };

  const isDisabled = disabled || loading;

  if (variant === 'primary') {
    return (
      <AnimatedTouchable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        activeOpacity={0.9}
        style={[animatedStyle, { opacity: isDisabled ? 0.5 : 1 }, style]}
      >
        <LinearGradient
          colors={gradients.primaryButton as unknown as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.base,
            shadows.md,
            {
              height: heightMap[size],
              paddingHorizontal: paddingMap[size],
              borderRadius: radii.full,
            },
          ]}
        >
          {loading ? (
            <PulseLoader color="#FFFFFF" size={8} />
          ) : (
            <View style={styles.contentRow}>
              {icon && <View style={styles.iconLeft}>{icon}</View>}
              <Text
                style={[
                  styles.primaryText,
                  { fontSize: fontSizeMap[size] },
                  textStyle,
                ]}
              >
                {title}
              </Text>
            </View>
          )}
        </LinearGradient>
      </AnimatedTouchable>
    );
  }

  if (variant === 'secondary') {
    return (
      <AnimatedTouchable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        activeOpacity={0.8}
        style={[
          animatedStyle,
          styles.base,
          styles.secondary,
          shadows.sm,
          {
            height: heightMap[size],
            paddingHorizontal: paddingMap[size],
            borderRadius: radii.full,
            backgroundColor: colors.glass.light,
            borderColor: colors.glass.border,
            opacity: isDisabled ? 0.5 : 1,
          },
          style,
        ]}
      >
        {loading ? (
          <PulseLoader color={colors.primary.DEFAULT} size={8} />
        ) : (
          <View style={styles.contentRow}>
            {icon && <View style={styles.iconLeft}>{icon}</View>}
            <Text
              style={[
                styles.secondaryText,
                {
                  color: colors.primary.DEFAULT,
                  fontSize: fontSizeMap[size],
                },
                textStyle,
              ]}
            >
              {title}
            </Text>
          </View>
        )}
      </AnimatedTouchable>
    );
  }

  // ghost
  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        animatedStyle,
        styles.base,
        {
          height: heightMap[size],
          paddingHorizontal: paddingMap[size],
          borderRadius: radii.full,
          opacity: isDisabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <PulseLoader color={colors.primary.DEFAULT} size={8} />
      ) : (
        <View style={styles.contentRow}>
          {icon && <View style={styles.iconLeft}>{icon}</View>}
          <Text
            style={[
              styles.ghostText,
              {
                color: colors.primary.DEFAULT,
                fontSize: fontSizeMap[size],
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  secondary: {
    borderWidth: 1,
  },
  primaryText: {
    fontFamily: typography.label.fontFamily,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  secondaryText: {
    fontFamily: typography.label.fontFamily,
    fontWeight: '600',
  },
  ghostText: {
    fontFamily: typography.label.fontFamily,
    fontWeight: '600',
  },
});
