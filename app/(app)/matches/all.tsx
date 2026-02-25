import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  Dimensions,
  FlatList,
  ViewToken,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMatches } from "@/context/MatchesContext";
import { MatchCard } from "@/components/matches/MatchCard";
import { router, useFocusEffect } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MatchUser } from "@/interface/Matches";
import LoadingScreen from "@/components/LoadingScreen";
import WarmBackground from "@/components/ui/WarmBackground";
import GlassButton from "@/components/ui/GlassButton";
import { useThemeColors } from "@/constants/theme";

export default function AllMatchesScreen() {
  const { matches, refreshMatches, isLoading } = useMatches();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { colors, shadows } = useThemeColors();

  const { width: screenWidth } = Dimensions.get("window");
  const ITEM_WIDTH = screenWidth * 0.95;

  useFocusEffect(
    React.useCallback(() => {
      if (isInitialLoad) {
        refreshMatches();
        setIsInitialLoad(false);
      }
    }, [isInitialLoad])
  );

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 300,
  };

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]) {
        setActiveIndex(viewableItems[0].index || 0);
      }
    },
    []
  );

  const renderItem = ({ item, index }: { item: MatchUser; index: number }) => {
    const isActive = index === activeIndex;
    const opacity = isActive ? 1 : 0;

    return (
      <View
        style={{
          width: screenWidth,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: ITEM_WIDTH,
            opacity: opacity,
            height: 550,
            justifyContent: "flex-end",
          }}
        >
          <MatchCard match={item} />
        </View>
      </View>
    );
  };

  const goToPrevious = () => {
    if (matches && matches.length > 0) {
      let newIndex = activeIndex > 0 ? activeIndex - 1 : matches.length - 1;
      setActiveIndex(newIndex);
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
    }
  };

  const goToNext = () => {
    if (matches && matches.length > 0) {
      let newIndex = activeIndex < matches.length - 1 ? activeIndex + 1 : 0;
      setActiveIndex(newIndex);
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
    }
  };

  return (
    <WarmBackground>
      <SafeAreaView edges={["top"]}>
        {/* Header */}
        <View className="px-6 py-4 flex-row justify-between items-center">
          <View className="flex-row items-center flex-1">
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: colors.glass.light }}
            >
              <Ionicons name="arrow-back" size={20} color={colors.text.secondary} />
            </Pressable>
            <View className="flex-1">
              <Text
                className="text-xl font-nunito-bold"
                style={{ color: colors.text.primary }}
              >
                Tous les matches
              </Text>
              {matches && matches.length > 0 && (
                <Text
                  className="font-nunito-medium text-sm mt-0.5"
                  style={{ color: colors.text.tertiary }}
                >
                  {matches.length} coureur{matches.length > 1 ? "s" : ""} compatible{matches.length > 1 ? "s" : ""}
                </Text>
              )}
            </View>
          </View>

          <Pressable
            onPress={() => router.push("/runner/filters")}
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.primary.subtle }}
          >
            <Ionicons name="options-outline" size={20} color={colors.primary.DEFAULT} />
          </Pressable>
        </View>
      </SafeAreaView>

      <View className="flex-1">
        {isLoading ? (
          <LoadingScreen />
        ) : matches?.length === 0 || matches === undefined ? (
          <View className="flex-1 items-center justify-center px-6">
            <View
              className="w-20 h-20 rounded-full items-center justify-center mb-6"
              style={{ backgroundColor: colors.primary.subtle }}
            >
              <Ionicons name="search-outline" size={40} color={colors.primary.DEFAULT} />
            </View>
            <Text
              className="text-xl font-nunito-bold text-center mb-2"
              style={{ color: colors.text.primary }}
            >
              Aucun match trouve
            </Text>
            <Text
              className="text-sm font-nunito-medium text-center mb-6"
              style={{ color: colors.text.secondary }}
            >
              Essaie d'elargir tes criteres de recherche
            </Text>
            <GlassButton
              title="Ajuster les filtres"
              onPress={() => router.push("/runner/filters")}
              icon={<Ionicons name="options-outline" size={18} color="white" />}
            />
          </View>
        ) : (
          <View className="relative flex-1">
            {/* Position indicator */}
            {matches && matches.length > 1 && (
              <View className="absolute top-4 left-0 right-0 z-20 items-center">
                <View
                  className="px-4 py-2 rounded-full flex-row items-center"
                  style={{
                    backgroundColor: colors.glass.heavy,
                    ...shadows.sm,
                  }}
                >
                  <Ionicons name="person" size={14} color={colors.primary.DEFAULT} style={{ marginRight: 6 }} />
                  <Text className="font-nunito-bold text-sm" style={{ color: colors.text.primary }}>
                    {activeIndex + 1} / {matches.length}
                  </Text>
                </View>
              </View>
            )}

            {/* Compatibility score */}
            {matches && matches[activeIndex]?.score !== undefined && (
              <View className="absolute top-4 right-6 z-20">
                <View
                  className="px-3 py-2 rounded-full flex-row items-center"
                  style={{ backgroundColor: colors.primary.DEFAULT }}
                >
                  <Ionicons name="fitness" size={14} color="white" style={{ marginRight: 4 }} />
                  <Text className="text-white font-nunito-bold text-sm">
                    {Math.round(matches[activeIndex].score || 0)}%
                  </Text>
                </View>
              </View>
            )}

            {/* Navigation buttons */}
            {matches && matches.length > 1 && (
              <View className="absolute bottom-24 left-0 right-0 flex-row justify-between px-6 z-20">
                <Pressable
                  onPress={goToPrevious}
                  className="w-12 h-12 rounded-full items-center justify-center"
                  style={{
                    backgroundColor: colors.glass.heavy,
                    ...shadows.md,
                  }}
                >
                  <Ionicons name="chevron-back" size={24} color={colors.primary.DEFAULT} />
                </Pressable>
                <Pressable
                  onPress={goToNext}
                  className="w-12 h-12 rounded-full items-center justify-center"
                  style={{
                    backgroundColor: colors.glass.heavy,
                    ...shadows.md,
                  }}
                >
                  <Ionicons name="chevron-forward" size={24} color={colors.primary.DEFAULT} />
                </Pressable>
              </View>
            )}

            {/* Progress dots */}
            {matches && matches.length > 1 && matches.length <= 10 && (
              <View className="absolute bottom-10 left-0 right-0 z-10 flex-row justify-center" style={{ gap: 6 }}>
                {matches.map((_, index) => (
                  <View
                    key={index}
                    className="h-2 rounded-full"
                    style={{
                      width: index === activeIndex ? 24 : 8,
                      backgroundColor: index === activeIndex ? colors.primary.DEFAULT : colors.glass.medium,
                    }}
                  />
                ))}
              </View>
            )}

            <FlatList
              ref={flatListRef}
              data={matches}
              renderItem={renderItem}
              keyExtractor={(item, index) => `match-${item.user.id}-${index}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={screenWidth}
              snapToAlignment="center"
              decelerationRate="fast"
              pagingEnabled={true}
              viewabilityConfig={viewabilityConfig}
              onViewableItemsChanged={onViewableItemsChanged}
              contentContainerStyle={{ paddingVertical: 20, paddingBottom: 100 }}
            />

            {/* Action bar */}
            {matches && matches[activeIndex] && (
              <View
                className="absolute bottom-0 left-0 right-0 px-6 py-4"
                style={{
                  backgroundColor: colors.glass.heavy,
                  borderTopWidth: 1,
                  borderTopColor: colors.glass.border,
                }}
              >
                <View className="flex-row" style={{ gap: 12 }}>
                  <Pressable
                    onPress={() => router.push(`/runner/${matches[activeIndex].user.id}`)}
                    className="flex-1 py-3.5 rounded-2xl flex-row items-center justify-center"
                    style={{ backgroundColor: colors.glass.light }}
                  >
                    <Ionicons name="person-outline" size={18} color={colors.text.secondary} />
                    <Text
                      className="font-nunito-bold text-sm ml-2"
                      style={{ color: colors.text.secondary }}
                    >
                      Profil
                    </Text>
                  </Pressable>

                  <GlassButton
                    title="Message"
                    onPress={() => router.push(`/chat/${matches[activeIndex].user.id}`)}
                    icon={<Ionicons name="chatbubble-ellipses" size={18} color="white" />}
                    style={{ flex: 1 }}
                  />
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </WarmBackground>
  );
}
