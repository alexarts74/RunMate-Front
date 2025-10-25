import React, { useRef, useState } from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import { router, useFocusEffect } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MatchUser } from "@/interface/Matches";
import LoadingScreen from "../LoadingScreen";
import { MatchCard } from "./MatchCard";
import Swiper from "react-native-deck-swiper";
import { useMatches } from "@/context/MatchesContext";

const { width: screenWidth } = Dimensions.get("window");

export function MatchesDeckSwiper() {
  const { matches, refreshMatches, isLoading } = useMatches();
  const swiperRef = useRef<Swiper<MatchUser>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Rafraîchir les matches au focus initial
  useFocusEffect(
    React.useCallback(() => {
      refreshMatches();
    }, [])
  );

  const renderCard = (match: MatchUser) => {
    return <MatchCard match={match} />;
  };

  const goToPrevious = () => {
    let newIndex;
    if (currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else {
      newIndex = matches ? matches.length - 1 : 0;
    }

    console.log(`Aller de ${currentIndex} vers ${newIndex} (PRÉCÉDENT)`);
    setCurrentIndex(newIndex);
    if (swiperRef.current) {
      swiperRef.current.jumpToCardIndex(newIndex);
    }
  };

  const goToNext = () => {
    let newIndex;
    if (matches && currentIndex < matches.length - 1) {
      newIndex = currentIndex + 1;
    } else {
      newIndex = 0;
    }

    console.log(`Aller de ${currentIndex} vers ${newIndex} (SUIVANT)`);
    setCurrentIndex(newIndex);
    if (swiperRef.current) {
      swiperRef.current.jumpToCardIndex(newIndex);
    }
  };

  const onSwipedLeft = (cardIndex: number) => {
    console.log(`Carte ${cardIndex} swipée vers la gauche`);
    // Ne rien faire ici, on va utiliser onSwiping à la place
  };

  const onSwipedRight = (cardIndex: number) => {
    console.log(`Carte ${cardIndex} swipée vers la droite`);
    // Ne rien faire ici, on va utiliser onSwiping à la place
  };

  const onSwiping = (x: number, y: number) => {
    // Détecter la direction du swipe
    if (Math.abs(x) > 50) {
      if (x < 0) {
        // Swipe gauche - PRÉCÉDENT
        console.log("Swipe détecté vers la gauche (PRÉCÉDENT)");
      } else {
        // Swipe droite - SUIVANT
        console.log("Swipe détecté vers la droite (SUIVANT)");
      }
    }
  };

  const onSwipedAll = () => {
    console.log("Toutes les cartes ont été swipées");
  };

  const removeDistanceFilter = () => {
    router.push("/runner/filters");
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!matches || matches.length === 0) {
    return (
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="px-5 pt-6 pb-3">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <Text className="text-2xl font-kanit-semibold text-white">
                Vos matches
              </Text>
            </View>

            <Pressable
              onPress={() => router.push("/runner/filters")}
              className="bg-background p-2.5 rounded-xl border border-gray-700"
            >
              <Ionicons name="options-outline" size={20} color="#126C52" />
            </Pressable>
          </View>
        </View>

        {/* État vide */}
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons
            name="search"
            size={60}
            color="#126C52"
            style={{ marginBottom: 16 }}
          />
          <Text className="text-gray-300 text-center text-base font-kanit mb-4">
            Aucun coureur ne correspond à vos critères actuels.
          </Text>
          <Pressable
            onPress={removeDistanceFilter}
            className="bg-purple rounded-xl px-6 py-3 flex-row items-center"
          >
            <Ionicons name="locate" size={18} color="white" />
            <Text className="text-white font-kanit-semibold ml-2">
              Élargir la recherche
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="px-5 pt-6 pb-3">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Text className="text-2xl font-kanit-semibold text-white">
              Vos matches
            </Text>
            <View className="bg-purple/20 px-2.5 py-1 rounded-full ml-3">
              <Text className="text-purple text-sm font-kanit-semibold">
                {matches.length}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => router.push("/runner/filters")}
            className="bg-background p-2.5 rounded-xl border border-gray-700"
          >
            <Ionicons name="options-outline" size={20} color="#126C52" />
          </Pressable>
        </View>
      </View>

      {/* Deck Swiper */}
      <View className="flex-1 justify-center">
        {/* Boutons de navigation */}
        <View className="absolute top-4 left-0 right-0 flex-row justify-center space-x-4 z-10">
          <Pressable
            onPress={goToPrevious}
            className="bg-white/20 backdrop-blur-md p-3 rounded-full"
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </Pressable>
          <Pressable
            onPress={goToNext}
            className="bg-white/20 backdrop-blur-md p-3 rounded-full"
          >
            <Ionicons name="chevron-forward" size={24} color="white" />
          </Pressable>
        </View>

        <Swiper
          ref={swiperRef}
          cards={matches || []}
          renderCard={renderCard}
          onSwipedLeft={onSwipedLeft}
          onSwipedRight={onSwipedRight}
          onSwipedAll={onSwipedAll}
          onSwiping={onSwiping}
          cardIndex={currentIndex}
          backgroundColor="transparent"
          stackSize={3}
          stackSeparation={15}
          animateOverlayLabelsOpacity
          animateCardOpacity
          swipeBackCard={true}
          disableBottomSwipe={true}
          disableTopSwipe={true}
          {...({} as any)}
          overlayLabels={{
            left: {
              title: "PRÉCÉDENT",
              style: {
                label: {
                  backgroundColor: "#126C52",
                  borderColor: "#126C52",
                  color: "white",
                  borderWidth: 1,
                  fontSize: 20,
                  fontWeight: "bold",
                  borderRadius: 10,
                  padding: 10,
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "flex-end",
                  justifyContent: "flex-start",
                  marginTop: 30,
                  marginLeft: -30,
                },
              },
            },
            right: {
              title: "SUIVANT",
              style: {
                label: {
                  backgroundColor: "#126C52",
                  borderColor: "#126C52",
                  color: "white",
                  borderWidth: 1,
                  fontSize: 20,
                  fontWeight: "bold",
                  borderRadius: 10,
                  padding: 10,
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  marginTop: 30,
                  marginLeft: 30,
                },
              },
            },
          }}
          inputOverlayLabelsOpacityRangeX={[-200, -150, 0, 150, 200]}
          inputOverlayLabelsOpacityRangeY={[-250, -200, -150, 0, 150]}
          outputOverlayLabelsOpacityRangeX={[0, 1, 1, 1, 0]}
          outputOverlayLabelsOpacityRangeY={[0, 1, 1, 1, 0]}
        />
      </View>
    </View>
  );
}
