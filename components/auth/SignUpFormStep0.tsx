import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RunnerBackground } from "../animations/RunnerBackground";

type Props = {
  onNext: (type: "chill" | "perf") => void;
};

export function SignUpFormStep0({ onNext }: Props) {
  const handleNext = (type: "chill" | "perf") => {
    onNext(type);
  };

  return (
    <View className="flex-1 mt-16 p-4">
      <RunnerBackground />
      <Text className="text-white text-2xl font-bold text-center px-4">
        Quel type de <Text className="text-green">runner</Text> es tu ? 🏃
      </Text>

      <View className="flex-1 justify-center -mt-20">
        <View className="space-y-4">
          <Pressable
            onPress={() => handleNext("chill")}
            className="bg-[#1e2429] p-6 rounded-2xl active:opacity-80 border border-[#2a3238]"
          >
            <View className="flex-row items-center mb-4">
              <View className="bg-[#2a3238] p-3 rounded-full">
                <Ionicons name="leaf-outline" size={24} color="#b9f144" />
              </View>
              <Text className="text-white text-xl font-bold ml-3">
                Je suis un runner Chill
              </Text>
            </View>
            <Text className="text-white leading-5">
              Je cours pour le plaisir, la santé et la socialisation. Je ne suis
              pas focalisé sur la performance.
            </Text>
            <View className="flex-row items-center mt-4">
              <Ionicons
                name="arrow-forward-circle-outline"
                size={20}
                color="#b9f144"
              />
              <Text className="text-green ml-2 font-semibold">
                Choisir ce profil
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => handleNext("perf")}
            className="bg-[#1e2429] p-6 rounded-2xl active:opacity-80 border border-[#2a3238]"
          >
            <View className="flex-row items-center mb-4">
              <View className="bg-[#2a3238] p-3 rounded-full">
                <Ionicons name="trophy-outline" size={24} color="#b9f144" />
              </View>
              <Text className="text-white text-xl font-bold ml-3">
                Je suis un runner Perf
              </Text>
            </View>
            <Text className="text-white leading-5">
              Je cours pour la performance, avec des objectifs précis et un plan
              d'entraînement structuré.
            </Text>
            <View className="flex-row items-center mt-4">
              <Ionicons
                name="arrow-forward-circle-outline"
                size={20}
                color="#b9f144"
              />
              <Text className="text-green ml-2 font-semibold">
                Choisir ce profil
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
