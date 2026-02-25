import {
  View,
  Text,
  Pressable,
  Dimensions,
  FlatList,
  ViewToken,
  Animated,
} from "react-native";
import React, { useState, useCallback, useRef } from "react";
import { useMatches } from "@/context/MatchesContext";
import { MatchCard } from "@/components/matches/MatchCard";
import { router, useFocusEffect } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MatchUser } from "@/interface/Matches";
import LoadingScreen from "../LoadingScreen";
import GlassButton from "@/components/ui/GlassButton";
import { useThemeColors, palette } from "@/constants/theme";

export function MatchesCarousel() {
  const { matches, refreshMatches, isLoading } = useMatches();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { colors, shadows } = useThemeColors();

  // Configuration du carrousel
  const { width: screenWidth } = Dimensions.get("window");
  const ITEM_WIDTH = screenWidth * 0.95;

  // Rafraîchir les matches au focus initial
  useFocusEffect(
    React.useCallback(() => {
      if (isInitialLoad) {
        refreshMatches();
        setIsInitialLoad(false);
      }
    }, [isInitialLoad])
  );

  // Configuration de la visibilité des items
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

  // Rendu d'un item du carrousel sans effet d'orientation
  const renderItem = ({ item, index }: { item: MatchUser; index: number }) => {
    const isActive = index === activeIndex;

    // Masquer les cartes non actives
    const opacity = isActive ? 1 : 0;

    const offset = (screenWidth - ITEM_WIDTH) / 2;

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
            height: 550, // Hauteur augmentée
            justifyContent: "flex-end", // Aligner les cartes en bas
          }}
        >
          <MatchCard match={item} />
        </View>
      </View>
    );
  };

  const removeDistanceFilter = () => {
    router.push("/runner/filters");
  };

  const goToPrevious = () => {
    if (matches && matches.length > 0) {
      let newIndex;
      if (activeIndex > 0) {
        newIndex = activeIndex - 1;
      } else {
        newIndex = matches.length - 1;
      }

      setActiveIndex(newIndex);
      flatListRef.current?.scrollToIndex({
        index: newIndex,
        animated: true,
      });
    }
  };

  const goToNext = () => {
    if (matches && matches.length > 0) {
      let newIndex;
      if (activeIndex < matches.length - 1) {
        newIndex = activeIndex + 1;
      } else {
        newIndex = 0;
      }

      setActiveIndex(newIndex);
      flatListRef.current?.scrollToIndex({
        index: newIndex,
        animated: true,
      });
    }
  };

  return (
    <View style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ backgroundColor: colors.background }}>
        <View className="px-5 pt-6 pb-2">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <View className="w-1 h-6 rounded-full mr-3" style={{ backgroundColor: colors.primary.DEFAULT }} />
              <Text style={{ color: colors.text.primary }} className="text-2xl font-nunito-semibold">
                Vos matches
              </Text>
            </View>

            <Pressable
              onPress={() => router.push("/runner/filters")}
              className="p-2 rounded-xl flex-row items-center"
              style={{
                backgroundColor: colors.glass.light,
                borderWidth: 1,
                borderColor: colors.glass.border,
              }}
            >
              <Ionicons name="filter" size={20} color={colors.primary.DEFAULT} />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Contenu principal */}

      <View>
        {isLoading ? (
          <LoadingScreen />
        ) : matches?.length === 0 || matches === undefined ? (
          <View className="items-center justify-center px-6 py-6">
            <View className="p-6 rounded-2xl mb-6 items-center">
              <Ionicons
                name="search"
                size={60}
                color={colors.primary.DEFAULT}
                style={{ marginBottom: 16 }}
              />
              <Text style={{ color: colors.text.primary }} className="text-center text-lg font-nunito mb-3">
                Nous n'avons pas trouvé de coureurs correspondant à vos critères
                actuels. Essayez d'élargir vos critères de recherche.
              </Text>
            </View>
            <GlassButton
              title="Élargir la recherche"
              onPress={removeDistanceFilter}
              icon={<Ionicons name="location" size={18} color="white" />}
            />
          </View>
        ) : (
          <View className="relative">
            {/* Boutons de navigation */}
            <View
              className="absolute top-1/2 left-0 right-0 flex-row justify-between px-4 z-10"
              style={{ marginTop: -24 }}
            >
              <Pressable
                onPress={goToPrevious}
                className="p-3 rounded-full"
                style={{
                  backgroundColor: colors.glass.medium,
                  borderWidth: 1,
                  borderColor: colors.glass.border,
                  ...shadows.md,
                }}
              >
                <Ionicons name="chevron-back" size={28} color={colors.text.primary} />
              </Pressable>
              <Pressable
                onPress={goToNext}
                className="p-3 rounded-full"
                style={{
                  backgroundColor: colors.glass.medium,
                  borderWidth: 1,
                  borderColor: colors.glass.border,
                  ...shadows.md,
                }}
              >
                <Ionicons name="chevron-forward" size={28} color={colors.text.primary} />
              </Pressable>
            </View>

            <FlatList
              ref={flatListRef}
              data={matches}
              renderItem={renderItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={screenWidth}
              snapToAlignment="center"
              decelerationRate="fast"
              pagingEnabled={true}
              viewabilityConfig={viewabilityConfig}
              onViewableItemsChanged={onViewableItemsChanged}
            />
          </View>
        )}
      </View>
    </View>
  );
}
