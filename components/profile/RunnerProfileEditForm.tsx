import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAuth } from "@/context/AuthContext";

import Ionicons from "@expo/vector-icons/Ionicons";
import { AvailabilitySelect } from "../runner-profile/AvailabilitySelect";
import { ObjectiveSelect } from "../runner-profile/ObjectiveSelect";
import { PaceDistanceInputs } from "../runner-profile/PaceDistanceInputs";

const ACCENT = "#F97316";

type RunnerProfileEditFormProps = {
  setIsEditing: (value: boolean) => void;
};

export function RunnerProfileEditForm({
  setIsEditing,
}: RunnerProfileEditFormProps) {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    actual_pace: user?.runner_profile?.actual_pace || "",
    usual_distance: user?.runner_profile?.usual_distance?.toString() || "",
    objective: user?.runner_profile?.objective || "",
    availability: user?.runner_profile?.availability || [],
  });

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await updateUser({
        ...user,
        runner_profile: {
          ...user?.runner_profile,
          ...formData,
        },
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Erreur mise à jour profil runner:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView className="space-y-4 bg-fond">
      <View className="px-6 space-y-6 mt-6">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-2xl font-nunito-extrabold text-gray-900">
            Modifier Profil Coureur
          </Text>
          <Pressable
            onPress={() => setIsEditing(false)}
            className="bg-tertiary p-3 rounded-full"
          >
            <Ionicons name="close" size={20} color={ACCENT} />
          </Pressable>
        </View>

        <View className="bg-white p-5 rounded-2xl border border-gray-200"
          style={{
            shadowColor: ACCENT,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <View className="flex-row items-center space-x-3 mb-4">
            <View className="w-10 h-10 rounded-xl bg-tertiary items-center justify-center">
              <Ionicons name="fitness-outline" size={20} color={ACCENT} />
            </View>
            <Text className="text-gray-900 text-base font-nunito-bold">
              Performance
            </Text>
          </View>
          <PaceDistanceInputs
            actual_pace={formData.actual_pace}
            usual_distance={formData.usual_distance}
            handleChange={handleChange}
          />
        </View>

        <View className="bg-white p-5 rounded-2xl border border-gray-200"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <View className="flex-row items-center space-x-3 mb-4">
            <View className="w-10 h-10 rounded-xl bg-tertiary items-center justify-center">
              <Ionicons name="trophy-outline" size={20} color={ACCENT} />
            </View>
            <Text className="text-gray-900 text-base font-nunito-bold">Objectif</Text>
          </View>
          <ObjectiveSelect handleChange={handleChange} />
        </View>

        <View className="bg-white p-5 rounded-2xl border border-gray-200"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <View className="flex-row items-center space-x-3 mb-4">
            <View className="w-10 h-10 rounded-xl bg-tertiary items-center justify-center">
              <Ionicons name="calendar-outline" size={20} color="#525252" />
            </View>
            <Text className="text-gray-900 text-base font-nunito-bold">
              Disponibilités
            </Text>
          </View>
          <AvailabilitySelect
            availability={formData.availability}
            handleChange={handleChange}
          />
        </View>

        <View className="space-y-3 mt-4">
          <Pressable
            className="bg-primary py-4 rounded-full items-center flex-row justify-center space-x-2"
            style={{
              shadowColor: ACCENT,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color="#ffffff"
                />
                <Text className="text-white font-nunito-bold">Enregistrer</Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
