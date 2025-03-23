import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
type RunnerType = "chill" | "perf";

type Props = {
  onNext: (type: RunnerType, isFlexible: boolean) => void;
};

export function SignUpFormStep0({ onNext }: Props) {
  const [isFlexible, setIsFlexible] = useState(false);
  const router = useRouter();

  const handleNext = (type: RunnerType) => {
    onNext(type, isFlexible);
  };

  return (
    <View className="flex-1 mt-8 p-4 bg-background">
      {/* <RunnerBackgrsound /> */}
      <View className="relative flex-row items-center justify-center my-12">
        <Pressable
          onPress={() => router.back()}
          className="bg-[#1e2429] p-1.5 rounded-full border border-gray-700 active:opacity-80 ml-4"
        >
          <Ionicons name="arrow-back" size={22} color="#8101f7" />
        </Pressable>

        <Text className="text-white text-2xl font-kanit-bold text-center w-[80%]">
          Quel type de
          <Text className="text-purple"> runner</Text> {"\n"}es tu ?
        </Text>
      </View>
      <View className="flex-1 justify-center -mt-10">
        <View className="space-y-3">
          <Pressable
            onPress={() => handleNext("chill")}
            className="bg-[#1e2429] px-5 h-[175px] py-4 rounded-2xl active:opacity-80 border border-gray-700"
          >
            <View className="flex-row items-center mb-2">
              <View className="bg-[#2a3238] p-2.5 rounded-full">
                <Ionicons name="leaf-outline" size={22} color="#8101f7" />
              </View>
              <Text className="text-white text-lg font-kanit-semibold ml-3">
                Je suis un runner Chill
              </Text>
            </View>
            <Text className="text-white text-sm leading-5 font-kanit">
              Je cours pour le plaisir, la santé et la socialisation. Je ne suis
              pas focalisé sur la performance.
            </Text>
            <View className="flex-row items-center mt-2">
              <Ionicons
                name="arrow-forward-circle-outline"
                size={18}
                color="#8101f7"
              />
              <Text className="text-purple ml-2 font-kanit-medium text-sm">
                Choisir ce profil
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => handleNext("perf")}
            className="bg-[#1e2429] px-5 py-4 h-[175px] rounded-2xl active:opacity-80 border border-gray-700"
          >
            <View className="flex-row items-center mb-2">
              <View className="bg-[#2a3238] p-2.5 rounded-full">
                <Ionicons name="trophy-outline" size={22} color="#8101f7" />
              </View>
              <Text className="text-white text-lg font-kanit-semibold ml-3">
                Je suis un runner Perf
              </Text>
            </View>
            <Text className="text-white text-sm leading-5 font-kanit">
              Je cours pour la performance, avec des objectifs précis et un plan
              d'entraînement structuré.
            </Text>
            <View className="flex-row items-center mt-2">
              <Ionicons
                name="arrow-forward-circle-outline"
                size={18}
                color="#8101f7"
              />
              <Text className="text-purple ml-2 font-kanit-medium text-sm">
                Choisir ce profil
              </Text>
            </View>
          </Pressable>

          <View className="mt-4">
            <Text className="text-white text-base font-kanit-semibold mb-4 mt-8">
              Option supplémentaire
            </Text>
            <Pressable
              onPress={() => setIsFlexible(!isFlexible)}
              className={`px-5 py-3 rounded-xl active:opacity-80 border ${
                isFlexible ? "border-purple" : "border-gray-700"
              }`}
            >
              <View className="flex-row items-center">
                <View
                  className={`w-5 h-5 rounded border ${
                    isFlexible ? "bg-purple border-purple" : "border-gray-500"
                  } mr-3 items-center justify-center`}
                >
                  {isFlexible && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <View className="flex-1">
                  <Text className="text-white text-base font-kanit-semibold ml-6">
                    Je suis flexible
                  </Text>
                  <Text className="text-white text-sm leading-5 mt-1 ml-6 font-kanit">
                    Je peux m'adapter aux objectifs, et entrainements de mes
                    partenaires.
                  </Text>
                </View>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
