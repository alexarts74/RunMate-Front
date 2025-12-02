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
    <View className="flex-1 bg-fond">
      <SafeAreaView className="bg-white" edges={['top']}>
        <View className="px-6 py-4 bg-white border-b border-gray-200"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center flex-1">
              <Pressable 
                onPress={() => router.back()} 
                className="p-2 rounded-full bg-tertiary mr-3"
              >
                <Ionicons name="arrow-back" size={20} color="#FF6B4A" />
              </Pressable>
              <View className="flex-1">
                <Text className="text-2xl font-nunito-extrabold text-gray-900">
                  Tous vos matches
                </Text>
                {matches && matches.length > 0 && (
                  <View className="flex-row items-center mt-1.5">
                    <View className="bg-tertiary px-3 py-1 rounded-full mr-2">
                      <Text className="text-primary text-xs font-nunito-bold">
                        {matches.length} match{matches.length > 1 ? 'es' : ''}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Ionicons name="flame" size={14} color="#FF6B4A" style={{ marginRight: 4 }} />
                      <Text className="text-gray-500 text-xs font-nunito-medium">
                        {matches.filter(m => m.score && m.score > 80).length} premium
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>

            <Pressable
              onPress={() => router.push("/runner/filters")}
              className="bg-tertiary p-3 rounded-xl ml-3"
              style={{
                shadowColor: "#FF6B4A",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Ionicons name="filter" size={20} color="#FF6B4A" />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      <View className="flex-1">
        {isLoading ? (
          <LoadingScreen />
        ) : matches?.length === 0 || matches === undefined ? (
          <View className="flex-1 items-center justify-center px-6 bg-fond">
            <View className="bg-tertiary p-8 rounded-full mb-6"
              style={{
                shadowColor: "#FF6B4A",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Ionicons
                name="search"
                size={60}
                color="#FF6B4A"
              />
            </View>
            <Text className="text-gray-900 text-center text-xl font-nunito-extrabold mb-3">
              Aucun match trouvé
            </Text>
            <Text className="text-gray-500 text-center text-base font-nunito-medium mb-8 px-4">
              Nous n'avons pas trouvé de coureurs correspondant à vos critères actuels. Essayez d'élargir vos critères de recherche.
            </Text>
            <Pressable
              onPress={() => router.push("/runner/filters")}
              className="bg-primary rounded-full px-6 py-3 flex-row items-center"
              style={{
                shadowColor: "#FF6B4A",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Ionicons
                name="options"
                size={18}
                color="white"
                style={{ marginRight: 8 }}
              />
              <Text className="text-white font-nunito-bold">
                Ajuster les filtres
              </Text>
            </Pressable>
          </View>
        ) : (
          <View className="relative flex-1">
            {/* Indicateur de position */}
            {matches && matches.length > 1 && (
              <View className="absolute top-6 left-0 right-0 z-20 items-center">
                <View className="bg-white/90 px-4 py-2 rounded-full flex-row items-center"
                  style={{
                    shadowColor: "#FF6B4A",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <Ionicons name="person" size={16} color="#FF6B4A" style={{ marginRight: 6 }} />
                  <Text className="text-gray-900 font-nunito-bold text-sm">
                    {activeIndex + 1} / {matches.length}
                  </Text>
                </View>
              </View>
            )}

            {/* Score de compatibilité si disponible */}
            {matches && matches[activeIndex]?.score !== undefined && (
              <View className="absolute top-6 right-6 z-20">
                <View className="bg-tertiary border-2 border-primary px-3 py-2 rounded-full flex-row items-center"
                  style={{
                    shadowColor: "#FF6B4A",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <Ionicons name="heart" size={16} color="#FF6B4A" style={{ marginRight: 4 }} />
                  <Text className="text-primary font-nunito-bold text-sm">
                    {Math.round(matches[activeIndex].score || 0)}% match
                  </Text>
                </View>
              </View>
            )}

            {/* Boutons de navigation - en bas de la carte */}
            {matches && matches.length > 1 && (
              <View className="absolute bottom-20 left-0 right-0 flex-row justify-between px-6 z-20">
                {/* Flèche gauche */}
                <Pressable
                  onPress={goToPrevious}
                  className="bg-white p-3 rounded-full"
                  style={{
                    shadowColor: "#FF6B4A",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                  }}
                >
                  <Ionicons name="chevron-back" size={24} color="#FF6B4A" />
                </Pressable>
                {/* Flèche droite */}
                <Pressable
                  onPress={goToNext}
                  className="bg-white p-3 rounded-full"
                  style={{
                    shadowColor: "#FF6B4A",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                  }}
                >
                  <Ionicons name="chevron-forward" size={24} color="#FF6B4A" />
                </Pressable>
              </View>
            )}

            {/* Indicateurs de progression en bas */}
            {matches && matches.length > 1 && matches.length <= 10 && (
              <View className="absolute bottom-8 left-0 right-0 z-10 flex-row justify-center space-x-2">
                {matches.map((_, index) => (
                  <View
                    key={index}
                    className={`rounded-full ${
                      index === activeIndex ? 'bg-primary w-8' : 'bg-white/50 w-2'
                    } h-2`}
                    style={{
                      shadowColor: index === activeIndex ? "#FF6B4A" : "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.2,
                      shadowRadius: 2,
                      elevation: 2,
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

            {/* Barre d'actions en bas */}
            {matches && matches[activeIndex] && (
              <View className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-fond"
                style={{
                  borderTopWidth: 1,
                  borderTopColor: 'rgba(0, 0, 0, 0.05)',
                }}
              >
                <View className="flex-row justify-between items-center">
                  {/* Bouton Voir Profil */}
                  <Pressable
                    onPress={() => matches[activeIndex] && router.push(`/runner/${matches[activeIndex].user.id}`)}
                    className="bg-white px-5 py-3 rounded-2xl flex-1 mr-2 flex-row items-center justify-center"
                    style={{
                      shadowColor: "#FF6B4A",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                  >
                    <Ionicons name="person-outline" size={20} color="#FF6B4A" style={{ marginRight: 8 }} />
                    <Text className="text-primary font-nunito-bold">Profil</Text>
                  </Pressable>

                  {/* Bouton Message */}
                  <Pressable
                    onPress={() => matches[activeIndex] && router.push(`/chat/${matches[activeIndex].user.id}`)}
                    className="bg-primary px-5 py-3 rounded-2xl flex-1 mx-2 flex-row items-center justify-center"
                    style={{
                      shadowColor: "#FF6B4A",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 4,
                    }}
                  >
                    <Ionicons name="chatbubble-ellipses" size={20} color="white" style={{ marginRight: 8 }} />
                    <Text className="text-white font-nunito-bold">Message</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}
