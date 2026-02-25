import React from "react";
import { View, ScrollView, Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FiltersContent } from "@/components/filters/FiltersContent";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import WarmBackground from "@/components/ui/WarmBackground";
import { useThemeColors } from "@/constants/theme";

export default function FilterScreen() {
  const router = useRouter();
  const { colors, shadows } = useThemeColors();

  return (
    <WarmBackground>
      <SafeAreaView className="flex-1" edges={['top']} style={{ flex: 1 }}>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View
            className="px-6 pt-4 pb-4"
            style={{
              borderBottomWidth: 1,
              borderBottomColor: colors.glass.border,
              ...shadows.sm,
            }}
          >
            <View className="flex-row items-center">
              <Pressable
                onPress={() => router.back()}
                className="p-3 rounded-full mr-3"
                style={{
                  backgroundColor: colors.primary.subtle,
                  ...shadows.sm,
                }}
              >
                <Ionicons name="arrow-back" size={20} color={colors.primary.DEFAULT} />
              </Pressable>
              <Text
                className="text-2xl font-nunito-extrabold"
                style={{ color: colors.text.primary }}
              >
                Filtres
              </Text>
            </View>
          </View>
          <View className="pb-8">
            <FiltersContent />
          </View>
        </ScrollView>
      </SafeAreaView>
    </WarmBackground>
  );
}
