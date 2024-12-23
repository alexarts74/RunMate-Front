import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Animated,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";

export default function WelcomePage() {
  const [isReady, setIsReady] = useState(false);
  const titleScale = useRef(new Animated.Value(1)).current;
  const titlePosition = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const loaderOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Attendre que l'AuthenticationGuard soit prêt
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
    setTimeout(() => {
      Animated.timing(loaderOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();

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
      ]).start();
    }, 2000);
  };

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  if (!isReady) {
    return null;
  }

  return (
    <View className="flex-1 bg-[#12171b] p-6 justify-between">
      <Animated.View
        className="flex-1 justify-center items-center"
        style={{
          transform: [
            { scale: titleScale },
            {
              translateY: titlePosition.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -200],
              }),
            },
          ],
        }}
      >
        <Text className="text-5xl font-bold text-green mb-2.5">RunMate</Text>
        <Text className="text-lg text-white text-center px-5">
          Trouvez votre partenaire de course idéal
        </Text>
      </Animated.View>

      <Animated.View
        className="absolute left-0 right-0 bottom-32 items-center"
        style={{ opacity: loaderOpacity }}
      >
        <ActivityIndicator color="#b9f144" />
        <Text className="text-green mt-4 text-base">Chargement...</Text>
      </Animated.View>

      <Animated.View
        className="space-y-3 mb-12 px-8"
        style={{
          opacity: contentOpacity,
        }}
      >
        <AnimatedPressable
          className="bg-green py-3 rounded-full items-center"
          onPress={() => router.push("/(auth)/login")}
        >
          <Text className="text-sm font-semibold text-dark">Se connecter</Text>
        </AnimatedPressable>

        <AnimatedPressable
          className="bg-gray py-3 rounded-full items-center border border-white"
          onPress={() => router.push("/(auth)/signup")}
        >
          <Text className="text-sm font-semibold text-white">
            Créer un compte
          </Text>
        </AnimatedPressable>
      </Animated.View>
    </View>
  );
}
