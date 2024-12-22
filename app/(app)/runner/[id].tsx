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
    <StyledScrollView className="flex-1 bg-[#12171b]">
      <StyledView className="pt-12 px-5">
        <StyledView className="flex-row items-center mb-6">
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
          <StyledText className="text-2xl font-bold text-white mt-4">
            {runner.first_name} {runner.last_name}
          </StyledText>

          <StyledView className="flex-row items-center mt-2">
            <Ionicons name="location" size={16} color="#9CA3AF" />
            <StyledText className="text-green ml-1">
              {runner.location}
            </StyledText>
          </StyledView>
        </StyledView>
      </StyledView>

      {/* Statistiques de course */}
      <StyledView className="mt-8 px-5">
        <StyledView className="flex-row justify-between mb-6 gap-x-2">
          <StyledView className="items-center bg-[#1e2429] p-4 rounded-xl flex-1">
            <Ionicons name="walk-outline" size={24} color="#b9f144" />
            <StyledText className="text-white text-center mt-2">
              Allure
            </StyledText>
            <StyledText className="text-green text-lg font-bold">
              {runner.runner_profile.actual_pace} min/km
            </StyledText>
          </StyledView>

          <StyledView className="items-center bg-[#1e2429] p-4 rounded-xl flex-1 ">
            <Ionicons name="resize-outline" size={24} color="#b9f144" />
            <StyledText className="text-white text-center mt-2">
              Distance
            </StyledText>
            <StyledText className="text-green text-lg font-bold">
              {runner.runner_profile.usual_distance} km
            </StyledText>
          </StyledView>
        </StyledView>

        {/* Objectif */}
        <StyledView className="bg-[#1e2429] p-4 rounded-xl mb-6">
          <StyledView className="flex-row items-center">
            <Ionicons name="trophy-outline" size={24} color="#b9f144" />
            <StyledText className="text-white ml-2 text-lg">
              Objectif
            </StyledText>
          </StyledView>
          <StyledText className="text-green mt-2">
            {runner.runner_profile.objective}
          </StyledText>
        </StyledView>

        {/* Disponibilités */}
        <StyledView className="bg-[#1e2429] p-4 rounded-xl mb-6">
          <StyledView className="flex-row items-center mb-3">
            <Ionicons name="calendar-outline" size={24} color="#b9f144" />
            <StyledText className="text-white ml-2 text-lg">
              Disponibilités
            </StyledText>
          </StyledView>
          <StyledView className="flex-row flex-wrap">
            {/* {runner.runner_profile.availability.map((day, index) => (
              <StyledView
                key={index}
                className="bg-[#12171b] px-3 py-1 rounded-full mr-2 mb-2"
              >
                <StyledText className="text-green">{day}</StyledText>
              </StyledView>
            ))} */}
          </StyledView>
        </StyledView>
      </StyledView>

      {/* Bouton de contact */}
      <StyledView className="px-5 mb-8">
        <StyledPressable
          className="bg-green py-4 rounded-xl flex-row justify-center items-center"
          onPress={handleSendMessage}
        >
          <Ionicons name="chatbubble-outline" size={24} color="#12171b" />
          <StyledText className="text-[#12171b] font-bold ml-2">
            Envoyer un message
          </StyledText>
        </StyledPressable>
      </StyledView>
    </StyledScrollView>
  );
}
