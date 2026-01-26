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
import { useAuth } from "@/context/AuthContext";
import { useMatches } from "@/context/MatchesContext";
import { useUnreadMessages } from "@/context/UnreadMessagesContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { MatchUser } from "@/interface/Matches";
import { OrganizerHomepage } from "@/components/organizer/OrganizerHomepage";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_SIZE = (SCREEN_WIDTH - 48 - 12) / 2;

const ACCENT = "#F97316";

const HomepageScreen = () => {
  const { user } = useAuth();

  if (user?.user_type === "organizer") {
    return <OrganizerHomepage />;
  }

  const { matches } = useMatches();
  const { unreadCount } = useUnreadMessages();

  const recommendedProfiles = useMemo(() => {
    if (!matches || matches.length === 0) return [];
    return [...matches]
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 10);
  }, [matches]);

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1" edges={["top"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Header */}
          <View className="px-6 pt-2 pb-5">
            <View className="flex-row items-center justify-between">
              <Pressable
                onPress={() => router.push("/(tabs)/profile")}
                className="flex-row items-center flex-1"
              >
                <Image
                  source={
                    user?.profile_image
                      ? { uri: user.profile_image }
                      : require("@/assets/images/react-logo.png")
                  }
                  className="w-11 h-11 rounded-full mr-3"
                  style={{ resizeMode: "cover" }}
                />
                <View>
                  <Text className="text-neutral-400 font-nunito-medium text-xs">
                    Bienvenue
                  </Text>
                  <Text className="text-neutral-900 font-nunito-bold text-base">
                    {user?.first_name || "Runner"}
                  </Text>
                </View>
              </Pressable>

              <View className="flex-row items-center" style={{ gap: 8 }}>
                <Pressable
                  onPress={() => router.push("/runner/filters")}
                  className="w-10 h-10 rounded-full items-center justify-center bg-neutral-100"
                >
                  <Ionicons name="search" size={18} color="#525252" />
                </Pressable>
                <Pressable
                  onPress={() => router.push("/messages")}
                  className="w-10 h-10 rounded-full items-center justify-center bg-neutral-100"
                >
                  <Ionicons name="chatbubble" size={16} color="#525252" />
                  {unreadCount > 0 && (
                    <View
                      className="absolute -top-0.5 -right-0.5 rounded-full min-w-[16px] h-[16px] items-center justify-center"
                      style={{ backgroundColor: ACCENT }}
                    >
                      <Text className="text-white text-[9px] font-nunito-bold">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </Text>
                    </View>
                  )}
                </Pressable>
              </View>
            </View>
          </View>

          {/* Grid 2x2 */}
          <View className="px-6 mb-6">
            <View className="flex-row flex-wrap" style={{ gap: 12 }}>
              {/* Matches */}
              <Pressable
                onPress={() => router.push("/(app)/matches/all" as any)}
                className="rounded-3xl overflow-hidden"
                style={{
                  width: CARD_SIZE,
                  height: CARD_SIZE,
                  backgroundColor: ACCENT,
                }}
              >
                <View className="flex-1 p-5 justify-between">
                  <View
                    className="w-11 h-11 rounded-2xl items-center justify-center"
                    style={{ backgroundColor: "rgba(255,255,255,0.25)" }}
                  >
                    <Ionicons name="fitness" size={22} color="#fff" />
                  </View>
                  <View>
                    <Text className="text-white font-nunito-bold text-xl">
                      Matches
                    </Text>
                    <Text className="text-white/70 font-nunito-medium text-sm">
                      {matches?.length || 0} coureurs
                    </Text>
                  </View>
                </View>
              </Pressable>

              {/* Groupes */}
              <Pressable
                onPress={() => router.push("/(app)/groups/all" as any)}
                className="rounded-3xl overflow-hidden bg-neutral-100"
                style={{
                  width: CARD_SIZE,
                  height: CARD_SIZE,
                }}
              >
                <View className="flex-1 p-5 justify-between">
                  <View
                    className="w-11 h-11 rounded-2xl items-center justify-center bg-white"
                  >
                    <Ionicons name="people" size={22} color={ACCENT} />
                  </View>
                  <View>
                    <Text className="text-neutral-800 font-nunito-bold text-xl">
                      Groupes
                    </Text>
                    <Text className="text-neutral-400 font-nunito-medium text-sm">
                      Communautés
                    </Text>
                  </View>
                </View>
              </Pressable>

              {/* Events */}
              <Pressable
                onPress={() => router.push("/(app)/events/all" as any)}
                className="rounded-3xl overflow-hidden bg-neutral-100"
                style={{
                  width: CARD_SIZE,
                  height: CARD_SIZE,
                }}
              >
                <View className="flex-1 p-5 justify-between">
                  <View
                    className="w-11 h-11 rounded-2xl items-center justify-center bg-white"
                  >
                    <Ionicons name="calendar" size={22} color={ACCENT} />
                  </View>
                  <View>
                    <Text className="text-neutral-800 font-nunito-bold text-xl">
                      Événements
                    </Text>
                    <Text className="text-neutral-400 font-nunito-medium text-sm">
                      Sorties running
                    </Text>
                  </View>
                </View>
              </Pressable>

              {/* Courses */}
              <Pressable
                onPress={() => router.push("/(app)/races/all" as any)}
                className="rounded-3xl overflow-hidden bg-neutral-100"
                style={{
                  width: CARD_SIZE,
                  height: CARD_SIZE,
                }}
              >
                <View className="flex-1 p-5 justify-between">
                  <View
                    className="w-11 h-11 rounded-2xl items-center justify-center bg-white"
                  >
                    <Ionicons name="trophy" size={22} color={ACCENT} />
                  </View>
                  <View>
                    <Text className="text-neutral-800 font-nunito-bold text-xl">
                      Courses
                    </Text>
                    <Text className="text-neutral-400 font-nunito-medium text-sm">
                      Officielles
                    </Text>
                  </View>
                </View>
              </Pressable>
            </View>
          </View>

          {/* Section Partenaires */}
          <View className="px-6 mb-4 flex-row items-center justify-between">
            <Text className="text-neutral-900 font-nunito-bold text-lg">
              Partenaires recommandés
            </Text>
            <Pressable
              onPress={() => router.push("/(app)/matches/all" as any)}
              className="flex-row items-center"
            >
              <Text className="font-nunito-semibold text-sm" style={{ color: ACCENT }}>
                Tout voir
              </Text>
            </Pressable>
          </View>

          {/* Profils - Plus petits */}
          {recommendedProfiles.length > 0 ? (
            <FlatList
              data={recommendedProfiles}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
              keyExtractor={(item) => item.user.id.toString()}
              renderItem={({ item }: { item: MatchUser }) => (
                <Pressable
                  onPress={() => router.push(`/runner/${item.user.id}`)}
                  className="rounded-2xl overflow-hidden bg-neutral-100"
                  style={{ width: 150, height: 200 }}
                >
                  <Image
                    source={
                      item.user.profile_image
                        ? { uri: item.user.profile_image }
                        : require("@/assets/images/react-logo.png")
                    }
                    className="w-full h-full absolute"
                    style={{ resizeMode: "cover" }}
                  />

                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.7)"]}
                    className="absolute inset-0"
                  />

                  {item.score !== undefined && (
                    <View
                      className="absolute top-2 left-2 rounded-full px-2 py-1"
                      style={{ backgroundColor: ACCENT }}
                    >
                      <Text className="text-white text-[10px] font-nunito-bold">
                        {Math.round(item.score)}%
                      </Text>
                    </View>
                  )}

                  <View className="absolute bottom-0 left-0 right-0 p-3">
                    <Text className="text-white font-nunito-bold text-base">
                      {item.user.first_name}, {item.user.age}
                    </Text>
                    <Text className="text-white/80 font-nunito-medium text-xs">
                      {item.user.city || "—"}
                    </Text>
                  </View>
                </Pressable>
              )}
            />
          ) : (
            <View className="px-6">
              <View className="rounded-2xl p-6 items-center bg-neutral-100">
                <Ionicons name="fitness-outline" size={32} color={ACCENT} />
                <Text className="text-neutral-800 font-nunito-bold text-base text-center mt-3">
                  Aucun partenaire trouvé
                </Text>
                <Text className="text-neutral-500 font-nunito-medium text-sm text-center mt-1">
                  Complete ton profil pour matcher
                </Text>
              </View>
            </View>
          )}

          {/* CTA */}
          <View className="px-6 mt-6">
            <Pressable
              onPress={() => router.push("/runner/filters")}
              className="rounded-2xl py-4 flex-row items-center justify-center"
              style={{ backgroundColor: ACCENT }}
            >
              <Ionicons name="search" size={18} color="#fff" />
              <Text className="text-white font-nunito-bold text-sm ml-2">
                Rechercher des coureurs
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default HomepageScreen;
