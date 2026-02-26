import React, { forwardRef, useImperativeHandle, useCallback } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  runOnJS,
  SharedValue,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import { MatchUser } from "@/interface/Matches";
import SwipeMatchCard from "./SwipeMatchCard";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;
const VELOCITY_THRESHOLD = 800;
const VERTICAL_DAMP = 0.3;

const SPRING_CONFIG = { damping: 20, stiffness: 200, mass: 0.8 };
const EXIT_SPRING = { damping: 25, stiffness: 180, mass: 0.5 };

export type SwipeCardStackRef = {
  swipeLeft: () => void;
  swipeRight: () => void;
};

type SwipeCardStackProps = {
  matches: MatchUser[];
  currentIndex: number;
  onIndexChanged: (index: number) => void;
  onSwipedLeft?: (match: MatchUser) => void;
  onSwipedRight?: (match: MatchUser) => void;
  onAllSwiped?: () => void;
  translateX: SharedValue<number>;
};

const SwipeCardStack = forwardRef<SwipeCardStackRef, SwipeCardStackProps>(
  (
    { matches, currentIndex, onIndexChanged, onSwipedLeft, onSwipedRight, onAllSwiped, translateX },
    ref
  ) => {
    const translateY = useSharedValue(0);

    const advanceIndex = useCallback(
      (direction: "left" | "right") => {
        const match = matches[currentIndex];
        if (direction === "left") {
          onSwipedLeft?.(match);
        } else {
          onSwipedRight?.(match);
        }

        const nextIndex = currentIndex + 1;
        if (nextIndex >= matches.length) {
          onAllSwiped?.();
        }
        onIndexChanged(nextIndex);
      },
      [currentIndex, matches, onIndexChanged, onSwipedLeft, onSwipedRight, onAllSwiped]
    );

    const triggerHaptic = useCallback(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, []);

    const resetPosition = useCallback(() => {
      "worklet";
      translateX.value = withSpring(0, SPRING_CONFIG);
      translateY.value = withSpring(0, SPRING_CONFIG);
    }, [translateX, translateY]);

    const swipeOff = useCallback(
      (direction: "left" | "right") => {
        "worklet";
        const targetX = direction === "left" ? -SCREEN_WIDTH * 1.5 : SCREEN_WIDTH * 1.5;
        translateX.value = withSpring(targetX, EXIT_SPRING, (finished) => {
          if (finished) {
            runOnJS(advanceIndex)(direction);
            translateX.value = 0;
            translateY.value = 0;
          }
        });
      },
      [translateX, translateY, advanceIndex]
    );

    useImperativeHandle(ref, () => ({
      swipeLeft: () => {
        triggerHaptic();
        swipeOff("left");
      },
      swipeRight: () => {
        triggerHaptic();
        swipeOff("right");
      },
    }));

    const panGesture = Gesture.Pan()
      .onUpdate((event) => {
        translateX.value = event.translationX;
        translateY.value = event.translationY * VERTICAL_DAMP;
      })
      .onEnd((event) => {
        const shouldSwipeRight =
          translateX.value > SWIPE_THRESHOLD || event.velocityX > VELOCITY_THRESHOLD;
        const shouldSwipeLeft =
          translateX.value < -SWIPE_THRESHOLD || event.velocityX < -VELOCITY_THRESHOLD;

        if (shouldSwipeRight) {
          runOnJS(triggerHaptic)();
          swipeOff("right");
        } else if (shouldSwipeLeft) {
          runOnJS(triggerHaptic)();
          swipeOff("left");
        } else {
          resetPosition();
        }
      });

    // Top card animated style
    const topCardStyle = useAnimatedStyle(() => {
      const rotation = interpolate(translateX.value, [-SCREEN_WIDTH, 0, SCREEN_WIDTH], [-15, 0, 15]);
      return {
        transform: [
          { translateX: translateX.value },
          { translateY: translateY.value },
          { rotate: `${rotation}deg` },
        ],
      };
    });

    // Second card — scales up as top card is dragged
    const secondCardStyle = useAnimatedStyle(() => {
      const absX = Math.abs(translateX.value);
      const scale = interpolate(absX, [0, SWIPE_THRESHOLD], [0.95, 1], "clamp");
      const ty = interpolate(absX, [0, SWIPE_THRESHOLD], [10, 0], "clamp");
      return {
        transform: [{ scale }, { translateY: ty }],
      };
    });

    // Third card — static
    const thirdCardStyle = useAnimatedStyle(() => {
      const absX = Math.abs(translateX.value);
      const scale = interpolate(absX, [0, SWIPE_THRESHOLD], [0.90, 0.95], "clamp");
      const ty = interpolate(absX, [0, SWIPE_THRESHOLD], [20, 10], "clamp");
      return {
        transform: [{ scale }, { translateY: ty }],
      };
    });

    if (currentIndex >= matches.length) {
      return null;
    }

    // Render up to 3 cards (bottom first, top last for z-order)
    const cardsToRender: { match: MatchUser; index: number; style: any; isTop: boolean }[] = [];

    // Third card (bottom of stack)
    if (currentIndex + 2 < matches.length) {
      cardsToRender.push({
        match: matches[currentIndex + 2],
        index: currentIndex + 2,
        style: thirdCardStyle,
        isTop: false,
      });
    }

    // Second card
    if (currentIndex + 1 < matches.length) {
      cardsToRender.push({
        match: matches[currentIndex + 1],
        index: currentIndex + 1,
        style: secondCardStyle,
        isTop: false,
      });
    }

    // Top card (interactive)
    cardsToRender.push({
      match: matches[currentIndex],
      index: currentIndex,
      style: topCardStyle,
      isTop: true,
    });

    return (
      <View style={styles.container}>
        {cardsToRender.map(({ match, index, style, isTop }) => {
          const card = (
            <Animated.View
              key={`swipe-card-${match.user.id}-${index}`}
              style={[styles.cardWrapper, style]}
              pointerEvents={isTop ? "auto" : "none"}
            >
              <SwipeMatchCard match={match} translateX={translateX} isTop={isTop} />
            </Animated.View>
          );

          if (isTop) {
            return (
              <GestureDetector key={`gesture-${match.user.id}-${index}`} gesture={panGesture}>
                {card}
              </GestureDetector>
            );
          }

          return card;
        })}
      </View>
    );
  }
);

SwipeCardStack.displayName = "SwipeCardStack";

export default SwipeCardStack;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardWrapper: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.92,
    height: "100%",
  },
});
