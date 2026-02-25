import React, { useEffect } from "react";
import { View, ScrollView, Pressable, Text, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CreateGroupForm } from "@/components/group/CreateGroupForm";
import { useAuth } from "@/context/AuthContext";
import WarmBackground from "@/components/ui/WarmBackground";
import { useThemeColors } from "@/constants/theme";

export default function CreateGroupScreen() {
  const { user } = useAuth();
  const { colors, shadows } = useThemeColors();

  useEffect(() => {
    if (user?.user_type !== "organizer") {
      Alert.alert(
        "Acces restreint",
        "Seuls les organisateurs peuvent creer des groupes. Veuillez creer un compte organisateur pour acceder a cette fonctionnalite.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    }
  }, [user]);

  return (
    <WarmBackground>
      <SafeAreaView style={{ backgroundColor: colors.glass.heavy }} edges={['top']}>
        <View
          className="flex-row items-center px-6 py-4"
          style={{
            backgroundColor: colors.glass.heavy,
            ...shadows.sm,
          }}
        >
          <Pressable onPress={() => router.back()} className="mr-4">
            <Ionicons name="close" size={24} color={colors.primary.DEFAULT} />
          </Pressable>
          <Text
            className="text-xl font-nunito-extrabold flex-1"
            style={{ color: colors.text.primary }}
          >
            Creer un groupe
          </Text>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-6 py-6">
            {/* Description */}
            <Text
              className="font-nunito-medium text-base mb-6"
              style={{ color: colors.text.secondary }}
            >
              Creez votre groupe de running et commencez a courir ensemble !
            </Text>

            {/* Formulaire */}
            <CreateGroupForm />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </WarmBackground>
  );
}
