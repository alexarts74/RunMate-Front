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
import WarmBackground from "@/components/ui/WarmBackground";
import GlassCard from "@/components/ui/GlassCard";
import GlassAvatar from "@/components/ui/GlassAvatar";
import GlassButton from "@/components/ui/GlassButton";
import { useThemeColors } from "@/constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const HomepageScreen = () => {
  const { user } = useAuth();
  const { colors, gradients, shadows } = useThemeColors();

  if (user?.user_type === "organizer") {
    return <OrganizerHomepage />;
  }

  const { matches } = useMatches();
  const { unreadCount } = useUnreadMessages();

  const topMatches = useMemo(() => {
    if (!matches || matches.length === 0) return [];
    return [...matches]
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 5);
  }, [matches]);

  const recommendedProfiles = useMemo(() => {
    if (!matches || matches.length === 0) return [];
    return [...matches]
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 10);
  }, [matches]);

  return (
    <WarmBackground>
      <SafeAreaView className="flex-1" edges={["top"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Header */}
          <View className="px-6 pt-2 pb-4">
            <View className="flex-row items-center justify-between">
              <Pressable
                onPress={() => router.push("/(tabs)/profile")}
                className="flex-row items-center flex-1"
              >
                <GlassAvatar
                  uri={user?.profile_image}
                  size={44}
                  showRing
                  style={{ marginRight: 12 }}
                />
                <View>
                  <Text
                    className="font-nunito-medium text-xs"
                    style={{ color: colors.text.tertiary }}
                  >
                    Bienvenue
                  </Text>
                  <Text
                    className="font-nunito-bold text-base"
                    style={{ color: colors.text.primary }}
                  >
                    {user?.first_name || "Runner"}
                  </Text>
                </View>
              </Pressable>

              <View className="flex-row items-center" style={{ gap: 8 }}>
                <Pressable
                  onPress={() => router.push("/runner/filters")}
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{
                    backgroundColor: colors.glass.light,
                    ...shadows.sm,
                  }}
                >
                  <Ionicons
                    name="search"
                    size={18}
                    color={colors.primary.DEFAULT}
                  />
                </Pressable>
                <Pressable
                  onPress={() => router.push("/messages")}
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{
                    backgroundColor: colors.glass.light,
                    ...shadows.sm,
                  }}
                >
                  <Ionicons
                    name="chatbubble"
                    size={16}
                    color={colors.primary.DEFAULT}
                  />
                  {unreadCount > 0 && (
                    <View
                      className="absolute -top-0.5 -right-0.5 rounded-full min-w-[16px] h-[16px] items-center justify-center"
                      style={{ backgroundColor: colors.primary.DEFAULT }}
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

          {/* Hero — Matches (carte principale large) */}
          <View className="px-6 mb-5">
            <Pressable
              onPress={() => router.push("/(app)/matches/all" as any)}
              className="rounded-3xl overflow-hidden"
              style={{ height: 180, ...shadows.md }}
            >
              <LinearGradient
                colors={
                  gradients.primaryButton as unknown as [
                    string,
                    string,
                    ...string[]
                  ]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1, padding: 24, justifyContent: "space-between" }}
              >
                {/* Cercles décoratifs */}
                <View
                  style={{
                    position: "absolute",
                    top: -30,
                    right: -30,
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    backgroundColor: "rgba(255,255,255,0.1)",
                  }}
                />
                <View
                  style={{
                    position: "absolute",
                    bottom: -20,
                    right: 60,
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: "rgba(255,255,255,0.06)",
                  }}
                />

                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-white font-nunito-bold text-2xl">
                      Tes Matches
                    </Text>
                    <Text className="text-white/70 font-nunito-medium text-sm mt-1">
                      Trouve ton partenaire de course idéal
                    </Text>
                  </View>
                  <View
                    className="w-12 h-12 rounded-2xl items-center justify-center"
                    style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                  >
                    <Ionicons name="fitness" size={24} color="#fff" />
                  </View>
                </View>

                <View className="flex-row items-center justify-between">
                  {/* Avatars empilés des top matches */}
                  <View className="flex-row items-center">
                    {topMatches.length > 0 ? (
                      <>
                        <View className="flex-row" style={{ marginRight: 12 }}>
                          {topMatches.slice(0, 4).map((match, index) => (
                            <Image
                              key={match.user.id}
                              source={
                                match.user.profile_image
                                  ? { uri: match.user.profile_image }
                                  : require("@/assets/images/react-logo.png")
                              }
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: 18,
                                borderWidth: 2,
                                borderColor: "rgba(255,255,255,0.6)",
                                marginLeft: index === 0 ? 0 : -10,
                              }}
                            />
                          ))}
                        </View>
                        <Text className="text-white/90 font-nunito-semibold text-sm">
                          {matches?.length || 0} coureurs compatibles
                        </Text>
                      </>
                    ) : (
                      <Text className="text-white/80 font-nunito-medium text-sm">
                        Configure tes filtres pour découvrir des coureurs
                      </Text>
                    )}
                  </View>

                  <View
                    className="w-9 h-9 rounded-full items-center justify-center"
                    style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                  >
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                  </View>
                </View>
              </LinearGradient>
            </Pressable>
          </View>

          {/* Actions rapides — 3 colonnes horizontales */}
          <View className="px-6 mb-6">
            <View className="flex-row" style={{ gap: 10 }}>
              {/* Groupes */}
              <Pressable
                onPress={() => router.push("/(app)/groups/all" as any)}
                className="flex-1"
              >
                <GlassCard style={{ alignItems: "center", paddingVertical: 18 }} noPadding>
                  <View
                    className="w-12 h-12 rounded-2xl items-center justify-center mb-2.5"
                    style={{ backgroundColor: colors.primary.subtle }}
                  >
                    <Ionicons
                      name="people"
                      size={22}
                      color={colors.primary.DEFAULT}
                    />
                  </View>
                  <Text
                    className="font-nunito-bold text-sm"
                    style={{ color: colors.text.primary }}
                  >
                    Groupes
                  </Text>
                  <Text
                    className="font-nunito-medium text-[11px] mt-0.5"
                    style={{ color: colors.text.tertiary }}
                  >
                    Communautés
                  </Text>
                </GlassCard>
              </Pressable>

              {/* Événements */}
              <Pressable
                onPress={() => router.push("/(app)/events/all" as any)}
                className="flex-1"
              >
                <GlassCard style={{ alignItems: "center", paddingVertical: 18 }} noPadding>
                  <View
                    className="w-12 h-12 rounded-2xl items-center justify-center mb-2.5"
                    style={{ backgroundColor: colors.primary.subtle }}
                  >
                    <Ionicons
                      name="calendar"
                      size={22}
                      color={colors.primary.DEFAULT}
                    />
                  </View>
                  <Text
                    className="font-nunito-bold text-sm"
                    style={{ color: colors.text.primary }}
                  >
                    Événements
                  </Text>
                  <Text
                    className="font-nunito-medium text-[11px] mt-0.5"
                    style={{ color: colors.text.tertiary }}
                  >
                    Sorties running
                  </Text>
                </GlassCard>
              </Pressable>

              {/* Courses */}
              <Pressable
                onPress={() => router.push("/(app)/races/all" as any)}
                className="flex-1"
              >
                <GlassCard style={{ alignItems: "center", paddingVertical: 18 }} noPadding>
                  <View
                    className="w-12 h-12 rounded-2xl items-center justify-center mb-2.5"
                    style={{ backgroundColor: colors.primary.subtle }}
                  >
                    <Ionicons
                      name="trophy"
                      size={22}
                      color={colors.primary.DEFAULT}
                    />
                  </View>
                  <Text
                    className="font-nunito-bold text-sm"
                    style={{ color: colors.text.primary }}
                  >
                    Courses
                  </Text>
                  <Text
                    className="font-nunito-medium text-[11px] mt-0.5"
                    style={{ color: colors.text.tertiary }}
                  >
                    Officielles
                  </Text>
                </GlassCard>
              </Pressable>
            </View>
          </View>

          {/* Section Partenaires recommandés */}
          <View className="px-6 mb-3 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View
                className="w-1 h-5 rounded-full mr-2.5"
                style={{ backgroundColor: colors.primary.DEFAULT }}
              />
              <Text
                className="font-nunito-bold text-lg"
                style={{ color: colors.text.primary }}
              >
                Partenaires recommandés
              </Text>
            </View>
            <Pressable
              onPress={() => router.push("/(app)/matches/all" as any)}
              className="flex-row items-center px-3 py-1.5 rounded-full"
              style={{ backgroundColor: colors.primary.subtle }}
            >
              <Text
                className="font-nunito-semibold text-xs"
                style={{ color: colors.primary.DEFAULT }}
              >
                Tout voir
              </Text>
              <Ionicons
                name="chevron-forward"
                size={14}
                color={colors.primary.DEFAULT}
                style={{ marginLeft: 2 }}
              />
            </Pressable>
          </View>

          {/* Profils recommandés — cartes avec score */}
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
                  className="rounded-2xl overflow-hidden"
                  style={{ width: 155, height: 210, ...shadows.md }}
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
                    colors={
                      gradients.imageOverlay as unknown as [
                        string,
                        string,
                        ...string[]
                      ]
                    }
                    className="absolute inset-0"
                  />
                  {item.score !== undefined && (
                    <View
                      className="absolute top-2.5 left-2.5 rounded-full px-2.5 py-1 flex-row items-center"
                      style={{ backgroundColor: "rgba(123,158,135,0.85)" }}
                    >
                      <Ionicons name="heart" size={10} color="#fff" style={{ marginRight: 3 }} />
                      <Text className="text-white text-[11px] font-nunito-bold">
                        {Math.round(item.score)}%
                      </Text>
                    </View>
                  )}
                  <View className="absolute bottom-0 left-0 right-0 p-3">
                    <Text className="text-white font-nunito-bold text-base">
                      {item.user.first_name}, {item.user.age}
                    </Text>
                    <View className="flex-row items-center mt-0.5">
                      <Ionicons name="location-outline" size={12} color="rgba(255,255,255,0.7)" />
                      <Text className="text-white/75 font-nunito-medium text-xs ml-1">
                        {item.user.city || "—"}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              )}
            />
          ) : (
            <View className="px-6">
              <GlassCard>
                <View className="items-center py-4">
                  <Ionicons
                    name="fitness-outline"
                    size={32}
                    color={colors.primary.DEFAULT}
                  />
                  <Text
                    className="font-nunito-bold text-base text-center mt-3"
                    style={{ color: colors.text.primary }}
                  >
                    Aucun partenaire trouvé
                  </Text>
                  <Text
                    className="font-nunito-medium text-sm text-center mt-1"
                    style={{ color: colors.text.secondary }}
                  >
                    Complete ton profil pour matcher
                  </Text>
                </View>
              </GlassCard>
            </View>
          )}

          {/* CTA */}
          <View className="px-6 mt-6">
            <GlassButton
              title="Rechercher des coureurs"
              onPress={() => router.push("/runner/filters")}
              icon={<Ionicons name="search" size={18} color="#fff" />}
              size="lg"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </WarmBackground>
  );
};

export default HomepageScreen;
