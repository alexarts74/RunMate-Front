import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';
import GlassCard from './GlassCard';
import { useThemeColors, isAndroid } from '@/constants/theme';

interface GlassModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function GlassModal({
  visible,
  onClose,
  children,
  style,
}: GlassModalProps) {
  const { isDark } = useThemeColors();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Backdrop */}
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose}>
          {isAndroid ? (
            <Animated.View
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
              style={[styles.backdrop, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
            />
          ) : (
            <Animated.View
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
              style={StyleSheet.absoluteFillObject}
            >
              <BlurView
                intensity={30}
                tint={isDark ? 'dark' : 'light'}
                style={[styles.backdrop, { backgroundColor: 'rgba(0,0,0,0.3)' }]}
              />
            </Animated.View>
          )}
        </Pressable>

        {/* Content */}
        <Animated.View
          entering={ZoomIn.duration(250).springify()}
          exiting={ZoomOut.duration(200)}
          style={[styles.content, style]}
        >
          <GlassCard variant="heavy">{children}</GlassCard>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    width: '100%',
    maxWidth: 400,
  },
});
