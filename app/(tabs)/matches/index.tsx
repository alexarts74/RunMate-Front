import React, { useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  Dimensions,
  ScrollView,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useAuth } from "@/context/AuthContext";
import { useMatches } from "@/context/MatchesContext";
import { useUnreadMessages } from "@/context/UnreadMessagesContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { MatchUser } from "@/interface/Matches";

const HomepageScreen = () => {
  const { user } = useAuth();
  const { matches } = useMatches();
  const { unreadCount } = useUnreadMessages();
  const { width: screenWidth } = Dimensions.get("window");

  // Trier les matches par score de compatibilité (meilleurs en premier)
  const recommendedProfiles = useMemo(() => {
    if (!matches || matches.length === 0) return [];
    
    return [...matches]
      .sort((a, b) => {
        const scoreA = a.score || 0;
        const scoreB = b.score || 0;
        return scoreB - scoreA;
      })
      .slice(0, 10); // Prendre les 10 meilleurs
  }, [matches]);

  const mainSections = [
    {
      id: "matches",
      title: "Mes Matches",
      subtitle: `${matches?.length || 0} personnes`,
      icon: "heart",
      gradient: ["#FF6B4A", "#FF8E75"],
      route: "/(app)/matches/all",
      bgIcon: "heart-circle",
    },
    {
      id: "groups",
      title: "Mes Groupes",
      subtitle: "Communauté active",
      icon: "people",
      gradient: ["#A78BFA", "#C4AFFF"],
      route: "/(app)/groups/all",
      bgIcon: "people-circle",
    },
    {
      id: "events",
      title: "Événements",
      subtitle: "Prochains runs",
      icon: "calendar",
      gradient: ["#FF6B4A", "#A78BFA"],
      route: "/(app)/events/all",
      bgIcon: "calendar-circle",
    },
  ];

  return (
    <View className="flex-1 bg-fond">
      <SafeAreaView className="flex-1" edges={['top']} style={{ flex: 1 }}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 0 }}
          style={{ flex: 1 }}
        >
          {/* Header simplifié */}
          <View className="px-6 pt-2 pb-4">
            <View className="flex-row items-center justify-between">
              {/* Logo moderne */}
            <View className="flex-row items-center">
                <LinearGradient
                  colors={["#FF6B4A", "#A78BFA"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="w-9 h-9 rounded-xl items-center justify-center mr-2"
              >
                <Text className="text-white font-kanit-bold text-xs">RM</Text>
                </LinearGradient>
                <Text className="text-gray-900 font-kanit-bold text-lg">
                  RunMate
                </Text>
            </View>
            
              {/* Actions header */}
            <View className="flex-row items-center" style={{ gap: 12 }}>
              <Pressable
                onPress={() => router.push("/messages")}
                className="relative"
              >
                  <Ionicons name="notifications-outline" size={22} color="#FF6B4A" />
                {unreadCount > 0 && (
                    <View className="absolute -top-1 -right-1 bg-primary rounded-full w-4 h-4 items-center justify-center border-2 border-fond">
                      <Text className="text-white text-xs font-kanit-bold">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Text>
                  </View>
                )}
              </Pressable>
              
              <Pressable
                onPress={() => router.push("/profile")}
                  className="w-9 h-9 rounded-full overflow-hidden border border-primary"
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
          </View>

          {/* Cartes principales - Design moderne */}
          <View className="px-6 mb-6">
            <View style={{ gap: 20 }}>
            {mainSections.map((section, index) => (
              <Pressable
                key={section.id}
                onPress={() => router.push(section.route as any)}
                  className="relative overflow-hidden rounded-3xl"
                style={{
                    height: 140,
                    shadowColor: section.gradient[0],
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.12,
                    shadowRadius: 12,
                    elevation: 6,
                }}
              >
                <LinearGradient
                  colors={section.gradient as [string, string, ...string[]]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                    className="flex-1"
                  >
                    {/* Contenu de la carte */}
                    <View className="flex-1 p-5 justify-between">
                      {/* Header de la carte */}
                      <View className="flex-row items-start justify-between">
                    <View className="flex-1">
                          <Text className="text-white font-kanit-bold text-xl mb-1">
                        {section.title}
                      </Text>
                          <Text className="text-white font-kanit-medium text-sm">
                        {section.subtitle}
                      </Text>
                    </View>
                    
                        {/* Icône décorative en arrière-plan */}
                    <View 
                          className="w-16 h-16 rounded-xl items-center justify-center"
                          style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                    >
                      <Ionicons 
                            name={section.icon as any} 
                            size={32} 
                        color="white" 
                      />
                    </View>
                  </View>

                      {/* Footer de la carte */}
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <Text className="text-white/80 font-kanit-medium text-xs">
                            Découvrir
                          </Text>
                          <Ionicons 
                            name="arrow-forward" 
                            size={16} 
                            color="white" 
                            style={{ marginLeft: 6 }}
                          />
                        </View>
                        
                        {/* Points décoratifs */}
                        <View className="flex-row" style={{ gap: 4 }}>
                          <View className="w-1.5 h-1.5 rounded-full bg-white/40" />
                          <View className="w-1.5 h-1.5 rounded-full bg-white/60" />
                          <View className="w-1.5 h-1.5 rounded-full bg-white" />
                        </View>
                      </View>
                    </View>

                    {/* Effet de brillance */}
                    <View 
                      className="absolute top-0 right-0 w-32 h-32 rounded-full"
                      style={{ 
                        backgroundColor: "rgba(255,255,255,0.1)",
                        transform: [{ translateX: 40 }, { translateY: -40 }]
                      }}
                    />
                </LinearGradient>
              </Pressable>
            ))}
          </View>
          </View>

          {/* Section Profils Recommandés */}
          {recommendedProfiles.length > 0 && (
            <View className="mb-6">
              <View className="px-6 mb-4">
                <Text className="text-gray-900 font-kanit-bold text-xl mb-1">
                  Profils recommandés
                </Text>
                <Text className="text-gray-500 font-kanit-medium text-sm">
                  Basé sur votre compatibilité
                </Text>
              </View>

              <FlatList
                data={recommendedProfiles}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}
                keyExtractor={(item) => item.user.id.toString()}
                renderItem={({ item }: { item: MatchUser }) => (
                  <Pressable
                    onPress={() => router.push(`/runner/${item.user.id}`)}
                    className="relative overflow-hidden rounded-2xl"
                    style={{
                      width: screenWidth * 0.7,
                      height: 240,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.15,
                      shadowRadius: 12,
                      elevation: 6,
                    }}
                  >
                    {/* Image de fond */}
                    <Image
                      source={
                        item.user.profile_image
                          ? { uri: item.user.profile_image }
                          : require("@/assets/images/react-logo.png")
                      }
                      className="absolute w-full h-full"
                      style={{ resizeMode: "cover" }}
                    />

                    {/* Gradient pour le texte */}
                    <LinearGradient
                      colors={["transparent", "transparent", "rgba(0,0,0,0.6)"]}
                      className="absolute bottom-0 left-0 right-0 h-2/3"
                    />

                    {/* Badge de compatibilité */}
                    {item.score !== undefined && (
                      <View className="absolute top-4 right-4">
                        <BlurView
                          intensity={50}
                          tint="dark"
                          className="px-3 py-1.5 overflow-hidden rounded-full"
                        >
                          <View className="flex-row items-center">
                            <Ionicons name="star" size={12} color="#FFD700" />
                            <Text className="text-white text-xs font-kanit-bold ml-1">
                              {Math.round(item.score)}%
                            </Text>
                          </View>
                        </BlurView>
                      </View>
                    )}

                    {/* Contenu */}
                    <View className="flex-1 justify-end p-4">
                      <View>
                        <Text className="text-white font-kanit-bold text-2xl mb-1 drop-shadow-lg">
                          {item.user.first_name}
                        </Text>
                        <Text className="text-white/90 font-kanit-medium text-base mb-2 drop-shadow-lg">
                          {item.user.age} ans • {item.user.city}
                        </Text>
                        
                        {/* Distance si disponible */}
                        {item.distance_km && (
                          <View className="flex-row items-center">
                            <Ionicons name="location" size={14} color="#FF6B4A" />
                            <Text className="text-white/90 text-xs font-kanit-medium ml-1 drop-shadow-lg">
                              {item.distance_km} km
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </Pressable>
                )}
              />
            </View>
          )}

          {/* Actions rapides modernes */}
          <View className="px-6 pb-4">
            <View className="flex-row" style={{ gap: 12 }}>
              <Pressable
                onPress={() => router.push("/runner/filters")}
                className="flex-1 bg-white rounded-2xl px-5 py-4 flex-row items-center justify-center"
                style={{
                  shadowColor: "#FF6B4A",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <View 
                  className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                  style={{ backgroundColor: "#F6F0FA" }}
                >
                  <Ionicons name="search" size={20} color="#FF6B4A" />
                </View>
                <Text className="text-gray-800 font-kanit-bold text-base">
                  Rechercher
                </Text>
              </Pressable>
              
              <Pressable
                onPress={() => router.push("/(app)/events/create")}
                className="flex-1 bg-white rounded-2xl px-5 py-4 flex-row items-center justify-center"
                style={{
                  shadowColor: "#A78BFA",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <View 
                  className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                  style={{ backgroundColor: "#F6F0FA" }}
                >
                  <Ionicons name="add-circle" size={20} color="#A78BFA" />
                </View>
                <Text className="text-gray-800 font-kanit-bold text-base">
                  Créer
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default HomepageScreen;
