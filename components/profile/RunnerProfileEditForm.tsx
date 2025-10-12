import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useAuth } from "@/context/AuthContext";

import Ionicons from "@expo/vector-icons/Ionicons";
import { AvailabilitySelect } from "../runner-profile/AvailabilitySelect";
import { ObjectiveSelect } from "../runner-profile/ObjectiveSelect";
import { PaceDistanceInputs } from "../runner-profile/PaceDistanceInputs";

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
    <ScrollView className="space-y-4">
      <View className="px-5 space-y-6 mt-6">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-2xl font-bold text-white">
            Modifier Profil Coureur
          </Text>
          <Pressable
            onPress={() => setIsEditing(false)}
            className="bg-background p-3 rounded-full"
          >
            <Ionicons name="close" size={20} color="#f0c2fe" />
          </Pressable>
        </View>

        <View className="bg-background p-5 rounded-2xl border border-[#2a3238]">
          <View className="flex-row items-center space-x-3 mb-4">
            <Ionicons name="fitness-outline" size={24} color="#f0c2fe" />
            <Text className="text-white text-base font-semibold">
              Performance
            </Text>
          </View>
          <PaceDistanceInputs
            actual_pace={formData.actual_pace}
            usual_distance={formData.usual_distance}
            handleChange={handleChange}
          />
        </View>

        <View className="bg-background p-5 rounded-2xl border border-[#2a3238]">
          <View className="flex-row items-center space-x-3 mb-4">
            <Ionicons name="trophy-outline" size={24} color="#f0c2fe" />
            <Text className="text-white text-base font-semibold">Objectif</Text>
          </View>
          <ObjectiveSelect handleChange={handleChange} />
        </View>

        <View className="bg-background p-5 rounded-2xl border border-[#2a3238]">
          <View className="flex-row items-center space-x-3 mb-4">
            <Ionicons name="calendar-outline" size={24} color="#f0c2fe" />
            <Text className="text-white text-base font-semibold">
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
            className="bg-purple py-4 rounded-full items-center flex-row justify-center space-x-2"
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
                <Text className="text-white font-semibold">Enregistrer</Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
