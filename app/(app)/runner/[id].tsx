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
import WarmBackground from "@/components/ui/WarmBackground";
import GlassCard from "@/components/ui/GlassCard";
import GlassButton from "@/components/ui/GlassButton";
import GlassAvatar from "@/components/ui/GlassAvatar";
import { useThemeColors } from "@/constants/theme";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledScrollView = styled(ScrollView);
const StyledPressable = styled(Pressable);
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
  const { colors, shadows } = useThemeColors();

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
        className="flex-row items-center justify-between p-4 rounded-t-2xl"
        style={{
          borderBottomLeftRadius: isOpen ? 0 : 16,
          borderBottomRightRadius: isOpen ? 0 : 16,
          backgroundColor: colors.glass.light,
          borderBottomWidth: isOpen ? 1 : 0,
          borderBottomColor: colors.glass.border,
          ...shadows.sm,
        }}
      >
        <StyledView className="flex-row items-center">
          <StyledView
            className="p-2.5 rounded-xl"
            style={{ backgroundColor: colors.primary.subtle }}
          >
            <Ionicons name={icon as any} size={18} color={colors.primary.DEFAULT} />
          </StyledView>
          <StyledText
            className="ml-3 font-nunito-bold"
            style={{ color: colors.text.primary }}
          >
            {title}
          </StyledText>
        </StyledView>
        <StyledAnimatedView style={{ transform: [{ rotate: rotation }] }}>
          <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
        </StyledAnimatedView>
      </StyledPressable>

      {isOpen && (
        <StyledAnimatedView
          className="p-4 rounded-b-2xl"
          style={{
            opacity: animatedController,
            backgroundColor: colors.glass.light,
            borderTopWidth: 1,
            borderTopColor: colors.glass.border,
            transform: [
              {
                translateY: animatedController.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-10, 0],
                }),
              },
            ],
            ...shadows.sm,
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
  const { colors, shadows } = useThemeColors();

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

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const formatCompetitionGoal = (goal: string) => {
    let formattedGoal = goal.replace(/_/g, " ");
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
        return formattedGoal.charAt(0).toUpperCase() + formattedGoal.slice(1);
    }
  };

  return (
    <WarmBackground>
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Contenu scrollable */}
        <StyledScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* Header avec image de profil */}
          <StyledView
            className="pt-4 px-6 pb-6"
            style={{ backgroundColor: colors.glass.heavy }}
          >
            {/* Header avec bouton retour */}
            <StyledView className="flex-row items-center mb-6">
              <StyledPressable
                onPress={() => router.back()}
                className="p-2 rounded-full"
                style={{ backgroundColor: colors.primary.subtle }}
              >
                <Ionicons name="arrow-back" size={24} color={colors.primary.DEFAULT} />
              </StyledPressable>
              <StyledText
                className="text-xl font-nunito-extrabold ml-3"
                style={{ color: colors.text.primary }}
              >
                Profil Runner
              </StyledText>
            </StyledView>

            <StyledView className="items-center">
              <StyledView className="mb-4">
                <GlassAvatar
                  uri={runner.profile_image}
                  size={128}
                  showRing
                />
              </StyledView>
              <StyledText
                className="text-3xl font-nunito-extrabold mt-2"
                style={{ color: colors.text.primary }}
              >
                {runner.first_name} {runner.last_name}
              </StyledText>

              <StyledText
                className="text-lg mt-1 font-nunito-medium"
                style={{ color: colors.text.secondary }}
              >
                {runner.age} ans
              </StyledText>

              <StyledView className="flex-row items-center mt-3">
                <View
                  className="w-5 h-5 rounded-full items-center justify-center mr-2"
                  style={{ backgroundColor: colors.primary.subtle }}
                >
                  <Ionicons name="location" size={12} color={colors.text.secondary} />
                </View>
                <StyledText className="font-nunito-medium" style={{ color: colors.text.secondary }}>
                  {runner.city}, {runner.department}
                </StyledText>
              </StyledView>

              {/* Bio */}
              {runner.bio && (
                <StyledView className="mt-6 px-4">
                  <StyledText
                    className="text-center italic font-nunito-medium"
                    style={{ color: colors.text.secondary }}
                  >
                    "{runner.bio}"
                  </StyledText>
                </StyledView>
              )}

              {/* Type de runner - badges */}
              <StyledView className="flex-row justify-center flex-wrap mt-6">
                <StyledView
                  className="px-4 py-2 rounded-full mr-3"
                  style={{
                    backgroundColor: colors.primary.subtle,
                    borderWidth: 1,
                    borderColor: colors.primary.DEFAULT,
                  }}
                >
                  <StyledText
                    className="text-sm font-nunito-bold"
                    style={{ color: colors.primary.DEFAULT }}
                  >
                    {runner.runner_profile.running_type === "chill"
                      ? "Runner Chill"
                      : "Runner Perf"}
                  </StyledText>
                </StyledView>

                {runner.runner_profile.flexible && (
                  <StyledView
                    className="px-4 py-2 rounded-full flex-row items-center"
                    style={{
                      backgroundColor: colors.primary.subtle,
                      borderWidth: 1,
                      borderColor: colors.primary.light,
                    }}
                  >
                    <Ionicons name="leaf-outline" size={16} color={colors.text.secondary} />
                    <StyledText
                      className="ml-2 text-sm font-nunito-bold"
                      style={{ color: colors.text.secondary }}
                    >
                      Flexible
                    </StyledText>
                  </StyledView>
                )}
              </StyledView>
            </StyledView>
          </StyledView>

          {/* Sections avec accordeon */}
          <StyledView className="px-6 py-4">
            {/* Statistiques de course */}
            <CollapsibleSection title="Statistiques" icon="stats-chart-outline">
              <StyledView className="flex-row justify-between gap-x-3">
                <StyledView
                  className="items-center p-4 rounded-xl flex-1"
                  style={{ backgroundColor: colors.glass.medium, borderWidth: 1, borderColor: colors.glass.border }}
                >
                  <StyledView
                    className="p-2.5 rounded-full mb-2"
                    style={{ backgroundColor: colors.elevated }}
                  >
                    <Ionicons name="walk-outline" size={18} color={colors.primary.DEFAULT} />
                  </StyledView>
                  <StyledText className="text-center text-xs font-nunito-medium mb-1" style={{ color: colors.text.secondary }}>
                    Pace
                  </StyledText>
                  <StyledText className="text-base font-nunito-bold" style={{ color: colors.primary.DEFAULT }}>
                    {runner.runner_profile.actual_pace} min/km
                  </StyledText>
                </StyledView>

                <StyledView
                  className="items-center p-4 rounded-xl flex-1"
                  style={{ backgroundColor: colors.glass.medium, borderWidth: 1, borderColor: colors.glass.border }}
                >
                  <StyledView
                    className="p-2.5 rounded-full mb-2"
                    style={{ backgroundColor: colors.elevated }}
                  >
                    <Ionicons name="resize-outline" size={18} color={colors.text.secondary} />
                  </StyledView>
                  <StyledText className="text-center text-xs font-nunito-medium mb-1" style={{ color: colors.text.secondary }}>
                    {runner.runner_profile.running_type === "perf"
                      ? "Distance/semaine"
                      : "Distance"}
                  </StyledText>
                  <StyledText className="text-base font-nunito-bold" style={{ color: colors.primary.DEFAULT }}>
                    {runner.runner_profile.running_type === "perf"
                      ? `${runner.runner_profile.weekly_mileage || 0} km/sem`
                      : `${runner.runner_profile.usual_distance || 0} km`}
                  </StyledText>
                </StyledView>

                <StyledView
                  className="items-center p-4 rounded-xl flex-1"
                  style={{ backgroundColor: colors.glass.medium, borderWidth: 1, borderColor: colors.glass.border }}
                >
                  <StyledView
                    className="p-2.5 rounded-full mb-2"
                    style={{ backgroundColor: colors.elevated }}
                  >
                    {runner.runner_profile.running_type === "perf" ? (
                      <Ionicons name="speedometer-outline" size={18} color={colors.primary.DEFAULT} />
                    ) : (
                      <Ionicons name="repeat-outline" size={18} color={colors.text.secondary} />
                    )}
                  </StyledView>
                  <StyledText className="text-center text-xs font-nunito-medium mb-1" style={{ color: colors.text.secondary }}>
                    {runner.runner_profile.running_type === "perf"
                      ? "Target Pace"
                      : "Frequence"}
                  </StyledText>
                  <StyledText className="text-base font-nunito-bold" style={{ color: colors.primary.DEFAULT }}>
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
                <CollapsibleSection
                  title="Objectifs de performance"
                  icon="ribbon-outline"
                >
                  {competitionGoals && (
                    <StyledView className="mb-4">
                      <StyledView className="flex-row items-center mb-2">
                        <View
                          className="w-6 h-6 rounded-lg items-center justify-center mr-2"
                          style={{ backgroundColor: colors.primary.subtle }}
                        >
                          <Ionicons name="ribbon-outline" size={16} color={colors.primary.DEFAULT} />
                        </View>
                        <StyledText className="ml-1 font-nunito-bold" style={{ color: colors.text.primary }}>
                          Objectifs de competition
                        </StyledText>
                      </StyledView>
                      <StyledText className="ml-8 text-sm font-nunito-medium" style={{ color: colors.text.secondary }}>
                        {Array.isArray(competitionGoals)
                          ? competitionGoals.map(formatCompetitionGoal).join(", ")
                          : typeof competitionGoals === "string"
                          ? formatCompetitionGoal(competitionGoals)
                          : "Non precise"}
                      </StyledText>
                    </StyledView>
                  )}

                  {Array.isArray(trainingDays) && trainingDays.length > 0 && (
                    <StyledView>
                      <StyledView className="flex-row items-center mb-2">
                        <View
                          className="w-6 h-6 rounded-lg items-center justify-center mr-2"
                          style={{ backgroundColor: colors.primary.subtle }}
                        >
                          <Ionicons name="calendar-outline" size={16} color={colors.text.secondary} />
                        </View>
                        <StyledText className="ml-1 font-nunito-bold" style={{ color: colors.text.primary }}>
                          Jours d'entrainement
                        </StyledText>
                      </StyledView>
                      <StyledView className="flex-row flex-wrap ml-8">
                        {trainingDays.map((day, index) => (
                          <StyledView
                            key={index}
                            className="px-3 py-1 rounded-full mr-2 mb-2"
                            style={{
                              backgroundColor: colors.primary.subtle,
                              borderWidth: 1,
                              borderColor: colors.primary.DEFAULT,
                            }}
                          >
                            <StyledText className="text-xs font-nunito-bold" style={{ color: colors.primary.DEFAULT }}>
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
                <CollapsibleSection
                  title="Infos pratiques"
                  icon="information-circle-outline"
                >
                  <StyledView className="mb-4">
                    <StyledView className="flex-row items-center mb-2">
                      <View
                        className="w-6 h-6 rounded-lg items-center justify-center mr-2"
                        style={{ backgroundColor: colors.primary.subtle }}
                      >
                        <Ionicons name="trophy-outline" size={16} color={colors.primary.DEFAULT} />
                      </View>
                      <StyledText className="ml-1 font-nunito-bold" style={{ color: colors.text.primary }}>
                        Objectif
                      </StyledText>
                    </StyledView>
                    <StyledText className="ml-8 text-sm font-nunito-medium" style={{ color: colors.text.secondary }}>
                      {typeof objective === "string"
                        ? objective.charAt(0).toUpperCase() + objective.slice(1)
                        : Array.isArray(objective)
                        ? objective.length > 0
                          ? objective.join(", ")
                          : "Non precise"
                        : "Non precise"}
                    </StyledText>
                  </StyledView>

                  <StyledView className="mb-4">
                    <StyledView className="flex-row items-center mb-2">
                      <View
                        className="w-6 h-6 rounded-lg items-center justify-center mr-2"
                        style={{ backgroundColor: colors.primary.subtle }}
                      >
                        <Ionicons name="calendar-outline" size={16} color={colors.text.secondary} />
                      </View>
                      <StyledText className="ml-1 font-nunito-bold" style={{ color: colors.text.primary }}>
                        Disponibilites
                      </StyledText>
                    </StyledView>
                    <StyledView className="flex-row flex-wrap ml-8">
                      {Array.isArray(availability) && availability.length > 0 ? (
                        availability.map((day, index) => (
                          <StyledView
                            key={index}
                            className="px-3 py-1 rounded-full mr-2 mb-2"
                            style={{
                              backgroundColor: colors.primary.subtle,
                              borderWidth: 1,
                              borderColor: colors.primary.light,
                            }}
                          >
                            <StyledText className="text-xs font-nunito-bold text-center" style={{ color: colors.primary.DEFAULT }}>
                              {capitalize(day)}
                            </StyledText>
                          </StyledView>
                        ))
                      ) : (
                        <StyledText className="text-sm font-nunito-medium" style={{ color: colors.text.tertiary }}>
                          Aucune disponibilite renseignee
                        </StyledText>
                      )}
                    </StyledView>
                  </StyledView>

                  {Array.isArray(preferredTimeOfDay) &&
                    preferredTimeOfDay.length > 0 && (
                      <StyledView>
                        <StyledView className="flex-row items-center mb-2">
                          <View
                            className="w-6 h-6 rounded-lg items-center justify-center mr-2"
                            style={{ backgroundColor: colors.primary.subtle }}
                          >
                            <Ionicons name="time-outline" size={16} color={colors.text.secondary} />
                          </View>
                          <StyledText className="ml-1 font-nunito-bold" style={{ color: colors.text.primary }}>
                            Moments preferes
                          </StyledText>
                        </StyledView>
                        <StyledView className="flex-row flex-wrap ml-8">
                          {preferredTimeOfDay.map((time, index) => (
                            <StyledView
                              key={index}
                              className="px-3 py-1 rounded-full mr-2 mb-2"
                              style={{
                                backgroundColor: colors.primary.subtle,
                                borderWidth: 1,
                                borderColor: colors.primary.light,
                              }}
                            >
                              <StyledText className="text-xs font-nunito-bold" style={{ color: colors.primary.DEFAULT }}>
                                {time}
                              </StyledText>
                            </StyledView>
                          ))}
                        </StyledView>
                      </StyledView>
                    )}
                </CollapsibleSection>

                <CollapsibleSection
                  title="Preferences sociales"
                  icon="people-outline"
                >
                  {socialPreferences && socialPreferences.length > 0 && (
                    <StyledView className="mb-4">
                      <StyledView className="flex-row items-center mb-2">
                        <View
                          className="w-6 h-6 rounded-lg items-center justify-center mr-2"
                          style={{ backgroundColor: colors.primary.subtle }}
                        >
                          <Ionicons name="people-outline" size={16} color={colors.text.secondary} />
                        </View>
                        <StyledText className="ml-1 font-nunito-bold" style={{ color: colors.text.primary }}>
                          Preferences sociales
                        </StyledText>
                      </StyledView>
                      <StyledView className="flex-row flex-wrap ml-8">
                        {Array.isArray(socialPreferences) &&
                          socialPreferences.map((pref, index) => (
                            <StyledView
                              key={index}
                              className="px-3 py-1 rounded-full mr-2 mb-2"
                              style={{
                                backgroundColor: colors.primary.subtle,
                                borderWidth: 1,
                                borderColor: colors.primary.light,
                              }}
                            >
                              <StyledText className="text-xs font-nunito-bold" style={{ color: colors.primary.DEFAULT }}>
                                {pref}
                              </StyledText>
                            </StyledView>
                          ))}
                      </StyledView>
                    </StyledView>
                  )}

                  {postRunActivities && postRunActivities.length > 0 && (
                    <StyledView>
                      <StyledView className="flex-row items-center mb-2">
                        <View
                          className="w-6 h-6 rounded-lg items-center justify-center mr-2"
                          style={{ backgroundColor: colors.primary.subtle }}
                        >
                          <Ionicons name="cafe-outline" size={16} color={colors.primary.DEFAULT} />
                        </View>
                        <StyledText className="ml-1 font-nunito-bold" style={{ color: colors.text.primary }}>
                          Apres la course
                        </StyledText>
                      </StyledView>
                      <StyledView className="flex-row flex-wrap ml-8">
                        {Array.isArray(postRunActivities) &&
                          postRunActivities.map((activity, index) => (
                            <StyledView
                              key={index}
                              className="px-3 py-1 rounded-full mr-2 mb-2"
                              style={{
                                backgroundColor: colors.primary.subtle,
                                borderWidth: 1,
                                borderColor: colors.primary.DEFAULT,
                              }}
                            >
                              <StyledText className="text-xs font-nunito-bold" style={{ color: colors.primary.DEFAULT }}>
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

            <CollapsibleSection
              title="Plus d'informations"
              icon="ellipsis-horizontal-circle-outline"
              initiallyOpen={false}
            >
              <StyledView className="mb-4">
                <StyledView className="flex-row items-center mb-2">
                  <View
                    className="w-6 h-6 rounded-lg items-center justify-center mr-2"
                    style={{ backgroundColor: colors.primary.subtle }}
                  >
                    <Ionicons name="pulse-outline" size={16} color={colors.primary.DEFAULT} />
                  </View>
                  <StyledText className="ml-1 font-nunito-bold" style={{ color: colors.text.primary }}>
                    Derniere activite
                  </StyledText>
                </StyledView>
                <StyledText className="ml-8 text-sm font-nunito-medium" style={{ color: colors.text.secondary }}>
                  {(runner as any).last_active_at
                    ? new Date((runner as any).last_active_at).toLocaleDateString("fr-FR")
                    : "Non disponible"}
                </StyledText>
              </StyledView>

              <StyledView>
                <StyledView className="flex-row items-center mb-2">
                  <View
                    className="w-6 h-6 rounded-lg items-center justify-center mr-2"
                    style={{ backgroundColor: colors.primary.subtle }}
                  >
                    <Ionicons name="create-outline" size={16} color={colors.text.secondary} />
                  </View>
                  <StyledText className="ml-1 font-nunito-bold" style={{ color: colors.text.primary }}>
                    Membre depuis
                  </StyledText>
                </StyledView>
                <StyledText className="ml-8 text-sm font-nunito-medium" style={{ color: colors.text.secondary }}>
                  {(runner as any).created_at
                    ? new Date((runner as any).created_at).toLocaleDateString("fr-FR")
                    : "Non disponible"}
                </StyledText>
              </StyledView>
            </CollapsibleSection>
          </StyledView>
        </StyledScrollView>

        {/* Footer fixe */}
        <StyledView
          className="absolute bottom-0 left-0 right-0 px-6 py-4"
          style={{
            backgroundColor: colors.glass.heavy,
            borderTopWidth: 1,
            borderTopColor: colors.glass.border,
          }}
        >
          <GlassButton
            title="Envoyer un message"
            onPress={handleSendMessage}
            icon={<Ionicons name="chatbubble-outline" size={20} color="white" />}
            size="lg"
          />
        </StyledView>
      </SafeAreaView>
    </WarmBackground>
  );
}
