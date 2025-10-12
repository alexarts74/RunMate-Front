import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, ScrollView, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MatchesSection } from "@/components/matches/MatchesSection";
import { GroupsSection } from "@/components/group/GroupsSection";
import { EventsSection } from "@/components/events/EventsSection";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const HomepageScreen = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

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

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <LinearGradient
        colors={["#480f47", "#311332"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 0 }}
      >
        <SafeAreaView>
          <View className="px-5 py-5">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-3xl font-kanit-semibold text-white mb-1">
                  {getGreeting()} {user?.first_name || "Runner"} !
                </Text>
                <View className="flex-row items-center">
                  <Ionicons
                    name={getWeatherIcon()}
                    size={16}
                    color="#f0c2fe"
                    style={{ marginRight: 6 }}
                  />
                  <Text className="text-gray-300 font-kanit text-sm">
                    Parfait pour courir maintenant
                  </Text>
                </View>
              </View>

              <Pressable
                className="bg-white/10 backdrop-blur-sm rounded-xl py-3 px-4 flex-row items-center"
                onPress={() => router.push("/create")}
              >
                <Ionicons
                  name="play"
                  size={18}
                  color="white"
                  style={{ marginRight: 6 }}
                />
                <Text className="text-white font-kanit-semibold text-sm">
                  Run
                </Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Contenu scrollable */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Section Matches */}
        <View className="bg-background">
          <MatchesSection />
        </View>

        {/* Séparateur avec titre */}
        <View className="mx-5 my-4">
          <View className="flex-row items-center mb-2">
            <View className="h-px bg-gray-700 flex-1" />
            {/* <Text className="text-gray-500 text-xs font-kanit px-3">
              GROUPES DE COURSE
            </Text> */}
            <View className="h-px bg-gray-700 flex-1" />
          </View>
        </View>

        {/* Section Groupes */}
        <GroupsSection />

        {/* Séparateur avec titre */}
        <View className="mx-5 my-4">
          <View className="flex-row items-center mb-2">
            <View className="h-px bg-gray-700 flex-1" />
            {/* <Text className="text-gray-500 text-xs font-kanit px-3">
              ÉVÉNEMENTS À VENIR
            </Text> */}
            <View className="h-px bg-gray-700 flex-1" />
          </View>
        </View>

        {/* Section Events */}
        <EventsSection />

        {/* Espace supplémentaire pour laisser voir qu'il y a plus */}
        <View className="h-32" />
      </ScrollView>
    </View>
  );
};

export default HomepageScreen;
