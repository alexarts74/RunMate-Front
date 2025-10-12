import React, { useEffect, useRef } from "react";
import { View, Animated, Dimensions, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const RUNNER_COUNT = 8;

interface Runner {
  x: Animated.Value;
  y: Animated.Value;
  scale: Animated.Value;
  opacity: Animated.Value;
  speed: number;
}

export const RunnerBackground = () => {
  const runners = useRef<Runner[]>(
    Array(RUNNER_COUNT)
      .fill(0)
      .map(() => ({
        x: new Animated.Value(-50),
        y: new Animated.Value(Math.random() * (height - 100) + 50),
        scale: new Animated.Value(0.5 + Math.random() * 0.3),
        opacity: new Animated.Value(0.2),
        speed: 8000 + Math.random() * 4000,
      }))
  ).current;

  const animateRunner = (runner: Runner) => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(runner.x, {
          toValue: width + 50,
          duration: runner.speed,
          useNativeDriver: true,
        }),
        Animated.timing(runner.x, {
          toValue: -50,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(runner.opacity, {
          toValue: 0.4,
          duration: runner.speed / 3,
          useNativeDriver: true,
        }),
        Animated.timing(runner.opacity, {
          toValue: 0.2,
          duration: runner.speed / 3,
          useNativeDriver: true,
        }),
        Animated.timing(runner.opacity, {
          toValue: 0,
          duration: runner.speed / 3,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      runner.y.setValue(Math.random() * (height - 100) + 50);
      animateRunner(runner);
    });
  };

  useEffect(() => {
    runners.forEach((runner, index) => {
      setTimeout(() => {
        animateRunner(runner);
      }, index * 1000);
    });
  }, []);

  return (
    <View
      style={[StyleSheet.absoluteFill, styles.container]}
      pointerEvents="none"
    >
      {runners.map((runner, index) => (
        <Animated.View
          key={index}
          style={[
            styles.runner,
            {
              transform: [
                { translateX: runner.x },
                { translateY: runner.y },
                { scale: runner.scale },
              ],
              opacity: runner.opacity,
            },
          ]}
        >
          <Ionicons name="walk" size={24} color="#401346" />
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 0,
  },
  runner: {
    position: "absolute",
  },
});
