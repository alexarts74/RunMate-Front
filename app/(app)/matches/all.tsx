import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  Dimensions,
  FlatList,
  ViewToken,
} from "react-native";
import { useMatches } from "@/context/MatchesContext";
import { MatchCard } from "@/components/matches/MatchCard";
import { router, useFocusEffect } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MatchUser } from "@/interface/Matches";
import LoadingScreen from "@/components/LoadingScreen";

export default function AllMatchesScreen() {
  const { matches, refreshMatches, isLoading } = useMatches();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

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
    <View className="flex-1 bg-background">
      <SafeAreaView className="bg-background">
        <View className="px-5 py-4 flex-row justify-between items-center border-b border-gray-700">
          <View className="flex-row items-center flex-1">
            <Pressable onPress={() => router.back()} className="mr-3">
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </Pressable>
            <Text className="text-2xl font-kanit-semibold text-white">
              Tous vos matches
            </Text>
          </View>

          <Pressable
            onPress={() => router.push("/runner/filters")}
            className="bg-background p-2 rounded-xl border border-gray-700"
          >
            <Ionicons name="filter" size={20} color="#126C52" />
          </Pressable>
        </View>
      </SafeAreaView>

      <View className="flex-1">
        {isLoading ? (
          <LoadingScreen />
        ) : matches?.length === 0 || matches === undefined ? (
          <View className="items-center justify-center px-6 py-12">
            <View className="p-6 rounded-2xl mb-6 items-center">
              <Ionicons
                name="search"
                size={60}
                color="#126C52"
                className="mb-4"
              />
              <Text className="text-white text-center text-lg font-kanit mb-3">
                Nous n'avons pas trouvé de coureurs correspondant à vos critères
                actuels. Essayez d'élargir vos critères de recherche.
              </Text>
            </View>
            <Pressable
              onPress={() => router.push("/runner/filters")}
              className="bg-purple rounded-full px-6 py-3 flex-row items-center"
            >
              <Ionicons
                name="location"
                size={18}
                color="white"
                style={{ marginRight: 8 }}
              />
              <Text className="text-white font-kanit font-semibold">
                Élargir la recherche
              </Text>
            </Pressable>
          </View>
        ) : (
          <View className="relative flex-1">
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
