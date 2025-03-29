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
import LoadingScreen from "../LoadingScreen";

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
    <View className="bg-background">
      {/* Header */}
      <View className="bg-background">
        <View className="px-5 my-6">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <View className="w-1 h-6 bg-purple rounded-full mr-3" />
              <Text className="text-2xl font-kanit-semibold text-white">
                Vos matches
              </Text>
            </View>

            <Pressable
              onPress={() => router.push("/runner/filters")}
              className="bg-[#1e2429] p-2 rounded-xl flex-row items-center border border-gray-700"
            >
              <Ionicons name="filter" size={20} color="#8101f7" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Contenu principal */}
      <View className="pt-4">
        {isLoading ? (
          <LoadingScreen />
        ) : matches?.length === 0 ? (
          <View className="px-5 items-center space-y-4">
            <Text className="text-white text-center">
              Aucun match trouvé pour le moment
            </Text>
            <Pressable
              onPress={removeDistanceFilter}
              className="bg-purple px-6 py-3 rounded-full"
            >
              <Text className="text-white font-kanit font-semibold">
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
          </View>
        )}
      </View>
    </View>
  );
}
