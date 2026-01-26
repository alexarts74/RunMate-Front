import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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

const ACCENT = "#F97316";

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
        className="flex-row items-center justify-between bg-white p-4 rounded-t-2xl border-b border-gray-100"
        style={{
          borderBottomLeftRadius: isOpen ? 0 : 16,
          borderBottomRightRadius: isOpen ? 0 : 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <StyledView className="flex-row items-center">
          <StyledView className="bg-tertiary p-2.5 rounded-xl">
            <Ionicons name={icon as any} size={18} color={ACCENT} />
          </StyledView>
          <StyledText className="text-gray-900 ml-3 font-nunito-bold">
            {title}
          </StyledText>
        </StyledView>
        <StyledAnimatedView style={{ transform: [{ rotate: rotation }] }}>
          <Ionicons name="chevron-forward" size={20} color="#525252" />
        </StyledAnimatedView>
      </StyledPressable>

      {isOpen && (
        <StyledAnimatedView
          className="bg-white p-4 rounded-b-2xl border-t border-gray-100"
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
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 1,
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
  const competitionGoals = parseJsonIfNeeded(
    runner.runner_profile.competition_goals
  );
  const objective = parseJsonIfNeeded(runner.runner_profile.objective);
  const runningFrequency = parseJsonIfNeeded(
    runner.runner_profile.running_frequency
  );
  const socialPreferences = parseJsonIfNeeded(
    runner.runner_profile.social_preferences
  );
  const postRunActivities = parseJsonIfNeeded(
    runner.runner_profile.post_run_activities
  );
  const trainingDays = parseJsonIfNeeded(runner.runner_profile.training_days);

  // Helper function to capitalize first letter
  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  // Formatage des objectifs de compétition
  const formatCompetitionGoal = (goal: string) => {
    // Remplacer les underscores par des espaces
    let formattedGoal = goal.replace(/_/g, " ");

    // Traduire et formater certains objectifs communs
    switch (goal) {
      case "semi_marathon":
        return "Semi-marathon";
      case "marathon":
        return "Marathon";
      case "10km_sous_50min":
        return "10km sous 50min";
      case "5km_sous_25min":
        return "5km sous 25min";
      default:
        // Mettre une majuscule à la première lettre
        return formattedGoal.charAt(0).toUpperCase() + formattedGoal.slice(1);
    }
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-fond" edges={['top']}>
      {/* Contenu scrollable */}
      <StyledScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header avec image de profil */}
        <StyledView className="pt-4 px-6 bg-white pb-6">
          {/* Header avec bouton retour */}
          <StyledView className="flex-row items-center mb-6">
            <StyledPressable
              onPress={() => router.back()}
              className="p-2 rounded-full bg-tertiary"
            >
              <Ionicons name="arrow-back" size={24} color={ACCENT} />
            </StyledPressable>
            <StyledText className="text-xl font-nunito-extrabold text-gray-900 ml-3">
              Profil Runner
            </StyledText>
          </StyledView>

          <StyledView className="items-center">
            <StyledView className="mb-4">
            <StyledImage
              source={
                runner.profile_image
                  ? { uri: runner.profile_image }
                  : require("@/assets/images/react-logo.png")
              }
                className="w-32 h-32 rounded-full border-4 border-primary"
            />
            </StyledView>
            <StyledText className="text-3xl font-nunito-extrabold text-gray-900 mt-2">
              {runner.first_name} {runner.last_name}
            </StyledText>

            <StyledText className="text-lg text-gray-600 mt-1 font-nunito-medium">
              {runner.age} ans
            </StyledText>

            <StyledView className="flex-row items-center mt-3">
              <View className="w-5 h-5 rounded-full bg-tertiary items-center justify-center mr-2">
                <Ionicons name="location" size={12} color="#525252" />
              </View>
              <StyledText className="text-gray-700 font-nunito-medium">
                {runner.city}, {runner.department}
              </StyledText>
            </StyledView>

            {/* Bio */}
            {runner.bio && (
              <StyledView className="mt-6 px-4">
                <StyledText className="text-gray-600 text-center italic font-nunito-medium">
                "{runner.bio}"
              </StyledText>
              </StyledView>
            )}

            {/* Type de runner - badges */}
            <StyledView className="flex-row justify-center flex-wrap mt-6">
              <StyledView
                className={`${
                  runner.runner_profile.running_type === "chill"
                    ? "bg-tertiary border border-primary"
                    : "bg-tertiary border border-secondary"
                } px-4 py-2 rounded-full mr-3`}
              >
                <StyledText
                  className={`${
                    runner.runner_profile.running_type === "chill"
                      ? "text-primary"
                      : "text-secondary"
                  } text-sm font-nunito-bold`}
                >
                  {runner.runner_profile.running_type === "chill"
                    ? "Runner Chill"
                    : "Runner Perf"}
                </StyledText>
              </StyledView>

              {runner.runner_profile.flexible && (
                <StyledView className="bg-tertiary border border-secondary px-4 py-2 rounded-full flex-row items-center">
                  <Ionicons name="leaf-outline" size={16} color="#525252" />
                  <StyledText className="text-secondary ml-2 text-sm font-nunito-bold">
                    Flexible
                  </StyledText>
                </StyledView>
              )}
            </StyledView>
          </StyledView>
        </StyledView>

        {/* Sections avec accordéon */}
        <StyledView className="px-6 py-4">
          {/* Statistiques de course - cartes */}
          <CollapsibleSection title="Statistiques" icon="stats-chart-outline">
            <StyledView className="flex-row justify-between gap-x-3">
              {/* Allure actuelle - affiché pour tous */}
              <StyledView className="items-center bg-tertiary p-4 rounded-xl flex-1 border border-gray-200">
                <StyledView className="bg-white p-2.5 rounded-full mb-2">
                  <Ionicons name="walk-outline" size={18} color={ACCENT} />
                </StyledView>
                <StyledText className="text-gray-600 text-center text-xs font-nunito-medium mb-1">
                  Pace
                </StyledText>
                <StyledText className="text-primary text-base font-nunito-bold">
                  {runner.runner_profile.actual_pace} min/km
                </StyledText>
              </StyledView>

              {/* Distance - adapté selon le type */}
              <StyledView className="items-center bg-tertiary p-4 rounded-xl flex-1 border border-gray-200">
                <StyledView className="bg-white p-2.5 rounded-full mb-2">
                  <Ionicons name="resize-outline" size={18} color="#525252" />
                </StyledView>
                <StyledText className="text-gray-600 text-center text-xs font-nunito-medium mb-1">
                  {runner.runner_profile.running_type === "perf"
                    ? "Distance/semaine"
                    : "Distance"}
                </StyledText>
                <StyledText className="text-secondary text-base font-nunito-bold">
                  {runner.runner_profile.running_type === "perf"
                    ? `${runner.runner_profile.weekly_mileage || 0} km/sem`
                    : `${runner.runner_profile.usual_distance || 0} km`}
                </StyledText>
              </StyledView>

              {/* Troisième carte adaptée selon le type */}
              <StyledView className="items-center bg-tertiary p-4 rounded-xl flex-1 border border-gray-200">
                <StyledView className="bg-white p-2.5 rounded-full mb-2">
                  {runner.runner_profile.running_type === "perf" ? (
                    <Ionicons
                      name="speedometer-outline"
                      size={18}
                      color={ACCENT}
                    />
                  ) : (
                    <Ionicons name="repeat-outline" size={18} color="#525252" />
                  )}
                </StyledView>
                <StyledText className="text-gray-600 text-center text-xs font-nunito-medium mb-1">
                  {runner.runner_profile.running_type === "perf"
                    ? "Target Pace"
                    : "Fréquence"}
                </StyledText>
                <StyledText className={`${runner.runner_profile.running_type === "perf" ? "text-primary" : "text-secondary"} text-base font-nunito-bold`}>
                  {runner.runner_profile.running_type === "perf"
                    ? `${runner.runner_profile.target_pace || "N/A"}`
                    : `${
                        Array.isArray(runningFrequency) &&
                        runningFrequency.length > 0
                          ? runningFrequency.join(", ")
                          : "N/A"
                      }`}
                </StyledText>
              </StyledView>
            </StyledView>
          </CollapsibleSection>

          {/* Sections conditionnelles selon le type de runner */}
          {runner.runner_profile.running_type === "perf" ? (
            <>
              {/* Section pour les runners perf */}
              <CollapsibleSection
                title="Objectifs de performance"
                icon="ribbon-outline"
              >
                {/* Objectifs de compétition - pour runners perf */}
                {competitionGoals && (
                  <StyledView className="mb-4">
                    <StyledView className="flex-row items-center mb-2">
                      <View className="w-6 h-6 rounded-lg bg-tertiary items-center justify-center mr-2">
                      <Ionicons
                        name="ribbon-outline"
                          size={16}
                          color={ACCENT}
                      />
                      </View>
                      <StyledText className="text-gray-900 ml-1 font-nunito-bold">
                        Objectifs de compétition
                      </StyledText>
                    </StyledView>
                    <StyledText className="text-gray-600 ml-8 text-sm font-nunito-medium">
                      {Array.isArray(competitionGoals)
                        ? competitionGoals.map(formatCompetitionGoal).join(", ")
                        : typeof competitionGoals === "string"
                        ? formatCompetitionGoal(competitionGoals)
                        : "Non précisé"}
                    </StyledText>
                  </StyledView>
                )}

                {/* Jours d'entraînement - pour runners perf */}
                {Array.isArray(trainingDays) && trainingDays.length > 0 && (
                  <StyledView>
                    <StyledView className="flex-row items-center mb-2">
                      <View className="w-6 h-6 rounded-lg bg-tertiary items-center justify-center mr-2">
                      <Ionicons
                        name="calendar-outline"
                          size={16}
                          color="#525252"
                      />
                      </View>
                      <StyledText className="text-gray-900 ml-1 font-nunito-bold">
                        Jours d'entraînement
                      </StyledText>
                    </StyledView>
                    <StyledView className="flex-row flex-wrap ml-8">
                      {trainingDays.map((day, index) => (
                        <StyledView
                          key={index}
                          className="bg-tertiary border border-primary px-3 py-1 rounded-full mr-2 mb-2"
                        >
                          <StyledText className="text-primary text-xs font-nunito-bold">
                            {capitalize(day)}
                          </StyledText>
                        </StyledView>
                      ))}
                    </StyledView>
                  </StyledView>
                )}
              </CollapsibleSection>
            </>
          ) : (
            <>
              {/* Sections pour runners chill */}
              <CollapsibleSection
                title="Infos pratiques"
                icon="information-circle-outline"
              >
                {/* Objectif */}
                <StyledView className="mb-4">
                  <StyledView className="flex-row items-center mb-2">
                    <View className="w-6 h-6 rounded-lg bg-tertiary items-center justify-center mr-2">
                      <Ionicons name="trophy-outline" size={16} color={ACCENT} />
                    </View>
                    <StyledText className="text-gray-900 ml-1 font-nunito-bold">
                      Objectif
                    </StyledText>
                  </StyledView>
                  <StyledText className="text-gray-600 ml-8 text-sm font-nunito-medium">
                    {typeof objective === "string"
                      ? objective.charAt(0).toUpperCase() + objective.slice(1)
                      : Array.isArray(objective)
                      ? objective.length > 0
                        ? objective.join(", ")
                        : "Non précisé"
                      : "Non précisé"}
                  </StyledText>
                </StyledView>

                {/* Disponibilités */}
                <StyledView className="mb-4">
                  <StyledView className="flex-row items-center mb-2">
                    <View className="w-6 h-6 rounded-lg bg-tertiary items-center justify-center mr-2">
                    <Ionicons
                      name="calendar-outline"
                        size={16}
                        color="#525252"
                    />
                    </View>
                    <StyledText className="text-gray-900 ml-1 font-nunito-bold">
                      Disponibilités
                    </StyledText>
                  </StyledView>
                  <StyledView className="flex-row flex-wrap ml-8">
                    {Array.isArray(availability) && availability.length > 0 ? (
                      availability.map((day, index) => (
                        <StyledView
                          key={index}
                          className="bg-tertiary border border-secondary px-3 py-1 rounded-full mr-2 mb-2"
                        >
                          <StyledText className="text-secondary text-xs font-nunito-bold text-center">
                            {capitalize(day)}
                          </StyledText>
                        </StyledView>
                      ))
                    ) : (
                      <StyledText className="text-gray-500 text-sm font-nunito-medium">
                        Aucune disponibilité renseignée
                      </StyledText>
                    )}
                  </StyledView>
                </StyledView>

                {/* Préférence temporelle */}
                {Array.isArray(preferredTimeOfDay) &&
                  preferredTimeOfDay.length > 0 && (
                    <StyledView>
                      <StyledView className="flex-row items-center mb-2">
                        <View className="w-6 h-6 rounded-lg bg-tertiary items-center justify-center mr-2">
                        <Ionicons
                          name="time-outline"
                            size={16}
                            color="#525252"
                        />
                        </View>
                        <StyledText className="text-gray-900 ml-1 font-nunito-bold">
                          Moments préférés
                        </StyledText>
                      </StyledView>
                      <StyledView className="flex-row flex-wrap ml-8">
                        {preferredTimeOfDay.map((time, index) => (
                          <StyledView
                            key={index}
                            className="bg-tertiary border border-secondary px-3 py-1 rounded-full mr-2 mb-2"
                          >
                            <StyledText className="text-secondary text-xs font-nunito-bold">
                              {time}
                            </StyledText>
                          </StyledView>
                        ))}
                      </StyledView>
                    </StyledView>
                  )}
              </CollapsibleSection>

              {/* Préférences sociales pour runners chill */}
              <CollapsibleSection
                title="Préférences sociales"
                icon="people-outline"
              >
                {/* Préférences Sociales */}
                {socialPreferences && socialPreferences.length > 0 && (
                  <StyledView className="mb-4">
                    <StyledView className="flex-row items-center mb-2">
                      <View className="w-6 h-6 rounded-lg bg-tertiary items-center justify-center mr-2">
                      <Ionicons
                        name="people-outline"
                          size={16}
                          color="#525252"
                      />
                      </View>
                      <StyledText className="text-gray-900 ml-1 font-nunito-bold">
                        Préférences sociales
                      </StyledText>
                    </StyledView>
                    <StyledView className="flex-row flex-wrap ml-8">
                      {Array.isArray(socialPreferences) &&
                        socialPreferences.map((pref, index) => (
                          <StyledView
                            key={index}
                            className="bg-tertiary border border-secondary px-3 py-1 rounded-full mr-2 mb-2"
                          >
                            <StyledText className="text-secondary text-xs font-nunito-bold">
                              {pref}
                            </StyledText>
                          </StyledView>
                        ))}
                    </StyledView>
                  </StyledView>
                )}

                {/* Activités après course */}
                {postRunActivities && postRunActivities.length > 0 && (
                  <StyledView>
                    <StyledView className="flex-row items-center mb-2">
                      <View className="w-6 h-6 rounded-lg bg-tertiary items-center justify-center mr-2">
                        <Ionicons name="cafe-outline" size={16} color={ACCENT} />
                      </View>
                      <StyledText className="text-gray-900 ml-1 font-nunito-bold">
                        Après la course
                      </StyledText>
                    </StyledView>
                    <StyledView className="flex-row flex-wrap ml-8">
                      {Array.isArray(postRunActivities) &&
                        postRunActivities.map((activity, index) => (
                          <StyledView
                            key={index}
                            className="bg-tertiary border border-primary px-3 py-1 rounded-full mr-2 mb-2"
                          >
                            <StyledText className="text-primary text-xs font-nunito-bold">
                              {activity}
                            </StyledText>
                          </StyledView>
                        ))}
                    </StyledView>
                  </StyledView>
                )}
              </CollapsibleSection>
            </>
          )}

          {/* Section info supplémentaires pour tous */}
          <CollapsibleSection
            title="Plus d'informations"
            icon="ellipsis-horizontal-circle-outline"
            initiallyOpen={false}
          >
            {/* Dernière activité */}
            <StyledView className="mb-4">
              <StyledView className="flex-row items-center mb-2">
                <View className="w-6 h-6 rounded-lg bg-tertiary items-center justify-center mr-2">
                  <Ionicons name="pulse-outline" size={16} color={ACCENT} />
                </View>
                <StyledText className="text-gray-900 ml-1 font-nunito-bold">
                  Dernière activité
                </StyledText>
              </StyledView>
              <StyledText className="text-gray-600 ml-8 text-sm font-nunito-medium">
                {(runner as any).last_active_at
                  ? new Date((runner as any).last_active_at).toLocaleDateString(
                      "fr-FR"
                    )
                  : "Non disponible"}
              </StyledText>
            </StyledView>

            {/* Date d'inscription */}
            <StyledView>
              <StyledView className="flex-row items-center mb-2">
                <View className="w-6 h-6 rounded-lg bg-tertiary items-center justify-center mr-2">
                  <Ionicons name="create-outline" size={16} color="#525252" />
                </View>
                <StyledText className="text-gray-900 ml-1 font-nunito-bold">
                  Membre depuis
                </StyledText>
              </StyledView>
              <StyledText className="text-gray-600 ml-8 text-sm font-nunito-medium">
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
      <StyledView className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-white border-t border-neutral-100">
        <StyledPressable
          className="py-4 rounded-2xl w-full flex-row justify-center items-center"
          style={{
            backgroundColor: ACCENT,
            shadowColor: ACCENT,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          }}
          onPress={handleSendMessage}
        >
          <Ionicons name="chatbubble-outline" size={20} color="white" />
          <StyledText className="text-white font-nunito-bold ml-2">
            Envoyer un message
          </StyledText>
        </StyledPressable>
      </StyledView>
    </StyledSafeAreaView>
  );
}
