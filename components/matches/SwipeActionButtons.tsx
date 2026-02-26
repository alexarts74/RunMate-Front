import React from "react";
import { View, Pressable, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  interpolate,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useThemeColors } from "@/constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type SwipeActionButtonsProps = {
  translateX: SharedValue<number>;
  onSkip: () => void;
  onProfile: () => void;
  onMessage: () => void;
};

function ActionButton({
  size,
  onPress,
  children,
  style,
}: {
  size: number;
  onPress: () => void;
  children: React.ReactNode;
  style?: any;
}) {
  const pressScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  const handlePressIn = () => {
    pressScale.value = withSpring(0.90, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        },
        animatedStyle,
        style,
      ]}
    >
      {children}
    </AnimatedPressable>
  );
}

export default function SwipeActionButtons({
  translateX,
  onSkip,
  onProfile,
  onMessage,
}: SwipeActionButtonsProps) {
  const { colors, gradients, shadows } = useThemeColors();

  // Skip button scales up when swiping left
  const skipScaleStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
      [1.15, 1, 1],
      "clamp"
    );
    return { transform: [{ scale }] };
  });

  // Message button scales up when swiping right
  const messageScaleStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
      [1, 1, 1.15],
      "clamp"
    );
    return { transform: [{ scale }] };
  });

  return (
    <View style={styles.container}>
      {/* Skip button */}
      <Animated.View style={skipScaleStyle}>
        <ActionButton size={56} onPress={onSkip}>
          <View
            style={[
              styles.buttonBg,
              { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.error },
              shadows.md,
            ]}
          >
            <Ionicons name="close" size={28} color="white" />
          </View>
        </ActionButton>
      </Animated.View>

      {/* Profile button */}
      <ActionButton size={48} onPress={onProfile}>
        <View
          style={[
            styles.buttonBg,
            {
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: colors.glass.heavy,
              borderWidth: 1,
              borderColor: colors.glass.border,
            },
            shadows.sm,
          ]}
        >
          <Ionicons name="information-circle-outline" size={24} color={colors.primary.DEFAULT} />
        </View>
      </ActionButton>

      {/* Message button */}
      <Animated.View style={messageScaleStyle}>
        <ActionButton size={56} onPress={onMessage}>
          <LinearGradient
            colors={gradients.primaryButton as unknown as [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.buttonBg,
              { width: 56, height: 56, borderRadius: 28 },
              shadows.md,
            ]}
          >
            <Ionicons name="chatbubble-ellipses" size={28} color="white" />
          </LinearGradient>
        </ActionButton>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    paddingVertical: 16,
  },
  buttonBg: {
    justifyContent: "center",
    alignItems: "center",
  },
});
