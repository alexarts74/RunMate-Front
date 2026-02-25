import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, Animated, Dimensions, StyleSheet } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import WarmBackground from "@/components/ui/WarmBackground";
import GlassButton from "@/components/ui/GlassButton";
import { useThemeColors, radii } from "@/constants/theme";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface IntroScreenProps {
  onFinish?: () => void;
}

export function IntroScreen({ onFinish }: IntroScreenProps) {
  const { colors, gradients, shadows } = useThemeColors();

  const titleScale = useRef(new Animated.Value(1)).current;
  const titlePosition = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const imageScale = useRef(new Animated.Value(0.8)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const imagePosition = useRef(new Animated.Value(-screenWidth)).current;
  const buttonScale = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    startSplashAnimations();
    setTimeout(() => {
      setShowButtons(true);
      startButtonAnimations();
    }, 2000);
  }, []);

  const startSplashAnimations = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(imagePosition, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(imagePosition, {
          toValue: screenWidth,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.parallel([
      Animated.timing(titleScale, {
        toValue: 0.8,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(titlePosition, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(imageScale, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(imageOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const startButtonAnimations = () => {
    Animated.parallel([
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLoginPress = () => {
    router.push("/(auth)/login");
  };

  const handleSignupPress = () => {
    router.push("/(auth)/signup");
  };

  return (
    <WarmBackground showCircles>
      {/* Intro gradient overlay */}
      <LinearGradient
        colors={gradients.introGradient as unknown as [string, string, ...string[]]}
        style={StyleSheet.absoluteFill}
      />

      {/* Title */}
      <Animated.View
        className="absolute left-0 right-0 px-6"
        style={{
          top: 100,
          alignItems: "center",
          transform: [
            { scale: titleScale },
            {
              translateY: titlePosition.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -50],
              }),
            },
          ],
        }}
      >
        <Text
          className="text-7xl font-bold font-fredoka mb-6"
          style={styles.mainTitle}
        >
          <Text style={{ color: colors.primary.DEFAULT }}>Run</Text>
          <Text style={{ color: colors.text.primary }}>Mate</Text>
        </Text>

        <Text
          className="text-2xl text-center font-nunito-bold mb-3 px-4"
          style={{ color: colors.text.primary }}
        >
          Trouvez votre partenaire de course idéal
        </Text>
      </Animated.View>

      {/* Lottie animation */}
      <Animated.View
        className="absolute left-0 right-0 items-center"
        style={{
          top: screenHeight * 0.35,
          opacity: imageOpacity,
          transform: [{ scale: imageScale }, { translateX: imagePosition }],
        }}
      >
        <View style={styles.lottieContainer}>
          <LottieView
            source={require("../assets/videos/runner-icon.json")}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
        </View>
      </Animated.View>

      {/* Buttons */}
      {showButtons && (
        <Animated.View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            paddingHorizontal: 32,
            paddingBottom: 48,
            opacity: buttonOpacity,
            transform: [{ scale: buttonScale }],
          }}
        >
          <GlassButton
            title="Se connecter"
            onPress={handleLoginPress}
            variant="primary"
            size="lg"
            style={{ marginBottom: 16 }}
          />

          <GlassButton
            title="Créer un compte"
            onPress={handleSignupPress}
            variant="secondary"
            size="lg"
          />

          <Text
            className="text-sm text-center font-nunito mt-4"
            style={{ color: colors.text.secondary }}
          >
            Déjà un compte ?{" "}
            <Text
              className="font-nunito-bold"
              style={{ color: colors.primary.DEFAULT }}
              onPress={handleLoginPress}
            >
              Se connecter
            </Text>
          </Text>
        </Animated.View>
      )}
    </WarmBackground>
  );
}

const styles = StyleSheet.create({
  mainTitle: {
    letterSpacing: -2,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  lottieContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
});
