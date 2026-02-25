import React from 'react';
import { View, Image, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useThemeColors } from '@/constants/theme';

interface GlassAvatarProps {
  uri: string | null | undefined;
  size?: number;
  showRing?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function GlassAvatar({
  uri,
  size = 48,
  showRing = false,
  style,
}: GlassAvatarProps) {
  const { colors, shadows } = useThemeColors();

  const ringSize = showRing ? size + 6 : size;

  return (
    <View
      style={[
        {
          width: ringSize,
          height: ringSize,
          borderRadius: ringSize / 2,
          alignItems: 'center',
          justifyContent: 'center',
          ...(showRing
            ? {
                borderWidth: 2,
                borderColor: colors.primary.light,
              }
            : {}),
        },
        shadows.avatar,
        style,
      ]}
    >
      <Image
        source={
          uri
            ? { uri }
            : require('@/assets/images/splaash.png')
        }
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.surface,
        }}
      />
    </View>
  );
}
