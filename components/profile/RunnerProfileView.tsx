import React from "react";
import { View, Text, Pressable } from "react-native";
import { useAuth } from "@/context/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";

type RunnerProfileViewProps = {
  setIsEditing: (value: boolean) => void;
};

export function RunnerProfileView({ setIsEditing }: RunnerProfileViewProps) {
  const { user } = useAuth();
  const runner = user?.runner_profile;

  const formatObjective = (objective: string) => {
    const objectives: { [key: string]: string } = {
      "5km_sous_25min": "5km sous 25min",
      "10km_sous_50min": "10km sous 50min",
      semi_marathon: "Semi-marathon",
      marathon: "Marathon",
    };
    return objectives[objective] || objective;
  };

  return (
    <View className="px-5 space-y-6 mt-6">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-2xl font-bold text-white">Profil Coureur</Text>
        <Pressable
          onPress={() => setIsEditing(true)}
          className="bg-background p-3 rounded-full"
        >
          <Ionicons name="pencil" size={20} color="#f0c2fe" />
        </Pressable>
      </View>

      <View className="flex-row space-x-4">
        <View className="flex-1 bg-background p-4 rounded-2xl border border-[#2a3238]">
          <View className="items-center">
            <Ionicons name="speedometer-outline" size={24} color="#f0c2fe" />
            <Text className="text-white text-sm font-semibold mt-2">
              Allure
            </Text>
            <Text className="text-white text-lg mt-1">
              {runner?.actual_pace} min/km
            </Text>
          </View>
        </View>
        <View className="flex-1 bg-background p-4 rounded-2xl border border-[#2a3238]">
          <View className="items-center">
            <Ionicons name="trail-sign-outline" size={24} color="#f0c2fe" />
            <Text className="text-white text-sm font-semibold mt-2">
              Distance
            </Text>
            <Text className="text-white text-lg mt-1">
              {runner?.usual_distance} km
            </Text>
          </View>
        </View>
      </View>

      <View className="bg-background p-5 rounded-2xl border border-[#2a3238]">
        <View className="flex-row items-center space-x-3 mb-3">
          <Ionicons name="trophy-outline" size={24} color="#f0c2fe" />
          <Text className="text-white text-base font-semibold">Objectif</Text>
        </View>
        <Text className="text-white text-lg">
          {formatObjective(runner?.objective || "")}
        </Text>
      </View>

      <View className="bg-background p-5 rounded-2xl border border-[#2a3238]">
        <View className="flex-row items-center space-x-3 mb-3">
          <Ionicons name="calendar-outline" size={24} color="#f0c2fe" />
          <Text className="text-white text-base font-semibold">
            Disponibilités
          </Text>
        </View>
        <View className="flex-row flex-wrap gap-2">
          {Array.isArray(runner?.availability) ? (
            runner?.availability?.map((day: string) => (
              <View key={day} className="bg-background px-3 py-1 rounded-full">
                <Text className="text-white capitalize">{day.trim()}</Text>
              </View>
            ))
          ) : (
            <Text className="text-white">Aucune disponibilité</Text>
          )}
        </View>
      </View>
    </View>
  );
}
