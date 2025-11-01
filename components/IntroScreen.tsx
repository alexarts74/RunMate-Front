import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, Animated, Dimensions, StyleSheet } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface IntroScreenProps {
  onFinish?: () => void;
}

export function IntroScreen({ onFinish }: IntroScreenProps) {
  // Animation values
  const titleScale = useRef(new Animated.Value(1)).current;
  const titlePosition = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const imageScale = useRef(new Animated.Value(0.8)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const imagePosition = useRef(new Animated.Value(-screenWidth)).current;
  const buttonScale = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  // État pour contrôler si les boutons doivent être affichés
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    // Première phase: animations du SplashScreen
    startSplashAnimations();

    // Après 2 secondes, déclencher l'apparition des boutons
    setTimeout(() => {
      setShowButtons(true);
      startButtonAnimations();
    }, 2000);
  }, []);

  const startSplashAnimations = () => {
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

    // Animations du titre et du contenu
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
    // Animation des boutons
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
    // Uniquement naviguer, ne pas appeler onFinish
    router.push("/(auth)/login");
  };

  const handleSignupPress = () => {
    // Uniquement naviguer, ne pas appeler onFinish
    router.push("/(auth)/signup");
  };

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  return (
    <View className="flex-1 bg-fond">
      {/* Gradient de fond amélioré */}
      <LinearGradient
        colors={[
          "rgba(255, 107, 74, 0.2)",
          "rgba(167, 139, 250, 0.15)",
          "rgba(255, 107, 74, 0.05)",
          "transparent",
        ]}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Cercles décoratifs en arrière-plan */}
      <View style={[styles.circleDecor, { top: 80, right: 32 }]} />
      <View style={[styles.circleDecor, { top: 240, left: 16, width: 160, height: 160 }]} />
      <View style={[styles.circleDecor, { bottom: 380, right: 48, width: 96, height: 96 }]} />

      {/* Titre principal en haut */}
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
          <Text className="text-primary">Run</Text>
          <Text className="text-gray-900">Mate</Text>
        </Text>
        
        <Text className="text-2xl text-gray-800 text-center font-kanit-bold mb-3 px-4">
          Trouvez votre partenaire de course idéal
        </Text>
        <Text className="text-base text-gray-600 text-center font-kanit px-4">
          Rejoignez une communauté passionnée de runners
        </Text>
      </Animated.View>

      {/* Animation Lottie centrée - Positionnée au milieu */}
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

      {/* Boutons améliorés */}
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
          {/* Bouton principal - Connexion */}
          <LinearGradient
            colors={["#FF6B4A", "#FF8C6A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.primaryButton, styles.buttonShadow]}
          >
            <AnimatedPressable
              onPress={handleLoginPress}
              style={styles.buttonInner}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text className="text-lg font-kanit-bold text-white mr-2">
                  Se connecter
                </Text>
                <Text style={{ fontSize: 18, color: "white" }}>→</Text>
              </View>
            </AnimatedPressable>
          </LinearGradient>

          {/* Bouton secondaire - Inscription */}
          <AnimatedPressable
            onPress={handleSignupPress}
            style={[styles.secondaryButton, styles.buttonShadowSecondary]}
          >
            <Text className="text-lg font-kanit-bold text-secondary">
              Créer un compte
            </Text>
          </AnimatedPressable>

          {/* Texte d'accès rapide */}
          <Text className="text-sm text-gray-500 text-center font-kanit mt-4">
            Déjà un compte ?{" "}
            <Text 
              className="text-primary font-kanit-bold"
              onPress={handleLoginPress}
            >
              Se connecter
            </Text>
          </Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  circleDecor: {
    position: "absolute",
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: "rgba(255, 107, 74, 0.08)",
  },
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
  floatingBadge: {
    position: "absolute",
    top: -20,
    right: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#A78BFA",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "white",
    shadowColor: "#A78BFA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButton: {
    borderRadius: 9999,
    marginBottom: 16,
    overflow: "hidden",
  },
  buttonShadow: {
    shadowColor: "#FF6B4A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  secondaryButton: {
    backgroundColor: "white",
    paddingVertical: 20,
    borderRadius: 9999,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(167, 139, 250, 0.3)",
  },
  buttonShadowSecondary: {
    shadowColor: "#A78BFA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonInner: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
