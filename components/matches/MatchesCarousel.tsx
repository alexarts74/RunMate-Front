import {
  View,
  Text,
  Pressable,
  Dimensions,
  FlatList,
  ViewToken,
  Animated,
} from "react-native";
import React, { useState, useCallback } from "react";
import { useMatches } from "@/context/MatchesContext";
import { MatchCard } from "@/components/matches/MatchCard";
import { router, useFocusEffect } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MatchUser } from "@/interface/Matches";

export function MatchesCarousel() {
  const { matches, refreshMatches, isLoading } = useMatches();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // Configuration du carrousel
  const { width: screenWidth } = Dimensions.get("window");
  const ITEM_WIDTH = screenWidth * 0.8;
  const SPACING = screenWidth * 0.05;

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

  // Rendu d'un item du carrousel
  const renderItem = ({ item }: { item: MatchUser }) => (
    <View
      style={{
        width: ITEM_WIDTH,
        marginHorizontal: SPACING / 2,
      }}
    >
      <MatchCard match={item} />
    </View>
  );

  const removeDistanceFilter = () => {
    router.push("/runner/filters");
  };

  return (
    <View className="bg-[#12171b]">
      {/* Header */}
      <View className="bg-[#12171b] pt-12">
        <View className="flex-row justify-between items-center px-5 my-6">
          <Text className="text-2xl font-bold text-white">Vos matches</Text>
          <Pressable onPress={() => router.push("/runner/filters")}>
            <Ionicons name="filter" size={24} color="white" />
          </Pressable>
        </View>
      </View>

      {/* Contenu principal */}
      <View className="pt-4">
        {isLoading ? (
          <View className="px-5">
            <Text className="text-white text-center">Chargement...</Text>
          </View>
        ) : matches?.length === 0 ? (
          <View className="px-5 items-center space-y-4">
            <Text className="text-white text-center">
              Aucun match trouvé pour le moment
            </Text>
            <Pressable
              onPress={removeDistanceFilter}
              className="bg-green px-6 py-3 rounded-full"
            >
              <Text className="text-dark font-semibold">
                Élargir la recherche
              </Text>
            </Pressable>
          </View>
        ) : (
          <View className="">
            <FlatList
              data={matches}
              renderItem={renderItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={ITEM_WIDTH + SPACING}
              snapToAlignment="start"
              decelerationRate="fast"
              contentContainerStyle={{
                paddingHorizontal: screenWidth * 0.1,
              }}
              viewabilityConfig={viewabilityConfig}
              onViewableItemsChanged={onViewableItemsChanged}
            />

            {/* Indicateurs de pagination */}
            <View className="flex-row justify-center pt-4 space-x-2 pb-4">
              {matches.map((_, index) => (
                <View
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === activeIndex ? "bg-green" : "bg-gray"
                  }`}
                />
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
