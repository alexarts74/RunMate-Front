import React, { useState } from "react";
import { ScrollView, Text } from "react-native";
import { router } from "expo-router";
import { PaceDistanceInputs } from "@/components/runner-profile/PaceDistanceInputs";
import { ObjectiveSelect } from "@/components/runner-profile/ObjectiveSelect";
import { AvailabilitySelect } from "@/components/runner-profile/AvailabilitySelect";
import { ActionButtons } from "@/components/runner-profile/ActionButtons";
import { runnerProfileService } from "@/service/api/runnerProfile";
import { matchesService } from "@/service/api/matching";
import { useMatches } from "@/context/MatchesContext";
import { View } from "react-native";
import { useAuth } from "@/context/AuthContext";

export default function RunnerProfileScreen() {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    actual_pace: "",
    usual_distance: "",
    availability: [] as string[],
    objective: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setMatches } = useMatches();

  const handleChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setError("");
      setLoading(true);

      // 1. Sauvegarder le profil
      const savedProfile = await runnerProfileService.save(formData);

      // 2. Mettre à jour le user avec le runner_profile
      const updatedUser = {
        ...user,
        runner_profile: {
          id: savedProfile.profile.id,
          actual_pace: savedProfile.profile.actual_pace,
          availability: savedProfile.profile.availability,
          objective: savedProfile.profile.objective,
          usual_distance: savedProfile.profile.usual_distance,
          user_id: savedProfile.profile.user_id,
          created_at: savedProfile.profile.created_at,
          updated_at: savedProfile.profile.updated_at,
        },
      };
      // console.log("Updated user avant updateUser:", updatedUser); // Debug

      await updateUser(updatedUser);

      // 3. Récupérer les matches
      const matchesData = await matchesService.getMatches();

      // 4. Stocker les matches dans le context
      setMatches(matchesData);

      // 6. Rediriger vers la homepage
      router.replace("/(tabs)/matches");
    } catch (err: any) {
      console.error("Erreur détaillée:", err);
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-[#12171b] px-5 py-6 pt-20">
      <Text className="text-2xl font-bold mb-6 text-center text-white">
        Votre profil de coureur
      </Text>

      <View className="flex-1 mt-8">
        <PaceDistanceInputs
          actual_pace={formData.actual_pace}
          usual_distance={formData.usual_distance}
          handleChange={handleChange}
        />
      </View>

      <View className="flex-1">
        <ObjectiveSelect handleChange={handleChange} />
      </View>

      <View className="flex-1 mt-6 mb-12">
        <AvailabilitySelect
          availability={formData.availability}
          handleChange={handleChange}
        />
      </View>

      {error ? (
        <Text className="text-red-500 text-center mb-4">{error}</Text>
      ) : null}

      <ActionButtons loading={loading} handleSubmit={handleSubmit} />
    </ScrollView>
  );
}
