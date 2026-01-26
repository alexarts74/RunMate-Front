import React from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const ACCENT = "#F97316";

type UserType = "runner" | "organizer";

type Props = {
  onNext: (userType: UserType) => void;
};

export function SignUpFormStepUserType({ onNext }: Props) {
  const router = useRouter();

  const handleNext = (userType: UserType) => {
    onNext(userType);
  };

  return (
    <SafeAreaView className="flex-1 bg-fond">
      <View className="flex-1 px-6">
        <View className="mt-8 mb-4">
          <Text className="text-gray-900 text-2xl font-nunito-extrabold text-center">
            Quel type de
            <Text className="text-primary"> compte</Text> {"\n"}souhaitez-vous créer ?
          </Text>
        </View>
        <View className="flex-1 justify-center pb-24">
          <View className="space-y-4">
            <Pressable
              onPress={() => handleNext("runner")}
              className="bg-white px-5 h-[200px] py-4 rounded-2xl active:opacity-80 border-2 border-gray-200"
              style={{
                shadowColor: ACCENT,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <View className="flex-row items-center mb-3">
                <View className="bg-tertiary p-3 rounded-xl">
                  <Ionicons name="person-outline" size={24} color={ACCENT} />
                </View>
                <Text className="text-gray-900 text-lg font-nunito-bold ml-3">
                  Je suis un Coureur
                </Text>
              </View>
              <Text className="text-gray-600 text-sm leading-5 font-nunito-medium mb-3">
                Je veux trouver des partenaires de course, participer à des événements et rejoindre des groupes de running.
              </Text>
              <View className="flex-row items-center">
                <Ionicons
                  name="arrow-forward-circle-outline"
                  size={18}
                  color={ACCENT}
                />
                <Text className="text-primary ml-2 font-nunito-medium text-sm">
                  Choisir ce profil
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => handleNext("organizer")}
              className="bg-white px-5 py-4 h-[200px] rounded-2xl active:opacity-80 border-2 border-gray-200"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <View className="flex-row items-center mb-3">
                <View className="bg-tertiary p-3 rounded-xl">
                  <Ionicons name="people-outline" size={24} color="#525252" />
                </View>
                <Text className="text-gray-900 text-lg font-nunito-bold ml-3">
                  Je suis un Organisateur
                </Text>
              </View>
              <Text className="text-gray-600 text-sm leading-5 font-nunito-medium mb-3">
                Je représente une association, un club ou une organisation et je veux créer des événements et des groupes de running.
              </Text>
              <View className="flex-row items-center">
                <Ionicons
                  name="arrow-forward-circle-outline"
                  size={18}
                  color="#525252"
                />
                <Text className="text-secondary ml-2 font-nunito-medium text-sm">
                  Choisir ce profil
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>

      <View className="absolute bottom-8 left-0 right-0 px-6">
        <Pressable
          onPress={() => router.back()}
          className="bg-white px-6 py-4 rounded-full active:opacity-80 border-2 border-gray-200"
          style={{
            shadowColor: ACCENT,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="arrow-back" size={18} color={ACCENT} />
            <Text className="text-primary ml-2 font-nunito-bold text-base">
              Retour
            </Text>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

