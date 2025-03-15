import React, { useEffect, useRef } from "react";
import { View, Animated, Dimensions } from "react-native";
import LottieView from "lottie-react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface LoadingScreenProps {
  backgroundColor?: string;
}

export default function LoadingScreen({}: LoadingScreenProps) {
  const imageScale = useRef(new Animated.Value(0.8)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startAnimations();
  }, []);

  const startAnimations = () => {
    // Animation d'apparition
    Animated.parallel([
      Animated.timing(imageScale, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(imageOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View
      className="absolute inset-0 items-center"
      style={{
        width: screenWidth,
        height: screenHeight,
        zIndex: 9999,
        opacity: 0.9,
        position: "absolute",
        paddingBottom: 280, // Hauteur de la tabbar
      }}
    >
      <View className="flex-1 justify-center">
        <Animated.View
          className="items-center"
          style={{
            opacity: imageOpacity,
            transform: [{ scale: imageScale }],
          }}
        >
          <LottieView
            source={require("../assets/videos/runner-icon.json")}
            autoPlay
            loop
            style={{ width: 120, height: 120 }}
          />
        </Animated.View>
      </View>
    </View>
  );
}
