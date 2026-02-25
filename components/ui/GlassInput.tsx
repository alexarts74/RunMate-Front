import React, { useState } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  StyleProp,
  Text,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useThemeColors, radii, typography } from '@/constants/theme';

interface GlassInputProps extends TextInputProps {
  icon?: React.ReactNode;
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export default function GlassInput({
  icon,
  label,
  error,
  containerStyle,
  style,
  ...inputProps
}: GlassInputProps) {
  const { colors, shadows, isDark } = useThemeColors();
  const [isFocused, setIsFocused] = useState(false);
  const glowOpacity = useSharedValue(0);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    glowOpacity.value = withTiming(1, { duration: 200 });
    inputProps.onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    glowOpacity.value = withTiming(0, { duration: 200 });
    inputProps.onBlur?.(e);
  };

  const glowStyle = useAnimatedStyle(() => ({
    borderColor: `rgba(123, 158, 135, ${0.1 + glowOpacity.value * 0.3})`,
    ...(!isDark && glowOpacity.value > 0
      ? {
          shadowColor: '#7B9E87',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: glowOpacity.value * 0.2,
          shadowRadius: 10,
        }
      : {}),
  }));

  return (
    <View style={containerStyle}>
      {label && (
        <Text
          style={[
            styles.label,
            { color: colors.text.secondary },
          ]}
        >
          {label}
        </Text>
      )}
      <AnimatedView
        style={[
          styles.inputContainer,
          shadows.sm,
          {
            backgroundColor: colors.glass.light,
            borderColor: error
              ? colors.error
              : isFocused
              ? colors.primary.DEFAULT
              : colors.glass.border,
          },
          glowStyle,
        ]}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          {...inputProps}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={colors.text.tertiary}
          style={[
            styles.input,
            {
              color: colors.text.primary,
            },
            icon ? { paddingLeft: 0 } : { paddingLeft: 16 },
            style,
          ]}
        />
      </AnimatedView>
      {error && (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: typography.label.fontFamily,
    fontSize: typography.label.fontSize,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
    minHeight: 50,
    overflow: 'hidden',
  },
  iconContainer: {
    paddingLeft: 14,
    paddingRight: 4,
  },
  input: {
    flex: 1,
    fontFamily: typography.body.fontFamily,
    fontSize: typography.body.fontSize,
    paddingVertical: 12,
    paddingRight: 16,
  },
  error: {
    fontFamily: typography.caption.fontFamily,
    fontSize: typography.caption.fontSize,
    marginTop: 4,
    marginLeft: 4,
  },
});
