import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  Image,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView as ExpoBlurView } from "expo-blur";
import { useAuth } from "@/context/AuthContext";
import { useMatches } from "@/context/MatchesContext";
import { useUnreadMessages } from "@/context/UnreadMessagesContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const HomepageScreen = () => {
  const { user } = useAuth();
  const { matches } = useMatches();
  const { unreadCount } = useUnreadMessages();
  const { width: screenWidth } = Dimensions.get("window");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Bonjour";
    if (hour >= 12 && hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  const mainSections = [
    {
      id: "matches",
      title: "Mes Matches",
      subtitle: `${matches?.length || 0} personnes`,
      icon: "heart",
      color: "#6067FC",
      gradient: ["#6067FC", "#80A4FD"],
      route: "/(app)/matches/all",
    },
    {
      id: "groups",
      title: "Mes Groupes",
      subtitle: "Communauté",
      icon: "people",
      color: "#0CDA1C",
      gradient: ["#0CDA1C", "#4CAF50"],
      route: "/(app)/groups/all",
    },
    {
      id: "events",
      title: "Événements",
      subtitle: "Prochains runs",
      icon: "calendar",
      color: "#261E58",
      gradient: ["#261E58", "#4A4A4A"],
      route: "/(app)/events/all",
    },
  ];

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        {/* Header compact */}
        <View className="px-5 pt-4 pb-6">
          {/* Barre de navigation */}
          <View className="flex-row items-center justify-between mb-8">
            {/* Logo */}
            <View className="flex-row items-center">
              <View 
                className="w-8 h-8 rounded-lg items-center justify-center mr-2"
                style={{ backgroundColor: "#261E58" }}
              >
                <Text className="text-white font-kanit-bold text-xs">RM</Text>
              </View>
              <Text className="text-gray-800 font-kanit-bold text-lg">RUNMATE</Text>
            </View>
            
            {/* Notifications et profil */}
            <View className="flex-row items-center" style={{ gap: 12 }}>
              <Pressable
                onPress={() => router.push("/messages")}
                className="relative"
              >
                <Ionicons name="notifications-outline" size={22} color="#6067FC" />
                {unreadCount > 0 && (
                  <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 items-center justify-center">
                    <Text className="text-white text-xs font-bold">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Text>
                  </View>
                )}
              </Pressable>
              
              <Pressable
                onPress={() => router.push("/profile")}
                className="w-8 h-8 rounded-lg overflow-hidden"
                style={{ backgroundColor: "#6067FC" }}
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

          {/* Section de bienvenue compacte */}
          <View className="items-center mb-6">
            {/* Icône plus petite */}
            <LinearGradient
              colors={["#6067FC", "#80A4FD"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="w-20 h-20 rounded-2xl items-center justify-center mb-4"
            >
              <Ionicons name="person" size={32} color="white" />
            </LinearGradient>
            
            <Text className="text-gray-800 font-kanit-bold text-2xl mb-1">
              {getGreeting()}
            </Text>
            <Text className="text-gray-600 font-kanit-medium text-base">
              {user?.first_name || "Runner"}
            </Text>
          </View>
        </View>

        {/* Contenu principal */}
        <View className="flex-1 px-5">
          {/* Titre compact */}
          <View className="items-center mb-6">
            <Text className="text-gray-800 font-kanit-bold text-xl">
              EXPLOREZ
            </Text>
          </View>

          {/* Cartes compactes */}
          <View className="space-y-3">
            {mainSections.map((section, index) => (
              <Pressable
                key={section.id}
                onPress={() => router.push(section.route as any)}
                className="relative overflow-hidden rounded-2xl"
                style={{
                  shadowColor: section.color,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <LinearGradient
                  colors={section.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ padding: 16 }}
                >
                  <View className="flex-row items-center">
                    {/* Icône compacte */}
                    <View 
                      className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                      style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                    >
                      <Ionicons 
                        name={section.icon as any} 
                        size={24} 
                        color="white" 
                      />
                    </View>
                    
                    {/* Contenu textuel */}
                    <View className="flex-1">
                      <Text className="text-white font-kanit-bold text-lg mb-1">
                        {section.title}
                      </Text>
                      <Text className="text-white/90 font-kanit-medium text-sm">
                        {section.subtitle}
                      </Text>
                    </View>
                    
                    {/* Flèche compacte */}
                    <View 
                      className="w-8 h-8 rounded-full items-center justify-center"
                      style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                    >
                      <Ionicons 
                        name="chevron-forward" 
                        size={16} 
                        color="white" 
                      />
                    </View>
                  </View>
                </LinearGradient>
              </Pressable>
            ))}
          </View>

          {/* Actions rapides compactes */}
          <View className="mt-8 mb-6">
            <View className="flex-row justify-center space-x-4">
              <Pressable
                onPress={() => router.push("/runner/filters")}
                className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-200"
                style={{
                  shadowColor: "#6067FC",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <View className="flex-row items-center">
                  <Ionicons name="search" size={16} color="#6067FC" />
                  <Text className="text-gray-700 font-kanit-semibold text-sm ml-2">
                    Rechercher
                  </Text>
                </View>
              </Pressable>
              
              <Pressable
                onPress={() => router.push("/(app)/events/create")}
                className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-200"
                style={{
                  shadowColor: "#0CDA1C",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <View className="flex-row items-center">
                  <Ionicons name="add" size={16} color="#0CDA1C" />
                  <Text className="text-gray-700 font-kanit-semibold text-sm ml-2">
                    Créer
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default HomepageScreen;
