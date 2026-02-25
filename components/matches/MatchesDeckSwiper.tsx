import React, { useRef, useState } from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import { router, useFocusEffect } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MatchUser } from "@/interface/Matches";
import LoadingScreen from "../LoadingScreen";
import { MatchCard } from "./MatchCard";
import Swiper from "react-native-deck-swiper";
import { useMatches } from "@/context/MatchesContext";
import GlassButton from "@/components/ui/GlassButton";
import { useThemeColors, palette } from "@/constants/theme";

const { width: screenWidth } = Dimensions.get("window");

export function MatchesDeckSwiper() {
  const { matches, refreshMatches, isLoading } = useMatches();
  const swiperRef = useRef<Swiper<MatchUser>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { colors, shadows } = useThemeColors();

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
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        {/* Header */}
        <View className="px-5 pt-6 pb-3">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <Text style={{ color: colors.text.primary }} className="text-2xl font-nunito-semibold">
                Vos matches
              </Text>
            </View>

            <Pressable
              onPress={() => router.push("/runner/filters")}
              className="p-2.5 rounded-xl"
              style={{
                backgroundColor: colors.glass.light,
                borderWidth: 1,
                borderColor: colors.glass.border,
              }}
            >
              <Ionicons name="options-outline" size={20} color={colors.primary.DEFAULT} />
            </Pressable>
          </View>
        </View>

        {/* État vide */}
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons
            name="search"
            size={60}
            color={colors.primary.DEFAULT}
            style={{ marginBottom: 16 }}
          />
          <Text style={{ color: colors.text.secondary }} className="text-center text-base font-nunito mb-4">
            Aucun coureur ne correspond à vos critères actuels.
          </Text>
          <GlassButton
            title="Élargir la recherche"
            onPress={removeDistanceFilter}
            icon={<Ionicons name="locate" size={18} color="white" />}
          />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <View className="px-5 pt-6 pb-3">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Text style={{ color: colors.text.primary }} className="text-2xl font-nunito-semibold">
              Vos matches
            </Text>
            <View className="px-2.5 py-1 rounded-full ml-3" style={{ backgroundColor: palette.primary.subtle }}>
              <Text style={{ color: colors.primary.DEFAULT }} className="text-sm font-nunito-semibold">
                {matches.length}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => router.push("/runner/filters")}
            className="p-2.5 rounded-xl"
            style={{
              backgroundColor: colors.glass.light,
              borderWidth: 1,
              borderColor: colors.glass.border,
            }}
          >
            <Ionicons name="options-outline" size={20} color={colors.primary.DEFAULT} />
          </Pressable>
        </View>
      </View>

      {/* Deck Swiper */}
      <View className="flex-1 justify-center">
        {/* Boutons de navigation */}
        <View className="absolute top-4 left-0 right-0 flex-row justify-center space-x-4 z-10">
          <Pressable
            onPress={goToPrevious}
            className="p-3 rounded-full"
            style={{
              backgroundColor: colors.glass.medium,
              ...shadows.sm,
            }}
          >
            <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
          </Pressable>
          <Pressable
            onPress={goToNext}
            className="p-3 rounded-full"
            style={{
              backgroundColor: colors.glass.medium,
              ...shadows.sm,
            }}
          >
            <Ionicons name="chevron-forward" size={24} color={colors.text.primary} />
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
                  backgroundColor: palette.primary.DEFAULT,
                  borderColor: palette.primary.DEFAULT,
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
                  backgroundColor: palette.primary.DEFAULT,
                  borderColor: palette.primary.DEFAULT,
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
