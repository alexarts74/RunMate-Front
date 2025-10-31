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
    <View className="px-6 space-y-6 mt-6">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-2xl font-kanit-bold text-gray-900">Profil Coureur</Text>
        <Pressable
          onPress={() => setIsEditing(true)}
          className="bg-tertiary p-3 rounded-full"
          style={{
            shadowColor: "#FF6B4A",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Ionicons name="pencil" size={20} color="#FF6B4A" />
        </Pressable>
      </View>

      <View className="flex-row space-x-4">
        <View className="flex-1 bg-white p-5 rounded-2xl border border-gray-200"
          style={{
            shadowColor: "#FF6B4A",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <View className="items-center">
            <View className="w-12 h-12 rounded-xl bg-tertiary items-center justify-center mb-3">
              <Ionicons name="speedometer-outline" size={24} color="#FF6B4A" />
            </View>
            <Text className="text-gray-600 text-sm font-kanit-medium mt-1">
              Allure
            </Text>
            <Text className="text-primary text-lg mt-1 font-kanit-bold">
              {runner?.actual_pace} min/km
            </Text>
          </View>
        </View>
        <View className="flex-1 bg-white p-5 rounded-2xl border border-gray-200"
          style={{
            shadowColor: "#A78BFA",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <View className="items-center">
            <View className="w-12 h-12 rounded-xl bg-tertiary items-center justify-center mb-3">
              <Ionicons name="trail-sign-outline" size={24} color="#A78BFA" />
            </View>
            <Text className="text-gray-600 text-sm font-kanit-medium mt-1">
              Distance
            </Text>
            <Text className="text-secondary text-lg mt-1 font-kanit-bold">
              {runner?.usual_distance} km
            </Text>
          </View>
        </View>
      </View>

      <View className="bg-white p-5 rounded-2xl border border-gray-200"
        style={{
          shadowColor: "#FF6B4A",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <View className="flex-row items-center space-x-3 mb-3">
          <View className="w-10 h-10 rounded-xl bg-tertiary items-center justify-center">
            <Ionicons name="trophy-outline" size={20} color="#FF6B4A" />
          </View>
          <Text className="text-gray-900 text-base font-kanit-bold">Objectif</Text>
        </View>
        <Text className="text-gray-700 text-base font-kanit-medium">
          {formatObjective(runner?.objective || "")}
        </Text>
      </View>

      <View className="bg-white p-5 rounded-2xl border border-gray-200"
        style={{
          shadowColor: "#A78BFA",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <View className="flex-row items-center space-x-3 mb-3">
          <View className="w-10 h-10 rounded-xl bg-tertiary items-center justify-center">
            <Ionicons name="calendar-outline" size={20} color="#A78BFA" />
          </View>
          <Text className="text-gray-900 text-base font-kanit-bold">
            Disponibilités
          </Text>
        </View>
        <View className="flex-row flex-wrap gap-2">
          {Array.isArray(runner?.availability) ? (
            runner?.availability?.map((day: string) => (
              <View key={day} className="bg-tertiary border border-secondary px-3 py-1 rounded-full">
                <Text className="text-secondary capitalize font-kanit-bold text-xs">{day.trim()}</Text>
              </View>
            ))
          ) : (
            <Text className="text-gray-500 font-kanit-medium">Aucune disponibilité</Text>
          )}
        </View>
      </View>
    </View>
  );
}
