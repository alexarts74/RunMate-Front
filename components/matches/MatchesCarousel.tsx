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

export function MatchesCarousel() {
  const { matches, refreshMatches, isLoading } = useMatches();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

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
    <View className="bg-background">
      {/* Header */}
      <View className="bg-background">
        <View className="px-5 pt-6 pb-2">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <View className="w-1 h-6 bg-purple rounded-full mr-3" />
              <Text className="text-2xl font-nunito-semibold text-white">
                Vos matches
              </Text>
            </View>

            <Pressable
              onPress={() => router.push("/runner/filters")}
              className="bg-background p-2 rounded-xl flex-row items-center border border-gray-700"
            >
              <Ionicons name="filter" size={20} color="#126C52" />
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
            <View className=" p-6 rounded-2xl mb-6 items-center">
              <Ionicons
                name="search"
                size={60}
                color="#126C52"
                className="mb-4"
              />
              <Text className="text-white text-center text-lg font-nunito mb-3">
                Nous n'avons pas trouvé de coureurs correspondant à vos critères
                actuels. Essayez d'élargir vos critères de recherche.
              </Text>
            </View>
            <Pressable
              onPress={removeDistanceFilter}
              className="bg-purple rounded-full px-6 py-3 flex-row items-center"
            >
              <Ionicons
                name="location"
                size={18}
                color="white"
                style={{ marginRight: 8 }}
              />
              <Text className="text-white font-nunito font-semibold">
                Élargir la recherche
              </Text>
            </Pressable>
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
                className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 5,
                }}
              >
                <Ionicons name="chevron-back" size={28} color="white" />
              </Pressable>
              <Pressable
                onPress={goToNext}
                className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 5,
                }}
              >
                <Ionicons name="chevron-forward" size={28} color="white" />
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
