import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
    <SafeAreaView className="flex-1 bg-fond">
      <View className="flex-1 px-6">
        <View className="mt-8 mb-4">
          <Text className="text-gray-900 text-2xl font-kanit-bold text-center">
            Quel type de
            <Text className="text-primary"> runner</Text> {"\n"}es tu ?
          </Text>
        </View>
        <View className="flex-1 justify-center pb-24">
          <View className="space-y-4">
            <Pressable
              onPress={() => handleNext("chill")}
              className="bg-white px-5 h-[180px] py-4 rounded-2xl active:opacity-80 border-2 border-gray-200"
              style={{
                shadowColor: "#A78BFA",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <View className="flex-row items-center mb-3">
                <View className="bg-tertiary p-3 rounded-xl">
                  <Ionicons name="leaf-outline" size={24} color="#A78BFA" />
                </View>
                <Text className="text-gray-900 text-lg font-kanit-bold ml-3">
                  Je suis un runner Chill
                </Text>
              </View>
              <Text className="text-gray-600 text-sm leading-5 font-kanit-medium mb-3">
                Je cours pour le plaisir, la santé et la socialisation. Je ne
                suis pas focalisé sur la performance.
              </Text>
              <View className="flex-row items-center">
                <Ionicons
                  name="arrow-forward-circle-outline"
                  size={18}
                  color="#A78BFA"
                />
                <Text className="text-secondary ml-2 font-kanit-medium text-sm">
                  Choisir ce profil
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => handleNext("perf")}
              className="bg-white px-5 py-4 h-[180px] rounded-2xl active:opacity-80 border-2 border-gray-200"
              style={{
                shadowColor: "#FF6B4A",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <View className="flex-row items-center mb-3">
                <View className="bg-tertiary p-3 rounded-xl">
                  <Ionicons name="trophy-outline" size={24} color="#FF6B4A" />
                </View>
                <Text className="text-gray-900 text-lg font-kanit-bold ml-3">
                  Je suis un runner Perf
                </Text>
              </View>
              <Text className="text-gray-600 text-sm leading-5 font-kanit-medium mb-3">
                Je cours pour la performance, avec des objectifs précis et un
                plan d'entraînement structuré.
              </Text>
              <View className="flex-row items-center">
                <Ionicons
                  name="arrow-forward-circle-outline"
                  size={18}
                  color="#FF6B4A"
                />
                <Text className="text-primary ml-2 font-kanit-medium text-sm">
                  Choisir ce profil
                </Text>
              </View>
            </Pressable>

            <View className="mt-6">
              <Text className="text-gray-900 text-base font-kanit-bold mb-4">
                Option supplémentaire
              </Text>
              <Pressable
                onPress={() => setIsFlexible(!isFlexible)}
                className={`px-5 py-4 rounded-xl active:opacity-80 border-2 bg-white ${
                  isFlexible ? "border-primary" : "border-gray-200"
                }`}
                style={{
                  shadowColor: isFlexible ? "#FF6B4A" : "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isFlexible ? 0.15 : 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <View className="flex-row items-center">
                  <View
                    className={`w-6 h-6 rounded-lg border-2 items-center justify-center mr-3 ${
                      isFlexible
                        ? "bg-primary border-primary"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isFlexible && (
                      <Ionicons name="checkmark" size={16} color="white" />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 text-base font-kanit-bold">
                      Je suis flexible
                    </Text>
                    <Text className="text-gray-600 text-sm leading-5 mt-1 font-kanit-medium">
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

      <View className="absolute bottom-8 left-0 right-0 px-6">
        <Pressable
          onPress={() => router.back()}
          className="bg-white px-6 py-4 rounded-full active:opacity-80 border-2 border-gray-200"
          style={{
            shadowColor: "#FF6B4A",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="arrow-back" size={18} color="#FF6B4A" />
            <Text className="text-primary ml-2 font-kanit-bold text-base">
              Retour
            </Text>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
