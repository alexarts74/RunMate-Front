import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  SafeAreaView,
  Animated,
} from "react-native";
import React, { useState, useRef } from "react";
import { useLocalSearchParams } from "expo-router";
import { useMatches } from "@/context/MatchesContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styled } from "nativewind";
import { router } from "expo-router";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledScrollView = styled(ScrollView);
const StyledPressable = styled(Pressable);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledAnimatedView = styled(Animated.View);

// Composant de section repliable
const CollapsibleSection = ({
  title,
  icon,
  children,
  initiallyOpen = false,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
  initiallyOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const animatedController = useRef(
    new Animated.Value(initiallyOpen ? 1 : 0)
  ).current;

  const toggleSection = () => {
    setIsOpen(!isOpen);
    Animated.timing(animatedController, {
      toValue: isOpen ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const rotation = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  return (
    <StyledView className="mb-4">
      <StyledPressable
        onPress={toggleSection}
        className="flex-row items-center justify-between bg-[#1e2429] p-3 rounded-t-xl"
        style={{
          borderBottomLeftRadius: isOpen ? 0 : 12,
          borderBottomRightRadius: isOpen ? 0 : 12,
        }}
      >
        <StyledView className="flex-row items-center">
          <StyledView className="bg-[#2a3238] p-2 rounded-full">
            <Ionicons name={icon as any} size={18} color="#8101f7" />
          </StyledView>
          <StyledText className="text-white ml-2 font-medium">
            {title}
          </StyledText>
        </StyledView>
        <StyledAnimatedView style={{ transform: [{ rotate: rotation }] }}>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </StyledAnimatedView>
      </StyledPressable>

      {isOpen && (
        <StyledAnimatedView
          className="bg-[#1a1f24] p-3 rounded-b-xl"
          style={{
            opacity: animatedController,
            transform: [
              {
                translateY: animatedController.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-10, 0],
                }),
              },
            ],
          }}
        >
          {children}
        </StyledAnimatedView>
      )}
    </StyledView>
  );
};

export default function RunnerProfileScreen() {
  const { id } = useLocalSearchParams();
  const { matches } = useMatches();
  const runner = matches?.find((match) => match.user.id === Number(id))?.user;

  if (!runner) return null;

  const handleSendMessage = () => {
    router.push(`/chat/${id}`);
  };

  // Parse JSON strings
  const parseJsonIfNeeded = (value: any) => {
    if (
      typeof value === "string" &&
      (value.startsWith("[") || value.startsWith("{"))
    ) {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    }
    return value;
  };

  const availability = parseJsonIfNeeded(runner.runner_profile.availability);
  const preferredTimeOfDay = parseJsonIfNeeded(
    runner.runner_profile.preferred_time_of_day
  );

  // Helper function to capitalize first letter
  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <StyledSafeAreaView className="flex-1 bg-[#14141b]">
      {/* Contenu scrollable */}
      <StyledScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header avec image de profil */}
        <StyledView className="pt-8 px-5">
          {/* Header avec bouton retour */}
          <StyledView className="flex-row items-center mb-4">
            <StyledPressable onPress={() => router.back()} className="p-2">
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </StyledPressable>
            <StyledText className="text-xl font-bold text-white ml-2">
              Profil Runner
            </StyledText>
          </StyledView>

          <StyledView className="items-center">
            <StyledImage
              source={
                runner.profile_image
                  ? { uri: runner.profile_image }
                  : require("@/assets/images/react-logo.png")
              }
              className="w-32 h-32 rounded-full"
            />
            <StyledText className="text-2xl font-bold text-white mt-3">
              {runner.first_name} {runner.last_name}
            </StyledText>

            <StyledText className="text-lg text-gray-300 mt-1">
              {runner.age} ans
            </StyledText>

            <StyledView className="flex-row items-center mt-2">
              <Ionicons name="location" size={16} color="#9CA3AF" />
              <StyledText className="text-purple ml-1">
                {runner.city}, {runner.department}
              </StyledText>
            </StyledView>

            {/* Bio */}
            {runner.bio && (
              <StyledText className="text-gray-300 text-center italic mt-4 px-4">
                "{runner.bio}"
              </StyledText>
            )}

            {/* Type de runner - badges */}
            <StyledView className="flex-row justify-center flex-wrap mt-5">
              <StyledView
                className={`${
                  runner.runner_profile.running_type === "chill"
                    ? "bg-blue-500/30"
                    : "bg-red-500/30"
                } px-3 py-1 rounded-full mr-3`}
              >
                <StyledText
                  className={`${
                    runner.runner_profile.running_type === "chill"
                      ? "text-blue-200"
                      : "text-red-200"
                  } text-sm font-medium`}
                >
                  {runner.runner_profile.running_type === "chill"
                    ? "Runner Chill"
                    : "Runner Perf"}
                </StyledText>
              </StyledView>

              {runner.runner_profile.flexible && (
                <StyledView className="bg-green-500/30 px-3 py-1 rounded-full flex-row items-center">
                  <Ionicons name="leaf-outline" size={16} color="#4ade80" />
                  <StyledText className="text-green-200 ml-1 text-sm font-medium">
                    Flexible
                  </StyledText>
                </StyledView>
              )}
            </StyledView>
          </StyledView>
        </StyledView>

        {/* Ligne de séparation */}
        <StyledView className="h-[1px] bg-[#2a3238] my-6 mx-5" />

        {/* Sections avec accordéon */}
        <StyledView className="px-5">
          {/* Statistiques de course - cartes */}
          <CollapsibleSection title="Statistiques" icon="stats-chart-outline">
            <StyledView className="flex-row justify-between gap-x-2">
              <StyledView className="items-center bg-[#1e2429] p-3 rounded-xl flex-1">
                <StyledView className="bg-[#2a3238] p-2 rounded-full">
                  <Ionicons name="walk-outline" size={18} color="#8101f7" />
                </StyledView>
                <StyledText className="text-white text-center mt-1 text-sm">
                  Pace
                </StyledText>
                <StyledText className="text-purple text-base font-bold">
                  {runner.runner_profile.actual_pace} min/km
                </StyledText>
              </StyledView>

              <StyledView className="items-center bg-[#1e2429] p-3 rounded-xl flex-1">
                <StyledView className="bg-[#2a3238] p-2 rounded-full">
                  <Ionicons name="resize-outline" size={18} color="#8101f7" />
                </StyledView>
                <StyledText className="text-white text-center mt-1 text-sm">
                  Distance
                </StyledText>
                <StyledText className="text-purple text-base font-bold">
                  {runner.runner_profile.usual_distance} km
                </StyledText>
              </StyledView>

              <StyledView className="items-center bg-[#1e2429] p-3 rounded-xl flex-1">
                <StyledView className="bg-[#2a3238] p-2 rounded-full">
                  <Ionicons name="repeat-outline" size={18} color="#8101f7" />
                </StyledView>
                <StyledText className="text-white text-center mt-1 text-sm">
                  Fréquence
                </StyledText>
                <StyledText className="text-purple text-base font-bold">
                  {capitalize(runner.runner_profile.running_frequency || "N/A")}
                </StyledText>
              </StyledView>
            </StyledView>
          </CollapsibleSection>

          {/* Infos principales */}
          <CollapsibleSection
            title="Infos pratiques"
            icon="information-circle-outline"
          >
            {/* Objectif */}
            <StyledView className="mb-4">
              <StyledView className="flex-row items-center mb-1">
                <Ionicons name="trophy-outline" size={18} color="#8101f7" />
                <StyledText className="text-white ml-2 font-medium">
                  Objectif
                </StyledText>
              </StyledView>
              <StyledText className="text-gray-300 ml-6 text-sm">
                {typeof runner.runner_profile.objective === "string"
                  ? runner.runner_profile.objective.charAt(0).toUpperCase() +
                    runner.runner_profile.objective.slice(1)
                  : Array.isArray(runner.runner_profile.objective)
                  ? (runner.runner_profile.objective as string[]).length > 0
                    ? (runner.runner_profile.objective as string[]).join(", ")
                    : "Non précisé"
                  : "Non précisé"}
              </StyledText>
            </StyledView>

            {/* Disponibilités */}
            <StyledView className="mb-4">
              <StyledView className="flex-row items-center mb-1">
                <Ionicons name="calendar-outline" size={18} color="#8101f7" />
                <StyledText className="text-white ml-2 font-medium">
                  Disponibilités
                </StyledText>
              </StyledView>
              <StyledView className="flex-row flex-wrap ml-6">
                {availability && availability.length > 0 ? (
                  Array.isArray(availability) &&
                  availability.map((day, index) => (
                    <StyledView
                      key={index}
                      className="bg-[#2a3238] px-2 py-0.5 rounded-full mr-2 mb-1"
                    >
                      <StyledText className="text-purple text-xs text-center">
                        {capitalize(day)}
                      </StyledText>
                    </StyledView>
                  ))
                ) : (
                  <StyledText className="text-gray-400 text-sm">
                    Aucune disponibilité renseignée
                  </StyledText>
                )}
              </StyledView>
            </StyledView>

            {/* Préférence temporelle */}
            {preferredTimeOfDay && preferredTimeOfDay.length > 0 && (
              <StyledView>
                <StyledView className="flex-row items-center mb-1">
                  <Ionicons name="time-outline" size={18} color="#8101f7" />
                  <StyledText className="text-white ml-2 font-medium">
                    Moments préférés
                  </StyledText>
                </StyledView>
                <StyledView className="flex-row flex-wrap ml-6">
                  {Array.isArray(preferredTimeOfDay) &&
                    preferredTimeOfDay.map((time, index) => (
                      <StyledView
                        key={index}
                        className="bg-[#2a3238] px-2 py-0.5 rounded-full mr-2 mb-1"
                      >
                        <StyledText className="text-purple text-xs">
                          {time}
                        </StyledText>
                      </StyledView>
                    ))}
                </StyledView>
              </StyledView>
            )}
          </CollapsibleSection>

          {/* Section spécifique au type de runner */}
          <CollapsibleSection
            title={
              runner.runner_profile.running_type === "chill"
                ? "Préférences sociales"
                : "Objectifs de performance"
            }
            icon={
              runner.runner_profile.running_type === "chill"
                ? "people-outline"
                : "ribbon-outline"
            }
          >
            {/* Contenu spécifique au type de runner */}
            {runner.runner_profile.running_type === "chill" ? (
              <StyledView>
                {/* Préférences Sociales - pour runners chill */}
                {runner.runner_profile.social_preferences &&
                  runner.runner_profile.social_preferences.length > 0 && (
                    <StyledView className="mb-4">
                      <StyledView className="flex-row items-center mb-1">
                        <Ionicons
                          name="people-outline"
                          size={18}
                          color="#8101f7"
                        />
                        <StyledText className="text-white ml-2 font-medium">
                          Préférences sociales
                        </StyledText>
                      </StyledView>
                      <StyledView className="flex-row flex-wrap ml-6">
                        {Array.isArray(
                          runner.runner_profile.social_preferences
                        ) &&
                          runner.runner_profile.social_preferences.map(
                            (pref, index) => (
                              <StyledView
                                key={index}
                                className="bg-[#2a3238] px-2 py-0.5 rounded-full mr-2 mb-1"
                              >
                                <StyledText className="text-purple text-xs">
                                  {pref}
                                </StyledText>
                              </StyledView>
                            )
                          )}
                      </StyledView>
                    </StyledView>
                  )}

                {/* Activités après course - pour runners chill */}
                {runner.runner_profile.post_run_activities &&
                  runner.runner_profile.post_run_activities.length > 0 && (
                    <StyledView>
                      <StyledView className="flex-row items-center mb-1">
                        <Ionicons
                          name="cafe-outline"
                          size={18}
                          color="#8101f7"
                        />
                        <StyledText className="text-white ml-2 font-medium">
                          Après la course
                        </StyledText>
                      </StyledView>
                      <StyledView className="flex-row flex-wrap ml-6">
                        {Array.isArray(
                          runner.runner_profile.post_run_activities
                        ) &&
                          runner.runner_profile.post_run_activities.map(
                            (activity, index) => (
                              <StyledView
                                key={index}
                                className="bg-[#2a3238] px-2 py-0.5 rounded-full mr-2 mb-1"
                              >
                                <StyledText className="text-purple text-xs">
                                  {activity}
                                </StyledText>
                              </StyledView>
                            )
                          )}
                      </StyledView>
                    </StyledView>
                  )}
              </StyledView>
            ) : (
              <StyledView>
                {/* Objectifs de compétition - pour runners perf */}
                {runner.runner_profile.competition_goals && (
                  <StyledView className="mb-4">
                    <StyledView className="flex-row items-center mb-1">
                      <Ionicons
                        name="ribbon-outline"
                        size={18}
                        color="#8101f7"
                      />
                      <StyledText className="text-white ml-2 font-medium">
                        Objectifs de compétition
                      </StyledText>
                    </StyledView>
                    <StyledText className="text-gray-300 ml-6 text-sm">
                      {runner.runner_profile.competition_goals}
                    </StyledText>
                  </StyledView>
                )}

                {/* Allure cible - pour runners perf */}
                {runner.runner_profile.target_pace && (
                  <StyledView>
                    <StyledView className="flex-row items-center mb-1">
                      <Ionicons
                        name="speedometer-outline"
                        size={18}
                        color="#8101f7"
                      />
                      <StyledText className="text-white ml-2 font-medium">
                        Allure cible
                      </StyledText>
                    </StyledView>
                    <StyledText className="text-gray-300 ml-6 text-sm">
                      {runner.runner_profile.target_pace} min/km
                    </StyledText>
                  </StyledView>
                )}
              </StyledView>
            )}
          </CollapsibleSection>

          {/* Section info supplémentaires */}
          <CollapsibleSection
            title="Plus d'informations"
            icon="ellipsis-horizontal-circle-outline"
            initiallyOpen={false}
          >
            {/* Dernière activité */}
            <StyledView className="mb-3">
              <StyledView className="flex-row items-center mb-1">
                <Ionicons name="pulse-outline" size={18} color="#8101f7" />
                <StyledText className="text-white ml-2 font-medium">
                  Dernière activité
                </StyledText>
              </StyledView>
              <StyledText className="text-gray-300 ml-6 text-sm">
                {(runner as any).last_active_at
                  ? new Date((runner as any).last_active_at).toLocaleDateString(
                      "fr-FR"
                    )
                  : "Non disponible"}
              </StyledText>
            </StyledView>

            {/* Date d'inscription */}
            <StyledView>
              <StyledView className="flex-row items-center mb-1">
                <Ionicons name="create-outline" size={18} color="#8101f7" />
                <StyledText className="text-white ml-2 font-medium">
                  Membre depuis
                </StyledText>
              </StyledView>
              <StyledText className="text-gray-300 ml-6 text-sm">
                {(runner as any).created_at
                  ? new Date((runner as any).created_at).toLocaleDateString(
                      "fr-FR"
                    )
                  : "Non disponible"}
              </StyledText>
            </StyledView>
          </CollapsibleSection>
        </StyledView>
      </StyledScrollView>

      {/* Footer fixe */}
      <StyledView className="absolute bottom-0 left-0 right-0 px-5 py-4 border-t border-gray-800 bg-[#14141b]">
        <StyledPressable
          className="bg-purple py-3 rounded-full w-4/5 mb-2 mx-auto flex-row justify-center items-center"
          onPress={handleSendMessage}
        >
          <Ionicons name="chatbubble-outline" size={20} color="white" />
          <StyledText className="text-white font-bold ml-2">
            Envoyer un message
          </StyledText>
        </StyledPressable>
      </StyledView>
    </StyledSafeAreaView>
  );
}
