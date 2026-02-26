import React, { useState, useRef, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";
import { useMatches } from "@/context/MatchesContext";
import { router, useFocusEffect } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import LoadingScreen from "@/components/LoadingScreen";
import WarmBackground from "@/components/ui/WarmBackground";
import GlassButton from "@/components/ui/GlassButton";
import SwipeCardStack, { SwipeCardStackRef } from "@/components/matches/SwipeCardStack";
import SwipeActionButtons from "@/components/matches/SwipeActionButtons";
import { useThemeColors } from "@/constants/theme";

export default function AllMatchesScreen() {
  const { matches, refreshMatches, isLoading } = useMatches();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const swipeRef = useRef<SwipeCardStackRef>(null);
  const translateX = useSharedValue(0);
  const { colors } = useThemeColors();

  useFocusEffect(
    React.useCallback(() => {
      if (isInitialLoad) {
        refreshMatches();
        setIsInitialLoad(false);
      }
    }, [isInitialLoad])
  );

  // Reset index when matches change (e.g. after filter or refresh)
  useEffect(() => {
    setCurrentIndex(0);
    translateX.value = 0;
  }, [matches]);

  const allSwiped = matches != null && matches.length > 0 && currentIndex >= matches.length;

  const handleRefresh = () => {
    setCurrentIndex(0);
    translateX.value = 0;
    refreshMatches();
  };

  const currentMatch = matches && currentIndex < matches.length ? matches[currentIndex] : null;

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
          /* Empty state */
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
        ) : allSwiped ? (
          /* All swiped state */
          <View className="flex-1 items-center justify-center px-6">
            <View
              className="w-20 h-20 rounded-full items-center justify-center mb-6"
              style={{ backgroundColor: colors.primary.subtle }}
            >
              <Ionicons name="checkmark-circle-outline" size={40} color={colors.primary.DEFAULT} />
            </View>
            <Text
              className="text-xl font-nunito-bold text-center mb-2"
              style={{ color: colors.text.primary }}
            >
              Tu as parcouru tous les profils !
            </Text>
            <Text
              className="text-sm font-nunito-medium text-center mb-6"
              style={{ color: colors.text.secondary }}
            >
              Reviens plus tard ou ajuste tes filtres pour decouvrir de nouveaux coureurs
            </Text>
            <View style={{ gap: 12, alignItems: "center" }}>
              <GlassButton
                title="Rafraichir"
                onPress={handleRefresh}
                icon={<Ionicons name="refresh-outline" size={18} color="white" />}
              />
              <GlassButton
                title="Ajuster les filtres"
                onPress={() => router.push("/runner/filters")}
                variant="secondary"
                icon={<Ionicons name="options-outline" size={18} color={colors.primary.DEFAULT} />}
              />
            </View>
          </View>
        ) : (
          /* Swipe stack */
          <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={{ flex: 1, paddingHorizontal: 16, paddingBottom: 8 }}>
              <View style={{ flex: 1 }}>
                <SwipeCardStack
                  ref={swipeRef}
                  matches={matches}
                  currentIndex={currentIndex}
                  onIndexChanged={setCurrentIndex}
                  translateX={translateX}
                />
              </View>

              {currentMatch && (
                <SwipeActionButtons
                  translateX={translateX}
                  onSkip={() => swipeRef.current?.swipeLeft()}
                  onProfile={() => router.push(`/runner/${currentMatch.user.id}`)}
                  onMessage={() => router.push(`/chat/${currentMatch.user.id}`)}
                />
              )}
            </View>
          </GestureHandlerRootView>
        )}
      </View>
    </WarmBackground>
  );
}
