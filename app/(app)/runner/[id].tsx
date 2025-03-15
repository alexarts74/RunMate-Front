import { View, Text, Image, ScrollView, Pressable } from "react-native";
import React from "react";
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

export default function RunnerProfileScreen() {
  const { id } = useLocalSearchParams();
  const { matches } = useMatches();
  const runner = matches?.find((match) => match.user.id === Number(id))?.user;

  if (!runner) return null;

  const handleSendMessage = () => {
    router.push(`/chat/${id}`);
  };

  return (
    <StyledView className="flex-1 bg-[#14141b]">
      <StyledView className="flex-1">
        <StyledView className="pt-8 px-5 mt-8">
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
              className="w-24 h-24 rounded-full"
            />
            <StyledText className="text-xl font-bold text-white mt-2">
              {runner.first_name} {runner.last_name}
            </StyledText>

            <StyledView className="flex-row items-center mt-1">
              <Ionicons name="location" size={16} color="#9CA3AF" />
              <StyledText className="text-purple ml-1">
                {runner.city}, {runner.department}
              </StyledText>
            </StyledView>
          </StyledView>
        </StyledView>

        {/* Statistiques de course */}
        <StyledView className="mt-4 px-5">
          <StyledView className="flex-row justify-between mb-3 gap-x-2">
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
          </StyledView>

          {/* Type de runner */}
          <StyledView className="bg-[#1e2429] p-3 rounded-xl mb-3">
            <StyledView className="flex-row items-center mb-2">
              <StyledView className="bg-[#2a3238] p-2 rounded-full">
                <Ionicons name="person-outline" size={18} color="#8101f7" />
              </StyledView>
              <StyledText className="text-white ml-2 text-base">
                Type de runner
              </StyledText>
            </StyledView>
            <StyledView className="flex-row items-center flex-wrap">
              <StyledView className="flex-row items-center">
                <StyledText className="text-purple ml-2 text-sm">
                  {runner.runner_profile.running_type === "chill"
                    ? "Runner Chill"
                    : "Runner Perf"}
                </StyledText>
              </StyledView>
              {runner.runner_profile.flexible && (
                <StyledView className="flex-row items-center ml-4">
                  <StyledView className="bg-[#2a3238] p-1.5 rounded-full">
                    <Ionicons name="people-outline" size={16} color="#8101f7" />
                  </StyledView>
                  <StyledText className="text-purple ml-2 text-sm">
                    Flexible
                  </StyledText>
                </StyledView>
              )}
            </StyledView>
          </StyledView>

          {/* Objectif */}
          <StyledView className="bg-[#1e2429] p-3 rounded-xl mb-3">
            <StyledView className="flex-row items-center">
              <StyledView className="bg-[#2a3238] p-2 rounded-full">
                <Ionicons name="trophy-outline" size={18} color="#8101f7" />
              </StyledView>
              <StyledText className="text-white ml-2 text-base">
                Objectif
              </StyledText>
            </StyledView>
            <StyledText className="text-purple mt-1 ml-2 text-sm">
              {runner.runner_profile.objective.charAt(0).toUpperCase() +
                runner.runner_profile.objective.slice(1)}
            </StyledText>
          </StyledView>

          {/* Disponibilités */}
          <StyledView className="bg-[#1e2429] p-3 rounded-xl mb-3">
            <StyledView className="flex-row items-center mb-2">
              <StyledView className="bg-[#2a3238] p-2 rounded-full">
                <Ionicons name="calendar-outline" size={18} color="#8101f7" />
              </StyledView>
              <StyledText className="text-white ml-2 text-base">
                Disponibilités
              </StyledText>
            </StyledView>
            <StyledView className="flex-row flex-wrap">
              {runner?.runner_profile?.availability ? (
                typeof runner.runner_profile.availability === "string" ? (
                  JSON.parse(runner.runner_profile.availability).map(
                    (day: string, index: number) => (
                      <StyledView
                        key={index}
                        className="bg-[#2a3238] px-2 py-0.5 rounded-full mr-2 mb-1"
                      >
                        <StyledText className="text-purple text-sm">
                          {day.charAt(0).toUpperCase() + day.slice(1)}
                        </StyledText>
                      </StyledView>
                    )
                  )
                ) : (
                  runner.runner_profile.availability.map((day, index) => (
                    <StyledView
                      key={index}
                      className="bg-[#2a3238] px-2 py-0.5 rounded-full mr-2 mb-1"
                    >
                      <StyledText className="text-purple text-sm text-center">
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </StyledText>
                    </StyledView>
                  ))
                )
              ) : (
                <StyledText className="text-gray-400 text-sm">
                  Aucune disponibilité renseignée
                </StyledText>
              )}
            </StyledView>
          </StyledView>
        </StyledView>
      </StyledView>

      {/* Footer */}
      <StyledView className="px-5 pt-4 pb-8 border-t flex-row justify-center border-gray-800">
        <StyledPressable
          className="bg-purple py-3 rounded-full w-4/5 flex-row justify-center items-center"
          onPress={handleSendMessage}
        >
          <Ionicons name="chatbubble-outline" size={20} color="white" />
          <StyledText className="text-white font-bold ml-2">
            Envoyer un message
          </StyledText>
        </StyledPressable>
      </StyledView>
    </StyledView>
  );
}
