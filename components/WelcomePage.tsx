import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, Animated, Dimensions } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";

const { width: screenWidth } = Dimensions.get("window");

export default function WelcomePage() {
  const [isReady, setIsReady] = useState(false);
  const titleScale = useRef(new Animated.Value(1)).current;
  const titlePosition = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(0.9)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const imageScale = useRef(new Animated.Value(0.8)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const imagePosition = useRef(new Animated.Value(-screenWidth)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isReady) {
      startAnimations();
    }
  }, [isReady]);

  const startAnimations = () => {
    // Animation du logo en boucle
    Animated.loop(
      Animated.sequence([
        // Entrée depuis la gauche
        Animated.timing(imagePosition, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        // Pause de 2 secondes
        Animated.delay(2000),
        // Sortie vers la droite
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
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 800,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 800,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  if (!isReady) {
    return null;
  }

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={["rgba(129, 1, 247, 0.1)", "transparent"]}
        className="absolute top-0 left-0 right-0 h-96"
      />

      <Animated.View
        className="flex-1 justify-center items-center"
        style={{
          transform: [
            { scale: titleScale },
            {
              translateY: titlePosition.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -100],
              }),
            },
          ],
        }}
      >
        <Text className="text-6xl font-bold text-purple font-fredoka mb-4">
          RunMate
        </Text>
        <Text className="text-xl text-white text-center font-kanit-semibold px-8">
          Trouvez votre partenaire de course idéal
        </Text>
      </Animated.View>

      <Animated.View
        className="absolute left-0 right-0 bottom-56 items-center"
        style={{
          opacity: imageOpacity,
          transform: [{ scale: imageScale }, { translateX: imagePosition }],
        }}
      >
        <LottieView
          source={require("../assets/videos/runner-icon.json")}
          autoPlay
          loop
          style={{ width: 192, height: 192 }}
        />
      </Animated.View>

      <Animated.View
        className="space-y-4 mb-12 px-8"
        style={{
          opacity: buttonOpacity,
          transform: [{ scale: buttonScale }],
        }}
      >
        <AnimatedPressable
          className="bg-purple py-4 rounded-full items-center shadow-lg shadow-purple/30"
          onPress={() => router.push("/(auth)/login")}
        >
          <Text className="text-base font-semibold text-white font-kanit-semibold">
            Se connecter
          </Text>
        </AnimatedPressable>

        <AnimatedPressable
          className="bg-transparent py-4 rounded-full items-center border-2 border-purple"
          onPress={() => router.push("/(auth)/signup")}
        >
          <Text className="text-base font-semibold text-purple font-kanit-semibold">
            Créer un compte
          </Text>
        </AnimatedPressable>
      </Animated.View>
    </View>
  );
}
