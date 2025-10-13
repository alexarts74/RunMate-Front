import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  Animated,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MatchesSection } from "@/components/matches/MatchesSection";
import { GroupsSection } from "@/components/group/GroupsSection";
import { EventsSection } from "@/components/events/EventsSection";
import { useAuth } from "@/context/AuthContext";
import { useMatches } from "@/context/MatchesContext";
import { useUnreadMessages } from "@/context/UnreadMessagesContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const HomepageScreen = () => {
  const { user } = useAuth();
  const { matches } = useMatches();
  const { unreadCount } = useUnreadMessages();
  const [currentTime, setCurrentTime] = useState(new Date());
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return "Bonjour";
    if (hour >= 12 && hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  const getWeatherIcon = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 12) return "sunny";
    if (hour >= 12 && hour < 18) return "partly-sunny";
    if (hour >= 18 && hour < 22) return "cloudy";
    return "moon";
  };

  // Animations pour le header dynamique
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [160, 120],
    extrapolate: "clamp",
  });

  const infoOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const infoTranslateY = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [0, -30],
    extrapolate: "clamp",
  });

  // Données pour le défilement d'infos (fausses données pour l'instant)
  const [infoIndex, setInfoIndex] = useState(0);
  const weeklyKm = 23; // Fausse donnée
  const nextEvent = "Trail Mont-Blanc à 18h"; // Fausse donnée

  const infoItems = [
    { icon: "people", text: `${matches?.length || 0} matches disponibles` },
    { icon: "calendar", text: nextEvent },
    { icon: "speedometer", text: `${weeklyKm} km cette semaine` },
  ];

  // Auto-défilement des infos
  useEffect(() => {
    const interval = setInterval(() => {
      setInfoIndex((prev) => (prev + 1) % infoItems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [infoItems.length]);

  return (
    <View className="flex-1 bg-background">
      {/* Header animé */}
      <Animated.View style={{ height: headerHeight }}>
        <LinearGradient
          colors={["#480f47", "#311332"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ flex: 1 }}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <View className="px-5 py-4 flex-1">
              {/* Barre du haut - Profile, Notifications, Logo */}
              <View className="flex-row items-center justify-between mb-4">
                {/* Logo à gauche */}
                <Image
                  source={require("@/assets/images/run-mate-logo.png")}
                  className="w-8 h-8"
                  style={{ resizeMode: "contain" }}
                />

                {/* Nom de l'app au centre */}
                <Text className="text-white font-kanit-bold text-2xl">
                  RunMate
                </Text>

                {/* Notifications et Profile à droite */}
                <View className="flex-row items-center" style={{ gap: 12 }}>
                  {/* Cloche avec pastille */}
                  <Pressable
                    onPress={() => router.push("/messages")}
                    className="relative"
                  >
                    <Ionicons
                      name="notifications-outline"
                      size={24}
                      color="white"
                    />
                    {unreadCount > 0 && (
                      <View
                        className="absolute -top-1 -right-1 bg-red-500 rounded-full items-center justify-center"
                        style={{
                          minWidth: 18,
                          height: 18,
                          paddingHorizontal: 4,
                        }}
                      >
                        <Text className="text-white text-xs font-bold">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </Text>
                      </View>
                    )}
                  </Pressable>

                  {/* Profile rond */}
                  <Pressable
                    onPress={() => router.push("/profile")}
                    className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/20"
                  >
                    <Image
                      source={
                        user?.profile_image
                          ? { uri: user.profile_image }
                          : require("@/assets/images/react-logo.png")
                      }
                      className="w-full h-full"
                      style={{ resizeMode: "cover" }}
                    />
                  </Pressable>
                </View>
              </View>

              {/* Défilement d'infos - disparaît au scroll */}
              <Animated.View
                style={{
                  opacity: infoOpacity,
                  transform: [{ translateY: infoTranslateY }],
                }}
                className="flex-row items-center justify-center flex-1"
              >
                <Ionicons
                  name={infoItems[infoIndex].icon as any}
                  size={18}
                  color="#f0c2fe"
                  style={{ marginRight: 10 }}
                />
                <Text className="text-white font-kanit-medium text-base">
                  {infoItems[infoIndex].text}
                </Text>
              </Animated.View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </Animated.View>

      {/* Contenu scrollable */}
      <View
        className="flex-1 bg-background"
        style={{
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          marginTop: -8,
          overflow: "hidden",
        }}
      >
        <Animated.ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40, paddingTop: 16 }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {/* Section Matches */}
          <View className="bg-background">
            <MatchesSection />
          </View>

          {/* Séparateur avec titre */}
          <View className="mx-5 my-4">
            <View className="flex-row items-center mb-2">
              <View className="h-px bg-gray-700 flex-1" />
              <View className="h-px bg-gray-700 flex-1" />
            </View>
          </View>

          {/* Section Groupes */}
          <GroupsSection />

          {/* Séparateur avec titre */}
          <View className="mx-5 my-4">
            <View className="flex-row items-center mb-2">
              <View className="h-px bg-gray-700 flex-1" />
              <View className="h-px bg-gray-700 flex-1" />
            </View>
          </View>

          {/* Section Events */}
          <EventsSection />

          {/* Espace supplémentaire pour laisser voir qu'il y a plus */}
          <View className="h-32" />
        </Animated.ScrollView>
      </View>
    </View>
  );
};

export default HomepageScreen;
