import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MatchUser } from "@/interface/Matches";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { router } from "expo-router";

type MatchCardProps = {
  match: MatchUser;
};

// Fonction utilitaire pour traiter en toute sécurité les tableaux et les chaînes JSON
const safelyFormatArray = (value: any, separator: string = ", "): string => {
  try {
    if (Array.isArray(value)) {
      return value
        .filter((item) => item !== null && item !== undefined)
        .map((item) => String(item))
        .join(separator);
    } else if (typeof value === "string") {
      const valueStr = value as string;
      if (valueStr.startsWith("[") || valueStr.startsWith("{")) {
        try {
          const parsed = JSON.parse(valueStr);
          if (Array.isArray(parsed)) {
            return parsed.map((item) => String(item)).join(separator);
          }
          return String(parsed);
        } catch (e) {
          return valueStr;
        }
      }
      return valueStr;
    }
    return value !== null && value !== undefined ? String(value) : "";
  } catch (error) {
    console.error(`Erreur de formatage: ${error}`);
    return "";
  }
};

export function MatchCard({ match }: MatchCardProps) {
  const isChillRunner = match.user.runner_profile.running_type === "chill";
  const actualPace = match.user.runner_profile.actual_pace;
  const runningFrequency = match.user.runner_profile.running_frequency;
  const weeklyDistance = match.user.runner_profile.weekly_mileage;
  const distanceKm = match.distance_km;

  // Formater runningFrequency si c'est un tableau
  const formatRunningFrequency = () => {
    return safelyFormatArray(runningFrequency);
  };

  return (
    <Pressable
      onPress={() => router.push(`/runner/${match.user.id}`)}
      className="relative overflow-hidden rounded-3xl"
      style={{
        height: 550,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 32,
        elevation: 16,
        borderWidth: 1.5,
        borderColor: '#FF6B4A',
      }}
    >
      {/* Fond avec léger gradient pour plus de profondeur */}
      <LinearGradient
        colors={['#FFFFFF', '#FEFEFE', '#FCFCFC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: 32,
        }}
      />

      {/* Image avec effet de flou pour qu'elle ressorte */}
      <View className="absolute top-5 left-4 right-4" style={{ height: '62%' }}>
        <View
          style={{
            borderRadius: 24,
            borderWidth: 1.5,
            borderColor: '#FF6B4A',
            overflow: 'hidden',
            height: '100%',
            shadowColor: '#FF6B4A',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.25,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <Image
            source={
              match.user.profile_image
                ? { uri: match.user.profile_image }
                : require("@/assets/images/react-logo.png")
            }
            className="absolute w-full h-full"
            style={{ 
              resizeMode: "cover",
            }}
          />
          {/* Gradient pour créer un effet de profondeur subtil */}
          <LinearGradient
            colors={["rgba(255, 255, 255, 0.1)", "rgba(0, 0, 0, 0.05)", "rgba(0, 0, 0, 0.15)"]}
            className="absolute inset-0"
            style={{
              borderRadius: 22.5,
            }}
          />
          {/* Effet de flou subtil pour faire ressortir l'image */}
          <BlurView
            intensity={30}
            tint="light"
            className="absolute inset-0"
            style={{
              borderRadius: 22.5,
            }}
          />
        </View>
        
        {/* Distance - en haut à droite */}
        {distanceKm && (
          <View className="absolute top-2 right-2 z-10">
            <View
              className="px-3 py-1.5 overflow-hidden"
              style={{ 
                borderRadius: 12,
                backgroundColor: '#10B981',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              <Text className="text-white text-xs font-kanit-bold">
                {distanceKm} km
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Section infos en bas avec fond blanc élégant */}
      <View className="absolute bottom-0 left-0 right-0" style={{ height: '35%', borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#FFFFFF',
            padding: 20,
            paddingTop: 20,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
          }}
        >
          <View className="flex-row justify-between items-start h-full">
            {/* Colonne de gauche - Prénom et âge */}
            <View className="flex-1">
              <Text className="text-gray-900 text-2xl font-kanit-bold mb-1">
                {match.user.first_name}
              </Text>
              <Text className="text-gray-600 text-base font-kanit-medium">
                {match.user.age} ans
              </Text>
            </View>

            {/* Colonne de droite - Infos supplémentaires */}
            <View className="flex-1 items-end">
              <Text className="text-gray-900 text-sm font-kanit-medium mb-1.5 text-right">
                {match.user.city}
              </Text>
              <View 
                className="px-3 py-1 rounded-full mb-1.5"
                style={{ backgroundColor: 'rgba(255, 107, 74, 0.1)' }}
              >
                <Text className="text-primary text-xs font-kanit-bold">
                  {isChillRunner ? "Runner du dimanche" : "Runner performance"}
                </Text>
              </View>
              {isChillRunner ? (
                runningFrequency && (
                  <Text className="text-gray-700 text-sm font-kanit-medium text-right">
                    {formatRunningFrequency()}
                  </Text>
                )
              ) : (
                <>
                  {actualPace && (
                    <Text className="text-gray-900 text-sm font-kanit-bold text-right mb-1">
                      {actualPace} min/km
                    </Text>
                  )}
                  {weeklyDistance && (
                    <Text className="text-gray-600 text-xs font-kanit-medium text-right">
                      {weeklyDistance} km/semaine
                    </Text>
                  )}
                </>
              )}
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
