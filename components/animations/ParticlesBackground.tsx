import React, { useEffect, useRef } from "react";
import { View, Animated, Dimensions, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const PARTICLE_COUNT = 8;

interface Particle {
  x: Animated.Value;
  y: Animated.Value;
  scale: Animated.Value;
  opacity: Animated.Value;
  rotate: Animated.Value;
  isLeft: boolean;
}

export const ParticlesBackground = () => {
  const particles = useRef<Particle[]>(
    Array(PARTICLE_COUNT)
      .fill(0)
      .map((_, index) => ({
        x: new Animated.Value(Math.random() * width),
        y: new Animated.Value(height),
        scale: new Animated.Value(0.4 + Math.random() * 0.2),
        opacity: new Animated.Value(0.3),
        rotate: new Animated.Value(Math.random() * 30 - 15),
        isLeft: index % 2 === 0,
      }))
  ).current;

  const animateParticle = (particle: Particle) => {
    const duration = 5000 + Math.random() * 3000;

    Animated.parallel([
      Animated.sequence([
        Animated.timing(particle.y, {
          toValue: -50,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(particle.y, {
          toValue: height,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(particle.opacity, {
          toValue: 0.5,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(particle.opacity, {
          toValue: 0,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      particle.y.setValue(height);
      particle.x.setValue(Math.random() * width);
      particle.rotate.setValue(Math.random() * 30 - 15);
      animateParticle(particle);
    });
  };

  useEffect(() => {
    particles.forEach((particle, index) => {
      setTimeout(() => {
        animateParticle(particle);
      }, index * 400);
    });
  }, []);

  return (
    <View
      style={[StyleSheet.absoluteFill, styles.container]}
      pointerEvents="none"
    >
      {particles.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
                { scale: particle.scale },
                {
                  rotate: particle.rotate.interpolate({
                    inputRange: [-15, 15],
                    outputRange: ["-15deg", "15deg"],
                  }),
                },
                { scaleX: particle.isLeft ? -1 : 1 },
              ],
              opacity: particle.opacity,
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
  particle: {
    position: "absolute",
  },
});
