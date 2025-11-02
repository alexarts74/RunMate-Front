import React from "react";
import { View, ScrollView, Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FiltersContent } from "@/components/filters/FiltersContent";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function FilterScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-fond">
      <SafeAreaView className="flex-1" edges={['top']} style={{ flex: 1 }}>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="px-6 pt-4 pb-4 bg-fond border-b border-gray-200"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <View className="flex-row items-center">
              <Pressable 
                onPress={() => router.back()} 
                className="bg-tertiary p-3 rounded-full mr-3"
                style={{
                  shadowColor: "#FF6B4A",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Ionicons name="arrow-back" size={20} color="#FF6B4A" />
              </Pressable>
              <Text className="text-2xl font-kanit-bold text-gray-900">Filtres</Text>
            </View>
          </View>
          <View className="pb-8">
            <FiltersContent />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
